import { REST, Routes, type RESTPostAPIChatInputApplicationCommandsJSONBody } from "discord.js";
import { config } from "./config.js";
import { logger } from "./utils/logger.js";

export async function deployCommands(
  commands: RESTPostAPIChatInputApplicationCommandsJSONBody[]
): Promise<void> {
  const rest = new REST({ version: "10" }).setToken(config.discord.token);

  try {
    logger.info(`Deploying ${commands.length} slash commands...`);

    await rest.put(
      Routes.applicationGuildCommands(config.discord.clientId, config.discord.guildId),
      { body: commands }
    );

    logger.info("Commands deployed successfully.");
  } catch (error: unknown) {
    logger.error("Failed to deploy commands", {
      error: error instanceof Error ? error.message : String(error),
    });
    throw error;
  }
}

// Window 2 will import and call deployCommands() with actual command definitions.
// When run directly, deploy an empty command set (useful for clearing commands).
const isDirectRun = process.argv[1]?.includes("deploy-commands");
if (isDirectRun) {
  deployCommands([]).catch(() => process.exit(1));
}
