# 🧠 Laravel Engineering Playbook

Knowledge base berbasis markdown untuk **GitHub Copilot Chat**. Berisi aturan engineering dan prompt templates yang diekstrak dari **Laravel 12+ Guidelines** internal tim.

Tanpa build step, tanpa extension — cukup clone ke proyek dan langsung pakai.

---

## Apa Isinya?

```
rules/        → Aturan engineering yang WAJIB diikuti
prompts/      → Task templates dengan persona AI untuk berbagai skenario
```

### Rules (Aturan)

| File | Topik |
|------|-------|
| `livewire-state-management` | Computed vs Public Property, state minimal |
| `query-performance` | N+1, eager loading, pluck, json_encode anti-pattern |
| `file-upload-transaction` | Upload file di luar DB transaction |
| `caching-pattern` | Cache Class, Observer invalidation, View Composer |
| `naming-architecture` | PSR, MVC + Service Layer, naming convention |
| `code-quality-principles` | SRP, DRY, type safety, Laravel Pint |
| `octane-frankenphp` | Memory leaks, singleton, scoped binding |

### Prompts (Task Templates)

| Prompt | Kegunaan |
|--------|----------|
| `/new-feature` | Membuat fitur baru sesuai standar |
| `/code-review` | Review kode / merge request |
| `/performance-audit` | Audit bottleneck performa |
| `/refactor` | Bersihkan technical debt |
| `/livewire-component` | Bangun komponen Livewire |
| `/caching-strategy` | Desain strategi caching |
| `/database-optimization` | Optimasi query & data access |

---

## Instalasi

Clone repository ini sebagai folder `.github` di root proyek Laravel kamu:

```bash
git clone https://github.com/BayuFirmansyaah/github-agents-skilss.git .github
```

Jika tidak butuh git history:

```bash
rm -rf .github/.git
```

Atau sebagai git submodule (untuk tetap mendapat update):

```bash
git submodule add https://github.com/BayuFirmansyaah/github-agents-skilss.git .github
```

**Selesai!** Buka VS Code, buka Copilot Chat, dan knowledge base siap digunakan.

---

## Cara Penggunaan

### Menggunakan Prompt

Di GitHub Copilot Chat, cukup ketik `/` diikuti nama prompt:

```
/new-feature Buat modul Inventory dengan CRUD lengkap
```

```
/code-review Review file OrderController.php
```

```
/performance-audit Cek performa halaman dashboard
```

```
/refactor Perbaiki OrderService agar sesuai SRP
```

```
/livewire-component Buat komponen form assessment dengan rubrik
```

```
/caching-strategy Desain caching untuk data master provinsi
```

```
/database-optimization Optimasi query di ReportService
```

### Mereferensi Rules

Kamu juga bisa merujuk rules secara langsung:

```
@workspace ikuti rules query-performance, optimasi query di file ini
```

```
@workspace berdasarkan rules naming-architecture, review struktur folder ini
```

### Kombinasi Prompt + Konteks

```
@workspace /code-review review perubahan di branch feature/payment
```

```
@workspace /new-feature buat fitur export laporan PDF, ikuti rules caching-pattern
```

---

## Kustomisasi

### Menambah Rules Baru

Buat file di `rules/` dengan format:

```markdown
# Rule: [Nama Rule]

[Paragraf konteks — jelaskan prinsip utama]

## DO: [Praktik yang Benar]

​```php
// Contoh kode yang benar
​```

## DON'T: [Praktik yang Salah]

​```php
// Contoh kode yang salah
​```
```

### Menambah Prompt Baru

Buat file di `prompts/` dengan format `nama-prompt.prompt.md`:

```markdown
# Prompt: [Nama Prompt]

> **Persona:** [Peran AI saat menjalankan prompt ini]
> **Gunakan saat:** [Kapan prompt ini dipakai]

## Siapa Kamu
[Deskripsi persona]

## Rules yang WAJIB Diikuti
- [Rule 1](../rules/nama-rule.rule.md)
- [Rule 2](../rules/nama-rule.rule.md)

## Langkah Kerja
### Step 1: ...
### Step 2: ...

## Output yang Diharapkan
[Format output]
```

### Mengubah untuk Stack Lain

Fork repository ini dan ganti isi `rules/` dan `prompts/` dengan standar stack kamu sendiri. Struktur folder dan format file bisa tetap sama.

---

## Kontribusi

Kontribusi terbuka untuk siapa saja!

### Langkah Kontribusi

1. **Fork** repository ini
2. **Clone** fork kamu ke lokal
   ```bash
   git clone https://github.com/<username-kamu>/github-agents-skilss.git
   ```
3. **Buat branch** dari `master`
   ```bash
   git checkout -b feat/nama-kontribusi
   ```
4. **Buat perubahan** — tambah prompt, rule, atau perbaiki yang sudah ada
5. **Test** — clone ke proyek Laravel sebagai `.github` dan coba di Copilot Chat
6. **Commit** dengan [conventional commits](https://www.conventionalcommits.org/)
   ```bash
   git commit -m "feat(prompts): add deployment-checklist prompt"
   git commit -m "fix(rules): update caching-pattern examples"
   ```
7. **Push** dan buka **Pull Request**
   ```bash
   git push origin feat/nama-kontribusi
   ```

### Apa yang Bisa Dikontribusikan?

| Jenis | Lokasi | Format Nama File |
|-------|--------|-----------------|
| Rule baru | `rules/` | `nama-topik.rule.md` |
| Prompt baru | `prompts/` | `nama-task.prompt.md` |
| Perbaikan | File yang sudah ada | — |

### Panduan Review

- Pastikan tidak ada duplikasi dengan file yang sudah ada
- Setiap prompt harus mereferensi minimal 1 rule
- Gunakan bahasa Indonesia untuk konsistensi
- Sertakan contoh kode yang jelas (DO/DON'T)

---

## Lisensi

MIT
