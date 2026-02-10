# Skill: Eloquent Performance (Advanced)

## Overview
High-concurrency applications require more than just eager loading. We employ caching strategies and database locking.

## 🚀 Caching Strategy

### Repository Caching with Tags
We use the **Repository Pattern** with Decorators for caching.

```php
// CachingOrderRepository.php
public function findById(int $id): ?Order
{
    return Cache::tags(['orders', "order:{$id}"])->remember("order:{$id}", 3600, function () use ($id) {
        return $this->innerRepo->findById($id);
    });
}

public function update(Order $order): void
{
    $this->innerRepo->update($order);
    Cache::tags(["order:{$order->id}"])->flush(); // Invalidate specific cache
}
```

## 🔒 Concurrency Control (Locking)

### Pessimistic Locking
Prevents race conditions when multiple users try to modify the same resource (e.g., claiming a voucher).
**MUST** be used within a transaction.

```php
DB::transaction(function () {
    // "SELECT * FROM vouchers WHERE code = ? FOR UPDATE"
    $voucher = Voucher::where('code', 'SALE10')->lockForUpdate()->first();

    if ($voucher->uses_remaining > 0) {
        $voucher->decrement('uses_remaining');
        // ... grant voucher
    }
});
```

### Atomic Updates
Prefer SQL-level updates over Read-Modify-Write.

**Bad:**
```php
$product->stock = $product->stock - 1;
$product->save(); // Race condition possible!
```

**Good:**
```php
$product->decrement('stock');
```

## 🐢 Read/Write Splitting
For heavy reporting queries, force the use of the Read Replica to avoid slowing down the Master DB.

```php
// Force connection to read replica
$reportData = DB::connection('mysql::read')->table('orders')->...
```
