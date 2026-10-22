import { cn } from "@/lib/utils"
import { AVAILABILITY_STYLES } from "./availability-styles"
import type { Availability } from "@/lib/schedule"

const ITEMS: { key: Availability; label: string }[] = [
  { key: "high", label: "Dużo miejsca" },
  { key: "medium", label: "Średnio" },
  { key: "low", label: "Mało torów" },
  { key: "none", label: "Brak wolnych" },
]

export function AvailabilityLegend() {
  return (
    <ul className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-slate-200" aria-label="Legenda dostępności">
      {ITEMS.map((item) => (
        <li key={item.key} className="flex items-center gap-2">
          <span className={cn("size-3 rounded-full", AVAILABILITY_STYLES[item.key].dot)} aria-hidden="true" />
          {item.label}
        </li>
      ))}
    </ul>
  )
}
