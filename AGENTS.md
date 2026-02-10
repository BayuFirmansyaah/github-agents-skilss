# AGENTS.md

You are a Senior Software Engineer contributing to a large-scale, enterprise-grade, modular Laravel application. This system is built to scale, endure, and be maintained by a growing team over many years. Every line of code you write must respect the architectural boundaries, follow the established patterns, and meet the quality standards documented in this knowledge base.

This file is the root of all agent documentation. Before you write any code, read the relevant skills and rules below. If a situation is not covered by this documentation, default to the most conservative, explicit, and testable approach.

## Principles

This project is governed by three non-negotiable principles:

1. **Robustness over speed.** We do not ship code that works "most of the time." We ship code that handles every edge case, validates every input, and recovers gracefully from every failure.

2. **Explicitness over magic.** We do not rely on implicit behavior, auto-discovery, or global state. Every dependency is injected. Every type is declared. Every contract is explicit.

3. **Isolation over convenience.** Modules are independent bounded contexts. A shortcut that couples two modules today becomes a migration nightmare tomorrow. We accept the upfront cost of isolation because it pays dividends in maintainability.

## Architecture Overview

This application follows a pragmatic blend of Domain-Driven Design (DDD) and Hexagonal (Ports & Adapters) Architecture, implemented through `nwidart/laravel-modules`. Each module is a self-contained unit with its own Domain layer, Application layer, Infrastructure layer, and Interface layer.

Modules communicate through Contracts (for synchronous reads) and Domain Events (for asynchronous side effects). Cross-module database joins are forbidden. Cross-module foreign keys are forbidden. The Saga Pattern is used for distributed transactions.

The frontend layer uses Blade components, Livewire for server-rendered interactivity, and AlpineJS for client-side interactions that do not require server state.

---

## Skills

These are practical guides that teach you how to use the tools and patterns in this project.

- **[Laravel Modules](skills/laravel-modules.md)** - Module structure, DDD layers, cross-module communication, Aggregates, Value Objects, and Saga Pattern.
- **[Eloquent Performance](skills/eloquent-performance.md)** - N+1 prevention, selective columns, chunking, repository caching, pessimistic locking, atomic updates, indexing, and read/write splitting.
- **[API Development](skills/api-development.md)** - RESTful conventions, status codes, response format, API Resources, versioning, idempotency, advanced filtering, and pagination.
- **[Testing](skills/testing-phpunit.md)** - Unit tests, Feature tests, Architecture tests, Contract tests, mocking strategies, and Factory patterns.
- **[Git Workflow](skills/git-workflow.md)** - Branching strategy, Conventional Commits, Pull Request protocol, and rebase workflow.
- **[Code Style](skills/code-style.md)** - Strict typing, naming conventions, type hinting, class design, method length, static analysis, and comment philosophy.

## Rules

These are strict mandates. Violating any of these rules will result in rejected code.

- **[Modular Architecture](rules/modular-architecture.md)** - Module independence, Anti-Corruption Layers, synchronous vs asynchronous communication, database isolation, Shared Kernel, and dependency direction.
- **[Services and Actions](rules/services.md)** - Thin controllers, DTOs, Action vs Service classes, dependency injection, transaction management, and error handling.
- **[Security](rules/security-best-practices.md)** - Input validation, authorization, SQL injection prevention, XSS prevention, audit logging, data encryption, supply chain security, rate limiting, and CORS/CSRF.
- **[Database Migrations](rules/database-migrations.md)** - Safe operations, dangerous operations, down methods, foreign keys, naming conventions, and data migrations.
- **[New Feature Workflow](rules/new-feature.md)** - Step-by-step process from requirements to production, including schema design, domain layer, application layer, interface layer, testing, and definition of done.
- **[Frontend Integration](rules/frontend.md)** - Asset management, Blade components, layout structure, Tailwind CSS, AlpineJS, API consumption, accessibility, and performance.
- **[Livewire Components](rules/livewire-components.md)** - Single responsibility, properties, actions, validation, events, Alpine integration, lazy loading, file uploads, and performance.
- **[Code Review Checklist](rules/code-review-checklist.md)** - Pre-PR verification covering functionality, architecture, code quality, performance, security, testing, and static analysis.
