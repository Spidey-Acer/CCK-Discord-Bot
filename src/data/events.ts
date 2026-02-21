import type { Event } from "../types/index.js";

export const events: Event[] = [
  {
    id: "event-1",
    title: "Kenya's First Claude Code Meetup",
    date: "2026-01-24",
    time: "10:00 AM - 1:00 PM EAT",
    venue: "Nairobi Garage, Westlands",
    city: "Nairobi",
    status: "completed",
    attendees: 30,
    highlights: [
      "First-ever Claude community meetup in Kenya",
      "Hands-on Claude Code demo sessions",
      "Networking with AI enthusiasts across Nairobi",
    ],
  },
  {
    id: "event-2",
    title: "Nairobi Meetup #2 — Deep Dive",
    date: "2026-02-20",
    time: "10:00 AM - 1:00 PM EAT",
    venue: "TBD, Nairobi",
    city: "Nairobi",
    status: "registration-open",
    registrationUrl: "https://luma.com/sbsa789m",
    agenda: [
      "Advanced Claude Code workflows",
      "Building with the Anthropic API",
      "Community project showcase",
    ],
  },
  {
    id: "event-3",
    title: "Mombasa AI & Career Talk",
    date: "2026-02-28",
    time: "2:00 PM - 5:00 PM EAT",
    venue: "TU Mombasa",
    city: "Mombasa",
    status: "registration-open",
    registrationUrl: "https://luma.com/vsf5re14",
    agenda: [
      "Introduction to AI and Claude",
      "AI career paths in Kenya",
      "Hands-on Claude Code session",
    ],
  },
];
