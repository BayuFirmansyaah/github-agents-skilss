# 🤖 GitHub Agents & Skills

A **zero-build, prompt-first AI knowledge base** that transforms GitHub Copilot Chat into a team of specialized AI agents. No extension, no compilation — just clone into your project and start using.

## ✨ What This Is

This repository is a collection of markdown files that define **AI agent personas**, **skills**, **rules**, and **reusable prompt templates** for GitHub Copilot Chat. When cloned as `.github` into your project, these files become the context that shapes Copilot's responses via `@workspace`.

**Think of it as an AI team you can clone.**

| Agent | Specialisation |
|-------|----------------|
| 🏗️ **@backend** | Laravel, DDD, modular architecture |
| 🧪 **@tester** | PHPUnit, TDD, test coverage |
| 🔍 **@reviewer** | Code review, quality gates |
| 🛡️ **@security** | OWASP Top 10, vulnerability auditing |

---

## 📁 Repository Structure

```
.
├── AGENTS.md                          # Root orchestrator — Copilot reads this first
├── README.md                          # This file
│
├── agents/                            # Agent persona definitions
│   ├── backend.agent.md               # Senior Backend Engineer
│   ├── tester.agent.md                # QA / Test Engineer
│   ├── reviewer.agent.md              # Code Reviewer
│   └── security.agent.md              # Security Auditor
│
├── prompts/                           # Reusable task prompt templates
│   ├── code-review.prompt.md          # Structured code review
│   ├── generate-tests.prompt.md       # PHPUnit test generation
│   ├── new-module.prompt.md           # DDD module scaffolding
│   ├── refactor.prompt.md             # Code refactoring
│   └── security-audit.prompt.md       # OWASP vulnerability audit
│
├── skills/                            # Practical how-to guides & knowledge
│   ├── api-development/
│   │   └── SKILL.md                   # RESTful API patterns
│   ├── code-style/
│   │   └── SKILL.md                   # Naming & type safety
│   ├── eloquent-performance/
│   │   └── SKILL.md                   # Query optimization
│   ├── git-workflow/
│   │   └── SKILL.md                   # Branching & commits
│   ├── laravel-modules/
│   │   └── SKILL.md                   # Module structure & DDD
│   └── testing-phpunit/
│       └── SKILL.md                   # PHPUnit & TDD
│
└── rules/                             # Strict coding mandates
    ├── code-review-checklist.md        # Review criteria
    ├── database-migrations.md          # Safe migrations
    ├── frontend.md                     # Blade & Alpine
    ├── livewire-components.md          # Livewire patterns
    ├── modular-architecture.md         # Module boundaries
    ├── new-feature.md                  # Feature workflow
    ├── security-best-practices.md      # Input validation & auth
    └── services.md                     # Actions & DTOs
```

---

## 🚀 Installation

### Prerequisites

- [VS Code](https://code.visualstudio.com/) (or any editor with GitHub Copilot Chat support)
- [GitHub Copilot](https://marketplace.visualstudio.com/items?itemName=GitHub.copilot) extension
- [GitHub Copilot Chat](https://marketplace.visualstudio.com/items?itemName=GitHub.copilot-chat) extension

### Setup

Clone this repository **as `.github`** into the root of your existing project:

```bash
cd your-project
git clone https://github.com/<your-org>/github-agents-skilss.git .github
```

> **Why `.github`?** GitHub Copilot Chat automatically scans the workspace for markdown files. By placing agents, prompts, skills, and rules inside `.github/`, they become part of your project's workspace context without cluttering your source tree.

After cloning, your project will look like:

```
your-project/
├── .github/
│   ├── AGENTS.md
│   ├── agents/
│   ├── prompts/
│   ├── skills/
│   └── rules/
├── app/
├── src/
└── ...
```

That's it. No `npm install`. No build step. Just open VS Code and start chatting with Copilot.

> **💡 Tip:** If you want to keep this repo as a Git submodule (so you can pull updates), use:
> ```bash
> git submodule add https://github.com/<your-org>/github-agents-skilss.git .github
> ```

---

## 💬 Usage

Open Copilot Chat (`Ctrl+Shift+I` / `Cmd+Shift+I`) and use `@workspace` to invoke agents:

### Using Agents

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

### Using Prompt Templates

```
@workspace using @tester and the generate-tests prompt, write tests for this file
```

```
@workspace using @backend and the new-module prompt, scaffold a Payment module
```

### Combining Agents

```
@workspace using @backend and @security, implement a secure Payment module
```

### Referencing Skills & Rules

```
@workspace referring to the laravel-modules skill, explain module structure
```

```
@workspace following the security-best-practices rule, review this controller
```

### How Mentions Work

Every markdown file in the workspace is knowledge that Copilot Chat can read. When you type `@workspace`, Copilot scans the repository and uses the markdown files as context.

| What you want | How to mention it |
|---------------|-------------------|
| Use an agent | `@workspace using @backend, ...` |
| Use a prompt template | `@workspace using the generate-tests prompt, ...` |
| Combine both | `@workspace using @tester and the generate-tests prompt, ...` |
| Use multiple agents | `@workspace using @backend and @security, ...` |
| Reference a skill | `@workspace referring to the laravel-modules skill, ...` |
| Reference a rule | `@workspace following the security-best-practices rule, ...` |

---

## 🛠 How It Works

```
User types: @workspace using @backend, implement Payment module
               │
               ▼
┌─ Copilot scans workspace ────────────┐
│  Finds AGENTS.md (root orchestrator) │
│  Loads referenced files:             │
│    → agents/backend.agent.md         │
│    → skills/laravel-modules/SKILL.md │
│    → skills/eloquent-performance/    │
│    → rules/modular-architecture.md   │
│    → rules/services.md              │
│  All combined into one context       │
│  Copilot adopts persona + rules      │
│  Generates specialized response      │
└──────────────────────────────────────┘
```

1. `AGENTS.md` is the root orchestrator — Copilot reads it first
2. Agent files reference **skills** and **rules** via markdown links
3. Copilot resolves all references and loads the full context
4. The agent **persona**, **skills**, and **rules** shape the response
5. No build, no runtime, no extension — just markdown composition

---

## 🤝 Contributing

We welcome contributions! You can contribute new **prompts**, **agents**, **skills**, or **rules**.

### Adding a Custom Prompt

Prompts are **reusable task templates** for common workflows.

**Step 1:** Create a new file in `prompts/`:

```
prompts/{task-name}.prompt.md
```

**Step 2:** Use this template:

```markdown
# Prompt: {Task Name}

> **Agent:** [@{agent-name}](agents/{agent-name}.agent.md)
> **Usage:** `@workspace using @{agent-name} and this prompt, <your request>`

## Objective

What this prompt achieves. Be specific about the end goal.

## Instructions

Step-by-step instructions for the AI to follow.

1. First, analyze the provided code / context
2. Then, perform the specific task
3. Finally, output the result

## Output Format

How the response should be structured.
Use tables, code blocks, and headers as needed.
```

**Step 3:** Test your prompt by using it in Copilot Chat:

```
@workspace using the {task-name} prompt, <your request>
```

---

### Adding a Custom Agent

Agents are **specialized personas** with defined expertise and constraints.

**Step 1:** Create a new file in `agents/`:

```
agents/{name}.agent.md
```

**Step 2:** Use this template:

```markdown
# Agent: {Display Name}

> **Role:** {One-line job title and domain}
> **Use in Copilot Chat:** `@workspace using @{name}, <your request>`

## Persona

Describe who this agent IS. Write in second person ("You are a...").
Include their mindset, expertise, and how they approach problems.

## Responsibilities

- List specific tasks this agent can perform
- Be concrete: "Write database migrations" not "Help with databases"

## Constraints

- **Never** {things this agent must never do}
- **Always** {things this agent must always do}

## Required Knowledge

### Skills
- [Skill Name](skills/{topic}/SKILL.md) — brief description

### Rules
- [Rule Name](rules/{file}.md) — brief description

## Output Expectations

Describe the format and structure of this agent's responses.
```

**Step 3:** Register your agent in [`AGENTS.md`](AGENTS.md) by adding a row to the Agents table.

---

### Adding a Custom Skill

Skills are **practical guides** that teach how to do something. Each skill lives in its own folder.

**Step 1:** Create a new folder and `SKILL.md` file:

```
skills/{topic}/SKILL.md
```

**Step 2:** Use this template:

```markdown
# Skill: {Topic Name}

Brief introduction explaining what this skill covers and when to apply it.

## {Section 1}

Practical instructions with code examples...

## {Section 2}

More instructions...
```

> **💡 Tip:** You can add additional files inside the skill folder (e.g., `examples/`, `scripts/`) for more complex skills that need supporting resources.

**Then:** Reference it from relevant agent files under `## Required Knowledge > ### Skills`.

---

### Adding a Custom Rule

Rules are **strict mandates** — violation means rejected code.

**Create:** `rules/{topic}.md`

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

### Contribution Workflow

1. **Fork** this repository
2. **Create a branch** for your changes: `git checkout -b feat/add-devops-agent`
3. **Add your files** following the templates and naming conventions above
4. **Test your changes** by cloning into a project's `.github/` and verifying with Copilot Chat
5. **Submit a Pull Request** with a clear description of what you added and why

#### Naming Conventions

| Type | File Location | Naming Pattern | Example |
|------|---------------|----------------|---------|
| Agent | `agents/` | `{name}.agent.md` | `devops.agent.md` |
| Prompt | `prompts/` | `{task-name}.prompt.md` | `deploy.prompt.md` |
| Skill | `skills/` | `{topic}/SKILL.md` | `docker-containers/SKILL.md` |
| Rule | `rules/` | `{topic}.md` | `ci-cd-pipeline.md` |

---

### 🔄 Adapting for a Different Tech Stack

This system is currently configured for **Laravel/PHP**, but the architecture is stack-agnostic. To adapt for your stack:

| Step | What to do |
|------|------------|
| 1 | Fork this repository |
| 2 | Replace `skills/` files with your stack's patterns (e.g., NestJS, Django, Spring Boot) |
| 3 | Replace `rules/` files with your team's mandates |
| 4 | Rewrite agent personas in `agents/` to match your domain |
| 5 | Update prompt templates in `prompts/` for your workflows |
| 6 | Update `AGENTS.md` to reflect the new content |

The folder structure (`agents/`, `skills/`, `rules/`, `prompts/`) and the file naming conventions stay the same regardless of tech stack.

---

## 📄 License

MIT
