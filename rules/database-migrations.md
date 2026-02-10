# Rule: Database Migrations

## ⚠️ ZERO DOWNTIME
We deploy frequently. Migrations must NOT lock tables for long periods or break the running application.

## 🚫 Prohibited Actions in Existing Migrations
**NEVER EDIT AN EXISTING MIGRATION FILE THAT HAS BEEN RAN.**
Create a NEW migration to modify the schema.

## 🔓 Non-Breaking Changes
-   Adding a nullable column: ✅ Allowed.
-   Adding a new table: ✅ Allowed.
-   Renaming a column: ❌ **FORBIDDEN** (Breaks code using old name).
    -   *Alternative*: Add new column, copy data, deprecate old column, remove later.

## 📉 Down Methods
Every migration MUST have a `down()` method that perfectly reverses the `up()` method.
Testing rollback is mandatory.

## 🔑 Foreign Keys
Creating foreign keys on large tables can lock them.
-   Break big migrations into smaller ones.
-   Use integer types that match exactly (e.g., `unsignedBigInteger`).
