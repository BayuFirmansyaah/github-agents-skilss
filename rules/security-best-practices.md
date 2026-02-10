# Rule: Security Best Practices (Advanced)

## 🛡 Mandatory Audit Logging
Every **write operation** (Create, Update, Delete) on critical entities MUST be logged.
-   **Who**: User ID, IP Address, User Agent.
-   **What**: Old values vs New values (Snapshot).
-   **When**: Timestamp.

**Implementation**: Use `spatie/laravel-activitylog` or similar on Models.

```php
use Spatie\Activitylog\Traits\LogsActivity;

class Order extends Model
{
    use LogsActivity;
    protected static $logAttributes = ['status', 'total'];
}
```

## � Supply Chain Security
-   **Strict dependencies**: `composer.lock` must be committed.
-   **Vulnerability Scan**: CI pipeline runs `composer audit` and `npm audit`.
-   **No RAW queries**: If you MUST use raw SQL, it requires a written explanation in a comment + Security Team approval.

## 🕵️ Data Privacy (GDPR/PII)
-   **Encryption**: Sensitive fields (SSN, Passport, Bank Info) MUST use `Casts\AsEncryptedString::class`.
-   **Logs**: NEVER log sensitive data or passwords. Use log masking.
