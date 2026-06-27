import { Outlet } from "react-router-dom"
import { Sidebar } from "./Sidebar"
import { useSikoraStore } from "@/store/useSikoraStore"
import { cn } from "@/lib/utils"

export function AppLayout() {
  const collapsed = useSikoraStore((s) => s.sidebarCollapsed)
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <main className={cn("min-h-screen transition-[margin] duration-300", collapsed ? "ml-0" : "ml-[248px]")}>
        <div className="mx-auto max-w-[1400px] px-6 py-6 lg:px-8">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
