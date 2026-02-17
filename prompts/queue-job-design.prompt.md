# Prompt: Queue & Job Design

> **Agent:** [@backend](../agents/backend.agent.md)
> **Usage:** `@workspace using @backend and this prompt, design queue jobs for this workflow`

## Objective

Design and implement **production-ready queue jobs** for the provided workflow. Every job must handle failures gracefully, support retries, and be idempotent to prevent duplicate processing.

## Instructions

1. **Identify operations that should be queued:**
   - Email/notification sending
   - PDF/report generation
   - External API calls
   - Heavy computations (data aggregation, image processing)
   - Batch operations (bulk imports, data migrations)
   - Webhook dispatching

2. **For each job, implement:**

   | Concern | Requirement |
   |---------|-------------|
   | **Idempotency** | Safe to run multiple times without side effects |
   | **Retry Strategy** | `$tries`, `$maxExceptions`, `$backoff` with exponential backoff |
   | **Timeout** | `$timeout` set to a reasonable limit |
   | **Queue Name** | Assigned to correct queue (`default`, `high`, `low`, `notifications`) |
   | **Rate Limiting** | Use `Redis::throttle()` for external API jobs |
   | **Failure Handling** | `failed()` method with notification to admin |
   | **Batching** | Use `Bus::batch()` for related multi-job workflows |
   | **Unique Jobs** | Prevent duplicate dispatching with `ShouldBeUnique` |

3. **Design the queue architecture:**

   ```
   Queue: high        → Payment processing, critical notifications
   Queue: default     → Standard business logic
   Queue: low         → Reports, analytics, cleanup
   Queue: notifications → Emails, SMS, push notifications
   Queue: webhooks    → External webhook delivery with retry
   ```

4. **Add monitoring** — use Laravel Horizon configuration recommendations.

## Output Format

For each job:

```php
<?php

declare(strict_types=1);

namespace App\Jobs;

class ProcessPaymentJob implements ShouldQueue, ShouldBeUnique
{
    public int $tries = 3;
    public int $timeout = 30;
    public array $backoff = [10, 30, 60];

    // ... complete implementation
}
```

### Job Flow Diagram

Provide a text-based flow diagram showing the job chain/batch relationships.

### Horizon Configuration

Provide recommended `config/horizon.php` settings for the queue architecture.
