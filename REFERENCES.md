# SIKORA — References

Kumpulan link, source data, dan dokumen rujukan. Tujuan: AI/dev baru bisa cari sumber kebenaran tanpa nebak.

## Dokumen asli (tidak di repo, ada di Downloads user)

- `Product Requirements Document - SIKORA.pdf` — PRD asli (gambar Grand Design, dll).
- `Product Discovery.md` — problem statement, solusi, deskripsi 4 modul, alur demo hackathon yang disarankan.
- Brief hackathon: **Digital Cooperatives Expo 2026**, Kementerian Koperasi RI × PEBS FEB UI. 3 pilar: (1) Peningkatan Volume Usaha Koperasi — fokus SIKORA, (2) Keterlibatan Masyarakat dalam Berkoperasi, (3) Pemanfaatan Potensi Ekonomi Desa.

Isi requirement lengkap sudah dirangkum di `PRD.md` — kalau butuh detail kata-per-kata, minta user re-share file PDF/MD aslinya.

## Asset desain (di repo)

- `reference/Main Dashboard.jpeg` — mockup dashboard sumber kebenaran visual.
- `assets/Logo.png`, `assets/AI Bot.png`, `assets/People.png`, `assets/Profile.jpeg` — source asli brand (sudah di-trim transparent-bbox + resize, hasil dipakai di `src/assets/`).

## Data riil eksternal

- **Simkopdes dashboard statistik**: `https://simkopdes.go.id/pers/dashboard` — sumber angka KPI nasional + 38 provinsi (Total Koperasi 83.383, NIB 60.759, NPWP 80.978, Simpanan Pokok/Wajib, dst). Snapshot diambil **27/06/2026**, di-hardcode ke `src/data/provinces.ts` (`PROVINCES[]` + `NATIONAL`). **Catatan**: data ini statis/snapshot, bukan live-fetch — kalau mau live, perlu API resmi Simkopdes (belum ada akses publik yang diketahui).

## GeoJSON Indonesia (peta provinsi)

Dipakai: **ardian28/GeoJson-Indonesia-38-Provinsi**
URL raw yang dipakai di kode (`src/components/shared/OperationsMap.tsx`):
```
https://raw.githubusercontent.com/ardian28/GeoJson-Indonesia-38-Provinsi/main/Provinsi/38%20Provinsi%20Indonesia%20-%20Provinsi.json
```
- Property key polygon: `PROVINSI` (Title Case, exact match ke `Province.name` di `provinces.ts`), `KODE_PROV`.
- 38 provinsi (post-pemekaran Papua 2022) — dipilih krn lengkap & up to date.
- **Fetch runtime**, tidak dibundle. Risiko: butuh internet pas demo. Kalau demo offline, download file ini ke `public/geo/provinsi.json` dan ganti `GEOJSON_URL` jadi path lokal.

Alternatif yang dipertimbangkan tapi tidak dipakai:
- `denyherianto/indonesia-geojson-topojson-maps-with-38-provinces` — juga 38 provinsi, valid, tidak dipilih krn ardian28 single-file lebih simple.
- `superpikar/indonesia-geojson` — cuma **34 provinsi** (outdated, sebelum pemekaran Papua).
- `JfrAziz/indonesia-district` — level kabupaten/kota, terlalu detail/berat utk peta nasional.

## Library utama

| Library | Versi | Fungsi |
|---|---|---|
| `react` / `react-dom` | ^19.2.7 | Core |
| `vite` | ^8.1.0 | Build tool (bukan Next.js — lihat `PRD.md` §5) |
| `typescript` | ~6.0.2 | Type safety |
| `tailwindcss` + `@tailwindcss/vite` | ^4.3.1 | Styling (v4, pakai `@theme inline` di `src/index.css`, **bukan** `tailwind.config.js`) |
| `tw-animate-css` | ^1.4.0 | Animasi util Tailwind |
| `radix-ui` | ^1.6.0 | Primitive headless utk shadcn components |
| `lucide-react` | ^1.21.0 | Icon set |
| `zustand` | ^5.0.14 | State management + `persist` middleware (localStorage) |
| `react-router-dom` | ^7.18.0 | Routing |
| `recharts` | ^3.9.0 | Chart (line chart aktivitas, donut health gauge) |
| `framer-motion` | ^12.42.0 | Animasi (CountUp, Reveal on-scroll, dll) |
| `leaflet` + `react-leaflet` | ^1.9.4 / ^5.0.0 | Peta interaktif real (bukan SVG palsu) |
| `sonner` | ^2.0.7 | Toast notification |
| `class-variance-authority`, `clsx`, `tailwind-merge` | — | Utility shadcn standar (`cn()` di `src/lib/utils.ts`) |
| `next-themes` | ^0.4.6 | Terpasang (kemungkinan dependency shadcn component tertentu — cek pemakaian aktual sebelum andalkan dark mode) |

Full lockfile → `package.json` di root.

## shadcn/ui — komponen terpasang

Config: `components.json` — style **`new-york`**, base color **`slate`**, css vars di `src/index.css`, icon library `lucide`. Path alias `@/*` → `./src/*` (lihat `tsconfig.app.json`, `vite.config.ts`).

Terpasang (`src/components/ui/`): `avatar`, `badge`, `button`, `card`, `dialog`, `dropdown-menu`, `input`, `label`, `progress`, `scroll-area`, `select`, `separator`, `sheet`, `sonner`, `table`, `tabs`, `tooltip`.

Tambah komponen baru: `npx shadcn@latest add <nama>` (jangan edit manual file di `ui/` kecuali emergency — lebih baik re-run CLI kalau perlu versi shadcn terbaru).

Referensi shadcn:
- Docs: https://ui.shadcn.com/docs/components
- Blocks (dipakai sebagai inspirasi awal dashboard layout): https://ui.shadcn.com/blocks

## Konvensi kode (biar konsisten kalau lanjut)

- Semua teks UI **Bahasa Indonesia**.
- Warna semantic: hijau = positif/Aman, kuning/amber = Perlu Restock/Overstock, merah = Segera Restock/Understock, ungu = AI.
- Card pattern: `SectionCard` (`src/components/shared/SectionCard.tsx`) dipakai di semua halaman biar konsisten — jangan buat card custom baru kalau `SectionCard` cukup.
- Page baru ikut pola: `PageHeader` di atas + `Reveal` wrapper per section (animasi fade-in on scroll) + grid `SectionCard`.
- Format angka/uang: pakai helper di `src/lib/format.ts` (`rupiah`, `rupiahCompact`, `angka`, `waktuLalu`, `uid`) — jangan format manual ulang.

## Deploy

- Target: **Vercel**. `vercel.json` sudah ada rewrite rule SPA (`/(.*) → /index.html`) supaya client-side routing (React Router) gak 404 di refresh.
- Build command: `npm run build` (= `tsc -b && vite build`). Output: `dist/`.
