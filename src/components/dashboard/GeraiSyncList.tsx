import { useState } from "react"
import { CheckCircle2, AlertTriangle, RefreshCw, Server } from "lucide-react"
import { useSikoraStore } from "@/store/useSikoraStore"
import { toast } from "sonner"

interface GeraiUI {
  id: string
  name: string
  region: string
  status: "aman" | "understock" | "belum-sinkron"
  progress: number
}

export function GeraiSyncList() {
  const syncGlobal = useSikoraStore((s) => s.syncFromSimkopdes)
  const pushNotif = useSikoraStore((s) => s.pushNotification)

  const [geraiList, setGeraiList] = useState<GeraiUI[]>([
    { id: "g1", name: "Gerai Sukamaju Pusat", region: "Jawa Barat", status: "aman", progress: 100 },
    { id: "g2", name: "Gerai Cibiru", region: "Jawa Barat", status: "understock", progress: 94 },
    { id: "g3", name: "Gerai Margahayu", region: "Jawa Barat", status: "belum-sinkron", progress: 65 },
  ])
  const [syncingId, setSyncingId] = useState<string | null>(null)

  function handleSync(id: string, name: string) {
    setSyncingId(id)
    
    setTimeout(() => {
      setGeraiList((prev) =>
        prev.map((g) => (g.id === id ? { ...g, status: "aman", progress: 100 } : g))
      )
      setSyncingId(null)
      
      // Global state actions
      syncGlobal()
      pushNotif({
        kind: "sync",
        title: `${name} berhasil disinkronkan.`,
        detail: "Seluruh data transaksi dan stok lunas diunggah ke Simkopdes.",
      })
      
      toast.success(`Sinkronisasi ${name} Sukses!`, {
        description: "Data penjualan dan status persediaan terupdate di Simkopdes.",
      })
    }, 1200)
  }

  return (
    <div className="space-y-4">
      {geraiList.map((g) => {
        const isSyncing = syncingId === g.id
        return (
          <div key={g.id} className="rounded-xl border border-slate-100 bg-white p-3 shadow-sm hover:border-slate-200 transition-colors">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <div className="flex size-9 items-center justify-center rounded-lg bg-slate-50 text-slate-400">
                  <Server className="size-4.5" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-slate-800 truncate">{g.name}</p>
                  <p className="text-[11px] text-slate-400">{g.region}</p>
                </div>
              </div>

              {/* Status Badge */}
              {g.status === "aman" ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-600">
                  <CheckCircle2 className="size-3" /> Aktif & Sinkron
                </span>
              ) : g.status === "understock" ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-blue-600">
                  <CheckCircle2 className="size-3" /> Stok Rendah
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-bold text-amber-600">
                  <AlertTriangle className="size-3" /> Perlu Sinkron
                </span>
              )}
            </div>

            {/* Progress bar */}
            <div className="mt-3.5 space-y-1.5">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-slate-400 font-medium">Status Sinkronisasi</span>
                <span className="font-bold text-slate-700">{g.progress}%</span>
              </div>
              <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    g.status === "aman"
                      ? "bg-emerald-500"
                      : g.status === "understock"
                      ? "bg-blue-500"
                      : "bg-amber-500"
                  }`}
                  style={{ width: `${g.progress}%` }}
                />
              </div>
            </div>

            {/* Action button if not synced */}
            {g.status === "belum-sinkron" && (
              <div className="mt-3 flex justify-end">
                <button
                  disabled={isSyncing}
                  onClick={() => handleSync(g.id, g.name)}
                  className="flex items-center gap-1 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary px-3 py-1.5 text-xs font-bold transition-all disabled:opacity-50"
                >
                  <RefreshCw className={`size-3.5 ${isSyncing ? "animate-spin" : ""}`} />
                  {isSyncing ? "Mensinkronkan..." : "Sinkronkan Gerai"}
                </button>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
