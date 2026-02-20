# Rule: Livewire State Management

Kamu adalah seorang Engineer yang membangun komponen interaktif menggunakan Laravel Livewire. Kamu memahami bahwa Livewire melakukan **hydrate & dehydrate** semua public property pada setiap interaksi, sehingga kamu harus sangat selektif dalam menentukan apa yang menjadi public property dan apa yang cukup menjadi Computed Property.

## Prinsip Utama

**State ≠ Data Referensi. Public Property ≠ Data Statis. Mudah ditulis ≠ Aman untuk performa.**

---

## Pemisahan State dan Data Referensi

Setiap komponen Livewire WAJIB memisahkan:

| Jenis Data | Simpan di | Alasan |
|---|---|---|
| Input user, nilai yang berubah (search, scores) | `public property` | Perlu sync ke browser |
| Data statis, read-only, data besar untuk render UI | `#[Computed]` property / Service / Cache | Tidak perlu sync, hemat payload |

---

## DO: Gunakan Computed Property untuk Data Besar

```php
use Livewire\Attributes\Computed;

class AssessmentForm extends Component
{
    // Hanya state interaktif yang jadi public property
    public array $scores = [];
    public string $search = '';

    // Data besar & read-only → Computed Property
    #[Computed]
    public function rubric()
    {
        return Rubric::with('indicators.options')->get();
    }

    public function render()
    {
        return view('livewire.assessment-form');
    }
}
```

**Mengapa benar:**
- Livewire hanya mengirim delta perubahan `$scores` dan `$search`
- Data rubrik dihitung on-demand, tidak ikut hydrate/dehydrate
- Payload update tetap kecil meskipun data rubrik berisi ratusan baris

---

## DON'T: Menyimpan Data Besar di Public Property

```php
// ❌ JANGAN LAKUKAN INI
class AssessmentForm extends Component
{
    public array $rubric = []; // Data besar + bercampur state

    public function mount()
    {
        // 50 elemen × 5 indikator × 5 opsi = ribuan item
        $this->rubric = Rubric::with('indicators.options')
            ->get()
            ->toArray();
    }
}
```

**Mengapa salah:**
- Livewire wajib hydrate & dehydrate `$rubric` pada SETIAP interaksi
- Payload update bisa mencapai **megabytes**
- UI latency tinggi, beban server meningkat
- Mencampur state interaktif (`selected_score`) dengan data referensi

---

## Dampak Performa

| Aspek | Public Property (❌) | Computed Property (✅) |
|---|---|---|
| Payload per interaksi | Megabytes (seluruh data) | Kilobytes (hanya delta state) |
| Hydrate/Dehydrate | Semua data setiap request | Hanya state minimal |
| Skalabilitas | Degradasi seiring data bertambah | Stabil |
| Responsivitas UI | Lambat | Cepat |

---

## Kapan Data Boleh Jadi Public Property

Data HANYA boleh jadi public property jika memenuhi **semua** kriteria berikut:

1. Data tersebut **berubah** berdasarkan interaksi user
2. Perubahan tersebut **perlu diketahui server** (bukan hanya UI toggle)
3. Ukuran data **kecil** (bukan daftar ratusan item)

**Contoh yang benar sebagai public property:**
- `$search` (string input pencarian)
- `$selectedId` (ID item yang dipilih)
- `$scores` (array nilai yang diisi user)
- `$perPage` (jumlah item per halaman)

**Contoh yang SALAH sebagai public property:**
- Daftar semua provinsi/kota → gunakan Computed / Cache
- Data rubrik assessment → gunakan Computed
- Daftar opsi dropdown yang besar → gunakan Computed / Cache
