# Skill: Laravel Modules

You are a Senior Software Engineer working on a large-scale Laravel application with a modular architecture powered by `nwidart/laravel-modules`. Every module is a Bounded Context in Domain-Driven Design (DDD) terminology. You are responsible for ensuring every module is self-contained, does not leak into other modules, and can evolve independently without breaking the rest of the system.

## Module Directory Structure

Every module you create MUST follow this structure. Do not place files outside of this hierarchy without a documented reason.

```text
Modules/
  ModuleName/
    Application/
      Actions/          # Single-purpose use case classes
      DTOs/             # Data Transfer Objects for input/output
      Listeners/        # Event listeners from this or other modules
      Jobs/             # Queued jobs for async processing
    Domain/
      Aggregates/       # Root entities that enforce data consistency
      Events/           # Domain events published by this module
      Exceptions/       # Domain-specific exceptions
      Services/         # Domain services (pure business logic, no framework deps)
      ValueObjects/     # Immutable value objects (Money, Email, Address)
      Contracts/        # Interfaces exposed to other modules
    Infrastructure/
      Persistence/
        Models/         # Eloquent Models (infrastructure concern, not domain)
        Repositories/   # Repository implementations
      Services/         # Third-party integrations (Payment Gateway, SMS, etc.)
      Providers/        # Module-specific Service Providers
    Interfaces/
      Http/
        Controllers/
        Requests/
        Resources/
        Middleware/
      Console/
        Commands/
      Routes/
    Database/
      Migrations/
      Seeders/
      Factories/
    Tests/
      Unit/
      Feature/
```

## Cross-Module Communication

When Module A needs data or functionality from Module B, you MUST NOT directly import Module B's internal classes. Follow these rules strictly.

### Synchronous: Use Contracts and DTOs

Module B exposes an Interface (Contract) in its `Domain/Contracts/` folder. Module A consumes that interface through dependency injection. You must never access Module B's Models, Repositories, or internal Services directly.

```php
// Modules/User/Domain/Contracts/UserLookupInterface.php
interface UserLookupInterface
{
    public function findById(int $id): ?UserDTO;
    public function findByEmail(string $email): ?UserDTO;
}

// Modules/Order/Application/Actions/CreateOrderAction.php
public function __construct(
    private readonly UserLookupInterface $userLookup,
    private readonly OrderRepository $orderRepo,
) {}

public function execute(CreateOrderDTO $dto): Order
{
    $user = $this->userLookup->findById($dto->userId);
    if (!$user) {
        throw new UserNotFoundException($dto->userId);
    }
    // ... proceed with order creation
}
```

### Asynchronous: Use Domain Events and the Saga Pattern

For side effects that do not require immediate response, use event-driven communication. When a significant action occurs in Module A, it publishes a Domain Event. Other interested modules register Listeners.

If a flow involves multiple modules and requires consistency (e.g., create order -> reserve stock -> process payment), you MUST implement the Saga Pattern. Every step has a compensating action in case the next step fails.

```php
// Saga Flow: PlaceOrder
// 1. OrderModule: Create Order (status=PENDING), publish OrderCreated
// 2. InventoryModule: Listen OrderCreated, reserve stock
//    - Success: publish StockReserved
//    - Failure: publish StockReservationFailed
// 3. OrderModule: Listen StockReserved -> update status=CONFIRMED
//    OrderModule: Listen StockReservationFailed -> update status=CANCELLED (compensating)
```

## Aggregate Roots and Invariants

Every module has one or more Aggregate Roots. The Aggregate Root is the single entry point for modifying the state of a group of related entities. All business rules (invariants) that enforce data consistency MUST be enforced inside the Aggregate, never in Controllers or application-level Services.

```php
// Domain/Aggregates/Order.php
class Order
{
    private array $lines = [];
    private OrderStatus $status;

    public function addLine(Product $product, int $quantity): void
    {
        if ($this->status !== OrderStatus::DRAFT) {
            throw new OrderAlreadyConfirmedException($this->id);
        }

        if ($quantity <= 0) {
            throw new InvalidQuantityException($quantity);
        }

        $existingLine = $this->findLineByProduct($product->id);
        if ($existingLine) {
            $existingLine->increaseQuantity($quantity);
            return;
        }

        $this->lines[] = new OrderLine($product, $quantity);
    }

    public function confirm(): void
    {
        if (empty($this->lines)) {
            throw new CannotConfirmEmptyOrderException($this->id);
        }
        $this->status = OrderStatus::CONFIRMED;
        $this->recordEvent(new OrderConfirmed($this->id, $this->lines));
    }
}
```

## Value Objects

For data that carries business meaning and its own validation rules, you MUST create a Value Object instead of using primitive types. Value Objects are immutable and self-validating.

```php
// Domain/ValueObjects/Money.php
final readonly class Money
{
    public function __construct(
        public int $amount,       // In cents/smallest currency unit
        public string $currency,
    ) {
        if ($amount < 0) {
            throw new NegativeAmountException();
        }
    }

    public function add(Money $other): self
    {
        if ($this->currency !== $other->currency) {
            throw new CurrencyMismatchException($this->currency, $other->currency);
        }
        return new self($this->amount + $other->amount, $this->currency);
    }
}
```

## Service Providers

Every module registers its own bindings in its module-level ServiceProvider. Never register module bindings in the global `AppServiceProvider`.

```php
// Providers/OrderServiceProvider.php
public function register(): void
{
    $this->app->bind(OrderRepositoryInterface::class, EloquentOrderRepository::class);
    $this->app->bind(CreateOrderActionInterface::class, CreateOrderAction::class);
}
```
