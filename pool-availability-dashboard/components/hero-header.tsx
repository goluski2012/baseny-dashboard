import Image from "next/image"
import { Waves } from "lucide-react"
import { LiveClock } from "./live-clock"
import { AvailabilityLegend } from "./availability-legend"

export function HeroHeader() {
  return (
    <header className="relative isolate overflow-hidden bg-slate-950 text-white">
      <Image
        src="/images/pool-lanes.png"
        alt=""
        fill
        priority
        sizes="100vw"
        className="-z-10 object-cover opacity-40"
      />
      <div className="absolute inset-0 -z-10 bg-slate-950/60" aria-hidden="true" />

      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 pt-10 pb-12 sm:px-6 sm:pt-14 sm:pb-16">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-sm font-medium backdrop-blur">
            <Waves className="size-4 text-blue-300" aria-hidden="true" />
            Poznań i okolice
          </div>
          <LiveClock />
        </div>

        <div className="flex flex-col gap-3">
          <h1 className="text-balance text-3xl font-bold tracking-tight sm:text-5xl">
            Pływalnie Poznań
            <span className="block text-blue-300">Dostępność Torów</span>
          </h1>
          <p className="max-w-xl text-pretty text-base leading-relaxed text-slate-200 sm:text-lg">
            Sprawdź, ile torów jest wolnych do pływania indywidualnego — teraz i w dowolnym dniu tygodnia.
          </p>
        </div>

        <AvailabilityLegend />
      </div>
    </header>
  )
}
