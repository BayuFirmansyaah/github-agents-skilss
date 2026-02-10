# Skill: Code Style

## Overview
We adhere to **PSR-12** and **Laravel Best Practices**. Consistency is key.

## 📝 General Rules
-   **Indentation**: 4 spaces.
-   **Line Length**: Soft limit 120 characters.
-   **Strict Types**: All PHP files MUST start with `declare(strict_types=1);`.

## 🧬 PHP Conventions
-   **Class Names**: PascalCase (e.g., `PaymentService`).
-   **Method/Variable Names**: camelCase (e.g., `processPayment`).
-   **Constants**: UPPER_SNAKE_CASE.

### Type Hinting
ALWAYS type hint arguments and return types.

**Bad:**
```php
public function getUser($id) {
    return User::find($id);
}
```

**Good:**
```php
public function getUser(int $id): ?User
{
    return User::find($id);
}
```

## 💅 Tools
-   **PHP CS Fixer**: Run before pushing.
-   **Larastan**: Level 5 minimum.

## 📂 File Organization
-   Classes must be in their dedicated namespaces matching directory structure.
-   One class per file.
