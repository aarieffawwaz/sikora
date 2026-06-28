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
  Users,
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
  // ── Struktur Pengurus ──────────────────────────────────────────────────
  {
    id: "m1",
    name: "Yafie Irfan Hilmi",
    role: "Ketua",
    dept: "Pengurus",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
    code: "KDKMP-001",
    joined: "12 Mar 2020",
    status: "Aktif",
    simpananPokok: "Rp 1.000.000",
    simpananWajib: "Rp 100.000 / bln",
    simpananSukarela: "Rp 8.500.000",
    voteShare: "1.0% (Hak Setara)",
    transparencyScore: 99,
    phone: "+62 812-3456-7890",
    email: "yafie@kdkmp.coop",
    provinsi: "Jawa Barat",
    kabupaten: "Bandung",
    kelurahan: "Ciheulang",
    activities: [
      "Memimpin rapat pleno tahunan KDKMP",
      "Penandatanganan MoU kemitraan rantai pasok",
      "Menghadiri forum koperasi nasional",
    ],
  },
  {
    id: "m2",
    name: "Mansyur Setiawan",
    role: "Wakil Ketua Bidang Usaha",
    dept: "Pengurus",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150",
    parentId: "m1",
    code: "KDKMP-002",
    joined: "15 Mar 2020",
    status: "Aktif",
    simpananPokok: "Rp 1.000.000",
    simpananWajib: "Rp 100.000 / bln",
    simpananSukarela: "Rp 4.200.000",
    voteShare: "1.0% (Hak Setara)",
    transparencyScore: 95,
    phone: "+62 813-2345-6789",
    email: "mansyur@kdkmp.coop",
    provinsi: "Jawa Barat",
    kabupaten: "Bandung",
    kelurahan: "Ciheulang",
    activities: [
      "Koordinasi unit simpan pinjam & ritel",
      "Evaluasi kinerja unit usaha Q2",
    ],
  },
  {
    id: "m3",
    name: "Alifia Yasfar Amri",
    role: "Wakil Ketua Bidang Anggota",
    dept: "Pengurus",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150",
    parentId: "m1",
    code: "KDKMP-003",
    joined: "15 Mar 2020",
    status: "Aktif",
    simpananPokok: "Rp 1.000.000",
    simpananWajib: "Rp 100.000 / bln",
    simpananSukarela: "Rp 3.800.000",
    voteShare: "1.0% (Hak Setara)",
    transparencyScore: 94,
    phone: "+62 857-4321-9876",
    email: "alifia@kdkmp.coop",
    provinsi: "Jawa Barat",
    kabupaten: "Bandung",
    kelurahan: "Ciheulang",
    activities: [
      "Rekrutmen anggota baru wilayah Selatan",
      "Program literasi keuangan grassroot",
    ],
  },
  {
    id: "m4",
    name: "Sonia Anjarwati",
    role: "Sekretaris",
    dept: "Pengurus",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150",
    parentId: "m1",
    code: "KDKMP-004",
    joined: "16 Mar 2020",
    status: "Aktif",
    simpananPokok: "Rp 1.000.000",
    simpananWajib: "Rp 100.000 / bln",
    simpananSukarela: "Rp 2.900.000",
    voteShare: "1.0% (Hak Setara)",
    transparencyScore: 96,
    phone: "+62 821-9876-5432",
    email: "sonia@kdkmp.coop",
    provinsi: "Jawa Barat",
    kabupaten: "Bandung",
    kelurahan: "Ciheulang",
    activities: [
      "Pengelolaan administrasi rapat pengurus",
      "Pengarsipan dokumen digital KDKMP",
    ],
  },
  {
    id: "m5",
    name: "Novia Anggita P.",
    role: "Bendahara",
    dept: "Pengurus",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150",
    parentId: "m1",
    code: "KDKMP-005",
    joined: "16 Mar 2020",
    status: "Aktif",
    simpananPokok: "Rp 1.000.000",
    simpananWajib: "Rp 100.000 / bln",
    simpananSukarela: "Rp 5.100.000",
    voteShare: "1.0% (Hak Setara)",
    transparencyScore: 98,
    phone: "+62 819-1234-5678",
    email: "novia@kdkmp.coop",
    provinsi: "Jawa Barat",
    kabupaten: "Bandung",
    kelurahan: "Ciheulang",
    activities: [
      "Rekonsiliasi laporan keuangan bulanan",
      "Pengelolaan simpanan pokok & wajib anggota",
    ],
  },
  // ── Struktur Pengawas ──────────────────────────────────────────────────
  {
    id: "m6",
    name: "Rubby Nur Habibi",
    role: "Ketua Pengawas",
    dept: "Pengawas",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150",
    code: "KDKMP-006",
    joined: "12 Mar 2020",
    status: "Aktif",
    simpananPokok: "Rp 1.000.000",
    simpananWajib: "Rp 100.000 / bln",
    simpananSukarela: "Rp 4.600.000",
    voteShare: "1.0% (Hak Setara)",
    transparencyScore: 97,
    phone: "+62 815-5678-1234",
    email: "rubby@kdkmp.coop",
    provinsi: "Jawa Barat",
    kabupaten: "Bandung",
    kelurahan: "Ciheulang",
    activities: [
      "Audit keuangan semester I",
      "Pengawasan kepatuhan SOP operasional",
    ],
  },
  {
    id: "m7",
    name: "Kasanudin, S.Pd",
    role: "Anggota Pengawas",
    dept: "Pengawas",
    avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150",
    parentId: "m6",
    code: "KDKMP-007",
    joined: "18 Mar 2020",
    status: "Aktif",
    simpananPokok: "Rp 1.000.000",
    simpananWajib: "Rp 100.000 / bln",
    simpananSukarela: "Rp 2.100.000",
    voteShare: "1.0% (Hak Setara)",
    transparencyScore: 91,
    phone: "+62 877-2345-6781",
    email: "kasanudin@kdkmp.coop",
    provinsi: "Jawa Barat",
    kabupaten: "Bandung",
    kelurahan: "Ciheulang",
    activities: [
      "Verifikasi laporan transaksi bulanan",
      "Evaluasi kepatuhan anggota terhadap AD/ART",
    ],
  },
  {
    id: "m8",
    name: "Udan Suhendar",
    role: "Anggota Pengawas",
    dept: "Pengawas",
    avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150",
    parentId: "m6",
    code: "KDKMP-008",
    joined: "18 Mar 2020",
    status: "Aktif",
    simpananPokok: "Rp 1.000.000",
    simpananWajib: "Rp 100.000 / bln",
    simpananSukarela: "Rp 1.800.000",
    voteShare: "1.0% (Hak Setara)",
    transparencyScore: 90,
    phone: "+62 851-6789-2345",
    email: "udan@kdkmp.coop",
    provinsi: "Jawa Barat",
    kabupaten: "Bandung",
    kelurahan: "Ciheulang",
    activities: [
      "Pemeriksaan aset inventaris koperasi",
      "Laporan pengawasan triwulanan ke RAT",
    ],
  },
]

// Graph topology links
const LINKS = [
  // Ketua → semua pengurus
  { source: "m1", target: "m2" },
  { source: "m1", target: "m3" },
  { source: "m1", target: "m4" },
  { source: "m1", target: "m5" },
  // Ketua ↔ Ketua Pengawas (koordinasi / oversight)
  { source: "m1", target: "m6" },
  // Ketua Pengawas → anggota pengawas
  { source: "m6", target: "m7" },
  { source: "m6", target: "m8" },
]

// Dept colour palette used for node rings and SVG lines
const DEPT_COLOR: Record<string, string> = {
  "Pengurus": "#3b82f6",
  "Pengawas": "#8b5cf6",
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
  const cx = GW / 2
  const cy = GH / 2
  const ids = MEMBERS.map((m) => m.id)
  const radii: Record<string, number> = {
    m1: 34, m2: 20, m3: 20, m4: 20, m5: 20, m6: 28, m7: 17, m8: 17,
  }
  const angles: Record<string, number> = {
    m1: Math.PI,
    m2: Math.PI * 1.6,
    m3: Math.PI * 1.2,
    m4: Math.PI * 0.75,
    m5: Math.PI * 0.35,
    m6: 0,
    m7: Math.PI * -0.28,
    m8: Math.PI * 0.28,
  }
  const nodes: Record<string, NodePhysics> = {}
  ids.forEach((id) => {
    const angle  = angles[id] ?? 0
    const spread = id === "m1" ? 115 : id === "m6" ? 220 : (["m2","m3","m4","m5"].includes(id) ? 165 : 295)
    nodes[id] = {
      id,
      x: cx + spread * Math.cos(angle),
      y: cy + spread * Math.sin(angle),
      vx: 0,
      vy: 0,
      r: radii[id] ?? 18,
    }
  })
  return nodes
}

// ─────────────────────────────────────────────────────────────────────────────
// ForceGraph — inspired by:
//   obsidian-extended-graph (dept hulls, rich hover tooltip, node coloring)
//   obsidian-living-graph   (animated edge flow / particle stream)
//   juggl + graph-pro       (zoom/pan, bezier edges, compound hull groups)
//   custom-node-size        (size by hierarchy level / connectivity)
//   Graph-Link-Types        (edge type annotation)
// ─────────────────────────────────────────────────────────────────────────────

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
  const svgRef        = useRef<SVGSVGElement>(null)
  const viewGroupRef  = useRef<SVGGElement | null>(null)
  const nodesRef      = useRef<Record<string, NodePhysics>>(makeInitialNodes())
  const pathRefs      = useRef<Record<string, SVGPathElement | null>>({})
  const basePathRefs  = useRef<Record<string, SVGPathElement | null>>({})
  const gradRefs      = useRef<Record<string, SVGLinearGradientElement | null>>({})
  const nodeGroupRefs = useRef<Record<string, SVGGElement | null>>({})
  const hullRefs      = useRef<Record<string, SVGEllipseElement | null>>({})

  const draggingRef   = useRef<string | null>(null)
  const pinnedRef     = useRef<Set<string>>(new Set())
  const isPanRef      = useRef(false)
  const panStartRef   = useRef({ cx: 0, cy: 0, vx: 0, vy: 0 })
  const viewRef       = useRef({ x: 0, y: 0, scale: 1 })
  const dashRef       = useRef(0)   // animated edge flow counter
  const selectedIdRef = useRef(selectedId)
  const filterFnRef   = useRef(filterFn)

  // Hover tooltip state (React state only for tooltip, not for physics)
  const [hovered, setHovered] = useState<{ id: string; sx: number; sy: number } | null>(null)

  useEffect(() => { selectedIdRef.current = selectedId }, [selectedId])
  useEffect(() => { filterFnRef.current   = filterFn   }, [filterFn])

  useEffect(() => { nodesRef.current = makeInitialNodes() }, [])

  // ── Apply zoom/pan transform to view group ──────────────────────────────
  const applyView = () => {
    const g = viewGroupRef.current
    if (!g) return
    const v = viewRef.current
    g.setAttribute("transform", `translate(${v.x},${v.y}) scale(${v.scale})`)
  }

  // ── Bezier path helper (obsidian-extended-graph / graph-pro style) ──────
  const bezierD = (ax: number, ay: number, bx: number, by: number, curve = 0.22) => {
    const mx = (ax + bx) / 2, my = (ay + by) / 2
    const dx = bx - ax, dy = by - ay
    const len = Math.sqrt(dx * dx + dy * dy) || 1
    const ox = (-dy / len) * len * curve
    const oy = ( dx / len) * len * curve
    return `M ${ax},${ay} Q ${mx + ox},${my + oy} ${bx},${by}`
  }

  // ── Hull (convex cluster blob) updater — inspired by juggl compound nodes
  const updateHulls = (ns: Record<string, NodePhysics>) => {
    const deptNodes: Record<string, NodePhysics[]> = {}
    for (const m of members) {
      if (!deptNodes[m.dept]) deptNodes[m.dept] = []
      const n = ns[m.id]; if (n) deptNodes[m.dept].push(n)
    }
    for (const [dept, nodes] of Object.entries(deptNodes)) {
      const el = hullRefs.current[dept]
      if (!el || nodes.length === 0) continue
      const cx = nodes.reduce((s, n) => s + n.x, 0) / nodes.length
      const cy = nodes.reduce((s, n) => s + n.y, 0) / nodes.length
      let rx = 0, ry = 0
      for (const n of nodes) {
        rx = Math.max(rx, Math.abs(n.x - cx) + n.r + 28)
        ry = Math.max(ry, Math.abs(n.y - cy) + n.r + 28)
      }
      el.setAttribute("cx", String(cx))
      el.setAttribute("cy", String(cy))
      el.setAttribute("rx", String(Math.max(rx, 42)))
      el.setAttribute("ry", String(Math.max(ry, 42)))
    }
  }

  // ── Main physics + render loop ──────────────────────────────────────────
  useEffect(() => {
    let raf: number
    const REPEL = 5000, SPRING = 0.032, REST = 115
    const GRAVITY = 0.007, DAMP = 0.76, MAX_V = 9, MARGIN = 40

    const tick = () => {
      const ns   = nodesRef.current
      const keys = Object.keys(ns)

      // 1. Pairwise repulsion (Coulomb)
      for (let i = 0; i < keys.length; i++) {
        for (let j = i + 1; j < keys.length; j++) {
          const a = ns[keys[i]], b = ns[keys[j]]
          const dx = b.x - a.x, dy = b.y - a.y
          const d2 = dx * dx + dy * dy
          const d  = Math.sqrt(d2) || 0.01
          const minD = a.r + b.r + 18
          if (d < 320) {
            const f = REPEL / (d2 + 80)
            const nx = dx / d, ny = dy / d
            a.vx -= nx * f; a.vy -= ny * f
            b.vx += nx * f; b.vy += ny * f
            if (d < minD) {
              const p = (minD - d) * 0.45
              a.x -= nx * p; a.y -= ny * p
              b.x += nx * p; b.y += ny * p
            }
          }
        }
      }

      // 2. Spring attraction (Hooke)
      for (const { source, target } of links) {
        const a = ns[source], b = ns[target]
        if (!a || !b) continue
        const dx = b.x - a.x, dy = b.y - a.y
        const d  = Math.sqrt(dx * dx + dy * dy) || 0.01
        const f  = SPRING * (d - REST)
        a.vx += (dx / d) * f; a.vy += (dy / d) * f
        b.vx -= (dx / d) * f; b.vy -= (dy / d) * f
      }

      // 3. Gravity to centre
      const cx = GW / 2, cy = GH / 2
      for (const k of keys) {
        const n = ns[k]
        n.vx += (cx - n.x) * GRAVITY
        n.vy += (cy - n.y) * GRAVITY
      }

      // 4. Integrate + bounds
      for (const k of keys) {
        const n = ns[k]
        if (k === draggingRef.current || pinnedRef.current.has(k)) continue
        const spd = Math.sqrt(n.vx * n.vx + n.vy * n.vy)
        if (spd > MAX_V) { n.vx = (n.vx / spd) * MAX_V; n.vy = (n.vy / spd) * MAX_V }
        n.x += n.vx; n.y += n.vy
        n.vx *= DAMP; n.vy *= DAMP
        const lo = MARGIN + n.r, hiX = GW - MARGIN - n.r, hiY = GH - MARGIN - n.r
        if (n.x < lo)  { n.x = lo;  n.vx =  Math.abs(n.vx) * 0.35 }
        if (n.x > hiX) { n.x = hiX; n.vx = -Math.abs(n.vx) * 0.35 }
        if (n.y < lo)  { n.y = lo;  n.vy =  Math.abs(n.vy) * 0.35 }
        if (n.y > hiY) { n.y = hiY; n.vy = -Math.abs(n.vy) * 0.35 }
      }

      // 5. Edge flow animation (obsidian-living-graph style)
      dashRef.current -= 0.6

      // 6. DOM mutations — zero React state
      for (const { source, target } of links) {
        const key = `${source}-${target}`
        const el = pathRefs.current[key]
        const baseEl = basePathRefs.current[key]
        if (!el) continue
        const a = ns[source], b = ns[target]
        const d = bezierD(a.x, a.y, b.x, b.y)
        
        el.setAttribute("d", d)
        if (baseEl) baseEl.setAttribute("d", d)
        el.setAttribute("stroke-dashoffset", String(dashRef.current))

        // Sync linearGradient vectors with node positions
        const gradEl = gradRefs.current[key]
        if (gradEl) {
          gradEl.setAttribute("x1", String(a.x))
          gradEl.setAttribute("y1", String(a.y))
          gradEl.setAttribute("x2", String(b.x))
          gradEl.setAttribute("y2", String(b.y))
        }
      }
      for (const k of keys) {
        const g = nodeGroupRefs.current[k]
        if (!g) continue
        g.setAttribute("transform", `translate(${ns[k].x},${ns[k].y})`)
      }

      // 7. Hull blobs (juggl compound node style)
      updateHulls(ns)

      raf = requestAnimationFrame(tick)
    }

    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [links]) // eslint-disable-line react-hooks/exhaustive-deps

  // ── Zoom via scroll wheel ────────────────────────────────────────────────
  const handleWheel = (e: React.WheelEvent<SVGSVGElement>) => {
    e.preventDefault()
    const v   = viewRef.current
    const fac = e.deltaY < 0 ? 1.12 : 0.89
    const ns  = Math.max(0.25, Math.min(4, v.scale * fac))
    const rect = svgRef.current?.getBoundingClientRect()
    if (!rect) return
    const mx = e.clientX - rect.left
    const my = e.clientY - rect.top
    viewRef.current = {
      x: mx - (mx - v.x) * (ns / v.scale),
      y: my - (my - v.y) * (ns / v.scale),
      scale: ns,
    }
    applyView()
  }

  // ── Pointer interactions ─────────────────────────────────────────────────
  const handlePointerDown = (e: React.PointerEvent<SVGSVGElement>) => {
    const gEl = (e.target as SVGElement).closest<SVGGElement>("[data-node-id]")
    if (gEl) {
      const id = gEl.dataset.nodeId!
      draggingRef.current = id
      onSelectId(id)
    } else {
      isPanRef.current = true
      panStartRef.current = { cx: e.clientX, cy: e.clientY, vx: viewRef.current.x, vy: viewRef.current.y }
    }
    svgRef.current?.setPointerCapture(e.pointerId)
  }

  const handlePointerMove = (e: React.PointerEvent<SVGSVGElement>) => {
    if (draggingRef.current && svgRef.current) {
      const rect = svgRef.current.getBoundingClientRect()
      const v = viewRef.current
      const x = ((e.clientX - rect.left) - v.x) / v.scale
      const y = ((e.clientY - rect.top)  - v.y) / v.scale
      const n = nodesRef.current[draggingRef.current]
      if (n) { n.x = x; n.y = y; n.vx = 0; n.vy = 0 }
    } else if (isPanRef.current) {
      const p = panStartRef.current
      viewRef.current.x = p.vx + (e.clientX - p.cx)
      viewRef.current.y = p.vy + (e.clientY - p.cy)
      applyView()
    }
  }

  const handlePointerUp = () => {
    draggingRef.current = null
    isPanRef.current    = false
  }

  // ── Pin node on double-click (obsidian-extended-graph pin feature) ───────
  const handleDoubleClick = (e: React.MouseEvent<SVGSVGElement>) => {
    const gEl = (e.target as SVGElement).closest<SVGGElement>("[data-node-id]")
    if (!gEl) return
    const id = gEl.dataset.nodeId!
    if (pinnedRef.current.has(id)) pinnedRef.current.delete(id)
    else pinnedRef.current.add(id)
  }

  // ── Hover tooltip handlers ───────────────────────────────────────────────
  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const gEl = (e.target as SVGElement).closest<SVGGElement>("[data-node-id]")
    if (gEl) {
      const id = gEl.dataset.nodeId!
      const rect = svgRef.current?.getBoundingClientRect()
      if (rect) setHovered({ id, sx: e.clientX - rect.left, sy: e.clientY - rect.top })
    } else {
      setHovered(null)
    }
  }

  const memberMap = Object.fromEntries(members.map((m) => [m.id, m]))
  const hovMember = hovered ? memberMap[hovered.id] : null

  // Unique departments for hull rendering
  const depts = Array.from(new Set(members.map((m) => m.dept)))

  return (
    <div className="relative w-full h-full">
      <svg
        ref={svgRef}
        viewBox={`0 0 ${GW} ${GH}`}
        className="w-full h-full"
        style={{ touchAction: "none", cursor: isPanRef.current ? "move" : draggingRef.current ? "grabbing" : "default" }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        onDoubleClick={handleDoubleClick}
        onWheel={handleWheel}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setHovered(null)}
      >
        <defs>
          <filter id="glow"  x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4" result="b" />
            <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
          <filter id="glow2" x="-70%" y="-70%" width="240%" height="240%">
            <feGaussianBlur stdDeviation="8" result="b" />
            <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
          {/* Hull blur filter for soft dept blob edges */}
          <filter id="hull-blur" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="14" />
          </filter>
          <pattern id="dots" x="0" y="0" width="28" height="28" patternUnits="userSpaceOnUse">
            <circle cx="1.5" cy="1.5" r="1" fill="#dde3ee" />
          </pattern>
          {/* Edge gradient defs */}
          {links.map(({ source, target }) => {
            const sm = memberMap[source], tm = memberMap[target]
            if (!sm || !tm) return null
            const gid = `eg-${source}-${target}`
            const initA = nodesRef.current[source]
            const initB = nodesRef.current[target]
            return (
              <linearGradient key={gid} id={gid} gradientUnits="userSpaceOnUse"
                ref={(el) => { gradRefs.current[`${source}-${target}`] = el }}
                x1={initA?.x ?? GW/2} y1={initA?.y ?? GH/2}
                x2={initB?.x ?? GW/2} y2={initB?.y ?? GH/2}
              >
                <stop offset="0%"   stopColor={DEPT_COLOR[sm.dept] ?? "#94a3b8"} stopOpacity="0.85"/>
                <stop offset="100%" stopColor={DEPT_COLOR[tm.dept] ?? "#94a3b8"} stopOpacity="0.35"/>
              </linearGradient>
            )
          })}
        </defs>

        {/* Background */}
        <rect width={GW} height={GH} fill="url(#dots)" rx="14" opacity="0.6"/>
        {[70, 155, 245].map((r) => (
          <circle key={r} cx={GW/2} cy={GH/2} r={r}
            fill="none" stroke="#dde3ee" strokeWidth="1"
            opacity="0.5" strokeDasharray="5 7"/>
        ))}

        {/* ── Main content group (zoom/pan via viewRef) — hulls are INSIDE so zoom/pan applies ── */}
        <g ref={viewGroupRef}>
          {/* ── Department hull blobs ── */}
          {depts.map((dept) => {
            const color  = DEPT_COLOR[dept] ?? "#94a3b8"
            const init   = nodesRef.current
            const mNodes = members.filter((m) => m.dept === dept).map((m) => init[m.id]).filter(Boolean)
            if (mNodes.length === 0) return null
            const hcx = mNodes.reduce((s, n) => s + n!.x, 0) / mNodes.length
            const hcy = mNodes.reduce((s, n) => s + n!.y, 0) / mNodes.length
            return (
              <ellipse
                key={dept}
                ref={(el) => { hullRefs.current[dept] = el }}
                cx={hcx} cy={hcy} rx={65} ry={55}
                fill={color}
                opacity={0.07}
                filter="url(#hull-blur)"
              />
            )
          })}

          {/* ── Bezier edges with animated flow (obsidian-living-graph) ── */}
          {links.map(({ source, target }) => {
            const sm = memberMap[source]
            if (!sm) return null
            const matchesBoth = filterFnRef.current(sm) && filterFnRef.current(memberMap[target])
            const initA = nodesRef.current[source]
            const initB = nodesRef.current[target]
            const isMajor = source === "m1"
            const key = `${source}-${target}`
            const initD = bezierD(initA?.x ?? GW/2, initA?.y ?? GH/2, initB?.x ?? GW/2, initB?.y ?? GH/2)
            // Edge flow: dashed animated path drawn over solid path
            return (
              <g key={key}>
                {/* Solid base path */}
                <path
                  ref={(el) => { basePathRefs.current[key] = el }}
                  d={initD}
                  fill="none"
                  stroke={`url(#eg-${key})`}
                  strokeWidth={isMajor ? 2.2 : 1.4}
                  strokeLinecap="round"
                  opacity={matchesBoth ? (isMajor ? 0.7 : 0.45) : 0.08}
                  style={{ transition: "opacity 0.35s" }}
                />
                {/* Animated flow dashes over the top (living-graph style) */}
                <path
                  ref={(el) => { pathRefs.current[key] = el }}
                  d={initD}
                  fill="none"
                  stroke={DEPT_COLOR[sm.dept] ?? "#94a3b8"}
                  strokeWidth={isMajor ? 2 : 1.2}
                  strokeLinecap="round"
                  strokeDasharray={isMajor ? "6 18" : "4 16"}
                  strokeDashoffset={dashRef.current}
                  opacity={matchesBoth ? (isMajor ? 0.55 : 0.3) : 0.04}
                  style={{ transition: "opacity 0.35s" }}
                />
              </g>
            )
          })}

          {/* ── Nodes ── */}
          {members.map((m) => {
            const initN = nodesRef.current[m.id]
            const isSelected = m.id === selectedIdRef.current
            const isPinned   = pinnedRef.current.has(m.id)
            const matches    = filterFnRef.current(m)
            const color      = DEPT_COLOR[m.dept] ?? "#94a3b8"
            const r          = initN?.r ?? 17
            const lblSize    = r > 28 ? 9.5 : r > 20 ? 8 : 7

            return (
              <g
                key={m.id}
                ref={(el) => { nodeGroupRefs.current[m.id] = el }}
                data-node-id={m.id}
                transform={`translate(${initN?.x ?? GW/2},${initN?.y ?? GH/2})`}
                style={{ cursor: "grab", opacity: matches ? 1 : 0.1, transition: "opacity 0.3s" }}
              >
                {/* Selected outer glow (obsidian-extended-graph selection ring) */}
                {isSelected && (
                  <circle r={r + 12} fill={color} opacity={0.2} filter="url(#glow2)"/>
                )}
                {/* Dept aura soft fill */}
                <circle r={r + 5} fill={color} opacity={matches ? 0.14 : 0.03}/>
                {/* Dept ring stroke */}
                <circle r={r + 2.5} fill="none" stroke={color}
                  strokeWidth={isSelected ? 3 : 1.8}
                  opacity={matches ? (isSelected ? 1 : 0.7) : 0.15}
                  filter={isSelected ? "url(#glow)" : undefined}
                />
                {/* White disc background */}
                <circle r={r} fill="white" stroke="#e2e8f0" strokeWidth="1.5"/>
                {/* Avatar image */}
                <clipPath id={`c-${m.id}`}><circle r={r - 1.5}/></clipPath>
                <image
                  href={m.avatar}
                  x={-(r - 1.5)} y={-(r - 1.5)}
                  width={(r - 1.5) * 2} height={(r - 1.5) * 2}
                  clipPath={`url(#c-${m.id})`}
                  preserveAspectRatio="xMidYMid slice"
                  style={{ pointerEvents: "none" }}
                />
                {/* Pin indicator (obsidian-extended-graph pin) */}
                {isPinned && (
                  <circle cx={r - 3} cy={-(r - 3)} r={5}
                    fill="#f59e0b" stroke="white" strokeWidth="1.5"/>
                )}
                {/* First-name label below node */}
                <text
                  y={r + 14}
                  textAnchor="middle"
                  fontSize={lblSize}
                  fontWeight={isSelected ? "800" : "600"}
                  fill={isSelected ? "#1d4ed8" : "#475569"}
                  style={{ pointerEvents: "none", userSelect: "none", letterSpacing: "0.015em" }}
                >
                  {m.name.split(" ")[0]}
                </text>
              </g>
            )
          })}
        </g>
      </svg>

      {/* ── Hover tooltip card (obsidian-extended-graph extended node info) ── */}
      {hovMember && hovered && (
        <div
          className="pointer-events-none absolute z-20 flex flex-col gap-1 rounded-xl bg-slate-900/92 backdrop-blur-sm px-3 py-2.5 shadow-xl border border-white/10 text-white w-48"
          style={{
            left: Math.min(hovered.sx + 14, 10000),
            top:  Math.max(hovered.sy - 64, 4),
          }}
        >
          <div className="flex items-center gap-2">
            <span
              className="size-2.5 shrink-0 rounded-full"
              style={{ backgroundColor: DEPT_COLOR[hovMember.dept] ?? "#94a3b8" }}
            />
            <span className="text-[10px] font-black truncate">{hovMember.name}</span>
          </div>
          <p className="text-[9px] font-semibold text-slate-300 leading-tight">{hovMember.role}</p>
          <p className="text-[9px] text-slate-400 leading-tight">{hovMember.dept}</p>
          <div className="mt-1 pt-1 border-t border-white/10 flex items-center gap-1.5">
            <span className="text-[8.5px] text-slate-400">Transparansi</span>
            <span className="ml-auto text-[9px] font-black text-emerald-400">{hovMember.transparencyScore}%</span>
          </div>
          <p className="text-[8px] text-slate-500 mt-0.5">Dbl-klik = pin · Scroll = zoom</p>
        </div>
      )}
    </div>
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

      {/* ── Stats Strip ─────────────────────────────────────────────────── */}
      <div className="grid grid-cols-3 gap-3">
        <div className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-white px-4 py-3 shadow-sm">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-blue-50">
            <Users className="size-4.5 text-blue-500" />
          </span>
          <div>
            <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">Total Anggota Teraktivasi</p>
            <p className="text-lg font-black text-slate-800 leading-tight">2.477.207</p>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-white px-4 py-3 shadow-sm">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-sky-50">
            <UserCheck className="size-4.5 text-sky-500" />
          </span>
          <div>
            <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">Laki-Laki</p>
            <p className="text-lg font-black text-sky-600 leading-tight">1.487.630</p>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-white px-4 py-3 shadow-sm">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-pink-50">
            <UserCheck className="size-4.5 text-pink-400" />
          </span>
          <div>
            <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">Perempuan</p>
            <p className="text-lg font-black text-pink-500 leading-tight">989.577</p>
          </div>
        </div>
      </div>

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
          title={viewMode === "hierarchy" ? "Struktur Organisasi Harian" : "Jejaring Interaksi Tata Kelola"}
          subtitle={
            viewMode === "hierarchy"
              ? "Menampilkan jalur kepemimpinan dan penugasan divisi"
              : "Visualisasi jejaring node interaktif · scroll untuk zoom · drag latar untuk geser · dbl-klik untuk pin"
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
            <div className="flex-1 py-6 px-4 flex flex-col gap-8 overflow-auto select-none">

              {/* ═══ STRUKTUR PENGURUS ═══════════════════════════════════════ */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <span className="size-2.5 rounded-full bg-blue-500" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-blue-600">Struktur Pengurus</span>
                </div>

                <div className="flex flex-col items-center">
                  <div
                    onClick={() => setSelectedId("m1")}
                    className={`relative flex flex-col items-center justify-center p-3 rounded-2xl border bg-white shadow-sm cursor-pointer transition-all duration-300 w-52 hover:scale-[1.03] hover:shadow-md ${
                      selectedId === "m1" ? "border-blue-600 ring-2 ring-blue-500/20" : "border-slate-100"
                    } ${isMemberMatchingFilters(MEMBERS[0]) ? "opacity-100" : "opacity-25"}`}
                  >
                    <span className="absolute -top-2.5 bg-blue-100 text-blue-700 text-[9px] font-black uppercase px-2 py-0.5 rounded-full border border-blue-200">
                      Ketua
                    </span>
                    <img src={MEMBERS[0].avatar} className="size-12 rounded-full object-cover border-2 border-white ring-2 ring-blue-100" alt={MEMBERS[0].name} />
                    <h4 className="mt-2 text-xs font-bold text-slate-800 text-center">{MEMBERS[0].name}</h4>
                    <p className="text-[10px] font-medium text-slate-400 mt-0.5">{MEMBERS[0].role}</p>
                    <div className="mt-2 w-full border-t border-slate-50 pt-1.5 flex justify-between items-center text-[9px] font-semibold text-slate-400">
                      <span className="flex items-center gap-0.5"><ShieldCheck className="size-3 text-emerald-500" /> {MEMBERS[0].transparencyScore}%</span>
                      <span>{MEMBERS[0].code}</span>
                    </div>
                  </div>

                  <div className="w-0.5 h-5 bg-slate-200" />

                  <div className="relative w-full flex flex-col items-center">
                    <div className="absolute top-0 h-0.5 bg-slate-200" style={{ left: "10%", right: "10%" }} />
                    <div className="w-full grid grid-cols-4 gap-3 pt-0.5">
                      {[MEMBERS[1], MEMBERS[2], MEMBERS[3], MEMBERS[4]].map((m) => (
                        <div key={m.id} className="flex flex-col items-center">
                          <div className="w-0.5 h-5 bg-slate-200" />
                          <div
                            onClick={() => setSelectedId(m.id)}
                            className={`relative flex flex-col items-center p-2.5 rounded-2xl border bg-white shadow-sm cursor-pointer transition-all duration-300 w-full hover:scale-[1.03] hover:shadow-md ${
                              selectedId === m.id ? "border-blue-600 ring-2 ring-blue-500/20" : "border-slate-100"
                            } ${isMemberMatchingFilters(m) ? "opacity-100" : "opacity-25"}`}
                          >
                            <span className="absolute -top-2 bg-slate-100 text-slate-500 text-[8px] font-black uppercase px-1.5 py-0.5 rounded-full border border-slate-200">
                              Pengurus
                            </span>
                            <img src={m.avatar} className="size-9 rounded-full object-cover border-2 border-white ring-1 ring-slate-100" alt={m.name} />
                            <h4 className="mt-1.5 text-[10px] font-bold text-slate-800 text-center leading-tight">{m.name}</h4>
                            <p className="text-[9px] font-medium text-slate-400 mt-0.5 text-center leading-tight">{m.role}</p>
                            <div className="mt-1.5 w-full border-t border-slate-50 pt-1 flex justify-between text-[8.5px] font-semibold text-slate-400">
                              <span className="flex items-center gap-0.5"><ShieldCheck className="size-2.5 text-emerald-500" /> {m.transparencyScore}%</span>
                              <span className="truncate ml-1">{m.code}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* ═══ STRUKTUR PENGAWAS ══════════════════════════════════════ */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <span className="size-2.5 rounded-full bg-violet-500" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-violet-600">Struktur Pengawas</span>
                </div>

                <div className="flex flex-col items-center">
                  <div
                    onClick={() => setSelectedId("m6")}
                    className={`relative flex flex-col items-center justify-center p-3 rounded-2xl border bg-white shadow-sm cursor-pointer transition-all duration-300 w-52 hover:scale-[1.03] hover:shadow-md ${
                      selectedId === "m6" ? "border-violet-600 ring-2 ring-violet-500/20" : "border-slate-100"
                    } ${isMemberMatchingFilters(MEMBERS[5]) ? "opacity-100" : "opacity-25"}`}
                  >
                    <span className="absolute -top-2.5 bg-violet-100 text-violet-700 text-[9px] font-black uppercase px-2 py-0.5 rounded-full border border-violet-200">
                      Ketua Pengawas
                    </span>
                    <img src={MEMBERS[5].avatar} className="size-12 rounded-full object-cover border-2 border-white ring-2 ring-violet-100" alt={MEMBERS[5].name} />
                    <h4 className="mt-2 text-xs font-bold text-slate-800 text-center">{MEMBERS[5].name}</h4>
                    <p className="text-[10px] font-medium text-slate-400 mt-0.5">{MEMBERS[5].role}</p>
                    <div className="mt-2 w-full border-t border-slate-50 pt-1.5 flex justify-between items-center text-[9px] font-semibold text-slate-400">
                      <span className="flex items-center gap-0.5"><ShieldCheck className="size-3 text-emerald-500" /> {MEMBERS[5].transparencyScore}%</span>
                      <span>{MEMBERS[5].code}</span>
                    </div>
                  </div>

                  <div className="w-0.5 h-5 bg-slate-200" />

                  <div className="relative flex gap-16">
                    <div className="absolute top-0 h-0.5 bg-slate-200" style={{ left: "25%", right: "25%" }} />
                    {[MEMBERS[6], MEMBERS[7]].map((m) => (
                      <div key={m.id} className="flex flex-col items-center">
                        <div className="w-0.5 h-5 bg-slate-200" />
                        <div
                          onClick={() => setSelectedId(m.id)}
                          className={`relative flex flex-col items-center p-2.5 rounded-2xl border bg-white shadow-sm cursor-pointer transition-all duration-300 w-44 hover:scale-[1.03] hover:shadow-md ${
                            selectedId === m.id ? "border-violet-600 ring-2 ring-violet-500/20" : "border-slate-100"
                          } ${isMemberMatchingFilters(m) ? "opacity-100" : "opacity-25"}`}
                        >
                          <span className="absolute -top-2 bg-violet-50 text-violet-500 text-[8px] font-black uppercase px-1.5 py-0.5 rounded-full border border-violet-200">
                            Anggota
                          </span>
                          <img src={m.avatar} className="size-9 rounded-full object-cover border-2 border-white ring-1 ring-violet-100" alt={m.name} />
                          <h4 className="mt-1.5 text-[10px] font-bold text-slate-800 text-center leading-tight">{m.name}</h4>
                          <p className="text-[9px] font-medium text-slate-400 mt-0.5 text-center leading-tight">{m.role}</p>
                          <div className="mt-1.5 w-full border-t border-slate-50 pt-1 flex justify-between text-[8.5px] font-semibold text-slate-400">
                            <span className="flex items-center gap-0.5"><ShieldCheck className="size-2.5 text-emerald-500" /> {m.transparencyScore}%</span>
                            <span className="truncate ml-1">{m.code}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

            </div>
          ) : (
            /* --- SMOOTH PHYSICS-BASED SVG NODE GRAPH --- */
            <div className="flex-1 relative rounded-2xl overflow-hidden bg-slate-50/30 border border-slate-100" style={{ minHeight: 480 }}>
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
