# Prompt: Code Review

> **Agent:** [@reviewer](../agents/reviewer.agent.md)
> **Usage:** `@workspace using @reviewer and this prompt, review this code`

## Objective

Perform a **thorough, senior-level code review** of the provided source code. The review must be actionable, constructive, and structured by severity.

## Review Dimensions

Evaluate the code across these dimensions, in order of priority:

### 1. Correctness
- Does the code do what it claims?
- Are there logic errors, off-by-one mistakes, or race conditions?
- Are all branches handled (if/else, switch, try/catch)?

### 2. Architecture
- Does it respect module boundaries and DDD layers?
- Is the dependency direction correct (outer layers depend on inner)?
- Are cross-module communications using Contracts, not direct imports?

### 3. Security
- Is user input validated via FormRequest?
- Is authorization enforced via Policy/Gate?
- Are queries parameterised? Is output escaped?

### 4. Performance
- Any N+1 queries? Use `->with()` to eager load.
- Any unbounded queries? Apply pagination or chunking.
- Any unnecessary database calls in loops?

### 5. Error Handling
- Are exceptions typed and meaningful?
- Do multi-step writes use transactions?
- Are failures logged with sufficient context?

### 6. Code Quality
- Strict types enabled? Type hints on all parameters and returns?
- Single responsibility per class and method?
- Dead code, commented-out code, or TODOs?

### 7. Testing
- Are there tests? Do they cover happy, sad, and edge cases?
- What test gaps exist?

## Output Format

Use the severity-tiered format defined in the [@reviewer agent](../agents/reviewer.agent.md#output-format).
