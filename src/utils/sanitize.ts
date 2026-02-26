import { BOT } from "../data/constants.js";

const CONTROL_CHAR_REGEX = /[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g;

const INJECTION_PATTERNS = [
  // Direct instruction override
  /ignore\s+(all\s+)?previous\s+instructions/i,
  /disregard\s+(all\s+)?previous/i,
  /override\s+(all\s+)?instructions/i,
  /new\s+instructions?:/i,
  // Identity manipulation
  /you\s+are\s+now\s+/i,
  /act\s+as\s+(a|an|if)\b/i,
  /pretend\s+(to\s+be|you('re| are))/i,
  /roleplay\s+as\b/i,
  // Memory reset attacks
  /forget\s+(all|your|previous|everything)/i,
  /reset\s+(your|all)\s+(instructions|context|memory)/i,
  // System prompt extraction
  /system\s*prompt/i,
  /reveal\s+(your|the)\s+(instructions|prompt|rules)/i,
  /repeat\s+(your|the)\s+(instructions|prompt|system)/i,
  // Fake system markers
  /\[system\]/i,
  /<<\s*SYS\s*>>/i,
  /\[INST\]/i,
  // Instruction smuggling
  /translate\s+the\s+following\s+(and|then)\s/i,
];

export function sanitizeInput(input: string): string {
  let cleaned = input.replace(CONTROL_CHAR_REGEX, "");
  cleaned = cleaned.trim();
  if (cleaned.length > BOT.MAX_INPUT_LENGTH) {
    cleaned = cleaned.slice(0, BOT.MAX_INPUT_LENGTH);
  }
  return cleaned;
}

export function containsInjection(input: string): boolean {
  return INJECTION_PATTERNS.some((pattern) => pattern.test(input));
}
