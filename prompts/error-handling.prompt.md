# Prompt: Error Handling

> **Agent:** [@backend](../agents/backend.agent.md)
> **Usage:** `@workspace using @backend and this prompt, implement error handling for this module`

## Objective

Audit and implement **comprehensive error handling** across the provided code. Every failure path must be handled gracefully with typed exceptions, proper logging, user-friendly messages, and recovery strategies.

## Instructions

1. **Identify every failure point** in the code:
   - Database operations that can fail (constraint violations, deadlocks, timeouts)
   - External API calls (network failures, timeouts, unexpected responses)
   - File operations (disk full, permission denied, file not found)
   - Validation gaps (missing input checks, type mismatches)
   - Authorization gaps (missing policy checks)
   - Queue job failures (retry logic, dead letter handling)

2. **For each failure point, implement:**

   | Component | Requirement |
   |-----------|-------------|
   | **Custom Exception** | Typed, domain-specific exception class |
   | **HTTP Status Code** | Semantically correct (400, 403, 404, 409, 422, 500) |
   | **User Message** | Safe, non-technical message for API consumers |
   | **Log Entry** | Full context for debugging (input, user, stack trace) |
   | **Recovery** | Retry? Compensate? Notify admin? |

3. **Implement exception hierarchy:**

   ```
   AppException (base)
   ├── DomainException
   │   ├── InsufficientStockException
   │   ├── OrderAlreadyConfirmedException
   │   └── InvalidTransitionException
   ├── InfrastructureException
   │   ├── PaymentGatewayTimeoutException
   │   ├── ExternalApiException
   │   └── CacheConnectionException
   └── ApplicationException
       ├── UnauthorizedActionException
       └── RateLimitExceededException
   ```

4. **Add database transactions** around multi-step mutations with proper rollback.

5. **Add circuit breakers** for external service calls.

## Output Format

For each file:

1. **Custom Exception classes** — complete PHP files
2. **Updated code** — with try/catch blocks, transactions, and logging
3. **Exception Handler registration** — additions to `app/Exceptions/Handler.php`
4. **Summary table** of all error scenarios covered

| Scenario | Exception | HTTP Code | User Message | Log Level |
|----------|-----------|-----------|--------------|-----------|
| Product out of stock | `InsufficientStockException` | 422 | "Product is currently unavailable" | warning |
