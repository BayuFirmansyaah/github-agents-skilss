# Prompt: Migration Audit

> **Agent:** [@backend](../agents/backend.agent.md) or [@reviewer](../agents/reviewer.agent.md)
> **Usage:** `@workspace using @backend and this prompt, audit these database migrations`

## Objective

Audit the provided database migrations for **safety, correctness, and production readiness**. Migrations in a large-scale application are deployment events — a bad migration can cause downtime, data loss, or irreversible damage.

## Audit Checklist

| # | Category | What to look for |
|---|----------|-----------------|
| 1 | **Destructive Operations** | Column drops, table drops, type changes without data migration |
| 2 | **Locking Risk** | `ALTER TABLE` on large tables without online DDL strategy |
| 3 | **Missing Down Method** | `down()` not implemented or not reversible |
| 4 | **Index Safety** | Missing indexes on foreign keys, missing composite indexes for common queries |
| 5 | **Naming Conventions** | Table/column names not following snake_case, unclear abbreviations |
| 6 | **Default Values** | Missing defaults for non-nullable columns on existing tables |
| 7 | **Foreign Key Constraints** | Missing ON DELETE/UPDATE behavior, cascading too aggressively |
| 8 | **Data Type Appropriateness** | Using `string` for dates, `text` for short values, integers for monetary values |
| 9 | **Ordering Dependencies** | Migrations referencing tables that may not exist yet |
| 10 | **Zero-Downtime Compatibility** | Changes that require application code changes (rename column, remove column) |

## Output Format

### Findings

For each issue:

| Field | Detail |
|-------|--------|
| **Severity** | 🔴 Blocking / 🟠 Warning / 🟡 Suggestion |
| **Migration** | File name |
| **Line** | Line number |
| **Problem** | What's wrong |
| **Risk** | What could go wrong in production |
| **Fix** | Corrected migration code |

### Safe Migration Checklist

- [ ] All `down()` methods are correctly implemented
- [ ] No destructive operations without explicit data migration plan
- [ ] All foreign keys have proper indexes
- [ ] All new columns on existing tables have default values or are nullable
- [ ] Migration order respects table dependencies
- [ ] Large table alterations use batch/chunk strategy
