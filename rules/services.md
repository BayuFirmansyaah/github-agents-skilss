# Rule: Services & Actions (Advanced)

## 🎯 Architecture Patterns

### 1. Data Transfer Objects (DTOs)
**NEVER** pass associative arrays or `Request` objects to Services.
-   **Why**: Type safety, refactoring support, and clarity.
-   **Tool**: `spatie/laravel-data` or native strictly typed PHP classes.

```php
// Bad
$service->create($request->all());

// Good
$dto = UserData::from($request);
$service->create($dto);
```

### 2. Actions vs Services
-   **Service**: A collection of related methods (`UserService::register`, `UserService::delete`).
-   **Action**: A single class for a single complex operation (`RegisterUserAction`, `PlaceOrderAction`).
    -   *Use Actions for complex business flows that involve multiple steps.*

### 3. The "Execute" Method
Actions should have a primary method named `execute` or `handle`.

```php
class PlaceOrderAction
{
    public function execute(OrderData $data): Order
    {
        return DB::transaction(function () use ($data) {
            // ... strict logic
        });
    }
}
```

### 4. Dependency Injection
-   Inject **Interfaces**, not concrete classes (Strategy Pattern).
-   Use `constructor property promotion` for cleaner code.
