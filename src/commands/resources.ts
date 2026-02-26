import {
  SlashCommandBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ComponentType,
  type ChatInputCommandInteraction,
  type AutocompleteInteraction,
} from "discord.js";
import { resources } from "../data/resources.js";
import { createCCKEmbed, Colors } from "../utils/embeds.js";
import { sanitizeInput } from "../utils/sanitize.js";
import { BOT } from "../data/constants.js";
import type { Command } from "./index.js";

function getCategories(): string[] {
  return [...new Set(resources.map((r) => r.category))];
}

export const resourcesCommand: Command = {
  data: new SlashCommandBuilder()
    .setName("resources")
    .setDescription("Browse learning resources")
    .addSubcommand((sub) =>
      sub
        .setName("list")
        .setDescription("List resources by category")
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
        .setDescription("Search resources")
        .addStringOption((opt) =>
          opt.setName("query").setDescription("Search query").setRequired(true)
        )
    ),

  async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    const subcommand = interaction.options.getSubcommand();

    if (subcommand === "list") {
      const category = interaction.options.getString("category") ?? undefined;
      const filtered = category
        ? resources.filter((r) => r.category === category)
        : resources;

      if (filtered.length === 0) {
        await interaction.reply({
          content: "```\n$ no resources found for that category\n```",
          ephemeral: true,
        });
        return;
      }

      const page = 0;
      const totalPages = Math.ceil(filtered.length / BOT.ITEMS_PER_PAGE);
      const title = category ? `Resources — ${category}` : "All Resources";

      const buildEmbed = (p: number) => {
        const start = p * BOT.ITEMS_PER_PAGE;
        const pageItems = filtered.slice(start, start + BOT.ITEMS_PER_PAGE);
        return createCCKEmbed({
          title,
          description: pageItems
            .map((r) => `**[${r.title}](${r.url})**\n${r.description}`)
            .join("\n\n"),
          color: Colors.CYAN,
          footer: totalPages > 1 ? `Page ${p + 1}/${totalPages}` : undefined,
        });
      };

      const buildRow = (p: number) =>
        new ActionRowBuilder<ButtonBuilder>().addComponents(
          new ButtonBuilder()
            .setCustomId(`res_prev_${p}`)
            .setLabel("Previous")
            .setStyle(ButtonStyle.Secondary)
            .setDisabled(p === 0),
          new ButtonBuilder()
            .setCustomId(`res_next_${p}`)
            .setLabel("Next")
            .setStyle(ButtonStyle.Secondary)
            .setDisabled(p >= totalPages - 1)
        );

      const components = totalPages > 1 ? [buildRow(page)] : [];
      const reply = await interaction.reply({
        embeds: [buildEmbed(page)],
        components,
        fetchReply: true,
      });

      if (totalPages <= 1) return;

      const collector = reply.createMessageComponentCollector({
        componentType: ComponentType.Button,
        time: BOT.PAGINATION_TIMEOUT_MS,
      });

      collector.on("collect", async (btn) => {
        if (btn.user.id !== interaction.user.id) {
          await btn.reply({ content: "These buttons aren't for you.", ephemeral: true });
          return;
        }
        const [, direction, pageStr] = btn.customId.split("_");
        const current = parseInt(pageStr, 10);
        const newPage = direction === "next" ? current + 1 : current - 1;
        await btn.update({
          embeds: [buildEmbed(newPage)],
          components: [buildRow(newPage)],
        });
      });
    }

    if (subcommand === "search") {
      const rawQuery = interaction.options.getString("query", true);
      const query = sanitizeInput(rawQuery).toLowerCase();

      const results = resources.filter(
        (r) =>
          r.title.toLowerCase().includes(query) ||
          r.description.toLowerCase().includes(query)
      );

      if (results.length === 0) {
        await interaction.reply({
          content: `\`\`\`\n$ no resources found matching "${query}"\n\`\`\``,
          ephemeral: true,
        });
        return;
      }

      const embed = createCCKEmbed({
        title: `Resources — "${query}"`,
        description: results
          .slice(0, 10)
          .map((r) => `**[${r.title}](${r.url})**\n${r.description}`)
          .join("\n\n"),
        color: Colors.CYAN,
        footer: results.length > 10 ? `Showing 10 of ${results.length} results` : undefined,
      });

      await interaction.reply({ embeds: [embed] });
    }
  },

  async autocomplete(interaction: AutocompleteInteraction): Promise<void> {
    const focused = interaction.options.getFocused(true);
    if (focused.name === "category") {
      const categories = getCategories();
      const filtered = categories.filter((c) =>
        c.toLowerCase().startsWith(focused.value.toLowerCase())
      );
      await interaction.respond(
        filtered.slice(0, 25).map((c) => ({ name: c, value: c }))
      );
    }
  },
};
