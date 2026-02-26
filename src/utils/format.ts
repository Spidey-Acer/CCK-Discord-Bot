const DISCORD_CHAR_LIMIT = 2000;

// All event dates use EAT (East Africa Time, UTC+3)
const EAT_OFFSET = "+03:00";

export function truncateText(text: string, maxLength: number = DISCORD_CHAR_LIMIT): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 3) + "...";
}

export function formatDate(dateStr: string): string {
  const date = new Date(dateStr + `T00:00:00${EAT_OFFSET}`);
  return date.toLocaleDateString("en-KE", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "Africa/Nairobi",
  });
}

export function formatRelativeDate(dateStr: string): string {
  const eventDate = new Date(dateStr + `T00:00:00${EAT_OFFSET}`);
  const now = new Date();
  const diffMs = eventDate.getTime() - now.getTime();
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays < 0) return `${Math.abs(diffDays)} day${Math.abs(diffDays) === 1 ? "" : "s"} ago`;
  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Tomorrow";
  return `in ${diffDays} day${diffDays === 1 ? "" : "s"}`;
}

export function isDatePast(dateStr: string): boolean {
  const eventDate = new Date(dateStr + `T23:59:59${EAT_OFFSET}`);
  return eventDate.getTime() < Date.now();
}
