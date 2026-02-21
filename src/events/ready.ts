import { ActivityType, type Client } from "discord.js";
import { logger } from "../utils/logger.js";

export function handleReady(client: Client<true>): void {
  logger.info(`Bot online as ${client.user.tag}`, {
    guilds: client.guilds.cache.size,
  });

  client.user.setActivity("Claude Community Kenya | /help", {
    type: ActivityType.Watching,
  });
}
