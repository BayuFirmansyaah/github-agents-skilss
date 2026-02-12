# 🤖 AI Dev Assistant — Markdown Agent System

A **zero-build, prompt-first AI knowledge base** that transforms GitHub Copilot Chat into a team of specialized AI agents. No extension, no compilation, no installation — just clone, open, and use.

## ✨ What This Is

This repository is a collection of markdown files that define **AI agent personas**, **skills**, **rules**, and **reusable prompt templates**. When used with GitHub Copilot Chat's `@workspace` feature, these files automatically become the context that shapes Copilot's responses.

**Think of it as an AI team you can clone.**

| Agent | Specialisation | Slash Command |
|-------|---------------|---------------|
| 🏗️ **@backend** | Laravel, DDD, modular architecture | `/backend` |
| 🧪 **@tester** | PHPUnit, TDD, test coverage | `/tester` |
| 🔍 **@reviewer** | Code review, quality gates | `/review` |
| 🛡️ **@security** | OWASP Top 10, vulnerability auditing | `/security` |

Plus task-specific commands: `/generate-tests`, `/new-module`, `/refactor`

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

Open Copilot Chat (`Ctrl+Shift+I`) and type a slash command:

```
/backend implement a new Payment module
```

```
/tester generate PHPUnit tests for the active file
```

```
/review review this code
```

```
/security audit this file for vulnerabilities
```

Or use task-specific commands:

```
/generate-tests
/new-module Payment
/refactor
```

> **Alternative:** You can also use `@workspace` mentions:
> `@workspace using @backend, implement a new Payment module`

## 📁 Repository Structure

```
.
├── AGENTS.md                          # Root orchestrator — Copilot reads this first
│
├── .vscode/prompts/                   # ⚡ Slash command entry points
│   ├── backend.prompt.md              # /backend
│   ├── tester.prompt.md               # /tester
│   ├── review.prompt.md               # /review
│   ├── security.prompt.md             # /security
│   ├── generate-tests.prompt.md       # /generate-tests
│   ├── new-module.prompt.md           # /new-module
│   └── refactor.prompt.md             # /refactor
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
User types: /backend implement Payment module
               │
               ▼
┌─ .vscode/prompts/backend.prompt.md ─┐
│  Copilot loads this prompt file     │
│  #file: references pull in:        │
│    → .ai/agents/backend.agent.md   │
│    → .ai/skills/laravel-modules.md │
│    → .ai/skills/eloquent-perf.md   │
│    → .ai/rules/modular-arch.md     │
│    → .ai/rules/services.md         │
│  All combined into one context     │
│  Copilot adopts persona + rules    │
│  Generates specialized response    │
└─────────────────────────────────────┘
```

1. `.vscode/prompts/*.md` files register as **native slash commands** in Copilot Chat
2. Each prompt file uses `#file:` references to pull in **agent + skills + rules**
3. Copilot automatically resolves all `#file:` references and loads the full context
4. The agent **persona**, **skills**, and **rules** shape the response
5. No build, no runtime, no extension — just markdown composition

## 💬 How Mentions Work

Every file in `.ai/` is part of the workspace knowledge that Copilot Chat can read. When you type `@workspace`, Copilot scans the repository and uses the markdown files as context.

To invoke a specific agent or prompt, **mention it by name** in your message:

| What you want | How to mention it |
|---------------|-------------------|
| Use an agent | `@workspace using @backend, ...` |
| Use a prompt template | `@workspace using the generate-tests prompt, ...` |
| Combine both | `@workspace using @tester and the generate-tests prompt, ...` |
| Use multiple agents | `@workspace using @backend and @security, ...` |
| Reference a skill | `@workspace referring to the laravel-modules skill, ...` |
| Reference a rule | `@workspace following the security-best-practices rule, ...` |

Copilot matches these mentions to the corresponding markdown file names in `.ai/`. The file contents become the instructions that shape the response.

---

## ✏️ Customisation Guide

This system is designed to be **forked and extended** by any developer. No code changes, no build steps — just create markdown files.

---

### 🤖 Adding a Custom Sub-Agent

**Step 1:** Create a new file in `.ai/agents/` with the naming convention:

```
.ai/agents/{name}.agent.md
```

**Step 2:** Use this template:

```markdown
# Agent: {Display Name}

> **Role:** {One-line job title and domain}
> **Use in Copilot Chat:** `@workspace using @{name}, <your request>`

## Persona

Describe who this agent IS. Write in second person ("You are a...").
Include their mindset, expertise, and how they approach problems.
Be specific — the more detail, the better Copilot understands the role.

## Responsibilities

- List specific tasks this agent can perform
- Be concrete: "Write database migrations" not "Help with databases"
- Each bullet should be actionable

## Constraints

- **Never** {things this agent must never do}
- **Always** {things this agent must always do}
- Use bold Never/Always for clarity — LLMs respond well to explicit constraints

## Required Knowledge

Reference the skills and rules this agent should follow.
These links tell Copilot which files to load as context.

### Skills
- [Skill Name](.ai/skills/{file}.md) — brief description
- [Another Skill](.ai/skills/{file}.md) — brief description

### Rules
- [Rule Name](.ai/rules/{file}.md) — brief description
- [Another Rule](.ai/rules/{file}.md) — brief description

## Output Expectations

Describe the format and structure of this agent's responses.
For example: "Return complete, runnable code" or "Use severity-tiered review format."
```

**Step 3:** Register your agent in [`AGENTS.md`](AGENTS.md) by adding a row to the Agents table:

```markdown
| **@my-agent** | [my-agent.agent.md](.ai/agents/my-agent.agent.md) | What it specialises in |
```

**Step 4:** Create a slash command for it in `.vscode/prompts/devops.prompt.md` (see below).

**Step 5:** Use it: `/devops write a Dockerfile for this Laravel app`

#### Example: Creating a `@devops` Agent

1. Create `.ai/agents/devops.agent.md`:

```markdown
# Agent: DevOps Engineer

> **Role:** Senior DevOps Engineer & Infrastructure Specialist
> **Use in Copilot Chat:** `/devops <your request>`

## Persona

You are a Senior DevOps Engineer specialising in CI/CD pipelines,
Docker, Kubernetes, and cloud infrastructure (AWS/GCP). You automate
everything and treat infrastructure as code.

## Responsibilities

- Write Dockerfiles and docker-compose configurations
- Design CI/CD pipelines (GitHub Actions, GitLab CI)
- Configure monitoring, alerting, and logging
- Implement infrastructure as code (Terraform, Pulumi)

## Constraints

- **Never** hard-code secrets — always use environment variables or secret managers
- **Never** run containers as root
- **Always** include health checks in Docker configurations
- **Always** use multi-stage builds to minimise image size

## Required Knowledge

### Skills
- [Git Workflow](.ai/skills/git-workflow.md) — branching and CI triggers

### Rules
- [Security Best Practices](.ai/rules/security-best-practices.md) — secret management

## Output Expectations

- Provide complete, copy-paste-ready configuration files
- Include comments explaining non-obvious decisions
- Specify exact versions for base images and dependencies
```

2. Create `.vscode/prompts/devops.prompt.md` (see next section).
3. Add to `AGENTS.md` agents table.
4. Done. Use it: `/devops write a Dockerfile for this Laravel app`

---

### ⚡ Adding a Custom Slash Command

Every `.md` file in `.vscode/prompts/` becomes a native slash command automatically.

**Step 1:** Create a new file:

```
.vscode/prompts/{command-name}.prompt.md
```

The filename becomes the command name: `devops.prompt.md` → `/devops`

**Step 2:** Use this template:

```markdown
---
mode: 'agent'
description: '{Short description shown in Copilot command list}'
---

You are the **@{agent-name}** agent. Read and adopt the full persona below.

# Agent Definition

#file:../../.ai/agents/{agent-name}.agent.md

# Required Skills

#file:../../.ai/skills/{skill-1}.md
#file:../../.ai/skills/{skill-2}.md

# Required Rules

#file:../../.ai/rules/{rule-1}.md
#file:../../.ai/rules/{rule-2}.md

# Instructions

1. Adopt the @{agent-name} persona completely
2. Apply ALL referenced skills as practical knowledge
3. Enforce ALL referenced rules as non-negotiable constraints
4. {Specific output instructions for this command}
```

> **Key:** The `#file:` syntax tells Copilot to load the referenced file as context.
> Paths are relative to the prompt file location (`.vscode/prompts/`).

**Step 3:** The command is immediately available in Copilot Chat — just type `/` and your command name.

---

### 📚 Adding a Custom Skill

Skills are **practical guides** that teach how to do something.

**Create:** `.ai/skills/{topic}.md`

**Format:**

```markdown
# Skill: {Topic Name}

Brief introduction explaining what this skill covers and when to apply it.

## {Section 1}

Practical instructions with code examples...

## {Section 2}

More instructions...
```

**Then:** Reference it from relevant agent files under `## Required Knowledge > ### Skills`.

---

### 📏 Adding a Custom Rule

Rules are **strict mandates** — violation means rejected code.

**Create:** `.ai/rules/{topic}.md`

**Format:**

```markdown
# Rule: {Topic Name}

Brief introduction explaining why this rule exists and what it governs.

## {Section 1}

The mandate with code examples showing correct vs incorrect patterns...

## {Section 2}

More mandates...
```

**Then:** Reference it from relevant agent files under `## Required Knowledge > ### Rules`.

---

### 📝 Adding a Custom Prompt

Prompts are **reusable task templates** for common workflows.

**Create:** `.ai/prompts/{task-name}.prompt.md`

**Format:**

```markdown
# Prompt: {Task Name}

> **Agent:** [@{agent}](.ai/agents/{agent}.agent.md)
> **Usage:** `@workspace using @{agent} and this prompt, <request>`

## Objective

What this prompt achieves.

## Instructions

Step-by-step instructions for the AI to follow.

## Output Format

How the response should be structured.
```

**Usage:** `@workspace using the {task-name} prompt, do something`

---

### 🔄 Adapting for a Different Tech Stack

This system is currently configured for **Laravel/PHP**, but the architecture is stack-agnostic. To adapt for your stack:

| Step | What to do |
|------|-----------|
| 1 | Fork this repository |
| 2 | Replace `.ai/skills/` files with your stack's patterns (e.g., NestJS, Django, Spring Boot) |
| 3 | Replace `.ai/rules/` files with your team's mandates |
| 4 | Rewrite agent personas in `.ai/agents/` to match your domain |
| 5 | Update prompt templates in `.ai/prompts/` for your workflows |
| 6 | Update `AGENTS.md` to reflect the new content |

The folder structure (`.ai/agents/`, `.ai/skills/`, `.ai/rules/`, `.ai/prompts/`) and the file naming conventions stay the same regardless of tech stack.

---

## 📄 License

MIT
