export type DayKey =
  | "poniedzialek"
  | "wtorek"
  | "sroda"
  | "czwartek"
  | "piatek"
  | "sobota"
  | "niedziela"

export type PoolId =
  | "Chwiałka_POSiR"
  | "Plywalnia_Grunwald_POSiR"
  | "CityZen_Poznan"
  | "Termy_Tarnowskie"

export interface TimeSlot {
  time: string
  free_lanes: number
  /** Descriptive status from the timetable when the pool doesn't publish exact lane counts. */
  note?: string
}

export type PoolSchedule = Partial<Record<DayKey, TimeSlot[]>>

export interface PoolInfo {
  id: PoolId
  name: string
  shortName: string
  address: string
  laneCount: number
  poolLength: string
  officialUrl: string
  distance: string
}

export const LAST_UPDATED = "2026-10-19"

export const REFERENCE_POINT = "Gołuski (gmina Dopiewo, 62-070)"

export const DAYS: { key: DayKey; label: string; short: string }[] = [
  { key: "poniedzialek", label: "Poniedziałek", short: "Pon" },
  { key: "wtorek", label: "Wtorek", short: "Wt" },
  { key: "sroda", label: "Środa", short: "Śr" },
  { key: "czwartek", label: "Czwartek", short: "Czw" },
  { key: "piatek", label: "Piątek", short: "Pt" },
  { key: "sobota", label: "Sobota", short: "Sob" },
  { key: "niedziela", label: "Niedziela", short: "Nd" },
]

export const POOLS: PoolInfo[] = [
  {
    id: "Chwiałka_POSiR",
    name: "POSiR Oddział Chwiałka",
    shortName: "Chwiałka",
    address: "ul. Spychalskiego 34, Poznań",
    laneCount: 6,
    poolLength: "25 m",
    officialUrl: "https://posir.poznan.pl",
    distance: "13.8 km",
  },
  {
    id: "Plywalnia_Grunwald_POSiR",
    name: "Pływalnia Miejska Grunwald",
    shortName: "Grunwald",
    address: "ul. Taborowa 4, Poznań",
    laneCount: 8,
    poolLength: "25 m",
    officialUrl: "https://posir.poznan.pl",
    distance: "10.5 km",
  },
  {
    id: "CityZen_Poznan",
    name: "CityZen Poznań",
    shortName: "CityZen",
    address: "ul. Droga Dębińska 10c, Poznań",
    laneCount: 8,
    poolLength: "25 m",
    officialUrl: "https://efitness.com.pl",
    distance: "13.1 km",
  },
  {
    id: "Termy_Tarnowskie",
    name: "Tarnowskie Termy",
    shortName: "Tarnowskie Termy",
    address: "ul. Nowa 54, Tarnowo Podgórne",
    laneCount: 6,
    poolLength: "25 m",
    officialUrl: "https://tarnowskie-termy.pl",
    distance: "19.2 km",
  },
]

/**
 * POSiR publishes descriptive statuses instead of lane counts. These estimates
 * drive colours, sorting and the lane meter; the original wording is kept in `note`.
 */
function estimateLanes(status: string, laneCount: number) {
  const s = status.toLowerCase()
  if (s.includes("wszystkie tory wolne")) return laneCount
  if (s.includes("większość")) return Math.round(laneCount * 0.75)
  if (s.includes("pojedyncze")) return Math.max(1, Math.round(laneCount * 0.25))
  if (s.includes("częściowo")) return Math.round(laneCount * 0.4)
  if (s.includes("wolne")) return Math.round(laneCount * 0.5)
  return 0
}

function fromStatuses(laneCount: number, ranges: Record<string, string>): TimeSlot[] {
  return Object.entries(ranges).map(([time, note]) => ({
    time,
    note,
    free_lanes: estimateLanes(note, laneCount),
  }))
}

/** Converts a "start time → lanes" matrix into ranges, merging neighbours with equal counts. */
function fromStartTimes(points: Record<string, number>, close = "22:00"): TimeSlot[] {
  const entries = Object.entries(points)
  const slots: TimeSlot[] = []
  entries.forEach(([start, lanes], i) => {
    const end = entries[i + 1]?.[0] ?? close
    const prev = slots[slots.length - 1]
    if (prev && prev.free_lanes === lanes) {
      prev.time = `${prev.time.split("-")[0]}-${end}`
    } else {
      slots.push({ time: `${start}-${end}`, free_lanes: lanes })
    }
  })
  return slots
}

const ALL_BUSY_POSIR: TimeSlot[] = [{ time: "06:15-22:00", free_lanes: 0, note: "Wszystkie tory zajęte" }]

export const poolsData: Record<PoolId, PoolSchedule> = {
  Chwiałka_POSiR: {
    poniedzialek: ALL_BUSY_POSIR,
    wtorek: fromStatuses(6, {
      "06:15-16:00": "Wolne pojedyncze tory",
      "16:00-19:45": "Zajęte przez kluby",
      "19:45-22:00": "Zajęte",
    }),
    sroda: fromStatuses(6, { "06:15-15:15": "Wolne tory", "15:15-22:00": "Wszystkie tory zajęte" }),
    czwartek: fromStatuses(6, { "06:15-16:00": "Wolne tory", "16:00-22:00": "Wszystkie tory zajęte" }),
    piatek: fromStatuses(6, { "06:15-15:15": "Wolne tory", "15:15-22:00": "Wszystkie tory zajęte" }),
    sobota: fromStatuses(6, {
      "06:15-11:30": "Wszystkie tory WOLNE",
      "11:30-16:00": "Częściowo zajęte",
      "16:00-22:00": "Zajęte",
    }),
    niedziela: fromStatuses(6, { "06:15-10:00": "Wszystkie tory WOLNE", "10:00-22:00": "Wszystkie tory zajęte" }),
  },
  Plywalnia_Grunwald_POSiR: {
    poniedzialek: ALL_BUSY_POSIR,
    wtorek: fromStatuses(8, {
      "06:15-09:15": "Zajęte",
      "09:15-14:30": "Wolne tory",
      "14:30-22:00": "Zajęte przez szkółki",
    }),
    sroda: fromStatuses(8, { "06:15-09:15": "Zajęte", "09:15-13:00": "Wolne tory", "13:00-22:00": "Zajęte" }),
    czwartek: fromStatuses(8, { "06:15-09:15": "Zajęte", "09:15-14:30": "Wolne tory", "14:30-22:00": "Zajęte" }),
    piatek: fromStatuses(8, { "06:15-12:15": "Zajęte", "12:15-16:00": "Wolne tory", "16:00-22:00": "Zajęte" }),
    sobota: fromStatuses(8, { "06:15-16:00": "Wolne pojedyncze tory", "16:00-22:00": "Zajęte" }),
    niedziela: fromStatuses(8, { "06:15-16:00": "Większość torów wolna", "16:00-22:00": "Zajęte" }),
  },
  CityZen_Poznan: {
    wtorek: [
      { time: "05:45-06:30", free_lanes: 0 }, { time: "06:30-08:00", free_lanes: 7 },
      { time: "08:00-11:00", free_lanes: 0 }, { time: "11:00-13:15", free_lanes: 2 },
      { time: "13:15-14:45", free_lanes: 0 }, { time: "14:45-15:30", free_lanes: 5 },
      { time: "15:30-17:00", free_lanes: 4 }, { time: "17:00-18:30", free_lanes: 1 },
      { time: "18:30-20:00", free_lanes: 6 }, { time: "20:00-22:15", free_lanes: 0 },
    ],
    sroda: [
      { time: "05:45-06:30", free_lanes: 0 }, { time: "06:30-07:15", free_lanes: 7 },
      { time: "07:15-08:00", free_lanes: 5 }, { time: "08:00-09:30", free_lanes: 7 },
      { time: "09:30-10:15", free_lanes: 5 }, { time: "10:15-11:00", free_lanes: 2 },
      { time: "11:00-13:15", free_lanes: 7 }, { time: "13:15-15:30", free_lanes: 0 },
      { time: "15:30-17:45", free_lanes: 0 }, { time: "17:45-20:00", free_lanes: 7 },
      { time: "20:00-22:15", free_lanes: 0 },
    ],
    czwartek: [
      { time: "05:45-06:30", free_lanes: 0 }, { time: "06:30-07:15", free_lanes: 5 },
      { time: "07:15-08:00", free_lanes: 4 }, { time: "08:00-09:30", free_lanes: 0 },
      { time: "09:30-10:15", free_lanes: 7 }, { time: "10:15-11:00", free_lanes: 1 },
      { time: "11:00-13:15", free_lanes: 5 }, { time: "13:15-14:45", free_lanes: 2 },
      { time: "14:45-15:30", free_lanes: 7 }, { time: "15:30-17:45", free_lanes: 0 },
      { time: "17:45-19:15", free_lanes: 4 }, { time: "19:15-20:45", free_lanes: 0 },
      { time: "20:45-22:15", free_lanes: 1 },
    ],
    piatek: [
      { time: "05:45-06:30", free_lanes: 6 }, { time: "06:30-07:15", free_lanes: 7 },
      { time: "07:15-08:00", free_lanes: 8 }, { time: "08:00-11:00", free_lanes: 0 },
      { time: "11:00-14:45", free_lanes: 3 }, { time: "14:45-15:30", free_lanes: 7 },
      { time: "15:30-18:30", free_lanes: 0 }, { time: "18:30-20:00", free_lanes: 5 },
      { time: "20:00-21:30", free_lanes: 2 }, { time: "21:30-22:15", free_lanes: 0 },
    ],
    sobota: [
      { time: "05:45-06:30", free_lanes: 0 }, { time: "06:30-07:15", free_lanes: 7 },
      { time: "07:15-11:45", free_lanes: 0 }, { time: "11:45-12:30", free_lanes: 2 },
      { time: "12:30-14:45", free_lanes: 0 }, { time: "14:45-15:30", free_lanes: 7 },
      { time: "15:30-18:30", free_lanes: 5 }, { time: "18:30-22:15", free_lanes: 0 },
    ],
    niedziela: [
      { time: "05:45-07:15", free_lanes: 0 }, { time: "07:15-09:30", free_lanes: 3 },
      { time: "09:30-11:00", free_lanes: 1 }, { time: "11:00-11:45", free_lanes: 0 },
      { time: "11:45-12:30", free_lanes: 1 }, { time: "12:30-13:15", free_lanes: 2 },
      { time: "13:15-15:30", free_lanes: 0 }, { time: "15:30-16:15", free_lanes: 3 },
      { time: "16:15-17:00", free_lanes: 7 }, { time: "17:00-19:15", free_lanes: 0 },
      { time: "19:15-20:00", free_lanes: 1 }, { time: "20:00-22:15", free_lanes: 0 },
    ],
  },
  Termy_Tarnowskie: {
    poniedzialek: fromStartTimes({ "06:00": 2, "06:30": 2, "07:30": 6, "08:30": 5, "09:15": 3, "10:00": 1, "10:45": 1, "11:30": 4, "12:15": 4, "13:00": 1, "13:45": 1, "14:30": 1, "15:15": 2, "16:00": 2, "16:45": 1, "17:30": 1, "18:15": 1, "19:00": 1, "19:45": 2, "20:30": 3, "20:45": 3, "21:15": 6 }),
    wtorek: fromStartTimes({ "06:00": 3, "06:30": 5, "07:30": 5, "08:30": 1, "09:15": 0, "10:00": 2, "10:45": 1, "11:30": 0, "12:15": 2, "13:00": 0, "13:45": 0, "14:30": 5, "15:15": 1, "16:00": 0, "16:45": 0, "17:30": 1, "18:15": 0, "19:00": 0, "19:45": 1, "20:30": 3, "20:45": 5, "21:15": 5 }),
    sroda: fromStartTimes({ "06:00": 4, "06:30": 4, "07:30": 6, "08:30": 1, "09:15": 1, "10:00": 2, "10:45": 2, "11:30": 1, "12:15": 2, "13:00": 1, "13:45": 1, "14:30": 2, "15:15": 1, "16:00": 1, "16:45": 1, "17:30": 1, "18:15": 1, "19:00": 1, "19:45": 2, "20:30": 1, "20:45": 4, "21:15": 6 }),
    czwartek: fromStartTimes({ "06:00": 3, "06:30": 3, "07:30": 3, "08:30": 1, "09:15": 3, "10:00": 1, "10:45": 1, "11:30": 4, "12:15": 2, "13:00": 0, "13:45": 0, "14:30": 4, "15:15": 3, "16:00": 1, "16:45": 0, "17:30": 1, "18:15": 1, "19:00": 1, "19:45": 3, "20:30": 1, "20:45": 5, "21:15": 3 }),
    piatek: fromStartTimes({ "06:00": 4, "06:30": 4, "07:30": 6, "08:30": 4, "09:15": 3, "10:00": 3, "10:45": 3, "11:30": 5, "12:15": 1, "13:00": 4, "13:45": 3, "14:30": 1, "15:15": 2, "16:00": 1, "16:45": 1, "17:30": 0, "18:15": 2, "19:00": 1, "19:45": 3, "20:30": 4, "20:45": 6, "21:15": 6 }),
    sobota: fromStartTimes({ "06:30": 3, "07:30": 5, "08:30": 4, "09:15": 1, "10:00": 3, "10:45": 2, "11:30": 1, "12:15": 2, "13:00": 1, "13:45": 0, "14:30": 1, "15:15": 2, "16:00": 2, "16:45": 5, "17:30": 5, "18:15": 6, "19:00": 6, "19:45": 6, "20:30": 6, "20:45": 6, "21:15": 6 }),
    niedziela: fromStartTimes({ "06:30": 6, "07:30": 6, "08:30": 6, "09:15": 6, "10:00": 5, "10:45": 4, "11:30": 6, "12:15": 4, "13:00": 4, "13:45": 4, "14:30": 3, "15:15": 3, "16:00": 6, "16:45": 6, "17:30": 6, "18:15": 6, "19:00": 6, "19:45": 5, "20:30": 6, "20:45": 6, "21:15": 6 }),
  },
}
