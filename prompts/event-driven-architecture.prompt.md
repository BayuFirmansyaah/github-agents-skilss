# Prompt: Event-Driven Architecture

> **Agent:** [@backend](../agents/backend.agent.md)
> **Usage:** `@workspace using @backend and this prompt, design event-driven architecture for this workflow`

## Objective

Design and implement an **event-driven architecture** for the provided workflow or feature. In a large-scale modular monolith, domain events are the primary mechanism for cross-module communication while maintaining bounded context isolation.

## Instructions

1. **Identify domain events** — significant things that happen in the business domain:
   - State transitions: `OrderConfirmed`, `PaymentProcessed`, `UserVerified`
   - Business actions: `InvoiceGenerated`, `StockReserved`, `NotificationSent`
   - Integration triggers: `WebhookReceived`, `ImportCompleted`

2. **For each event, define:**

   | Attribute | Requirement |
   |-----------|-------------|
   | **Name** | Past tense verb (`OrderConfirmed`, not `ConfirmOrder`) |
   | **Payload** | Minimal data needed by listeners (IDs, not full models) |
   | **Publisher** | Which module/class fires this event |
   | **Listeners** | Which modules/classes react to this event |
   | **Sync/Async** | Should listeners run immediately or be queued? |
   | **Idempotency** | Can listeners handle duplicate events safely? |

3. **Implement the Saga Pattern** for multi-step workflows that span modules:

   ```
   Step 1: Create Order (PENDING)     → publish OrderCreated
   Step 2: Reserve Stock              → listen OrderCreated
     ├── Success: publish StockReserved
     └── Failure: publish StockReservationFailed
   Step 3: Process Payment            → listen StockReserved
     ├── Success: publish PaymentProcessed
     └── Failure: publish PaymentFailed → compensate: release stock
   Step 4: Confirm Order              → listen PaymentProcessed
   ```

4. **Implement compensating actions** for every step that can fail.

5. **Design event store** (optional) for audit trail and replay capability.

## Output Format

### Event Catalog

| Event | Payload | Publisher | Listeners | Async |
|-------|---------|-----------|-----------|-------|
| `OrderCreated` | `{order_id, user_id, total}` | OrderModule | InventoryModule, NotificationModule | Yes |

### Event Classes

Complete PHP event classes with typed properties.

### Listener Classes

Complete listener implementations with error handling and idempotency.

### Saga Flow Diagram

Text-based or markdown diagram showing the event flow and compensation paths.

### Service Provider Registration

Event-listener mapping for `EventServiceProvider`.
