import { useEffect, useState } from "react"
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

const BUBBLE_SIZE = 38 // uniform across all provinces

function bubbleIcon(p: Province, selected: boolean, dim: boolean) {
  const r = BUBBLE_SIZE / 2
  const bg = selected ? "#2563eb" : "rgba(255,255,255,.82)"
  const fg = selected ? "#fff" : "#1f2937"
  return L.divIcon({
    className: "",
    iconSize: [BUBBLE_SIZE, BUBBLE_SIZE],
    iconAnchor: [r, r],
    html: `<div style="width:${BUBBLE_SIZE}px;height:${BUBBLE_SIZE}px;display:flex;align-items:center;justify-content:center;border-radius:9999px;background:${bg};color:${fg};font-weight:700;font-size:11px;border:2px solid rgba(255,255,255,.9);box-shadow:0 2px 8px rgba(0,0,0,.35);opacity:${dim ? 0.3 : 1};transition:opacity .3s">${p.koperasi}</div>`,
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

  const total = PROVINCES.reduce((s, p) => s + p.koperasi, 0)

  return (
    <div className={cn("relative h-[320px] overflow-hidden rounded-xl", className)}>
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
            icon={bubbleIcon(p, p.id === selectedId, !!selectedId && p.id !== selectedId)}
            eventHandlers={{ click: () => setProvince(p.id === selectedId ? null : p.id) }}
          >
            <Tooltip direction="top" offset={[0, -10]}>
              <span className="font-semibold">{p.name}</span>
              <br />
              {angka(p.koperasi)} koperasi · {angka(p.volume)} transaksi
            </Tooltip>
          </Marker>
        ))}
      </MapContainer>

      {/* Legend */}
      <div className="pointer-events-none absolute bottom-4 left-4 z-[500] rounded-xl bg-slate-900/70 p-3 text-xs text-slate-100 backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <span className="flex size-5 items-center justify-center rounded-full bg-white/85 text-[8px] font-bold text-slate-800">#</span>
          Jumlah koperasi / provinsi
        </div>
        <p className="mt-1 text-[11px] text-slate-300">
          {selected ? selected.name : `Nasional: ${angka(total)} koperasi`}
        </p>
      </div>
    </div>
  )
}
