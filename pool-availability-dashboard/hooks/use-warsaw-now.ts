"use client"

import { useSyncExternalStore } from "react"
import { getWarsawNow, type WarsawNow } from "@/lib/schedule"

let cached: WarsawNow | null = null
let cachedKey = ""

function subscribe(onChange: () => void) {
  const id = setInterval(onChange, 30_000)
  return () => clearInterval(id)
}

function getSnapshot() {
  const now = getWarsawNow()
  const key = `${now.day}-${now.minutes}`
  if (key !== cachedKey) {
    cached = now
    cachedKey = key
  }
  return cached
}

function getServerSnapshot() {
  return null
}

export function useWarsawNow() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}
