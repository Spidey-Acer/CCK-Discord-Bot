import { type Interaction } from "discord.js";
import { commands } from "../commands/index.js";
import { logger } from "../utils/logger.js";

export async function handleInteractionCreate(interaction: Interaction): Promise<void> {
  if (interaction.isChatInputCommand()) {
    const command = commands.get(interaction.commandName);
    if (!command) {
      logger.warn("Unknown command", { name: interaction.commandName });
      return;
    }

    try {
      await command.execute(interaction);
    } catch (error: unknown) {
      logger.error("Command execution failed", {
        command: interaction.commandName,
        error: error instanceof Error ? error.message : String(error),
      });

      const content = "```\n$ error: something went wrong. Please try again.\n```";
      if (interaction.deferred || interaction.replied) {
        await interaction.editReply({ content }).catch(() => {});
      } else {
        await interaction.reply({ content, ephemeral: true }).catch(() => {});
      }
    }
    return;
  }

  if (interaction.isAutocomplete()) {
    const command = commands.get(interaction.commandName);
    if (command?.autocomplete) {
      try {
        await command.autocomplete(interaction);
      } catch (error: unknown) {
        logger.error("Autocomplete failed", {
          command: interaction.commandName,
          error: error instanceof Error ? error.message : String(error),
        });
      }
    }
    return;
  }
}
