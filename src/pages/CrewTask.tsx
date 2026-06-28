import { useState } from "react"
import { Camera, CheckCircle2, Circle, ClipboardList, Sparkles } from "lucide-react"
import { toast } from "sonner"
import { useSikoraStore } from "@/store/useSikoraStore"
import { PageHeader } from "@/components/layout/PageHeader"
import { SectionCard } from "@/components/shared/SectionCard"
import { Reveal } from "@/components/shared/Reveal"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"

interface PlanogramResult {
  fileName: string
  score: number
  flags: string[]
}

export function CrewTask() {
  const crewTasks = useSikoraStore((s) => s.crewTasks)
  const toggleCrewTask = useSikoraStore((s) => s.toggleCrewTask)
  const products = useSikoraStore((s) => s.products)
  const stockOpnames = useSikoraStore((s) => s.stockOpnames)
  const recordStockOpname = useSikoraStore((s) => s.recordStockOpname)

  const [opnameProductId, setOpnameProductId] = useState(products[0]?.id ?? "")
  const [countedStock, setCountedStock] = useState("")

  const [photoPreview, setPhotoPreview] = useState<string | null>(null)
  const [photoFile, setPhotoFile] = useState<File | null>(null)
  const [planogramResult, setPlanogramResult] = useState<PlanogramResult | null>(null)

  function submitOpname() {
    const n = parseInt(countedStock, 10)
    if (isNaN(n) || n < 0) {
      toast.error("Isi jumlah hitung fisik yang valid")
      return
    }
    const entry = recordStockOpname(opnameProductId, n)
    if (entry.anomaly) {
      toast.warning(`Anomali terdeteksi: selisih ${entry.variance > 0 ? "+" : ""}${entry.variance}`)
    } else {
      toast.success("Stock opname tercatat, stok sesuai")
    }
    setCountedStock("")
  }

  function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setPhotoFile(file)
    setPlanogramResult(null)
    const reader = new FileReader()
    reader.onload = () => setPhotoPreview(reader.result as string)
    reader.readAsDataURL(file)
  }

  function analyzePhoto() {
    if (!photoFile) return
    // Mock "AI planogram check" — deterministic-ish score from file size/name, same
    // scripted-mock philosophy as the rest of SIKORA's AI (no real computer vision).
    const seed = (photoFile.size % 30) + (photoFile.name.length % 10)
    const score = Math.max(55, 100 - seed)
    const flags: string[] = []
    if (score < 75) flags.push("Beberapa rak terdeteksi kosong (kemungkinan OOS)")
    if (score < 85) flags.push("Penataan produk kurang rapi di sebagian rak")
    setPlanogramResult({ fileName: photoFile.name, score, flags })
    toast.success("Analisis AI selesai", { description: `Skor kerapian rak: ${score}/100` })
  }

  return (
    <div className="space-y-5">
      <PageHeader title="Tugas Harian & Stock Opname" subtitle="Checklist kasir/crew, hitung fisik stok, dan cek kerapian rak — modul tambahan operasional gerai." />

      <Reveal>
        <SectionCard title="Checklist Harian" subtitle={`${crewTasks.filter((t) => t.done).length}/${crewTasks.length} tugas selesai`}>
          <div className="space-y-2">
            {crewTasks.map((t) => (
              <button
                key={t.id}
                onClick={() => toggleCrewTask(t.id)}
                className={cn(
                  "flex w-full items-center gap-3 rounded-xl border p-3 text-left transition-colors",
                  t.done ? "border-emerald-100 bg-emerald-50/50" : "border-slate-100 hover:bg-slate-50/60",
                )}
              >
                {t.done ? <CheckCircle2 className="size-5 shrink-0 text-emerald-500" /> : <Circle className="size-5 shrink-0 text-slate-300" />}
                <span className={cn("text-sm font-medium", t.done ? "text-slate-500 line-through" : "text-slate-800")}>{t.label}</span>
              </button>
            ))}
          </div>
        </SectionCard>
      </Reveal>

      <Reveal delay={0.05}>
        <SectionCard title="Stock Opname" subtitle="Hitung fisik vs sistem, AI deteksi anomali otomatis">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-[1fr_1fr_auto] sm:items-end">
            <div className="space-y-1.5">
              <Label className="text-xs">Produk</Label>
              <Select value={opnameProductId} onValueChange={setOpnameProductId}>
                <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {products.map((p) => (
                    <SelectItem key={p.id} value={p.id}>{p.icon} {p.name} — sistem: {p.stock} {p.unit}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Hitung Fisik</Label>
              <Input type="number" min={0} value={countedStock} onChange={(e) => setCountedStock(e.target.value)} placeholder="0" />
            </div>
            <Button onClick={submitOpname} className="gap-2">
              <ClipboardList className="size-4" /> Catat
            </Button>
          </div>

          {stockOpnames.length > 0 && (
            <div className="mt-5 overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100 text-left text-xs font-medium text-slate-400">
                    <th className="pb-3 pl-2">Produk</th>
                    <th className="pb-3 text-right">Sistem</th>
                    <th className="pb-3 text-right">Fisik</th>
                    <th className="pb-3 text-right">Selisih</th>
                    <th className="pb-3 pl-4 pr-2">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {stockOpnames.map((o) => (
                    <tr key={o.id} className={cn(o.anomaly && "bg-rose-50/50")}>
                      <td className="py-3 pl-2 font-medium text-slate-800">{o.productName}</td>
                      <td className="text-right text-slate-500">{o.systemStock}</td>
                      <td className="text-right text-slate-500">{o.countedStock}</td>
                      <td className={cn("text-right font-semibold", o.variance < 0 ? "text-rose-500" : o.variance > 0 ? "text-emerald-600" : "text-slate-400")}>
                        {o.variance > 0 ? "+" : ""}{o.variance}
                      </td>
                      <td className="pl-4 pr-2">
                        <span className={cn("rounded-full px-2.5 py-1 text-xs font-semibold", o.anomaly ? "bg-rose-100 text-rose-600" : "bg-emerald-50 text-emerald-600")}>
                          {o.anomaly ? "Anomali" : "Sesuai"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </SectionCard>
      </Reveal>

      <Reveal delay={0.1}>
        <SectionCard title="Foto Rak / Produk" subtitle="Simulasi: crew foto rak, AI cek kerapian & deteksi kekosongan (mock, bukan computer vision asli)">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div className="space-y-3">
              <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-200 p-8 text-center hover:border-primary/40">
                <Camera className="size-8 text-slate-300" />
                <span className="text-sm text-slate-500">Klik untuk pilih foto rak/produk</span>
                <input type="file" accept="image/*" className="hidden" onChange={handlePhotoChange} />
              </label>
              {photoFile && (
                <Button onClick={analyzePhoto} className="w-full gap-2">
                  <Sparkles className="size-4" /> Analisis AI
                </Button>
              )}
            </div>

            <div className="flex flex-col gap-3">
              {photoPreview ? (
                <img src={photoPreview} alt="Pratinjau rak" className="h-48 w-full rounded-xl object-cover" />
              ) : (
                <div className="flex h-48 items-center justify-center rounded-xl bg-slate-50 text-sm text-slate-300">Belum ada foto</div>
              )}
              {planogramResult && (
                <div className="rounded-xl border border-slate-100 p-3">
                  <p className="text-sm font-semibold text-slate-800">Skor Kerapian Rak: {planogramResult.score}/100</p>
                  {planogramResult.flags.length === 0 ? (
                    <p className="mt-1 text-xs text-emerald-600">Rak terlihat rapi & lengkap.</p>
                  ) : (
                    <ul className="mt-1 list-inside list-disc text-xs text-amber-600">
                      {planogramResult.flags.map((f) => <li key={f}>{f}</li>)}
                    </ul>
                  )}
                </div>
              )}
            </div>
          </div>
        </SectionCard>
      </Reveal>
    </div>
  )
}
