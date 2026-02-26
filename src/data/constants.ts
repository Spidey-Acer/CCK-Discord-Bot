// Bot behavior constants
export const BOT = {
  /** Max characters for user input before truncation */
  MAX_INPUT_LENGTH: 500,
  /** Max characters for Discord embed descriptions (below 2000 Discord limit) */
  MAX_RESPONSE_LENGTH: 1900,
  /** Items shown per page in paginated embeds */
  ITEMS_PER_PAGE: 5,
  /** Pagination button collector timeout (15 minutes) */
  PAGINATION_TIMEOUT_MS: 15 * 60_000,
  /** Rate limit sliding window duration */
  RATE_LIMIT_WINDOW_MS: 60_000,
  /** Rate limit cleanup interval */
  RATE_LIMIT_CLEANUP_MS: 5 * 60_000,
  /** Extended thinking budget tokens for complex queries */
  THINKING_BUDGET_TOKENS: 512,
  /** Max response tokens for complex queries */
  MAX_TOKENS_COMPLEX: 1024,
  /** Max response tokens for simple queries */
  MAX_TOKENS_SIMPLE: 512,
  /** Max tokens for FAQ matcher response */
  MAX_TOKENS_FAQ_MATCH: 32,
} as const;

export const URLS = {
  website: "https://claudecommunitykenya.com",
  discord: "https://discord.gg/MdEhxH88",
  email: "claudecommunitykenya@gmail.com",

  // Social
  twitter: "https://x.com/ClaudeCmtyKenya",
  linkedin: "https://www.linkedin.com/company/claude-community-kenya",
  github: "https://github.com/Claude-Community-Kenya",
  instagram: "https://www.instagram.com/claudecommunitykenya",
  facebook: "https://www.facebook.com/claudecommunitykenya",

  // Luma event pages
  lumaNairobi: "https://luma.com/sbsa789m",
  lumaMombasa: "https://luma.com/vsf5re14",

  // Anthropic
  claudeAi: "https://claude.ai",
  anthropicDocs: "https://docs.anthropic.com",
} as const;
