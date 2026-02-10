# Skill: Testing (Advanced)

## Overview
Beyond Unit and Feature tests, we enforce **Architectural Integrity** and **Contract Stability**.

## 🏗 Architecture Tests (Pest/PHPArch)
We use `pestphp/pest-plugin-arch` (or custom PHPUnit rules) to ensure modules don't leak.

**Example Rules:**
1.  **Controllers** should never access **Models** directly (must use Services/Repositories).
2.  **Modules** should not depend on other Modules (except via Interfaces/Contracts).
3.  **Services** must be final.

```php
// tests/Arch/ArchTest.php
test('controllers do not access models')
    ->expect('App\Http\Controllers')
    ->not->toUse('App\Models');
    
test('modules are independent')
    ->expect('Modules\Order')
    ->not->toUse('Modules\User'); // Except Contracts
```

## 🤝 Contract Testing
Ensure our API responses don't break frontend consumers.
-   Use **Pact** or snapshot testing for API responses.

```php
public function test_api_contract_v1()
{
    $response = $this->getJson('/api/v1/users/1');
    
    // Assert structure matches JSON Schema
    $response->assertJsonStructure([
        'data' => ['id', 'name', 'email', 'created_at']
    ]);
}
```

## 🎭 Mocking Strategies
-   **Partial Mocks**: Avoid them. If you need to mock a protected method, your class is doing too much. Refactor specific logic to a new class.
-   **Spying**: Use `spy()` to verify interaction without mocking behavior.

```php
$logger = $this->spy(LoggerInterface::class);
// ... run logic
$logger->shouldHaveReceived('info')->with('Order processed');
```
