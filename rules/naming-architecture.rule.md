# Rule: Naming Convention & MVC + Service Architecture

Kamu adalah seorang Engineer yang bekerja dalam tim dengan arsitektur **MVC + Service Layer** (tanpa Repository layer). Setiap kode yang kamu tulis harus mengikuti standar penamaan yang konsisten dan menempatkan logic di layer yang tepat. Tidak ada business rule di Blade, tidak ada query kompleks di Controller.

---

## Standar Penamaan

### Konvensi Umum

Wajib mengikuti **PSR-1**, **PSR-4**, dan **PSR-12**.

| Elemen | Aturan | Contoh |
|---|---|---|
| Controller | Singular | `ArticleController` |
| Model | Singular | `User` |
| Route | Plural | `/articles` |
| Table | Plural snake_case | `article_comments` |
| Variable | camelCase | `$activeUsers` |
| Collection | Plural & deskriptif | `$activeUsers`, `$paidOrders` |
| Method | camelCase & verb-based | `calculateTotal()`, `sendNotification()` |
| View | snake_case | `show_filtered.blade.php` |

**Engineering rule:** "Jika sebuah nama tidak bisa dijelaskan tanpa komentar, maka namanya salah."

---

## Arsitektur MVC + Service Layer

### Struktur Folder

```
app/
├── Models/
├── Http/
│   ├── Controllers/
│   ├── Requests/
│   └── Middleware/
├── Services/
└── Providers/
```

**Tidak menggunakan:**
```
app/Repositories/    ← TIDAK DIPAKAI
```

**Alasan tidak pakai Repository:**
1. Eloquent sudah berfungsi sebagai data access layer
2. Repository sering menjadi wrapper pasif tanpa nilai tambah
3. Menambah kompleksitas tanpa kebutuhan nyata

Repository hanya dipertimbangkan jika: multi data source, query sangat kompleks lintas domain, atau kebutuhan swap persistence layer.

---

## Tanggung Jawab Tiap Layer

### Model

**Fokus pada:**
- Representasi tabel
- Relasi antar model
- Scope query
- Domain helper sederhana (pure logic kecil)

```php
// ✅ Model yang benar
class Order extends Model
{
    protected $fillable = ['user_id', 'reference', 'status'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function scopePaid($query)
    {
        return $query->where('status', 'paid');
    }

    public function isPaid(): bool
    {
        return $this->status === 'paid';
    }
}
```

**Yang TIDAK BOLEH di Model:**
- Mengakses Request
- Mengirim email
- Menjalankan transaction kompleks
- Query lintas banyak domain

---

### Controller

**Fokus pada:**
- Menerima request
- Validasi (via Form Request)
- Memanggil Service
- Mengembalikan response

```php
// ✅ Controller yang benar — tipis & deterministik
class OrderController extends Controller
{
    public function store(StoreOrderRequest $request, OrderService $service)
    {
        $order = $service->create($request->validated());
        return redirect()->route('orders.show', $order);
    }
}
```

**Yang TIDAK BOLEH di Controller:**
- Query kompleks
- Looping domain logic
- Perhitungan bisnis
- Transaction orchestration yang berat

**Indikator masalah:** Jika controller lebih dari ±15–20 baris logic aktif, itu indikasi business logic belum dipindahkan ke Service.

---

### Service (Pusat Business Logic)

**Bertanggung jawab atas:**
- Validasi domain (di luar validasi request)
- Orkestrasi transaction
- Integrasi dengan service eksternal
- Penegakan business invariant

```php
// ✅ Service yang benar
class OrderService
{
    public function create(array $data): Order
    {
        return DB::transaction(function () use ($data) {
            $order = Order::create($data);

            if (! $order->isPaid()) {
                throw new DomainException('Order must be paid.');
            }

            $this->applyReward($order);
            return $order;
        });
    }

    protected function applyReward(Order $order): void
    {
        // domain logic
    }
}
```

---

## Alur Request Lengkap

```
Request masuk
    ↓
FormRequest → validasi format
    ↓
Controller → panggil Service
    ↓
Service → jalankan business logic + transaction
    ↓
Model → persist data
    ↓
Response dikembalikan
```

Flow deterministik & mudah dilacak.

---

## Anti-Pattern yang Dilarang

| Anti-Pattern | Mengapa Salah |
|---|---|
| Business rule di Blade | Logic tersembunyi, tidak bisa di-test |
| Query kompleks di Controller | Controller jadi fat, sulit maintain |
| Request logic di Model | Model tidak seharusnya tahu tentang HTTP |
| Cache logic tersebar | Sulit di-invalidasi, data stale |
| Service hanya wrapper tipis | Tidak menambah nilai, tambah kompleksitas |
| Manual join tanpa relasi Eloquent | Tidak framework-aligned, sulit maintain |

### DO: Gunakan Relasi Eloquent

```php
// ✅ Framework-aligned
class Order extends Model
{
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
$orders = Order::with('user')->get();
```

### DON'T: Manual Join

```php
// ❌ Melawan desain Laravel
DB::table('orders')
    ->join('users', 'orders.user_id', '=', 'users.id')
    ->get();
```
