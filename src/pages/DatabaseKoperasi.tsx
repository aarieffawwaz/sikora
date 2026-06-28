import { useState, useEffect } from "react"
import { AnimatePresence, motion } from "framer-motion"
import {
  Search,
  MapPin,
  Users,
  Building2,
  ChevronRight,
  X,
  ExternalLink,
  FileText,
  TrendingUp,
  ShieldCheck,
  Store,
  Navigation,
  LayoutGrid,
  List,
  Map,
} from "lucide-react"
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet"
import L from "leaflet"
import "leaflet/dist/leaflet.css"
import { PageHeader } from "@/components/layout/PageHeader"
import { SectionCard } from "@/components/shared/SectionCard"
import { Reveal } from "@/components/shared/Reveal"
import { cn } from "@/lib/utils"

// ─── Types ────────────────────────────────────────────────────────────────────

interface Pengurus {
  nama: string
  jabatan: string
  avatar?: string
}


interface PotensiRow {
  potensi: string
  luasArea: string
  volume: string
  sdm: number
  nilaiPotensi: string
}

interface Koperasi {
  id: string
  nama: string
  slug: string
  nomorInduk: string
  skAhu: string
  alamat: string
  kelurahan: string
  kecamatan: string
  kabupaten: string
  provinsi: string
  lat: number
  lng: number
  status: "Aktif" | "Proses" | "Belum Aktif"
  pendudukLaki: number
  pendudukPerempuan: number
  anggotaLaki: number
  anggotaPerempuan: number
  pengurus: Pengurus[]
  pengawas: Pengurus[]
  potensiDesa: PotensiRow[]
  unitUsaha: string[]
  foto: string
}

// ─── Sample Data ──────────────────────────────────────────────────────────────

const KOPERASI_DATA: Koperasi[] = [
  {
    id: "k1",
    nama: "Koperasi Desa Merah Putih Ciporeat",
    slug: "ciporeat-kecamatan-cilengkrang",
    nomorInduk: "810*******001",
    skAhu: "AHU-0012345.AH.01.29.TAHUN 2025",
    alamat: "Jl. Raya Ciporeat No. 12, Ciporeat, Cilengkrang, Kab. Bandung, Jawa Barat",
    kelurahan: "Ciporeat",
    kecamatan: "Cilengkrang",
    kabupaten: "Kab. Bandung",
    provinsi: "Jawa Barat",
    lat: -6.9175,
    lng: 107.7304,
    status: "Aktif",
    pendudukLaki: 1240,
    pendudukPerempuan: 1185,
    anggotaLaki: 320,
    anggotaPerempuan: 280,
    pengurus: [
      { nama: "Ahmad Fauzi", jabatan: "Ketua Koperasi" },
      { nama: "Dewi Rahayu", jabatan: "Wakil Ketua Bidang Anggota" },
      { nama: "Hendra Gunawan", jabatan: "Wakil Ketua Bidang Usaha" },
      { nama: "Siti Aminah", jabatan: "Sekretaris" },
      { nama: "Ridwan Maulana", jabatan: "Bendahara" },
    ],
    pengawas: [
      { nama: "Ujang Suryana", jabatan: "Ketua Pengawas" },
      { nama: "Tati Sumiati", jabatan: "Anggota Pengawas" },
      { nama: "Asep Kurniawan", jabatan: "Anggota Pengawas" },
    ],
    potensiDesa: [
      { potensi: "Pertanian Padi", luasArea: "125 Ha", volume: "625 Ton/Th", sdm: 450, nilaiPotensi: "Rp 3,1 M" },
      { potensi: "Sayuran Organik", luasArea: "45 Ha", volume: "180 Ton/Th", sdm: 120, nilaiPotensi: "Rp 1,4 M" },
      { potensi: "Peternakan Sapi", luasArea: "20 Ha", volume: "50 Ekor", sdm: 40, nilaiPotensi: "Rp 750 Jt" },
    ],
    unitUsaha: ["Simpan Pinjam", "Agribisnis", "Klinik Desa", "Sembako"],
    foto: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&q=80",
  },
  {
    id: "k2",
    nama: "Koperasi Desa Merah Putih Cilengkrang",
    slug: "cilengkrang-kecamatan-cilengkrang",
    nomorInduk: "810*******002",
    skAhu: "AHU-0015678.AH.01.29.TAHUN 2025",
    alamat: "Jl. Desa Cilengkrang No. 5, Cilengkrang, Kab. Bandung, Jawa Barat",
    kelurahan: "Cilengkrang",
    kecamatan: "Cilengkrang",
    kabupaten: "Kab. Bandung",
    provinsi: "Jawa Barat",
    lat: -6.9320,
    lng: 107.7450,
    status: "Aktif",
    pendudukLaki: 980,
    pendudukPerempuan: 945,
    anggotaLaki: 210,
    anggotaPerempuan: 195,
    pengurus: [
      { nama: "Dedi Supriatna", jabatan: "Ketua Koperasi" },
      { nama: "Neng Komariah", jabatan: "Wakil Ketua Bidang Anggota" },
      { nama: "Budi Hermawan", jabatan: "Wakil Ketua Bidang Usaha" },
      { nama: "Rini Wulandari", jabatan: "Sekretaris" },
      { nama: "Agus Salim", jabatan: "Bendahara" },
    ],
    pengawas: [
      { nama: "Cecep Suhendar", jabatan: "Ketua Pengawas" },
      { nama: "Yayah Rokayah", jabatan: "Anggota Pengawas" },
    ],
    potensiDesa: [
      { potensi: "Perkebunan Teh", luasArea: "200 Ha", volume: "400 Ton/Th", sdm: 300, nilaiPotensi: "Rp 4,8 M" },
      { potensi: "Wisata Alam", luasArea: "15 Ha", volume: "12.000 Wisatawan/Th", sdm: 80, nilaiPotensi: "Rp 600 Jt" },
    ],
    unitUsaha: ["Simpan Pinjam", "Wisata Desa", "Olahan Teh"],
    foto: "https://images.unsplash.com/photo-1586348943529-beaae6c28db9?w=800&q=80",
  },
  {
    id: "k3",
    nama: "Koperasi Desa Merah Putih Bandunggede",
    slug: "bandunggede-kecamatan-kedu",
    nomorInduk: "810*******003",
    skAhu: "AHU-0018901.AH.01.29.TAHUN 2025",
    alamat: "Jl. Bandunggede Raya No. 1, Bandunggede, Kedu, Kab. Temanggung, Jawa Tengah",
    kelurahan: "Bandunggede",
    kecamatan: "Kedu",
    kabupaten: "Kab. Temanggung",
    provinsi: "Jawa Tengah",
    lat: -7.3567,
    lng: 110.0892,
    status: "Aktif",
    pendudukLaki: 1540,
    pendudukPerempuan: 1490,
    anggotaLaki: 480,
    anggotaPerempuan: 440,
    pengurus: [
      { nama: "Soegiman Pranoto", jabatan: "Ketua Koperasi" },
      { nama: "Sri Hastuti", jabatan: "Wakil Ketua Bidang Anggota" },
      { nama: "Bambang Setiawan", jabatan: "Wakil Ketua Bidang Usaha" },
      { nama: "Wahyu Ningsih", jabatan: "Sekretaris" },
      { nama: "Mulyadi Susanto", jabatan: "Bendahara" },
    ],
    pengawas: [
      { nama: "Parno Widodo", jabatan: "Ketua Pengawas" },
      { nama: "Sunarti", jabatan: "Anggota Pengawas" },
      { nama: "Subagyo", jabatan: "Anggota Pengawas" },
    ],
    potensiDesa: [
      { potensi: "Tembakau", luasArea: "310 Ha", volume: "620 Ton/Th", sdm: 800, nilaiPotensi: "Rp 9,3 M" },
      { potensi: "Kopi Robusta", luasArea: "80 Ha", volume: "160 Ton/Th", sdm: 200, nilaiPotensi: "Rp 2,4 M" },
    ],
    unitUsaha: ["Simpan Pinjam", "Agribisnis Tembakau", "Gudang Logistik", "Klinik Desa"],
    foto: "https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=800&q=80",
  },
  {
    id: "k4",
    nama: "Koperasi Desa Merah Putih Negeri Administratif Jakarta Baru",
    slug: "negeri-administratif-jakarta-baru",
    nomorInduk: "810*******004",
    skAhu: "AHU-0024820.AH.01.29.TAHUN 2025",
    alamat: "Jalan Lintas Seram Negeri Administratif Jakarta Baru, Jakarta Baru, Bula Barat, Kab. Seram Bagian Timur, Maluku",
    kelurahan: "Jakarta Baru",
    kecamatan: "Bula Barat",
    kabupaten: "Kab. Seram Bagian Timur",
    provinsi: "Maluku",
    lat: -3.0316,
    lng: 130.2604,
    status: "Proses",
    pendudukLaki: 514,
    pendudukPerempuan: 495,
    anggotaLaki: 0,
    anggotaPerempuan: 0,
    pengurus: [
      { nama: "Roni Susanto", jabatan: "Ketua Koperasi" },
      { nama: "Wa Mei", jabatan: "Wakil Ketua Bidang Anggota" },
      { nama: "Lalu Wirie Hadi Kusuma", jabatan: "Wakil Ketua Bidang Usaha" },
      { nama: "Irwan Harahap", jabatan: "Sekretaris" },
      { nama: "Muhammad Safrudin", jabatan: "Bendahara" },
    ],
    pengawas: [
      { nama: "Dahlan Husein", jabatan: "Ketua Pengawas" },
      { nama: "Suhardin Saidu", jabatan: "Anggota Pengawas" },
      { nama: "Tri Ongko", jabatan: "Anggota Pengawas" },
    ],
    potensiDesa: [],
    unitUsaha: [],
    foto: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80",
  },
  {
    id: "k5",
    nama: "Koperasi Desa Merah Putih Sukasari",
    slug: "sukasari-kecamatan-sukasari",
    nomorInduk: "810*******005",
    skAhu: "AHU-0031122.AH.01.29.TAHUN 2025",
    alamat: "Jl. Raya Sukasari No. 8, Sukasari, Kab. Purwakarta, Jawa Barat",
    kelurahan: "Sukasari",
    kecamatan: "Sukasari",
    kabupaten: "Kab. Purwakarta",
    provinsi: "Jawa Barat",
    lat: -6.5571,
    lng: 107.4503,
    status: "Aktif",
    pendudukLaki: 2100,
    pendudukPerempuan: 2050,
    anggotaLaki: 680,
    anggotaPerempuan: 620,
    pengurus: [
      { nama: "Tatang Hidayat", jabatan: "Ketua Koperasi" },
      { nama: "Yanti Kusumawati", jabatan: "Wakil Ketua Bidang Anggota" },
      { nama: "Doni Prasetyo", jabatan: "Wakil Ketua Bidang Usaha" },
      { nama: "Fitriani", jabatan: "Sekretaris" },
      { nama: "Iwan Setiawan", jabatan: "Bendahara" },
    ],
    pengawas: [
      { nama: "Haji Rohim", jabatan: "Ketua Pengawas" },
      { nama: "Ina Marlina", jabatan: "Anggota Pengawas" },
      { nama: "Dadan Hamdani", jabatan: "Anggota Pengawas" },
    ],
    potensiDesa: [
      { potensi: "Pertanian Ubi Jalar", luasArea: "180 Ha", volume: "900 Ton/Th", sdm: 600, nilaiPotensi: "Rp 5,4 M" },
      { potensi: "Perikanan Darat", luasArea: "30 Ha", volume: "240 Ton/Th", sdm: 150, nilaiPotensi: "Rp 1,8 M" },
      { potensi: "Kerajinan Anyaman", luasArea: "-", volume: "5.000 Unit/Th", sdm: 200, nilaiPotensi: "Rp 750 Jt" },
    ],
    unitUsaha: ["Simpan Pinjam", "Agribisnis", "BUMDES Terintegrasi", "Klinik Desa", "Sembako"],
    foto: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=800&q=80",
  },
  {
    id: "k6",
    nama: "Koperasi Desa Merah Putih Tanjung Alam",
    slug: "tanjung-alam-kecamatan-tanjungpandan",
    nomorInduk: "810*******006",
    skAhu: "AHU-0041567.AH.01.29.TAHUN 2025",
    alamat: "Jl. Tanjung Alam No. 3, Tanjung Alam, Tanjungpandan, Kab. Belitung, Kepulauan Bangka Belitung",
    kelurahan: "Tanjung Alam",
    kecamatan: "Tanjungpandan",
    kabupaten: "Kab. Belitung",
    provinsi: "Kepulauan Bangka Belitung",
    lat: -2.7473,
    lng: 107.6334,
    status: "Belum Aktif",
    pendudukLaki: 730,
    pendudukPerempuan: 695,
    anggotaLaki: 0,
    anggotaPerempuan: 0,
    pengurus: [
      { nama: "Ruslan Efendi", jabatan: "Ketua Koperasi" },
      { nama: "Maryati", jabatan: "Sekretaris" },
      { nama: "Jupri Wahab", jabatan: "Bendahara" },
    ],
    pengawas: [
      { nama: "Zulkifli", jabatan: "Ketua Pengawas" },
    ],
    potensiDesa: [
      { potensi: "Wisata Pantai", luasArea: "5 Km", volume: "8.000 Wisatawan/Th", sdm: 100, nilaiPotensi: "Rp 400 Jt" },
      { potensi: "Perikanan Laut", luasArea: "-", volume: "300 Ton/Th", sdm: 250, nilaiPotensi: "Rp 2,1 M" },
    ],
    unitUsaha: [],
    foto: "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=800&q=80",
  },
]

const mapIcon = (isSelected: boolean) => L.divIcon({
  className: "",
  iconSize: [32, 32],
  iconAnchor: [16, 16],
  html: `<div style="width:32px;height:32px;display:flex;align-items:center;justify-content:center;border-radius:9999px;background:${isSelected ? '#025669' : '#fff'};color:${isSelected ? '#fff' : '#025669'};border:2px solid #025669;box-shadow:0 4px 6px -1px rgba(0,0,0,0.1);"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path></svg></div>`
})

// ─── Helper Components ────────────────────────────────────────────────────────

function MapUpdater({ data, selectedId }: { data: typeof KOPERASI_DATA, selectedId?: string | null }) {
  const map = useMap()
  
  useEffect(() => {
    if (selectedId) {
      const selectedKop = data.find(k => k.id === selectedId)
      if (selectedKop) {
        map.flyTo([selectedKop.lat, selectedKop.lng], 12, { duration: 1.2 })
      }
    } else if (data.length > 0) {
      const group = new L.FeatureGroup(data.map(k => L.marker([k.lat, k.lng])))
      map.flyToBounds(group.getBounds(), { padding: [50, 50], duration: 1.2, maxZoom: 6 })
    }
  }, [data, selectedId, map])

  return null
}

const STATUS_STYLE: Record<string, string> = {
  Aktif: "bg-emerald-100 text-emerald-700 ring-emerald-200",
  Proses: "bg-amber-100 text-amber-700 ring-amber-200",
  "Belum Aktif": "bg-slate-100 text-slate-500 ring-slate-200",
}

function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1",
        STATUS_STYLE[status] ?? "bg-slate-100 text-slate-500 ring-slate-200",
      )}
    >
      {status}
    </span>
  )
}

function CircleProgress({ value, max, color, label, sub }: { value: number; max: number; color: string; label: string; sub: string }) {
  const pct = max > 0 ? Math.min(100, (value / max) * 100) : 0
  const r = 45
  const circ = 2 * Math.PI * r
  const offset = circ - (pct / 100) * circ
  return (
    <div className="flex flex-col items-center gap-2">
      <svg viewBox="0 0 100 100" className="size-24" role="progressbar" aria-valuenow={pct}>
        <circle cx="50" cy="50" r={r} fill="none" stroke="#e5e7eb" strokeWidth="10" />
        <circle
          cx="50" cy="50" r={r} fill="none"
          stroke={color} strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={`${circ}`}
          strokeDashoffset={offset}
          transform="rotate(-90 50 50)"
          style={{ transition: "stroke-dashoffset 0.8s ease" }}
        />
        <text x="50" y="50" textAnchor="middle" dy="0.35em" className="text-xs" fontSize="13" fontWeight="600" fill="#374151">
          {pct.toFixed(1)}%
        </text>
      </svg>
      <div className="text-center text-xs leading-tight">
        <p className="font-semibold text-slate-700">{label}</p>
        <p className="text-slate-400">{sub}</p>
      </div>
    </div>
  )
}

function AvatarCircle({ nama, jabatan }: { nama: string; jabatan: string }) {
  const initials = nama.split(" ").slice(0, 2).map(w => w[0]).join("").toUpperCase()
  const hue = nama.charCodeAt(0) * 137 % 360
  return (
    <div className="flex flex-col items-center gap-2 text-center">
      <div
        className="size-16 md:size-20 rounded-full flex items-center justify-center text-white text-lg font-bold shadow-md ring-2 ring-white"
        style={{ background: `hsl(${hue},55%,48%)` }}
      >
        {initials}
      </div>
      <div>
        <p className="text-xs font-semibold text-slate-800 leading-snug max-w-[100px]">{nama}</p>
        <p className="text-[10px] text-slate-400 max-w-[100px] leading-tight">{jabatan}</p>
      </div>
    </div>
  )
}

// ─── Detail Panel ─────────────────────────────────────────────────────────────

function KoperasiDetail({ kop, onClose }: { kop: Koperasi; onClose: () => void }) {
  const totalPenduduk = kop.pendudukLaki + kop.pendudukPerempuan
  const totalAnggota = kop.anggotaLaki + kop.anggotaPerempuan

  return (
    <div className="flex flex-col h-full overflow-y-auto">
      {/* Hero */}
      <div className="relative h-52 shrink-0 overflow-hidden">
        <img
          src={kop.foto}
          alt={`Foto ${kop.nama}`}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#28CCE9]/80 to-[#025669]/90" />
        <button
          onClick={onClose}
          className="absolute top-3 right-3 flex size-8 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-sm hover:bg-white/40 transition-colors"
        >
          <X className="size-4" />
        </button>
        <div className="absolute inset-x-0 bottom-0 px-5 pb-4 text-white">
          <div className="flex items-start gap-2">
            <div className="flex-1">
              <p className="text-[10px] font-medium uppercase tracking-wider text-white/70 mb-0.5">
                🇮🇩 Koperasi Desa Merah Putih
              </p>
              <h2 className="text-base font-bold leading-snug drop-shadow">{kop.nama}</h2>
            </div>
            <StatusBadge status={kop.status} />
          </div>
        </div>
      </div>

      {/* Info strips */}
      <div className="bg-white border-b border-slate-100 px-5 py-3 space-y-1.5 text-xs">
        <div className="flex items-start gap-2">
          <FileText className="mt-0.5 size-3.5 shrink-0 text-[#d1232a]" />
          <div>
            <span className="font-semibold text-slate-700">Nomor Induk Koperasi:</span>{" "}
            <span className="text-slate-500">{kop.nomorInduk}</span>
          </div>
        </div>
        <div className="flex items-start gap-2">
          <ShieldCheck className="mt-0.5 size-3.5 shrink-0 text-[#d1232a]" />
          <div>
            <span className="font-semibold text-slate-700">SK AHU:</span>{" "}
            <span className="text-slate-500">{kop.skAhu}</span>
          </div>
        </div>
        <div className="flex items-start gap-2">
          <MapPin className="mt-0.5 size-3.5 shrink-0 text-[#d1232a]" />
          <span className="text-slate-500">{kop.alamat}</span>
        </div>
      </div>

      <div className="flex-1 p-5 space-y-6">
        {/* Tentang */}
        <section>
          <h3 className="text-sm font-bold text-[#d1232a] mb-2">Tentang Koperasi</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            {kop.nama} merupakan Koperasi Desa/Kelurahan Merah Putih yang berlokasi di{" "}
            <strong>{kop.kelurahan}</strong>, Kecamatan <strong>{kop.kecamatan}</strong>,{" "}
            <strong>{kop.kabupaten}</strong>, Provinsi <strong>{kop.provinsi}</strong>.
            Koperasi ini dibentuk berdasarkan program nasional Koperasi Desa Merah Putih sebagai
            pilar ekonomi kerakyatan yang dikelola bersama oleh warga desa.
          </p>
        </section>

        {/* Potensi Desa */}
        <section>
          <h3 className="text-sm font-bold text-[#d1232a] mb-3">Potensi Desa</h3>
          {/* Penduduk cards */}
          <div className="grid grid-cols-3 gap-2 mb-3">
            {[
              { label: "Laki-Laki", value: kop.pendudukLaki, icon: "👨", color: "bg-blue-50 text-blue-700" },
              { label: "Perempuan", value: kop.pendudukPerempuan, icon: "👩", color: "bg-pink-50 text-pink-700" },
              { label: "Total", value: totalPenduduk, icon: "👥", color: "bg-slate-50 text-slate-700" },
            ].map((c) => (
              <div key={c.label} className={cn("rounded-xl p-3 text-center", c.color)}>
                <div className="text-xl mb-1">{c.icon}</div>
                <p className="text-xs font-medium opacity-80">{c.label}</p>
                <p className="text-sm font-bold">{c.value.toLocaleString("id-ID")}</p>
                <p className="text-[10px] opacity-60">Penduduk</p>
              </div>
            ))}
          </div>

          {/* Potensi table */}
          {kop.potensiDesa.length > 0 ? (
            <div className="overflow-x-auto rounded-lg border border-slate-200">
              <table className="w-full text-xs">
                <thead className="bg-sky-100/70">
                  <tr>
                    {["Potensi", "Luas Area", "Volume", "SDM (jiwa)", "Nilai Potensi"].map((h) => (
                      <th key={h} className="px-3 py-2 text-left font-semibold text-slate-600 whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {kop.potensiDesa.map((row, i) => (
                    <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-slate-50/50"}>
                      <td className="px-3 py-2 font-medium text-slate-800">{row.potensi}</td>
                      <td className="px-3 py-2 text-slate-500">{row.luasArea}</td>
                      <td className="px-3 py-2 text-slate-500">{row.volume}</td>
                      <td className="px-3 py-2 text-slate-500">{row.sdm.toLocaleString("id-ID")}</td>
                      <td className="px-3 py-2 font-semibold text-emerald-700">{row.nilaiPotensi}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-xs text-slate-400 italic text-center py-4">Belum ada data potensi desa</p>
          )}
        </section>

        {/* Anggota Koperasi */}
        <section>
          <h3 className="text-sm font-bold text-[#d1232a] mb-3">Anggota Koperasi</h3>
          <div className="flex justify-around py-2">
            <CircleProgress
              value={kop.anggotaLaki} max={kop.pendudukLaki}
              color="#025669" label="Laki-Laki" sub={`${kop.anggotaLaki} Anggota`}
            />
            <CircleProgress
              value={kop.anggotaPerempuan} max={kop.pendudukPerempuan}
              color="#8B9E3B" label="Perempuan" sub={`${kop.anggotaPerempuan} Anggota`}
            />
            <CircleProgress
              value={totalAnggota} max={totalPenduduk}
              color="#cf5650" label="Total" sub={`${totalAnggota} Anggota`}
            />
          </div>
        </section>

        {/* Pengurus */}
        <section>
          <h3 className="text-sm font-bold text-[#d1232a] mb-3">Struktur Pengurus</h3>
          <div className="flex flex-wrap gap-4 justify-center">
            {kop.pengurus.map((p, i) => (
              <AvatarCircle key={i} nama={p.nama} jabatan={p.jabatan} />
            ))}
          </div>
        </section>

        {/* Pengawas */}
        {kop.pengawas.length > 0 && (
          <section>
            <h3 className="text-sm font-bold text-[#d1232a] mb-3">Struktur Pengawas</h3>
            <div className="flex flex-wrap gap-4 justify-center">
              {kop.pengawas.map((p, i) => (
                <AvatarCircle key={i} nama={p.nama} jabatan={p.jabatan} />
              ))}
            </div>
          </section>
        )}

        {/* Unit Usaha */}
        <section>
          <h3 className="text-sm font-bold text-[#d1232a] mb-3">Unit Usaha</h3>
          {kop.unitUsaha.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {kop.unitUsaha.map((u, i) => (
                <span key={i} className="inline-flex items-center gap-1.5 rounded-full bg-[#025669]/10 px-3 py-1 text-xs font-semibold text-[#025669]">
                  <Store className="size-3" /> {u}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-400 italic text-center py-4">Belum ada unit usaha</p>
          )}
        </section>

        {/* Lokasi */}
        <section>
          <h3 className="text-sm font-bold text-[#d1232a] mb-3">Lokasi</h3>
          <div className="rounded-xl overflow-hidden border border-slate-200 shadow-sm">
            <iframe
              title={`Lokasi ${kop.nama}`}
              width="100%"
              height="200"
              src={`https://www.google.com/maps?q=${kop.lat},${kop.lng}&z=14&output=embed`}
              className="pointer-events-none"
            />
          </div>
          <a
            href={`https://www.google.com/maps?q=${kop.lat},${kop.lng}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 inline-flex items-center gap-1.5 text-xs text-[#025669] font-medium hover:underline"
          >
            <Navigation className="size-3" /> Buka di Google Maps <ExternalLink className="size-3" />
          </a>
        </section>
      </div>
    </div>
  )
}

// ─── Card ─────────────────────────────────────────────────────────────────────

function KoperasiCard({ kop, onClick }: { kop: Koperasi; onClick: () => void }) {
  const totalAnggota = kop.anggotaLaki + kop.anggotaPerempuan
  const totalPenduduk = kop.pendudukLaki + kop.pendudukPerempuan
  return (
    <button
      onClick={onClick}
      className="group w-full text-left rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md hover:border-[#025669]/30 transition-all duration-200 overflow-hidden flex flex-col"
    >
      <div className="relative h-36 overflow-hidden">
        <img src={kop.foto} alt={kop.nama} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        <div className="absolute bottom-2 left-3 right-3 flex items-end justify-between">
          <StatusBadge status={kop.status} />
          <span className="text-white text-[10px] font-medium bg-black/40 rounded-full px-2 py-0.5 backdrop-blur-sm">
            {kop.provinsi}
          </span>
        </div>
      </div>
      <div className="p-4 flex-1 flex flex-col gap-2">
        <h3 className="text-sm font-bold text-slate-800 leading-snug line-clamp-2 group-hover:text-[#025669] transition-colors">
          {kop.nama}
        </h3>
        <div className="flex items-center gap-1.5 text-xs text-slate-400">
          <MapPin className="size-3 shrink-0" />
          <span className="line-clamp-1">{kop.kelurahan}, {kop.kecamatan}, {kop.kabupaten}</span>
        </div>
        <div className="mt-auto flex items-center justify-between pt-2 border-t border-slate-100">
          <div className="flex items-center gap-1 text-xs text-slate-500">
            <Users className="size-3.5 text-[#025669]" />
            <span className="font-semibold text-slate-700">{totalAnggota.toLocaleString("id-ID")}</span>
            <span>/ {totalPenduduk.toLocaleString("id-ID")} Pddk</span>
          </div>
          <span className="flex items-center gap-1 text-xs text-[#025669] font-semibold group-hover:gap-2 transition-all">
            Lihat <ChevronRight className="size-3.5" />
          </span>
        </div>
      </div>
    </button>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────

const PROVINCES_FILTER = ["Semua", ...Array.from(new Set(KOPERASI_DATA.map(k => k.provinsi))).sort()]
const STATUS_FILTER = ["Semua", "Aktif", "Proses", "Belum Aktif"]

export function DatabaseKoperasi() {
  const [search, setSearch] = useState("")
  const [provinsi, setProvinsi] = useState("Semua")
  const [status, setStatus] = useState("Semua")
  const [viewMode, setViewMode] = useState<"card" | "table" | "map">("card")
  const [selected, setSelected] = useState<Koperasi | null>(null)

  const filtered = KOPERASI_DATA.filter((k) => {
    const q = search.toLowerCase()
    const matchSearch =
      !q ||
      k.nama.toLowerCase().includes(q) ||
      k.kelurahan.toLowerCase().includes(q) ||
      k.kecamatan.toLowerCase().includes(q) ||
      k.kabupaten.toLowerCase().includes(q) ||
      k.provinsi.toLowerCase().includes(q)
    const matchProv = provinsi === "Semua" || k.provinsi === provinsi
    const matchStatus = status === "Semua" || k.status === status
    return matchSearch && matchProv && matchStatus
  })

  // Summary stats
  const totalAktif = KOPERASI_DATA.filter(k => k.status === "Aktif").length
  const totalAnggota = KOPERASI_DATA.reduce((s, k) => s + k.anggotaLaki + k.anggotaPerempuan, 0)
  const totalPenduduk = KOPERASI_DATA.reduce((s, k) => s + k.pendudukLaki + k.pendudukPerempuan, 0)

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Database Koperasi"
        subtitle="Direktori lengkap Koperasi Desa Merah Putih — profil, potensi desa, anggota, dan pengurus"
      />

      {/* Summary KPI Strip */}
      <Reveal>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { icon: Building2, label: "Total Koperasi", value: KOPERASI_DATA.length, color: "text-[#025669] bg-[#025669]/10" },
            { icon: ShieldCheck, label: "Koperasi Aktif", value: totalAktif, color: "text-emerald-600 bg-emerald-50" },
            { icon: Users, label: "Total Anggota", value: totalAnggota.toLocaleString("id-ID"), color: "text-violet-600 bg-violet-50" },
            { icon: TrendingUp, label: "Total Penduduk", value: totalPenduduk.toLocaleString("id-ID"), color: "text-amber-600 bg-amber-50" },
          ].map((stat) => (
            <div key={stat.label} className="rounded-2xl bg-white border border-slate-200 px-4 py-3 shadow-sm flex items-center gap-3">
              <div className={cn("rounded-xl p-2.5", stat.color)}>
                <stat.icon className="size-5" />
              </div>
              <div>
                <p className="text-xs text-slate-400">{stat.label}</p>
                <p className="text-lg font-bold text-slate-800">{stat.value}</p>
              </div>
            </div>
          ))}
        </div>
      </Reveal>

      {/* Filters & View Toggle */}
      <Reveal>
        <SectionCard>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-4 mb-4">
            <div className="flex bg-slate-100 p-1 rounded-xl w-fit">
              <button onClick={() => setViewMode("card")} className={cn("flex items-center gap-1.5 px-3 py-1.5 text-sm font-semibold rounded-lg transition-colors", viewMode === "card" ? "bg-white text-slate-800 shadow-sm" : "text-slate-500 hover:text-slate-700")}>
                <LayoutGrid className="size-4" /> Card
              </button>
              <button onClick={() => setViewMode("table")} className={cn("flex items-center gap-1.5 px-3 py-1.5 text-sm font-semibold rounded-lg transition-colors", viewMode === "table" ? "bg-white text-slate-800 shadow-sm" : "text-slate-500 hover:text-slate-700")}>
                <List className="size-4" /> Tabel
              </button>
              <button onClick={() => setViewMode("map")} className={cn("flex items-center gap-1.5 px-3 py-1.5 text-sm font-semibold rounded-lg transition-colors", viewMode === "map" ? "bg-white text-slate-800 shadow-sm" : "text-slate-500 hover:text-slate-700")}>
                <Map className="size-4" /> Peta
              </button>
            </div>
          </div>
          
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400 pointer-events-none" />
              <input
                type="search"
                placeholder="Cari nama koperasi, desa, kecamatan, atau provinsi…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-4 py-2.5 text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#025669]/40"
              />
            </div>
            <select
              value={provinsi}
              onChange={(e) => setProvinsi(e.target.value)}
              className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#025669]/40 sm:w-48"
            >
              {PROVINCES_FILTER.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#025669]/40 sm:w-36"
            >
              {STATUS_FILTER.map(s => <option key={s} value={s}>{s === "Semua" ? "Semua Status" : s}</option>)}
            </select>
          </div>
          <p className="mt-2 text-xs text-slate-400">
            Menampilkan <strong className="text-slate-600">{filtered.length}</strong> dari {KOPERASI_DATA.length} koperasi
          </p>
        </SectionCard>
      </Reveal>

      {/* Content Area */}
      <div className="flex gap-6 items-start overflow-hidden">
        {/* Main View */}
        <motion.div 
          layout 
          className={cn("transition-all duration-300", selected ? "w-[calc(100%-444px)]" : "w-full")}
        >
          {filtered.length === 0 ? (
            <div className="py-16 text-center text-slate-400">
              <Building2 className="size-10 mx-auto mb-3 opacity-30" />
              <p className="font-medium">Tidak ada koperasi yang cocok</p>
              <p className="text-sm">Coba ubah kata kunci atau filter</p>
            </div>
          ) : viewMode === "card" ? (
            <div className={cn("grid gap-4", selected ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3")}>
              {filtered.map((kop) => (
                <Reveal key={kop.id}>
                  <KoperasiCard kop={kop} onClick={() => setSelected(kop.id === selected?.id ? null : kop)} />
                </Reveal>
              ))}
            </div>
          ) : viewMode === "table" ? (
            <div className="w-full overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 text-[11px] font-bold uppercase tracking-wider">
                      <th className="px-5 py-3.5">Koperasi</th>
                      <th className="px-5 py-3.5">Lokasi</th>
                      <th className="px-5 py-3.5">Provinsi</th>
                      <th className="px-5 py-3.5 text-center">Status</th>
                      <th className="px-5 py-3.5 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100/80">
                    {filtered.map(kop => (
                      <tr 
                        key={kop.id} 
                        onClick={() => setSelected(kop.id === selected?.id ? null : kop)}
                        className={cn(
                          "transition-all cursor-pointer group", 
                          selected?.id === kop.id ? "bg-sky-50/50" : "hover:bg-slate-50"
                        )}
                      >
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="size-10 shrink-0 overflow-hidden rounded-lg border border-slate-100 bg-slate-50">
                              <img src={kop.foto} alt={kop.nama} className="size-full object-cover" />
                            </div>
                            <div>
                              <p className="font-semibold text-slate-800 text-sm group-hover:text-[#025669] transition-colors">{kop.nama}</p>
                              <p className="text-xs text-slate-500 mt-0.5">AHU: {kop.skAhu}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-4 text-sm text-slate-600">
                          <p className="font-medium text-slate-700">{kop.kecamatan}</p>
                          <p className="text-xs text-slate-500 mt-0.5">{kop.kabupaten}</p>
                        </td>
                        <td className="px-5 py-4 text-sm text-slate-600">{kop.provinsi}</td>
                        <td className="px-5 py-4 text-center"><StatusBadge status={kop.status} /></td>
                        <td className="px-5 py-4 text-right">
                          <div className="inline-flex items-center justify-center rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors bg-white border border-slate-200 text-slate-600 group-hover:border-[#025669] group-hover:text-[#025669]">
                            {selected?.id === kop.id ? "Tutup" : "Detail"}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="w-full h-[600px] rounded-xl border border-slate-200 overflow-hidden shadow-sm relative z-0">
              <MapContainer center={[-2.5, 118]} zoom={5} className="w-full h-full">
                <MapUpdater data={filtered} selectedId={selected?.id} />
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="&copy; OpenStreetMap" />
                {filtered.map(kop => (
                  <Marker 
                    key={kop.id} 
                    position={[kop.lat, kop.lng]} 
                    icon={mapIcon(selected?.id === kop.id)}
                    eventHandlers={{ click: () => setSelected(kop.id === selected?.id ? null : kop) }}
                  >
                    <Popup>
                      <div className="font-sans min-w-[200px]">
                        <img src={kop.foto} alt={kop.nama} className="w-full h-24 object-cover rounded-md mb-2" />
                        <p className="font-bold text-sm mb-1 leading-snug">{kop.nama}</p>
                        <p className="text-xs text-slate-600 mb-2">{kop.kecamatan}, {kop.kabupaten}</p>
                        <button onClick={() => setSelected(kop)} className="text-xs bg-[#025669] text-white px-3 py-1.5 rounded-lg w-full font-medium">Lihat Selengkapnya</button>
                      </div>
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
            </div>
          )}
        </motion.div>

        {/* Detail slide-in */}
        <AnimatePresence>
          {selected && (
            <motion.div
              initial={{ opacity: 0, x: 20, width: 0 }}
              animate={{ opacity: 1, x: 0, width: 420 }}
              exit={{ opacity: 0, x: 20, width: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="shrink-0 sticky top-4 self-start rounded-2xl border border-slate-200 bg-white shadow-xl overflow-hidden h-[calc(100vh-120px)]"
            >
              <div className="w-[420px] h-full">
                <KoperasiDetail kop={selected} onClose={() => setSelected(null)} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
