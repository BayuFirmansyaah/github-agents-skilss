# Code Review — Prompt Template

## Objective

Perform a **thorough, senior-level code review** of the provided source code. Your review must be actionable and constructive.

## Review Checklist

1. **Correctness** — Does the code do what it claims? Are there logic errors or off-by-one mistakes?
2. **Architecture** — Does it respect module boundaries, DDD layers, and dependency direction?
3. **Performance** — Any N+1 queries, missing indexes, unnecessary eager loads, or unbounded loops?
4. **Security** — Unvalidated input, mass assignment, raw SQL, missing authorization?
5. **Error Handling** — Proper exception types, rollback on failure, meaningful error messages?
6. **Code Style** — Naming, strict types, single responsibility, method length, dead code?
7. **Testing** — Is the code testable? Are there tests? What gaps exist?

## Output Format

Use this structure:

### 🔴 Critical Issues
(blocking — must fix before merge)

### 🟠 Warnings
(should fix — risk of bugs or tech debt)

### 🟡 Suggestions
(nice to have — improve readability or performance)

### 🟢 What's Good
(acknowledge well-written code)

### Verdict
✅ Approve / ⚠️ Approve with comments / ❌ Request changes
