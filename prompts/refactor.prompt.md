# Prompt: Refactor

> **Agent:** [@backend](../agents/backend.agent.md) or [@reviewer](../agents/reviewer.agent.md)
> **Usage:** `@workspace using @backend and this prompt, refactor this code`

## Objective

Refactor the provided source code to improve **readability, maintainability, and adherence to project architecture** without changing external behaviour.

## Refactoring Principles

1. **Single Responsibility** — each class and method should have exactly one reason to change. Extract classes when a method does too much.

2. **Explicit Dependencies** — replace service location (`app()`, `resolve()`) with constructor injection. Make all dependencies visible in the constructor signature.

3. **Thin Controllers** — controllers should only: validate input, authorize, delegate to an Action, and return a response. Extract business logic into Action classes.

4. **Value Objects over Primitives** — replace raw strings/integers carrying business meaning (email, money, status) with typed Value Objects that self-validate.

5. **Remove Dead Code** — delete commented-out code, unused imports, unreachable branches, and TODO comments older than one sprint.

6. **Naming Clarity** — rename vague variables (`$data`, `$result`, `$item`) to descriptive names (`$orderTotal`, `$activeUser`, `$pendingInvoice`).

7. **Type Safety** — add `declare(strict_types=1)`, complete parameter types, return types, and property types. Eliminate `mixed` where possible.

## Output Format

For each refactoring:

1. **Before** — show the original code snippet
2. **After** — show the refactored code
3. **Rationale** — explain why this change improves the codebase (one sentence)

End with a summary of all changes made.
