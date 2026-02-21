import cron from "node-cron";
import {
  type Client,
  type TextChannel,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} from "discord.js";
import { config } from "../config.js";
import { getUpcomingEvents, getDaysUntilEvent } from "./event-tracker.js";
import { createCCKEmbed, Colors } from "../utils/embeds.js";
import { formatDate } from "../utils/format.js";
import { logger } from "../utils/logger.js";

function getAnnouncementsChannel(client: Client<true>): TextChannel | undefined {
  const channelId = config.channels.announcementsId;
  if (!channelId) return undefined;

  for (const guild of client.guilds.cache.values()) {
    const channel = guild.channels.cache.get(channelId);
    if (channel?.isTextBased()) return channel as TextChannel;
  }
  return undefined;
}

async function checkEventReminders(client: Client<true>): Promise<void> {
  const channel = getAnnouncementsChannel(client);
  if (!channel) return;

  const upcoming = getUpcomingEvents();

  for (const event of upcoming) {
    const daysUntil = getDaysUntilEvent(event);

    let embed;
    if (daysUntil === 7) {
      embed = createCCKEmbed({
        title: `Reminder: ${event.title}`,
        description: [
          `**One week away!**`,
          "",
          `📅 ${formatDate(event.date)}`,
          `⏰ ${event.time}`,
          `📍 ${event.venue}, ${event.city}`,
        ].join("\n"),
        color: Colors.AMBER,
      });
    } else if (daysUntil === 1) {
      embed = createCCKEmbed({
        title: `Tomorrow: ${event.title}`,
        description: [
          `**Happening tomorrow!**`,
          "",
          `📅 ${formatDate(event.date)}`,
          `⏰ ${event.time}`,
          `📍 ${event.venue}, ${event.city}`,
        ].join("\n"),
        color: Colors.AMBER,
      });
    } else if (daysUntil === 0) {
      embed = createCCKEmbed({
        title: `TODAY: ${event.title}`,
        description: [
          `**Happening today!**`,
          "",
          `⏰ ${event.time}`,
          `📍 ${event.venue}, ${event.city}`,
        ].join("\n"),
        color: Colors.GREEN,
      });
    }

    if (!embed) continue;

    const components: ActionRowBuilder<ButtonBuilder>[] = [];
    if (event.registrationUrl) {
      components.push(
        new ActionRowBuilder<ButtonBuilder>().addComponents(
          new ButtonBuilder()
            .setLabel("Register Now")
            .setStyle(ButtonStyle.Link)
            .setURL(event.registrationUrl)
        )
      );
    }

    try {
      await channel.send({ embeds: [embed], components });
      logger.info("Sent event reminder", { event: event.title, daysUntil });
    } catch (error: unknown) {
      logger.error("Failed to send reminder", {
        event: event.title,
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }
}

export function startReminders(client: Client<true>): void {
  // Run daily at 9:00 AM EAT (6:00 UTC)
  cron.schedule("0 6 * * *", () => {
    checkEventReminders(client).catch((error: unknown) => {
      logger.error("Reminder check failed", {
        error: error instanceof Error ? error.message : String(error),
      });
    });
  });

  logger.info("Event reminders scheduled (daily at 9:00 AM EAT)");
}
