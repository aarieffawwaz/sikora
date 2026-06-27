import { useEffect, useState } from "react"
import { ChevronDown } from "lucide-react"
import {
  GeoJSON,
  LayersControl,
  MapContainer,
  Marker,
  TileLayer,
  Tooltip,
  useMap,
} from "react-leaflet"
import L from "leaflet"
import type { FeatureCollection, Feature } from "geojson"
import "leaflet/dist/leaflet.css"
import { PROVINCES, provinceById, type Province } from "@/data/provinces"
import { useSikoraStore } from "@/store/useSikoraStore"
import { angka } from "@/lib/format"
import { cn } from "@/lib/utils"

const GEOJSON_URL =
  "https://raw.githubusercontent.com/ardian28/GeoJson-Indonesia-38-Provinsi/main/Provinsi/38%20Provinsi%20Indonesia%20-%20Provinsi.json"

const DEFAULT_CENTER: [number, number] = [-2.3, 118]
const DEFAULT_ZOOM = 4.4

const BUBBLE_SIZE = 28

function bubbleIcon(p: Province, selected: boolean, dim: boolean, filter: string) {
  const r = BUBBLE_SIZE / 2
  
  let val = p.koperasi
  let bg = "rgba(255,255,255,0.92)"
  let fg = "#1f2937"
  let border = "rgba(255,255,255,0.9)"
  
  if (filter === "kritis") {
    val = Math.round(p.koperasi * 0.06) + (p.koperasi % 5) || 1
    bg = selected ? "#ef4444" : "rgba(254,226,226,0.92)"
    fg = selected ? "#fff" : "#b91c1c"
    border = selected ? "#fca5a5" : "#ef4444"
  } else if (filter === "menipis") {
    val = Math.round(p.koperasi * 0.18) + (p.koperasi % 7) || 2
    bg = selected ? "#f59e0b" : "rgba(254,243,199,0.92)"
    fg = selected ? "#fff" : "#b45309"
    border = selected ? "#fcd34d" : "#f59e0b"
  } else if (filter === "aman") {
    val = Math.max(1, p.koperasi - Math.round(p.koperasi * 0.24))
    bg = selected ? "#10b981" : "rgba(209,250,229,0.92)"
    fg = selected ? "#fff" : "#047857"
    border = selected ? "#6ee7b7" : "#10b981"
  } else {
    // semua
    bg = selected ? "#2563eb" : "rgba(255,255,255,0.92)"
    fg = selected ? "#fff" : "#1f2937"
    border = selected ? "#93c5fd" : "rgba(255,255,255,0.9)"
  }

  return L.divIcon({
    className: "",
    iconSize: [BUBBLE_SIZE, BUBBLE_SIZE],
    iconAnchor: [r, r],
    html: `<div style="width:${BUBBLE_SIZE}px;height:${BUBBLE_SIZE}px;display:flex;align-items:center;justify-content:center;border-radius:9999px;background:${bg};color:${fg};font-weight:700;font-size:9.5px;border:1.5px solid ${border};box-shadow:0 1.5px 5px rgba(0,0,0,0.25);opacity:${dim ? 0.35 : 1};transition:all .3s">${val}</div>`,
  })
}

/** Flies the map to the selected province (or back to national view). */
function FlyController({ selected }: { selected: Province | undefined }) {
  const map = useMap()
  useEffect(() => {
    if (selected) map.flyTo([selected.lat, selected.lng], 7, { duration: 1.1 })
    else map.flyTo(DEFAULT_CENTER, DEFAULT_ZOOM, { duration: 1.1 })
  }, [selected, map])
  return null
}

export function OperationsMap({ className }: { className?: string }) {
  const [geo, setGeo] = useState<FeatureCollection | null>(null)
  const selectedId = useSikoraStore((s) => s.selectedProvinceId)
  const setProvince = useSikoraStore((s) => s.setProvince)
  const filter = useSikoraStore((s) => s.mapFilter)
  const selected = provinceById(selectedId)

  useEffect(() => {
    let alive = true
    fetch(GEOJSON_URL)
      .then((r) => r.json())
      .then((d) => alive && setGeo(d))
      .catch(() => {})
    return () => {
      alive = false
    }
  }, [])

  const getVal = (p: Province) => {
    if (filter === "kritis") return Math.round(p.koperasi * 0.06) + (p.koperasi % 5) || 1
    if (filter === "menipis") return Math.round(p.koperasi * 0.18) + (p.koperasi % 7) || 2
    if (filter === "aman") return Math.max(1, p.koperasi - Math.round(p.koperasi * 0.24))
    return p.koperasi
  }

  const total = PROVINCES.reduce((s, p) => s + getVal(p), 0)

  return (
    <div className={cn("relative h-[420px] overflow-hidden rounded-xl", className)}>
      <MapContainer
        center={DEFAULT_CENTER}
        zoom={DEFAULT_ZOOM}
        minZoom={3}
        scrollWheelZoom
        zoomControl
        className="size-full bg-slate-900"
        attributionControl={false}
      >
        <FlyController selected={selected} />
        <LayersControl position="topright">
          <LayersControl.BaseLayer checked name="Satelit">
            <TileLayer
              url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
              attribution="Tiles &copy; Esri"
            />
          </LayersControl.BaseLayer>
          <LayersControl.BaseLayer name="Gelap">
            <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" attribution="&copy; CARTO" />
          </LayersControl.BaseLayer>
          <LayersControl.BaseLayer name="Jalan">
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="&copy; OpenStreetMap" />
          </LayersControl.BaseLayer>
        </LayersControl>

        {geo && (
          <GeoJSON
            key={selectedId ?? "all"}
            data={geo}
            style={(f?: Feature) => {
              const isSel = !!selected && f?.properties?.PROVINSI === selected.name
              return {
                color: isSel ? "#facc15" : "#38bdf8",
                weight: isSel ? 2.5 : 1,
                fillColor: isSel ? "#2563eb" : "#1e3a5f",
                fillOpacity: isSel ? 0.25 : 0.12,
              }
            }}
          />
        )}

        {PROVINCES.map((p) => (
          <Marker
            key={p.id}
            position={[p.lat, p.lng]}
            icon={bubbleIcon(p, p.id === selectedId, !!selectedId && p.id !== selectedId, filter)}
            eventHandlers={{ click: () => setProvince(p.id === selectedId ? null : p.id) }}
          >
            <Tooltip direction="top" offset={[0, -10]}>
              <span className="font-semibold">{p.name}</span>
              <br />
              {filter === "kritis"
                ? `${angka(getVal(p))} koperasi kritis`
                : filter === "menipis"
                ? `${angka(getVal(p))} koperasi menipis`
                : filter === "aman"
                ? `${angka(getVal(p))} koperasi aman`
                : `${angka(p.koperasi)} koperasi`} · {angka(p.volume)} transaksi
            </Tooltip>
          </Marker>
        ))}
      </MapContainer>

      {/* Legend */}
      <div className="pointer-events-none absolute bottom-4 left-4 z-[500] rounded-xl bg-slate-900/70 p-3 text-xs text-slate-100 backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <span className="flex size-5 items-center justify-center rounded-full bg-white/85 text-[8px] font-bold text-slate-800">#</span>
          {filter === "kritis"
            ? "Koperasi Kritis (Segera Restock)"
            : filter === "menipis"
            ? "Koperasi Menipis (Perlu Restock)"
            : filter === "aman"
            ? "Koperasi Stok Aman"
            : "Jumlah koperasi / provinsi"}
        </div>
        <p className="mt-1 text-[11px] text-slate-300">
          {selected
            ? `${selected.name}: ${angka(getVal(selected))} koperasi`
            : `Nasional: ${angka(total)} koperasi`}
        </p>
      </div>
    </div>
  )
}

export function MapFilterDropdown() {
  const filter = useSikoraStore((s) => s.mapFilter)
  const setFilter = useSikoraStore((s) => s.setMapFilter)

  return (
    <div className="relative inline-block">
      <select
        value={filter}
        onChange={(e) => setFilter(e.target.value as any)}
        className="appearance-none rounded-full border border-slate-200 bg-white pl-3.5 pr-8 py-1.5 text-xs font-bold text-slate-600 outline-none cursor-pointer hover:border-slate-300 transition-all shadow-sm"
      >
        <option value="semua">Kondisi Persediaan: Semua</option>
        <option value="kritis">Stok Kritis (Segera Restock)</option>
        <option value="menipis">Stok Menipis (Perlu Restock)</option>
        <option value="aman">Stok Aman & Stabil</option>
      </select>
      <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 size-3.5 -translate-y-1/2 text-slate-400 stroke-[2.5]" />
    </div>
  )
}
