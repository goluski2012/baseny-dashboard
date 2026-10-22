"use client"

import { Clock } from "lucide-react"
import { useWarsawNow } from "@/hooks/use-warsaw-now"
import { DAYS } from "@/lib/pools-data"

export function LiveClock() {
  const now = useWarsawNow()
  const dayLabel = DAYS.find((d) => d.key === now?.day)?.label

  return (
    <div
      className="inline-flex items-center gap-2 rounded-full bg-blue-500 px-3 py-1 text-sm font-semibold text-white"
      aria-live="polite"
    >
      <Clock className="size-4" aria-hidden="true" />
      {now ? (
        <span>
          {dayLabel}, <span className="tabular-nums">{now.label}</span>
        </span>
      ) : (
        <span className="opacity-70">--:--</span>
      )}
    </div>
  )
}
