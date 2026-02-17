# Prompt: Caching Strategy

> **Agent:** [@backend](../agents/backend.agent.md)
> **Usage:** `@workspace using @backend and this prompt, design a caching strategy for this module`

## Objective

Design and implement a **multi-layer caching strategy** for the provided module or feature. Caching is critical for large-scale applications — every database query saved directly translates to improved response times and reduced infrastructure cost.

## Instructions

1. **Identify cacheable data** — find data that is:
   - Read frequently, written infrequently (products, categories, settings)
   - Expensive to compute (reports, aggregations, search results)
   - Stable across requests (user permissions, configuration)

2. **Design cache layers:**

   | Layer | Storage | TTL | Use Case |
   |-------|---------|-----|----------|
   | **Request** | `once()` / In-memory | Request lifetime | Prevent duplicate queries within single request |
   | **Application** | Redis/Memcached | Minutes to hours | Shared cache across requests |
   | **HTTP** | Response headers | Client-dependent | Static/semi-static API responses |

3. **For each cached item, define:**
   - Cache key naming convention: `{module}:{entity}:{id}:{variant}`
   - TTL (time-to-live) with justification
   - Invalidation strategy (on write, on event, time-based)
   - Cache tags for group invalidation
   - Warming strategy (lazy vs eager)

4. **Implement using the Repository Caching Decorator pattern:**

   ```php
   interface ProductRepositoryInterface {
       public function findById(int $id): ?Product;
   }

   // Eloquent implementation (no caching)
   class EloquentProductRepository implements ProductRepositoryInterface { ... }

   // Caching decorator (wraps any implementation)
   class CachingProductRepository implements ProductRepositoryInterface {
       public function __construct(
           private readonly ProductRepositoryInterface $inner,
       ) {}

       public function findById(int $id): ?Product {
           return Cache::tags(['products'])
               ->remember("product:{$id}", 3600, fn () => $this->inner->findById($id));
       }
   }
   ```

5. **Handle cache invalidation** — every write operation must clear affected caches.

## Output Format

### Cache Design Table

| Data | Key Pattern | TTL | Invalidation Trigger | Tags |
|------|-------------|-----|---------------------|------|
| Single product | `product:{id}` | 1h | `ProductUpdated` event | `products`, `product:{id}` |
| Product list | `products:page:{n}` | 15m | Any product write | `products` |
| User permissions | `user:{id}:permissions` | 30m | Role/permission change | `users`, `permissions` |

### Implementation Code

Complete caching decorator classes with cache tags and invalidation.

### Cache Warming

Commands or listeners to pre-warm critical caches after deployment.
