import { type Message, type Client } from "discord.js";
import { askClaude } from "../services/claude.js";
import { searchFAQs } from "../services/faq-matcher.js";
import { checkRateLimit } from "../services/rate-limiter.js";
import { createCCKEmbed, Colors } from "../utils/embeds.js";
import { truncateText } from "../utils/format.js";
import { sanitizeInput, containsInjection } from "../utils/sanitize.js";
import { logger } from "../utils/logger.js";

export async function handleMessageCreate(message: Message, client: Client<true>): Promise<void> {
  if (message.author.bot) return;

  const isMentioned = message.mentions.has(client.user.id);
  const isDM = !message.guild;

  if (!isMentioned && !isDM) return;

  const rateType = "ask" as const;
  if (!checkRateLimit(message.author.id, rateType)) {
    await message.reply("```\n$ error: rate limit exceeded. Try again in ~60 seconds.\n```");
    return;
  }

  let question = message.content;
  // Strip the bot mention from the message
  if (isMentioned) {
    question = question.replace(new RegExp(`<@!?${client.user.id}>`), "").trim();
  }

  if (!question) {
    await message.reply("```\n$ usage: @CCK Bot <your question>\nTry asking about Claude, CCK events, or AI!\n```");
    return;
  }

  question = sanitizeInput(question);

  if (containsInjection(question)) {
    await message.reply("```\n$ error: invalid input detected\n```");
    return;
  }

  try {
    if ("sendTyping" in message.channel) {
      await message.channel.sendTyping();
    }

    const complexity = question.split(/\s+/).length <= 8 ? "simple" as const : "complex" as const;
    const result = await askClaude(question, complexity);
    const content = truncateText(result.content, 1900);

    const embed = createCCKEmbed({
      title: "Claude Response",
      description: content,
      color: Colors.GREEN,
    });

    const matchedFaq = await searchFAQs(question);
    if (matchedFaq) {
      embed.addFields({
        name: "Related FAQ",
        value: `**${matchedFaq.question}**\n${truncateText(matchedFaq.answer, 200)}`,
      });
    }

    embed.setFooter({ text: `CCK Bot • ${result.model}` });
    await message.reply({ embeds: [embed] });
  } catch (error: unknown) {
    logger.error("Error in message handler", {
      error: error instanceof Error ? error.message : String(error),
    });
    await message.reply("```\n$ error: something went wrong. Please try again later.\n```");
  }
}
