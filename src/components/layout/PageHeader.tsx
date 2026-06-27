import { Bell, CalendarDays, ChevronDown, MapPin, Menu, RotateCcw, Wifi, WifiOff } from "lucide-react"
import { useSikoraStore } from "@/store/useSikoraStore"
import { PROVINCES } from "@/data/provinces"
import { waktuLalu } from "@/lib/format"
import { cn } from "@/lib/utils"
import profile from "@/assets/profile.jpeg"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const NOTIF_DOT: Record<string, string> = {
  ai: "bg-violet-500",
  sync: "bg-blue-500",
  success: "bg-emerald-500",
  report: "bg-slate-400",
  warning: "bg-rose-500",
}

export function PageHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  const notifications = useSikoraStore((s) => s.notifications)
  const isOnline = useSikoraStore((s) => s.isOnline)
  const toggleOnline = useSikoraStore((s) => s.toggleOnline)
  const resetDemo = useSikoraStore((s) => s.resetDemo)
  const selectedProvinceId = useSikoraStore((s) => s.selectedProvinceId)
  const setProvince = useSikoraStore((s) => s.setProvince)
  const toggleSidebar = useSikoraStore((s) => s.toggleSidebar)

  return (
    <div className="flex flex-wrap items-start justify-between gap-4">
      <div className="flex items-start gap-3">
        <button
          onClick={toggleSidebar}
          className="mt-0.5 flex size-10 items-center justify-center rounded-xl text-slate-600 transition-colors hover:bg-slate-100"
          title="Tampilkan / sembunyikan menu"
        >
          <Menu className="size-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">{title}</h1>
          {subtitle && <p className="mt-1 text-sm text-slate-500">{subtitle}</p>}
        </div>
      </div>

      <div className="flex flex-col items-end gap-2.5">
        <div className="flex items-center gap-2.5">
          {/* Region */}
          <Select
            value={selectedProvinceId ?? "all"}
            onValueChange={(v) => setProvince(v === "all" ? null : v)}
          >
            <SelectTrigger className="h-auto rounded-full border-slate-200 bg-white px-3.5 py-2 text-sm font-medium text-slate-700 shadow-sm">
              <MapPin className="size-4 text-slate-400" />
              <SelectValue placeholder="Semua Wilayah" />
            </SelectTrigger>
            <SelectContent className="max-h-72">
              <SelectItem value="all">Semua Wilayah</SelectItem>
              {PROVINCES.map((p) => (
                <SelectItem key={p.id} value={p.id}>
                  {p.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Online toggle (demo control for offline-first POS) */}
          <button
            onClick={toggleOnline}
            className={cn(
              "flex items-center gap-2 rounded-full px-3.5 py-2 text-sm font-medium shadow-sm transition-colors",
              isOnline ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600",
            )}
            title="Toggle status koneksi (demo offline-first)"
          >
            {isOnline ? <Wifi className="size-4" /> : <WifiOff className="size-4" />}
            {isOnline ? "Online" : "Offline"}
          </button>

          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="relative flex size-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-sm">
                <Bell className="size-5" />
                {notifications.length > 0 && (
                  <span className="absolute -right-0.5 -top-0.5 flex size-5 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white">
                    {Math.min(9, notifications.length)}
                  </span>
                )}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel>Notifikasi</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {notifications.slice(0, 6).map((n) => (
                <DropdownMenuItem key={n.id} className="flex items-start gap-2.5 py-2">
                  <span className={cn("mt-1.5 size-2 shrink-0 rounded-full", NOTIF_DOT[n.kind])} />
                  <span className="flex-1">
                    <span className="block text-sm leading-snug text-slate-700">{n.title}</span>
                    <span className="text-xs text-slate-400">{waktuLalu(n.at)}</span>
                  </span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Profile */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2.5 rounded-full border border-slate-200 bg-white py-1 pl-1 pr-3 shadow-sm">
                <Avatar className="size-8">
                  <AvatarImage src={profile} alt="Admin Koperasi" className="object-cover" />
                  <AvatarFallback className="bg-primary text-xs text-primary-foreground">AK</AvatarFallback>
                </Avatar>
                <span className="text-left leading-tight">
                  <span className="block text-sm font-semibold text-slate-800">Admin Koperasi</span>
                  <span className="block text-xs text-slate-400">Super Admin</span>
                </span>
                <ChevronDown className="size-4 text-slate-400" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel>Admin Koperasi</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={resetDemo} className="gap-2 text-slate-600">
                <RotateCcw className="size-4" /> Reset Demo
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3.5 py-1.5 text-sm shadow-sm">
          <span className="text-slate-400">Periode:</span>
          <span className="font-medium text-slate-700">24 Mei - 24 Juni 2026</span>
          <CalendarDays className="size-4 text-slate-400" />
        </div>
      </div>
    </div>
  )
}
