import { SlashCommandBuilder, type ChatInputCommandInteraction } from "discord.js";
import { askClaude } from "../services/claude.js";
import { searchFAQs } from "../services/faq-matcher.js";
import { checkRateLimit, getRemainingUses } from "../services/rate-limiter.js";
import { createCCKEmbed, Colors } from "../utils/embeds.js";
import { truncateText } from "../utils/format.js";
import { detectComplexity } from "../utils/complexity.js";
import { sanitizeInput, containsInjection } from "../utils/sanitize.js";
import { logger } from "../utils/logger.js";
import { BOT } from "../data/constants.js";
import type { Command } from "./index.js";

export const askCommand: Command = {
  data: new SlashCommandBuilder()
    .setName("ask")
    .setDescription("Ask Claude anything about CCK or AI")
    .addStringOption((option) =>
      option.setName("question").setDescription("Your question").setRequired(true)
    ) as SlashCommandBuilder,

  async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    const rawQuestion = interaction.options.getString("question", true);
    const question = sanitizeInput(rawQuestion);

    if (containsInjection(question)) {
      await interaction.reply({ content: "```\n$ error: invalid input detected\n```", ephemeral: true });
      return;
    }

    if (!checkRateLimit(interaction.user.id, "ask")) {
      const remaining = getRemainingUses(interaction.user.id, "ask");
      await interaction.reply({
        content: `\`\`\`\n$ error: rate limit exceeded (${remaining} uses remaining)\nTry again in ~60 seconds.\n\`\`\``,
        ephemeral: true,
      });
      return;
    }

    await interaction.deferReply();

    try {
      // Search FAQ first (cheaper) — skip full Claude call if a direct match exists
      const matchedFaq = await searchFAQs(question);

      if (matchedFaq) {
        const embed = createCCKEmbed({
          title: "Claude Response",
          description: matchedFaq.answer,
          color: Colors.GREEN,
        });
        embed.addFields({
          name: "📋 Matched FAQ",
          value: `**${matchedFaq.question}**`,
        });
        embed.setFooter({ text: `CCK Bot • FAQ match • /faq for more` });
        await interaction.editReply({ embeds: [embed] });
        return;
      }

      const complexity = detectComplexity(question);
      const result = await askClaude(question, complexity);
      const content = truncateText(result.content, BOT.MAX_RESPONSE_LENGTH);

      const embed = createCCKEmbed({
        title: "Claude Response",
        description: content,
        color: Colors.GREEN,
      });

      embed.setFooter({ text: `CCK Bot • ${result.model} • /faq for more` });
      await interaction.editReply({ embeds: [embed] });
    } catch (error: unknown) {
      logger.error("Error in /ask command", {
        error: error instanceof Error ? error.message : String(error),
      });
      await interaction.editReply({
        content: "```\n$ error: something went wrong. Please try again later.\n```",
      });
    }
  },
};
