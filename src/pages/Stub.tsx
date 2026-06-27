import { Construction } from "lucide-react"
import { PageHeader } from "@/components/layout/PageHeader"
import { SectionCard } from "@/components/shared/SectionCard"

export function Stub({ title }: { title: string }) {
  return (
    <div className="space-y-5">
      <PageHeader title={title} subtitle="Modul ini akan tersedia pada versi berikutnya." />
      <SectionCard>
        <div className="flex flex-col items-center justify-center gap-3 py-16 text-center text-slate-400">
          <Construction className="size-10" />
          <p className="text-sm">Halaman {title} sedang dalam pengembangan.</p>
        </div>
      </SectionCard>
    </div>
  )
}
