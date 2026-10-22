import { cn } from "@/lib/utils"
import { getAvailability } from "@/lib/schedule"
import { AVAILABILITY_STYLES } from "./availability-styles"

export function LaneMeter({
  free,
  total,
  className,
}: {
  free: number
  total: number
  className?: string
}) {
  const style = AVAILABILITY_STYLES[getAvailability(free, total)]
  return (
    <div className={cn("flex items-end gap-1", className)} aria-hidden="true">
      {Array.from({ length: total }, (_, i) => (
        <span
          key={i}
          className={cn("h-full w-1.5 rounded-full sm:w-2", i < free ? style.lane : "bg-slate-200")}
        />
      ))}
    </div>
  )
}
