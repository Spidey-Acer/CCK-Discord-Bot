export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: "general" | "events" | "technical";
}

export interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  venue: string;
  city: string;
  status: "registration-open" | "upcoming" | "completed";
  registrationUrl?: string;
  attendees?: number;
  highlights?: string[];
  agenda?: string[];
}

export interface Resource {
  id: string;
  title: string;
  url: string;
  description: string;
  category: string;
}

export interface TeamMember {
  name: string;
  role: string;
  social?: {
    twitter?: string;
    linkedin?: string;
    github?: string;
  };
}
