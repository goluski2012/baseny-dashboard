import {
  DAYS,
  POOLS,
  poolsData,
  type DayKey,
  type PoolInfo,
  type PoolSchedule,
  type TimeSlot,
} from "./pools-data"

export type Availability = "none" | "low" | "medium" | "high"

const JS_DAY_TO_KEY: DayKey[] = [
  "niedziela",
  "poniedzialek",
  "wtorek",
  "sroda",
  "czwartek",
  "piatek",
  "sobota",
]

export interface WarsawNow {
  day: DayKey
  minutes: number
  label: string
}

export function getWarsawNow(date = new Date()): WarsawNow {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Europe/Warsaw",
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(date)

  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? ""
  const weekdayIndex = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(get("weekday"))
  const hour = Number(get("hour"))
  const minute = Number(get("minute"))

  return {
    day: JS_DAY_TO_KEY[weekdayIndex === -1 ? 0 : weekdayIndex],
    minutes: hour * 60 + minute,
    label: `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`,
  }
}

function toMinutes(hhmm: string) {
  const [h, m] = hhmm.split(":").map(Number)
  return h * 60 + m
}

export function parseRange(time: string) {
  const [start, end] = time.split("-")
  return { start, end, startMin: toMinutes(start), endMin: toMinutes(end) }
}

export function findCurrentSlot(slots: TimeSlot[] | undefined, minutes: number) {
  if (!slots) return undefined
  return slots.find((slot) => {
    const { startMin, endMin } = parseRange(slot.time)
    return minutes >= startMin && minutes < endMin
  })
}

export function findNextSlot(slots: TimeSlot[] | undefined, minutes: number) {
  if (!slots) return undefined
  return slots.find((slot) => parseRange(slot.time).startMin > minutes && slot.free_lanes > 0)
}

export function getAvailability(free: number, total: number): Availability {
  if (free <= 0) return "none"
  const ratio = free / total
  if (ratio <= 0.25) return "low"
  if (ratio < 0.6) return "medium"
  return "high"
}

export function lanesLabel(n: number) {
  if (n === 1) return "wolny tor"
  const lastDigit = n % 10
  const lastTwo = n % 100
  if (lastDigit >= 2 && lastDigit <= 4 && (lastTwo < 12 || lastTwo > 14)) return "wolne tory"
  return "wolnych torów"
}

export function availableDays(schedule: PoolSchedule) {
  return DAYS.filter((d) => schedule[d.key]?.length)
}

export function bestSlot(slots: TimeSlot[] | undefined) {
  if (!slots?.length) return undefined
  return slots.reduce((best, slot) => {
    if (slot.free_lanes > best.free_lanes) return slot
    if (slot.free_lanes === best.free_lanes) {
      const a = parseRange(slot.time)
      const b = parseRange(best.time)
      if (a.endMin - a.startMin > b.endMin - b.startMin) return slot
    }
    return best
  })
}

export function formatMinutes(min: number) {
  return `${String(Math.floor(min / 60)).padStart(2, "0")}:${String(min % 60).padStart(2, "0")}`
}

export function nextDayKey(day: DayKey): DayKey {
  const i = DAYS.findIndex((d) => d.key === day)
  return DAYS[(i + 1) % DAYS.length].key
}

export interface FreeLaneHit {
  pool: PoolInfo
  day: DayKey
  slot: TimeSlot
  /** Effective start (clipped to "now" for slots already in progress). */
  fromMin: number
  endMin: number
  isNow: boolean
  waitMin: number
}

function sortHits(a: FreeLaneHit, b: FreeLaneHit) {
  return a.fromMin - b.fromMin || b.slot.free_lanes - a.slot.free_lanes || a.pool.name.localeCompare(b.pool.name)
}

/** All slots with at least one free lane that overlap the window [now, now + windowMin]. */
export function findFreeLanes(now: WarsawNow, windowMin: number): FreeLaneHit[] {
  const windowEnd = now.minutes + windowMin
  const hits: FreeLaneHit[] = []
  for (const pool of POOLS) {
    for (const slot of poolsData[pool.id][now.day] ?? []) {
      const { startMin, endMin } = parseRange(slot.time)
      if (slot.free_lanes <= 0 || endMin <= now.minutes || startMin >= windowEnd) continue
      const fromMin = Math.max(startMin, now.minutes)
      hits.push({
        pool,
        day: now.day,
        slot,
        fromMin,
        endMin,
        isNow: startMin <= now.minutes,
        waitMin: fromMin - now.minutes,
      })
    }
  }
  return hits.sort(sortHits)
}

/** First free slot per pool on the following day — used when nothing is free in the window. */
export function findTomorrowFreeLanes(now: WarsawNow): FreeLaneHit[] {
  const day = nextDayKey(now.day)
  const hits: FreeLaneHit[] = []
  for (const pool of POOLS) {
    const slot = (poolsData[pool.id][day] ?? []).find((s) => s.free_lanes > 0)
    if (!slot) continue
    const { startMin, endMin } = parseRange(slot.time)
    hits.push({ pool, day, slot, fromMin: startMin, endMin, isNow: false, waitMin: 0 })
  }
  return hits.sort(sortHits)
}

export function dayBounds(slots: TimeSlot[] | undefined) {
  if (!slots?.length) return undefined
  return {
    open: parseRange(slots[0].time).start,
    close: parseRange(slots[slots.length - 1].time).end,
  }
}
