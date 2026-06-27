import { BrowserRouter, Route, Routes } from "react-router-dom"
import { AppLayout } from "@/components/layout/AppLayout"
import { Toaster } from "@/components/ui/sonner"
import { Dashboard } from "@/pages/Dashboard"
import { Sinkronisasi } from "@/pages/Sinkronisasi"
import { Persediaan } from "@/pages/Persediaan"
import { Pos } from "@/pages/Pos"
import { Pembukuan } from "@/pages/Pembukuan"
import { Keanggotaan } from "@/pages/Keanggotaan"
import { Monitoring } from "@/pages/Monitoring"
import { Stub } from "@/pages/Stub"

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/sinkronisasi" element={<Sinkronisasi />} />
          <Route path="/persediaan" element={<Persediaan />} />
          <Route path="/pos" element={<Pos />} />
          <Route path="/pembukuan" element={<Pembukuan />} />
          <Route path="/keanggotaan" element={<Keanggotaan />} />
          <Route path="/monitoring" element={<Monitoring />} />
          <Route path="/pengaturan" element={<Stub title="Pengaturan" />} />
          <Route path="/bantuan" element={<Stub title="Bantuan" />} />
        </Route>
      </Routes>
      <Toaster position="top-right" richColors />
    </BrowserRouter>
  )
}
