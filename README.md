# 🤖 GitHub Agents & Skills

A **zero-build, prompt-first AI knowledge base** for GitHub Copilot Chat. Clone into your project as `.github` and get a team of specialized AI agents — no extension, no build step.

| Agent | Specialisation |
|-------|----------------|
| 🏗️ **@backend** | Laravel, DDD, modular architecture |
| 🧪 **@tester** | PHPUnit, TDD, test coverage |
| 🔍 **@reviewer** | Code review, quality gates |
| 🛡️ **@security** | OWASP Top 10, vulnerability auditing |

---

## � Table of Contents

- [Installation](#-installation)
- [Usage](#-usage)
- [Available Prompts](#-available-prompts)
- [Repository Structure](#-repository-structure)
- [Contributing (Fork & PR)](#-contributing)
- [Adapting for Other Stacks](#-adapting-for-a-different-tech-stack)

---

## 🚀 Installation

```bash
# 1. Clone into your project as .github
cd your-project
git clone https://github.com/<your-org>/github-agents-skilss.git .github

# 2. Remove nested git history (optional but recommended)
rm -rf .github/.git

# 3. Open VS Code and start using Copilot Chat
code .
```

> **Alternative — Git Submodule** (for pulling future updates):
> ```bash
> git submodule add https://github.com/<your-org>/github-agents-skilss.git .github
> ```

---

## 💬 Usage

Open Copilot Chat (`Cmd+Shift+I`) and use `@workspace`:

```
@workspace using @backend, implement a new Payment module
@workspace using @tester, generate PHPUnit tests for the active file
@workspace using @reviewer, review this code
@workspace using @security, audit this file for vulnerabilities
```

**Combine agent + prompt:**

```
@workspace using @backend and the new-module prompt, scaffold a Payment module
@workspace using @tester and the generate-tests prompt, write tests for this file
```

**Combine multiple agents:**

```
@workspace using @backend and @security, implement a secure Payment module
```

| Action | Syntax |
|--------|--------|
| Use agent | `@workspace using @backend, ...` |
| Use prompt | `@workspace using the generate-tests prompt, ...` |
| Agent + prompt | `@workspace using @tester and the generate-tests prompt, ...` |
| Multiple agents | `@workspace using @backend and @security, ...` |
| Reference skill | `@workspace referring to the laravel-modules skill, ...` |
| Reference rule | `@workspace following the security-best-practices rule, ...` |

---

## � Available Prompts

| Prompt | Usage | Purpose |
|--------|-------|---------|
| **Code Review** | `the code-review prompt` | Structured, severity-tiered review |
| **Generate Tests** | `the generate-tests prompt` | Comprehensive PHPUnit test generation |
| **New Module** | `the new-module prompt` | Scaffold a DDD Laravel module |
| **Refactor** | `the refactor prompt` | Clean architecture refactoring |
| **Security Audit** | `the security-audit prompt` | OWASP-aligned vulnerability assessment |
| **Performance Audit** | `the performance-audit prompt` | N+1, memory, caching, query bottlenecks |
| **API Documentation** | `the api-documentation prompt` | Generate REST API docs from controllers |
| **Database Optimization** | `the database-optimization prompt` | Index, query, and model optimization |
| **Error Handling** | `the error-handling prompt` | Exception hierarchy & recovery strategies |
| **Queue & Job Design** | `the queue-job-design prompt` | Queue jobs with retry & idempotency |
| **Migration Audit** | `the migration-audit prompt` | Safe migration review before deploy |
| **Caching Strategy** | `the caching-strategy prompt` | Multi-layer caching with invalidation |
| **Event-Driven Architecture** | `the event-driven-architecture prompt` | Domain events & saga pattern |

---

## 📁 Repository Structure

```
.
├── AGENTS.md                              # Root orchestrator
├── agents/                                # Agent personas
│   ├── backend.agent.md
│   ├── tester.agent.md
│   ├── reviewer.agent.md
│   └── security.agent.md
├── prompts/                               # Task prompt templates
│   ├── api-documentation.prompt.md
│   ├── caching-strategy.prompt.md
│   ├── code-review.prompt.md
│   ├── database-optimization.prompt.md
│   ├── error-handling.prompt.md
│   ├── event-driven-architecture.prompt.md
│   ├── generate-tests.prompt.md
│   ├── migration-audit.prompt.md
│   ├── new-module.prompt.md
│   ├── performance-audit.prompt.md
│   ├── queue-job-design.prompt.md
│   ├── refactor.prompt.md
│   └── security-audit.prompt.md
├── skills/                                # How-to guides
│   ├── api-development/SKILL.md
│   ├── code-style/SKILL.md
│   ├── eloquent-performance/SKILL.md
│   ├── git-workflow/SKILL.md
│   ├── laravel-modules/SKILL.md
│   └── testing-phpunit/SKILL.md
└── rules/                                 # Strict coding mandates
    ├── code-review-checklist.md
    ├── database-migrations.md
    ├── frontend.md
    ├── livewire-components.md
    ├── modular-architecture.md
    ├── new-feature.md
    ├── security-best-practices.md
    └── services.md
```

---

## 🤝 Contributing

We use **Fork & Pull Request** workflow.

### Quick Start

```bash
# 1. Fork this repo on GitHub, then clone your fork
git clone https://github.com/<your-username>/github-agents-skilss.git
cd github-agents-skilss

# 2. Create a branch
git checkout -b feat/add-your-contribution

# 3. Add your files (see templates below)

# 4. Test by cloning into a project's .github/ and using Copilot Chat

# 5. Commit, push, and open a Pull Request
git add .
git commit -m "feat(prompts): add deployment-checklist prompt"
git push origin feat/add-your-contribution
```

Then open a **Pull Request** on GitHub with:
- What you added and why
- Example usage in Copilot Chat

### Naming Conventions

| Type | Location | Pattern | Example |
|------|----------|---------|---------|
| Agent | `agents/` | `{name}.agent.md` | `devops.agent.md` |
| Prompt | `prompts/` | `{task}.prompt.md` | `deploy.prompt.md` |
| Skill | `skills/` | `{topic}/SKILL.md` | `docker/SKILL.md` |
| Rule | `rules/` | `{topic}.md` | `ci-cd.md` |

### Templates

<details>
<summary><strong>📝 New Prompt Template</strong></summary>

Create `prompts/{task-name}.prompt.md`:

```markdown
# Prompt: {Task Name}

> **Agent:** [@{agent}](../agents/{agent}.agent.md)
> **Usage:** `@workspace using @{agent} and this prompt, <request>`

## Objective
What this prompt achieves.

## Instructions
1. Step one
2. Step two

## Output Format
How the response should be structured.
```

</details>

<details>
<summary><strong>🤖 New Agent Template</strong></summary>

Create `agents/{name}.agent.md`:

```markdown
# Agent: {Display Name}

> **Role:** {Job title}
> **Usage:** `@workspace using @{name}, <request>`

## Persona
You are a... (second person)

## Responsibilities
- Specific tasks

## Constraints
- **Never** ...
- **Always** ...

## Required Knowledge
### Skills
- [Skill](../skills/{topic}/SKILL.md)
### Rules
- [Rule](../rules/{file}.md)
```

Register in `AGENTS.md`.

</details>

<details>
<summary><strong>📚 New Skill Template</strong></summary>

Create `skills/{topic}/SKILL.md`:

```markdown
# Skill: {Topic Name}

Brief introduction.

## {Section}
Practical instructions with code examples...
```

Reference from agent files.

</details>

<details>
<summary><strong>📏 New Rule Template</strong></summary>

Create `rules/{topic}.md`:

```markdown
# Rule: {Topic Name}

Why this rule exists.

## {Section}
Correct vs incorrect patterns...
```

Reference from agent files.

</details>

---

## 🔄 Adapting for a Different Tech Stack

This system is Laravel/PHP but the architecture is **stack-agnostic**. Fork and replace:

1. `skills/` → Your stack's patterns (NestJS, Django, Spring Boot, etc.)
2. `rules/` → Your team's mandates
3. `agents/` → Your domain personas
4. `prompts/` → Your workflows
5. `AGENTS.md` → Updated references

---

## 📄 License

MIT
