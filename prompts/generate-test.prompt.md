# Generate Test — Prompt Template

## Objective

Analyse the provided source code and generate a **comprehensive PHPUnit test file** that covers all meaningful behaviours.

## Requirements

1. **Happy-path tests** — verify that valid inputs produce correct outputs and expected side effects.
2. **Sad-path tests** — verify that invalid inputs, missing data, and boundary conditions are handled gracefully.
3. **Edge-case tests** — cover nulls, empty collections, maximum lengths, concurrent access, and type coercion.
4. **Isolation** — mock external dependencies (HTTP clients, mail, queues) but use real database via `RefreshDatabase`.
5. **Factories** — use model factories with explicit states; do not hard-code IDs or magic strings.
6. **Assertions** — assert both return values AND side effects (database rows, dispatched events/jobs, sent notifications).
7. **Naming** — use `test_<behaviour>_when_<condition>` naming convention.
8. **Data providers** — use `@dataProvider` for parameterised scenarios.

## Output Format

Return the complete test file as a single fenced code block with the correct namespace and imports. Add a brief summary of what is covered at the top as a docblock.
