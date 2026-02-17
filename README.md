# 🤖 GitHub Agents & Skills

A **zero-build, prompt-first AI knowledge base** that transforms GitHub Copilot Chat into a team of specialized AI agents. No extension, no compilation — just clone into your project and start using.

---

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
│   ├── api-documentation.prompt.md    # REST API documentation generation
│   ├── caching-strategy.prompt.md     # Multi-layer caching design
│   ├── code-review.prompt.md          # Structured code review
│   ├── database-optimization.prompt.md # Index & query optimization
│   ├── error-handling.prompt.md       # Exception hierarchy & recovery
│   ├── event-driven-architecture.prompt.md # Domain events & saga pattern
│   ├── generate-tests.prompt.md       # PHPUnit test generation
│   ├── migration-audit.prompt.md      # Safe migration review
│   ├── new-module.prompt.md           # DDD module scaffolding
│   ├── performance-audit.prompt.md    # Performance bottleneck detection
│   ├── queue-job-design.prompt.md     # Queue jobs with retry & idempotency
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

### Step 1 — Clone as `.github`

Navigate to your existing project and clone this repository as the `.github` directory:

```bash
cd your-project
git clone https://github.com/<your-org>/github-agents-skilss.git .github
```

### Step 2 — Remove Git History (Optional)

If you don't need the git history from this repo (recommended for most projects):

```bash
rm -rf .github/.git
```

This makes the files part of your own project's git repository instead of a nested repo.

### Step 3 — Open VS Code & Start Using

```bash
code .
```

Open Copilot Chat (`Ctrl+Shift+I` / `Cmd+Shift+I`) and you're ready to go. No `npm install`, no build step.

### Result

After cloning, your project structure will look like:

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

> **Why `.github`?** GitHub Copilot Chat automatically scans workspace files. Placing agents and prompts inside `.github/` keeps them organized and out of your source tree while remaining fully accessible to Copilot.

### Alternative: Git Submodule

If you want to pull future updates automatically:

```bash
git submodule add https://github.com/<your-org>/github-agents-skilss.git .github
git commit -m "chore: add AI agents as submodule"
```

To update later:

```bash
git submodule update --remote .github
```

---

## 💬 Usage

### Invoking Agents

Open Copilot Chat and use `@workspace` to invoke an agent:

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

Combine an agent with a prompt template for structured tasks:

```
@workspace using @tester and the generate-tests prompt, write tests for this file
```

```
@workspace using @backend and the new-module prompt, scaffold a Payment module
```

```
@workspace using @reviewer and the code-review prompt, review this pull request
```

### Combining Multiple Agents

```
@workspace using @backend and @security, implement a secure Payment module
```

### Referencing Skills & Rules Directly

```
@workspace referring to the laravel-modules skill, explain module structure
```

```
@workspace following the security-best-practices rule, review this controller
```

### Quick Reference

| What you want | How to mention it |
|---------------|-------------------|
| Use an agent | `@workspace using @backend, ...` |
| Use a prompt template | `@workspace using the generate-tests prompt, ...` |
| Combine agent + prompt | `@workspace using @tester and the generate-tests prompt, ...` |
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

We welcome contributions! Whether you want to add a new **prompt**, **agent**, **skill**, or **rule**, follow the workflow below.

### Contribution Workflow (Fork & Pull Request)

```
┌──────────────────────────────────────────────────────┐
│  1. Fork    →  2. Clone  →  3. Branch  →  4. Add    │
│  5. Test    →  6. Commit →  7. Push    →  8. PR     │
└──────────────────────────────────────────────────────┘
```

#### Step 1 — Fork the Repository

Click the **Fork** button on the [GitHub repository page](https://github.com/<your-org>/github-agents-skilss) to create your own copy.

#### Step 2 — Clone Your Fork

```bash
git clone https://github.com/<your-username>/github-agents-skilss.git
cd github-agents-skilss
```

#### Step 3 — Create a Branch

Use a descriptive branch name following conventional patterns:

```bash
# Adding a new prompt
git checkout -b feat/add-performance-audit-prompt

# Adding a new agent
git checkout -b feat/add-devops-agent

# Adding a new skill
git checkout -b feat/add-queue-management-skill
```

#### Step 4 — Add Your Files

Follow the templates below depending on what you're adding:

- [Adding a Prompt](#-adding-a-new-prompt)
- [Adding an Agent](#-adding-a-new-agent)
- [Adding a Skill](#-adding-a-new-skill)
- [Adding a Rule](#-adding-a-new-rule)

#### Step 5 — Test Your Changes

Clone your fork into a test project as `.github` and verify:

```bash
cd ~/your-test-project
git clone /path/to/your/fork .github

# Open VS Code and test in Copilot Chat
code .
```

Verify that:
- ✅ Copilot recognizes your new prompt/agent when using `@workspace`
- ✅ All markdown links resolve correctly
- ✅ The response follows the expected format

#### Step 6 — Commit Your Changes

Use [Conventional Commits](https://www.conventionalcommits.org/):

```bash
git add .
git commit -m "feat(prompts): add performance-audit prompt for database optimization"
```

#### Step 7 — Push to Your Fork

```bash
git push origin feat/add-performance-audit-prompt
```

#### Step 8 — Open a Pull Request

1. Go to your fork on GitHub
2. Click **"Compare & pull request"**
3. Fill in the PR template:
   - **Title:** `feat(prompts): add performance-audit prompt`
   - **Description:**
     - What the prompt/agent/skill does
     - Example usage in Copilot Chat
     - Why it's useful for the team
4. Submit and wait for review

---

### 📝 Adding a New Prompt

Prompts are **reusable task templates** for common workflows.

**Create:** `prompts/{task-name}.prompt.md`

```markdown
# Prompt: {Task Name}

> **Agent:** [@{agent-name}](../agents/{agent-name}.agent.md)
> **Usage:** `@workspace using @{agent-name} and this prompt, <request>`

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

**Test it:**

```
@workspace using the {task-name} prompt, <your request>
```

---

### 🤖 Adding a New Agent

Agents are **specialized personas** with defined expertise and constraints.

**Create:** `agents/{name}.agent.md`

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
- [Skill Name](../skills/{topic}/SKILL.md) — brief description

### Rules
- [Rule Name](../rules/{file}.md) — brief description

## Output Expectations

Describe the format and structure of this agent's responses.
```

**Then:** Register it in [`AGENTS.md`](AGENTS.md) by adding a row to the Agents table.

---

### 📚 Adding a New Skill

Skills are **practical how-to guides**. Each skill lives in its own folder.

**Create:** `skills/{topic}/SKILL.md`

```markdown
# Skill: {Topic Name}

Brief introduction explaining what this skill covers and when to apply it.

## {Section 1}

Practical instructions with code examples...

## {Section 2}

More instructions...
```

> **💡 Tip:** You can add supporting files inside the skill folder (e.g., `examples/`, `scripts/`).

**Then:** Reference it from relevant agent files under `## Required Knowledge > ### Skills`.

---

### 📏 Adding a New Rule

Rules are **strict mandates** — violation means rejected code.

**Create:** `rules/{topic}.md`

```markdown
# Rule: {Topic Name}

Brief introduction explaining why this rule exists.

## {Section 1}

The mandate with code examples showing correct vs incorrect patterns...
```

**Then:** Reference it from relevant agent files under `## Required Knowledge > ### Rules`.

---

### Naming Conventions

| Type | Location | Naming Pattern | Example |
|------|----------|----------------|---------|
| Agent | `agents/` | `{name}.agent.md` | `devops.agent.md` |
| Prompt | `prompts/` | `{task-name}.prompt.md` | `deploy.prompt.md` |
| Skill | `skills/` | `{topic}/SKILL.md` | `docker-containers/SKILL.md` |
| Rule | `rules/` | `{topic}.md` | `ci-cd-pipeline.md` |

---

### 🔄 Adapting for a Different Tech Stack

This system is currently configured for **Laravel/PHP**, but the architecture is stack-agnostic:

| Step | What to do |
|------|------------|
| 1 | Fork this repository |
| 2 | Replace `skills/` with your stack's patterns (e.g., NestJS, Django, Spring Boot) |
| 3 | Replace `rules/` with your team's mandates |
| 4 | Rewrite agent personas in `agents/` to match your domain |
| 5 | Update prompt templates in `prompts/` for your workflows |
| 6 | Update `AGENTS.md` to reflect the new content |

The folder structure and naming conventions stay the same regardless of tech stack.

---

## 📄 License

MIT
