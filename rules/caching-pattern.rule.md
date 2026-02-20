# Rule: Caching Pattern & View Composer

Kamu adalah seorang Engineer yang membangun sistem cache yang **konsisten**, **mudah di-invalidasi**, dan **tidak menimbulkan data stale**. Cache bukan sumber kebenaran — Model adalah single source of truth. Kamu juga memahami bahwa View Composer adalah **data glue, bukan data processor**.

---

## Bagian 1: Standarisasi Pola Cache

### Arsitektur Cache yang Dianjurkan

```
Model (source of truth)
    ↓
Cache Class (menyimpan data siap pakai)
    ↓
Observer / Trait (auto-invalidation)
    ↓
View / Service (hanya MEMBACA cache, tidak membangun ulang)
```

### DO: Satu Cache Class per Domain Data

```php
// ✅ Dedicated Cache Class dengan key eksplisit
class JenisOutputCache
{
    const KEY = 'jenis_output:options';

    public static function options(): array
    {
        return Cache::remember(
            self::KEY,
            now()->addDay(),
            fn () => JenisOutput::pluck('nama', 'id')->toArray()
        );
    }

    public static function clear(): void
    {
        Cache::forget(self::KEY);
    }
}
```

### DO: Auto-Invalidation via Model Observer

```php
// ✅ Cache otomatis ter-invalidasi saat data berubah
class JenisOutputObserver
{
    public function created(JenisOutput $model): void
    {
        JenisOutputCache::clear();
    }

    public function updated(JenisOutput $model): void
    {
        JenisOutputCache::clear();
    }

    public function deleted(JenisOutput $model): void
    {
        JenisOutputCache::clear();
    }
}
```

### DO: Alternatif Auto-Invalidation via Trait

```php
// ✅ Trait reusable untuk auto cache invalidation
namespace App\Models\Traits;

trait ClearCache
{
    protected static function bootClearCache(): void
    {
        static::updated(function ($model) {
            static::clearCache($model);
        });
        static::deleted(function ($model) {
            static::clearCache($model);
        });
    }

    abstract private static function clearCache($model): void;
}
```

### DON'T: Cache Tersebar Tanpa Standar

```php
// ❌ Cache di controller acak — tidak terpusat
public function index()
{
    return Cache::remember('jenis_output', 86400, function () {
        return JenisOutput::all(); // over-fetching juga!
    });
}

// ❌ rememberForever tanpa invalidasi — data stale selamanya
Cache::rememberForever('jenis_output', function () {
    return JenisOutput::pluck('nama', 'id');
});
```

### Prinsip Cache (Wajib)

| Prinsip | Penjelasan |
|---|---|
| Cache bukan sumber kebenaran | Model = single source of truth |
| Cache harus mudah dihapus | Gunakan Cache Class dengan `clear()` |
| Cache harus terpusat | Satu class per domain, bukan tersebar |
| Cache harus otomatis ter-invalidate | Gunakan Observer atau Trait |
| Key cache harus eksplisit & terdokumentasi | Gunakan konstanta, bukan string acak |

### Risiko Jika Diabaikan

- Bug sulit direproduksi (hanya muncul di production)
- Inconsistent behavior antar modul
- Refactor mahal & berisiko
- Data stale yang tidak terdeteksi

---

## Bagian 2: View Composer

### Bahaya View Composer yang Salah Pakai

View Composer dipanggil **setiap kali view/partial dirender**. Dalam satu halaman bisa terjadi:
- 5–10x pemanggilan
- Loop permission berulang
- Query redundant

### DO: Memoize per-Request

```php
// ✅ Kalkulasi berat HANYA SEKALI per request
protected static $viewCache = null;

public function handle(Request $request, Closure $next)
{
    View::composer(['*::pages.*', '*::livewire.*'], function ($view) use ($request) {
        // Cek apakah sudah pernah dihitung di request ini
        if (is_null(self::$viewCache)) {
            $viewData = $view->getData();
            self::$viewCache = Page::buildViewData(
                module: 'spmi',
                menu: Menu::navbar(),
                // ... parameter lainnya
            );
        }
        // Reuse data dari cache
        View::share(self::$viewCache);
    });

    return $next($request);
}
```

### DON'T: Kalkulasi Berat di Setiap Render

```php
// ❌ Setiap kali view dirender, kalkulasi berat dijalankan ulang
public function handle(Request $request, Closure $next)
{
    View::composer(['*::pages.*', '*::livewire.*'], function ($view) {
        $viewData = $view->getData();
        View::share(
            Page::buildViewData(
                module: 'spmi',
                menu: Menu::navbar(), // Query setiap render!
                sidebar: $viewData['sidebar'] ?? null,
            )
        );
    });

    return $next($request);
}
```

### Rule of Thumb untuk View Composer

1. View Composer = **data glue**, bukan data processor
2. Jika berat → **cache** (minimal per-request memoization)
3. Jika kompleks → **pindahkan ke Service**
4. Jangan taruh query berat, permission loop, atau recursive array build di View Composer
