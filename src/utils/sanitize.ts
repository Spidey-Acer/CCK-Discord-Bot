const CONTROL_CHAR_REGEX = /[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g;
const MAX_INPUT_LENGTH = 500;

const INJECTION_PATTERNS = [
  /ignore\s+(all\s+)?previous\s+instructions/i,
  /disregard\s+(all\s+)?previous/i,
  /you\s+are\s+now\s+/i,
  /new\s+instructions?:/i,
  /system\s*prompt/i,
  /override\s+(all\s+)?instructions/i,
];

export function sanitizeInput(input: string): string {
  let cleaned = input.replace(CONTROL_CHAR_REGEX, "");
  cleaned = cleaned.trim();
  if (cleaned.length > MAX_INPUT_LENGTH) {
    cleaned = cleaned.slice(0, MAX_INPUT_LENGTH);
  }
  return cleaned;
}

export function containsInjection(input: string): boolean {
  return INJECTION_PATTERNS.some((pattern) => pattern.test(input));
}
