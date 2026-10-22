"use client"

import { ChevronRight, MapPin } from "lucide-react"
import { cn } from "@/lib/utils"
import { poolsData, type PoolInfo } from "@/lib/pools-data"
import {
  findCurrentSlot,
  findNextSlot,
  getAvailability,
  lanesLabel,
  parseRange,
  type WarsawNow,
} from "@/lib/schedule"
import { AVAILABILITY_STYLES } from "./availability-styles"
import { LaneMeter } from "./lane-meter"
import { DistanceBadge } from "./distance-badge"

export function PoolCard({
  pool,
  now,
  selected,
  onSelect,
}: {
  pool: PoolInfo
  now: WarsawNow | null
  selected: boolean
  onSelect: () => void
}) {
  const todaySlots = now ? poolsData[pool.id][now.day] : undefined
  const current = now ? findCurrentSlot(todaySlots, now.minutes) : undefined
  const next = now ? findNextSlot(todaySlots, now.minutes) : undefined
  const availability = current ? getAvailability(current.free_lanes, pool.laneCount) : undefined

  let status: string
  if (!now) status = "Ładowanie…"
  else if (!todaySlots) status = "Brak grafiku na dziś"
  else if (!current) status = "Teraz zamknięte"
  else status = `do ${parseRange(current.time).end}`

  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className={cn(
        "group flex w-full flex-col gap-4 rounded-2xl border bg-white p-5 text-left shadow-sm transition-all",
        "hover:border-blue-300 hover:shadow-md focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-500/40",
        selected ? "border-blue-600 ring-2 ring-blue-600" : "border-slate-200",
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 flex-col gap-1">
          <h3 className="text-lg font-semibold leading-tight text-slate-900">{pool.name}</h3>
          <p className="flex items-center gap-1 text-sm text-slate-500">
            <MapPin className="size-3.5 shrink-0" aria-hidden="true" />
            <span className="truncate">{pool.address}</span>
          </p>
          <DistanceBadge distance={pool.distance} className="mt-1" />
        </div>
        <ChevronRight
          className={cn(
            "size-5 shrink-0 text-slate-400 transition-transform group-hover:translate-x-0.5",
            selected && "text-blue-600",
          )}
          aria-hidden="true"
        />
      </div>

      <div className="flex items-end justify-between gap-3 rounded-xl bg-slate-50 p-3">
        <div className="flex flex-col">
          <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Teraz</span>
          {current && availability ? (
            <p className="flex items-baseline gap-1.5">
              <span className={cn("text-3xl font-bold tabular-nums", AVAILABILITY_STYLES[availability].text)}>
                {current.free_lanes}
              </span>
              <span className="text-sm font-medium text-slate-700">
                {lanesLabel(current.free_lanes)}
                <span className="text-slate-400"> / {pool.laneCount}</span>
              </span>
            </p>
          ) : (
            <p className="py-1.5 text-base font-semibold text-slate-700">{status}</p>
          )}
          {current && <span className="text-xs text-slate-500">{status}</span>}
        </div>
        {current && <LaneMeter free={current.free_lanes} total={pool.laneCount} className="h-10" />}
      </div>

      {next && (
        <p className="text-sm text-slate-600">
          Następnie: <span className="font-semibold tabular-nums text-slate-900">{parseRange(next.time).start}</span>{" "}
          — {next.free_lanes} {lanesLabel(next.free_lanes)}
        </p>
      )}
    </button>
  )
}
