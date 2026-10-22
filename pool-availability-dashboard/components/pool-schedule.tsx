"use client"

import { CalendarDays, Clock, ExternalLink, Trophy } from "lucide-react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { POOLS, poolsData, type DayKey, type PoolId, type PoolInfo } from "@/lib/pools-data"
import {
  availableDays,
  bestSlot,
  dayBounds,
  findCurrentSlot,
  lanesLabel,
  parseRange,
  type WarsawNow,
} from "@/lib/schedule"
import { SlotRow } from "./slot-row"

const POOL_ITEMS = POOLS.map((p) => ({ value: p.id, label: p.name }))

export function PoolSchedule({
  pool,
  day,
  now,
  onDayChange,
  onPoolChange,
}: {
  pool: PoolInfo
  day: DayKey
  now: WarsawNow | null
  onDayChange: (day: DayKey) => void
  onPoolChange: (id: PoolId) => void
}) {
  const schedule = poolsData[pool.id]
  const days = availableDays(schedule)

  return (
    <Card className="gap-0 overflow-hidden rounded-2xl border border-slate-200 bg-white py-0 shadow-sm ring-0">
      <CardHeader className="flex flex-col gap-4 border-b border-slate-200 bg-slate-50 px-4 py-5 sm:px-6">
        <div className="flex w-full flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex flex-col gap-1">
            <p className="text-xs font-semibold uppercase tracking-wide text-blue-700">Grafik torów</p>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">{pool.name}</h2>
            <p className="text-sm text-slate-600">
              {pool.laneCount} torów · {pool.poolLength} ·{" "}
              <a
                href={pool.officialUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 font-medium text-blue-700 underline-offset-4 hover:underline"
              >
                Oficjalna strona
                <ExternalLink className="size-3.5" aria-hidden="true" />
                <span className="sr-only">(otwiera się w nowej karcie)</span>
              </a>
            </p>
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="pool-select" className="text-xs font-medium text-slate-500">
              Zmień pływalnię
            </label>
            <Select
              items={POOL_ITEMS}
              value={pool.id}
              onValueChange={(value) => value && onPoolChange(value as PoolId)}
            >
              <SelectTrigger id="pool-select" className="h-11 w-full bg-white sm:w-64">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {POOL_ITEMS.map((item) => (
                  <SelectItem key={item.value} value={item.value} className="py-2">
                    {item.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>

      <CardContent className="px-3 py-5 sm:px-6">
        <Tabs value={day} onValueChange={(value) => onDayChange(value as DayKey)} className="gap-5">
          <div className="flex items-center gap-2">
            <CalendarDays className="size-4 text-slate-500" aria-hidden="true" />
            <span className="text-sm font-medium text-slate-700">Wybierz dzień</span>
          </div>
          <TabsList
            aria-label="Dzień tygodnia"
            className="h-auto! w-full justify-start gap-1 overflow-x-auto rounded-xl bg-slate-100 p-1"
          >
            {days.map((d) => (
              <TabsTrigger
                key={d.key}
                value={d.key}
                className="h-11! min-w-10 flex-1 rounded-lg px-1 text-sm sm:px-2 font-semibold text-slate-600 data-active:bg-blue-600! data-active:text-white! data-active:shadow-sm"
              >
                <span className="sm:hidden">{d.short}</span>
                <span className="hidden sm:inline">{d.label}</span>
                {now?.day === d.key && (
                  <span className="sr-only"> (dziś)</span>
                )}
                {now?.day === d.key && (
                  <span className="size-1.5 rounded-full bg-current opacity-80" aria-hidden="true" />
                )}
              </TabsTrigger>
            ))}
          </TabsList>

          {days.map((d) => (
            <TabsContent key={d.key} value={d.key}>
              <DayPanel
                dayKey={d.key}
                dayLabel={d.label}
                pool={pool}
                now={now}
              />
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  )
}

function DayPanel({
  dayKey,
  dayLabel,
  pool,
  now,
}: {
  dayKey: DayKey
  dayLabel: string
  pool: PoolInfo
  now: WarsawNow | null
}) {
  const slots = poolsData[pool.id][dayKey] ?? []
  const isToday = now?.day === dayKey
  const current = isToday && now ? findCurrentSlot(slots, now.minutes) : undefined
  const best = bestSlot(slots)
  const bounds = dayBounds(slots)

  return (
    <div className="flex flex-col gap-4">
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-3">
          <Clock className="size-5 text-blue-700" aria-hidden="true" />
          <div className="flex flex-col">
            <span className="text-xs font-medium text-slate-500">
              {dayLabel}
              {isToday ? " (dziś)" : ""} · godziny grafiku
            </span>
            <span className="font-semibold tabular-nums text-slate-900">
              {bounds ? `${bounds.open} – ${bounds.close}` : "—"}
            </span>
          </div>
        </div>
        {best && (
          <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-3">
            <Trophy className="size-5 text-emerald-600" aria-hidden="true" />
            <div className="flex flex-col">
              <span className="text-xs font-medium text-slate-500">Najwięcej miejsca</span>
              <span className="font-semibold tabular-nums text-slate-900">
                {parseRange(best.time).start} – {parseRange(best.time).end} · {best.free_lanes}{" "}
                {lanesLabel(best.free_lanes)}
              </span>
            </div>
          </div>
        )}
      </div>

      <h3 className="sr-only">
        Wolne tory — {pool.name}, {dayLabel}
      </h3>
      <ol className="flex flex-col gap-2">
        {slots.map((slot) => (
          <SlotRow
            key={slot.time}
            slot={slot}
            total={pool.laneCount}
            isCurrent={slot === current}
            isPast={Boolean(isToday && now && parseRange(slot.time).endMin <= now.minutes)}
          />
        ))}
      </ol>
    </div>
  )
}
