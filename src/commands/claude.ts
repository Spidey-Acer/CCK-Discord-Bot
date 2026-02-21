import { SlashCommandBuilder, type ChatInputCommandInteraction } from "discord.js";
import { createCCKEmbed, Colors } from "../utils/embeds.js";
import type { Command } from "./index.js";

export const claudeCommand: Command = {
  data: new SlashCommandBuilder()
    .setName("claude")
    .setDescription("Learn about Claude AI")
    .addSubcommand((sub) =>
      sub.setName("models").setDescription("Current Claude models and pricing")
    )
    .addSubcommand((sub) =>
      sub.setName("code").setDescription("What is Claude Code?")
    )
    .addSubcommand((sub) =>
      sub.setName("start").setDescription("Getting started with Claude")
    )
    .addSubcommand((sub) =>
      sub.setName("tips").setDescription("Pro tips for using Claude effectively")
    ),

  async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    const subcommand = interaction.options.getSubcommand();

    switch (subcommand) {
      case "models": {
        const embed = createCCKEmbed({
          title: "Claude Models",
          description: [
            "**Claude Opus 4** — Most capable, complex reasoning",
            "**Claude Sonnet 4** — Balanced performance & speed",
            "**Claude Haiku 3.5** — Fastest, lightweight tasks",
            "",
            "All models available via [claude.ai](https://claude.ai) and the [API](https://console.anthropic.com).",
          ].join("\n"),
          color: Colors.GREEN,
          fields: [
            {
              name: "API Pricing (per million tokens)",
              value: [
                "**Opus 4:** $15 input / $75 output",
                "**Sonnet 4:** $3 input / $15 output",
                "**Haiku 3.5:** $0.80 input / $4 output",
              ].join("\n"),
            },
            {
              name: "More Info",
              value: "[Models & Pricing](https://docs.anthropic.com/en/docs/about-claude/models)",
            },
          ],
        });
        await interaction.reply({ embeds: [embed] });
        break;
      }

      case "code": {
        const embed = createCCKEmbed({
          title: "Claude Code",
          description: [
            "Claude Code is an **agentic coding tool** that lives in your terminal. It can:",
            "",
            "• Edit files across your codebase",
            "• Run terminal commands",
            "• Search and understand code",
            "• Create commits and PRs",
            "• Fix bugs and add features autonomously",
          ].join("\n"),
          color: Colors.GREEN,
          fields: [
            {
              name: "Install",
              value: "```\nnpm install -g @anthropic-ai/claude-code\n```",
            },
            {
              name: "Quick Start",
              value: "```\ncd your-project\nclaude\n```",
            },
            {
              name: "Links",
              value: [
                "[Documentation](https://docs.anthropic.com/en/docs/claude-code)",
                "[Best Practices](https://docs.anthropic.com/en/docs/claude-code/best-practices)",
                "[VS Code Extension](https://marketplace.visualstudio.com/items?itemName=anthropics.claude-code)",
              ].join(" • "),
            },
          ],
        });
        await interaction.reply({ embeds: [embed] });
        break;
      }

      case "start": {
        const embed = createCCKEmbed({
          title: "Getting Started with Claude",
          description: [
            "**Step 1: Try Claude**",
            "Visit [claude.ai](https://claude.ai) — free tier available.",
            "",
            "**Step 2: Get API Access**",
            "Create an account at [console.anthropic.com](https://console.anthropic.com)",
            "",
            "**Step 3: Install Claude Code**",
            "```\nnpm install -g @anthropic-ai/claude-code\n```",
            "",
            "**Step 4: Build Something**",
            "Start a project and run `claude` in your terminal.",
            "",
            "**Step 5: Join CCK**",
            "Connect with the community, attend events, and learn together!",
          ].join("\n"),
          color: Colors.GREEN,
        });
        await interaction.reply({ embeds: [embed] });
        break;
      }

      case "tips": {
        const embed = createCCKEmbed({
          title: "Claude Pro Tips",
          description: [
            "**1. Be Specific**",
            "The more context you give, the better Claude's response.",
            "",
            "**2. Use System Prompts**",
            "Set the tone and constraints for consistent output.",
            "",
            "**3. Break Down Tasks**",
            "Split complex problems into smaller, focused prompts.",
            "",
            "**4. Iterate**",
            "Ask Claude to refine or adjust its responses.",
            "",
            "**5. Use Claude Code for Projects**",
            "Let Claude navigate your codebase — it understands context.",
            "",
            "**6. Leverage Extended Thinking**",
            "For complex reasoning, models with thinking enabled perform better.",
          ].join("\n"),
          color: Colors.GREEN,
          fields: [
            {
              name: "Learn More",
              value: "[Prompt Engineering Guide](https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering)",
            },
          ],
        });
        await interaction.reply({ embeds: [embed] });
        break;
      }
    }
  },
};
