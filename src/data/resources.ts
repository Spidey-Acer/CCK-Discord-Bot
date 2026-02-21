import type { Resource } from "../types/index.js";

export const resources: Resource[] = [
  // Official Anthropic (9)
  {
    id: "anthropic-1",
    title: "Claude.ai",
    url: "https://claude.ai",
    description: "Chat with Claude directly in your browser",
    category: "Official Anthropic",
  },
  {
    id: "anthropic-2",
    title: "Anthropic API Documentation",
    url: "https://docs.anthropic.com",
    description: "Official API docs for building with Claude",
    category: "Official Anthropic",
  },
  {
    id: "anthropic-3",
    title: "Anthropic Cookbook",
    url: "https://github.com/anthropics/anthropic-cookbook",
    description: "Code examples and guides for using the Anthropic API",
    category: "Official Anthropic",
  },
  {
    id: "anthropic-4",
    title: "Claude Code",
    url: "https://docs.anthropic.com/en/docs/claude-code",
    description: "Agentic coding tool that lives in your terminal",
    category: "Official Anthropic",
  },
  {
    id: "anthropic-5",
    title: "Anthropic Console",
    url: "https://console.anthropic.com",
    description: "Manage API keys, usage, and billing",
    category: "Official Anthropic",
  },
  {
    id: "anthropic-6",
    title: "Model Card & Pricing",
    url: "https://docs.anthropic.com/en/docs/about-claude/models",
    description: "Compare Claude models and their capabilities",
    category: "Official Anthropic",
  },
  {
    id: "anthropic-7",
    title: "Prompt Engineering Guide",
    url: "https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering",
    description: "Best practices for writing effective prompts",
    category: "Official Anthropic",
  },
  {
    id: "anthropic-8",
    title: "Anthropic Research",
    url: "https://www.anthropic.com/research",
    description: "Latest research papers and findings from Anthropic",
    category: "Official Anthropic",
  },
  {
    id: "anthropic-9",
    title: "Claude System Prompts",
    url: "https://docs.anthropic.com/en/docs/build-with-claude/system-prompts",
    description: "Guide to using system prompts effectively with Claude",
    category: "Official Anthropic",
  },

  // Developer Tools (6)
  {
    id: "devtools-1",
    title: "Anthropic TypeScript SDK",
    url: "https://github.com/anthropics/anthropic-sdk-typescript",
    description: "Official TypeScript/JavaScript SDK for the Anthropic API",
    category: "Developer Tools",
  },
  {
    id: "devtools-2",
    title: "Anthropic Python SDK",
    url: "https://github.com/anthropics/anthropic-sdk-python",
    description: "Official Python SDK for the Anthropic API",
    category: "Developer Tools",
  },
  {
    id: "devtools-3",
    title: "Model Context Protocol (MCP)",
    url: "https://modelcontextprotocol.io",
    description: "Open protocol for connecting AI models to data sources and tools",
    category: "Developer Tools",
  },
  {
    id: "devtools-4",
    title: "Claude Code GitHub Action",
    url: "https://github.com/anthropics/claude-code-action",
    description: "Run Claude Code in GitHub Actions for automated code review",
    category: "Developer Tools",
  },
  {
    id: "devtools-5",
    title: "Claude for VS Code",
    url: "https://marketplace.visualstudio.com/items?itemName=anthropics.claude-code",
    description: "Claude Code extension for Visual Studio Code",
    category: "Developer Tools",
  },
  {
    id: "devtools-6",
    title: "Anthropic Bedrock Integration",
    url: "https://docs.anthropic.com/en/docs/about-claude/models#model-names",
    description: "Use Claude models via AWS Bedrock and Google Vertex AI",
    category: "Developer Tools",
  },

  // Learning & Tutorials (6)
  {
    id: "learn-1",
    title: "Prompt Engineering Interactive Tutorial",
    url: "https://github.com/anthropics/prompt-eng-interactive-tutorial",
    description: "Hands-on Jupyter notebook tutorial for prompt engineering",
    category: "Learning & Tutorials",
  },
  {
    id: "learn-2",
    title: "Anthropic Courses",
    url: "https://github.com/anthropics/courses",
    description: "Free educational courses on building with Claude",
    category: "Learning & Tutorials",
  },
  {
    id: "learn-3",
    title: "Claude Code Best Practices",
    url: "https://docs.anthropic.com/en/docs/claude-code/best-practices",
    description: "Tips for getting the most out of Claude Code",
    category: "Learning & Tutorials",
  },
  {
    id: "learn-4",
    title: "Tool Use (Function Calling) Guide",
    url: "https://docs.anthropic.com/en/docs/build-with-claude/tool-use",
    description: "How to give Claude access to external tools and APIs",
    category: "Learning & Tutorials",
  },
  {
    id: "learn-5",
    title: "Embeddings Guide",
    url: "https://docs.anthropic.com/en/docs/build-with-claude/embeddings",
    description: "Using embeddings for semantic search and retrieval",
    category: "Learning & Tutorials",
  },
  {
    id: "learn-6",
    title: "Vision with Claude",
    url: "https://docs.anthropic.com/en/docs/build-with-claude/vision",
    description: "How to use Claude's image understanding capabilities",
    category: "Learning & Tutorials",
  },

  // Community & Social (6)
  {
    id: "community-1",
    title: "CCK Discord Server",
    url: "https://discord.gg/MdEhxH88",
    description: "Join our Discord community for discussions and support",
    category: "Community & Social",
  },
  {
    id: "community-2",
    title: "CCK Twitter / X",
    url: "https://x.com/ClaudeCmtyKenya",
    description: "Follow us for updates, announcements, and AI news",
    category: "Community & Social",
  },
  {
    id: "community-3",
    title: "CCK LinkedIn",
    url: "https://www.linkedin.com/company/claude-community-kenya",
    description: "Connect with us professionally on LinkedIn",
    category: "Community & Social",
  },
  {
    id: "community-4",
    title: "CCK GitHub",
    url: "https://github.com/Claude-Community-Kenya",
    description: "Community open-source projects and resources",
    category: "Community & Social",
  },
  {
    id: "community-5",
    title: "CCK Instagram",
    url: "https://www.instagram.com/claudecommunitykenya",
    description: "Event photos, highlights, and community stories",
    category: "Community & Social",
  },
  {
    id: "community-6",
    title: "CCK Facebook",
    url: "https://www.facebook.com/claudecommunitykenya",
    description: "Community page for event updates and discussions",
    category: "Community & Social",
  },

  // Courses & Learning Paths (5)
  {
    id: "course-1",
    title: "DeepLearning.AI — Building with Claude",
    url: "https://www.deeplearning.ai/courses/",
    description: "Free courses on AI development including Claude integrations",
    category: "Courses & Learning Paths",
  },
  {
    id: "course-2",
    title: "Anthropic API Fundamentals",
    url: "https://github.com/anthropics/courses/tree/master/anthropic_api_fundamentals",
    description: "Foundational course for working with the Anthropic API",
    category: "Courses & Learning Paths",
  },
  {
    id: "course-3",
    title: "Real World Prompting",
    url: "https://github.com/anthropics/courses/tree/master/real_world_prompting",
    description: "Practical prompt engineering for production applications",
    category: "Courses & Learning Paths",
  },
  {
    id: "course-4",
    title: "Prompt Evaluations",
    url: "https://github.com/anthropics/courses/tree/master/prompt_evaluations",
    description: "Learn to systematically evaluate and improve your prompts",
    category: "Courses & Learning Paths",
  },
  {
    id: "course-5",
    title: "Tool Use Course",
    url: "https://github.com/anthropics/courses/tree/master/tool_use",
    description: "Deep dive into Claude's function calling capabilities",
    category: "Courses & Learning Paths",
  },

  // Kenya Tech (1)
  {
    id: "kenya-1",
    title: "CCK Website",
    url: "https://claudecommunitykenya.com",
    description: "Official Claude Community Kenya website with events and resources",
    category: "Kenya Tech",
  },

  // AI Safety & Ethics (1)
  {
    id: "safety-1",
    title: "Anthropic's Core Views on AI Safety",
    url: "https://www.anthropic.com/research#702702",
    description: "Anthropic's approach to building safe and beneficial AI systems",
    category: "AI Safety & Ethics",
  },
];
