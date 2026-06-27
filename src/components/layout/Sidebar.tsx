import { NavLink } from "react-router-dom"
import { PRIMARY_NAV, SECONDARY_NAV, type NavItem } from "@/config/nav"
import { useSikoraStore } from "@/store/useSikoraStore"
import { cn } from "@/lib/utils"
import logo from "@/assets/logo.png"
import people from "@/assets/people.png"

function NavRow({ item }: { item: NavItem }) {
  const Icon = item.icon
  return (
    <NavLink
      to={item.path}
      end={item.path === "/"}
      className={({ isActive }) =>
        cn(
          "flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-colors",
          isActive
            ? "bg-primary text-primary-foreground shadow-sm shadow-primary/30"
            : "text-slate-300 hover:bg-white/5 hover:text-white",
        )
      }
    >
      <Icon className="size-[18px]" strokeWidth={2} />
      {item.label}
    </NavLink>
  )
}

export function Sidebar() {
  const collapsed = useSikoraStore((s) => s.sidebarCollapsed)

  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-30 flex w-[248px] flex-col bg-sidebar text-sidebar-foreground transition-transform duration-300",
        collapsed && "-translate-x-full",
      )}
    >
      {/* Logo */}
      <div className="px-5 pt-3 pb-4">
        <img src={logo} alt="SIKORA — Sinergi Koperasi Raya" className="w-44 object-contain" />
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-1 overflow-y-auto px-3.5">
        {PRIMARY_NAV.map((item) => (
          <NavRow key={item.path} item={item} />
        ))}
        <div className="my-3 border-t border-white/10" />
        {SECONDARY_NAV.map((item) => (
          <NavRow key={item.path} item={item} />
        ))}
      </nav>

      {/* Promo card */}
      <div className="m-3.5 overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600/30 to-violet-600/20 p-4 ring-1 ring-white/10">
        <p className="text-sm font-semibold leading-snug text-white">
          Koperasi Maju,
          <br />
          Desa Sejahtera
        </p>
        <p className="mt-1 text-xs text-slate-300">Kelola bersama, tumbuh bersama.</p>
        <img src={people} alt="" className="mt-3 -mb-5 max-h-40 w-full object-contain object-bottom" />
      </div>
    </aside>
  )
}
