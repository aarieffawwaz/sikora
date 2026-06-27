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

// Graph topology links
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

// Dept colour palette used for node rings and SVG lines
const DEPT_COLOR: Record<string, string> = {
  "Pengurus Harian": "#3b82f6",
  "Divisi Operasional": "#10b981",
  "Divisi Keuangan": "#f59e0b",
  "Divisi AI & Kemitraan": "#8b5cf6",
}

interface NodePhysics {
  id: string
  x: number
  y: number
  vx: number
  vy: number
  r: number   // radius
}

// Canvas size — matches the SVG viewBox
const GW = 600
const GH = 420

function makeInitialNodes(): Record<string, NodePhysics> {
  // Spread nodes in a circle so the physics settles cleanly from the start
  const cx = GW / 2
  const cy = GH / 2
  const ids = MEMBERS.map((m) => m.id)
  const radii: Record<string, number> = {
    m1: 34, m2: 24, m3: 24, m4: 24,
    m5: 17, m6: 17, m7: 17, m8: 17, m9: 17, m10: 17, m11: 17, m12: 17,
  }
  const nodes: Record<string, NodePhysics> = {}
  ids.forEach((id, i) => {
    const angle = (i / ids.length) * 2 * Math.PI
    const spread = id === "m1" ? 0 : (id.length === 2 ? 130 : 230)
    nodes[id] = {
      id,
      x: cx + spread * Math.cos(angle),
      y: cy + spread * Math.sin(angle),
      vx: 0,
      vy: 0,
      r: radii[id] ?? 17,
    }
  })
  return nodes
}

// ---  Pure-SVG force-directed network graph component ---
// Uses direct DOM mutation (no React state updates during animation)
// so it achieves smooth 60fps without any React re-render overhead.
function ForceGraph({
  members,
  links,
  selectedId,
  onSelectId,
  filterFn,
}: {
  members: Member[]
  links: typeof LINKS
  selectedId: string
  onSelectId: (id: string) => void
  filterFn: (m: Member) => boolean
}) {
  const svgRef = useRef<SVGSVGElement>(null)
  const nodesRef = useRef<Record<string, NodePhysics>>(makeInitialNodes())
  const lineRefs = useRef<Record<string, SVGLineElement | null>>({})
  const circleGroupRefs = useRef<Record<string, SVGGElement | null>>({})
  const draggingRef = useRef<string | null>(null)
  const selectedIdRef = useRef(selectedId)
  const filterFnRef = useRef(filterFn)

  // Keep refs in sync with props without re-triggering the animation loop
  useEffect(() => { selectedIdRef.current = selectedId }, [selectedId])
  useEffect(() => { filterFnRef.current = filterFn }, [filterFn])

  // Reset physics when mounted
  useEffect(() => {
    nodesRef.current = makeInitialNodes()
  }, [])

  // Single animation loop — runs once, mutates DOM directly
  useEffect(() => {
    let raf: number

    // Well-tuned physics constants
    const REPEL   = 4500   // Coulomb repulsion strength
    const SPRING  = 0.035  // Hooke spring stiffness
    const REST    = 120    // Spring resting length
    const GRAVITY = 0.008  // Pull toward canvas centre
    const DAMP    = 0.78   // Velocity damping (lower = settles faster)
    const MAX_V   = 8      // Speed cap to prevent explosions
    const MARGIN  = 36     // Canvas edge buffer

    const tick = () => {
      const ns = nodesRef.current
      const keys = Object.keys(ns)

      // --- 1. Pairwise Coulomb repulsion ---
      for (let i = 0; i < keys.length; i++) {
        for (let j = i + 1; j < keys.length; j++) {
          const a = ns[keys[i]], b = ns[keys[j]]
          const dx = b.x - a.x
          const dy = b.y - a.y
          const dist2 = dx * dx + dy * dy
          const dist  = Math.sqrt(dist2) || 0.01
          const minD  = a.r + b.r + 20
          if (dist < 300) {
            const f = REPEL / (dist2 + 100)
            const nx = dx / dist, ny = dy / dist
            a.vx -= nx * f; a.vy -= ny * f
            b.vx += nx * f; b.vy += ny * f
            // Hard overlap separation
            if (dist < minD) {
              const push = (minD - dist) * 0.5
              a.x -= nx * push; a.y -= ny * push
              b.x += nx * push; b.y += ny * push
            }
          }
        }
      }

      // --- 2. Hooke spring attraction along links ---
      for (const { source, target } of links) {
        const a = ns[source], b = ns[target]
        if (!a || !b) continue
        const dx = b.x - a.x
        const dy = b.y - a.y
        const dist = Math.sqrt(dx * dx + dy * dy) || 0.01
        const delta = dist - REST
        const f = SPRING * delta
        const nx = dx / dist, ny = dy / dist
        a.vx += nx * f; a.vy += ny * f
        b.vx -= nx * f; b.vy -= ny * f
      }

      // --- 3. Gravity pull to canvas centre ---
      const cx = GW / 2, cy = GH / 2
      for (const k of keys) {
        const n = ns[k]
        n.vx += (cx - n.x) * GRAVITY
        n.vy += (cy - n.y) * GRAVITY
      }

      // --- 4. Integrate + clamp ---
      for (const k of keys) {
        const n = ns[k]
        if (k === draggingRef.current) continue
        // Clamp velocity
        const speed = Math.sqrt(n.vx * n.vx + n.vy * n.vy)
        if (speed > MAX_V) { n.vx = (n.vx / speed) * MAX_V; n.vy = (n.vy / speed) * MAX_V }
        n.x += n.vx; n.y += n.vy
        n.vx *= DAMP;  n.vy *= DAMP
        // Boundary bounce
        const lo = MARGIN + n.r, hiX = GW - MARGIN - n.r, hiY = GH - MARGIN - n.r
        if (n.x < lo)  { n.x = lo;  n.vx =  Math.abs(n.vx) * 0.4 }
        if (n.x > hiX) { n.x = hiX; n.vx = -Math.abs(n.vx) * 0.4 }
        if (n.y < lo)  { n.y = lo;  n.vy =  Math.abs(n.vy) * 0.4 }
        if (n.y > hiY) { n.y = hiY; n.vy = -Math.abs(n.vy) * 0.4 }
      }

      // --- 5. Direct DOM mutation — ZERO React state updates ---
      // Update SVG lines
      for (const { source, target } of links) {
        const el = lineRefs.current[`${source}-${target}`]
        if (!el) continue
        const a = ns[source], b = ns[target]
        el.setAttribute("x1", String(a.x))
        el.setAttribute("y1", String(a.y))
        el.setAttribute("x2", String(b.x))
        el.setAttribute("y2", String(b.y))
      }
      // Update node group positions
      for (const k of keys) {
        const g = circleGroupRefs.current[k]
        if (!g) continue
        g.setAttribute("transform", `translate(${ns[k].x},${ns[k].y})`)
      }

      raf = requestAnimationFrame(tick)
    }

    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [links])

  // Drag handlers (pointer events on the SVG element itself)
  const handlePointerDown = (e: React.PointerEvent<SVGSVGElement>) => {
    const target = e.target as SVGElement
    const gEl = target.closest<SVGGElement>("[data-node-id]")
    if (!gEl) return
    const id = gEl.dataset.nodeId!
    draggingRef.current = id
    onSelectId(id)
    ;(e.currentTarget as SVGSVGElement).setPointerCapture(e.pointerId)
  }

  const handlePointerMove = (e: React.PointerEvent<SVGSVGElement>) => {
    if (!draggingRef.current || !svgRef.current) return
    const rect = svgRef.current.getBoundingClientRect()
    const scaleX = GW / rect.width
    const scaleY = GH / rect.height
    const n = nodesRef.current[draggingRef.current]
    if (!n) return
    n.x = Math.max(n.r + 4, Math.min(GW - n.r - 4, (e.clientX - rect.left) * scaleX))
    n.y = Math.max(n.r + 4, Math.min(GH - n.r - 4, (e.clientY - rect.top)  * scaleY))
    n.vx = 0; n.vy = 0
  }

  const handlePointerUp = () => { draggingRef.current = null }

  const memberMap = Object.fromEntries(members.map((m) => [m.id, m]))

  return (
    <svg
      ref={svgRef}
      viewBox={`0 0 ${GW} ${GH}`}
      className="w-full h-full"
      style={{ touchAction: "none", cursor: draggingRef.current ? "grabbing" : "grab" }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
    >
      <defs>
        {/* Radial glow filter */}
        <filter id="glow" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <filter id="glow-strong" x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="7" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        {/* Subtle background dots grid */}
        <pattern id="dots" x="0" y="0" width="24" height="24" patternUnits="userSpaceOnUse">
          <circle cx="2" cy="2" r="1" fill="#e2e8f0" />
        </pattern>
        {/* Gradient defs for links */}
        {links.map(({ source, target }) => {
          const sm = memberMap[source], tm = memberMap[target]
          if (!sm || !tm) return null
          const id = `lg-${source}-${target}`
          return (
            <linearGradient key={id} id={id} gradientUnits="userSpaceOnUse"
              x1={nodesRef.current[source]?.x ?? 0} y1={nodesRef.current[source]?.y ?? 0}
              x2={nodesRef.current[target]?.x ?? 0} y2={nodesRef.current[target]?.y ?? 0}
            >
              <stop offset="0%"  stopColor={DEPT_COLOR[sm.dept] ?? "#94a3b8"} stopOpacity="0.7" />
              <stop offset="100%" stopColor={DEPT_COLOR[tm.dept] ?? "#94a3b8"} stopOpacity="0.35" />
            </linearGradient>
          )
        })}
      </defs>

      {/* Background grid */}
      <rect width={GW} height={GH} fill="url(#dots)" rx="16" opacity="0.5" />

      {/* Subtle concentric rings from centre */}
      {[80, 160, 250].map((r) => (
        <circle key={r} cx={GW / 2} cy={GH / 2} r={r}
          fill="none" stroke="#e2e8f0" strokeWidth="1" opacity="0.5" strokeDasharray="4 6" />
      ))}

      {/* Links — refs updated directly by physics loop */}
      {links.map(({ source, target }) => {
        const sm = memberMap[source]
        if (!sm) return null
        const matchesBoth = filterFnRef.current(sm) && filterFnRef.current(memberMap[target])
        const initA = nodesRef.current[source]
        const initB = nodesRef.current[target]
        const isMajor = source === "m1"
        return (
          <line
            key={`${source}-${target}`}
            ref={(el) => { lineRefs.current[`${source}-${target}`] = el }}
            x1={initA?.x ?? GW / 2} y1={initA?.y ?? GH / 2}
            x2={initB?.x ?? GW / 2} y2={initB?.y ?? GH / 2}
            stroke={`url(#lg-${source}-${target})`}
            strokeWidth={isMajor ? 2.5 : 1.5}
            strokeLinecap="round"
            opacity={matchesBoth ? (isMajor ? 0.9 : 0.65) : 0.1}
            style={{ transition: "opacity 0.3s" }}
          />
        )
      })}

      {/* Nodes — each is an SVG <g> whose transform is mutated directly */}
      {members.map((m) => {
        const initN = nodesRef.current[m.id]
        const isSelected = m.id === selectedIdRef.current
        const matches = filterFnRef.current(m)
        const color = DEPT_COLOR[m.dept] ?? "#94a3b8"
        const r = initN?.r ?? 17
        const fontSize = r > 25 ? 9 : 7.5

        return (
          <g
            key={m.id}
            ref={(el) => { circleGroupRefs.current[m.id] = el }}
            data-node-id={m.id}
            transform={`translate(${initN?.x ?? GW / 2},${initN?.y ?? GH / 2})`}
            style={{ cursor: "grab", opacity: matches ? 1 : 0.12, transition: "opacity 0.3s" }}
          >
            {/* Outer glow ring for selected */}
            {isSelected && (
              <circle r={r + 10} fill={color} opacity={0.18} filter="url(#glow-strong)" />
            )}
            {/* Department colour aura */}
            <circle r={r + 4} fill={color} opacity={matches ? 0.15 : 0.04} />
            {/* Department ring */}
            <circle r={r + 2} fill="none" stroke={color}
              strokeWidth={isSelected ? 2.5 : 1.5}
              opacity={matches ? 0.8 : 0.2}
              filter={isSelected ? "url(#glow)" : undefined}
            />
            {/* White avatar bg */}
            <circle r={r} fill="white" stroke="#e2e8f0" strokeWidth="1" />
            {/* Clip avatar image */}
            <clipPath id={`clip-${m.id}`}><circle r={r - 2} /></clipPath>
            <image
              href={m.avatar}
              x={-(r - 2)} y={-(r - 2)}
              width={(r - 2) * 2} height={(r - 2) * 2}
              clipPath={`url(#clip-${m.id})`}
              preserveAspectRatio="xMidYMid slice"
              style={{ pointerEvents: "none" }}
            />
            {/* Name label below node */}
            <text
              y={r + 13}
              textAnchor="middle"
              fontSize={fontSize}
              fontWeight={isSelected ? "800" : "600"}
              fill={isSelected ? "#1e40af" : "#475569"}
              style={{ pointerEvents: "none", userSelect: "none", letterSpacing: "0.01em" }}
            >
              {m.name.split(" ")[0]}
            </text>
          </g>
        )
      })}
    </svg>
  )
}

export function Keanggotaan() {
  const [viewMode, setViewMode] = useState<"hierarchy" | "network">("hierarchy")
  const [selectedId, setSelectedId] = useState<string>("m1")
  const [searchQuery, setSearchQuery] = useState("")

  // Cascading filter states
  const [selectedProvinsi, setSelectedProvinsi] = useState("Semua")
  const [selectedKabupaten, setSelectedKabupaten] = useState("Semua")
  const [selectedKelurahan, setSelectedKelurahan] = useState("Semua")

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
            /* --- SMOOTH PHYSICS-BASED SVG NODE GRAPH --- */
            <div className="flex-1 relative rounded-2xl overflow-hidden bg-slate-50/30 border border-slate-100" style={{ minHeight: 420 }}>
              <ForceGraph
                members={MEMBERS}
                links={LINKS}
                selectedId={selectedId}
                onSelectId={setSelectedId}
                filterFn={isMemberMatchingFilters}
              />
              {/* Department legend */}
              <div className="absolute bottom-3 left-3 flex flex-wrap gap-x-4 gap-y-1.5 text-[10px] font-bold text-slate-500 pointer-events-none">
                {Object.entries(DEPT_COLOR).map(([dept, color]) => (
                  <span key={dept} className="flex items-center gap-1.5">
                    <span className="size-2.5 rounded-full" style={{ backgroundColor: color }} />
                    {dept.replace("Divisi ", "")}
                  </span>
                ))}
              </div>
              {/* Hint */}
              <div className="absolute top-3 right-3 text-[9.5px] font-semibold text-slate-400 pointer-events-none select-none">
                🖱 Tarik node untuk merasakan gaya fisika
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
