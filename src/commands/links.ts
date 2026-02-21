import {
  SlashCommandBuilder,
  type ChatInputCommandInteraction,
  type AutocompleteInteraction,
} from "discord.js";
import { URLS } from "../data/constants.js";
import { createCCKEmbed, Colors } from "../utils/embeds.js";
import type { Command } from "./index.js";

const LINK_MAP: Record<string, { label: string; url: string }> = {
  discord: { label: "Discord Server", url: URLS.discord },
  twitter: { label: "Twitter / X", url: URLS.twitter },
  github: { label: "GitHub", url: URLS.github },
  luma: { label: "Luma (Nairobi)", url: URLS.lumaNairobi },
  website: { label: "Website", url: URLS.website },
  docs: { label: "Anthropic Docs", url: URLS.anthropicDocs },
  claude: { label: "Claude AI", url: URLS.claudeAi },
};

const LINK_TYPES = Object.keys(LINK_MAP);

export const linksCommand: Command = {
  data: new SlashCommandBuilder()
    .setName("links")
    .setDescription("Quick links to CCK platforms")
    .addStringOption((opt) =>
      opt
        .setName("type")
        .setDescription("Specific link to show")
        .setAutocomplete(true)
    ) as SlashCommandBuilder,

  async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    const type = interaction.options.getString("type");

    if (type && LINK_MAP[type]) {
      const link = LINK_MAP[type];
      const embed = createCCKEmbed({
        title: link.label,
        description: `🔗 **${link.url}**`,
        color: Colors.CYAN,
      });
      await interaction.reply({ embeds: [embed] });
      return;
    }

    const embed = createCCKEmbed({
      title: "CCK Links",
      description: Object.entries(LINK_MAP)
        .map(([, v]) => `**${v.label}:** ${v.url}`)
        .join("\n"),
      color: Colors.CYAN,
    });

    await interaction.reply({ embeds: [embed] });
  },

  async autocomplete(interaction: AutocompleteInteraction): Promise<void> {
    const focused = interaction.options.getFocused(true);
    if (focused.name === "type") {
      const filtered = LINK_TYPES.filter((t) =>
        t.startsWith(focused.value.toLowerCase())
      );
      await interaction.respond(
        filtered.map((t) => ({ name: LINK_MAP[t].label, value: t }))
      );
    }
  },
};
