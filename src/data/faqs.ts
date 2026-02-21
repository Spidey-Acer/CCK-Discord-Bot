import type { FAQ } from "../types/index.js";

export const faqs: FAQ[] = [
  // General (6)
  {
    id: "general-1",
    question: "What is Claude Community Kenya (CCK)?",
    answer:
      "Claude Community Kenya (CCK) is the first Claude community in Africa, dedicated to bringing together AI enthusiasts, developers, and professionals across Kenya. We organize meetups, workshops, and collaborative sessions focused on Claude AI and its applications.",
    category: "general",
  },
  {
    id: "general-2",
    question: "Who can join CCK?",
    answer:
      "Anyone interested in AI, Claude, and technology is welcome! Whether you're a student, developer, researcher, entrepreneur, or just curious about AI — there's a place for you in CCK. No prior AI experience required.",
    category: "general",
  },
  {
    id: "general-3",
    question: "Is it free to join CCK?",
    answer:
      "Yes! Joining CCK is completely free. Our meetups, workshops, and community events are open to everyone at no cost. Just join our Discord server or register for events on Luma.",
    category: "general",
  },
  {
    id: "general-4",
    question: "Which cities is CCK active in?",
    answer:
      "CCK is currently active in Nairobi and Mombasa. We're looking to expand to more cities across Kenya. If you'd like to start a chapter in your city, reach out to us!",
    category: "general",
  },
  {
    id: "general-5",
    question: "Is CCK affiliated with Anthropic?",
    answer:
      "CCK is an independent community of Claude enthusiasts in Kenya. While we focus on Anthropic's Claude AI products and promote their tools, we are not officially affiliated with or funded by Anthropic.",
    category: "general",
  },
  {
    id: "general-6",
    question: "How do I get started with CCK?",
    answer:
      "Join our Discord server at discord.gg/MdEhxH88, follow us on social media, and register for upcoming events on Luma. Introduce yourself in the community channels and start connecting with fellow AI enthusiasts!",
    category: "general",
  },

  // Events (4)
  {
    id: "events-1",
    question: "How often does CCK hold events?",
    answer:
      "We aim to hold at least one meetup per month, alternating between Nairobi and Mombasa. We also host online sessions and workshops. Check our Luma pages or Discord for the latest schedule.",
    category: "events",
  },
  {
    id: "events-2",
    question: "How do I register for CCK events?",
    answer:
      "Events are listed on our Luma pages. Nairobi events: luma.com/sbsa789m | Mombasa events: luma.com/vsf5re14. You can also find event announcements in our Discord server.",
    category: "events",
  },
  {
    id: "events-3",
    question: "Can I attend events remotely?",
    answer:
      "Some events may have a virtual component, but most CCK meetups are in-person to foster real community connections. Check the specific event page on Luma for details on remote attendance options.",
    category: "events",
  },
  {
    id: "events-4",
    question: "Can I host or speak at a CCK event?",
    answer:
      "Absolutely! We welcome community members who want to present, lead workshops, or host events. Reach out to our team on Discord or email us at claudecommunitykenya@gmail.com to propose a talk or session.",
    category: "events",
  },

  // Technical (3)
  {
    id: "technical-1",
    question: "What is Claude?",
    answer:
      "Claude is an AI assistant built by Anthropic. It's designed to be helpful, harmless, and honest. Claude can help with writing, analysis, coding, math, and many other tasks. You can try it at claude.ai.",
    category: "technical",
  },
  {
    id: "technical-2",
    question: "What is Claude Code?",
    answer:
      "Claude Code is an agentic coding tool by Anthropic that lives in your terminal. It can understand your codebase, edit files, run commands, and help you build software faster using natural language. It integrates with VS Code and JetBrains IDEs.",
    category: "technical",
  },
  {
    id: "technical-3",
    question: "How much does Claude Code cost?",
    answer:
      "Claude Code requires an Anthropic API key with usage-based billing, or a Claude Pro/Max subscription. API pricing varies by model — Haiku is the most affordable, Sonnet offers a balance, and Opus provides the highest capability. Check docs.anthropic.com for current pricing.",
    category: "technical",
  },
];
