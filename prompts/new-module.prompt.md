# New Module — Prompt Template

## Objective

Scaffold a **complete new Laravel module** following the project's DDD and modular architecture conventions.

## Requirements

1. **Module name** — derive from the user's request or the active file context.
2. **Directory structure** — follow `nwidart/laravel-modules` conventions with DDD layers:
   - `Domain/` — Entities, Value Objects, Aggregates, Domain Events, Repositories (interfaces)
   - `Application/` — Actions, DTOs, Service interfaces
   - `Infrastructure/` — Eloquent models, Repository implementations, Providers
   - `Interface/` — Controllers, Requests, Resources, Routes
3. **Service Provider** — register the module's bindings, event listeners, and routes.
4. **Config & Migrations** — include a module config file and an initial migration.
5. **Contracts** — expose contracts for cross-module communication.
6. **Tests** — scaffold placeholder test classes for unit, feature, and architecture tests.

## Output Format

Provide a complete file tree with all file contents. Each file should be a fenced code block with the file path as the label. Add a brief explanation of each layer's responsibility at the top.
