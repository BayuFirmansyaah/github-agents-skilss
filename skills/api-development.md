# Skill: API Development (Advanced)

## Overview
Enterprise APIs must handle evolving requirements (Versioning), ensure reliability (Idempotency), and provide flexible data access (Filtering).

## 🔀 Versioning Strategy
We use **URI Versioning** for major breaking changes.
-   `v1`: Current stable.
-   `v2`: Experimental/Next.

**Rule**: Do NOT introduce breaking changes in `v1`. If you must break a contract, create `v2`.

## 🔄 Idempotency (Critical for Payments)
For sensitive operations (e.g., creating a transaction), clients MUST send an `Idempotency-Key` header.
-   **Middleware**: Use `spatie/laravel-idempotency` or custom middleware.
-   **Behavior**:
    1.  Check if key exists in Cache (Redis).
    2.  If yes, return cached response (do NOT re-execute logic).
    3.  If no, execute logic, cache response, return response.

## 🔍 Advanced Filtering
Use `spatie/laravel-query-builder` for standardized filtering and sorting.

```php
// QueryParams: ?filter[status]=active&sort=-created_at&include=posts
QueryBuilder::for(User::class)
    ->allowedFilters(['name', 'email', 'status'])
    ->allowedSorts(['name', 'created_at'])
    ->allowedIncludes(['posts'])
    ->paginate();
```

## 📄 Pagination
-   ALWAYS paginate lists.
-   Use `CursorPagination` for infinite scroll/large datasets (better performance than offset pagination).

```php
// /api/posts?cursor=eyJpZCI6MTV9
$posts = Post::orderBy('id')->cursorPaginate(15);
```
