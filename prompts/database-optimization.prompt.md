# Prompt: Database Optimization

> **Agent:** [@backend](../agents/backend.agent.md)
> **Usage:** `@workspace using @backend and this prompt, optimize the database layer for this module`

## Objective

Analyse the database layer (migrations, models, repositories, queries) of the provided code and generate **optimization recommendations** for production-scale performance. Focus on queries that will degrade as data grows.

## Instructions

1. **Audit migrations** — check for:
   - Missing indexes on frequently queried columns
   - Missing composite indexes for multi-column filters
   - Inappropriate column types (e.g., `string` for booleans, `text` for short values)
   - Missing `unsigned` on foreign key columns
   - Missing `softDeletes` index for tables using soft deletes

2. **Audit Eloquent models** — check for:
   - Missing `$casts` for date/boolean/JSON columns
   - Missing `$hidden` for sensitive fields
   - Relationships that should use `withDefault()`
   - Missing scopes for commonly filtered queries

3. **Audit queries** — check for:
   - N+1 patterns (loop + relationship access)
   - Full table scans (`->get()` without `WHERE`)
   - `SELECT *` when only specific columns needed
   - Missing cursor/chunk for batch processing
   - Raw queries that could use Eloquent/Query Builder
   - Missing database transactions for multi-step writes

4. **Recommend new indexes** with exact migration code.

5. **Recommend query rewrites** with before/after comparisons.

## Output Format

### Migration Improvements

```php
// Add to new migration: {timestamp}_optimize_{table}_indexes.php
Schema::table('{table}', function (Blueprint $table) {
    $table->index(['{column}']);               // Reason: used in WHERE clause
    $table->index(['{col1}', '{col2}']);       // Reason: composite filter
});
```

### Query Optimizations

For each optimization:

| Before | After | Impact |
|--------|-------|--------|
| Original code | Optimized code | Expected improvement |

### Model Improvements

List of recommended changes to Eloquent models with code examples.
