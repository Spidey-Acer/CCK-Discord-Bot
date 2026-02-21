import {
  Collection,
  type ChatInputCommandInteraction,
  type SlashCommandBuilder,
  type SlashCommandSubcommandsOnlyBuilder,
  type AutocompleteInteraction,
} from "discord.js";

export interface Command {
  data: SlashCommandBuilder | SlashCommandSubcommandsOnlyBuilder;
  execute: (interaction: ChatInputCommandInteraction) => Promise<void>;
  autocomplete?: (interaction: AutocompleteInteraction) => Promise<void>;
}

export const commands = new Collection<string, Command>();

// Import and register all commands
import { askCommand } from "./ask.js";
import { faqCommand } from "./faq.js";
import { eventsCommand } from "./events.js";
import { resourcesCommand } from "./resources.js";
import { aboutCommand } from "./about.js";
import { helpCommand } from "./help.js";
import { linksCommand } from "./links.js";
import { claudeCommand } from "./claude.js";

const allCommands: Command[] = [
  askCommand,
  faqCommand,
  eventsCommand,
  resourcesCommand,
  aboutCommand,
  helpCommand,
  linksCommand,
  claudeCommand,
];

for (const cmd of allCommands) {
  commands.set(cmd.data.name, cmd);
}
