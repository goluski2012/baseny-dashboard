import { Car } from "lucide-react"
import { cn } from "@/lib/utils"

export function formatDistance(distance: string) {
  return distance.replace(".", ",")
}

export function DistanceBadge({ distance, className }: { distance: string; className?: string }) {
  return (
    <p
      className={cn(
        "inline-flex w-fit items-center gap-1.5 rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-900 ring-1 ring-inset ring-blue-200",
        className,
      )}
    >
      <Car className="size-3.5 shrink-0 text-blue-700" aria-hidden="true" />
      <span>
        Odległość z Gołusek: <span className="font-bold tabular-nums">{formatDistance(distance)}</span>
      </span>
    </p>
  )
}
