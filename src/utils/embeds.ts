import { EmbedBuilder } from "discord.js";

export const Colors = {
  GREEN: 0x00ff41,
  AMBER: 0xffb000,
  CYAN: 0x00d4ff,
  RED: 0xff3333,
  DIM: 0x0a3d1a,
} as const;

interface CCKEmbedOptions {
  title: string;
  description: string;
  color?: number;
  fields?: Array<{ name: string; value: string; inline?: boolean }>;
  footer?: string;
}

export function createCCKEmbed(options: CCKEmbedOptions): EmbedBuilder {
  const embed = new EmbedBuilder()
    .setTitle(`> ${options.title}`)
    .setDescription(options.description)
    .setColor(options.color ?? Colors.GREEN)
    .setFooter({ text: options.footer ?? "CCK Bot • Claude Community Kenya" })
    .setTimestamp();

  if (options.fields) {
    for (const field of options.fields) {
      embed.addFields({
        name: field.name,
        value: field.value,
        inline: field.inline ?? false,
      });
    }
  }

  return embed;
}
