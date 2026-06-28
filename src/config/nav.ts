import {
  LayoutDashboard,
  RefreshCw,
  Package,
  ShoppingCart,
  BookOpenText,
  Users,
  BarChart3,
  Building2,
  Settings,
  HelpCircle,
  type LucideIcon,
} from "lucide-react"

export interface NavItem {
  label: string
  path: string
  icon: LucideIcon
}

export const PRIMARY_NAV: NavItem[] = [
  { label: "Dashboard", path: "/", icon: LayoutDashboard },
  { label: "Sinkronisasi Data", path: "/sinkronisasi", icon: RefreshCw },
  { label: "Persediaan", path: "/persediaan", icon: Package },
  { label: "Transaksi POS", path: "/pos", icon: ShoppingCart },
  { label: "Pembukuan", path: "/pembukuan", icon: BookOpenText },
  { label: "Keanggotaan", path: "/keanggotaan", icon: Users },
  { label: "Koperasi", path: "/database-koperasi", icon: Building2 },
  { label: "Monitoring", path: "/monitoring", icon: BarChart3 },
]

export const SECONDARY_NAV: NavItem[] = [
  { label: "Pengaturan", path: "/pengaturan", icon: Settings },
  { label: "Bantuan", path: "/bantuan", icon: HelpCircle },
]
