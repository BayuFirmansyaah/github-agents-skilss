# 🤖 AI Dev Assistant — Markdown Agent System

A **zero-build, prompt-first AI knowledge base** that transforms GitHub Copilot Chat into a team of specialized AI agents. No extension, no compilation, no installation — just clone, open, and use.

## ✨ What This Is

This repository is a collection of markdown files that define **AI agent personas**, **skills**, **rules**, and **reusable prompt templates**. When used with GitHub Copilot Chat's `@workspace` feature, these files automatically become the context that shapes Copilot's responses.

**Think of it as an AI team you can clone.**

| Agent | Specialisation | Invoke with |
|-------|---------------|-------------|
| 🏗️ **@backend** | Laravel, DDD, modular architecture | `@workspace using @backend, ...` |
| 🧪 **@tester** | PHPUnit, TDD, test coverage | `@workspace using @tester, ...` |
| 🔍 **@reviewer** | Code review, quality gates | `@workspace using @reviewer, ...` |
| 🛡️ **@security** | OWASP Top 10, vulnerability auditing | `@workspace using @security, ...` |

## 🚀 Quick Start

### Prerequisites

- [VS Code](https://code.visualstudio.com/)
- [GitHub Copilot](https://marketplace.visualstudio.com/items?itemName=GitHub.copilot) extension
- [GitHub Copilot Chat](https://marketplace.visualstudio.com/items?itemName=GitHub.copilot-chat) extension

### Setup

```bash
git clone https://github.com/your-org/github-agents-skills.git
code github-agents-skills
```

That's it. No `npm install`. No build step. Just open VS Code and start chatting.

### Usage

Open Copilot Chat (`Ctrl+Shift+I`) and type:

```
@workspace using @backend, implement a new Payment module
```

```
@workspace using @tester, generate PHPUnit tests for the active file
```

```
@workspace using @reviewer, review this code
```

```
@workspace using @security, audit this file for vulnerabilities
```

You can also combine agents with prompt templates for more structured output:

```
@workspace using @tester and the generate-tests prompt, write tests for this file
```

## 📁 Repository Structure

```
.
├── AGENTS.md                          # Root index — start here
│
├── .ai/
│   ├── agents/                        # Agent personas
│   │   ├── backend.agent.md           # Senior Backend Engineer
│   │   ├── tester.agent.md            # QA / Test Engineer
│   │   ├── reviewer.agent.md          # Code Reviewer
│   │   └── security.agent.md          # Security Auditor
│   │
│   ├── skills/                        # How-to guides & knowledge
│   │   ├── laravel-modules.md         # Module structure & DDD
│   │   ├── eloquent-performance.md    # Query optimization
│   │   ├── api-development.md         # RESTful API patterns
│   │   ├── testing-phpunit.md         # PHPUnit & TDD
│   │   ├── git-workflow.md            # Branching & commits
│   │   └── code-style.md             # Naming & type safety
│   │
│   ├── rules/                         # Strict mandates
│   │   ├── modular-architecture.md    # Module boundaries
│   │   ├── services.md               # Actions & DTOs
│   │   ├── security-best-practices.md # Input validation & auth
│   │   ├── database-migrations.md     # Safe migrations
│   │   ├── new-feature.md            # Feature workflow
│   │   ├── frontend.md               # Blade & Alpine
│   │   ├── livewire-components.md     # Livewire patterns
│   │   └── code-review-checklist.md   # Review criteria
│   │
│   └── prompts/                       # Reusable task templates
│       ├── generate-tests.prompt.md   # Test generation
│       ├── code-review.prompt.md      # Structured review
│       ├── new-module.prompt.md       # Module scaffolding
│       ├── security-audit.prompt.md   # Vulnerability audit
│       └── refactor.prompt.md         # Code refactoring
│
└── README.md
```

## 🛠 How It Works

```
User: @workspace using @backend, ...
         │
         ▼
┌─ Copilot Chat ──────────────────────┐
│  Reads AGENTS.md as entry point     │
│  Follows reference to agent file    │
│  Loads referenced skills & rules    │
│  Adopts agent persona               │
│  Applies constraints                │
│  Generates response                 │
└─────────────────────────────────────┘
```

1. `AGENTS.md` serves as the root orchestrator — Copilot reads it first
2. Each **agent** file defines a persona, responsibilities, and constraints
3. Agents reference **skills** (how-to knowledge) and **rules** (strict mandates)
4. **Prompts** provide structured task templates for common workflows
5. Copilot combines all of this into contextual, specialized responses

## ✏️ Customisation

### Add a New Agent

1. Create `.ai/agents/your-agent.agent.md` following the template in [AGENTS.md](AGENTS.md#creating-new-agents)
2. Add a row to the Agents table in `AGENTS.md`
3. Done — no build, no compilation

### Add a New Skill or Rule

1. Create the markdown file in `.ai/skills/` or `.ai/rules/`
2. Add it to the tables in `AGENTS.md`
3. Reference it from relevant agent files

### Adapt for a Different Tech Stack

This system is currently configured for Laravel/PHP projects, but the architecture is stack-agnostic. To adapt:

1. Replace skill files with your stack's patterns (e.g., NestJS, Django, Spring)
2. Update rule files with your team's mandates
3. Rewrite agent personas to match your domain expertise
4. The structure stays the same

## 📄 License

MIT
