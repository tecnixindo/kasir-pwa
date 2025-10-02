# Kasir-PWA
Demo: https://kasir-pwa.web.app

Aplikasi Kasir berbasis Progressive Web App (PWA) dengan pendekatan offline-first, dibangun menggunakan:
🌐 HTML + Vue.js (via CDN)
📊 AdminLTE Template untuk antarmuka admin yang responsif
🛢️ CouchDB sebagai database server-side
💾 PouchDB sebagai database lokal (client-side) yang dapat melakukan sinkronisasi dengan CouchDB

🚀 Fitur Utama
✅ Offline-First: Aplikasi tetap dapat digunakan tanpa koneksi internet. Data akan disinkronkan secara otomatis saat koneksi tersedia.
✅ PWA: Bisa diinstal di perangkat seperti aplikasi native (mobile maupun desktop).
✅ Vue.js CDN: Penggunaan Vue versi CDN (tanpa proses build) untuk kemudahan integrasi dan pengembangan cepat.
✅ AdminLTE: Antarmuka modern dan mobile responsive untuk pengalaman pengguna yang lebih baik.
✅ Sinkronisasi Otomatis: Data transaksi disimpan di PouchDB lalu disinkronkan dengan CouchDB saat online.
✅ Tanpa Backend Khusus: Hanya membutuhkan CouchDB sebagai server database, tanpa API/backend tambahan.

🧱 Teknologi yang Digunakan
Frontend: HTML5, Vue.js (CDN), AdminLTE (Bootstrap-based)
Database Lokal: PouchDB
Database Server: CouchDB
Offline Support: Service Worker (via PWA manifest)
Penyimpanan & Sinkronisasi: PouchDB ↔ CouchDB

📦 Kegunaan
Cocok digunakan untuk:
UMKM yang membutuhkan kasir sederhana tanpa bergantung pada koneksi internet
Developer yang ingin mempelajari implementasi offline-first PWA
Proyek open source POS (Point of Sale) yang ringan dan mudah dimodifikasi

---
# 🟢 **MVP (Release Pertama)**
### `index.html → Dashboard`
* Ringkasan penjualan harian/mingguan/bulanan.
* Grafik sederhana (produk terlaris, metode pembayaran).
* Notifikasi sinkronisasi offline-online.
* Shortcut ke menu utama (POS, Produk, Customer, Report).

### `pos.html → Kasir (Point of Sale)`
* Input transaksi: scan barcode / cari produk.
* Hitung otomatis harga, diskon, pajak.
* Pilihan metode bayar: tunai, QRIS, e-wallet.
* Cetak/preview struk (integrasi printer nanti).
* Mode offline (PouchDB) → auto sync saat online.

### `product.html → Manajemen Produk`
* CRUD produk: tambah, edit, hapus.
* Kategori produk, harga, stok awal.
* Upload gambar produk.
* Import/export CSV produk.

### `customer.html → Pelanggan`
* Tambah data pelanggan: nama, telepon, email.
* Riwayat transaksi per pelanggan.
* Tagging (misal: VIP, Grosir, Member).

### `report.html → Laporan Penjualan`
* Daftar transaksi per hari.
* Filter laporan: tanggal, produk, kasir.
* Export ke CSV/Excel.
* Grafik ringkas total penjualan.

### `sync.html → Sinkronisasi Data`
* Status sinkronisasi (online/offline).
* Tombol sync manual.
* Auto-sync background.
* Resolusi konflik data (merge / overwrite).

---
# 🟡 **Release 2 → Inventory & Supplier**

### `inventory.html → Stok & Gudang`
* Stok real-time.
* Peringatan stok menipis.
* Mutasi stok (barang masuk/keluar).
* Multi gudang (lokasi penyimpanan).

### `supplier.html → Pemasok`
* Data supplier (nama, kontak, alamat).
* Catatan pembelian/purchase order.
* Riwayat transaksi supplier.

---
# 🟠 **Release 3 → Multi-User & Hak Akses**
### `user.html → Manajemen Pengguna`
* Tambah pengguna baru (kasir, admin, owner).
* Hak akses per role.
* Reset password.

### `shift.html → Shift & Cash Drawer`
* Buka shift (saldo awal).
* Tutup shift (saldo akhir, selisih).
* Laporan shift per kasir.

---
# 🔵 **Release 4 → Promo & Loyalty**
### `promo.html → Manajemen Promo`
* Diskon nominal/persentase.
* Promo bundling (beli 2 gratis 1).
* Promo berbatas waktu (happy hour).

### `loyalty.html → Program Loyalitas`
* Point reward per transaksi.
* Level membership (Silver, Gold, Platinum).
* Tukar poin dengan hadiah/voucher.

---
# 🟣 **Release 5 → Multi-Outlet & Integrasi**
### `outlet.html → Manajemen Outlet`
* Tambah outlet baru (nama, lokasi).
* Laporan per outlet.
* Transfer stok antar outlet.

### `integration.html → Integrasi E-commerce`
* Sinkronisasi produk dengan marketplace (Tokopedia, Shopee, Shopify).
* Sinkronisasi stok & pesanan.
* API untuk integrasi pihak ketiga.

---
# 🟤 **Release 6 → Akuntansi Sederhana**
### `expense.html → Pengeluaran`
* Catat biaya operasional (sewa, listrik, dll).
* Upload bukti pengeluaran.
* Laporan pengeluaran bulanan.

### `accounting.html → Ringkasan Keuangan`
* Laporan laba rugi sederhana.
* Ringkasan pendapatan vs pengeluaran.
* Export laporan akuntansi.

---
# ⚫ **Release 7 → Manajemen SDM**
### `employee.html → Karyawan`
* Data pegawai (nama, jabatan, kontak).
* Gaji pokok & komisi penjualan.
* Status aktif/non-aktif.

### `attendance.html → Absensi`
* Input absensi manual / otomatis.
* Shift kerja (pagi, sore, malam).
* Laporan kehadiran.

---
# 🟤 **Release 8 → Integrasi Perangkat**
### `device.html → Integrasi Hardware`
* Printer struk.
* Barcode scanner.
* Timbangan digital.

### `payment.html → Payment Gateway`
* QRIS integrasi (BI Standard).
* E-wallet (OVO, GoPay, DANA, LinkAja).
* Kartu kredit/debit.

---

# 🔴 **Release 9 → Manajemen Restoran (Horeca Mode)**
### `menu.html → Menu Restoran`
* Manajemen menu (varian, addon).
* Set menu paket.
* Modifikasi pesanan (tambah topping, level pedas).

### `table.html → Meja & Reservasi`
* Layout meja restoran.
* Status meja (kosong, terisi, booking).
* Reservasi meja (online/offline).

---
# 🟢 **Release 10 → Analitik & AI Assistant**
### `analytics.html → Analitik Bisnis`
* Grafik tren penjualan.
* Produk terlaris & pelanggan top.
* Prediksi stok (AI-based).

### `ai-assistant.html → AI Assistant`
* Chatbot analisis laporan.
* Rekomendasi strategi bisnis.
* FAQ interaktif untuk kasir/admin.

---
# 🟡 **Release 11 → ERP Integration (Bridge)**
### `erp-bridge.html → ERP Bridge`
* API hub ke ERP penuh (Accounting, CRM, HRM, Inventory Advanced).
* Sinkronisasi data lintas modul.
* Dashboard ERP level (owner view).

---
