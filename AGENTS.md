# AGENTS.md - The Agent Knowledge Base

## 🌍 Context & Philosophy
Welcome, Agent. You are contributing to a **Large Scale, Enterprise-Grade Modular Laravel Application**.

This system is designed not just to work, but to **scale** and **endure**.
-   **We prioritize ROBUSTNESS over speed.**
-   **We prioritize EXPLICITNESS over "magic".**
-   **We prioritize ISOLATION over convenience.**

Every line of code you write must respect the modular boundaries. A shortcut today is a technical debt disaster tomorrow.

---

## 📂 Navigation

### 🛠 [Skills](skills/)
Master the tools and patterns required for this architecture.
-   **[Laravel Modules (DDD)](skills/laravel-modules.md)**: Domain-Driven Design, Aggregates, and Sagas.
-   **[Eloquent Performance](skills/eloquent-performance.md)**: Caching, Locking, and efficient querying.
-   **[API Development](skills/api-development.md)**: Versioning, Idempotency, and standard responses.
-   **[Testing](skills/testing-phpunit.md)**: Architecture Tests, Contract Tests, and TDD.
-   **[Git Workflow](skills/git-workflow.md)**: Conventional Commits and PR etiquette.
-   **[Code Style](skills/code-style.md)**: Strict typing and formatting.

### 📜 [Rules](rules/)
**NON-NEGOTIABLE** governance. Violation = Rejection.
-   **[Modular Architecture](rules/modular-architecture.md)**: Anti-Corruption Layers, Sync vs Async communication.
-   **[Services & Actions](rules/services.md)**: DTOs, Action Classes, and Dependency Injection.
-   **[Security](rules/security-best-practices.md)**: Audit Logging, Supply Chain Security, and PII protection.
-   **[Database Migrations](rules/database-migrations.md)**: Zero-downtime deployment rules.
-   **[New Feature Workflow](rules/new-feature.md)**: From requirements to production.
-   **[Frontend Integration](rules/frontend.md)**: Asset management and API consumption.
-   **[Livewire Components](rules/livewire-components.md)**: Best practices for Livewire & AlpineJS.
-   **[Code Review Checklist](rules/code-review-checklist.md)**: Self-correction before submission.

---

## 🏗 Architectural Pillars

### 1. Hexagonal / Clean Architecture (Modified)
We use a pragmatic blend of DDD and Hexagonal Architecture.
-   **Domain**: The core business logic (Aggregates, Value Objects). Pure PHP. No Framework dependency if possible.
-   **Application**: Use Cases (Actions, Jobs). Orchestrates the Domain.
-   **Infrastructure**: Database, API calls, File System. The "Details".

### 2. Event-Driven Consistency
Because modules are isolated, we cannot use reliable database joins or transactions across boundaries.
-   We use **Domain Events** to trigger side effects.
-   We use **Sagas** to manage distributed transactions.
-   We accept **Eventual Consistency**.

### 3. Observable Systems
A system that cannot be debugged is a broken system.
-   **Audit Logs**: Who did what?
-   **Business Metrics**: How many orders per minute?
-   **Health Checks**: Is the payment gateway up?

---

> "Legacy code is code without tests." — Michael Feathers
>
> **Your code is Legacy the moment you write it if it violates these principles.**
