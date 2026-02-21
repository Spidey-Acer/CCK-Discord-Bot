import { type GuildMember, type TextChannel } from "discord.js";
import { config } from "../config.js";
import { getUpcomingEvents } from "../services/event-tracker.js";
import { createCCKEmbed, Colors } from "../utils/embeds.js";
import { formatDate, formatRelativeDate } from "../utils/format.js";
import { logger } from "../utils/logger.js";

export async function handleGuildMemberAdd(member: GuildMember): Promise<void> {
  const channelId = config.channels.welcomeId;
  if (!channelId) {
    logger.warn("Welcome channel not configured — skipping welcome message");
    return;
  }

  const channel = member.guild.channels.cache.get(channelId) as TextChannel | undefined;
  if (!channel) {
    logger.warn("Welcome channel not found", { channelId });
    return;
  }

  const upcoming = getUpcomingEvents().slice(0, 3);
  const eventFields = upcoming.map((event) => ({
    name: `${event.title}`,
    value: `📅 ${formatDate(event.date)} (${formatRelativeDate(event.date)})\n📍 ${event.venue}, ${event.city}`,
    inline: true,
  }));

  const embed = createCCKEmbed({
    title: `Welcome, ${member.user.username}!`,
    description: [
      "```",
      `$ ssh ${member.user.username}@cck-server`,
      "Connection established.",
      "Welcome to Claude Community Kenya!",
      "",
      "> Type /help to see what I can do",
      "> Type /events upcoming to see what's next",
      "> Type /ask to chat with me about anything Claude",
      "```",
    ].join("\n"),
    color: Colors.GREEN,
    fields: eventFields.length > 0 ? eventFields : undefined,
  });

  try {
    await channel.send({
      content: `Welcome ${member}!`,
      embeds: [embed],
    });
  } catch (error: unknown) {
    logger.error("Failed to send welcome message", {
      error: error instanceof Error ? error.message : String(error),
      memberId: member.id,
    });
  }
}
