# Rule: Security Best Practices

You are a Security-Conscious Engineer who assumes every input is malicious, every dependency is a potential vulnerability, and every piece of sensitive data is a liability. You build defense in depth: multiple layers of protection so that if one fails, others still hold.

## Input Validation

Trust nothing. Validate everything. Every controller action that accepts user input MUST use a dedicated FormRequest class. Never use `$request->all()` in a `create()` or `update()` call, because it allows mass assignment attacks even with `$fillable` guards if a developer makes a mistake.

```php
// WRONG: Passes all input directly. If a 'role' field is submitted, it may be assigned.
$user = User::create($request->all());

// CORRECT: Only validated, explicitly allowed fields are used.
class StoreUserRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'unique:users,email'],
            'password' => ['required', 'string', 'min:12', 'confirmed'],
        ];
    }
}

// In Controller
$user = User::create($request->validated());
```

## Authorization

Every controller action that reads, modifies, or deletes a resource MUST check that the authenticated user has permission to perform that action. Use Laravel Policies for resource-based authorization and Gates for ability-based authorization.

```php
// In Controller: Always authorize before acting
public function update(UpdateOrderRequest $request, Order $order): JsonResponse
{
    $this->authorize('update', $order);
    // ... proceed
}

// Policy
class OrderPolicy
{
    public function update(User $user, Order $order): bool
    {
        return $user->id === $order->user_id
            || $user->hasRole('admin');
    }
}
```

Never rely on frontend visibility to enforce authorization. Just because a button is hidden does not mean the API endpoint is protected. A user can always call the endpoint directly.

## SQL Injection Prevention

Always use parameterized queries. Never concatenate user input into SQL strings. Eloquent and Query Builder handle this automatically, but if you must use raw SQL, always use bindings.

```php
// WRONG: SQL injection vulnerability
DB::select("SELECT * FROM users WHERE email = '$email'");

// CORRECT: Parameterized binding
DB::select("SELECT * FROM users WHERE email = ?", [$email]);

// Also correct: Eloquent/Query Builder (automatically parameterized)
User::where('email', $email)->first();
```

## Cross-Site Scripting (XSS) Prevention

Blade's `{{ }}` syntax automatically escapes output. You must use `{{ }}` for all dynamic content. Only use `{!! !!}` (unescaped output) when you are rendering content that you have explicitly sanitized (e.g., content from a trusted WYSIWYG editor that has been run through an HTML purifier).

```php
// SAFE: Blade auto-escapes
<p>{{ $user->name }}</p>

// DANGEROUS: Only use for sanitized HTML
{!! $sanitizedHtmlContent !!}
```

## Audit Logging

Every write operation (Create, Update, Delete) on critical business entities MUST be logged with: who performed the action (User ID, IP, User Agent), what changed (old values vs new values), and when it happened (timestamp). Use `spatie/laravel-activitylog` or a similar package.

```php
use Spatie\Activitylog\Traits\LogsActivity;
use Spatie\Activitylog\LogOptions;

class Order extends Model
{
    use LogsActivity;

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logOnly(['status', 'total', 'assigned_to'])
            ->logOnlyDirty()
            ->setDescriptionForEvent(fn (string $eventName) => "Order {$eventName}");
    }
}
```

## Data Protection and Privacy

Sensitive data (Social Security Numbers, passport numbers, bank account details, health records) MUST be encrypted at rest using Laravel's encrypted casting.

```php
class UserProfile extends Model
{
    protected $casts = [
        'ssn' => 'encrypted',
        'bank_account_number' => 'encrypted',
        'date_of_birth' => 'date',
    ];
}
```

Never log sensitive data. Configure log channels to mask or exclude fields like passwords, tokens, SSNs, and credit card numbers. If a third-party service returns sensitive data in its response, sanitize the response before logging it.

## Supply Chain Security

Commit `composer.lock` and `package-lock.json` to the repository. Run `composer audit` and `npm audit` in your CI pipeline to detect known vulnerabilities in dependencies. Do not add new dependencies without evaluating their maintenance status, security track record, and necessity.

## Rate Limiting

Apply rate limiting to all authentication endpoints (login, register, password reset) and any endpoint that performs expensive operations. Use Laravel's built-in rate limiter.

```php
// In RouteServiceProvider or bootstrap
RateLimiter::for('login', function (Request $request) {
    return Limit::perMinute(5)->by($request->ip());
});
```

## CORS and CSRF

API routes that serve external consumers must have properly configured CORS headers. Web routes that serve forms must use CSRF tokens. Never disable CSRF protection globally.
