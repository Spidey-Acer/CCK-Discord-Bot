import {
  SlashCommandBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  type ChatInputCommandInteraction,
} from "discord.js";
import { getUpcomingEvents, getPastEvents, getNextEvent, getDaysUntilEvent } from "../services/event-tracker.js";
import { createCCKEmbed, Colors } from "../utils/embeds.js";
import { formatDate, formatRelativeDate } from "../utils/format.js";
import type { Command } from "./index.js";

function statusBadge(status: string): string {
  switch (status) {
    case "registration-open":
      return "🟢 Registration Open";
    case "upcoming":
      return "🟡 Upcoming";
    case "completed":
      return "✅ Completed";
    default:
      return status;
  }
}

function statusColor(status: string): number {
  switch (status) {
    case "registration-open":
      return Colors.GREEN;
    case "upcoming":
      return Colors.AMBER;
    default:
      return Colors.DIM;
  }
}

export const eventsCommand: Command = {
  data: new SlashCommandBuilder()
    .setName("events")
    .setDescription("View CCK events")
    .addSubcommand((sub) =>
      sub.setName("upcoming").setDescription("See upcoming events")
    )
    .addSubcommand((sub) =>
      sub.setName("past").setDescription("See past events with highlights")
    )
    .addSubcommand((sub) =>
      sub.setName("next").setDescription("Get details about the next event")
    ),

  async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    const subcommand = interaction.options.getSubcommand();

    if (subcommand === "upcoming") {
      const upcoming = getUpcomingEvents();

      if (upcoming.length === 0) {
        await interaction.reply({
          content: "```\n$ no upcoming events scheduled.\nCheck back soon!\n```",
        });
        return;
      }

      const embed = createCCKEmbed({
        title: "Upcoming Events",
        description: "Here's what's coming up:",
        color: Colors.GREEN,
        fields: upcoming.map((event) => ({
          name: `${statusBadge(event.status)} ${event.title}`,
          value: [
            `📅 ${formatDate(event.date)} (${formatRelativeDate(event.date)})`,
            `⏰ ${event.time}`,
            `📍 ${event.venue}, ${event.city}`,
          ].join("\n"),
        })),
      });

      const components: ActionRowBuilder<ButtonBuilder>[] = [];
      const buttons = upcoming
        .filter((e) => e.registrationUrl)
        .map((e) =>
          new ButtonBuilder()
            .setLabel(`Register: ${e.title.slice(0, 40)}`)
            .setStyle(ButtonStyle.Link)
            .setURL(e.registrationUrl!)
        );

      if (buttons.length > 0) {
        components.push(new ActionRowBuilder<ButtonBuilder>().addComponents(buttons));
      }

      await interaction.reply({ embeds: [embed], components });
    }

    if (subcommand === "past") {
      const past = getPastEvents();

      if (past.length === 0) {
        await interaction.reply({
          content: "```\n$ no past events recorded yet.\n```",
        });
        return;
      }

      const embed = createCCKEmbed({
        title: "Past Events",
        description: "Events we've hosted:",
        color: Colors.DIM,
        fields: past.map((event) => ({
          name: `✅ ${event.title}`,
          value: [
            `📅 ${formatDate(event.date)}`,
            `📍 ${event.venue}, ${event.city}`,
            event.attendees ? `👥 ${event.attendees} attendees` : "",
            event.highlights ? `✨ ${event.highlights.join(", ")}` : "",
          ]
            .filter(Boolean)
            .join("\n"),
        })),
      });

      await interaction.reply({ embeds: [embed] });
    }

    if (subcommand === "next") {
      const next = getNextEvent();

      if (!next) {
        await interaction.reply({
          content: "```\n$ no upcoming events found.\nCheck back soon!\n```",
        });
        return;
      }

      const daysUntil = getDaysUntilEvent(next);
      const embed = createCCKEmbed({
        title: next.title,
        description: [
          `**${statusBadge(next.status)}**`,
          "",
          `📅 ${formatDate(next.date)} (${formatRelativeDate(next.date)})`,
          `⏰ ${next.time}`,
          `📍 ${next.venue}, ${next.city}`,
          "",
          daysUntil > 0 ? `⏳ **${daysUntil} day${daysUntil === 1 ? "" : "s"} away**` : "🎉 **Happening today!**",
        ].join("\n"),
        color: statusColor(next.status),
      });

      if (next.agenda && next.agenda.length > 0) {
        embed.addFields({
          name: "📋 Agenda",
          value: next.agenda.map((item) => `• ${item}`).join("\n"),
        });
      }

      const components: ActionRowBuilder<ButtonBuilder>[] = [];
      if (next.registrationUrl) {
        components.push(
          new ActionRowBuilder<ButtonBuilder>().addComponents(
            new ButtonBuilder()
              .setLabel("Register Now")
              .setStyle(ButtonStyle.Link)
              .setURL(next.registrationUrl)
          )
        );
      }

      await interaction.reply({ embeds: [embed], components });
    }
  },
};
