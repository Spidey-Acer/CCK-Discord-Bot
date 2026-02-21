# CCK Discord Bot — Window 1: Foundation & Infrastructure

## Task
Build the foundation layer for the CCK Discord Bot: project setup, data files, services, types, utils, and config. Do NOT implement slash commands or event handlers — Window 2 handles those.

## Stack
- Node.js + TypeScript (strict) + Discord.js v14 + `@anthropic-ai/sdk`
- Zero `any` types, no `.js` in `src/`
- ES2022 target, Node16 module resolution

## Step 1: Project Init

```bash
npm init -y
npm install discord.js @anthropic-ai/sdk dotenv node-cron
npm install -D typescript @types/node tsx
npx tsc --init
```

**tsconfig.json** — strict mode, ES2022, Node16, `@/` path alias → `./src/`.

**package.json scripts:**
```json
"dev": "tsx src/index.ts",
"build": "tsc",
"start": "node dist/index.js",
"deploy-commands": "tsx src/deploy-commands.ts"
```

**Verify:** `npx tsc --noEmit` passes with zero errors.

## Step 2: Config (`src/config.ts`)

Load from env vars:
- `DISCORD_TOKEN`, `DISCORD_CLIENT_ID`, `DISCORD_GUILD_ID`
- `ANTHROPIC_API_KEY`
- `WELCOME_CHANNEL_ID`, `ANNOUNCEMENTS_CHANNEL_ID`
- `RATE_LIMIT_ASK` (default 5), `RATE_LIMIT_GENERAL` (default 10)

Export typed config object. Throw on missing required vars.

Create `.env.example` with all keys (no values).

## Step 3: Types (`src/types/index.ts`)

Define interfaces for: `FAQ` (id, question, answer, category: general|events|technical), `Event` (id, title, date, time, venue, city, status: registration-open|upcoming|completed, registrationUrl, attendees?, highlights?, agenda?), `Resource` (id, title, url, description, category), `TeamMember` (name, role, social?).

## Step 4: Data Files (`src/data/`)

Mirror the CCK website data. All exports typed.

**`faqs.ts`** — 13 FAQs across 3 categories:
- General (6): What is CCK, who can join, is it free, active cities, Anthropic relation, getting started
- Events (4): frequency, registration, remote attendance, hosting/speaking
- Technical (3): What is Claude, what is Claude Code, Claude Code pricing

**`events.ts`** — 3 events:
1. "Kenya's First Claude Code Meetup" — Jan 24 2026, Nairobi, completed, 30 attendees
2. "Nairobi Meetup #2 — Deep Dive" — Feb 20 2026, Nairobi, registration-open
3. "Mombasa AI & Career Talk" — Feb 28 2026, Mombasa, registration-open

Luma links: Nairobi → https://luma.com/sbsa789m, Mombasa → https://luma.com/vsf5re14

**`resources.ts`** — 28+ resources across 7 categories: Official Anthropic (9), Developer Tools (6), Learning & Tutorials (6), Community & Social (6), Courses & Learning Paths (5), Kenya Tech (1), AI Safety & Ethics (1). Include title, URL, short description per resource.

**`team.ts`** — Core team:
- Peter Kibet — Community Lead & Founder
- Edwin Lungatso — Community Co-Lead
- Dr. Fullgence Mwakondo — Academic Advisor, TU Mombasa
- Joshua Wekesa — Community Organizer, Mombasa Chapter

**`constants.ts`** — URLs: website (claudecommunitykenya.com), Discord (discord.gg/MdEhxH88), email, social links (Twitter, LinkedIn, GitHub, Luma Nairobi/Mombasa, Instagram, Facebook), Claude.ai, Anthropic docs.

**Verify:** `npx tsc --noEmit` after each data file.

## Step 5: Utilities (`src/utils/`)

**`embeds.ts`** — Terminal Noir themed Discord embed builder:
```typescript
// createCCKEmbed({ title, description, color?, fields?, footer? })
// Colors: GREEN 0x00ff41, AMBER 0xffb000, CYAN 0x00d4ff, RED 0xff3333, DIM 0x0a3d1a
// Title prefix: "> " (terminal prompt style)
// Default footer: "CCK Bot • Claude Community Kenya"
```

**`format.ts`** — Date formatting helpers, text truncation (respect Discord 2000 char limit).

**`logger.ts`** — Structured console logging (info, warn, error). No sensitive data in logs.

## Step 6: Services (`src/services/`)

**`claude.ts`** — Claude API wrapper:
- `askClaude(question: string, complexity: 'simple' | 'complex')`
- Simple → `claude-haiku-4-5`, max_tokens 512
- Complex → `claude-opus-4-6`, max_tokens 1024, thinking: { type: "adaptive" }
- System prompt includes: community info, upcoming events, team, key links, personality (helpful, techy/terminal tone, concise, encourages community participation)
- Use `cache_control: { type: "ephemeral" }` on system prompt
- Handle errors: 400, 401, 429, 500, 529. SDK auto-retries with `max_retries: 2`
- Graceful fallback: if API down, return "I'm temporarily unavailable" message

**`faq-matcher.ts`** — FAQ search/matching:
- `searchFAQs(query: string)` — use Claude Haiku to find best-matching FAQ(s)
- `listFAQs(category?: string)` — filter by category
- Fallback: keyword-based matching if API unavailable

**`event-tracker.ts`** — Event utilities:
- `getUpcomingEvents()`, `getPastEvents()`, `getNextEvent()`
- Auto-detect if event date has passed
- Date comparison logic for reminder scheduling

**`rate-limiter.ts`** — Per-user rate limiting:
- In-memory Map with TTL cleanup
- `checkRateLimit(userId: string, type: 'ask' | 'general')` → boolean
- Configurable limits from config

## Step 7: Bot Entry Point (`src/index.ts`)

Minimal setup only — create Discord client with intents (Guilds, GuildMessages, GuildMembers, MessageContent, DirectMessages), login, log ready status. Export client for use by event handlers.

**Do NOT register commands or event handlers here** — Window 2 will add those.

## Step 8: Command Registration Script (`src/deploy-commands.ts`)

Scaffold the deploy script structure using Discord.js REST API. Export a function that takes a command array and registers them. Leave the actual command definitions empty (Window 2 fills them).

## Constraints
- No mocks or placeholders in services — real implementations only
- All data must be accurate to CCK (use the values specified above)
- Every service must have proper error handling
- No hardcoded keys/IDs — all from config

## Verification After Each Step
```bash
npx tsc --noEmit  # Zero errors required
```

## Final Verification
```bash
npm run build     # Full compilation succeeds
```

## Commit Strategy
```
feat(bot): initialize project with Discord.js + TypeScript + Claude SDK
feat(data): add community data files (FAQs, events, resources, team, constants)
feat(services): implement Claude API wrapper, FAQ matcher, event tracker, rate limiter
feat(utils): add terminal-noir embeds, formatting helpers, logger
```
