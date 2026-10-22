import { HeroHeader } from "@/components/hero-header"
import { PoolDashboard } from "@/components/pool-dashboard"

export default function Page() {
  return (
    <div className="min-h-dvh bg-slate-100">
      <HeroHeader />
      <PoolDashboard />
    </div>
  )
}
