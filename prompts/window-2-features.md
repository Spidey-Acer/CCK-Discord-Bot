# CCK Discord Bot — Window 2: Commands, Events & Features

## Task
Implement all slash commands, Discord event handlers, welcome system, and event reminders for the CCK Discord Bot. Foundation layer (data, services, utils, types, config) already exists from Window 1.

## Prerequisites (Built by Window 1)
Before starting, verify these exist and compile:
```bash
npx tsc --noEmit  # Must pass — if errors exist, fix imports/types first
```

Expected structure:
```
src/
├── config.ts          # Typed env config
├── types/index.ts     # FAQ, Event, Resource, TeamMember interfaces
├── data/              # faqs.ts, events.ts, reso think there's not too much family real good thank you don't still forgive me good morning urces.ts, team.ts, constants.ts
├── services/          # claude.ts, faq-matcher.ts, event-tracker.ts, rate-limiter.ts
├── utils/             # embeds.ts (createCCKEmbed + COLORS), format.ts, logger.ts
├── index.ts           # Discord client setup (minimal)
└── deploy-commands.ts # Command registration scaffold
```

If anything is missing, create it following the types/patterns from existing files.

## Stack Context
- Discord.js v14, slash commands only (no prefix commands)
- `@anthropic-ai/sdk` via `src/services/claude.ts`
- TypeScript strict, zero `any`

## Step 1: Slash Commands (`src/commands/`)

Each command exports: `data` (SlashCommandBuilder) + `execute(interaction)`.

### `/ask question:<string>` — Core AI Q&A
- Detect complexity: short/keyword questions → `askClaude(q, 'simple')`, else `'complex'`
- `deferReply()` before API call (will take >3s)
- Format response as terminal-themed embed (GREEN)
- If response matches a known FAQ, append "Related FAQ" field
- Truncate at 2000 chars with "..." + suggest `/faq` or website
- Rate limit: 5/user/min via rate-limiter service
- Ephemeral error replies

### `/faq` — FAQ Browser (subcommands)
- `/faq list [category:general|events|technical]` — list FAQs, grouped by category if no filter. Use autocomplete on category param
- `/faq search query:<string>` — use faq-matcher service
- Display as embeds with GREEN accent. Paginate with buttons (prev/next) if multiple results

### `/events` — Event Tracker (subcommands)
- `/events upcoming` — registration-open/upcoming events with status badges (green/yellow)
- `/events past` — completed events with highlights + attendee count
- `/events next` — next upcoming event with full details + agenda
- Color-code: GREEN registration-open, AMBER upcoming, default completed
- Include Luma registration links as clickable URL buttons (ButtonBuilder)

### `/resources` — Resource Library (subcommands)
- `/resources list [category:<string>]` — grouped by category with clickable links
- `/resources search query:<string>` — fuzzy match on title + description
- Use CYAN embed color. Paginate with buttons if many results
- Autocomplete on category param

### `/about [topic:community|team|mission|links]`
- Default: community overview embed (name, description, stats, founded Jan 2026, 50+ members, Nairobi + Mombasa)
- `team`: grid of team members with roles
- `mission`: mission, vision, values
- `links`: all social/platform links
- Autocomplete on topic param

### `/help`
- List all commands with brief descriptions
- Example usage for `/ask`
- Link to CCK website

### `/links [type:discord|twitter|github|luma|website|docs|claude]`
- No arg: compact embed with all key links
- With arg: specific link prominently displayed

### `/claude` — Claude Info (subcommands)
- `/claude models` — current Claude models + pricing overview
- `/claude code` — what is Claude Code + install instructions
- `/claude start` — step-by-step getting started guide
- `/claude tips` — pro tips for effective Claude usage

**Verify:** `npx tsc --noEmit` after implementing all commands.

## Step 2: Update `deploy-commands.ts`

Import all command `data` objects. Register with Discord REST API. Support guild-specific (dev) and global (prod) registration.

**Verify:** `npm run deploy-commands` succeeds (requires .env tokens).

## Step 3: Event Handlers (`src/events/`)

### `ready.ts`
- Log bot online status
- Set bot activity: "Watching Claude Community Kenya | /help"

### `interactionCreate.ts`
- Route slash commands to correct handler by `commandName`
- Handle autocomplete interactions
- Handle button interactions (pagination)
- Catch + log errors, reply ephemeral error message

### `messageCreate.ts` — Natural Language Handler
- Trigger on @mention or DM
- Treat message content as `/ask` question
- Same Claude API integration, same rate limits
- Rate limit: 3/user/min DMs, 5/user/min channels
- Respond in same channel/thread

### `guildMemberAdd.ts` — Welcome System
- Send terminal-themed welcome embed in configured welcome channel
- Mention the new member
- Message:
  ```
  $ ssh {username}@cck-server
  Connection established.
  Welcome to Claude Community Kenya!

  > Type /help to see what I can do
  > Type /events upcoming to see what's next
  > Type /ask to chat with me about anything Claude
  ```
- Include upcoming events as embed fields
- Use GREEN color

## Step 4: Wire Events in `src/index.ts`

Import and register all event handlers on the Discord client. Import command collection. Set up client.commands Map.

**Verify:** `npx tsc --noEmit` passes.

## Step 5: Event Reminders (Scheduled)

In `src/index.ts` or a dedicated `src/services/reminders.ts`:
- Use `node-cron` to check daily
- 7 days before event: post reminder in announcements channel (AMBER embed)
- 1 day before: "Tomorrow!" reminder with full details
- Day of: "Happening today!" with venue, time, registration link button
- Each reminder includes registration URL button

## Step 6: Security Hardening
- Verify rate limiting works on `/ask` and `messageCreate`
- Input sanitization: strip control chars, limit length before passing to Claude
- Block obvious prompt injection patterns ("ignore previous instructions")
- Ephemeral error messages (only visible to user who triggered)
- Restrict bot responses to specific channels if configured

## Constraints
- `deferReply()` on any command that calls Claude API
- All pagination uses Discord button components (not reactions)
- Autocomplete on all enum/category parameters
- Handle interaction timeouts (15-min window) gracefully
- No stateless conversation history — each request is independent
- No database, no web dashboard, no music/moderation features
- No deprecated Discord.js patterns — v14+ only

## Verification After Each Step
```bash
npx tsc --noEmit  # Zero errors required
```

## Final Verification
```bash
npm run build           # Full compilation
npm run dev             # Bot starts without crashes (requires .env)
npm run deploy-commands # Commands registered to Discord
```

## Commit Strategy
```
feat(commands): implement /ask with Claude API integration
feat(commands): implement /faq, /events, /resources commands
feat(commands): implement /about, /help, /links, /claude commands
feat(events): add welcome system and natural language handler
feat(reminders): add scheduled event reminders
fix(security): add rate limiting and input sanitization
```
