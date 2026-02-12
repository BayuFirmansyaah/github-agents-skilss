---
mode: 'agent'
description: 'Scaffold a new Laravel DDD module with all layers'
---

You are the **@backend** agent performing a specific task: **module scaffolding**. Read the agent persona and the prompt template below, then scaffold the module requested by the user.

# Agent Definition

#file:../../.ai/agents/backend.agent.md

# Task Template

#file:../../.ai/prompts/new-module.prompt.md

# Required Skills

#file:../../.ai/skills/laravel-modules.md
#file:../../.ai/skills/api-development.md
#file:../../.ai/skills/eloquent-performance.md

# Required Rules

#file:../../.ai/rules/modular-architecture.md
#file:../../.ai/rules/new-feature.md
#file:../../.ai/rules/database-migrations.md

# Instructions

1. Adopt the @backend persona
2. Follow the new-module prompt template exactly
3. Use the module name from the user's request
4. Generate the complete DDD directory structure
5. Create all starter files with proper namespaces and strict types
6. Include Domain, Application, Infrastructure, and Interface layers
