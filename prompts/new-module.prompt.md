# Prompt: New Module

> **Agent:** [@backend](../agents/backend.agent.md)
> **Usage:** `@workspace using @backend and this prompt, scaffold a new {ModuleName} module`

## Objective

Scaffold a **complete, production-ready Laravel module** following DDD layered architecture with `nwidart/laravel-modules`.

## Instructions

1. **Determine the module name** from the user's request. Use PascalCase (e.g., `Payment`, `Inventory`, `Notification`).

2. **Create the full directory structure** following the [Laravel Modules skill](../skills/laravel-modules/SKILL.md):

   ```
   Modules/{ModuleName}/
     Application/Actions/
     Application/DTOs/
     Domain/Aggregates/
     Domain/Events/
     Domain/Exceptions/
     Domain/ValueObjects/
     Domain/Contracts/
     Infrastructure/Persistence/Models/
     Infrastructure/Persistence/Repositories/
     Infrastructure/Providers/
     Interfaces/Http/Controllers/
     Interfaces/Http/Requests/
     Interfaces/Http/Resources/
     Interfaces/Routes/
     Database/Migrations/
     Database/Seeders/
     Database/Factories/
     Tests/Unit/
     Tests/Feature/
   ```

3. **Generate starter files for each layer:**

   | Layer | Files to generate |
   |-------|------------------|
   | Domain | At least one Aggregate, one Value Object, and one Contract interface |
   | Application | At least one Action class and its DTO |
   | Infrastructure | Eloquent Model, Repository implementation, ServiceProvider |
   | Interface | Controller with CRUD endpoints, FormRequest, API Resource |
   | Database | Initial migration, Factory, Seeder |
   | Routes | `api.php` and/or `web.php` with resource routes |
   | Tests | Placeholder unit and feature test classes |

4. **All files must include:**
   - `declare(strict_types=1);`
   - Correct namespace
   - All import statements
   - Full type hints on parameters and return types

## Output Format

Provide a **complete file listing** with each file as a fenced code block labelled with the path:

```php
// Modules/{ModuleName}/Domain/Contracts/{Name}Interface.php
```
