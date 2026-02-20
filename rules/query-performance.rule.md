# Rule: Query Performance & Data Fetching

Kamu adalah seorang Engineer yang sadar performa. Setiap query yang kamu tulis harus mempertimbangkan **query count**, **memory usage**, dan **scalability**. Kamu tidak pernah mengandalkan lazy loading secara implisit, tidak pernah melakukan over-fetching, dan tidak pernah menggunakan JSON sebagai alat transformasi data internal.

**Golden Rule: "Ambil data seminimal mungkin, sedekat mungkin ke database."**

---

## 1. Eager Loading — Cegah N+1 Query

### DO: Gunakan `with()` untuk Eager Loading

```php
// ✅ Satu query (atau minimal) untuk seluruh hierarchy relasi
$organizations = Organization::with([
    'branches.departments.teams.projects'
])->get();

// ✅ Definisikan relasi di Model, bukan di controller/service
class Organization extends Model
{
    public function branches()
    {
        return $this->hasMany(Branch::class);
    }
}
```

### DON'T: Query di Dalam Loop

```php
// ❌ N+1: setiap iterasi memicu query baru
$organizations = Organization::all();
foreach ($organizations as $org) {
    $branches = $org->branches; // Lazy load per iterasi!
    foreach ($branches as $branch) {
        $departments = $branch->departments; // Lagi query!
    }
}
```

**Dampak tanpa eager loading:**
- Query dieksekusi berulang kali (bisa ratusan/ribuan)
- Latensi meningkat drastis
- Masalah bukan pada Laravel, tapi pada **pola penggunaan**

**Prinsip:**
1. Hindari N+1 Query — selalu
2. Relasi ditulis sekali di Model, dipakai selamanya
3. Query eksplisit > implicit loading

---

## 2. Penggunaan `pluck()` untuk Efisiensi

### DO: Gunakan `Model::pluck()` Langsung

```php
// ✅ Query langsung ke kolom yang dibutuhkan, tanpa hydration model
$emails = Employee::pluck('email', 'id')->toArray();
// SQL: SELECT `email`, `id` FROM `employees`
```

### DON'T: `all()` Lalu `pluck()`

```php
// ❌ Over-fetching: SELECT * lalu filter di PHP
$emails = Employee::all()->pluck('email', 'id')->toArray();
// SQL: SELECT * FROM `employees` → buat Collection penuh → baru pluck
```

**Perbandingan:**

| Aspek | `Model::pluck()` (✅) | `Model::all()->pluck()` (❌) |
|---|---|---|
| SQL | `SELECT email, id` | `SELECT *` |
| Memory | Rendah (hanya 2 kolom) | Tinggi (semua kolom + model objects) |
| Hydration | Tidak ada | Semua record di-hydrate |
| Kecepatan | Cepat | Lambat seiring data bertambah |

**Anti-pattern:** "Karena akhirnya butuh Collection, maka pakai `all()` dulu." → Ini salah untuk data besar.

---

## 3. Larangan `json_encode` / `json_decode` untuk Transformasi Data

### DO: Gunakan Laravel Collection API / DTO / Resource

```php
// ✅ Jika menggunakan Query Builder:
$results = DB::table('table')->get()->toArray();

// ✅ Jika menggunakan Eloquent:
$results = Model::query()->get()->toArray();

// ✅ Jika tetap menggunakan DB::select():
$results = collect($resultQuery)
    ->map(fn ($row) => (array) $row)
    ->toArray();
```

### DON'T: JSON Encode-Decode untuk Casting

```php
// ❌ Code Smell: JSON sebagai alat konversi internal
$resultQuery = DB::select($sql, ['id' => $id]);
return json_decode(json_encode($resultQuery), true);
```

**Mengapa ini Code Smell:**
1. `json_encode()` → mahal di CPU, membuat copy data baru
2. Tidak type-safe — kehilangan informasi tipe
3. Menyembunyikan desain data yang buruk
4. Biasanya tanda: struktur data tidak jelas, boundary layer tidak tegas, tidak ada DTO/Resource layer

**Clean Code Principle:** "Jangan gunakan format pertukaran data (JSON) sebagai alat manipulasi internal."

---

## Checklist Sebelum Menulis Query

- [ ] Apakah semua relasi yang dibutuhkan sudah di-eager load dengan `with()`?
- [ ] Apakah hanya kolom yang dibutuhkan yang diambil? (gunakan `select()` atau `pluck()`)
- [ ] Apakah ada query di dalam loop? (pindahkan ke eager loading)
- [ ] Apakah ada `json_encode`/`json_decode` untuk konversi? (ganti dengan Collection/DTO)
- [ ] Apakah menggunakan `all()` padahal hanya butuh beberapa kolom?
