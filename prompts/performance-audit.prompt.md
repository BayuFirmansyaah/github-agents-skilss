# Prompt: Performance Audit

> **Agent:** [@backend](../agents/backend.agent.md) or [@reviewer](../agents/reviewer.agent.md)
> **Usage:** `@workspace using @backend and this prompt, audit this code for performance issues`

## Objective

Perform a **comprehensive performance audit** of the provided source code, identifying bottlenecks, inefficient queries, memory leaks, and scalability concerns for a large-scale Laravel application.

## Audit Checklist

| # | Category | What to look for |
|---|----------|-----------------|
| 1 | **N+1 Queries** | Missing eager loading, lazy loading in loops, nested relationship access without `with()` |
| 2 | **Unbounded Queries** | Missing pagination, `->get()` / `->all()` on large tables, missing `LIMIT` |
| 3 | **Missing Indexes** | Columns used in `WHERE`, `ORDER BY`, `JOIN ON`, `GROUP BY` without indexes |
| 4 | **Memory Usage** | Loading entire collections into memory, missing `chunk()` / `cursor()` / `lazy()` for large datasets |
| 5 | **Cache Opportunities** | Frequently read, rarely written data not cached; missing cache invalidation strategy |
| 6 | **Slow Queries** | Complex subqueries, `LIKE '%...'` pattern, unnecessary `SELECT *`, missing composite indexes |
| 7 | **Queue Offloading** | Synchronous operations that should be queued (emails, notifications, PDF generation, API calls) |
| 8 | **Serialization** | Heavy model serialization, `toArray()` on large collections, missing API Resources |
| 9 | **Connection Pooling** | Excessive database connections, missing connection reuse, transaction scope too wide |
| 10 | **Asset Loading** | Unoptimized images, missing lazy loading on frontend, blocking JS/CSS |

## Output Format

### Performance Findings

For each issue found:

| Field | Detail |
|-------|--------|
| **Severity** | 🔴 Critical / 🟠 High / 🟡 Medium / 🔵 Low |
| **Category** | Which checklist item |
| **Location** | File and line(s) |
| **Problem** | What the issue is |
| **Impact** | Estimated performance impact (e.g., "O(n) queries instead of O(1)") |
| **Fix** | Specific code change with before/after example |

### Performance Scorecard

| Dimension | Grade (A-F) | Notes |
|-----------|-------------|-------|
| Query Efficiency | | |
| Memory Management | | |
| Caching Strategy | | |
| Async Processing | | |
| Scalability Readiness | | |
| **Overall** | | |
