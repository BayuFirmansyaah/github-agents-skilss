# 🤖 Copilot Dev Assistant

A VS Code extension that transforms GitHub Copilot Chat into a modular AI Dev Assistant with specialized sub-agents, custom slash commands, and markdown-driven knowledge.

## ✨ Features

| Command | Agent | Description |
|---------|-------|-------------|
| `/generate-test` | Tester | Generate comprehensive PHPUnit tests |
| `/review` | Reviewer | Perform structured code review |
| `/new-module` | Backend | Scaffold a new Laravel DDD module |
| `/secure-check` | Security | Audit code for vulnerabilities |

**All intelligence lives in markdown files** — customize agents, skills, rules, and prompts without touching TypeScript.

## 📁 Architecture

```
.
├── src/                    # TypeScript orchestration (thin layer)
│   ├── extension.ts        # Registers Copilot Chat participant
│   ├── commandRunner.ts    # Composes prompt & streams response
│   ├── commandMap.ts       # Pure config: command → markdown mapping
│   ├── promptLoader.ts     # File loading utilities
│   └── types.ts            # TypeScript interfaces
│
├── agents/                 # Agent personas (one per role)
│   ├── backend.agent.md
│   ├── tester.agent.md
│   ├── reviewer.agent.md
│   └── security.agent.md
│
├── skills/                 # Practical guides & patterns
├── rules/                  # Strict mandates & checklists
├── prompts/                # Task-specific prompt templates
│
├── package.json
├── tsconfig.json
└── README.md
```

### How a Slash Command Works

```
User types: @agent /review
        │
        ▼
┌─ extension.ts ──────────────────┐
│  Receives request, extracts     │
│  command name → dispatches      │
└──────────┬──────────────────────┘
           ▼
┌─ commandRunner.ts ──────────────┐
│  1. Look up config (commandMap) │
│  2. Load markdown files         │
│  3. Capture active editor code  │
│  4. Compose structured prompt   │
│  5. Send to Copilot model       │
│  6. Stream response back        │
└──────────┬──────────────────────┘
           ▼
    === AGENT ===
    (reviewer persona)
    === SKILLS ===
    (code-style + eloquent + modules)
    === RULES ===
    (review-checklist + architecture + services)
    === TASK ===
    (review prompt template)
    === CODE ===
    (active editor contents)
```

## 🚀 Quick Start

### Prerequisites

- [VS Code](https://code.visualstudio.com/) **1.93+**
- [GitHub Copilot](https://marketplace.visualstudio.com/items?itemName=GitHub.copilot) extension
- [GitHub Copilot Chat](https://marketplace.visualstudio.com/items?itemName=GitHub.copilot-chat) extension
- Node.js **18+**

### Option A: Clone & Debug (Development)

```bash
git clone https://github.com/your-org/copilot-dev-assistant.git
cd copilot-dev-assistant
npm install
npm run compile
```

Then press **F5** in VS Code → launches Extension Development Host.

### Option B: Package & Install (Production)

```bash
npm install
npm run package
```

This produces `copilot-dev-assistant-1.0.0.vsix`. Install it:

```bash
code --install-extension copilot-dev-assistant-1.0.0.vsix
```

Now open **any project** that has `agents/`, `skills/`, `rules/`, and `prompts/` folders — the extension reads from the **workspace root**.

## 🛠 Customization

### Add a New Slash Command

1. **Create the agent** → `agents/my-agent.agent.md`
2. **Create the prompt** → `prompts/my-command.prompt.md`
3. **Register in `commandMap.ts`**:
   ```typescript
   'my-command': {
     description: 'What this command does',
     agentFile: 'agents/my-agent.agent.md',
     skills: ['skills/relevant-skill.md'],
     rules: ['rules/relevant-rule.md'],
     promptFile: 'prompts/my-command.prompt.md',
   },
   ```
4. **Register in `package.json`** under `contributes.chatParticipants[0].commands`:
   ```json
   { "name": "my-command", "description": "What this command does" }
   ```
5. Recompile: `npm run compile`

### Modify Agent Behaviour

Edit any `.md` file in `agents/`, `skills/`, `rules/`, or `prompts/` — **no recompilation needed**. Changes take effect on the next command invocation.

## 📝 Prompt Format

Every slash command assembles this structure before sending to Copilot:

```
=== AGENT ===
(persona and constraints from the agent markdown)

=== SKILLS ===
(concatenated skill files, separated by ---)

=== RULES ===
(concatenated rule files, separated by ---)

=== TASK ===
(prompt template with specific instructions)

=== USER REQUEST ===
(any additional text the user typed after the command)

=== CODE ===
(contents of the active editor, with filename and language)
```

## 📄 License

MIT
