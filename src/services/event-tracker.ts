import { events } from "../data/events.js";
import { isDatePast } from "../utils/format.js";
import type { Event } from "../types/index.js";

export function getUpcomingEvents(): Event[] {
  return events.filter((event) => !isDatePast(event.date));
}

export function getPastEvents(): Event[] {
  return events.filter((event) => isDatePast(event.date));
}

export function getNextEvent(): Event | undefined {
  const upcoming = getUpcomingEvents();
  if (upcoming.length === 0) return undefined;

  upcoming.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  return upcoming[0];
}

export function getDaysUntilEvent(event: Event): number {
  // Use explicit EAT timezone (+03:00) to avoid server-timezone drift
  const eventMidnight = new Date(event.date + "T00:00:00+03:00");
  const now = new Date();
  const diffMs = eventMidnight.getTime() - now.getTime();
  const diffDays = diffMs / (1000 * 60 * 60 * 24);
  // Use Math.ceil so "day of" = 0 and "tomorrow" = 1
  return Math.ceil(diffDays);
}
