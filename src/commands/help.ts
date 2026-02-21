import { SlashCommandBuilder, type ChatInputCommandInteraction } from "discord.js";
import { createCCKEmbed, Colors } from "../utils/embeds.js";
import { URLS } from "../data/constants.js";
import type { Command } from "./index.js";

export const helpCommand: Command = {
  data: new SlashCommandBuilder()
    .setName("help")
    .setDescription("See all available commands"),

  async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    const embed = createCCKEmbed({
      title: "CCK Bot Commands",
      description: [
        "```",
        "$ help --list-commands",
        "```",
        "",
        "**Core**",
        "`/ask <question>` — Ask Claude anything about CCK or AI",
        "`/faq list|search` — Browse or search FAQs",
        "",
        "**Community**",
        "`/events upcoming|past|next` — View CCK events",
        "`/resources list|search` — Browse learning resources",
        "`/about [topic]` — Learn about CCK",
        "",
        "**Info**",
        "`/claude models|code|start|tips` — Claude info & guides",
        "`/links [type]` — Quick links to CCK platforms",
        "`/help` — This command",
        "",
        "**Example:**",
        "```",
        "$ /ask How do I get started with Claude Code?",
        "```",
      ].join("\n"),
      color: Colors.GREEN,
      fields: [
        {
          name: "Tip",
          value: `You can also @ mention me to ask questions!\n[Visit our website](${URLS.website})`,
        },
      ],
    });

    await interaction.reply({ embeds: [embed] });
  },
};
