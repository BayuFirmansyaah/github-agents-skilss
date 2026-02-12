# Rule: Services and Actions

You are a Software Engineer who designs the application layer of this system. Your responsibility is to keep Controllers thin and push all business logic into dedicated Service classes or single-purpose Action classes. Controllers handle HTTP concerns only: they receive a validated request, delegate to a Service or Action, and return a formatted response. Nothing more.

## The Thin Controller Principle

A controller method should contain at most 5 lines of logic: authorize, delegate, respond.

```php
// CORRECT: The controller is a traffic cop, not a business logic container.
class OrderController extends Controller
{
    public function store(
        StoreOrderRequest $request,
        PlaceOrderAction $action,
    ): JsonResponse {
        $this->authorize('create', Order::class);

        $order = $action->execute(
            PlaceOrderDTO::fromRequest($request),
        );

        return new OrderResource($order);
    }
}
```

## Data Transfer Objects (DTOs)

You MUST NOT pass associative arrays, raw Request objects, or untyped data into Services or Actions. All data crossing the boundary from Controller to Service MUST be wrapped in a DTO. DTOs provide type safety, IDE autocompletion, and serve as documentation for what a use case requires.

```php
// Application/DTOs/PlaceOrderDTO.php
final readonly class PlaceOrderDTO
{
    /**
     * @param array<int, OrderItemDTO> $items
     */
    public function __construct(
        public int $userId,
        public array $items,
        public ?string $couponCode = null,
        public ?string $notes = null,
    ) {}

    public static function fromRequest(StoreOrderRequest $request): self
    {
        return new self(
            userId: $request->user()->id,
            items: collect($request->validated('items'))
                ->map(fn (array $item) => new OrderItemDTO(
                    productId: $item['product_id'],
                    quantity: $item['quantity'],
                ))
                ->all(),
            couponCode: $request->validated('coupon_code'),
            notes: $request->validated('notes'),
        );
    }
}
```

## Action Classes vs Service Classes

Use an Action class when the operation is a single, well-defined use case with a clear name (e.g., PlaceOrderAction, CancelSubscriptionAction, GenerateInvoiceAction). Actions have a single public method: `execute`. They are `final`, focused, and composable.

Use a Service class when you have a group of closely related operations on the same domain entity that share significant internal logic (e.g., UserService with register, updateProfile, deactivate). Services should still be small. If a Service has more than 5-6 public methods, it is too large and should be broken into Actions.

```php
// CORRECT: A focused Action with a single responsibility
final class PlaceOrderAction
{
    public function __construct(
        private readonly OrderRepositoryInterface $orders,
        private readonly StockReservationInterface $stockReserver,
        private readonly CouponValidatorInterface $couponValidator,
        private readonly EventDispatcherInterface $events,
    ) {}

    public function execute(PlaceOrderDTO $dto): Order
    {
        return DB::transaction(function () use ($dto) {
            $order = Order::create($dto->userId);

            foreach ($dto->items as $item) {
                $this->stockReserver->reserve($item->productId, $item->quantity);
                $order->addLine($item->productId, $item->quantity);
            }

            if ($dto->couponCode) {
                $discount = $this->couponValidator->validate($dto->couponCode, $order->subtotal());
                $order->applyDiscount($discount);
            }

            $this->orders->save($order);
            $this->events->dispatch(new OrderPlaced($order));

            return $order;
        });
    }
}
```

## Dependency Injection

You MUST inject dependencies through the constructor. Never use `new` inside a Service or Action to instantiate collaborators. Never use Facades inside Services or Actions. Always depend on interfaces, not concrete implementations.

```php
// WRONG: Hard coupling. Untestable. Cannot swap implementations.
class OrderService
{
    public function create(array $data): void
    {
        $user = User::find($data['user_id']);            // Direct model access
        Mail::send(new OrderConfirmation($user));         // Facade usage
        $gateway = new StripeGateway();                   // Direct instantiation
    }
}

// CORRECT: Dependency injection via interfaces. Fully testable.
final class OrderService
{
    public function __construct(
        private readonly UserLookupInterface $users,
        private readonly MailerInterface $mailer,
        private readonly PaymentGatewayInterface $gateway,
    ) {}
}
```

## Transaction Management

Database transactions belong in the Application layer (Actions/Services), never in Controllers or Repositories. If an Action involves multiple write operations that must succeed or fail together, wrap them in `DB::transaction()`.

```php
public function execute(TransferFundsDTO $dto): void
{
    DB::transaction(function () use ($dto) {
        $this->accountRepo->debit($dto->fromAccountId, $dto->amount);
        $this->accountRepo->credit($dto->toAccountId, $dto->amount);
        $this->transactionRepo->record($dto);
    });
}
```

## Error Handling

Services and Actions must throw domain-specific exceptions, not generic ones. Controllers or exception handlers translate these into HTTP responses. The domain layer should never know about HTTP status codes.

```php
// Domain exception
class InsufficientStockException extends DomainException
{
    public function __construct(
        public readonly int $productId,
        public readonly int $requested,
        public readonly int $available,
    ) {
        parent::__construct("Product {$productId}: requested {$requested}, only {$available} available.");
    }
}

// In the exception handler, translate domain exceptions to HTTP responses
// InsufficientStockException -> 422 Unprocessable Entity
```
