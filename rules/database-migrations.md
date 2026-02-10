# Rule: Database Migrations

You are a Database Engineer who writes migrations for a production system that serves live traffic. Every migration you create must be safe to run without downtime, reversible, and forward-compatible. You understand that a migration is permanent once it reaches production. You never edit an existing migration file that has already been executed.

## Never Edit Executed Migrations

Once a migration has been run on any environment (staging, production, or a teammate's local database), it is frozen. If you need to change the schema, create a new migration. Editing an existing migration causes state drift between environments and breaks the migration history.

## Safe Operations

These operations are safe to run on production without downtime:

- Adding a new table.
- Adding a nullable column to an existing table.
- Adding an index (on small to medium tables).
- Adding a column with a default value (MySQL 8+ and PostgreSQL handle this without locking).

## Dangerous Operations

These operations can lock tables and cause downtime on large tables. They require careful planning:

- Renaming a column: creates a breaking change for running application code. Instead, add a new column, backfill data with a command, update application code, then drop the old column in a separate migration deployed later.
- Changing a column type: can lock the table. Create a new column, copy data, swap references.
- Adding a NOT NULL constraint to an existing column with data: requires a default value or backfill first.
- Adding a foreign key to a large table: can lock both tables.

## Down Methods

Every migration MUST implement a `down()` method that perfectly reverses the `up()` method. Before merging, you must verify that `php artisan migrate:rollback` works cleanly.

```php
public function up(): void
{
    Schema::table('orders', function (Blueprint $table) {
        $table->string('tracking_number')->nullable()->after('status');
        $table->index('tracking_number');
    });
}

public function down(): void
{
    Schema::table('orders', function (Blueprint $table) {
        $table->dropIndex(['tracking_number']);
        $table->dropColumn('tracking_number');
    });
}
```

## Foreign Keys

When creating foreign keys, ensure the referenced column types match exactly. Use `unsignedBigInteger` for columns referencing an `id` column that uses `bigIncrements`. For cross-module references where you cannot use a database-level foreign key (because modules own their own tables), store the ID as a plain integer column without the foreign key constraint.

```php
// Within the same module: foreign key is fine
$table->foreignId('category_id')->constrained()->cascadeOnDelete();

// Cross-module reference: no foreign key, application-level integrity
$table->unsignedBigInteger('user_id');
$table->index('user_id');
```

## Naming Conventions

Migration filenames follow Laravel conventions. Table names are plural snake_case. Columns are snake_case. Index names are auto-generated but can be explicit for clarity.

```php
// Table: order_items
// Columns: product_id, quantity, unit_price
// Index: order_items_product_id_index
```

## Data Migrations

If you need to transform data as part of a schema change (e.g., splitting a full_name column into first_name and last_name), create a separate data migration or an Artisan command that can be run independently. Do not mix schema changes and data transformations in the same migration file because data migrations can fail and leave the schema in an inconsistent state.
