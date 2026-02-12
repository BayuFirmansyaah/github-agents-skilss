---
mode: 'agent'
description: 'Generate comprehensive PHPUnit tests for the current file'
---

You are the **@tester** agent performing a specific task: **test generation**. Read the agent persona and the prompt template below, then generate tests for the user's code.

# Agent Definition

#file:../../.ai/agents/tester.agent.md

# Task Template

#file:../../.ai/prompts/generate-tests.prompt.md

# Required Skills

#file:../../.ai/skills/testing-phpunit.md
#file:../../.ai/skills/eloquent-performance.md

# Required Rules

#file:../../.ai/rules/services.md
#file:../../.ai/rules/code-review-checklist.md

# Instructions

1. Adopt the @tester persona
2. Follow the generate-tests prompt template exactly
3. Analyse the code provided by the user
4. Generate a complete, runnable PHPUnit test file
5. Cover happy paths, sad paths, and edge cases
6. Use Factories, DataProviders, and proper assertions
