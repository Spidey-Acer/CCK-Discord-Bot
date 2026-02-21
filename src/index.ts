import { Client, GatewayIntentBits } from "discord.js";
import { config } from "./config.js";
import { logger } from "./utils/logger.js";

export const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.DirectMessages,
  ],
});

client.once("ready", (c) => {
  logger.info(`Bot online as ${c.user.tag}`, {
    guilds: c.guilds.cache.size,
  });
});

client.login(config.discord.token).catch((error: unknown) => {
  logger.error("Failed to login", {
    error: error instanceof Error ? error.message : String(error),
  });
  process.exit(1);
});
