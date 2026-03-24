# SenangPOS - Sistem POS Pasar Tani

Sistem Point of Sale (POS) responsif untuk penjual Pasar Tani. Dibangunkan dengan React dan Supabase untuk pengurusan jualan harian dan menu.

## Ciri-ciri Utama

- **POS Interface** - Antara muka mesra pengguna untuk mengambil pesanan
- **Menu Pasar Tani** - Nasi lemak, laksa Penang, laksa Johor, ayam laksa, nasi ayam goreng berempah, dan lain-lain
- **Tambahan (Add-ons)** - Telur goreng, telur rebus, extra ayam, sambal extra
- **Pengurusan Stok** - Pantau stok dan amaran stok rendah
- **Dashboard Jualan** - Visualisasi trend jualan dan item terlaris
- **Sejarah Pesanan** - Rekod semua transaksi
- **Pembayaran** - Tunai dan QR Pay
- **Real-time Sync** - Integrasi Supabase untuk data real-time

## Mula Menggunakan

### 1. Install Dependencies

```bash
npm install
```

### 2. Setup Supabase (Optional)

Untuk menggunakan database real-time:

1. Buat projek di [Supabase](https://supabase.com)
2. Jalankan SQL schema di `supabase/schema.sql`
3. Copy `.env.example` ke `.env.local`:

```bash
cp .env.example .env.local
```

4. Masukkan credentials Supabase:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### 3. Run Development Server

```bash
npm run dev
```

## Mode Operasi

- **Local Mode** - Tanpa Supabase, data disimpan dalam memory (hilang bila refresh)
- **Supabase Mode** - Data disimpan dalam database, sync real-time

## Menu Default

### Hidangan Utama
- Nasi Lemak Ayam - RM7.00
- Nasi Lemak Telur - RM5.00
- Nasi Ayam Goreng Berempah - RM7.00
- Laksa Penang - RM6.00
- Laksa Johor - RM6.00
- Ayam Laksa - RM6.00
- Mee Kari - RM5.00
- Lontong Kering - RM6.00
- Soto - RM6.00

### Tambahan
- Telur Goreng - RM1.00
- Telur Rebus - RM1.00
- Extra Ayam - RM4.00
- Extra Daging - RM4.00
- Sambal Extra - RM0.50
- Keropok - RM1.00

## Tech Stack

- React 19
- Tailwind CSS
- Recharts (charts)
- Lucide React (icons)
- Supabase (database)
