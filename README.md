# 💰 BukuCuan — SaaS POS & Stok UMKM

> Kendalikan Stok Otomatis & Audit Keuangan UMKM Secepat Kilat!

BukuCuan membantu pemilik warung dan UKM mengaudit Harga Pokok Penjualan (HPP) real-time, memonitor arus kas digital, beserta sistem auto-order WhatsApp ke Supplier resmi.

---

## 🚀 Cara Menjalankan Secara Lokal

### Prasyarat

Pastikan sudah terinstal di sistem kamu:

- [Node.js](https://nodejs.org/) v18+
- [PostgreSQL](https://www.postgresql.org/) v14+
- [npm](https://www.npmjs.com/) atau [yarn](https://yarnpkg.com/)

### 1. Clone Repository

```bash
git clone https://github.com/username/bukucuan.git
cd bukucuan
```

### 2. Setup Backend

```bash
cd backend
npm install
```

Buat file `.env` di folder `backend/`:

```env
# Database
DATABASE_URL=postgresql://postgres:password@localhost:5432/bukucuan_db

# JWT
JWT_SECRET=your_super_secret_key_here
JWT_EXPIRES_IN=7d

# Bcrypt
BCRYPT_SALT_ROUNDS=10

# Server
PORT=5000
NODE_ENV=development

# WhatsApp (opsional, untuk fitur Auto-PO)
WA_API_KEY=your_whatsapp_api_key
```

Setup database:

```bash
# Buat database PostgreSQL
psql -U postgres -c "CREATE DATABASE bukucuan_db;"

# Jalankan migrasi schema
npm run db:migrate

# (Opsional) Seed data dummy
npm run db:seed
```

Jalankan backend server:

```bash
npm run dev
# Server berjalan di http://localhost:5000
```

### 3. Setup Frontend

```bash
cd ../frontend
npm install
```

Buat file `.env.local` di folder `frontend/`:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_APP_NAME=BukuCuan
```

Jalankan frontend:

```bash
npm run dev
# Aplikasi berjalan di http://localhost:3000
```

### 4. Akses Aplikasi

Buka browser dan kunjungi `http://localhost:3000`.

**Akun demo (setelah seed):**

| Role | Username | Password |
|------|----------|----------|
| Owner | `rudi@tokosembako.com` | `Demo1234!` |
| Kasir | `andi@tokosembako.com` | `Demo1234!` |

---

## 🛠️ Daftar Teknologi

### Frontend
| Teknologi | Versi | Kegunaan |
|-----------|-------|----------|
| [Next.js](https://nextjs.org/) | 14+ | React framework, SSR/SSG |
| [React](https://react.dev/) | 18+ | UI component library |
| [Tailwind CSS](https://tailwindcss.com/) | 3+ | Utility-first styling |
| [Recharts](https://recharts.org/) | 2+ | Grafik analisis profit |

### Backend
| Teknologi | Versi | Kegunaan |
|-----------|-------|----------|
| [Node.js](https://nodejs.org/) | 18+ | Runtime JavaScript |
| [Express.js](https://expressjs.com/) | 4+ | REST API framework |
| [JWT](https://jwt.io/) | — | Autentikasi stateless |
| [Bcrypt](https://github.com/kelektiv/node.bcrypt.js) | — | Hashing password |

### Database
| Teknologi | Versi | Kegunaan |
|-----------|-------|----------|
| [PostgreSQL](https://www.postgresql.org/) | 14+ | Database relasional utama |
| [node-postgres (pg)](https://node-postgres.com/) | — | PostgreSQL client untuk Node.js |

### Google Cloud / Infrastructure
| Teknologi | Kegunaan |
|-----------|----------|
| [Google Cloud Run](https://cloud.google.com/run) | Deployment backend containerized |
| [Cloud SQL (PostgreSQL)](https://cloud.google.com/sql) | Managed database production |
| [Project IDX](https://idx.dev/) | Cloud development environment |

---

## ✨ Cara Menjalankan Fitur Utama

### 1. 💵 Kasir & Arus Kas

Mencatat pemasukan (penjualan) dan pengeluaran operasional toko secara real-time.

**Langkah:**
1. Login sebagai **Owner** atau **Kasir**
2. Klik menu **Kasir & Keuangan** di sidebar
3. Klik tombol **+ Catat Transaksi Baru**
4. Pilih aliran: `Kas Masuk` (penjualan) atau `Kas Keluar` (operasional)
5. Isi kategori, deskripsi, nominal, dan metode pembayaran (Tunai / QRIS / Transfer)
6. Klik **Simpan** — jurnal arus kas diperbarui otomatis

> 💡 Filter transaksi berdasarkan **Semua / Kas Masuk / Kas Keluar** tersedia di bagian atas tabel jurnal.

---

### 2. 📦 Manajemen Stok & Katalog Produk

Mengelola inventaris produk lengkap dengan HPP, harga jual, dan monitoring stok kritis.

**Menambah produk baru:**
1. Klik menu **Stok & Produk**
2. Klik **+ Daftarkan Produk Baru**
3. Isi: SKU, nama produk, kategori, satuan, harga beli (HPP), harga jual, stok awal, dan minimum stok
4. Klik **Simpan**

**Mengubah stok:**
- Klik tombol **`-5`** atau **`+5`** di kolom Tingkat Persediaan untuk adjustment cepat
- Klik **Amandemen** untuk edit detail produk secara lengkap

> ⚠️ Produk dengan stok di bawah minimum stok otomatis ditandai **KRITIS** (merah).

---

### 3. 🚚 Supplier & Auto-Order WhatsApp

Mengelola daftar supplier dan mengirim Purchase Order (PO) otomatis saat stok kritis.

**Menambah supplier:**
1. Klik menu **Supplier & Order**
2. Klik **+ Daftarkan Supplier Baru**
3. Isi nama, PIC, nomor WhatsApp/telepon, email, dan alamat gudang
4. Pilih mode notifikasi: `Auto Notif` atau `Manual`

**Kirim PO ke Supplier:**
- Dari **Dashboard**, klik tombol **Kirim WhatsApp PO** pada produk yang kritis
- Sistem generate template pesan PO otomatis berisi nama produk, jumlah order, dan estimasi tagihan
- Klik **Konfirmasi Masuk** setelah PO dikirim untuk update log transaksi supplier

---

### 4. 📊 Analisis Profit Harian

Melihat laporan laba rugi harian dengan breakdown HPP, laba kotor, dan laba bersih.

**Langkah:**
1. Klik menu **Analisis Profit**
2. Grafik **Kinerja Laba Bersih Berkala** menampilkan tren harian secara visual
3. Klik salah satu tanggal di **Arsip Tanggal Laba** untuk melihat detail audit:
   - **HPP/COGS** — total harga pokok produk yang terjual
   - **Margin Keuntungan** — rasio laba bersih terhadap omset (%)
   - **Laba Kotor** — omset dikurangi HPP
   - **Laba Bersih** — laba kotor dikurangi biaya operasional & gaji

---

### 5. 🔐 Keamanan JWT & Bcrypt

Fitur edukasi interaktif untuk memahami sistem keamanan aplikasi.

**Simulasi Bcrypt:**
1. Klik menu **Keamanan JWT/Bcrypt**
2. Masukkan kata sandi di kolom **Kata Sandi Baru**
3. Atur **Salt Rounds** (work factor) — semakin tinggi, semakin aman & lambat
4. Klik **Generate Bcrypt Salt & Hash** untuk melihat proses hashing
5. Gunakan bagian **Metode Verifikasi Login** untuk menguji password vs hash

**Simulasi JWT:**
1. Isi **Nama User**, **Nama Bisnis UMKM**, dan **Role Otoritas**
2. (Opsional) centang **Simulasikan Hack (Spoof)** untuk melihat token invalid
3. Token JWT dan decoded claims payload akan tampil secara real-time

---

### 6. 👤 Sandbox Switcher Role

Berpindah tampilan antara perspektif **Owner** dan **Kasir** tanpa logout.

**Langkah:**
1. Di sidebar bawah, temukan bagian **Sandbox Switcher Role**
2. Pilih role dari dropdown: `Owner (Hak Penuh)` atau `Kasir`
3. Tampilan dan akses menu akan menyesuaikan role yang dipilih secara instan

> 🔑 **Owner** memiliki akses penuh termasuk analisis profit dan manajemen supplier. **Kasir** hanya bisa mencatat transaksi dan melihat stok.

---

## 🗄️ Struktur Database (PostgreSQL Schema)

```
users          — Data akun pengguna + role (owner/kasir)
products       — Katalog produk dengan HPP, harga jual, stok, min_stok
suppliers      — Data supplier + konfigurasi auto-notifikasi
transactions   — Jurnal arus kas (pemasukan & pengeluaran)
reorder_orders — Log Purchase Order ke supplier
```

Lihat ERD lengkap di halaman **PostgreSQL Schema** dalam aplikasi.

---

## 📁 Struktur Folder

```
bukucuan/
├── frontend/          # Next.js app
│   ├── app/           # App router pages
│   ├── components/    # Reusable UI components
│   └── lib/           # Utilities & API clients
├── backend/           # Express.js API
│   ├── routes/        # API endpoints
│   ├── middleware/     # JWT auth, role guard
│   ├── db/            # PostgreSQL queries & migrations
│   └── utils/         # HPP calculator, WA template builder
└── README.md
```

---

## 📄 Lisensi

MIT License — Dibuat dengan ❤️ untuk UMKM Indonesia.
