import { Client, GatewayIntentBits, Partials } from "discord.js";
import { config } from "./config.js";
import { logger } from "./utils/logger.js";
import { handleReady } from "./events/ready.js";
import { handleInteractionCreate } from "./events/interactionCreate.js";
import { handleMessageCreate } from "./events/messageCreate.js";
import { handleGuildMemberAdd } from "./events/guildMemberAdd.js";
import { startReminders } from "./services/reminders.js";

export const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.DirectMessages,
  ],
  partials: [Partials.Channel], // Required for DMs
});

// Event handlers
client.once("ready", (c) => {
  handleReady(c);
  startReminders(c);
});

client.on("interactionCreate", (interaction) => {
  handleInteractionCreate(interaction).catch((error: unknown) => {
    logger.error("Unhandled interaction error", {
      error: error instanceof Error ? error.message : String(error),
    });
  });
});

client.on("messageCreate", (message) => {
  handleMessageCreate(message, client as Client<true>).catch((error: unknown) => {
    logger.error("Unhandled message error", {
      error: error instanceof Error ? error.message : String(error),
    });
  });
});

client.on("guildMemberAdd", (member) => {
  handleGuildMemberAdd(member).catch((error: unknown) => {
    logger.error("Unhandled guildMemberAdd error", {
      error: error instanceof Error ? error.message : String(error),
    });
  });
});

client.login(config.discord.token).catch((error: unknown) => {
  logger.error("Failed to login", {
    error: error instanceof Error ? error.message : String(error),
  });
  process.exit(1);
});
