# **Cover** {#cover}

# **Daftar Isi** {#daftar-isi}

[**Cover**](#cover)	**i**

[**Daftar Isi**](#daftar-isi)	**ii**

[**Penjelasan Dokumen	1**](#penjelasan-dokumen)

[1\. Latar Belakang	1](#1.-latar-belakang)

[2\. Tujuan Dokumen	1](#2.-tujuan-dokumen)

[3\. Target Pembaca	2](#3.-target-pembaca)

[4\. Prinsip Dasar Engineering	2](#4.-prinsip-dasar-engineering)

[**Do & Don’ts	4**](#do-&-don’ts)

[1\. Pengelolaan State & Data Besar pada Livewire	4](#1.-pengelolaan-state-&-data-besar-pada-livewire)

[2\. Penggunaan Relation & Eager Loading (N+1 Problem)	6](#2.-penggunaan-relation-&-eager-loading-\(n+1-problem\))

[3\. Penggunaan pluck() untuk Efisiensi Query & Memori	7](#3.-penggunaan-pluck\(\)-untuk-efisiensi-query-&-memori)

[4\. Pengelolaan Upload File dalam Database Transaction	8](#4.-pengelolaan-upload-file-dalam-database-transaction)

[5\. Penggunaan View Composer	10](#5.-penggunaan-view-composer)

[6\. Code Smell: Konversi Hasil Query Menggunakan json\_encode / json\_decode	12](#6.-code-smell:-konversi-hasil-query-menggunakan-json_encode-/-json_decode)

[7\. Standarisasi Pola Cache Data Referensi & Relasi Model	13](#7.-standarisasi-pola-cache-data-referensi-&-relasi-model)

[**Code Quality & Engineering Practices	17**](#code-quality-&-engineering-practices)

[1\. Pengelolaan State & Data Besar pada Livewire	17](#1.-pengelolaan-state-&-data-besar-pada-livewire-1)

[2\. Standar Penamaan dan Struktur Kode	18](#2.-standar-penamaan-dan-struktur-kode)

[3\. Penulisan Kode yang Ekspresif dan Ringkas	22](#3.-penulisan-kode-yang-ekspresif-dan-ringkas)

[4\. Single Responsibility Principle (SRP)	22](#4.-single-responsibility-principle-\(srp\))

[5\. Don’t Repeat Yourself (DRY)	22](#5.-don’t-repeat-yourself-\(dry\))

[6\. Type Safety dan Kontrak Kode	23](#6.-type-safety-dan-kontrak-kode)

[7\. Code Style dan Otomasi	23](#7.-code-style-dan-otomasi)

[8\. Larangan Meng-override Fitur Inti Laravel	23](#8.-larangan-meng-override-fitur-inti-laravel)

[9\. Standar Runtime & Server Environment (Laravel Octane \+ FrankenPHP)	24](#9.-standar-runtime-&-server-environment-\(laravel-octane-+-frankenphp\))

# **Penjelasan Dokumen** {#penjelasan-dokumen}

Dokumen ini merupakan pedoman teknis internal yang menetapkan standar praktik pengembangan aplikasi berbasis **Laravel 12+**, dengan fokus pada performa, pengelolaan data, arsitektur kode, serta konsistensi engineering dalam tim. Panduan ini disusun berdasarkan pengalaman implementasi nyata, evaluasi terhadap bottleneck performa, serta temuan code smell yang berulang di berbagai modul. Tujuannya bukan sekadar mendokumentasikan aturan, tetapi membangun pola pikir engineering yang sistematis, terukur, dan scalable sesuai dengan standar modern Laravel.  
Dokumen ini menggabungkan dua aspek utama:

1) Performance & Data Handling Guidelines (Do & Don’ts)  
2) Code Quality & Engineering Practices

Seluruh praktik yang dijelaskan mengacu pada fitur dan pendekatan yang kompatibel dengan Laravel 12, termasuk:

1) PHP 8.2+  
2) Strict typing & return type enforcement  
3) Improved Eloquent performance patterns  
4) Native support untuk modern service container dan dependency injection  
5) Best practice arsitektur MVC \+ Service Layer

## **1\. Latar Belakang** {#1.-latar-belakang}

Dalam pengembangan aplikasi Laravel 12 berskala menengah hingga besar, ditemukan beberapa pola permasalahan yang berulang, antara lain:

1) State besar pada Livewire yang menyebabkan payload membengkak  
2) N+1 query akibat relasi yang tidak dikelola dengan benar  
3) Over-fetching data menggunakan `all()` atau lazy loading  
4) Upload file di dalam database transaction yang berisiko inkonsistensi data  
5) View Composer dengan kalkulasi berat tanpa caching  
6) Penggunaan `json_encode` / `json_decode` sebagai alat transformasi internal  
7) Cache yang tersebar dan tidak memiliki mekanisme invalidasi standar  
8) Business logic tersebar di berbagai layer (controller, blade, job)

Laravel 12 sendiri telah menyediakan pondasi arsitektur yang kuat. Namun tanpa standar engineering yang jelas, fitur framework dapat digunakan secara tidak optimal dan menimbulkan technical debt. Dokumen ini hadir untuk memastikan Laravel 12 digunakan secara selaras dengan desain aslinya (framework-aligned), bukan sekadar berfungsi secara teknis.

## **2\. Tujuan Dokumen** {#2.-tujuan-dokumen}

Dokumen ini bertujuan untuk:

1) Menetapkan standar performa dan data handling yang sesuai dengan Laravel 12\.  
2) Mencegah antipattern seperti N+1 query, state bloat, dan over-fetching.  
3) Menstandarisasi arsitektur MVC \+ Service Layer tanpa Repository layer (kecuali diperlukan).  
4) Menjamin bahwa business logic memiliki single source of truth.  
5) Mendorong penggunaan fitur modern PHP dan Laravel 12 seperti:  
   1) Strict type declaration  
   2) Return type enforcement  
   3) Union & nullable type  
   4) Service container injection  
6) Menjadi referensi utama dalam:  
   1) Code review  
   2) Refactoring  
   3) Pengembangan fitur baru  
   4) Onboarding engineer baru

Dokumen ini juga menjadi baseline evaluasi kualitas kode pada setiap merge request di proyek berbasis Laravel 12+.

## **3\. Target Pembaca** {#3.-target-pembaca}

Dokumen ini ditujukan untuk:

1) Software Engineer yang bekerja dengan Laravel 12  
2) Reviewer dan Tech Lead  
3) Engineer baru sebagai bagian dari onboarding

Dokumen ini bersifat wajib sebagai referensi teknis dalam pengembangan dan evaluasi kode pada proyek berbasis Laravel 12\.

## **4\. Prinsip Dasar Engineering** {#4.-prinsip-dasar-engineering}

Dokumen ini disusun berdasarkan prinsip-prinsip berikut, dengan mempertimbangkan standar Laravel 12 dan PHP modern:

### **4.1 Performance-aware Engineering**

Setiap pengambilan dan manipulasi data harus mempertimbangkan dampak terhadap:

1) Query count  
2) Memory usage  
3) CPU cost  
4) Payload size  
5) Scalability jangka panjang

Optimasi dilakukan secara sadar, bukan reaktif setelah sistem lambat.

### **4.2 Single Source of Truth**

Semua aturan bisnis berada di Service Layer.  
Model bukan orchestrator bisnis, dan controller bukan tempat domain logic.

### **4.3 Explicit Over Implicit**

Relasi, cache, dan transformasi data harus eksplisit.  
Mengandalkan lazy loading tanpa disadari adalah sumber regresi performa.

### **4.4 Framework-Aligned Development (Laravel 12 Native Approach)**

Laravel digunakan sesuai desain arsitekturnya.  
Tidak meng-override fitur inti tanpa alasan arsitektural yang kuat.

Prinsip resmi: **Extend, don’t modify.**

### **4.5 Readable Before Clever**

Kode harus mudah dipahami sebelum dianggap ringkas.  
Laravel 12 menyediakan banyak shortcut, namun keterbacaan tetap prioritas.

### **4.6 Deterministic & Scalable Architecture**

Setiap alur request pada Laravel 12 harus:

1) Jelas boundary-nya  
2) Mudah dilacak  
3) Tidak mencampur tanggung jawab layer  
4) Tetap stabil saat data dan traffic meningkat

# 

# **Do & Don’ts** {#do-&-don’ts}

## **1\. Pengelolaan State & Data Besar pada Livewire** {#1.-pengelolaan-state-&-data-besar-pada-livewire}

### **1.1 Tujuan**

Mengajarkan cara benar membangun komponen Livewire dengan data besar.

### **1.2 Langkah Dasar (Best Practice Flow)**

1) Identifikasi state yang benar-benar berubah  
2) Pisahkan:  
   1) State interaktif → public property  
   2) Data referensi besar → Computed Property / Service / Cache  
3) Pastikan data besar tidak ikut tersinkronisasi ke browser

### **1.3 How-to Guides**

**DO**

| \#\[Computed\]public function rubric(){    return collect(range(1, 50))-\>map(function ($eId) {        return \[            'id' \=\> $eId,            'title' \=\> "Elemen {$eId}: " . fake('id\_ID')-\>sentence(),            'indicators' \=\> collect(range(1, 5))-\>map(function ($iId) use ($eId) {                $globalId \= "{$eId}\_{$iId}";                return \[                    'id' \=\> $globalId,                    'code' \=\> "{$eId}.{$iId}",                    'text' \=\> fake('id\_ID')-\>paragraph(),                    'options' \=\> collect(range(0, 4))-\>reverse()-\>map(function ($score) {                        return \[                            'value' \=\> $score,                            'label' \=\> "Skor {$score}",                            'description' \=\> fake('id\_ID')-\>paragraph(2), // Teks deskripsi panjang                        \];                    })-\>values(),                \];            }),        \];    });} |
| :---- |

1) Gunakan Computed Property untuk:  
   1) Data statis  
   2) Data read-only  
   3) Data besar untuk render UI  
2) Simpan di public property hanya:  
   1) Input user  
   2) Nilai yang berubah (mis. search, scores)  
3) Biarkan Livewire hanya mengirim delta perubahan state

**DON’T**

| public function mount(){    $this\-\>rubric \= collect(range(1, 50))-\>map(function ($eId) {        return \[            'id' \=\> $eId,            'title' \=\> "Elemen {$eId}: " . fake('id\_ID')-\>sentence(),            'indicators' \=\> collect(range(1, 5))-\>map(function ($iId) use ($eId) {                $globalId \= "{$eId}\_{$iId}";                return \[                    'id' \=\> $globalId,                    'code' \=\> "{$eId}.{$iId}",                    'text' \=\> fake('id\_ID')-\>paragraph(),                    'selected\_score' \=\> null, // State bercampur dengan data                    'options' \=\> collect(range(0, 4))-\>reverse()-\>map(function ($score) {                        return \[                            'value' \=\> $score,                            'label' \=\> "Skor {$score}",                            'description' \=\> fake('id\_ID')-\>paragraph(2),                        \];                    })-\>values()-\>toArray(),                \];            })-\>toArray(),        \];    })-\>toArray();} |
| :---- |

1) Menyimpan data besar di public property  
2) Mencampur state dan data referensi  
3) Berasumsi: “Karena dipakai di Blade, maka harus public property”

### **1.4 Explanation**

Kenapa ini penting?  
**Livewire:**

1) Wajib melakukan hydrate & dehydrate semua public property  
2) Akan mengirim ulang data tersebut pada setiap interaksi

**Akibatnya:**

1) Payload update → MB  
2) UI latency tinggi  
3) Beban server meningkat  
4) Risiko regresi performa

**Pendekatan Computed Property \+ state minimal:**

1) Payload turun hingga \>99%  
2) Interaksi UI jauh lebih responsif  
3) Lebih aman untuk skala besar

### **1.5 Reference**

Rules of Thumb:

1) State ≠ Data Referensi  
2) Public Property ≠ Data Statis  
3) Mudah ditulis ≠ Aman untuk performa

## **2\. Penggunaan Relation & Eager Loading (N+1 Problem)** {#2.-penggunaan-relation-&-eager-loading-(n+1-problem)}

### **2.1 Tujuan**

Menampilkan data multi-relasi tanpa menciptakan N+1 Query.

### **2.2 Langkah Dasar (Best Practice Flow)**

1) Definisikan relasi antar model sejak awal  
2) Gunakan `with()` saat query utama  
3) Hindari query di dalam loop

### **2.3 How-to Guides**

**DO**

| DB::enableQueryLog();$start \= microtime(true);$initialMemory \= memory\_get\_usage();// Eager Loading: Satu query (atau minimal) untuk seluruh hierarchy$organizations \= Organization::with(\[    'branches.departments.teams.projects.milestones.tasks.activities.comments.attachments'\])-\>get();$end \= microtime(true);$finalMemory \= memory\_get\_usage();$queries \= DB::getQueryLog(); |
| :---- |

1) Gunakan `with()` / eager loading  
2) Ambil semua relasi sebelum looping  
3) Definisikan relasi di model, bukan di controller/service

**DON’T**

| \#\[Computed\]public function rubric(){    // Simulasikan struktur bersarang yang kompleks    // 50 Elemen \* 5 Indikator \= 250 baris.    // Setiap baris memiliki 5 deskripsi (blob teks masif jika dikirim ke klien).    return collect(range(1, 50))-\>map(function ($eId) {        return \[            'id' \=\> $eId,            'title' \=\> "Elemen {$eId}: " . fake('id\_ID')-\>sentence(),            'indicators' \=\> collect(range(1, 5))-\>map(function ($iId) use ($eId) {                $globalId \= "{$eId}\_{$iId}";                return \[                    'id' \=\> $globalId,                    'code' \=\> "{$eId}.{$iId}",                    'text' \=\> fake('id\_ID')-\>paragraph(),                    // Simulasikan opsi penilaian 0-4                    'options' \=\> collect(range(0, 4))-\>reverse()-\>map(function ($score) {                        return \[                            'value' \=\> $score,                            'label' \=\> "Skor {$score}",                            'description' \=\> fake('id\_ID')-\>paragraph(2), // Teks deskripsi panjang                        \];                    })-\>values(),                \];            }),        \];    });} |
| :---- |

1) Melakukan query di dalam foreach  
2) Mengandalkan lazy loading default  
3) Menganggap “datanya sedikit, jadi aman”

### **2.4 Explanation**

Kenapa ini penting?  
**Tanpa eager loading:**

1) Query dieksekusi berulang kali  
2) Total query bisa ratusan / ribuan  
3) Latensi meningkat drastis

**Dengan eager loading:**

1) Relasi diambil di awal  
2) Total query terkendali  
3) Performa stabil & scalable

Masalah **bukan pada Laravel**, tapi pada **pola penggunaan**.

### **2.5 Reference**

Best Practice Principles:

1) Hindari N+1 Query  
2) Relasi ditulis sekali, dipakai selamanya  
3) Query eksplisit \> implicit loading

## **3\. Penggunaan `pluck()` untuk Efisiensi Query & Memori** {#3.-penggunaan-pluck()-untuk-efisiensi-query-&-memori}

### **3.1 Tujuan**

Mengambil data seminimal mungkin dengan beban memori rendah.

### **3.2 Langkah Dasar (Best Practice Flow)**

1) Tentukan kolom yang dibutuhkan  
2) Gunakan `pluck()` langsung dari Query Builder  
3) Biarkan database melakukan filtering

### **3.3 How-to Guides**

**DO**

| $results \= Employee::pluck('email', 'id')-\>toArray(); |
| :---- |

1) Gunakan `Model::pluck()` langsung  
2) Ambil hanya kolom yang diperlukan  
3) Hindari hydration model jika tidak perlu

**DON’T**

| $results \= Employee::all()-\>pluck('email', 'id')-\>toArray(); |
| :---- |

1) `Model::all()->pluck()`  
2) Over-fetching kolom  
3) Mengandalkan PHP memory untuk filtering

### **3.4 Explanation**

Kenapa ini penting?  
**all():**

1) Selalu `SELECT *`  
2) Membuat Collection penuh  
3) Menghabiskan memory PHP

**pluck() langsung:**

1) Query lebih kecil  
2) Tidak membuat model penuh  
3) Eksekusi jauh lebih cepat

**Kesalahan umum:** “Karena akhirnya butuh Collection, maka pakai `all()` dulu.”  
Ini adalah anti-pattern untuk data besar.

### **3.5 Reference**

Golden Rule: “Ambil data seminimal mungkin, sedekat mungkin ke database.”

## **4\. Pengelolaan Upload File dalam Database Transaction** {#4.-pengelolaan-upload-file-dalam-database-transaction}

### **4.1 Tujuan**

Menjaga konsistensi data saat upload file tanpa merusak transaksi database.

### **4.2 Langkah Dasar (Best Practice Flow)**

1) Jalankan database transaction hanya untuk operasi DB  
2) Commit transaksi  
3) Lakukan file upload ke file system / object storage  
4) Simpan referensi file (path / metadata) setelah upload berhasil

### **4.3 How-to Guides**

**DO**

| public function update(array $data, int $id): DokumenKegiatan|Error{   $model \= $this\-\>model-\>findOrFail($id);   // 1\. Siapkan upload (belum DB)   $upload \= $this\-\>processUploadDocument(       $data,       'id\_dokumen',       UploadDokumen::KERJASAMA\_KEGIATAN,       $model   );   // 2\. Jika ada upload → lakukan upload fisik dulu   if (\!empty($upload)) {       $uploadResult \= $upload-\>executeUpload();       if (Error::isError($uploadResult)) {           return $uploadResult;       }       $data\['id\_dokumen'\] \= $upload-\>get()?-\>id;   } else {       unset($data\['id\_dokumen'\]);   }   DB::beginTransaction();   try {       // 3\. Update DB       $model-\>update($data);       DB::commit();       return $model;   } catch (\\Throwable $e) {       DB::rollBack();       // 4\. Cleanup file jika DB gagal       if (\!empty($upload)) {           $upload-\>rollbackUpload();       }       return Error::fromException($e);   }} |
| :---- |

1) Batasi `DB::transaction()` hanya untuk operasi database  
2) Lakukan upload file di luar transaksi  
3) Gunakan mekanisme:  
   1) temporary file  
   2) retry / idempotent upload  
4) Pastikan transaksi singkat dan deterministik

**DON’T**

| public function update(array $data, int $id): DokumenKegiatan|Error{    DB::beginTransaction();    $model \= $this\-\>model-\>findOrFail($id);    $upload \= $this\-\>processUploadDocument($data, 'id\_dokumen', UploadDokumen::KERJASAMA\_KEGIATAN, $model);    if (\!empty($upload)) {        $data\['id\_dokumen'\] \= $upload-\>get()?-\>id;    } else {        unset($data\['id\_dokumen'\]);    }    $model-\>update($data);    if (\!empty($upload) && Error::isError($upload-\>getError())) {        DB::rollBack();        return $upload-\>getError();    }    // Execute upload    $upload?-\>executeUpload();    DB::commit();    return $model;} |
| :---- |

1) Menaruh proses upload file di dalam `DB::transaction()`  
2) Menganggap filesystem bisa “rollback”  
3) Menjalankan operasi IO berat (filesystem / network) di dalam transaksi

### **4.4 Explanation**

Kenapa ini penting?  
**Akar Masalah Teknis:**

1) Database → transactional & rollback-able  
2) Filesystem → non-transactional

**Jika upload file berada di dalam transaksi:**

1) File bisa berhasil tersimpan  
2) Database bisa rollback  
3) Terjadi data orphan / inkonsistensi

**Dampak lanjutan:**

1) Lock database lebih lama  
2) Throughput menurun  
3) Debugging sangat sulit (lintas layer)

**Rule penting:** “Transaction boundary ≠ Business flow boundary”

### **4.5 Reference**

**Prinsip Desain:**

1) Database transaction harus:  
   1) cepat  
   2) pendek  
   3) bebas IO eksternal  
2) Filesystem ≠ bagian dari transaksi database

## **5\. Penggunaan View Composer** {#5.-penggunaan-view-composer}

### **5.1 Tujuan**

Menghindari eksekusi logika berat berulang pada setiap render view.

### **5.2 Langkah Dasar (Best Practice Flow)**

1) Identifikasi data global yang benar-benar dibutuhkan  
2) Hitung sekali per request  
3) Cache hasilnya  
4) Inject ke view secara selektif

### **5.3 How-to Guides**

**DO**

| // 1\. Tambahkan property static untuk menyimpan hasil kalkulasiprotected static $viewCache \= null;public function handle(Request $request, Closure $next){    View::composer(\['\*::pages.\*', '\*::livewire.\*'\], function ($view) use ($request) {        // 2\. GOOD: Cek apakah data sudah pernah dihitung di request ini?        if (is\_null(self::$viewCache)) {            // 3\. GOOD: Lakukan kalkulasi berat HANYA SEKALI per request            $viewData \= $view-\>getData();            self::$viewCache \= Page::buildViewData(                module: 'spmi',                menu: Menu::navbar(),                // ... parameter lainnya            );        }        // 4\. GOOD: Gunakan data dari cache untuk semua partial view lainnya        View::share(self::$viewCache);    });    return $next($request);} |
| :---- |

1) Gunakan View Composer secara eksplisit & terbatas  
2) Cache hasil per-request (static property / memoization)  
3) Jalankan kalkulasi berat satu kali saja

**DON’T**

| public function handle(Request $request, Closure $next){    View::composer(\['\*::pages.\*', '\*::livewire.\*'\], function ($view) {        $viewData \= $view-\>getData();        View::share(            Page::buildViewData(                module: 'spmi',                menu: Menu::navbar(),                sidebar: $viewData\['sidebar'\] ?? null,                parentSidebar: $viewData\['parentSidebar'\] ?? null,                navTab: $viewData\['navTab'\] ?? null,                lastBreadcrumb: $viewData\['lastBreadcrumb'\] ?? \[\],            )        );    });    return $next($request);} |
| :---- |

1) Menggunakan wildcard composer (`*`, `pages.*`) tanpa cache  
2) Menaruh:  
   1) query berat  
   2) permission loop  
   3) recursive array build  
3) Menganggap View Composer “murah”

### **5.4 Explanation**

**Kenapa View Composer berbahaya jika salah pakai?**

1) Dipanggil setiap kali view/partial dirender  
2) Dalam satu halaman bisa terjadi:  
   1) 5–10x pemanggilan  
   2) Loop permission berulang  
   3) Query redundant

**Dampaknya:**

1) CPU spike  
2) Latensi meningkat seiring kompleksitas halaman  
3) Bottleneck tersembunyi (tidak kelihatan di controller)

**Solusi yang terbukti efektif:**

1) Hitung sekali → simpan → reuse  
2) Composer ≠ tempat business logic

### **5.5 Reference**

**Rule of Thumb:**

1) View Composer \= data glue, bukan data processor  
2) Jika berat → cache  
3) Jika kompleks → pindahkan ke service

## **6\. Code Smell: Konversi Hasil Query Menggunakan json\_encode / json\_decode** {#6.-code-smell:-konversi-hasil-query-menggunakan-json_encode-/-json_decode}

### **6.1 Tujuan**

Menghindari konversi data berlapis yang memboroskan CPU & memory.

### **6.2 Pola yang Dianjurkan**

1) Gunakan:  
   1) Collection  
   2) DTO  
   3) Resource / Transformer  
2) Hindari serialisasi bolak-balik tanpa alasan kuat

### **6.3 How-to Guides**

**DO**

| // Jika menggunakan Query Builder:DB::table('table')-\>get()-\>toArray();// Jika menggunakan Eloquent:Model::query()-\>get()-\>toArray();// Jika tetap menggunakan DB::select():collect($resultQuery)-\>map(fn ($row) \=\> (array) $row)-\>toArray(); |
| :---- |

1) Gunakan Laravel Collection API  
2) Transform data langsung di level query / resource  
3) Gunakan DTO untuk struktur data kompleks

**DON’T**

| public function getByRegistrationPeriodId($registrationPeriodId){    $sql \= "select ... from " . $this\-\>model-\>getTable() . " pa        join ... where ...";    $resultQuery \= DB::select($sql, \['id\_periode\_pendaftaran' \=\> $registrationPeriodId\]);    return json\_decode(json\_encode($resultQuery), true);} |
| :---- |

1) `json_encode()` → `json_decode()` hanya untuk “casting”  
2) Menggunakan JSON sebagai alat transformasi data internal  
3) Menganggap JSON murah secara komputasi

### **6.4 Explanation**

Kenapa ini disebut Code Smell?  
**Karena:**

1) JSON encoding:  
   1) mahal di CPU  
   2) membuat copy data baru  
2) Tidak type-safe  
3) Menyembunyikan desain data yang buruk

**Biasanya ini tanda:**

1) Struktur data tidak jelas  
2) Boundary layer tidak tegas  
3) Tidak ada DTO / Resource layer

### **6.5 Reference**

**Clean Code Principle: “**Jangan gunakan format pertukaran data (JSON) sebagai alat manipulasi internal.”

## **7\. Standarisasi Pola Cache Data Referensi & Relasi Model** {#7.-standarisasi-pola-cache-data-referensi-&-relasi-model}

### **7.1 Tujuan**

Membangun sistem cache yang konsisten, mudah di-invalidasi, dan tidak menimbulkan data stale.

### **7.2 Alur Standar yang Dianjurkan**

1) Model → sumber kebenaran (single source of truth)  
2) Cache Class khusus → menyimpan data siap pakai  
3) Observer / Trait → invalidasi cache otomatis  
4) View / Service hanya membaca cache, tidak membangun ulang

### **7.3 How-to Guides**

**DO**

| // Contoh Cache Class yang Baikclass JenisOutputCache{    const KEY \= 'jenis\_output:options';    public static function options(): array    {        return Cache::remember(            self::KEY,            now()-\>addDay(),            fn () \=\> JenisOutput::pluck('nama', 'id')-\>toArray()        );    }    public static function clear(): void    {        Cache::forget(self::KEY);    }} |
| :---- |

| // Auto Cache Invalidation via Model Observerclass JenisOutputObserver{    public function created(JenisOutput $model)    {        JenisOutputCache::clear();    }    public function updated(JenisOutput $model)    {        JenisOutputCache::clear();    }    public function deleted(JenisOutput $model)    {        JenisOutputCache::clear();    }} |
| :---- |

| \<\!-- Alternatif: Auto Cache Invalidation via Trait Class \--\>\<?phpnamespace Modules\\Core\\Models\\Traits;trait ClearCache{   protected static function bootClearCache()   {       static::updated(function ($model) {           static::clearCache($model);       });       static::deleted(function ($model) {           static::clearCache($model);       });   }   /\*\*    \* Clear any related cache    \*    \* @param mixed $model    \*/   abstract private static function clearCache($model);} |
| :---- |

1) Gunakan satu cache class per domain data  
2) Simpan final shape data di cache (siap dipakai)  
3) Gunakan key cache eksplisit & terpusat  
4) Gunakan Model Observer / Trait untuk auto-invalidation  
5) Cache hanya hasil query read-only

**DON’T**

| // Cache Diletakkan di Controller / Service Acakpublic function index(){    return Cache::remember('jenis\_output', 86400, function () {        return JenisOutput::all();    });}// Cache Tanpa Invalidation OtomatisCache::rememberForever('jenis\_output', function () {    return JenisOutput::pluck('nama', 'id');}); |
| :---- |

1) Menaruh `Cache::remember()`:  
   1) di controller  
   2) di service acak  
2) Menggunakan `rememberForever()` tanpa invalidasi  
3) Membiarkan:  
   1) key cache tidak konsisten  
   2) cache tersebar di banyak file  
4) Melakukan query \+ transform berulang di banyak tempat

### **7.4 Explanation**

Masalah yang Ditemukan di Lapangan  
Pola cache yang **tidak distandarisasi** menyebabkan:

1) Cache tersebar & sulit dilacak  
2) Tidak ada standar penamaan key  
3) Invalidation manual (rawan lupa)  
4) Data stale muncul hanya di production  
5) Technical debt tersembunyi

**Kesalahan umum:** “Yang penting cepat, nanti cache di controller saja.”  
Ini tidak scalable dan sulit dirawat.

### **7.5 Reference**

**Prinsip Desain Cache (Wajib)**

1) Cache bukan sumber kebenaran  
2) Model \= single source of truth  
3) Cache harus:  
   1) mudah dihapus  
   2) terpusat  
   3) otomatis ter-invalidate  
4) Key cache harus eksplisit & terdokumentasi

**Risiko Jika Diabaikan**

1) Bug sulit direproduksi  
2) Inconsistent behavior antar modul  
3) Masalah hanya muncul di production  
4) Refactor mahal & berisiko

# **Code Quality & Engineering Practices** {#code-quality-&-engineering-practices}

## **1\. Pengelolaan State & Data Besar pada Livewire** {#1.-pengelolaan-state-&-data-besar-pada-livewire-1}

Setiap kode Laravel harus memenuhi empat prinsip utama berikut:

### **1.1 Readable before clever**

Kode harus mudah dibaca sebelum dianggap “smart” atau ringkas.  
contoh:

1) Terlalu Clever (Sulit Dibaca)

| $total \= collect($orders)-\>filter(fn($o) \=\> $o-\>status \=== 'paid')   \-\>map(fn($o) \=\> $o-\>items-\>sum('price'))   \-\>sum(); |
| :---- |

Secara teknis benar, tetapi:

1) Tidak jelas apa yang dihitung  
2) Sulit debug jika ada masalah  
3) Tidak ada boundary yang jelas  
2) Readable & Intentional

| $paidOrders \= $orders-\>where('status', 'paid');$totalRevenue \= $paidOrders-\>sum(function ($order) {   return $order-\>items-\>sum('price');}); |
| :---- |

Lebih panjang, tetapi:

1) Intensi jelas  
2) Mudah di-debug  
3) Mudah diberi breakpoint

### **1.2 Consistency over preference**

Konsistensi tim lebih penting daripada gaya pribadi developer, Misalnya tim sepakat menggunakan Service Class untuk business logic. Aturan main lebih lanjut dijelaskan di poin 2\.

### **1.3 Single source of truth**

Tidak boleh ada duplikasi logika bisnis atau aturan domain. Contoh duplikasi logic:  
Di Controller:

| if ($order-\>status \!== 'paid') {   abort(403);} |
| :---- |

Di services lain:

| if ($order-\>status \!== 'paid') {   throw new Exception('Invalid order');} |
| :---- |

   
Aturan yang sama ditulis dua kali. Wajib menggunakan domain services

### **1.4 Framework-aligned**

Laravel digunakan sesuai desain aslinya, bukan dilawan atau dimodifikasi secara internal.  
Contoh:

1) Manual query join tanpa relasi:

| DB::table('orders')   \-\>join('users', 'orders.user\_id', '=', 'users.id')   \-\>get(); |
| :---- |

2) Wajib gunakan relasi sesuai best practice laravel:

| class Order extends Model{   public function user()   {       return $this\-\>belongsTo(User::class);   }}$orders \= Order::with('user')-\>get(); |
| :---- |

## **2\. Standar Penamaan dan Struktur Kode** {#2.-standar-penamaan-dan-struktur-kode}

### **2.1 Konvensi Umum**

1) Wajib mengikuti PSR-1, PSR-4, dan PSR-12  
2) Mengikuti Laravel Naming Convention  
3) Nama harus deskriptif dan kontekstual

### **2.2 Aturan Penamaan Utama**

| Elemen | Aturan |
| ----- | ----- |
| Controller | Singular (`ArticleController`) |
| Model | Singular (`User`) |
| Route | Plural (`/articles`) |
| Table | Plural snake\_case (`article_comments`) |
| Variable | camelCase |
| Collection | Plural & deskriptif (`$activeUsers`) |
| Method | camelCase & verb-based |
| View | snake\_case (`show_filtered.blade.php`) |

Catatan engineering: “Jika sebuah nama tidak bisa dijelaskan tanpa komentar, maka namanya salah.”

### **2.3 Struktur Arsitektur yang Digunakan di Tim (MVC \+ Service Layer)**

Di dalam tim ini, kita menggunakan pola:  
**Model** – **View** – **Controller** – **Service** (tanpa Repository layer)

Dengan aturan tegas:

1) **Domain logic dan business rule berada di Service**  
2) Model hanya merepresentasikan data & relasi  
3) Controller hanya mengatur alur request–response  
4) View hanya bertanggung jawab terhadap presentasi

#### **2.3.1 Struktur Folder yang Diterapkan**

Struktur umum:  
`app/`  
 `├── Models/`  
 `├── Http/`  
 `│    ├── Controllers/`  
 `│    ├── Requests/`  
 `│    └── Middleware/`  
 `├── Services/`  
 `└── Providers/`  
Contoh:  
`app/Models/Order.php`  
`app/Http/Controllers/OrderController.php`  
`app/Services/OrderService.php`  
Tidak menggunakan:  
`app/Repositories/`  
Karena:

1) Eloquent sudah berfungsi sebagai data access layer  
2) Repository sering menjadi wrapper pasif tanpa nilai tambah  
3) Menambah kompleksitas tanpa kebutuhan nyata

#### **2.3.2 Tanggung Jawab Tiap Layer**

1) **Model**  
   Fokus pada:  
1) Representasi tabel  
2) Relasi antar model  
3) Scope query  
4) Domain helper sederhana (pure logic kecil)  
   **Contoh Model yang Benar**

| class Order extends Model{   protected $fillable \= \['user\_id', 'reference', 'status'\];   public function user()   {       return $this\-\>belongsTo(User::class);   }   public function scopePaid($query)   {       return $query-\>where('status', 'paid');   }   public function isPaid(): bool   {       return $this\-\>status \=== 'paid';   }} |
| :---- |

   

   **Yang Tidak Boleh di Model:**

1) Mengakses Request  
2) Mengirim email  
3) Menjalankan transaction kompleks  
4) Query lintas banyak domain

2) **Controller**  
   Fokus pada:  
1) Menerima request  
2) Validasi (via Form Request)  
3) Memanggil Service  
4) Mengembalikan response  
5) Controller tidak boleh mengandung business rule.  
   **Contoh Controller yang Benar**

| class OrderController extends Controller{   public function store(StoreOrderRequest $request, OrderService $service)   {       $order \= $service-\>create($request-\>validated());       return redirect()-\>route('orders.show', $order);   }} |
| :---- |

   

   **Yang Tidak Boleh di Controller:**

1) Query kompleks  
2) Looping domain logic  
3) Perhitungan bisnis  
4) Transaction orchestration yang berat

3) **Service (Pusat Business Logic & Domain Rules)**  
   Semua aturan bisnis berada di sini.  
   Service bertanggung jawab atas:  
1) Validasi domain (di luar validasi request)  
2) Orkestrasi transaction  
3) Integrasi dengan service eksternal  
4) Penegakan business invariant  
     
   **Contoh Service yang Benar**

| class OrderService{   public function create(array $data): Order   {       return DB::transaction(function () use ($data) {           $order \= Order::create($data);           if (\! $order-\>isPaid()) {               throw new DomainException('Order must be paid.');           }           // Business rule tambahan           $this\-\>applyReward($order);           return $order;       });   }   protected function applyReward(Order $order): void   {       // logic domain   }} |
| :---- |

#### **2.3.3 Prinsip Penting dalam Arsitektur Ini**

1) **Service \= Single Source of Business Truth**  
   Semua aturan bisnis harus:  
1) Ditulis di service  
2) Tidak tersebar di controller  
3) Tidak tersebar di job  
4) Tidak tersebar di blade  
2) **Model ≠ Business Orchestrator**  
   Model boleh memiliki:  
1) Helper method kecil (isPaid)  
2) Scope  
3) Relasi  
   Model tidak boleh menjadi "mini service container".  
3) **Controller \= Tipis & Deterministik**  
   Jika controller lebih dari ±15–20 baris logic aktif, itu indikasi business logic belum dipindahkan ke Service.  
4) **Tidak Menggunakan Repository Layer**  
   Alasan eksplisit:  
1) Eloquent sudah abstraction untuk data access  
2) Repository sering hanya:

| public function find($id){   return Order::find($id);} |
| :---- |

   → Tidak menambah nilai arsitektural.

   Repository hanya dipertimbangkan jika:

1) Multi data source  
2) Query sangat kompleks lintas domain  
3) Kebutuhan swap persistence layer

   Selain itu → tidak digunakan.

#### **2.3.4 Contoh Alur Lengkap (Flow Nyata)**

Request masuk:

1) FormRequest → validasi format  
2) Controller → panggil Service  
3) Service → jalankan business logic \+ transaction  
4) Model → persist data  
5) Response dikembalikan

Flow deterministik & mudah dilacak.

#### **2.3.5 Anti-Pattern yang Dilarang**

1) Business rule di Blade  
2) Query kompleks di Controller  
3) Request logic di Model  
4) Cache logic tersebar  
5) Service hanya sebagai wrapper tipis tanpa logika

## **3\. Penulisan Kode yang Ekspresif dan Ringkas** {#3.-penulisan-kode-yang-ekspresif-dan-ringkas}

Laravel menyediakan helper dan shortcut untuk meningkatkan keterbacaan kode.

### **3.1 Prinsip**

1) Gunakan sintaks ringkas jika tetap jelas  
2) Jangan memaksakan shortcut jika mengurangi kejelasan  
3) Hindari verbose code yang tidak memberi nilai tambah

### **3.2 Contoh Prinsip**

1) Gunakan `session()` dibanding `Session::get()`  
2) Gunakan `->latest()` dibanding `->orderBy(..., 'desc')`  
3) Gunakan `optional()` untuk null-safe access

### **3.3 Rule of thumb:**

“Jika reviewer harus berhenti lebih dari 3 detik untuk memahami satu baris kode, baris tersebut perlu disederhanakan.”

## **4\. Single Responsibility Principle (SRP)** {#4.-single-responsibility-principle-(srp)}

Setiap class dan method hanya boleh memiliki satu tanggung jawab.

### **4.1 Indikasi Pelanggaran SRP**

1) Method terlalu panjang  
2) Terlalu banyak if/else  
3) Sulit dijelaskan dalam satu kalimat

### **4.2 Praktik yang Dianjurkan**

1) Pisahkan validasi, formatting, dan business rule  
2) Gunakan method kecil dengan nama yang jelas  
3) Pindahkan logika kompleks ke Service atau Domain Layer

“SRP bukan tentang jumlah baris, tapi alasan perubahan.”

## **5\. Don’t Repeat Yourself (DRY)** {#5.-don’t-repeat-yourself-(dry)}

Setiap aturan bisnis harus memiliki satu sumber kebenaran.

### **5.1 Wajib Menerapkan DRY**

Penerapan DRY wajib pada:

1) Query Eloquent → gunakan local scope  
2) Blade → gunakan `@extends`, `@include`, `@component`  
3) Business logic → gunakan Service Class  
4) Shared behavior → gunakan Trait

### **5.2 Anti-Pattern yang Dilarang**

1) Copy-paste query antar model  
2) Duplikasi validasi di controller dan service  
3) Helper global tanpa konteks domain

## **6\. Type Safety dan Kontrak Kode** {#6.-type-safety-dan-kontrak-kode}

### **6.1 Type Declaration**

1) Wajib menggunakan type hint pada parameter dan return value  
2) Gunakan:  
   1) Nullable type (`?User`)  
   2) Union type (PHP 8+) jika relevan  
3) Disarankan menggunakan declare(`strict_types=1`);

### **6.2 DocBlock**

Digunakan untuk:

1) Dokumentasi  
2) Static analysis (PHPStan, Psalm)  
3) Konteks tambahan di luar tipe native

### **6.3 Engineering rule**

“Method tanpa return type dianggap incomplete contract.”

## **7\. Code Style dan Otomasi** {#7.-code-style-dan-otomasi}

### **7.1 Laravel Pint**

Laravel Pint wajib digunakan sebagai formatter standar, gunakan format pint bawaan laravel.

### **7.2 Aturan**

1) Pint dijalankan sebelum commit  
2) Tidak ada diskusi subjektif soal formatting di code review

### **7.3 Manfaat**

1) Konsistensi lintas tim  
2) Review fokus ke logika, bukan spasi

## **8\. Larangan Meng-override Fitur Inti Laravel** {#8.-larangan-meng-override-fitur-inti-laravel}

### **8.1 Dilarang**

1) Mengubah behavior internal Laravel  
2) Meng-override core class tanpa alasan arsitektural kuat

### **8.2 Risiko**

1) Masalah saat upgrade  
2) Bug tersembunyi  
3) Ketergantungan pada implementasi internal

### **8.3 Prinsip Resmi**

**“**Extend, don’t modify”

### **8.4 Gunakan**

1) Service Provider  
2) Event / Listener  
3) Macro  
4) Custom abstraction

## **9\. Standar Runtime & Server Environment (Laravel Octane \+ FrankenPHP)** {#9.-standar-runtime-&-server-environment-(laravel-octane-+-frankenphp)}

### **9.1 Tujuan**

Meningkatkan throughput aplikasi, mengurangi latensi bootstrapping framework, dan memaksimalkan penggunaan resource server modern.

### **9.2 Standar Implementasi**

1) Wajib menggunakan Laravel Octane untuk lingkungan produksi.  
2) Server/Driver yang digunakan adalah FrankenPHP.  
3) Tidak lagi menggunakan PHP-FPM standar kecuali untuk kebutuhan legacy khusus yang belum kompatibel.

### **9.3 Implikasi Engineering (Wajib Diperhatikan)**

Menggunakan Octane (FrankenPHP) mengubah sifat aplikasi dari request-terminate menjadi long-running process. Developer wajib memperhatikan:

#### **9.3.1 Pengelolaan State & Memori (Memory Leaks)**

* Hindari menambahkan data ke dalam array statis atau global variabel yang tidak dibersihkan setelah request selesai.  
* Aplikasi hidup terus-menerus di memori (RAM), kebocoran kecil akan menumpuk hingga server crash.

#### **9.3.2 Dependency Injection & Singleton**

* Hati-hati saat me-resolve service berbentuk Singleton.  
* Pastikan Singleton tidak menyimpan state spesifik milik user/request sebelumnya (misal: jangan menyimpan User ID di properti class Singleton).  
* Gunakan Scoped binding jika objek tersebut bergantung pada state request saat ini.

#### **9.3.3 Konstruktor & Destruktor**

* Konstruktor service global hanya dijalankan sekali saat worker booting (bukan setiap request).  
* Jangan menaruh logika inisialisasi per-request di dalam `__construct()` milik service yang bersifat Singleton/Long-lived.

### **9.4 Contoh Implementasi yang Benar**

| // Menggunakan Dependency Injection pada method (Method Injection)// Container akan memberikan instance Request yang baru & valid untuk siklus saat ini.public function handle(Request $request, OrderService $service){    // Aman: $request adalah milik user yang sedang mengakses saat ini    return $service-\>process($request-\>user());} |
| :---- |

### **9.5 Contoh Implementasi yang Salah**

| class OrderService{    protected $currentUser;    // BAHAYA DI OCTANE:    // Konstruktor ini mungkin hanya jalan sekali saat server start.    // $request yang di-inject bisa jadi stale (milik request pertama kali).    public function \_\_construct(Request $request)    {        $this\-\>currentUser \= $request-\>user();    }} |
| :---- |

