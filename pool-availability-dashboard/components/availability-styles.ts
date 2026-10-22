import type { Availability } from "@/lib/schedule"

export const AVAILABILITY_STYLES: Record<
  Availability,
  { dot: string; lane: string; text: string; chip: string }
> = {
  high: {
    dot: "bg-emerald-500",
    lane: "bg-emerald-500",
    text: "text-emerald-700",
    chip: "bg-emerald-50 text-emerald-800 ring-emerald-200",
  },
  medium: {
    dot: "bg-blue-500",
    lane: "bg-blue-500",
    text: "text-blue-700",
    chip: "bg-blue-50 text-blue-800 ring-blue-200",
  },
  low: {
    dot: "bg-amber-500",
    lane: "bg-amber-500",
    text: "text-amber-700",
    chip: "bg-amber-50 text-amber-900 ring-amber-200",
  },
  none: {
    dot: "bg-rose-500",
    lane: "bg-rose-500",
    text: "text-rose-700",
    chip: "bg-rose-50 text-rose-800 ring-rose-200",
  },
}
