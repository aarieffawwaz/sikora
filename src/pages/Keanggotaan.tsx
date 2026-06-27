import { useState, useEffect, useRef } from "react"
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
  Phone,
  Search,
  ChevronDown,
  MessageSquare,
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
  // Location tags:
  provinsi: string
  kabupaten: string
  kelurahan: string
}

const MEMBERS: Member[] = [
  {
    id: "m1",
    name: "Budi Santoso",
    role: "Ketua Koperasi",
    dept: "Pengurus Harian",
    avatar: "https://images.unsplash.com/photo-1544717305-2782549b5136?w=150",
    code: "SKJ-001",
    joined: "12 Jan 2021",
    status: "Aktif",
    simpananPokok: "Rp 5.000.000",
    simpananWajib: "Rp 250.000 / bln",
    simpananSukarela: "Rp 12.500.000",
    voteShare: "1.0% (Hak Setara)",
    transparencyScore: 99,
    phone: "+62 811-1234-567",
    email: "budi.santoso@sikora.coop",
    provinsi: "Jawa Barat",
    kabupaten: "Bandung",
    kelurahan: "Sukamaju",
    activities: [
      "Menandatangani laporan pertanggungjawaban tahunan KDKMP",
      "Persetujuan kemitraan rantai pasok dengan KDKMP Wilayah",
      "Membuka rapat koordinasi bulanan pengurus",
    ],
  },
  {
    id: "m2",
    name: "Ahmad Hidayat",
    role: "Manajer Operasional",
    dept: "Divisi Operasional",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150",
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
    email: "ahmad.hidayat@sikora.coop",
    provinsi: "Jawa Barat",
    kabupaten: "Bandung",
    kelurahan: "Cibiru",
    activities: [
      "Verifikasi pengadaan beras gerai Margahayu",
      "Rekonsiliasi transaksi offline POS Gerai Cibiru",
      "Pengecekan kualitas gudang logistik",
    ],
  },
  {
    id: "m3",
    name: "Siti Aminah",
    role: "Manajer Keuangan",
    dept: "Divisi Keuangan",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150",
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
    email: "siti.aminah@sikora.coop",
    provinsi: "Jawa Barat",
    kabupaten: "Bandung",
    kelurahan: "Margahayu",
    activities: [
      "Penyusunan laporan arus kas Mei 2026",
      "Pencairan dana talangan restock sembako",
      "Penyaluran bagi hasil SHU anggota kuartal 1",
    ],
  },
  {
    id: "m4",
    name: "Dewi Lestari",
    role: "Manajer Kemitraan & AI",
    dept: "Divisi AI & Kemitraan",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
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
    email: "dewi.lestari@sikora.coop",
    provinsi: "Jawa Barat",
    kabupaten: "Bandung",
    kelurahan: "Sukamaju",
    activities: [
      "Kalibrasi model prediksi AI DSS untuk restock",
      "Penambahan gerai sync baru di Margahayu",
      "Sosialisasi sistem keanggotaan digital grassroot",
    ],
  },
  {
    id: "m5",
    name: "Fajar Nugroho",
    role: "Supervisor Gudang",
    dept: "Divisi Operasional",
    avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150",
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
    email: "fajar.nugroho@sikora.coop",
    provinsi: "Jawa Barat",
    kabupaten: "Bandung",
    kelurahan: "Cibiru",
    activities: [
      "Input barang masuk Tepung Terigu 80kg",
      "Update status stok kaku beras premium",
    ],
  },
  {
    id: "m6",
    name: "Sri Wahyuni",
    role: "Kasir Gerai Sukamaju",
    dept: "Divisi Operasional",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150",
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
    email: "sri.wahyuni@sikora.coop",
    provinsi: "Jawa Barat",
    kabupaten: "Bandung",
    kelurahan: "Sukamaju",
    activities: [
      "Melayani 45 transaksi POS hari ini",
      "Penyetoran kas harian gerai pusat",
    ],
  },
  {
    id: "m7",
    name: "Bambang Wijaya",
    role: "Staf Logistik",
    dept: "Divisi Operasional",
    avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150",
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
    email: "bambang.wijaya@sikora.coop",
    provinsi: "Jawa Barat",
    kabupaten: "Bandung",
    kelurahan: "Cibiru",
    activities: [
      "Pengiriman logistik minyak goreng ke gerai Cibiru",
      "Pengecekan armada kendaraan kurir",
    ],
  },
  {
    id: "m8",
    name: "Rina Kartika",
    role: "Staf Akuntansi",
    dept: "Divisi Keuangan",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150",
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
    email: "rina.kartika@sikora.coop",
    provinsi: "Jawa Barat",
    kabupaten: "Bandung",
    kelurahan: "Margahayu",
    activities: [
      "Posting jurnal transaksi penjualan sembako",
      "Penyusunan rekonsiliasi bank BCA",
    ],
  },
  {
    id: "m9",
    name: "Hadi Pranoto",
    role: "Staf Pajak",
    dept: "Divisi Keuangan",
    avatar: "https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=150",
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
    email: "hadi.pranoto@sikora.coop",
    provinsi: "Jawa Barat",
    kabupaten: "Bandung",
    kelurahan: "Margahayu",
    activities: [
      "Penginputan e-Faktur PPN Masukan koperasi",
      "Penyetoran PPh 21 bulanan karyawan",
    ],
  },
  {
    id: "m10",
    name: "Eko Prasetyo",
    role: "Penyuluh Grassroot",
    dept: "Divisi AI & Kemitraan",
    avatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150",
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
    email: "eko.prasetyo@sikora.coop",
    provinsi: "Jawa Tengah",
    kabupaten: "Sleman",
    kelurahan: "Candi",
    activities: [
      "Sosialisasi tata kelola koperasi di Desa Sleman",
      "Registrasi 14 anggota masyarakat baru",
    ],
  },
  {
    id: "m11",
    name: "Rian Hidayat",
    role: "Staf IT Support",
    dept: "Divisi AI & Kemitraan",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
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
    email: "rian.hidayat@sikora.coop",
    provinsi: "Jawa Barat",
    kabupaten: "Sumedang",
    kelurahan: "Jatinangor",
    activities: [
      "Setting tablet POS baru di gerai Cibiru",
      "Monitoring konektivitas VPN data sinkronisasi",
    ],
  },
  {
    id: "m12",
    name: "Fitriani",
    role: "Hubungan Anggota",
    dept: "Divisi AI & Kemitraan",
    avatar: "https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=150",
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
    email: "fitriani@sikora.coop",
    provinsi: "Jawa Tengah",
    kabupaten: "Sleman",
    kelurahan: "Candi",
    activities: [
      "Menjawab keluhan anggota tentang limit pinjaman",
      "Penyebaran bulletin triwulan KDKMP digital",
    ],
  },
]

// Spring links configuration for physics simulation
const LINKS = [
  { source: "m1", target: "m2" },
  { source: "m1", target: "m3" },
  { source: "m1", target: "m4" },
  { source: "m2", target: "m5" },
  { source: "m2", target: "m6" },
  { source: "m2", target: "m7" },
  { source: "m3", target: "m8" },
  { source: "m3", target: "m9" },
  { source: "m4", target: "m10" },
  { source: "m4", target: "m11" },
  { source: "m4", target: "m12" },
]

interface NodePhysics {
  id: string
  x: number
  y: number
  vx: number
  vy: number
  size: number
}

const INITIAL_PHYSICS_NODES: Record<string, NodePhysics> = {
  m1: { id: "m1", x: 260, y: 210, vx: 0, vy: 0, size: 72 }, // Chairman
  m2: { id: "m2", x: 120, y: 150, vx: 0, vy: 0, size: 52 }, // Manager
  m3: { id: "m3", x: 260, y: 70, vx: 0, vy: 0, size: 52 },  // Manager
  m4: { id: "m4", x: 400, y: 150, vx: 0, vy: 0, size: 52 }, // Manager
  m5: { id: "m5", x: 40, y: 80, vx: 0, vy: 0, size: 36 },
  m6: { id: "m6", x: 30, y: 170, vx: 0, vy: 0, size: 36 },
  m7: { id: "m7", x: 90, y: 250, vx: 0, vy: 0, size: 36 },
  m8: { id: "m8", x: 185, y: 30, vx: 0, vy: 0, size: 36 },
  m9: { id: "m9", x: 335, y: 30, vx: 0, vy: 0, size: 36 },
  m10: { id: "m10", x: 430, y: 250, vx: 0, vy: 0, size: 36 },
  m11: { id: "m11", x: 490, y: 170, vx: 0, vy: 0, size: 36 },
  m12: { id: "m12", x: 480, y: 80, vx: 0, vy: 0, size: 36 },
}

export function Keanggotaan() {
  const [viewMode, setViewMode] = useState<"hierarchy" | "network">("hierarchy")
  const [selectedId, setSelectedId] = useState<string>("m1")
  const [searchQuery, setSearchQuery] = useState("")

  // Cascading filter states
  const [selectedProvinsi, setSelectedProvinsi] = useState("Semua")
  const [selectedKabupaten, setSelectedKabupaten] = useState("Semua")
  const [selectedKelurahan, setSelectedKelurahan] = useState("Semua")

  // Drag and Physics state refs (using refs to guarantee smooth 60 FPS animation loop updates)
  const nodesRef = useRef<Record<string, NodePhysics>>(JSON.parse(JSON.stringify(INITIAL_PHYSICS_NODES)))
  const [positions, setPositions] = useState<Record<string, { x: number; y: number; size: number }>>({})
  
  const draggingIdRef = useRef<string | null>(null)
  const dragTargetRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 })
  const containerRef = useRef<HTMLDivElement>(null)

  // Force-directed layout physics solver tick loop
  useEffect(() => {
    if (viewMode !== "network") return

    let animFrameId: number
    const kRepel = 700      // Node repulsion constant
    const kSpring = 0.05    // Hooke's spring constant
    const rLength = 100     // Spring resting length
    const kGravity = 0.015  // Pull to center force
    const damping = 0.84    // Damping factor to slow down nodes
    const cx = 260
    const cy = 200

    const tick = () => {
      const keys = Object.keys(nodesRef.current)
      
      // 1. Repulsion force calculation (Coulomb's Law)
      for (let i = 0; i < keys.length; i++) {
        const n1 = nodesRef.current[keys[i]]
        for (let j = i + 1; j < keys.length; j++) {
          const n2 = nodesRef.current[keys[j]]
          const dx = n2.x - n1.x
          const dy = n2.y - n1.y
          const distSqr = dx * dx + dy * dy + 1e-4
          const dist = Math.sqrt(distSqr)
          if (dist < 220) {
            const force = kRepel / distSqr
            const fx = (dx / dist) * force
            const fy = (dy / dist) * force
            n1.vx -= fx
            n1.vy -= fy
            n2.vx += fx
            n2.vy += fy
          }
        }
      }

      // 2. Attraction force calculation (Hooke's Law springs)
      for (const link of LINKS) {
        const n1 = nodesRef.current[link.source]
        const n2 = nodesRef.current[link.target]
        if (!n1 || !n2) continue
        const dx = n2.x - n1.x
        const dy = n2.y - n1.y
        const dist = Math.sqrt(dx * dx + dy * dy) || 1e-4
        const delta = dist - rLength
        const force = delta * kSpring
        const fx = (dx / dist) * force
        const fy = (dy / dist) * force
        n1.vx += fx
        n1.vy += fy
        n2.vx -= fx
        n2.vy -= fy
      }

      // 3. Gravity center pull
      for (const key of keys) {
        const n = nodesRef.current[key]
        const dx = cx - n.x
        const dy = cy - n.y
        n.vx += dx * kGravity
        n.vy += dy * kGravity
      }

      // 4. Update coordinates & boundaries
      for (const key of keys) {
        const n = nodesRef.current[key]
        
        if (key === draggingIdRef.current) {
          n.x = dragTargetRef.current.x
          n.y = dragTargetRef.current.y
          n.vx = 0
          n.vy = 0
        } else {
          n.x += n.vx
          n.y += n.vy
          n.vx *= damping
          n.vy *= damping
          
          // Container bounds constraints
          n.x = Math.max(30, Math.min(490, n.x))
          n.y = Math.max(30, Math.min(370, n.y))
        }
      }

      // 5. Synchronize physics coordinates back to React render state
      const nextPositions: Record<string, { x: number; y: number; size: number }> = {}
      for (const key of keys) {
        nextPositions[key] = {
          x: nodesRef.current[key].x,
          y: nodesRef.current[key].y,
          size: nodesRef.current[key].size,
        }
      }
      setPositions(nextPositions)

      animFrameId = requestAnimationFrame(tick)
    }

    animFrameId = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(animFrameId)
  }, [viewMode])

  // Reset node coordinates to center/default on view swaps
  useEffect(() => {
    nodesRef.current = JSON.parse(JSON.stringify(INITIAL_PHYSICS_NODES))
  }, [viewMode])

  // Cascading Location options
  const kabupatenOptions = selectedProvinsi === "Semua"
    ? Array.from(new Set(MEMBERS.map((m) => m.kabupaten)))
    : Array.from(new Set(MEMBERS.filter((m) => m.provinsi === selectedProvinsi).map((m) => m.kabupaten)))

  const kelurahanOptions = selectedKabupaten === "Semua"
    ? Array.from(new Set(MEMBERS.map((m) => m.kelurahan)))
    : Array.from(new Set(MEMBERS.filter((m) => m.kabupaten === selectedKabupaten).map((m) => m.kelurahan)))

  const handleProvinsiChange = (prov: string) => {
    setSelectedProvinsi(prov)
    setSelectedKabupaten("Semua")
    setSelectedKelurahan("Semua")
  }

  const handleKabupatenChange = (kab: string) => {
    setSelectedKabupaten(kab)
    setSelectedKelurahan("Semua")
  }

  const isMemberMatchingFilters = (m: Member) => {
    if (selectedProvinsi !== "Semua" && m.provinsi !== selectedProvinsi) return false
    if (selectedKabupaten !== "Semua" && m.kabupaten !== selectedKabupaten) return false
    if (selectedKelurahan !== "Semua" && m.kelurahan !== selectedKelurahan) return false
    return true
  }

  // Search trigger auto-selection
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

  const selectedMember = MEMBERS.find((m) => m.id === selectedId) || MEMBERS[0]

  const handleContact = (name: string) => {
    toast.success(`Menghubungi ${name}... Pesan Whatsapp berhasil dikirim via SIKORA Gateway.`)
  }

  // Draggable node graph drag-start, drag-move, and drag-end mouse handlers
  const handleNodeMouseDown = (e: React.MouseEvent, id: string) => {
    e.preventDefault()
    draggingIdRef.current = id
    setSelectedId(id)

    const rect = containerRef.current?.getBoundingClientRect()
    if (rect) {
      const mouseX = e.clientX - rect.left
      const mouseY = e.clientY - rect.top
      dragTargetRef.current = { x: mouseX, y: mouseY }
    }
  }

  const handleContainerMouseMove = (e: React.MouseEvent) => {
    if (!draggingIdRef.current || !containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const mouseX = e.clientX - rect.left
    const mouseY = e.clientY - rect.top

    // Keep dragging coordinates locked to center pointer
    dragTargetRef.current = {
      x: Math.max(30, Math.min(rect.width - 30, mouseX)),
      y: Math.max(30, Math.min(rect.height - 30, mouseY)),
    }
  }

  const handleContainerMouseUp = () => {
    draggingIdRef.current = null
  }

  return (
    <div className="space-y-5">
      <PageHeader
        title="Keanggotaan & Tata Kelola"
        subtitle="Rekayasa transparansi tata kelola dan visualisasi jejaring sistem keanggotaan digital."
      />

      {/* Control Bar */}
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
            Jejaring Node Anggota
          </button>
        </div>

        {/* Search bar */}
        <div className="relative w-60">
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
          className="lg:col-span-2 min-h-[600px] flex flex-col overflow-visible"
          title={viewMode === "hierarchy" ? "Struktur Organisasi Harian" : "Jejaring Interaksi Tata Kelola (Physics Graph)"}
          subtitle={
            viewMode === "hierarchy"
              ? "Menampilkan jalur kepemimpinan dan penugasan divisi"
              : "Tarik (drag) foto anggota menggunakan mouse untuk merasakan pergerakan elastic bubble jejaring node."
          }
        >
          {/* Cascading Filter Controls inside card content */}
          <div className="flex flex-wrap items-center gap-2 border-b border-slate-100 pb-3 mb-4 shrink-0">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider mr-1.5">Filter Wilayah:</span>
            {/* Provinsi */}
            <div className="relative">
              <select
                value={selectedProvinsi}
                onChange={(e) => handleProvinsiChange(e.target.value)}
                className="appearance-none rounded-full border border-slate-200 bg-white pl-3.5 pr-8 py-1.5 text-[11px] font-bold text-slate-650 outline-none cursor-pointer hover:border-slate-300 transition-all shadow-sm"
              >
                <option value="Semua">Provinsi: Semua</option>
                <option value="Jawa Barat">Jawa Barat</option>
                <option value="Jawa Tengah">Jawa Tengah</option>
              </select>
              <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 size-3.5 -translate-y-1/2 text-slate-400 stroke-[2.5]" />
            </div>

            {/* Kabupaten */}
            <div className="relative">
              <select
                value={selectedKabupaten}
                onChange={(e) => handleKabupatenChange(e.target.value)}
                className="appearance-none rounded-full border border-slate-200 bg-white pl-3.5 pr-8 py-1.5 text-[11px] font-bold text-slate-650 outline-none cursor-pointer hover:border-slate-300 transition-all shadow-sm"
              >
                <option value="Semua">Kabupaten: Semua</option>
                {kabupatenOptions.map((kab) => (
                  <option key={kab} value={kab}>{kab}</option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 size-3.5 -translate-y-1/2 text-slate-400 stroke-[2.5]" />
            </div>

            {/* Kelurahan */}
            <div className="relative">
              <select
                value={selectedKelurahan}
                onChange={(e) => setSelectedKelurahan(e.target.value)}
                className="appearance-none rounded-full border border-slate-200 bg-white pl-3.5 pr-8 py-1.5 text-[11px] font-bold text-slate-650 outline-none cursor-pointer hover:border-slate-300 transition-all shadow-sm"
              >
                <option value="Semua">Kelurahan: Semua</option>
                {kelurahanOptions.map((kel) => (
                  <option key={kel} value={kel}>{kel}</option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 size-3.5 -translate-y-1/2 text-slate-400 stroke-[2.5]" />
            </div>
          </div>

          {viewMode === "hierarchy" ? (
            /* --- HIERARCHY / ORG CHART VIEW --- */
            <div className="flex-1 py-8 flex flex-col items-center min-w-[700px] overflow-visible select-none">
              {/* LEVEL 1: Chairman */}
              <div className="flex flex-col items-center">
                <div
                  onClick={() => setSelectedId("m1")}
                  className={`relative flex flex-col items-center justify-center p-3 rounded-2xl border bg-white shadow-sm cursor-pointer transition-all duration-300 w-52 hover:scale-[1.03] hover:shadow-md ${
                    selectedId === "m1" ? "border-blue-600 ring-2 ring-blue-500/20" : "border-slate-100"
                  } ${isMemberMatchingFilters(MEMBERS[0]) ? "opacity-100" : "opacity-25"}`}
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
                        } ${isMemberMatchingFilters(m) ? "opacity-100" : "opacity-25"}`}
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
                            className={`relative flex items-center gap-2 p-2 rounded-xl border bg-white cursor-pointer transition-all duration-355 hover:scale-[1.02] hover:shadow-sm ${
                              selectedId === sub.id ? "border-blue-600 ring-1.5 ring-blue-500/20" : "border-slate-100"
                            } ${isMemberMatchingFilters(sub) ? "opacity-100" : "opacity-25"} before:absolute before:-left-3.5 before:top-1/2 before:-translate-y-1/2 before:w-3.5 before:h-0.5 before:bg-slate-200`}
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
            /* --- OBSIDIAN-STYLE DYNAMIC PHYSICS-BASED NETWORK VIEW --- */
            <div
              ref={containerRef}
              onMouseMove={handleContainerMouseMove}
              onMouseUp={handleContainerMouseUp}
              onMouseLeave={handleContainerMouseUp}
              className="flex-1 flex items-center justify-center p-4 overflow-hidden relative select-none min-h-[460px] cursor-grab active:cursor-grabbing bg-slate-50/20 rounded-2xl"
            >
              {/* Radial background grid rings */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03]">
                <div className="border border-slate-900 rounded-full w-[240px] h-[240px] absolute" />
                <div className="border border-slate-900 rounded-full w-[440px] h-[440px] absolute" />
                <div className="border border-slate-900 rounded-full w-[600px] h-[600px] absolute" />
              </div>

              {/* Obsidian Graph Interactive SVG Lines */}
              <div className="relative w-[520px] h-[320px] pointer-events-none">
                <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible">
                  {/* Lines between Budi (m1) and Managers */}
                  {positions.m1 && positions.m2 && (
                    <line x1={positions.m1.x} y1={positions.m1.y} x2={positions.m2.x} y2={positions.m2.y} stroke="#94a3b8" strokeWidth="2.5" strokeDasharray="3 3" opacity={isMemberMatchingFilters(MEMBERS[0]) && isMemberMatchingFilters(MEMBERS[1]) ? 0.8 : 0.15} />
                  )}
                  {positions.m1 && positions.m3 && (
                    <line x1={positions.m1.x} y1={positions.m1.y} x2={positions.m3.x} y2={positions.m3.y} stroke="#94a3b8" strokeWidth="2.5" strokeDasharray="3 3" opacity={isMemberMatchingFilters(MEMBERS[0]) && isMemberMatchingFilters(MEMBERS[2]) ? 0.8 : 0.15} />
                  )}
                  {positions.m1 && positions.m4 && (
                    <line x1={positions.m1.x} y1={positions.m1.y} x2={positions.m4.x} y2={positions.m4.y} stroke="#94a3b8" strokeWidth="2.5" strokeDasharray="3 3" opacity={isMemberMatchingFilters(MEMBERS[0]) && isMemberMatchingFilters(MEMBERS[3]) ? 0.8 : 0.15} />
                  )}

                  {/* Lines from Managers to Subordinates */}
                  {/* Ahmad's (m2) Subordinates */}
                  {positions.m2 && positions.m5 && (
                    <line x1={positions.m2.x} y1={positions.m2.y} x2={positions.m5.x} y2={positions.m5.y} stroke="#cbd5e1" strokeWidth="1.5" opacity={isMemberMatchingFilters(MEMBERS[1]) && isMemberMatchingFilters(MEMBERS[4]) ? 0.7 : 0.1} />
                  )}
                  {positions.m2 && positions.m6 && (
                    <line x1={positions.m2.x} y1={positions.m2.y} x2={positions.m6.x} y2={positions.m6.y} stroke="#cbd5e1" strokeWidth="1.5" opacity={isMemberMatchingFilters(MEMBERS[1]) && isMemberMatchingFilters(MEMBERS[5]) ? 0.7 : 0.1} />
                  )}
                  {positions.m2 && positions.m7 && (
                    <line x1={positions.m2.x} y1={positions.m2.y} x2={positions.m7.x} y2={positions.m7.y} stroke="#cbd5e1" strokeWidth="1.5" opacity={isMemberMatchingFilters(MEMBERS[1]) && isMemberMatchingFilters(MEMBERS[6]) ? 0.7 : 0.1} />
                  )}

                  {/* Siti's (m3) Subordinates */}
                  {positions.m3 && positions.m8 && (
                    <line x1={positions.m3.x} y1={positions.m3.y} x2={positions.m8.x} y2={positions.m8.y} stroke="#cbd5e1" strokeWidth="1.5" opacity={isMemberMatchingFilters(MEMBERS[2]) && isMemberMatchingFilters(MEMBERS[7]) ? 0.7 : 0.1} />
                  )}
                  {positions.m3 && positions.m9 && (
                    <line x1={positions.m3.x} y1={positions.m3.y} x2={positions.m9.x} y2={positions.m9.y} stroke="#cbd5e1" strokeWidth="1.5" opacity={isMemberMatchingFilters(MEMBERS[2]) && isMemberMatchingFilters(MEMBERS[8]) ? 0.7 : 0.1} />
                  )}

                  {/* Dewi's (m4) Subordinates */}
                  {positions.m4 && positions.m10 && (
                    <line x1={positions.m4.x} y1={positions.m4.y} x2={positions.m10.x} y2={positions.m10.y} stroke="#cbd5e1" strokeWidth="1.5" opacity={isMemberMatchingFilters(MEMBERS[3]) && isMemberMatchingFilters(MEMBERS[9]) ? 0.7 : 0.1} />
                  )}
                  {positions.m4 && positions.m11 && (
                    <line x1={positions.m4.x} y1={positions.m4.y} x2={positions.m11.x} y2={positions.m11.y} stroke="#cbd5e1" strokeWidth="1.5" opacity={isMemberMatchingFilters(MEMBERS[3]) && isMemberMatchingFilters(MEMBERS[10]) ? 0.7 : 0.1} />
                  )}
                  {positions.m4 && positions.m12 && (
                    <line x1={positions.m4.x} y1={positions.m4.y} x2={positions.m12.x} y2={positions.m12.y} stroke="#cbd5e1" strokeWidth="1.5" opacity={isMemberMatchingFilters(MEMBERS[3]) && isMemberMatchingFilters(MEMBERS[11]) ? 0.7 : 0.1} />
                  )}
                </svg>

                {/* Profile Nodes */}
                {MEMBERS.map((m) => {
                  const pos = positions[m.id]
                  if (!pos) return null

                  const isSelected = selectedId === m.id
                  const size = pos.size
                  const matches = isMemberMatchingFilters(m)

                  return (
                    <div
                      key={m.id}
                      onMouseDown={(e) => handleNodeMouseDown(e, m.id)}
                      style={{
                        position: "absolute",
                        left: pos.x,
                        top: pos.y,
                        width: size,
                        height: size,
                        transform: "translate(-50%, -50%)",
                      }}
                      className={`group pointer-events-auto flex items-center justify-center rounded-full bg-white transition-shadow duration-200 select-none border cursor-grab active:cursor-grabbing ${
                        isSelected
                          ? "border-blue-600 ring-4 ring-blue-500/20 shadow-md scale-105"
                          : "border-slate-200 hover:border-blue-400 hover:shadow-sm"
                      } ${matches ? "opacity-100 animate-pulse-once" : "opacity-15 pointer-events-none"}`}
                    >
                      <img
                        src={m.avatar}
                        style={{
                          width: size - (size > 50 ? 6 : 4),
                          height: size - (size > 50 ? 6 : 4),
                        }}
                        className="rounded-full object-cover pointer-events-none"
                        alt={m.name}
                      />

                      {/* Tooltip on hover */}
                      <span className="pointer-events-none absolute bottom-full left-1/2 z-10 -translate-x-1/2 mb-2 scale-0 group-hover:scale-100 rounded bg-slate-900/95 px-2 py-1 text-[9px] font-semibold text-white whitespace-nowrap transition-all duration-200 shadow">
                        {m.name} ({m.role})
                      </span>
                    </div>
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
                  <span className="text-slate-400 font-medium">Wilayah Anggota</span>
                  <span className="font-bold text-slate-700 text-right text-[11px]">
                    {selectedMember.kelurahan}, {selectedMember.kabupaten}, {selectedMember.provinsi}
                  </span>
                </div>
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
                  className="flex-1 flex justify-center items-center gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 text-xs font-bold transition-all shadow-sm shadow-emerald-500/20"
                >
                  <Phone className="size-3.5" /> WhatsApp
                </button>
                <button
                  onClick={() => {
                    window.dispatchEvent(
                      new CustomEvent("open-sikora-chat", {
                        detail: {
                          id: selectedMember.id,
                          name: selectedMember.name,
                          role: selectedMember.role,
                          avatar: selectedMember.avatar,
                        },
                      })
                    )
                  }}
                  className="flex-1 flex justify-center items-center gap-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white py-2.5 text-xs font-bold transition-all shadow-sm shadow-blue-500/20"
                >
                  <MessageSquare className="size-3.5" /> Kirim Pesan
                </button>
              </div>
            </SectionCard>
          </div>
        </Reveal>
      </div>
    </div>
  )
}
