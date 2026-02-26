const COMPLEX_INDICATORS = /\b(how|why|explain|compare|difference|implement|build|create|debug|architecture)\b/i;
const SHORT_QUESTION_THRESHOLD = 8;

export function detectComplexity(question: string): "simple" | "complex" {
  // Check keywords first — a short question like "how does Claude work" is still complex
  if (COMPLEX_INDICATORS.test(question)) return "complex";

  const wordCount = question.split(/\s+/).length;
  if (wordCount > SHORT_QUESTION_THRESHOLD) return "complex";

  return "simple";
}
