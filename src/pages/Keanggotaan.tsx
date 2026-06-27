import { useState, useEffect } from "react"
import { PageHeader } from "@/components/layout/PageHeader"
import { SectionCard } from "@/components/shared/SectionCard"
import { Reveal } from "@/components/shared/Reveal"
import {
  Network,
  GitFork,
  ArrowRight,
  ShieldCheck,
  Calendar,
  UserCheck,
  Mail,
  Phone,
  Search,
} from "lucide-react"
import { toast } from "sonner"

interface Member {
  id: string
  name: string
  role: string
  dept: string
  avatar: string
  parentId?: string
  code: string
  joined: string
  status: "Aktif" | "Nonaktif"
  simpananPokok: string
  simpananWajib: string
  simpananSukarela: string
  voteShare: string
  transparencyScore: number
  phone: string
  email: string
  activities: string[]
}

const MEMBERS: Member[] = [
  {
    id: "m1",
    name: "Charles Williams",
    role: "Ketua Koperasi",
    dept: "Pengurus Harian",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
    code: "SKJ-001",
    joined: "12 Jan 2021",
    status: "Aktif",
    simpananPokok: "Rp 5.000.000",
    simpananWajib: "Rp 250.000 / bln",
    simpananSukarela: "Rp 12.500.000",
    voteShare: "1.0% (Hak Setara)",
    transparencyScore: 99,
    phone: "+62 811-1234-567",
    email: "charles.williams@sikora.coop",
    activities: [
      "Menandatangani laporan pertanggungjawaban tahunan",
      "Persetujuan kemitraan rantai pasok dengan KDKMP Wilayah",
      "Membuka rapat koordinasi bulanan pengurus",
    ],
  },
  {
    id: "m2",
    name: "Robert Jones",
    role: "Manajer Operasional",
    dept: "Divisi Operasional",
    avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150",
    parentId: "m1",
    code: "SKJ-002",
    joined: "18 Feb 2021",
    status: "Aktif",
    simpananPokok: "Rp 2.500.000",
    simpananWajib: "Rp 150.000 / bln",
    simpananSukarela: "Rp 4.200.000",
    voteShare: "1.0% (Hak Setara)",
    transparencyScore: 97,
    phone: "+62 812-9876-543",
    email: "robert.jones@sikora.coop",
    activities: [
      "Verifikasi pengadaan beras gerai Margahayu",
      "Rekonsiliasi transaksi offline POS Gerai Cibiru",
      "Pengecekan kualitas gudang logistik",
    ],
  },
  {
    id: "m3",
    name: "Lisa Moore",
    role: "Manajer Keuangan",
    dept: "Divisi Keuangan",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150",
    parentId: "m1",
    code: "SKJ-003",
    joined: "05 Mar 2021",
    status: "Aktif",
    simpananPokok: "Rp 2.500.000",
    simpananWajib: "Rp 150.000 / bln",
    simpananSukarela: "Rp 8.700.000",
    voteShare: "1.0% (Hak Setara)",
    transparencyScore: 98,
    phone: "+62 813-4455-667",
    email: "lisa.moore@sikora.coop",
    activities: [
      "Penyusunan laporan arus kas Mei 2026",
      "Pencairan dana talangan restock sembako",
      "Penyaluran bagi hasil SHU anggota kuartal 1",
    ],
  },
  {
    id: "m4",
    name: "Natalie Smith",
    role: "Manajer Kemitraan & AI",
    dept: "Divisi AI & Kemitraan",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150",
    parentId: "m1",
    code: "SKJ-004",
    joined: "20 Mei 2021",
    status: "Aktif",
    simpananPokok: "Rp 2.500.000",
    simpananWajib: "Rp 150.000 / bln",
    simpananSukarela: "Rp 5.400.000",
    voteShare: "1.0% (Hak Setara)",
    transparencyScore: 96,
    phone: "+62 815-2233-445",
    email: "natalie.smith@sikora.coop",
    activities: [
      "Kalibrasi model prediksi AI DSS untuk restock",
      "Penambahan gerai sync baru di margahayu",
      "Sosialisasi sistem keanggotaan digital grassroot",
    ],
  },
  {
    id: "m5",
    name: "Francisco Maia",
    role: "Supervisor Gudang",
    dept: "Divisi Operasional",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150",
    parentId: "m2",
    code: "SKJ-005",
    joined: "10 Jun 2022",
    status: "Aktif",
    simpananPokok: "Rp 1.000.000",
    simpananWajib: "Rp 100.000 / bln",
    simpananSukarela: "Rp 1.800.000",
    voteShare: "1.0% (Hak Setara)",
    transparencyScore: 94,
    phone: "+62 819-7788-990",
    email: "francisco.maia@sikora.coop",
    activities: [
      "Input barang masuk Tepung Terigu 80kg",
      "Update status stok kaku beras premium",
    ],
  },
  {
    id: "m6",
    name: "Salma Fonseca",
    role: "Kasir Gerai Sukamaju",
    dept: "Divisi Operasional",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150",
    parentId: "m2",
    code: "SKJ-006",
    joined: "01 Sep 2022",
    status: "Aktif",
    simpananPokok: "Rp 1.000.000",
    simpananWajib: "Rp 100.000 / bln",
    simpananSukarela: "Rp 2.100.000",
    voteShare: "1.0% (Hak Setara)",
    transparencyScore: 95,
    phone: "+62 821-3344-556",
    email: "salma.fonseca@sikora.coop",
    activities: [
      "Melayani 45 transaksi POS hari ini",
      "Penyetoran kas harian gerai pusat",
    ],
  },
  {
    id: "m7",
    name: "Ruben Alvarez",
    role: "Staf Logistik",
    dept: "Divisi Operasional",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150",
    parentId: "m2",
    code: "SKJ-007",
    joined: "15 Des 2022",
    status: "Aktif",
    simpananPokok: "Rp 1.000.000",
    simpananWajib: "Rp 100.000 / bln",
    simpananSukarela: "Rp 900.000",
    voteShare: "1.0% (Hak Setara)",
    transparencyScore: 92,
    phone: "+62 822-6677-889",
    email: "ruben.alvarez@sikora.coop",
    activities: [
      "Pengiriman logistik minyak goreng ke gerai Cibiru",
      "Pengecekan armada kendaraan kurir",
    ],
  },
  {
    id: "m8",
    name: "Silvia Caballero",
    role: "Staf Akuntansi",
    dept: "Divisi Keuangan",
    avatar: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150",
    parentId: "m3",
    code: "SKJ-008",
    joined: "01 Feb 2023",
    status: "Aktif",
    simpananPokok: "Rp 1.000.000",
    simpananWajib: "Rp 100.000 / bln",
    simpananSukarela: "Rp 3.100.000",
    voteShare: "1.0% (Hak Setara)",
    transparencyScore: 96,
    phone: "+62 856-1122-334",
    email: "silvia.caballero@sikora.coop",
    activities: [
      "Posting jurnal transaksi penjualan sembako",
      "Penyusunan rekonsiliasi bank BCA",
    ],
  },
  {
    id: "m9",
    name: "Pedro Ackner",
    role: "Staf Pajak",
    dept: "Divisi Keuangan",
    avatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150",
    parentId: "m3",
    code: "SKJ-009",
    joined: "12 Apr 2023",
    status: "Aktif",
    simpananPokok: "Rp 1.000.000",
    simpananWajib: "Rp 100.000 / bln",
    simpananSukarela: "Rp 1.500.000",
    voteShare: "1.0% (Hak Setara)",
    transparencyScore: 93,
    phone: "+62 857-4455-667",
    email: "pedro.ackner@sikora.coop",
    activities: [
      "Penginputan e-Faktur PPN Masukan koperasi",
      "Penyetoran PPh 21 bulanan karyawan",
    ],
  },
  {
    id: "m10",
    name: "Manuel Wilson",
    role: "Penyuluh Grassroot",
    dept: "Divisi AI & Kemitraan",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
    parentId: "m4",
    code: "SKJ-010",
    joined: "18 Jun 2023",
    status: "Aktif",
    simpananPokok: "Rp 1.000.000",
    simpananWajib: "Rp 100.000 / bln",
    simpananSukarela: "Rp 2.400.000",
    voteShare: "1.0% (Hak Setara)",
    transparencyScore: 97,
    phone: "+62 878-8899-001",
    email: "manuel.wilson@sikora.coop",
    activities: [
      "Sosialisasi tata kelola koperasi di Desa Sukamaju",
      "Registrasi 14 anggota masyarakat baru",
    ],
  },
  {
    id: "m11",
    name: "Julieta Oldhof",
    role: "Staf IT Support",
    dept: "Divisi AI & Kemitraan",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150",
    parentId: "m4",
    code: "SKJ-011",
    joined: "01 Nov 2023",
    status: "Aktif",
    simpananPokok: "Rp 1.000.000",
    simpananWajib: "Rp 100.000 / bln",
    simpananSukarela: "Rp 1.200.000",
    voteShare: "1.0% (Hak Setara)",
    transparencyScore: 94,
    phone: "+62 899-2233-445",
    email: "julieta.oldhof@sikora.coop",
    activities: [
      "Setting tablet POS baru di gerai Cibiru",
      "Monitoring konektivitas VPN data sinkronisasi",
    ],
  },
  {
    id: "m12",
    name: "Dunia Sigachyova",
    role: "Hubungan Anggota",
    dept: "Divisi AI & Kemitraan",
    avatar: "https://images.unsplash.com/photo-1554151228-14d9def656e4?w=150",
    parentId: "m4",
    code: "SKJ-012",
    joined: "15 Jan 2024",
    status: "Aktif",
    simpananPokok: "Rp 1.000.000",
    simpananWajib: "Rp 100.000 / bln",
    simpananSukarela: "Rp 1.900.000",
    voteShare: "1.0% (Hak Setara)",
    transparencyScore: 96,
    phone: "+62 896-5566-778",
    email: "dunia.sigachyova@sikora.coop",
    activities: [
      "Menjawab keluhan anggota tentang limit pinjaman",
      "Penyebaran bulletin triwulan KDKMP digital",
    ],
  },
]

export function Keanggotaan() {
  const [viewMode, setViewMode] = useState<"hierarchy" | "network">("hierarchy")
  const [selectedId, setSelectedId] = useState<string>("m1")
  const [searchQuery, setSearchQuery] = useState("")

  const selectedMember = MEMBERS.find((m) => m.id === selectedId) || MEMBERS[0]

  useEffect(() => {
    if (searchQuery.trim() !== "") {
      const matched = MEMBERS.find((m) =>
        m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.role.toLowerCase().includes(searchQuery.toLowerCase())
      )
      if (matched) {
        setSelectedId(matched.id)
      }
    }
  }, [searchQuery])

  const handleContact = (name: string) => {
    toast.success(`Menghubungi ${name}... Pesan Whatsapp berhasil dikirim via SIKORA Gateway.`)
  }

  // Radial coordinates for Obsidian-like Network graph
  // Center is Charles Williams (x: 250, y: 200)
  // Ring 1 (Managers): Robert (110, 100), Lisa (250, 60), Natalie (390, 100)
  // Ring 2 (Staffs):
  // Under Robert: Francisco (40, 50), Salma (30, 150), Ruben (90, 220)
  // Under Lisa: Silvia (170, 20), Pedro (330, 20)
  // Under Natalie: Manuel (410, 220), Julieta (470, 150), Dunia (460, 50)
  const NODE_POSITIONS: Record<string, { x: number; y: number; size: number }> = {
    m1: { x: 260, y: 210, size: 76 }, // Center (Chairman)
    m2: { x: 120, y: 150, size: 54 }, // Operations Manager
    m3: { x: 260, y: 70, size: 54 },  // Finance Manager
    m4: { x: 400, y: 150, size: 54 }, // Partnership/AI Manager
    m5: { x: 40, y: 80, size: 38 },   // Warehouse Supervisor
    m6: { x: 30, y: 170, size: 38 },  // Cashier
    m7: { x: 90, y: 250, size: 38 },  // Logistics
    m8: { x: 180, y: 30, size: 38 },  // Accountant
    m9: { x: 340, y: 30, size: 38 },  // Tax
    m10: { x: 430, y: 250, size: 38 }, // Grassroots Facilitator
    m11: { x: 490, y: 170, size: 38 }, // IT Support
    m12: { x: 480, y: 80, size: 38 },  // Member Relations
  }

  return (
    <div className="space-y-5">
      <PageHeader
        title="Keanggotaan & Tata Kelola"
        subtitle="Rekayasa transparansi tata kelola dan visualisasi jejaring sistem keanggotaan digital."
      />

      <div className="flex flex-wrap items-center justify-between gap-4">
        {/* Toggle View Mode */}
        <div className="flex items-center gap-1 rounded-xl bg-slate-100 p-1">
          <button
            onClick={() => setViewMode("hierarchy")}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-bold transition-all ${
              viewMode === "hierarchy"
                ? "bg-white text-slate-800 shadow-sm"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <GitFork className="size-4" />
            Bagan Struktur (Org Chart)
          </button>
          <button
            onClick={() => setViewMode("network")}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-bold transition-all ${
              viewMode === "network"
                ? "bg-white text-slate-800 shadow-sm"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <Network className="size-4" />
            Jejaring Obsidian (Node Graph)
          </button>
        </div>

        {/* Search bar */}
        <div className="relative w-64">
          <Search className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Cari nama atau jabatan..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 py-2 text-xs font-semibold text-slate-700 outline-none focus:border-blue-500 hover:border-slate-350 transition-colors shadow-sm"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        {/* Graph Display Area */}
        <SectionCard
          className="lg:col-span-2 min-h-[560px] flex flex-col justify-between overflow-x-auto"
          title={viewMode === "hierarchy" ? "Struktur Organisasi Harian" : "Jejaring Interaksi Tata Kelola"}
          subtitle={
            viewMode === "hierarchy"
              ? "Menampilkan jalur kepemimpinan dan penugasan divisi"
              : "Visualisasi radial interaksi keanggotaan berbasis Obsidian Node"
          }
        >
          {viewMode === "hierarchy" ? (
            /* --- HIERARCHY / ORG CHART VIEW --- */
            <div className="flex-1 py-8 flex flex-col items-center min-w-[700px] overflow-visible select-none">
              {/* LEVEL 1: Chairman */}
              <div className="flex flex-col items-center">
                <div
                  onClick={() => setSelectedId("m1")}
                  className={`relative flex flex-col items-center justify-center p-3 rounded-2xl border bg-white shadow-sm cursor-pointer transition-all duration-300 w-52 hover:scale-[1.03] hover:shadow-md ${
                    selectedId === "m1" ? "border-blue-600 ring-2 ring-blue-500/20" : "border-slate-100"
                  }`}
                >
                  <span className="absolute -top-2.5 bg-blue-100 text-blue-700 text-[9px] font-black uppercase px-2 py-0.5 rounded-full border border-blue-200">
                    Leader
                  </span>
                  <img
                    src={MEMBERS[0].avatar}
                    className="size-11 rounded-full object-cover border-2 border-white ring-2 ring-slate-100"
                    alt={MEMBERS[0].name}
                  />
                  <h4 className="mt-2 text-xs font-bold text-slate-800 text-center">{MEMBERS[0].name}</h4>
                  <p className="text-[10px] font-medium text-slate-400 mt-0.5">{MEMBERS[0].role}</p>
                  <div className="mt-2 w-full border-t border-slate-50 pt-1.5 flex justify-between items-center text-[9px] font-semibold text-slate-400">
                    <span className="flex items-center gap-0.5"><ShieldCheck className="size-3 text-emerald-500" /> {MEMBERS[0].transparencyScore}%</span>
                    <span>{MEMBERS[0].code}</span>
                  </div>
                </div>

                {/* Level 1 down line */}
                <div className="w-0.5 h-6 bg-slate-200" />
              </div>

              {/* LEVEL 2: Managers */}
              <div className="relative w-full flex flex-col items-center">
                {/* Horizontal branch line */}
                <div className="absolute top-0 left-1/6 right-1/6 h-0.5 bg-slate-200" style={{ left: "17%", right: "17%" }} />

                <div className="w-full grid grid-cols-3 gap-4 pt-0.5">
                  {[MEMBERS[1], MEMBERS[2], MEMBERS[3]].map((m) => (
                    <div key={m.id} className="flex flex-col items-center">
                      {/* Vertical line to each card */}
                      <div className="w-0.5 h-6 bg-slate-200" />

                      <div
                        onClick={() => setSelectedId(m.id)}
                        className={`relative flex flex-col items-center justify-center p-3 rounded-2xl border bg-white shadow-sm cursor-pointer transition-all duration-300 w-48 hover:scale-[1.03] hover:shadow-md ${
                          selectedId === m.id ? "border-blue-600 ring-2 ring-blue-500/20" : "border-slate-100"
                        }`}
                      >
                        <span className="absolute -top-2.5 bg-violet-100 text-violet-700 text-[9px] font-black uppercase px-2 py-0.5 rounded-full border border-violet-200">
                          Manager
                        </span>
                        <img
                          src={m.avatar}
                          className="size-10 rounded-full object-cover border-2 border-white ring-2 ring-slate-100"
                          alt={m.name}
                        />
                        <h4 className="mt-2 text-xs font-bold text-slate-800 text-center">{m.name}</h4>
                        <p className="text-[9.5px] font-medium text-slate-400 mt-0.5">{m.role}</p>
                        <div className="mt-2 w-full border-t border-slate-50 pt-1.5 flex justify-between items-center text-[9px] font-semibold text-slate-400">
                          <span className="flex items-center gap-0.5"><ShieldCheck className="size-3 text-emerald-500" /> {m.transparencyScore}%</span>
                          <span>{m.code}</span>
                        </div>
                      </div>

                      {/* Line down to Subordinates */}
                      <div className="w-0.5 h-6 bg-slate-200" />

                      {/* LEVEL 3: Vertical Stack of Subordinates */}
                      <div className="flex flex-col gap-2 w-48 pl-3.5 relative before:absolute before:left-0 before:top-0 before:bottom-7 before:w-0.5 before:bg-slate-200">
                        {MEMBERS.filter((sub) => sub.parentId === m.id).map((sub) => (
                          <div
                            key={sub.id}
                            onClick={() => setSelectedId(sub.id)}
                            className={`relative flex items-center gap-2 p-2 rounded-xl border bg-white cursor-pointer transition-all duration-350 hover:scale-[1.02] hover:shadow-sm ${
                              selectedId === sub.id ? "border-blue-600 ring-1.5 ring-blue-500/20" : "border-slate-100"
                            } before:absolute before:-left-3.5 before:top-1/2 before:-translate-y-1/2 before:w-3.5 before:h-0.5 before:bg-slate-200`}
                          >
                            <img
                              src={sub.avatar}
                              className="size-7 rounded-full object-cover border border-slate-100"
                              alt={sub.name}
                            />
                            <div className="min-w-0 flex-1">
                              <h5 className="text-[10.5px] font-bold text-slate-800 truncate leading-tight">{sub.name}</h5>
                              <p className="text-[9px] font-medium text-slate-400 truncate leading-tight mt-0.5">{sub.role}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            /* --- OBSIDIAN-STYLE NETWORK/NODE VIEW --- */
            <div className="flex-1 flex items-center justify-center p-4 overflow-hidden relative select-none min-h-[420px]">
              {/* Radial background grid */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03]">
                <div className="border border-slate-900 rounded-full w-[240px] h-[240px] absolute" />
                <div className="border border-slate-900 rounded-full w-[440px] h-[440px] absolute" />
                <div className="border border-slate-900 rounded-full w-[600px] h-[600px] absolute" />
              </div>

              {/* Obsidian Graph Interactive SVG Lines */}
              <div className="relative w-[520px] h-[320px]">
                <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible">
                  {/* Lines between Charles (m1) and Managers */}
                  <line x1={NODE_POSITIONS.m1.x} y1={NODE_POSITIONS.m1.y} x2={NODE_POSITIONS.m2.x} y2={NODE_POSITIONS.m2.y} stroke="#cbd5e1" strokeWidth="2" strokeDasharray="3 3" />
                  <line x1={NODE_POSITIONS.m1.x} y1={NODE_POSITIONS.m1.y} x2={NODE_POSITIONS.m3.x} y2={NODE_POSITIONS.m3.y} stroke="#cbd5e1" strokeWidth="2" strokeDasharray="3 3" />
                  <line x1={NODE_POSITIONS.m1.x} y1={NODE_POSITIONS.m1.y} x2={NODE_POSITIONS.m4.x} y2={NODE_POSITIONS.m4.y} stroke="#cbd5e1" strokeWidth="2" strokeDasharray="3 3" />

                  {/* Lines from Managers to Subordinates */}
                  {/* Robert's Subordinates */}
                  <line x1={NODE_POSITIONS.m2.x} y1={NODE_POSITIONS.m2.y} x2={NODE_POSITIONS.m5.x} y2={NODE_POSITIONS.m5.y} stroke="#e2e8f0" strokeWidth="1.5" />
                  <line x1={NODE_POSITIONS.m2.x} y1={NODE_POSITIONS.m2.y} x2={NODE_POSITIONS.m6.x} y2={NODE_POSITIONS.m6.y} stroke="#e2e8f0" strokeWidth="1.5" />
                  <line x1={NODE_POSITIONS.m2.x} y1={NODE_POSITIONS.m2.y} x2={NODE_POSITIONS.m7.x} y2={NODE_POSITIONS.m7.y} stroke="#e2e8f0" strokeWidth="1.5" />

                  {/* Lisa's Subordinates */}
                  <line x1={NODE_POSITIONS.m3.x} y1={NODE_POSITIONS.m3.y} x2={NODE_POSITIONS.m8.x} y2={NODE_POSITIONS.m8.y} stroke="#e2e8f0" strokeWidth="1.5" />
                  <line x1={NODE_POSITIONS.m3.x} y1={NODE_POSITIONS.m3.y} x2={NODE_POSITIONS.m9.x} y2={NODE_POSITIONS.m9.y} stroke="#e2e8f0" strokeWidth="1.5" />

                  {/* Natalie's Subordinates */}
                  <line x1={NODE_POSITIONS.m4.x} y1={NODE_POSITIONS.m4.y} x2={NODE_POSITIONS.m10.x} y2={NODE_POSITIONS.m10.y} stroke="#e2e8f0" strokeWidth="1.5" />
                  <line x1={NODE_POSITIONS.m4.x} y1={NODE_POSITIONS.m4.y} x2={NODE_POSITIONS.m11.x} y2={NODE_POSITIONS.m11.y} stroke="#e2e8f0" strokeWidth="1.5" />
                  <line x1={NODE_POSITIONS.m4.x} y1={NODE_POSITIONS.m4.y} x2={NODE_POSITIONS.m12.x} y2={NODE_POSITIONS.m12.y} stroke="#e2e8f0" strokeWidth="1.5" />
                </svg>

                {/* Profile Nodes */}
                {MEMBERS.map((m) => {
                  const pos = NODE_POSITIONS[m.id]
                  if (!pos) return null

                  const isSelected = selectedId === m.id
                  const size = pos.size

                  return (
                    <button
                      key={m.id}
                      onClick={() => setSelectedId(m.id)}
                      style={{
                        position: "absolute",
                        left: pos.x,
                        top: pos.y,
                        width: size,
                        height: size,
                        transform: "translate(-50%, -50%)",
                      }}
                      className={`group flex items-center justify-center rounded-full bg-white transition-all duration-300 hover:scale-110 shadow-sm border ${
                        isSelected
                          ? "border-blue-600 ring-4 ring-blue-500/20 scale-105"
                          : "border-slate-200 hover:border-blue-400 hover:shadow-md"
                      }`}
                    >
                      <img
                        src={m.avatar}
                        style={{
                          width: size - (size > 50 ? 6 : 4),
                          height: size - (size > 50 ? 6 : 4),
                        }}
                        className="rounded-full object-cover"
                        alt={m.name}
                      />

                      {/* Tooltip on hover */}
                      <span className="pointer-events-none absolute bottom-full left-1/2 z-10 -translate-x-1/2 mb-2 scale-0 group-hover:scale-100 rounded bg-slate-900/95 px-2 py-1 text-[9px] font-semibold text-white whitespace-nowrap transition-all duration-200 shadow">
                        {m.name} ({m.role})
                      </span>
                    </button>
                  )
                })}
              </div>

              {/* Department Guide labels */}
              <div className="absolute bottom-2 left-4 flex gap-4 text-[10px] font-bold text-slate-400">
                <span className="flex items-center gap-1"><span className="size-2 rounded-full bg-blue-500" /> Pengurus</span>
                <span className="flex items-center gap-1"><span className="size-2 rounded-full bg-emerald-500" /> Operasional</span>
                <span className="flex items-center gap-1"><span className="size-2 rounded-full bg-amber-500" /> Keuangan</span>
                <span className="flex items-center gap-1"><span className="size-2 rounded-full bg-purple-500" /> AI & Kemitraan</span>
              </div>
            </div>
          )}
        </SectionCard>

        {/* Selected Member Detail Sidebar */}
        <Reveal delay={0.1}>
          <div className="space-y-4">
            <SectionCard title="Detail Profil Anggota">
              <div className="flex flex-col items-center pb-4 text-center">
                <div className="relative">
                  <img
                    src={selectedMember.avatar}
                    className="size-20 rounded-full border-4 border-white shadow ring-2 ring-slate-100 object-cover"
                    alt={selectedMember.name}
                  />
                  <span
                    className={`absolute bottom-0 right-1 border-2 border-white size-3.5 rounded-full ${
                      selectedMember.status === "Aktif" ? "bg-emerald-500" : "bg-slate-300"
                    }`}
                  />
                </div>
                <h3 className="mt-3 text-sm font-black text-slate-800">{selectedMember.name}</h3>
                <p className="text-xs font-semibold text-slate-500">{selectedMember.role}</p>
                <span className="mt-1.5 inline-flex items-center rounded-full bg-slate-50 border border-slate-100 px-2.5 py-0.5 text-[9px] font-black text-slate-400 uppercase tracking-wide">
                  {selectedMember.dept}
                </span>
              </div>

              {/* Stats details */}
              <div className="border-t border-slate-100 py-4 space-y-3">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400 font-medium">Kode Anggota</span>
                  <span className="font-bold text-slate-700">{selectedMember.code}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400 font-medium">Tanggal Bergabung</span>
                  <span className="font-bold text-slate-700 flex items-center gap-1">
                    <Calendar className="size-3 text-slate-400" /> {selectedMember.joined}
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400 font-medium">Hak Suara Rapat</span>
                  <span className="font-bold text-slate-700 flex items-center gap-1">
                    <UserCheck className="size-3 text-blue-500" /> {selectedMember.voteShare}
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400 font-medium">Indeks Transparansi</span>
                  <span className="font-black text-emerald-600 flex items-center gap-0.5">
                    <ShieldCheck className="size-3.5 text-emerald-500" /> {selectedMember.transparencyScore}%
                  </span>
                </div>
              </div>

              {/* Share Capitals */}
              <div className="border-t border-slate-100 py-4">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-2.5">Partisipasi Simpanan Koperasi</h4>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="bg-slate-50 border border-slate-100 rounded-xl p-2">
                    <p className="text-[8px] font-bold text-slate-400 uppercase leading-none">Pokok</p>
                    <p className="text-[10px] font-bold text-slate-800 mt-1 truncate">{selectedMember.simpananPokok}</p>
                  </div>
                  <div className="bg-slate-50 border border-slate-100 rounded-xl p-2">
                    <p className="text-[8px] font-bold text-slate-400 uppercase leading-none">Wajib</p>
                    <p className="text-[10px] font-bold text-slate-800 mt-1 truncate">{selectedMember.simpananWajib.split(" ")[0]}</p>
                  </div>
                  <div className="bg-slate-50 border border-slate-100 rounded-xl p-2">
                    <p className="text-[8px] font-bold text-slate-400 uppercase leading-none">Sukarela</p>
                    <p className="text-[10px] font-bold text-slate-800 mt-1 truncate">{selectedMember.simpananSukarela}</p>
                  </div>
                </div>
              </div>

              {/* Log Aktivitas Transparansi */}
              <div className="border-t border-slate-100 pt-4 pb-1">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-2.5">Histori Aksi Tata Kelola (Transparan)</h4>
                <div className="space-y-2">
                  {selectedMember.activities.map((act, i) => (
                    <div key={i} className="flex gap-2 items-start text-[10.5px] leading-snug">
                      <ArrowRight className="size-3 text-blue-500 shrink-0 mt-0.5" />
                      <span className="text-slate-600 font-medium">{act}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Hubungi Anggota */}
              <div className="border-t border-slate-100 pt-4 flex gap-2">
                <button
                  onClick={() => handleContact(selectedMember.name)}
                  className="flex-1 flex justify-center items-center gap-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white py-2 text-xs font-bold transition-all shadow-sm shadow-blue-500/20"
                >
                  <Mail className="size-3.5" /> Hubungi
                </button>
                <a
                  href={`tel:${selectedMember.phone}`}
                  className="flex size-8 shrink-0 items-center justify-center rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
                >
                  <Phone className="size-3.5" />
                </a>
              </div>
            </SectionCard>
          </div>
        </Reveal>
      </div>
    </div>
  )
}
