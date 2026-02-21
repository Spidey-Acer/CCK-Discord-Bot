import dotenv from "dotenv";

dotenv.config();

function requireEnv(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

function optionalEnv(key: string, defaultValue: string): string {
  return process.env[key] ?? defaultValue;
}

export const config = {
  discord: {
    token: requireEnv("DISCORD_TOKEN"),
    clientId: requireEnv("DISCORD_CLIENT_ID"),
    guildId: requireEnv("DISCORD_GUILD_ID"),
  },
  anthropic: {
    apiKey: requireEnv("ANTHROPIC_API_KEY"),
  },
  channels: {
    welcomeId: optionalEnv("WELCOME_CHANNEL_ID", ""),
    announcementsId: optionalEnv("ANNOUNCEMENTS_CHANNEL_ID", ""),
  },
  rateLimits: {
    ask: parseInt(optionalEnv("RATE_LIMIT_ASK", "5"), 10),
    general: parseInt(optionalEnv("RATE_LIMIT_GENERAL", "10"), 10),
  },
} as const;
