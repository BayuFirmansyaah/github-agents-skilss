# Skill: Eloquent Performance

You are a Senior Backend Engineer responsible for ensuring the database layer of this large-scale Laravel application is performant under heavy load. You understand that most application bottlenecks originate from poorly written queries, missing indexes, and uncontrolled memory consumption. Every query you write must be intentional, efficient, and observable.

## N+1 Query Prevention

N+1 queries are a critical performance defect. You MUST eager load relationships whenever you iterate over a collection that accesses related data.

```php
// WRONG: This triggers N+1 queries. Each iteration hits the database.
$books = Book::all();
foreach ($books as $book) {
    echo $book->author->name;
}

// CORRECT: Eager load reduces this to exactly 2 queries.
$books = Book::with('author')->get();
foreach ($books as $book) {
    echo $book->author->name;
}

// NESTED EAGER LOADING: Load deep relationships in a single declaration.
$orders = Order::with(['items.product.category', 'user.profile'])->get();
```

## Select Only What You Need

Never query all columns when you only need a subset. This wastes memory and bandwidth, especially on tables with TEXT or BLOB columns.

```php
// WRONG
$users = User::all();

// CORRECT
$users = User::select(['id', 'name', 'email'])->get();

// WITH RELATIONSHIPS: Specify which columns on the relation too.
$orders = Order::with(['user:id,name'])->select(['id', 'user_id', 'total'])->get();
```

## Chunking and Cursor for Large Datasets

When processing thousands or millions of records, loading them all into memory at once will crash your application. Use `chunk` for batch processing with callbacks, or `cursor` for memory-efficient lazy iteration.

```php
// CHUNK: Processes 200 records at a time. Good for bulk updates.
User::where('active', false)->chunk(200, function ($users) {
    foreach ($users as $user) {
        $user->delete();
    }
});

// LAZY COLLECTION: Uses a generator. One record in memory at a time.
foreach (User::where('active', true)->lazy() as $user) {
    // process one by one without memory explosion
}

// CURSOR: Similar to lazy but uses a database cursor. Most memory-efficient.
foreach (User::cursor() as $user) {
    // ...
}
```

## Repository Caching with Tags

For frequently read, rarely written data, use the Repository Pattern with a Caching Decorator. Use Cache Tags so you can invalidate granularly.

```php
// Infrastructure/Persistence/Repositories/CachingProductRepository.php
class CachingProductRepository implements ProductRepositoryInterface
{
    public function __construct(
        private readonly EloquentProductRepository $inner,
    ) {}

    public function findById(int $id): ?Product
    {
        return Cache::tags(['products', "product:{$id}"])
            ->remember("product:{$id}", 3600, fn () => $this->inner->findById($id));
    }

    public function update(Product $product): void
    {
        $this->inner->update($product);
        Cache::tags(["product:{$product->id}"])->flush();
    }

    public function clearAll(): void
    {
        Cache::tags(['products'])->flush();
    }
}
```

## Pessimistic Locking for Concurrency

When multiple users or processes might modify the same row simultaneously (e.g., claiming a voucher, decrementing stock), you MUST use pessimistic locking within a database transaction.

```php
// lockForUpdate() prevents other transactions from reading this row until this transaction completes.
DB::transaction(function () {
    $voucher = Voucher::where('code', 'SALE10')->lockForUpdate()->first();

    if ($voucher && $voucher->uses_remaining > 0) {
        $voucher->decrement('uses_remaining');
        // ... grant voucher to user
    } else {
        throw new VoucherExhaustedException();
    }
});
```

## Atomic Updates

Prefer SQL-level atomic operations over the Read-Modify-Write pattern, which is vulnerable to race conditions.

```php
// WRONG: Race condition. Two requests can read stock=5, both write stock=4.
$product = Product::find($id);
$product->stock = $product->stock - 1;
$product->save();

// CORRECT: Atomic decrement at the SQL level. No race condition.
Product::where('id', $id)->where('stock', '>', 0)->decrement('stock');
```

## Indexing Strategy

Every column used in `WHERE`, `ORDER BY`, `GROUP BY`, or `JOIN ON` clauses MUST be indexed. Create composite indexes for queries that filter on multiple columns.

```php
// In your migration
$table->index('status');
$table->index('email');
$table->index(['category_id', 'created_at']); // Composite: filter by category, sort by date
$table->unique(['user_id', 'product_id']);     // Unique constraint + index
```

## Read/Write Splitting

For heavy reporting or analytics queries, force the use of the read replica connection to avoid overloading the master database.

```php
// Explicitly use the read replica for expensive reports
$reportData = DB::connection('mysql::read')
    ->table('orders')
    ->selectRaw('DATE(created_at) as date, SUM(total) as revenue')
    ->groupBy('date')
    ->get();
```
