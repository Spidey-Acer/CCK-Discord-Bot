import {
  SlashCommandBuilder,
  type ChatInputCommandInteraction,
  type AutocompleteInteraction,
} from "discord.js";
import { team } from "../data/team.js";
import { URLS } from "../data/constants.js";
import { createCCKEmbed, Colors } from "../utils/embeds.js";
import type { Command } from "./index.js";

const TOPICS = ["community", "team", "mission", "links"] as const;

export const aboutCommand: Command = {
  data: new SlashCommandBuilder()
    .setName("about")
    .setDescription("Learn about Claude Community Kenya")
    .addStringOption((opt) =>
      opt
        .setName("topic")
        .setDescription("What to learn about")
        .setAutocomplete(true)
    ) as SlashCommandBuilder,

  async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    const topic = interaction.options.getString("topic") ?? "community";

    switch (topic) {
      case "team": {
        const embed = createCCKEmbed({
          title: "CCK Team",
          description: "The people behind Claude Community Kenya:",
          color: Colors.GREEN,
          fields: team.map((member) => ({
            name: member.name,
            value: [
              member.role,
              member.social?.twitter ? `Twitter: ${member.social.twitter}` : "",
              member.social?.linkedin ? `LinkedIn: ${member.social.linkedin}` : "",
              member.social?.github ? `GitHub: ${member.social.github}` : "",
            ]
              .filter(Boolean)
              .join("\n"),
            inline: true,
          })),
        });
        await interaction.reply({ embeds: [embed] });
        break;
      }

      case "mission": {
        const embed = createCCKEmbed({
          title: "Our Mission",
          description: [
            "**Mission:** Empower Kenyan developers and tech enthusiasts to build with Claude AI through community learning, events, and collaboration.",
            "",
            "**Vision:** A thriving AI developer ecosystem in Kenya where everyone has access to cutting-edge AI tools and knowledge.",
            "",
            "**Values:**",
            "• **Community First** — We grow together through shared knowledge",
            "• **Accessibility** — AI education should be available to all",
            "• **Innovation** — Pushing boundaries with responsible AI",
            "• **Collaboration** — Building bridges between devs, researchers, and industry",
          ].join("\n"),
          color: Colors.GREEN,
        });
        await interaction.reply({ embeds: [embed] });
        break;
      }

      case "links": {
        const embed = createCCKEmbed({
          title: "CCK Links",
          description: [
            `🌐 [Website](${URLS.website})`,
            `💬 [Discord](${URLS.discord})`,
            `🐦 [Twitter / X](${URLS.twitter})`,
            `💼 [LinkedIn](${URLS.linkedin})`,
            `🐙 [GitHub](${URLS.github})`,
            `📸 [Instagram](${URLS.instagram})`,
            `📘 [Facebook](${URLS.facebook})`,
            `📧 ${URLS.email}`,
          ].join("\n"),
          color: Colors.CYAN,
        });
        await interaction.reply({ embeds: [embed] });
        break;
      }

      default: {
        const embed = createCCKEmbed({
          title: "Claude Community Kenya",
          description: [
            "The **first Claude community in Africa** — connecting developers, students, and AI enthusiasts across Kenya.",
            "",
            "We organize meetups, workshops, and hackathons to help the Kenyan tech community build with Claude AI.",
          ].join("\n"),
          color: Colors.GREEN,
          fields: [
            { name: "Founded", value: "January 2026", inline: true },
            { name: "Members", value: "50+", inline: true },
            { name: "Chapters", value: "Nairobi & Mombasa", inline: true },
            { name: "Website", value: `[claudecommunitykenya.com](${URLS.website})`, inline: true },
            { name: "Discord", value: `[Join us](${URLS.discord})`, inline: true },
          ],
        });
        await interaction.reply({ embeds: [embed] });
        break;
      }
    }
  },

  async autocomplete(interaction: AutocompleteInteraction): Promise<void> {
    const focused = interaction.options.getFocused(true);
    if (focused.name === "topic") {
      const filtered = TOPICS.filter((t) =>
        t.startsWith(focused.value.toLowerCase())
      );
      await interaction.respond(
        filtered.map((t) => ({ name: t, value: t }))
      );
    }
  },
};
