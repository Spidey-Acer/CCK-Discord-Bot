import {
  SlashCommandBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  type ChatInputCommandInteraction,
  type AutocompleteInteraction,
  ComponentType,
} from "discord.js";
import { listFAQs, searchFAQs } from "../services/faq-matcher.js";
import { createCCKEmbed, Colors } from "../utils/embeds.js";
import { sanitizeInput } from "../utils/sanitize.js";
import { logger } from "../utils/logger.js";
import type { FAQ } from "../types/index.js";
import type { Command } from "./index.js";

const FAQ_CATEGORIES = ["general", "events", "technical"] as const;
const ITEMS_PER_PAGE = 5;

function buildFaqEmbed(faqList: FAQ[], page: number, title: string) {
  const totalPages = Math.ceil(faqList.length / ITEMS_PER_PAGE);
  const start = page * ITEMS_PER_PAGE;
  const pageFaqs = faqList.slice(start, start + ITEMS_PER_PAGE);

  const embed = createCCKEmbed({
    title,
    description: pageFaqs
      .map((faq) => `**Q: ${faq.question}**\n${faq.answer}`)
      .join("\n\n"),
    color: Colors.GREEN,
    footer: totalPages > 1 ? `Page ${page + 1}/${totalPages}` : undefined,
  });

  return { embed, totalPages };
}

function buildPaginationRow(page: number, totalPages: number, prefix: string) {
  return new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder()
      .setCustomId(`${prefix}_prev_${page}`)
      .setLabel("Previous")
      .setStyle(ButtonStyle.Secondary)
      .setDisabled(page === 0),
    new ButtonBuilder()
      .setCustomId(`${prefix}_next_${page}`)
      .setLabel("Next")
      .setStyle(ButtonStyle.Secondary)
      .setDisabled(page >= totalPages - 1)
  );
}

export const faqCommand: Command = {
  data: new SlashCommandBuilder()
    .setName("faq")
    .setDescription("Browse frequently asked questions")
    .addSubcommand((sub) =>
      sub
        .setName("list")
        .setDescription("List FAQs by category")
        .addStringOption((opt) =>
          opt
            .setName("category")
            .setDescription("Filter by category")
            .setAutocomplete(true)
        )
    )
    .addSubcommand((sub) =>
      sub
        .setName("search")
        .setDescription("Search FAQs")
        .addStringOption((opt) =>
          opt.setName("query").setDescription("Search query").setRequired(true)
        )
    ),

  async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    const subcommand = interaction.options.getSubcommand();

    if (subcommand === "list") {
      const category = interaction.options.getString("category") ?? undefined;
      const faqList = listFAQs(category);

      if (faqList.length === 0) {
        await interaction.reply({
          content: "```\n$ no FAQs found for that category\n```",
          ephemeral: true,
        });
        return;
      }

      const page = 0;
      const title = category ? `FAQs — ${category}` : "All FAQs";
      const { embed, totalPages } = buildFaqEmbed(faqList, page, title);

      const components =
        totalPages > 1 ? [buildPaginationRow(page, totalPages, "faq")] : [];

      const reply = await interaction.reply({
        embeds: [embed],
        components,
        fetchReply: true,
      });

      if (totalPages <= 1) return;

      const collector = reply.createMessageComponentCollector({
        componentType: ComponentType.Button,
        time: 15 * 60_000,
      });

      collector.on("collect", async (btn) => {
        if (btn.user.id !== interaction.user.id) {
          await btn.reply({ content: "These buttons aren't for you.", ephemeral: true });
          return;
        }

        const [, direction, pageStr] = btn.customId.split("_");
        const currentPage = parseInt(pageStr, 10);
        const newPage = direction === "next" ? currentPage + 1 : currentPage - 1;

        const { embed: newEmbed, totalPages: tp } = buildFaqEmbed(faqList, newPage, title);
        await btn.update({
          embeds: [newEmbed],
          components: [buildPaginationRow(newPage, tp, "faq")],
        });
      });
    }

    if (subcommand === "search") {
      const rawQuery = interaction.options.getString("query", true);
      const query = sanitizeInput(rawQuery);

      await interaction.deferReply();

      try {
        const result = await searchFAQs(query);
        if (!result) {
          await interaction.editReply({
            content: `\`\`\`\n$ no matching FAQ found for "${query}"\nTry /ask for a custom answer.\n\`\`\``,
          });
          return;
        }

        const embed = createCCKEmbed({
          title: `FAQ — ${result.category}`,
          description: `**Q: ${result.question}**\n\n${result.answer}`,
          color: Colors.GREEN,
        });

        await interaction.editReply({ embeds: [embed] });
      } catch (error: unknown) {
        logger.error("Error in /faq search", {
          error: error instanceof Error ? error.message : String(error),
        });
        await interaction.editReply({
          content: "```\n$ error: search failed. Please try again.\n```",
        });
      }
    }
  },

  async autocomplete(interaction: AutocompleteInteraction): Promise<void> {
    const focused = interaction.options.getFocused(true);
    if (focused.name === "category") {
      const filtered = FAQ_CATEGORIES.filter((c) =>
        c.startsWith(focused.value.toLowerCase())
      );
      await interaction.respond(
        filtered.map((c) => ({ name: c, value: c }))
      );
    }
  },
};
