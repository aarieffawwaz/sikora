import { Bell, CalendarDays, ChevronDown, MapPin, Menu, RotateCcw } from "lucide-react"
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
  const resetDemo = useSikoraStore((s) => s.resetDemo)
  const selectedProvinceId = useSikoraStore((s) => s.selectedProvinceId)
  const setProvince = useSikoraStore((s) => s.setProvince)
  const toggleSidebar = useSikoraStore((s) => s.toggleSidebar)

  return (
    <div className="flex flex-col gap-5 pb-2">
      {/* Row 1: Top Navigation Bar */}
      <div className="flex items-center justify-between">
        {/* Hamburger menu button */}
        <button
          onClick={toggleSidebar}
          className="flex size-10 items-center justify-center rounded-xl text-slate-600 transition-colors hover:bg-slate-100"
          title="Tampilkan / sembunyikan menu"
        >
          <Menu className="size-5" />
        </button>

        {/* Top-Right widgets */}
        <div className="flex items-center gap-3">
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
              <DropdownMenuItem
                onClick={() => {
                  resetDemo()
                  setTimeout(() => {
                    window.location.reload()
                  }, 50)
                }}
                className="gap-2 text-slate-600 cursor-pointer"
              >
                <RotateCcw className="size-4" /> Reset Demo
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Row 2: Page Title and Date Range */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">{title}</h1>
          {subtitle && <p className="mt-1 text-sm text-slate-500">{subtitle}</p>}
        </div>

        <div className="flex items-center gap-2 self-start rounded-xl border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-slate-500 shadow-sm sm:self-auto">
          <span className="text-slate-400">Periode:</span>
          <span className="font-bold text-slate-700">24 Mei - 24 Juni 2026</span>
          <CalendarDays className="size-4 text-slate-400" />
        </div>
      </div>
    </div>
  )
}
