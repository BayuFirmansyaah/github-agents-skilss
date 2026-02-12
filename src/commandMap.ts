import type { CommandMap } from './types.js';

// ---------------------------------------------------------------------------
// Command → Markdown Mapping (pure config — no logic)
// ---------------------------------------------------------------------------
// Paths are relative to the WORKSPACE ROOT so users can customise them by
// editing the markdown files directly in their project.
// ---------------------------------------------------------------------------

export const COMMAND_MAP: CommandMap = {

    'generate-test': {
        description: 'Generate comprehensive tests for the active file',
        agentFile: 'agents/tester.agent.md',
        skills: [
            'skills/testing-phpunit.md',
            'skills/eloquent-performance.md',
        ],
        rules: [
            'rules/services.md',
            'rules/code-review-checklist.md',
        ],
        promptFile: 'prompts/generate-test.prompt.md',
    },

    'review': {
        description: 'Perform a thorough code review with actionable feedback',
        agentFile: 'agents/reviewer.agent.md',
        skills: [
            'skills/code-style.md',
            'skills/eloquent-performance.md',
            'skills/laravel-modules.md',
        ],
        rules: [
            'rules/code-review-checklist.md',
            'rules/modular-architecture.md',
            'rules/services.md',
        ],
        promptFile: 'prompts/review.prompt.md',
    },

    'new-module': {
        description: 'Scaffold a new module following project architecture',
        agentFile: 'agents/backend.agent.md',
        skills: [
            'skills/laravel-modules.md',
            'skills/api-development.md',
            'skills/eloquent-performance.md',
        ],
        rules: [
            'rules/modular-architecture.md',
            'rules/new-feature.md',
            'rules/database-migrations.md',
        ],
        promptFile: 'prompts/new-module.prompt.md',
    },

    'secure-check': {
        description: 'Audit code for security vulnerabilities',
        agentFile: 'agents/security.agent.md',
        skills: [
            'skills/api-development.md',
            'skills/eloquent-performance.md',
        ],
        rules: [
            'rules/security-best-practices.md',
            'rules/services.md',
        ],
        promptFile: 'prompts/secure-check.prompt.md',
    },

} as const;
