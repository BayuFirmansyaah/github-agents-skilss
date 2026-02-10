# Skill: Laravel Modules (Advanced)

## Overview
We use `nwidart/laravel-modules` combined with **Domain-Driven Design (DDD)** principles. Modules are not just folders; they are **Bounded Contexts**.

## 🏗 Module Structure (DDD-Infused)

```text
Modules/
  ├── Order/
  │   ├── Application/          <-- Use Cases (Actions/Commands)
  │   │   ├── Actions/
  │   │   ├── DTOs/
  │   │   └── Listeners/
  │   ├── Domain/               <-- Pure Business Logic
  │   │   ├── Aggregates/       <-- Root Entities
  │   │   ├── Events/
  │   │   ├── Exceptions/
  │   │   ├── Services/         <-- Domain Services
  │   │   └── ValueObjects/
  │   ├── Infrastructure/       <-- External Concerns
  │   │   ├── Persistence/      <-- Eloquent Models/Repositories
  │   │   └── Services/         <-- Third-party integrations
  │   ├── Interfaces/           <-- Entry Points (Http/Console)
  │   │   ├── Http/
  │   │   └── Console/
```

## 🔌 Distributed Transactions (The Saga Pattern)
Since modules cannot share database transactions, we use **Sagas** for cross-module consistency.

**Scenario**: User places an order.
1.  **Order Module**: Creates Order (Pending). Publishes `OrderCreated`.
2.  **Inventory Module**: Listens to `OrderCreated`. Reserves stock.
    -   *Success*: Publishes `StockReserved`.
    -   *Fail*: Publishes `StockReservationFailed`.
3.  **Order Module**:
    -   Listens to `StockReserved` -> Updates Order to `Confirmed`.
    -   Listens to `StockReservationFailed` -> Updates Order to `Cancelled` (Compensating Transaction).

## 🛡 Aggregates & Invariants
-   **Aggregate Root**: The main entity that controls access to child entities.
-   **Invariant**: A rule that must always be true.
    -   *Example*: An Order cannot be placed with 0 items. This check belongs in the `Order` aggregate, NOT the controller.

```php
// Domain/Aggregates/Order.php
public function addLine(Product $product, int $quantity): void
{
    if ($this->status !== OrderStatus::DRAFT) {
        throw new DomainException("Cannot add lines to a confirmed order.");
    }
    // ... logic
}
```
