import { cn } from "@/lib/utils"
import type { TimeSlot } from "@/lib/pools-data"
import { getAvailability, lanesLabel, parseRange } from "@/lib/schedule"
import { AVAILABILITY_STYLES } from "./availability-styles"
import { LaneMeter } from "./lane-meter"

export function SlotRow({
  slot,
  total,
  isCurrent,
  isPast,
}: {
  slot: TimeSlot
  total: number
  isCurrent: boolean
  isPast: boolean
}) {
  const { start, end, startMin, endMin } = parseRange(slot.time)
  const duration = endMin - startMin
  const availability = getAvailability(slot.free_lanes, total)
  const style = AVAILABILITY_STYLES[availability]
  const durationLabel =
    duration >= 60
      ? `${Math.floor(duration / 60)} h${duration % 60 ? ` ${duration % 60} min` : ""}`
      : `${duration} min`

  return (
    <li
      aria-current={isCurrent ? "time" : undefined}
      className={cn(
        "flex items-center gap-3 rounded-xl border bg-white px-3 py-3 sm:gap-5 sm:px-4",
        isCurrent ? "border-blue-600 ring-2 ring-blue-600" : "border-slate-200",
        isPast && "opacity-55",
      )}
    >
      <span className={cn("h-12 w-1.5 shrink-0 rounded-full", style.dot)} aria-hidden="true" />

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-lg font-bold tabular-nums text-slate-900 sm:text-xl">
            {start}
            <span className="px-1 font-normal text-slate-400">–</span>
            {end}
          </span>
          {isCurrent && (
            <span className="rounded-full bg-blue-600 px-2 py-0.5 text-xs font-semibold uppercase tracking-wide text-white">
              Teraz
            </span>
          )}
        </div>
        <span className="text-sm text-slate-500">{durationLabel}</span>
      </div>

      <LaneMeter free={slot.free_lanes} total={total} className="hidden h-9 sm:flex" />

      <div
        className={cn(
          "flex min-w-24 flex-col items-center rounded-lg px-3 py-1.5 ring-1 sm:min-w-28",
          style.chip,
        )}
      >
        <span className="text-2xl font-bold leading-none tabular-nums">
          {slot.free_lanes}
          <span className="text-sm font-medium opacity-60">/{total}</span>
        </span>
        <span className="text-xs font-medium">{lanesLabel(slot.free_lanes)}</span>
      </div>
    </li>
  )
}
