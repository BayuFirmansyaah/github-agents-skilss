# Skill: Code Style

You are a Software Engineer who writes clean, readable, and strictly typed PHP code. You follow PSR-12 as the baseline and extend it with Laravel-specific conventions and stricter typing rules. Consistency is non-negotiable. Every file you touch must look like every other file in the codebase, as if one person wrote the entire project.

## Strict Types Declaration

Every PHP file you create MUST begin with the strict types declaration. No exceptions.

```php
<?php

declare(strict_types=1);
```

## Naming Conventions

Classes, interfaces, traits, and enums use PascalCase:
```
UserService, OrderRepository, PaymentGatewayInterface, OrderStatus
```

Methods and variables use camelCase:
```
$orderTotal, processPayment(), findActiveUsers()
```

Constants use UPPER_SNAKE_CASE:
```
MAX_LOGIN_ATTEMPTS, DEFAULT_CURRENCY, CACHE_TTL_SECONDS
```

Database columns and table names use snake_case:
```
users, order_items, created_at, is_active
```

Configuration keys use dot-separated lowercase:
```
config('payment.gateway.timeout')
```

## Type Hinting

You MUST type hint every method parameter, return type, and property. Use union types and nullable types where appropriate. Never leave a method signature ambiguous.

```php
// WRONG: No type information. Impossible to reason about without reading the implementation.
public function getUser($id) {
    return User::find($id);
}

// CORRECT: Fully typed. Self-documenting.
public function getUser(int $id): ?User
{
    return User::find($id);
}

// Complex return types
public function processPayment(PaymentDTO $data): PaymentResult|PaymentFailure
{
    // ...
}

// Typed properties with constructor promotion
public function __construct(
    private readonly OrderRepositoryInterface $orderRepo,
    private readonly PaymentGatewayInterface $gateway,
    private readonly LoggerInterface $logger,
) {}
```

## Class Design Rules

1. One class per file. Always.
2. Classes should be `final` by default unless explicitly designed for extension.
3. Prefer composition over inheritance. Use traits sparingly and only for framework requirements (e.g., `HasFactory`, `SoftDeletes`).
4. Constructor promotion is preferred for injected dependencies.
5. Properties should be `readonly` when they are set once and never changed.

```php
final class PlaceOrderAction
{
    public function __construct(
        private readonly OrderRepositoryInterface $orders,
        private readonly StockCheckerInterface $stockChecker,
    ) {}

    public function execute(PlaceOrderDTO $dto): Order
    {
        // ...
    }
}
```

## Method Length and Complexity

A method should do one thing. If a method exceeds 20 lines of logic (excluding blank lines and comments), it is a signal that it should be decomposed. Cyclomatic complexity should not exceed 5 per method. If you find yourself nesting more than 2 levels of conditionals, extract the inner logic into a private method or a separate class.

## Static Analysis

You run Larastan (PHPStan for Laravel) at level 5 or higher. All code must pass without errors before merging. You also run PHP CS Fixer with the project's `.php-cs-fixer.dist.php` configuration before every commit.

```bash
# Run static analysis
./vendor/bin/phpstan analyse --memory-limit=512M

# Run code formatting
./vendor/bin/php-cs-fixer fix --config=.php-cs-fixer.dist.php
```

## Comments

Code should be self-documenting through clear naming. Comments explain WHY, never WHAT. If you feel the need to write a comment explaining what code does, rename the variable or extract a method instead.

```php
// WRONG: The comment restates the code
// Get the user
$user = User::find($id);

// CORRECT: The comment explains business context
// Guest users get a temporary cart that expires after 24 hours
$cart = $this->getOrCreateGuestCart($sessionId, ttl: 86400);
```
