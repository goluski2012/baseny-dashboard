import { ExternalLink, MapPin, Phone } from "lucide-react"
import { otherPoolsData, type OtherPool } from "@/lib/other-pools"
import { REFERENCE_POINT } from "@/lib/pools-data"
import { cn } from "@/lib/utils"
import { DistanceBadge } from "./distance-badge"

const km = (distance: string) => Number.parseFloat(distance)

// Legacy "(25 km)" suffixes in `location` predate the Gołuski reference point and would contradict the badge.
const cleanLocation = (location: string) => location.replace(/\s*\(\d+(?:[.,]\d+)?\s*km\)/i, "")

const sortedPools = [...otherPoolsData].sort((a, b) => km(a.distance) - km(b.distance))

export function OtherPoolsDirectory() {
  return (
    <section aria-labelledby="directory-heading" className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <h2 id="directory-heading" className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
          Inne pływalnie w okolicy
        </h2>
        <p className="text-sm text-slate-600">
          Posortowane według odległości dojazdu samochodem z punktu: {REFERENCE_POINT}.
        </p>
      </div>
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {sortedPools.map((pool) => (
          <li key={pool.name} className="flex">
            <DirectoryCard pool={pool} />
          </li>
        ))}
      </ul>
    </section>
  )
}

function DirectoryCard({ pool }: { pool: OtherPool }) {
  const multisportKnown = pool.multisport === "Honorowana"
  const host = pool.url.replace(/^https?:\/\//, "").replace(/\/$/, "")

  return (
    <article className="flex w-full flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-2">
        <div className="flex flex-wrap gap-1.5">
          <span className="rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-700">{pool.type}</span>
          <span
            className={cn(
              "rounded-md px-2 py-0.5 text-xs font-medium",
              multisportKnown ? "bg-emerald-50 text-emerald-800" : "bg-slate-100 text-slate-500",
            )}
          >
            Multisport: {pool.multisport}
          </span>
        </div>
        <h3 className="text-base font-semibold leading-snug text-slate-900">{pool.name}</h3>
        <p className="text-sm text-slate-500">{cleanLocation(pool.location)}</p>
        <DistanceBadge distance={pool.distance} />
      </div>

      {pool.characteristics && (
        <dl className="flex flex-col gap-2 rounded-xl bg-slate-50 p-3 text-sm">
          {pool.characteristics.sport_pool && (
            <div className="flex flex-col gap-0.5">
              <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">Basen sportowy</dt>
              <dd className="leading-relaxed text-slate-700">{pool.characteristics.sport_pool}</dd>
            </div>
          )}
          {pool.characteristics.other_pools && (
            <div className="flex flex-col gap-0.5">
              <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">Pozostałe niecki</dt>
              <dd className="leading-relaxed text-slate-700">{pool.characteristics.other_pools}</dd>
            </div>
          )}
        </dl>
      )}

      <div className="mt-auto flex flex-col gap-2 border-t border-slate-100 pt-3 text-sm">
        <p className="flex items-start gap-2 text-slate-600">
          <MapPin className="mt-0.5 size-4 shrink-0 text-slate-400" aria-hidden="true" />
          <span>{pool.address}</span>
        </p>
        <a
          href={`tel:+48${pool.phone.replace(/\s/g, "")}`}
          className="flex w-fit items-center gap-2 font-medium text-blue-700 hover:underline"
        >
          <Phone className="size-4 shrink-0" aria-hidden="true" />
          {pool.phone}
        </a>
        <a
          href={pool.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex w-fit items-center gap-2 font-medium text-blue-700 hover:underline"
        >
          <ExternalLink className="size-4 shrink-0" aria-hidden="true" />
          {host}
          <span className="sr-only">(otwiera się w nowej karcie)</span>
        </a>
      </div>
    </article>
  )
}
