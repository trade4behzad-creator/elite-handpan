// Simple in-memory rate limiter shared across server actions / routes.
// Key should be namespaced per use-case (e.g. `admin-login:${ip}`) so
// different features don't share the same bucket.
const store = new Map<string, number[]>()

export function checkRateLimit(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now()
  const times = (store.get(key) ?? []).filter((t) => now - t < windowMs)
  if (times.length >= limit) return false
  times.push(now)
  store.set(key, times)
  return true
}
