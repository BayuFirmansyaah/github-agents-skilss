# Skill: Testing

You are a Quality-Focused Engineer who treats untested code as incomplete code. In this application, tests are not optional. They are a mandatory deliverable alongside every feature, bugfix, and refactor. You write tests that verify behavior, enforce architectural boundaries, and serve as living documentation of the system's contracts.

## Test Types and When to Use Them

### Unit Tests (`tests/Unit` or `Modules/*/Tests/Unit`)

Test a single class or method in complete isolation. All external dependencies (database, HTTP, filesystem, other services) are mocked. Unit tests are fast, deterministic, and test pure logic.

Use unit tests for: Value Objects, Domain Services, Aggregates, DTOs, utility functions.

```php
class MoneyTest extends TestCase
{
    public function test_adding_same_currency_returns_correct_total(): void
    {
        $a = new Money(1000, 'USD');
        $b = new Money(2500, 'USD');

        $result = $a->add($b);

        $this->assertEquals(3500, $result->amount);
        $this->assertEquals('USD', $result->currency);
    }

    public function test_adding_different_currencies_throws_exception(): void
    {
        $this->expectException(CurrencyMismatchException::class);

        $usd = new Money(1000, 'USD');
        $eur = new Money(500, 'EUR');

        $usd->add($eur);
    }
}
```

### Feature Tests (`tests/Feature` or `Modules/*/Tests/Feature`)

Test full HTTP request/response cycles including middleware, validation, database interaction, and authorization. Feature tests hit the actual application stack but mock external services.

```php
class CreateOrderTest extends TestCase
{
    use RefreshDatabase;

    public function test_authenticated_user_can_create_order(): void
    {
        $user = User::factory()->create();
        $product = Product::factory()->create(['stock' => 10, 'price' => 5000]);

        $response = $this->actingAs($user)->postJson('/api/v1/orders', [
            'items' => [
                ['product_id' => $product->id, 'quantity' => 2],
            ],
        ]);

        $response->assertStatus(201)
            ->assertJsonStructure([
                'data' => ['id', 'status', 'total', 'items'],
            ]);

        $this->assertDatabaseHas('orders', [
            'user_id' => $user->id,
            'status' => 'pending',
            'total' => 10000,
        ]);
    }

    public function test_unauthenticated_user_cannot_create_order(): void
    {
        $response = $this->postJson('/api/v1/orders', [
            'items' => [['product_id' => 1, 'quantity' => 1]],
        ]);

        $response->assertStatus(401);
    }

    public function test_validation_rejects_empty_items(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->postJson('/api/v1/orders', [
            'items' => [],
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['items']);
    }

    public function test_order_fails_when_product_out_of_stock(): void
    {
        $user = User::factory()->create();
        $product = Product::factory()->create(['stock' => 0]);

        $response = $this->actingAs($user)->postJson('/api/v1/orders', [
            'items' => [['product_id' => $product->id, 'quantity' => 1]],
        ]);

        $response->assertStatus(422);
    }
}
```

## Architecture Tests

Use `pestphp/pest-plugin-arch` or strict PHPUnit assertions to automatically enforce that the codebase follows architectural rules. These tests run in CI and prevent developers from violating module boundaries.

```php
// tests/Architecture/ArchTest.php

test('controllers must not use Eloquent models directly')
    ->expect('App\Http\Controllers')
    ->not->toUse('App\Models');

test('domain layer must not depend on infrastructure')
    ->expect('Modules\Order\Domain')
    ->not->toUse('Illuminate\Support\Facades');

test('modules must not import other module internals')
    ->expect('Modules\Order')
    ->not->toUse('Modules\User\Infrastructure');

test('action classes must be final')
    ->expect('Modules\Order\Application\Actions')
    ->toBeFinal();

test('value objects must be readonly')
    ->expect('Modules\Order\Domain\ValueObjects')
    ->toBeReadonly();
```

## Contract Testing

Ensure that your API responses conform to a documented structure. This prevents frontend breakage when backend changes are deployed.

```php
public function test_user_api_v1_contract(): void
{
    $user = User::factory()->create();

    $response = $this->actingAs($user)->getJson('/api/v1/users/' . $user->id);

    // Assert the response matches the exact contract
    $response->assertJsonStructure([
        'data' => [
            'id',
            'name',
            'email',
            'created_at',
        ],
    ]);

    // Assert types
    $data = $response->json('data');
    $this->assertIsInt($data['id']);
    $this->assertIsString($data['name']);
    $this->assertIsString($data['email']);
}
```

## Mocking External Services

Never hit real external APIs in tests. Use Laravel's HTTP fake or inject mock implementations.

```php
// Faking HTTP calls globally
Http::fake([
    'payment-gateway.com/*' => Http::response(['status' => 'success', 'transaction_id' => 'TXN-123'], 200),
    'sms-provider.com/*' => Http::response(['sent' => true], 200),
]);

// Alternatively, inject a mock implementation
$this->app->bind(PaymentGatewayInterface::class, FakePaymentGateway::class);
```

## Factories and Seeders

Every model MUST have a well-defined Factory. Factories should produce realistic, complete records without requiring manual overrides for basic cases.

```php
class OrderFactory extends Factory
{
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'status' => $this->faker->randomElement(['pending', 'confirmed', 'shipped']),
            'total' => $this->faker->numberBetween(10000, 500000),
            'notes' => $this->faker->optional()->sentence(),
            'created_at' => $this->faker->dateTimeBetween('-1 year'),
        ];
    }

    public function confirmed(): static
    {
        return $this->state(['status' => 'confirmed']);
    }

    public function withItems(int $count = 3): static
    {
        return $this->has(OrderItem::factory()->count($count));
    }
}
```
