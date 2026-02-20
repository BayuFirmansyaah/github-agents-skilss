# Rule: Laravel Octane + FrankenPHP Runtime

Kamu adalah seorang Engineer yang memahami bahwa menggunakan **Laravel Octane** mengubah sifat aplikasi dari **request-terminate** menjadi **long-running process**. Ini berarti aplikasi hidup terus-menerus di memori (RAM), dan setiap kelalaian dalam pengelolaan state bisa menyebabkan **memory leak**, **data bleed antar request**, atau **server crash**.

---

## Standar Implementasi

1. **Wajib** menggunakan Laravel Octane untuk lingkungan produksi
2. Server/Driver yang digunakan: **FrankenPHP**
3. **Tidak lagi** menggunakan PHP-FPM standar kecuali untuk kebutuhan legacy khusus

---

## Implikasi Engineering (Wajib Diperhatikan)

### 1. Pengelolaan State & Memori (Memory Leaks)

**Masalah:** Aplikasi hidup terus di RAM. Kebocoran kecil akan menumpuk hingga server crash.

**Aturan:**
- Hindari menambahkan data ke dalam array statis atau global variabel yang tidak dibersihkan setelah request selesai
- Jangan gunakan `static` property untuk menyimpan data request-specific tanpa cleanup

```php
// ❌ BAHAYA: Static array yang terus bertambah setiap request
class Logger
{
    protected static array $logs = [];

    public static function log(string $message): void
    {
        self::$logs[] = $message; // Tidak pernah dibersihkan!
    }
}

// ✅ AMAN: Gunakan per-request scope atau bersihkan setelah request
class Logger
{
    public function __construct(
        protected array $logs = []
    ) {}

    public function log(string $message): void
    {
        $this->logs[] = $message;
    }
}
// Bind sebagai scoped agar di-resolve ulang setiap request
// $this->app->scoped(Logger::class);
```

---

### 2. Dependency Injection & Singleton

**Masalah:** Singleton hanya di-resolve SEKALI saat worker boot. Jika singleton menyimpan state request, request berikutnya akan mendapat data request sebelumnya (data bleed).

**Aturan:**
- Hati-hati saat me-resolve service berbentuk Singleton
- Pastikan Singleton **tidak menyimpan** state spesifik milik user/request
- Gunakan **Scoped binding** jika objek bergantung pada state request saat ini

```php
// Di AppServiceProvider:

// ✅ Scoped: di-resolve ulang setiap request cycle
$this->app->scoped(CartService::class, function ($app) {
    return new CartService($app->make('request')->user());
});

// ❌ Singleton: BAHAYA jika menyimpan request state
$this->app->singleton(CartService::class, function ($app) {
    return new CartService($app->make('request')->user());
    // User dari request pertama akan "melekat" ke semua request!
});
```

---

### 3. Konstruktor & Destruktor

**Masalah:** Konstruktor service global hanya dijalankan **sekali saat worker booting** (bukan setiap request).

**Aturan:**
- Jangan menaruh logika inisialisasi per-request di dalam `__construct()` milik service Singleton/Long-lived
- Gunakan **method injection** untuk data yang berubah per-request

### DO: Method Injection untuk Request-Specific Data

```php
// ✅ AMAN: $request di-inject per-method, selalu fresh
class OrderController extends Controller
{
    public function handle(Request $request, OrderService $service)
    {
        // $request adalah milik user yang sedang mengakses saat ini
        return $service->process($request->user());
    }
}
```

### DON'T: Constructor Injection untuk Request State

```php
// ❌ BAHAYA DI OCTANE:
// Konstruktor mungkin hanya jalan sekali saat server start
// $request yang di-inject bisa jadi stale (milik request pertama)
class OrderService
{
    protected $currentUser;

    public function __construct(Request $request)
    {
        $this->currentUser = $request->user();
    }
}
```

---

## Checklist Octane-Safety

Sebelum deploy ke Octane, pastikan:

- [ ] Tidak ada static property yang menyimpan data request-specific tanpa cleanup
- [ ] Tidak ada Singleton yang menyimpan `$request`, `auth()->user()`, atau session data
- [ ] Konstruktor service global tidak melakukan inisialisasi per-request
- [ ] Semua request-dependent service menggunakan **Scoped binding**
- [ ] Tidak ada global variable yang terus bertambah tanpa batas
- [ ] File handles dan koneksi database di-clean setelah selesai

---

## Ringkasan Perbedaan PHP-FPM vs Octane

| Aspek | PHP-FPM (Lama) | Octane / FrankenPHP |
|---|---|---|
| Lifecycle | Boot → Handle → Terminate | Boot (sekali) → Handle → Handle → ... |
| Static property | Reset setiap request | Persist antar request |
| Singleton | Baru setiap request | Dibuat sekali, reuse |
| Memory | Auto-cleanup setiap request | Harus dikelola manual |
| Constructor | Dijalankan setiap request | Dijalankan sekali saat boot |
