# SIKORA — Sinergi Koperasi Raya

Product Requirements Document (recap, untuk handoff ke AI/dev lain).

## 1. Konteks

Hackathon **Digital Cooperatives Expo 2026** — Kementerian Koperasi RI × PEBS FEB Universitas Indonesia. Tema: modernisasi ekosistem perkoperasian nasional, fokus Pilar 1 — **Peningkatan Volume Usaha Koperasi** (solusi digital rantai pasok, pembukuan, transaksi KDKMP real-time).

**KDKMP** = Koperasi Desa/Kelurahan Merah Putih, program nasional masif (PMK No. 7/2026: 58% Dana Desa 2026 dialokasikan ke KDKMP; Inpres No. 17/2025 percepatan gerai/gudang). Masalah: gerai baru tidak punya riwayat transaksi, dan platform eksisting (**Simkopdes**, Kopdes Merah Putih Mobile) hanya administrasi + simpan-pinjam — tidak ada manajemen stok, POS, deteksi overstock/understock.

## 2. Produk

**SIKORA (Sinergi Koperasi Raya)** — *Smart Cooperative Operational Platform, Powered by AI Prediction Engine & Decision Support System (AI DSS)*.
Tagline: **"From Data to Decision. From Prediction to Action."**

Posisi: **melengkapi** Simkopdes (sinkronisasi data, bukan duplikasi/replace). Nama: Sinergi = kolaborasi dgn Simkopdes, Koperasi = domain, Raya = skala nasional KDKMP.

**Inovasi utama**: AI DSS bukan chatbot — mesin keputusan yang membaca data operasional (stok, transaksi, karakteristik koperasi) lalu menghasilkan rekomendasi actionable. Termasuk **cold-start demand prediction**: gerai tanpa riwayat transaksi tetap dapat rekomendasi stok awal, dihitung dari jenis komoditas + jumlah anggota + karakteristik wilayah.

## 3. Modul (PRD asli)

1. **Sinkronisasi Data** — tarik profil koperasi + gerai dari Simkopdes, no re-input.
2. **Persediaan & Rantai Pasok** — catat barang masuk/keluar, real-time stock, AI Prediction Engine kasih rekomendasi restock + deteksi overstock/understock.
3. **Transaksi POS** — kasir sederhana, **offline-first** (transaksi tetap jalan tanpa internet, sync otomatis saat online kembali). Sale otomatis: kurangi stok, tambah kas, catat pembukuan.
4. **Pembukuan Otomatis** — tiap transaksi/perubahan stok auto-generate ringkasan kas harian, riwayat, laporan. No manual bookkeeping.
5. **SIKORA Assistant** — user tanya ("Kenapa beras perlu direstock?"), AI jawab pakai data historis riil koperasi.

## 4. Demo flow (kunci penjurian)

Catatan asli PRD: *"jangan kejar AI kompleks, fokus alur yang hidup & terintegrasi."* Urutan wajib demo:

1. Sinkronisasi Data → klik Sinkronisasi → data koperasi muncul.
2. Barang Masuk → tambah stok Beras Premium → KPI persediaan dashboard langsung berubah.
3. POS → transaksi penjualan → stok berkurang, kas bertambah.
4. AI Decision Support → sistem auto-tampilkan rekomendasi restock (stok menipis).
5. SIKORA Assistant → tanya "Mengapa beras perlu direstock?" → AI jelasin pakai data.

Cerita ke juri: operasional → data → AI analisis → rekomendasi → keputusan. Satu state terhubung, bukan fitur lepas-lepas.

## 5. Keputusan teknis (locked)

- **Stack**: Vite + React 19 + TypeScript, **bukan** Next.js (no real backend, semua mock di-browser, Vite lebih cepat utk hackathon).
- **UI kit**: shadcn/ui (style `new-york`, base color `slate`) + Tailwind v4 + lucide-react icons.
- **State**: Zustand + `persist` (localStorage) — single store = "jantung" app, semua modul baca/tulis dari sini supaya efek domino kerasa hidup.
- **AI Assistant**: **scripted/rule-based**, bukan LLM call — interpolasi data store live supaya jawaban selalu akurat & zero risk saat demo (no network dependency, no API key).
- **AI DSS engine**: deterministic rule-based (lihat `src/lib/aiEngine.ts`), bukan ML model — cukup utk cerita demo, sesuai catatan PRD "jangan kejar AI kompleks".
- **Map**: Leaflet + react-leaflet asli (bukan SVG palsu) — base layer Satelit/Gelap/Jalan switchable, overlay GeoJSON 38 provinsi Indonesia.
- **Data numerik**: nomor KPI map nasional diambil **riil** dari `simkopdes.go.id/pers/dashboard` (snapshot 27/06/2026) — lihat `src/data/provinces.ts`.
- **Bahasa**: semua UI Bahasa Indonesia.
- **Deploy**: Vercel (ada `vercel.json` SPA rewrite rule).

## 6. Yang sudah dibangun vs PRD asli

Sesuai PRD: Dashboard, Sinkronisasi, Persediaan, POS, Pembukuan, SIKORA Assistant — **semua ada**.

**Tambahan di luar PRD asli** (扩展 selama development, lihat `PROGRESS.md` utk detail):
- **Keanggotaan** — modul keanggotaan digital (Pilar 2: transparansi tata gelola, hierarki organisasi + graph jejaring interaksi, profil simpanan anggota).
- **Database Koperasi** — direktori/database koperasi (peta gerai per koperasi, profil, potensi desa) — relevan ke Pilar 3 (Pemanfaatan Potensi Ekonomi Desa).
- **Messaging Drawer** — chat internal ala LinkedIn (WhatsApp/Message button per anggota).

Ini artinya scope project sudah melebar dari Pilar 1 saja ke menyentuh Pilar 2 & 3 juga (lihat brief hackathon awal — 3 pilar: Volume Usaha, Keterlibatan Masyarakat, Potensi Ekonomi Desa). Kalau lanjut, pertimbangkan apakah mau full 3-pilar play atau fokus balik ke Pilar 1.

## 7. Referensi desain

- `reference/Main Dashboard.jpeg` — mockup dashboard asli (sumber kebenaran visual: sidebar navy, KPI cards, peta operasional, panel SIKORA AI, dst). Dashboard kode sudah verified match.
- `assets/` (Logo.png, AI Bot.png, People.png, Profile.jpeg) — aset asli brand, sudah diintegrasikan (lihat `src/assets/`, sudah di-trim+resize).
- Real data source: `simkopdes.go.id/pers/dashboard` (screenshot dipakai user, datanya dipindah ke `src/data/provinces.ts`).

Detail lengkap referensi/library lain → `REFERENCES.md`.
