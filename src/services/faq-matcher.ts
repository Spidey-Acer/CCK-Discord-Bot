import { faqs } from "../data/faqs.js";
import { BOT } from "../data/constants.js";
import type { FAQ } from "../types/index.js";
import { logger } from "../utils/logger.js";
import { getAnthropicClient } from "./claude.js";

export function listFAQs(category?: string): FAQ[] {
  if (!category) return faqs;
  return faqs.filter((faq) => faq.category === category);
}

function keywordMatch(query: string): FAQ | undefined {
  const lower = query.toLowerCase();
  const scored = faqs.map((faq) => {
    const questionWords = faq.question.toLowerCase().split(/\s+/);
    const queryWords = lower.split(/\s+/);
    let score = 0;
    for (const qw of queryWords) {
      if (questionWords.some((w) => w.includes(qw) || qw.includes(w))) {
        score++;
      }
    }
    return { faq, score };
  });

  scored.sort((a, b) => b.score - a.score);
  return scored[0]?.score > 0 ? scored[0].faq : undefined;
}

export async function searchFAQs(query: string): Promise<FAQ | undefined> {
  try {
    const faqList = faqs
      .map((faq, i) => `${i}. [${faq.category}] ${faq.question}`)
      .join("\n");

    const client = getAnthropicClient();
    const response = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: BOT.MAX_TOKENS_FAQ_MATCH,
      system:
        "You match user questions to FAQ entries. Respond with ONLY the FAQ index number (0-based) that best matches, or 'none' if no match. No explanation.",
      messages: [
        {
          role: "user",
          content: `FAQs:\n${faqList}\n\nUser question: ${query}`,
        },
      ],
    });

    const textBlock = response.content.find((block) => block.type === "text");
    const answer = textBlock?.text?.trim() ?? "none";

    if (answer === "none") return undefined;

    const index = parseInt(answer, 10);
    if (!isNaN(index) && index >= 0 && index < faqs.length) {
      return faqs[index];
    }

    return undefined;
  } catch (error: unknown) {
    logger.warn("FAQ search via Claude failed, falling back to keyword match", {
      error: error instanceof Error ? error.message : String(error),
    });
    return keywordMatch(query);
  }
}
