"use client"

import { useRef, useState } from "react"
import { POOLS, poolsData, type DayKey, type PoolId } from "@/lib/pools-data"
import { availableDays } from "@/lib/schedule"
import { useWarsawNow } from "@/hooks/use-warsaw-now"
import { PoolCard } from "./pool-card"
import { PoolSchedule } from "./pool-schedule"
import { OtherPoolsDirectory } from "./other-pools-directory"

export function PoolDashboard() {
  const now = useWarsawNow()
  const [poolId, setPoolId] = useState<PoolId>(POOLS[0].id)
  const [chosenDay, setChosenDay] = useState<DayKey | null>(null)
  const scheduleRef = useRef<HTMLElement>(null)

  const pool = POOLS.find((p) => p.id === poolId) ?? POOLS[0]
  const days = availableDays(poolsData[pool.id]).map((d) => d.key)
  const preferred = chosenDay ?? now?.day
  const day = preferred && days.includes(preferred) ? preferred : days[0]

  function selectPool(id: PoolId, scroll: boolean) {
    setPoolId(id)
    if (scroll && window.matchMedia("(max-width: 1023px)").matches) {
      scheduleRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
    }
  }

  return (
    <main className="mx-auto flex max-w-6xl flex-col gap-10 px-4 py-8 sm:px-6 sm:py-12">
      <section aria-labelledby="pools-heading" className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <h2 id="pools-heading" className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
            Pływalnie
          </h2>
          <p className="text-sm text-slate-600">Wybierz basen, aby zobaczyć pełny grafik wolnych torów.</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {POOLS.map((p) => (
            <PoolCard
              key={p.id}
              pool={p}
              now={now}
              selected={p.id === pool.id}
              onSelect={() => selectPool(p.id, true)}
            />
          ))}
        </div>
      </section>

      <section ref={scheduleRef} aria-label="Grafik wybranej pływalni" className="scroll-mt-4">
        <PoolSchedule
          pool={pool}
          day={day}
          now={now}
          onDayChange={setChosenDay}
          onPoolChange={(id) => selectPool(id, false)}
        />
      </section>

      <OtherPoolsDirectory />

      <footer className="border-t border-slate-200 pt-6 text-sm leading-relaxed text-slate-500">
        Liczba torów dotyczy pływania indywidualnego wg grafików udostępnianych przez obiekty. Grafiki mogą
        się zmieniać — przed wyjściem sprawdź oficjalną stronę pływalni.
      </footer>
    </main>
  )
}
