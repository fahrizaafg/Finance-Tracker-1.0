# Frontend Design Plan - Finance Dashboard

## 1. Design Philosophy: "Clean, Focus, Modern"
Aplikasi ini akan menggunakan pendekatan **Mobile-First** karena pencatatan keuangan sering dilakukan "on-the-go" (saat bepergian). Namun, tampilan Desktop akan tetap ergonomis dengan layout responsif.

### **Style Guide (Tailwind CSS)**
*   **Typography:** `Inter` atau `Plus Jakarta Sans`. Font ini sangat mudah dibaca di ukuran kecil dan terlihat profesional.
*   **Color Palette:**
    *   **Primary:** `Indigo` atau `Violet` (Modern Tech feel).
    *   **Success (Pemasukan):** `Emerald-500` (Hijau yang lebih lembut tapi jelas).
    *   **Danger (Pengeluaran):** `Rose-500` (Merah modern).
    *   **Background:** `Slate-50` (Light Mode) / `Slate-900` (Dark Mode).
    *   **Surface (Cards):** `White` dengan shadow tipis (`shadow-sm` atau `shadow-md`).
*   **Shapes:** `Rounded-xl` atau `2xl` untuk kartu dan tombol, memberikan kesan ramah dan modern.

## 2. Navigation Structure (Sitemap)

Kita akan menggunakan **Hybrid Navigation**:
*   **Mobile (< 768px):** Bottom Navigation Bar (Fixed di bawah).
*   **Desktop (>= 768px):** Sidebar Navigation (Fixed di kiri).

### **Routes / Pages**
1.  **Dashboard (`/`)**
    *   **Header:** Salam sapaan + Avatar.
    *   **Summary Cards:** Total Saldo, Pemasukan Bulan Ini, Pengeluaran Bulan Ini.
    *   **Quick Stats:** Grafik garis mini (Sparkline) untuk tren 7 hari terakhir.
    *   **Recent Transactions:** List 5 transaksi terakhir.
    *   **FAB (Floating Action Button):** Tombol `+` besar untuk tambah transaksi cepat.

2.  **Transactions (`/transactions`)**
    *   **Filters:** Filter Bulan, Tahun, dan Kategori.
    *   **Search:** Cari berdasarkan catatan.
    *   **Grouped List:** Transaksi dikelompokkan per hari (misal: "Hari Ini", "Kemarin").

3.  **Analytics / Stats (`/analytics`)**
    *   **Donut Chart:** Proporsi pengeluaran per kategori.
    *   **Bar Chart:** Perbandingan Pemasukan vs Pengeluaran per bulan dalam setahun.
    *   **Insight:** Teks ringkas (misal: "Pengeluaran terbesarmu bulan ini adalah Makanan").

4.  **Settings (`/settings`)**
    *   **Kategori Management:** Tambah/Edit/Hapus kategori kustom.
    *   **Appearance:** Toggle Dark Mode.
    *   **Data Management:** Export/Import data (JSON/CSV) - *Fitur masa depan*.

## 3. Core UI Components

### **A. Layout Shell**
Wrapper utama yang menangani responsivitas (beralih antara Sidebar dan Bottom Nav).

### **B. Transaction Card**
Komponen kecil untuk menampilkan satu baris transaksi.
*   **Kiri:** Icon Kategori (dengan background warna pastel).
*   **Tengah:** Nama Kategori & Catatan (text kecil).
*   **Kanan:** Nominal (Warna Hijau/Merah) & Jam.

### **C. Add Transaction Modal (The "Core" Interaction)**
Ini adalah fitur yang paling sering digunakan, jadi UX-nya harus sangat mulus.
*   **Tipe:** Toggle Button (Pemasukan | Pengeluaran).
*   **Nominal:** Input angka besar dan jelas (auto-format currency).
*   **Kategori:** Grid icon yang bisa dipilih.
*   **Date:** Default "Today", tap untuk ganti.
*   **Note:** Input text opsional.

## 4. User Experience (UX) Considerations
*   **Instant Feedback:** Saat transaksi ditambah, saldo di dashboard langsung berubah tanpa refresh (Optimistic UI update).
*   **Input Minim:** Keyboard tipe `numeric` langsung muncul saat input harga.
*   **Empty States:** Tampilan menarik (ilustrasi) saat belum ada data transaksi, bukan sekadar layar kosong.

## 5. Visual Wireframes & Flow

### **A. ASCII Wireframe (Mobile View)**

```text
+-----------------------------------+
|  Halo, User!                  (A) |  <- Header + Avatar
|  Total Saldo: Rp 5.000.000        |
+-----------------------------------+
|  [ IN: +2jt ]   [ OUT: -500k ]    |  <- Summary Cards
+-----------------------------------+
|  Tren Minggu Ini:                 |
|   /\      /---\                   |  <- Sparkline Chart
|  /  \____/     \                  |
+-----------------------------------+
|  Transaksi Terakhir        View > |
|                                   |
|  [Icon] Makan Siang      -25.000  |
|         Nasi Padang               |
|                                   |
|  [Icon] Gaji Bulanan  +5.000.000  |
|         November                  |
|                                   |
|  [Icon] Transport        -15.000  |
|         Gojek                     |
+-----------------------------------+
|                                   |
|               ( + )               |  <- FAB (Floating Action Button)
|                                   |
| [Home] [History] [Stats] [Set.]   |  <- Bottom Navigation
+-----------------------------------+
```

### **B. Add Transaction Modal (Wireframe)**

```text
+-----------------------------------+
|  Tambah Transaksi             [x] |
+-----------------------------------+
|  [  Pemasukan  ]  [ PENGELUARAN ] |  <- Toggle Type
+-----------------------------------+
|  Rp 0___________________________  |  <- Large Input
+-----------------------------------+
|  Kategori:                        |
|  (O) Makan   (O) Transport        |
|  (O) Belanja (O) Tagihan          |  <- Horizontal Scroll / Grid
+-----------------------------------+
|  Tanggal: [ Hari Ini v ]          |
|  Catatan: [ Tulis catatan...   ]  |
+-----------------------------------+
|                                   |
|       [ SIMPAN TRANSAKSI ]        |  <- Big Primary Button
|                                   |
+-----------------------------------+
```

### **C. User Flow (Mermaid)**

```mermaid
graph TD
    A[Start App] --> B{Has Data?}
    B -- No --> C[Show Onboarding / Empty State]
    B -- Yes --> D[Dashboard]
    
    D --> E[Click FAB (+)]
    E --> F[Open Modal Transaction]
    
    F --> G{Select Type}
    G -- Income --> H[Input Amount & Category]
    G -- Expense --> H
    
    H --> I[Save Transaction]
    I --> J[Update Local Storage / DB]
    J --> K[Update Dashboard State]
    K --> D
    
    D --> L[View Analytics]
    L --> M[See Charts & Insights]
    
    D --> N[View History]
    N --> O[Filter & Search List]
```
