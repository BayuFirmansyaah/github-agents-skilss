# Rule: File Upload & Database Transaction

Kamu adalah seorang Engineer yang memahami perbedaan fundamental antara **database transaction** (transactional & rollback-able) dan **filesystem** (non-transactional). Kamu TIDAK PERNAH menaruh operasi upload file di dalam `DB::transaction()`.

**Rule: "Transaction boundary ≠ Business flow boundary"**

---

## Prinsip Desain

Database transaction harus:
1. **Cepat** — tidak menunggu IO eksternal
2. **Pendek** — selesai dalam waktu singkat
3. **Bebas IO eksternal** — tidak ada filesystem, network call, atau API call di dalamnya

**Filesystem ≠ bagian dari transaksi database.**

---

## DO: Upload File di Luar Transaction

```php
public function update(array $data, int $id): DokumenKegiatan|Error
{
    $model = $this->model->findOrFail($id);

    // 1. Siapkan upload (belum sentuh DB)
    $upload = $this->processUploadDocument(
        $data,
        'id_dokumen',
        UploadDokumen::KERJASAMA_KEGIATAN,
        $model
    );

    // 2. Jika ada upload → lakukan upload fisik DULU
    if (!empty($upload)) {
        $uploadResult = $upload->executeUpload();

        if (Error::isError($uploadResult)) {
            return $uploadResult;
        }

        $data['id_dokumen'] = $upload->get()?->id;
    } else {
        unset($data['id_dokumen']);
    }

    // 3. Baru mulai DB transaction (singkat & deterministik)
    DB::beginTransaction();

    try {
        $model->update($data);
        DB::commit();
        return $model;
    } catch (\Throwable $e) {
        DB::rollBack();

        // 4. Cleanup file jika DB gagal
        if (!empty($upload)) {
            $upload->rollbackUpload();
        }

        return Error::fromException($e);
    }
}
```

**Alur yang benar:**
1. Upload file ke filesystem/object storage
2. Jika upload berhasil → mulai DB transaction
3. Simpan referensi file (path/metadata) di DB
4. Commit transaction
5. Jika DB gagal → cleanup file yang sudah ter-upload

---

## DON'T: Upload File di Dalam Transaction

```php
// ❌ JANGAN LAKUKAN INI
public function update(array $data, int $id): DokumenKegiatan|Error
{
    DB::beginTransaction(); // Transaction dimulai terlalu awal

    $model = $this->model->findOrFail($id);
    $upload = $this->processUploadDocument($data, ...);

    if (!empty($upload)) {
        $data['id_dokumen'] = $upload->get()?->id;
    }

    $model->update($data);

    // Upload file di DALAM transaction!
    $upload?->executeUpload();

    DB::commit();
    return $model;
}
```

**Mengapa ini berbahaya:**

| Skenario | Dampak |
|---|---|
| File berhasil upload, DB rollback | File orphan tanpa referensi di DB |
| Upload lambat (network issue) | DB lock menahan resource lebih lama |
| Upload timeout | Transaction timeout, data inconsistent |

**Dampak lanjutan:**
- Lock database lebih lama → throughput menurun
- Debugging sangat sulit (lintas layer: DB + filesystem)
- Inkonsistensi data yang sulit dideteksi

---

## Mekanisme Rollback yang Dianjurkan

Karena filesystem tidak bisa di-rollback secara otomatis, gunakan salah satu mekanisme berikut:

1. **Temporary file** — upload ke lokasi sementara, pindahkan ke lokasi final setelah DB commit
2. **Retry / idempotent upload** — upload bisa diulang tanpa efek samping
3. **Manual cleanup** — hapus file secara eksplisit jika DB gagal (seperti contoh DO di atas)
