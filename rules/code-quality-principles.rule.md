# Rule: Code Quality Principles

Kamu adalah seorang Engineer yang menulis kode dengan kualitas tinggi berdasarkan prinsip-prinsip yang telah disepakati tim. Setiap baris kode harus **readable**, **consistent**, **type-safe**, dan **framework-aligned**. Kamu menggunakan Laravel sesuai desain aslinya, bukan melawannya.

---

## 1. Readable Before Clever

Kode harus mudah dibaca **sebelum** dianggap ringkas atau "smart".

### DON'T: Terlalu Clever

```php
// ❌ Secara teknis benar, tapi sulit debug & tidak jelas tujuannya
$total = collect($orders)->filter(fn($o) => $o->status === 'paid')
    ->map(fn($o) => $o->items->sum('price'))
    ->sum();
```

### DO: Readable & Intentional

```php
// ✅ Lebih panjang, tapi intensi jelas, mudah debug & breakpoint
$paidOrders = $orders->where('status', 'paid');

$totalRevenue = $paidOrders->sum(function ($order) {
    return $order->items->sum('price');
});
```

**Rule of thumb:** "Jika reviewer harus berhenti lebih dari 3 detik untuk memahami satu baris kode, baris tersebut perlu disederhanakan."

---

## 2. Consistency Over Preference

Konsistensi tim lebih penting daripada gaya pribadi developer.
- Jika tim sepakat pakai Service Class → semua pakai Service Class
- Jika tim sepakat naming convention tertentu → semua ikuti

---

## 3. Single Source of Truth (SSOT)

Tidak boleh ada duplikasi logika bisnis. Aturan yang sama TIDAK boleh ditulis di lebih dari satu tempat.

### DON'T: Duplikasi Logic

```php
// ❌ Di Controller:
if ($order->status !== 'paid') {
    abort(403);
}

// ❌ Di Service lain (aturan SAMA, ditulis lagi):
if ($order->status !== 'paid') {
    throw new Exception('Invalid order');
}
```

### DO: Sentralkan di Service/Model

```php
// ✅ Aturan ditulis SEKALI di Model/Service
class Order extends Model
{
    public function isPaid(): bool
    {
        return $this->status === 'paid';
    }
}

// Dipakai di mana saja:
if (! $order->isPaid()) { ... }
```

---

## 4. Single Responsibility Principle (SRP)

Setiap class dan method hanya boleh memiliki **satu tanggung jawab**.

**Indikasi pelanggaran SRP:**
- Method terlalu panjang
- Terlalu banyak if/else
- Sulit dijelaskan dalam satu kalimat

**Praktik yang dianjurkan:**
1. Pisahkan validasi, formatting, dan business rule
2. Gunakan method kecil dengan nama yang jelas
3. Pindahkan logika kompleks ke Service atau Domain Layer

**"SRP bukan tentang jumlah baris, tapi alasan perubahan."**

---

## 5. Don't Repeat Yourself (DRY)

Setiap aturan bisnis harus memiliki satu sumber kebenaran.

**Penerapan DRY wajib pada:**

| Konteks | Solusi |
|---|---|
| Query Eloquent berulang | Gunakan **local scope** |
| Blade template berulang | Gunakan `@extends`, `@include`, `@component` |
| Business logic berulang | Gunakan **Service Class** |
| Shared behavior antar model | Gunakan **Trait** |

**Anti-pattern DRY:**
- Copy-paste query antar model
- Duplikasi validasi di controller dan service
- Helper global tanpa konteks domain

---

## 6. Type Safety & Kontrak Kode

### Type Declaration (Wajib)

```php
// ✅ Wajib type hint pada parameter dan return value
declare(strict_types=1);

public function calculateDiscount(Order $order, float $percentage): float
{
    return $order->total * ($percentage / 100);
}

// ✅ Nullable type jika bisa null
public function findUser(int $id): ?User
{
    return User::find($id);
}

// ✅ Union type (PHP 8+) jika relevan
public function process(int|string $identifier): Result
{
    // ...
}
```

**Engineering rule:** "Method tanpa return type dianggap incomplete contract."

### DocBlock

Digunakan untuk:
1. Dokumentasi
2. Static analysis (PHPStan, Psalm)
3. Konteks tambahan di luar tipe native (misalnya: `@param array<int, OrderItem> $items`)

---

## 7. Code Style & Laravel Pint

**Laravel Pint** wajib digunakan sebagai formatter standar.

**Aturan:**
1. Pint dijalankan **sebelum commit**
2. Tidak ada diskusi subjektif soal formatting di code review
3. Gunakan format `pint` bawaan Laravel (preset default)

**Manfaat:**
- Konsistensi lintas tim
- Review fokus ke logika, bukan spasi/indentasi

---

## 8. Larangan Meng-override Fitur Inti Laravel

### Dilarang

- Mengubah behavior internal Laravel
- Meng-override core class tanpa alasan arsitektural kuat

### Prinsip Resmi: **"Extend, don't modify"**

### Risiko Override

| Risiko | Dampak |
|---|---|
| Masalah saat upgrade Laravel | Breaking changes tak terduga |
| Bug tersembunyi | Sulit trace karena behavior non-standar |
| Ketergantungan pada implementasi internal | Fragile code |

### Gunakan Alternatif

- **Service Provider** — untuk binding dan bootstrapping
- **Event / Listener** — untuk hook ke lifecycle Laravel
- **Macro** — untuk extend class tanpa modify
- **Custom abstraction** — untuk layer tambahan di atas framework
