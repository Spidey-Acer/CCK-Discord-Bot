import Anthropic from "@anthropic-ai/sdk";
import { config } from "../config.js";
import { events } from "../data/events.js";
import { team } from "../data/team.js";
import { URLS } from "../data/constants.js";
import { logger } from "../utils/logger.js";

const client = new Anthropic({
  apiKey: config.anthropic.apiKey,
  maxRetries: 2,
});

const upcomingEvents = events
  .filter((e) => e.status !== "completed")
  .map((e) => `- ${e.title} on ${e.date} in ${e.city}${e.registrationUrl ? ` (Register: ${e.registrationUrl})` : ""}`)
  .join("\n");

const teamInfo = team.map((t) => `- ${t.name}: ${t.role}`).join("\n");

const SYSTEM_PROMPT = `You are the Claude Community Kenya (CCK) Discord bot — the first Claude community in Africa.

Personality: Helpful, techy with a terminal-inspired tone, concise. Encourage community participation.

Community Info:
- Website: ${URLS.website}
- Discord: ${URLS.discord}
- Email: ${URLS.email}
- Active cities: Nairobi and Mombasa

Team:
${teamInfo}

Upcoming Events:
${upcomingEvents || "No upcoming events scheduled."}

Key Links:
- Nairobi Luma: ${URLS.lumaNairobi}
- Mombasa Luma: ${URLS.lumaMombasa}
- Claude AI: ${URLS.claudeAi}
- Anthropic Docs: ${URLS.anthropicDocs}

Guidelines:
- Keep responses concise and relevant to CCK or Claude/AI topics
- Direct users to specific resources when possible
- Encourage event attendance and community participation
- If unsure, suggest asking in the Discord community or checking the website`;

interface AskClaudeResult {
  content: string;
  model: string;
}

export async function askClaude(
  question: string,
  complexity: "simple" | "complex"
): Promise<AskClaudeResult> {
  try {
    if (complexity === "complex") {
      const response = await client.messages.create({
        model: "claude-opus-4-6",
        max_tokens: 1024,
        thinking: { type: "enabled", budget_tokens: 512 },
        system: [
          {
            type: "text",
            text: SYSTEM_PROMPT,
            cache_control: { type: "ephemeral" },
          },
        ],
        messages: [{ role: "user", content: question }],
      });

      const textBlock = response.content.find((block) => block.type === "text");
      return {
        content: textBlock?.text ?? "I couldn't generate a response.",
        model: response.model,
      };
    }

    const response = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 512,
      system: [
        {
          type: "text",
          text: SYSTEM_PROMPT,
          cache_control: { type: "ephemeral" },
        },
      ],
      messages: [{ role: "user", content: question }],
    });

    const textBlock = response.content.find((block) => block.type === "text");
    return {
      content: textBlock?.text ?? "I couldn't generate a response.",
      model: response.model,
    };
  } catch (error: unknown) {
    if (error instanceof Anthropic.APIError) {
      logger.error("Claude API error", {
        status: error.status,
        message: error.message,
      });

      switch (error.status) {
        case 401:
          return { content: "Authentication error. Please contact an admin.", model: "error" };
        case 429:
          return { content: "I'm being rate limited. Please try again in a moment.", model: "error" };
        case 529:
          return { content: "Claude is currently overloaded. Please try again later.", model: "error" };
        default:
          return { content: "I'm temporarily unavailable. Please try again later.", model: "error" };
      }
    }

    logger.error("Unexpected error calling Claude", {
      error: error instanceof Error ? error.message : String(error),
    });
    return { content: "I'm temporarily unavailable. Please try again later.", model: "error" };
  }
}
