# Prompt: Generate Tests

> **Agent:** [@tester](.ai/agents/tester.agent.md)
> **Usage:** `@workspace using @tester and this prompt, generate tests for the active file`

## Objective

Analyse the provided source code and generate a **comprehensive PHPUnit test file** that maximises behaviour coverage.

## Instructions

1. **Identify the class under test** — determine its type (Action, Service, Controller, Model, Value Object) and choose the appropriate test type (Unit or Feature).

2. **Map all behaviours** — list every public method and the distinct behaviours it exhibits (success, validation failure, authorization denied, edge cases).

3. **Generate tests for each behaviour:**

   | Behaviour category | What to test |
   |--------------------|-------------|
   | Happy path | Valid input → correct output and side effects |
   | Validation failure | Invalid/missing input → appropriate exception or error response |
   | Authorization | Unauthorized user → 403 or policy denial |
   | Edge cases | Nulls, empty collections, max lengths, duplicate entries |
   | Side effects | Database state, fired events, dispatched jobs, sent notifications |

4. **Use Factories** — create model instances via `Factory::new()` with explicit states. Never hard-code IDs.

5. **Use DataProviders** — for methods that accept multiple input shapes, use `@dataProvider` to avoid test duplication.

6. **Assert precisely** — assert the return value AND all side effects. Use `assertDatabaseHas`, `Event::assertDispatched`, `Queue::assertPushed` where applicable.

## Output Format

```php
<?php

declare(strict_types=1);

namespace Tests\Feature\Modules\{ModuleName};

/**
 * Tests for {ClassName}
 *
 * Coverage:
 * - [list of tested behaviours]
 */
class {ClassName}Test extends TestCase
{
    // ... tests
}
```
