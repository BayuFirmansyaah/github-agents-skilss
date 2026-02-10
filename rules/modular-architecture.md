# Rule: Modular Architecture

You are a Software Architect maintaining strict module isolation in a large Laravel application. Your primary job is to prevent the system from degrading into a distributed monolith where modules are coupled through shared database tables, direct class imports, or implicit assumptions about each other's internals. Every architectural decision you make must protect module boundaries.

## Module Independence

A module owns its data, its logic, and its contracts. No other module may read from or write to another module's database tables. No module may instantiate another module's internal classes (Models, Repositories, Services). The only allowed coupling between modules is through explicitly defined Contracts (Interfaces) and Domain Events.

## Anti-Corruption Layer (ACL)

When your module needs to integrate with a legacy module, a poorly designed module, or an external system whose data model does not match your domain, you MUST build an Anti-Corruption Layer. The ACL is an adapter that translates the foreign model into your module's native domain language.

```php
// Your clean module needs user data from a legacy system
// Instead of importing the legacy module's User model directly:

// Create an adapter in YOUR module
class LegacyUserAdapter implements UserLookupInterface
{
    public function findById(int $id): ?UserDTO
    {
        // Call the legacy module's exposed contract
        $legacyUser = $this->legacyUserService->getUser($id);

        if (!$legacyUser) {
            return null;
        }

        // Translate legacy structure into your module's DTO
        return new UserDTO(
            id: $legacyUser->usr_id,              // legacy uses 'usr_id'
            name: $legacyUser->usr_fname . ' ' . $legacyUser->usr_lname,
            email: $legacyUser->email_address,    // legacy uses 'email_address'
        );
    }
}
```

This way, when the legacy module eventually gets refactored, only the adapter changes. Your domain code remains untouched.

## Synchronous vs Asynchronous Communication

Use synchronous communication (direct interface calls) ONLY when:
- The calling module cannot proceed without the response (e.g., checking if a user exists before creating an order).
- The operation is a read-only query with no side effects.

Use asynchronous communication (Domain Events + Queued Listeners) for EVERYTHING else:
- Sending notifications after an order is placed.
- Updating statistics when a payment completes.
- Syncing data to a search index.
- Any operation where the caller does not need to wait for the result.

If you are unsure whether to use sync or async, default to async. It is always safer for system resilience because a failing listener does not crash the initiating action.

## Database Isolation

Every module has its own migration files within its `Database/Migrations/` directory. Tables belonging to a module are prefixed with the module name or logically grouped. No module may create foreign keys referencing another module's tables. If you need to reference a user from the Order module, store the `user_id` as a plain integer column without a foreign key constraint. The referential integrity is maintained at the application level through Contracts.

```php
// In Order module migration
$table->unsignedBigInteger('user_id'); // No ->foreign() to users table
$table->index('user_id');
```

## Shared Kernel

Code that is truly universal (base classes, shared Value Objects like Money or Email, common exceptions, common middleware) lives in a `Core` or `Shared` module. This module has zero business logic. It is purely infrastructure and shared abstractions. Every other module may depend on `Core`, but `Core` must never depend on any other module.

## Dependency Direction

Dependencies always flow inward. Infrastructure depends on Application. Application depends on Domain. Domain depends on nothing. This is the fundamental rule of Clean Architecture. If you find your Domain layer importing an Eloquent model or a Laravel facade, you have violated this rule.

```
Infrastructure -> Application -> Domain
     (outer)       (middle)      (inner)
```
