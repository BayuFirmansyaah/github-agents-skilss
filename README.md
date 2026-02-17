# GitHub Agents & Skills

A collection of markdown-based AI agent personas, skills, rules, and prompt templates for GitHub Copilot Chat. No build step, no extensions — just clone it into your project and start using it.

## Table of Contents

- [What This Is](#what-this-is)
- [Getting Started](#getting-started)
- [How to Use](#how-to-use)
- [Contributing](#contributing)

---

## What This Is

This repository contains a set of structured markdown files that act as context for GitHub Copilot Chat. When placed inside your project, Copilot reads them to understand your team's conventions, architecture decisions, and coding standards.

It includes:

- **Agents** — specialized AI personas (backend engineer, tester, reviewer, security auditor) that shape how Copilot responds.
- **Prompts** — reusable task templates for common workflows like code review, test generation, performance audits, and more.
- **Skills** — practical how-to guides covering topics like API development, Eloquent performance, and modular architecture.
- **Rules** — strict coding mandates that agents enforce as non-negotiable constraints.

The whole system is designed around Laravel and PHP, but the structure is stack-agnostic. You can fork it and replace the content for any technology.

---

## Getting Started

Clone this repository as `.github` into the root of your project:

```bash
git clone https://github.com/BayuFirmansyaah/github-agents-skilss.git .github
```

If you don't need the git history:

```bash
rm -rf .github/.git
```

That's it. Open your editor, launch Copilot Chat, and the agents are ready.

If you prefer to track updates as a submodule:

```bash
git submodule add https://github.com/BayuFirmansyaah/github-agents-skilss.git .github
```

---

## How to Use

### Using Agents

Agents are invoked through `@workspace` in Copilot Chat. Each agent has a persona, a set of skills it knows, and rules it enforces.

```
@workspace using @backend, implement a Payment module with DDD structure
```

```
@workspace using @tester, generate PHPUnit tests for the OrderService class
```

```
@workspace using @reviewer, review this pull request
```

```
@workspace using @security, audit this controller for vulnerabilities
```

You can combine agents:

```
@workspace using @backend and @security, build a secure file upload endpoint
```

Available agents:

| Agent | Role |
|-------|------|
| `@backend` | Laravel, DDD, modular architecture, API design |
| `@tester` | PHPUnit, TDD, test factories, coverage |
| `@reviewer` | Code review, quality gates, severity classification |
| `@security` | OWASP Top 10, vulnerability auditing, secure coding |

### Using Prompts

Prompts are structured task templates. Combine them with an agent for best results.

```
@workspace using @backend and the new-module prompt, scaffold an Inventory module
```

```
@workspace using @reviewer and the code-review prompt, review this file
```

```
@workspace using @backend and the performance-audit prompt, audit this repository
```

```
@workspace using @backend and the caching-strategy prompt, design caching for the Product module
```

Available prompts:

| Prompt | What it does |
|--------|-------------|
| `code-review` | Structured code review with severity tiers |
| `generate-tests` | PHPUnit test generation |
| `new-module` | DDD module scaffolding |
| `refactor` | Clean architecture refactoring |
| `security-audit` | OWASP vulnerability assessment |
| `performance-audit` | N+1, memory, caching, query bottlenecks |
| `api-documentation` | REST API docs from controllers |
| `database-optimization` | Index, query, and model optimization |
| `error-handling` | Exception hierarchy and recovery strategies |
| `queue-job-design` | Queue jobs with retry and idempotency |
| `migration-audit` | Safe migration review before deployment |
| `caching-strategy` | Multi-layer caching with invalidation |
| `event-driven-architecture` | Domain events and saga pattern |

### Referencing Skills and Rules

You can also reference individual skills or rules directly:

```
@workspace referring to the eloquent-performance skill, optimize this query
```

```
@workspace following the modular-architecture rule, check if this code violates module boundaries
```

---

## Contributing

This is an open-source project and contributions are welcome.

### How to contribute

1. **Fork** this repository.
2. **Clone** your fork locally.
3. **Create a branch** from `master` for your changes.
4. **Make your changes** — add a new prompt, agent, skill, or rule.
5. **Test** your changes by cloning the fork into a project as `.github` and verifying it works with Copilot Chat.
6. **Commit** using [conventional commits](https://www.conventionalcommits.org/) (e.g. `feat(prompts): add deployment-checklist prompt`).
7. **Push** your branch and open a **Pull Request** against this repository.

### What you can contribute

- New **prompts** for common development workflows (e.g. deployment checklists, CI/CD audit, logging strategy).
- New **agents** for different roles (e.g. DevOps engineer, frontend developer, database administrator).
- New **skills** covering additional technical topics.
- New **rules** for team-specific coding standards.
- Improvements to existing content — better examples, clearer instructions, bug fixes.

### File naming conventions

| Type | Location | Pattern |
|------|----------|---------|
| Agent | `agents/` | `{name}.agent.md` |
| Prompt | `prompts/` | `{task-name}.prompt.md` |
| Skill | `skills/` | `{topic}/SKILL.md` |
| Rule | `rules/` | `{topic}.md` |

After adding a new agent or prompt, register it in [`AGENTS.md`](AGENTS.md) so the orchestrator knows about it.

### Adapting for a different stack

Fork this repository and replace the content in `skills/`, `rules/`, `agents/`, and `prompts/` with your own stack's patterns. The folder structure and naming conventions are the same regardless of technology.

---

## License

MIT
