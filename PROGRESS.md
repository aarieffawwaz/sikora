# SIKORA — Progress Log

Recap status project per **2026-06-27/28**. Update file ini tiap sesi kerja baru biar AI/dev selanjutnya tau posisi project tanpa baca ulang seluruh git log.

## Status: MVP fungsional, demo flow lengkap, sudah meluas dari scope PRD awal

`npm run build` hijau. Dev server `npm run dev` (port 5173, ada `.claude/launch.json` utk Claude Preview tool, server name `"sikora"`).

## Struktur route (`src/App.tsx`, nav di `src/config/nav.ts`)

| Path | Page | Status |
|---|---|---|
| `/` | Dashboard | Selesai, verified match `reference/Main Dashboard.jpeg` |
| `/sinkronisasi` | Sinkronisasi Data | Selesai — tombol sync + progress animasi + data gerai |
| `/persediaan` | Persediaan & Rantai Pasok | Selesai — tabel produk + AI rec + dialog barang masuk/keluar |
| `/pos` | Transaksi POS | Selesai — cashier grid + cart + checkout, toggle online/offline |
| `/pembukuan` | Pembukuan Otomatis | Selesai — ledger otomatis dari setiap sale |
| `/keanggotaan` | Keanggotaan | Selesai (besar, ~1300 baris) — di luar PRD awal, lihat catatan di bawah |
| `/database-koperasi` | Koperasi (DatabaseKoperasi) | Selesai (~800 baris) — di luar PRD awal, lihat catatan di bawah |
| `/monitoring` | Monitoring | Selesai — peta + kesehatan operasional + status sync gerai |
| `/pengaturan`, `/bantuan` | Stub | Placeholder, belum dikerjakan |

## Engine inti (jangan disentuh tanpa paham — ini "jantung" app)

- `src/store/useSikoraStore.ts` — single Zustand store + `persist` (localStorage key `sikora-store`). Semua modul baca/tulis sini. Sale POS → stock turun → AI rec recompute → KPI/notif update reaktif. State: `coop`, `products`, `movements`, `transactions`, `ledger`, `cashBalance`, `notifications`, `isOnline`, `selectedProvinceId`, `sidebarCollapsed`, `mapFilter`.
- `src/lib/aiEngine.ts` — AI DSS rule-based: `coldStartVelocity()`, `effectiveVelocity()`, `severityOf()` (segera/perlu/aman/overstock), `recommendFor()`, `recommendations()`.
- `src/lib/assistant.ts` — scripted AI Assistant, intent-match pertanyaan demo → jawaban interpolasi data store live (bukan LLM call).
- `src/data/seed.ts` — data demo: koperasi, 10 produk (Beras Premium dst., tuned biar Beras=segera/Gula=perlu/Telur=aman), transaksi awal, ledger, notifikasi.
- `src/data/provinces.ts` — **data riil** 38 provinsi dari simkopdes.go.id (koperasi, NIB, NPWP, RAT, simpanan, volume transaksi) + `NATIONAL` totals. Dipakai di peta + dropdown wilayah.

## Yang sudah diverifikasi jalan di browser (preview tool)

- Dashboard penuh — KPI cards, status bar, peta, panel SIKORA AI, chart aktivitas, restock priority, health gauge, notifikasi, akses cepat.
- AI DSS hidup: Beras Premium → "Segera Restock 30kg", Gula Pasir → "Perlu Restock 12kg", Air Galon → "Overstock".
- SIKORA Assistant jawab pertanyaan demo pakai data live (contoh: "kenapa stok gula menipis?" → sisa 7kg, ~2/hari, habis 3.5 hari, rekomendasi 12kg).
- POS → Dashboard spine: jual 2 Beras → transaksi 5→6, stok 8→6, persist ke localStorage.
- Peta Leaflet real: 3 base layer (Satelit/Gelap/Jalan), GeoJSON 38 provinsi overlay, bubble count per provinsi pakai data riil Simkopdes, dropdown "Semua Wilayah" → flyTo + highlight provinsi terpilih.
- Hamburger menu collapse sidebar, asset logo/people/profile/robot AI sudah terpasang & ukuran disesuaikan.
- Dropdown z-index fix (`.leaflet-container { z-index: 0 }` di `index.css`) — dulu ketutup peta.

## Riwayat pekerjaan besar (lihat `git log` utk detail commit)

Urutan kasar (lama → baru):
1. Scaffold Vite+React+TS+Tailwind v4+shadcn, dashboard awal sesuai mockup.
2. Engine AI DSS + store + seed data + 5 halaman inti (Dashboard/Sinkronisasi/Persediaan/POS/Pembukuan).
3. Berbagai style pass: KPI card spacing, PageHeader 2-row, AssistantPanel height, map bubble size, dropdown interaktif, Akses Cepat label overflow.
4. Peta diganti dari SVG stylized → **Leaflet asli** + GeoJSON 38 provinsi (`ardian28/GeoJson-Indonesia-38-Provinsi`).
5. Data peta diganti dari dummy → **data riil Simkopdes** (`src/data/provinces.ts`), dropdown "Semua Wilayah" jadi fungsional (flyTo provinsi).
6. Asset brand (logo/AI bot/people/profile) diintegrasikan, hamburger menu collapse sidebar ditambah, KPI card margin dirapatkan, map bubble diseragamkan.
7. **Keanggotaan** — halaman besar: hierarki organisasi (org chart) + graph jejaring interaksi (force-directed, DOM-mutation 60fps, bezier edges, zoom/pan, dept hulls), filter lokasi cascading (provinsi/kabupaten/kelurahan), MessagingDrawer (chat ala LinkedIn, WhatsApp/Message button).
8. **DatabaseKoperasi** — direktori koperasi: peta gerai (Leaflet lagi, instance kedua), profil pengurus, potensi desa, search/filter.
9. `vercel.json` ditambah utk SPA routing saat deploy.

## TODO / belum dikerjakan

- [ ] `/pengaturan`, `/bantuan` masih stub kosong.
- [ ] Bundle JS besar (~1.14 MB, sebagian besar Leaflet+Recharts+2 GeoJSON fetch). Belum code-split. Pertimbangkan `dynamic import()` per halaman kalau mau optimasi sebelum demo.
- [ ] GeoJSON 38 provinsi di-fetch dari **raw.githubusercontent.com saat runtime** — butuh internet pas demo. Kalau venue demo no-wifi, **bundle file ini lokal** (`src/data/` atau `public/`) sebagai fallback.
- [ ] `DatabaseKoperasi.tsx` punya instance `MapContainer` Leaflet sendiri (terpisah dari `OperationsMap`) — cek duplikasi/konsistensi style kalau lanjut dikerjakan.
- [ ] Belum ada test otomatis (unit/e2e) — verifikasi sejauh ini manual via browser preview tool.
- [ ] Scope sudah melebar ke Pilar 2 (Keanggotaan) & Pilar 3 (DatabaseKoperasi/potensi desa) — kalau presentasi terbatas waktu, pertimbangkan fokus balik ke 5-step demo flow Pilar 1 (lihat `PRD.md` §4) biar cerita tetap fokus & kohesif sesuai catatan PRD asli.

## Cara lanjut kerja (untuk AI/dev baru)

1. Baca `PRD.md` dulu (requirement asli + keputusan locked).
2. Baca file ini (`PROGRESS.md`) buat tau apa yang udah jalan.
3. Cek `REFERENCES.md` buat link library/komponen/data source yang dipakai.
4. `npm install && npm run dev` → buka `localhost:5173`.
5. Jangan ubah struktur store/aiEngine tanpa baca isinya dulu — banyak komponen depend on shape data ini.
