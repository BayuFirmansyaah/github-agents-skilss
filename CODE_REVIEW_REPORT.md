# Code Review Report - SIAKAD-ID Laravel Application

**Date:** February 23, 2026  
**Reviewer:** Senior Code Reviewer  
**Scope:** Full codebase review based on Laravel best practices and project standards

---

## Executive Summary

This review covers the entire SIAKAD-ID Laravel application against established coding standards including MVC + Service Layer architecture, code quality principles, query performance, Livewire state management, file upload patterns, caching, and Octane/FrankenPHP compatibility.

**Overall Assessment:** ⚠️ **Request Changes** - Critical issues found that must be addressed before production deployment.

---

## 🔴 Critical Issues

### 1. JSON Encode/Decode Anti-Pattern (WIDESPREAD)

**Location:** Multiple files throughout the codebase

**Issue:** Extensive use of `json_decode(json_encode($data), true)` as a data transformation mechanism.

**Examples:**
- [Modules/Core/Services/AssessmentRPLManagementService.php](Modules/Core/Services/AssessmentRPLManagementService.php#L126)
- [Modules/Core/Services/AgamaManagementService.php](Modules/Core/Services/AgamaManagementService.php#L126)
- [Modules/Core/Services/BidangStudiManagementService.php](Modules/Core/Services/BidangStudiManagementService.php#L145)
- [Modules/Admission/Services/RegistrasiService.php](Modules/Admission/Services/RegistrasiService.php#L600)
- 20+ more instances across the codebase

```php
// ❌ CRITICAL: Anti-pattern ditemukan
$dataSiakad = json_decode(json_encode($dataSiakad), true);
$dataProdiPendaftarRaw = json_decode(json_encode($dataProdiPendaftarRaw), true);
$statusKelulusan = json_decode(json_encode($statusKelulusan), true)[0] ?? [];
```

**Dampak:**
- **Performance degradation**: JSON encoding/decoding adalah operasi CPU-intensive
- **Memory overhead**: Membuat copy data baru di memory
- **Type safety loss**: Kehilangan informasi tipe data
- **Code smell**: Indikasi desain data yang buruk atau boundary layer yang tidak jelas
- **Scalability issue**: Akan semakin lambat seiring bertambahnya volume data

**Saran Perbaikan:**

```php
// ✅ BENAR: Gunakan Collection/DTO atau cast langsung
// Untuk Query Builder results:
$results = DB::table('table')->get()->toArray();

// Untuk Eloquent:
$results = Model::query()->get()->toArray();

// Untuk DB::select():
$results = collect($resultQuery)
    ->map(fn ($row) => (array) $row)
    ->toArray();

// Atau gunakan DTO/Resource Class untuk transformasi kompleks
class UserResource {
    public static function fromModel($user): array {
        return [
            'id' => $user->id,
            'name' => $user->name,
            // ... mapping eksplisit
        ];
    }
}
```

**Action Required:** Refactor SEMUA penggunaan `json_encode/json_decode` untuk konversi data internal. Gunakan Collection API, array casting, atau DTO pattern.

---

### 2. File Upload Inside Database Transaction

**Location:** 
- [Modules/SPMI/Services/SpmiDokumenManagementService.php](Modules/SPMI/Services/SpmiDokumenManagementService.php#L131-L165)
- [Modules/Kerjasama/Services/DokumenKegiatanManagementService.php](Modules/Kerjasama/Services/DokumenKegiatanManagementService.php#L47-L113)

**Issue:** File upload operations dilakukan SETELAH `DB::beginTransaction()` dimulai.

**Example dari SpmiDokumenManagementService.php:**

```php
// ❌ CRITICAL: Upload di dalam transaction
public function store(array $data): SpmiDokumen|Error
{
    $file = $data['id_dokumen'];
    
    DB::beginTransaction(); // Transaction dimulai terlalu awal

    $upload = new UploadDokumen();
    $upload = $upload->upload(
        file: $file,
        name: $data['nama_spmi_dokumen'],
        folderCode: UploadDokumen::SPMI_PENJAMINAN_MUTU,
        moduleCode: Modul::CODE_SPMI,
        note: $data['deskripsi'],
        withTransaction: false
    );

    if (Error::isError($upload->getError())) {
        DB::rollBack();
        return $upload->getError();
    }

    $data['id_dokumen'] = $upload->get()->id;
    $model = $this->model->create($data);

    $upload->executeUpload(); // Upload fisik terjadi di dalam transaction

    DB::commit();
    return $model;
}
```

**Dampak:**
- **File orphan risk**: Jika DB rollback tapi file sudah ter-upload, file menjadi orphan
- **Deadlock potential**: Transaction lock lebih lama menunggu IO filesystem
- **Timeout risk**: Upload time bisa menyebabkan transaction timeout
- **Inconsistency**: Filesystem dan database tidak atomic

**Saran Perbaikan:**

```php
// ✅ BENAR: Upload DULU, transaction KEMUDIAN
public function store(array $data): SpmiDokumen|Error
{
    $file = $data['id_dokumen'];
    
    // 1. Siapkan upload (validasi, dll)
    $upload = new UploadDokumen();
    $upload = $upload->upload(
        file: $file,
        name: $data['nama_spmi_dokumen'],
        folderCode: UploadDokumen::SPMI_PENJAMINAN_MUTU,
        moduleCode: Modul::CODE_SPMI,
        note: $data['deskripsi'],
        withTransaction: false
    );
    
    // 2. Upload fisik DULU (di luar transaction)
    $uploadResult = $upload->executeUpload();
    
    if (Error::isError($upload->getError())) {
        return $upload->getError();
    }
    
    $data['id_dokumen'] = $upload->get()->id;
    
    // 3. BARU mulai transaction (singkat & deterministik)
    DB::beginTransaction();
    
    try {
        $model = $this->model->create($data);
        DB::commit();
        return $model;
    } catch (\Throwable $e) {
        DB::rollBack();
        
        // 4. Cleanup file jika DB gagal
        $upload->rollbackUpload();
        
        return Error::fromException($e);
    }
}
```

**Action Required:** Refactor SEMUA method yang melakukan file upload untuk memindahkan operasi upload ke LUAR `DB::transaction()` block.

---

### 3. No Strict Type Declarations

**Location:** ALL PHP files in codebase

**Issue:** Tidak ada satupun file yang menggunakan `declare(strict_types=1);`

**Dampak:**
- **Type coercion bugs**: PHP akan melakukan type coercion otomatis yang bisa menyebabkan bug halus
- **Runtime errors**: Error type mismatch baru terdeteksi saat runtime, bukan saat development
- **Harder debugging**: Sulit melacak masalah tipe data
- **Not following PSR-12**: Best practice Laravel modern

**Saran Perbaikan:**

```php
// ✅ BENAR: Tambahkan di SEMUA file PHP
<?php

declare(strict_types=1);

namespace Modules\SPMI\Services;

use Illuminate\Support\Facades\DB;

class TargetIndikatorManagementService
{
    // Method dengan type safety penuh
    public function index(
        ?int $page = null, 
        ?int $perPage = null, 
        array $order = [], 
        array $filter = []
    ): mixed {
        // ...
    }
}
```

**Action Required:** Tambahkan `declare(strict_types=1);` di SEMUA file PHP setelah opening tag `<?php`.

---

## 🟠 Warnings

### 4. Raw SQL Queries vs Eloquent

**Location:** [Modules/SPMI/Services/TargetIndikatorManagementService.php](Modules/SPMI/Services/TargetIndikatorManagementService.php#L48-L165)

**Issue:** Extensive use of raw SQL queries (500+ lines of SQL) instead of Eloquent ORM.

**Example:**

```php
// ⚠️ 150+ lines of raw SQL
$sql = "SELECT
            ap.tahun_audit periode_audit,
            CASE WHEN at.id IS NOT NULL AND ts.id_target_indikator IS NOT NULL 
                THEN at.id ELSE o.id END id,
            CONCAT(d.kode_jenjang, ' - ', o.nama_unit) nama_unit,
            aa.nama_singkat_lembaga nama_lembaga_akreditasi,
            ag.nama_penilaian_panduan,
            -- 50+ more lines...
        FROM core.unit_kerja o
        JOIN spmi.audit_periode ap ON ap.id = ?
        -- 30+ more joins...
        ";
```

**Dampak:**
- **Maintainability**: Sangat sulit di-maintain dan di-test
- **No eager loading benefit**: Tidak mendapat manfaat dari Eloquent relationship features
- **SQL injection risk**: Jika parameter tidak di-sanitize dengan benar
- **Database portability**: Sulit switch database engine
- **No IDE support**: Tidak ada autocomplete/intellisense

**Saran Perbaikan:**

Meskipun query kompleks terkadang memerlukan raw SQL, pertimbangkan untuk:

1. **Break down ke sub-queries**:
```php
// ✅ Lebih maintainable
$auditPeriods = AuditPeriode::query()
    ->with(['unitKerja.lembagaAkreditasi'])
    ->findOrFail($auditPeriodId);

$targetIndicators = TargetIndikator::query()
    ->where('id_audit_periode', $auditPeriodId)
    ->with(['unit', 'penilaianPanduan'])
    ->get();
```

2. **Gunakan Query Builder untuk bagian yang bisa**:
```php
// ✅ Kombinasikan Eloquent + Query Builder
DB::table('unit_kerja as o')
    ->join('audit_periode as ap', 'ap.id', '=', DB::raw('?'))
    ->where('o.waktu_dihapus', null)
    ->select(['ap.tahun_audit', 'o.nama_unit'])
    ->get();
```

3. **Pindahkan ke Database View** untuk query reporting yang kompleks

**Recommendation:** Refactor bertahap - pisahkan query besar menjadi beberapa query kecil yang lebih manageable.

---

### 5. Model Method Violating SRP

**Location:** [Modules/SPMI/Models/TargetIndikator.php](Modules/SPMI/Models/TargetIndikator.php#L53-L68)

**Issue:** Model method `findByStudyProgramId()` melakukan too much logic - query traversal lintas multiple models.

```php
// ⚠️ Model method terlalu kompleks
public static function findByStudyProgramId($studyProgramId, $auditPeriodId)
{
    $unitKerja = UnitKerja::find($studyProgramId);
    if (!$unitKerja) {
        return null;
    }
    $jenjangPendidikan = $unitKerja->jenjangPendidikan;
    if (!$jenjangPendidikan) {
        return null;
    }
    $panduanPenilaian = PenilaianPanduan::where('id_jenjang_pendidikan', $jenjangPendidikan->id)->first();
    if (!$panduanPenilaian) {
        return null;
    }
    return self::where('id_unit', $studyProgramId)
        ->where('id_audit_periode', $auditPeriodId)
        ->where('id_penilaian_panduan', $panduanPenilaian->id)
        ->first();
}
```

**Dampak:**
- **N+1 queries**: Multiple sequential queries
- **Business logic in Model**: Seharusnya di Service layer
- **Testing difficulty**: Sulit di-test karena terlalu banyak dependencies

**Saran Perbaikan:**

```php
// ✅ Model: hanya scope sederhana
class TargetIndikator extends Model
{
    public function scopeByStudyProgram($query, int $studyProgramId, int $auditPeriodId)
    {
        return $query->where('id_unit', $studyProgramId)
            ->where('id_audit_periode', $auditPeriodId);
    }
}

// ✅ Service: logic kompleks
class TargetIndikatorManagementService
{
    public function findByStudyProgram(int $studyProgramId, int $auditPeriodId): ?TargetIndikator
    {
        $unitKerja = UnitKerja::with('jenjangPendidikan')->find($studyProgramId);
        
        if (!$unitKerja?->jenjangPendidikan) {
            return null;
        }
        
        $panduanPenilaian = PenilaianPanduan::where(
            'id_jenjang_pendidikan', 
            $unitKerja->jenjangPendidikan->id
        )->first();
        
        if (!$panduanPenilaian) {
            return null;
        }
        
        return TargetIndikator::byStudyProgram($studyProgramId, $auditPeriodId)
            ->where('id_penilaian_panduan', $panduanPenilaian->id)
            ->first();
    }
}
```

---

### 6. Livewire Public Property Storing Large Data

**Location:** [Modules/SPMI/Livewire/TargetIndikator.php](Modules/SPMI/Livewire/TargetIndikator.php#L26-L27)

**Issue:** Livewire component menyimpan array besar sebagai public property yang di-hydrate/dehydrate setiap request.

```php
// ⚠️ Large data sebagai public property
class TargetIndikator extends MainComponent
{
    public $scoreValues = [];          // Potentially large
    public $assessmentMatricesRaw = []; // DEFINITELY large
    public $assessmentMatrices = [];    // Large
}
```

**Dampak:**
- **Heavy payload**: Setiap interaction mengirim semua data ini bolak-balik
- **Slow UI response**: Latency tinggi untuk setiap action
- **Memory consumption**: Server memory usage meningkat
- **Not scalable**: Akan semakin lambat seiring data bertambah

**Saran Perbaikan:**

```php
// ✅ BENAR: Computed property untuk reference data
use Livewire\Attributes\Computed;

class TargetIndikator extends MainComponent
{
    // Hanya state minimal yang jadi public property
    public array $scoreValues = [];    // User input (OK)
    public string $search = '';        // Filter state (OK)
    public int $limit = 15;           // Pagination (OK)
    
    // Data besar → Computed Property
    #[Computed]
    public function assessmentMatricesRaw()
    {
        return $this->service->showAllMatricesByPenilaianPanduan(
            $this->raw['id_penilaian_panduan'], 
            $this->resourceId
        );
    }
    
    #[Computed]
    public function assessmentMatrices()
    {
        return array_slice($this->assessmentMatricesRaw, 0, $this->limit);
    }
}
```

**Recommendation:** Refactor semua Livewire components untuk memindahkan reference data dari public property ke Computed Property.

---

### 7. Potential Octane Memory Leak - Static Properties

**Location:** 
- [Modules/SPMI/Helpers/AssessmentFormula.php](Modules/SPMI/Helpers/AssessmentFormula.php#L21-L24)
- [Modules/Gate/Models/ModulSubCache.php](Modules/Gate/Models/ModulSubCache.php#L49)

**Issue:** Static properties yang menyimpan data tanpa cleanup mechanism.

```php
// ⚠️ BAHAYA di Octane: Static property tanpa cleanup
class AssessmentFormula
{
    protected static $additionalData = [];
    protected static $mathParser = null;
    protected static $mathEvaluator = null;
    protected static $expressionLanguage = null;
}

class ModulSubCache
{
    static $modulAktif; // No initialization, no cleanup
}
```

**Dampak di Octane:**
- **Memory leak**: Data menumpuk antar request dan tidak pernah dibersihkan
- **Data bleed**: Request A bisa melihat data dari Request B
- **Server crash**: Memory leak akan eventually crash worker

**Saran Perbaikan:**

```php
// ✅ BENAR: Scoped binding atau manual cleanup
// Option 1: Pindah ke instance property + scoped binding
class AssessmentFormula
{
    public function __construct(
        protected array $additionalData = [],
        protected $mathParser = null,
    ) {}
}

// Di AppServiceProvider
$this->app->scoped(AssessmentFormula::class);

// Option 2: Implement Octane reset listener
// In AppServiceProvider
Octane::flushState(function () {
    AssessmentFormula::resetState();
});

class AssessmentFormula
{
    protected static $additionalData = [];
    
    public static function resetState(): void
    {
        static::$additionalData = [];
        static::$mathParser = null;
        static::$mathEvaluator = null;
        static::$expressionLanguage = null;
    }
}
```

**Action Required:** Audit SEMUA static properties dan pastikan Octane-safe dengan salah satu cara di atas.

---

## 🟡 Suggestions

### 8. Controller Thickness

**Location:** Multiple controllers

**Observation:** Beberapa controller sudah tipis (bagus), tapi method `defineFormFields()` bisa panjang dan sulit di-maintain.

**Example:** [Modules/HR/Http/Controllers/Web/EmployeeController.php](Modules/HR/Http/Controllers/Web/EmployeeController.php)

Controllers menggunakan `WebController` helper yang baik, tapi form field definition mungkin sangat panjang di beberapa controller.

**Saran:**
- Extract form definitions ke separate Form class (Laravel Form Request with field definitions)
- Gunakan FormBuilder pattern untuk reusable components

---

### 9. Missing Cache Invalidation Pattern

**Observation:** Tidak terlihat implementasi cache dengan auto-invalidation via Observer/Trait seperti di rule.

**Saran:**
Implement cache pattern sesuai [Caching Pattern Rule](../.github/rules/caching-pattern.rule.md):

```php
// Cache Class
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

// Observer untuk auto-clear
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

---

### 10. Database Migration Naming

**Location:** [database/migrations/](database/migrations/)

**Observation:** Migration files menggunakan nama deskriptif Indonesia yang baik, tapi ada typo:

- `2025_08_29_151925_set_panduan_iaps_prof_inactive.php` - Tahun 2025 tapi hari ini baru Feb 2026?
- Beberapa migration menggunakan kata "penyesuaian" dan "migrasi" yang bisa lebih spesifik

**Saran:**
- Rename migration dengan timestamp yang benar
- Gunakan action verb yang lebih spesifik: `add_`, `update_`, `create_`, `drop_` instead of generic "penyesuaian"

---

## 🟢 What's Good

### 11. Architecture Separation ✅

**Observation:** Codebase menggunakan **Service Layer pattern** dengan baik:
- Controllers tipis, hanya memanggil Service
- Business logic ada di Service classes
- Models fokus pada relasi dan scopes

**Example:** [Modules/SPMI/Http/Controllers/Web/TargetIndikatorController.php](Modules/SPMI/Http/Controllers/Web/TargetIndikatorController.php)

```php
// ✅ GOOD: Controller tipis, delegate ke Service
public function index(Request $request)
{
    // Setup header & filter
    return WebController::index($this->service, $request, $header, $filter, $viewData);
}
```

---

### 12. Dependency Injection ✅

**Observation:** Controllers menggunakan constructor injection untuk Services dengan benar.

```php
// ✅ GOOD: DI via constructor
public function __construct(private TargetIndikatorManagementService $service)
{
}
```

---

### 13. Return Type Declarations ✅

**Observation:** Methods umumnya memiliki return type declarations (meskipun banyak menggunakan `mixed`).

```php
// ✅ GOOD: Return types declared
public function index(
    int|null $page = null, 
    int|null $perPage = null, 
    array $order = [], 
    array $filter = []
): mixed
```

Bisa lebih baik dengan union types yang lebih spesifik daripada `mixed`.

---

### 14. Modular Structure ✅

**Observation:** Codebase menggunakan Laravel Modules (nwidart) dengan baik:
- Setiap module self-contained
- Clear separation of concerns
- Easy to maintain per-module

**Structure:**
```
Modules/
├── SPMI/
├── PMB/
├── Core/
├── HR/
└── ...
```

---

### 15. Error Handling Custom Class ✅

**Observation:** Menggunakan custom `Error` class untuk error handling yang konsisten.

```php
// ✅ GOOD: Consistent error handling
if ($isExistVersion) {
    return new Error('Versi dokumen sudah ada...', 409);
}
```

---

## 📊 Summary Statistics

| Category | Count | Status |
|----------|-------|--------|
| Critical Issues | 3 | 🔴 Must Fix |
| Warnings | 5 | 🟠 Should Fix |
| Suggestions | 5 | 🟡 Nice to Have |
| Good Practices | 5 | 🟢 Keep It Up |

---

## 🎯 Priority Action Items

### Must Fix Before Production (P0)

1. ✅ **Remove ALL `json_encode/json_decode` anti-patterns** - Refactor ke Collection/DTO
2. ✅ **Move file uploads OUTSIDE transactions** - Prevent orphan files & deadlocks
3. ✅ **Add `declare(strict_types=1)` to ALL files** - Enable strict type checking

### High Priority (P1)

4. ⚠️ **Fix Octane memory leaks** - Reset static properties or use scoped binding
5. ⚠️ **Refactor Livewire components** - Move large data to Computed Properties

### Medium Priority (P2)

6. 📝 **Refactor complex raw SQL** - Break down or use Query Builder where possible
7. 📝 **Move Model business logic to Services** - Keep Models thin
8. 📝 **Implement cache invalidation pattern** - Auto-clear on model changes

---

## 💡 Recommendations

1. **Setup PHPStan/Larastan** for static analysis - akan catch banyak masalah type safety
2. **Enable Laravel Debugbar** in development - detect N+1 queries
3. **Setup Laravel Telescope** - monitor performance di staging/production
4. **Write unit tests** for critical Services - especially yang punya complex logic
5. **Setup CI/CD pipeline** dengan automated code quality checks

---

## Verdict

❌ **REQUEST CHANGES**

**Reasoning:** 
Codebase memiliki 3 critical issues yang harus diperbaiki sebelum production deployment:
1. Widespread JSON anti-pattern akan menyebabkan performance degradation yang signifikan
2. File upload dalam transaction adalah architectural flaw yang bisa menyebabkan data inconsistency
3. No strict types membuat aplikasi rentan terhadap type-related bugs

Setelah critical issues diperbaiki, aplikasi akan siap untuk production dengan catatan high-priority items (P1) dijadwalkan untuk sprint berikutnya.

**Estimated Effort:**
- Critical fixes (P0): 3-5 sprint (tergantung berapa banyak file yang terpengaruh)
- High priority (P1): 2-3 sprint
- Medium priority (P2): Ongoing refactoring

---

## 📝 Notes

Codebase menunjukkan struktur arsitektur yang baik (MVC + Service Layer) dan penggunaan Laravel best practices di beberapa area. Dengan memperbaiki critical issues dan mengimplementasikan suggestions, kualitas kode akan meningkat signifikan dan maintenance menjadi lebih mudah.

**Good luck with the refactoring! 🚀**
