// Process-local development cache only; never use for seat locks or payment state.
export function createMemoryCache({ maxEntries = 500 } = {}) {
  const entries = new Map()
  function prune() {
    const now = Date.now()
    for (const [key, entry] of entries) if (entry.expiresAt <= now) entries.delete(key)
    while (entries.size > maxEntries) entries.delete(entries.keys().next().value)
  }
  return Object.freeze({
    get(key) { const entry = entries.get(String(key)); if (!entry) return undefined; if (entry.expiresAt <= Date.now()) { entries.delete(String(key)); return undefined } return entry.value },
    set(key, value, ttlMs = 30000) { if (!Number.isFinite(ttlMs) || ttlMs <= 0) throw new TypeError('ttlMs must be positive'); prune(); entries.set(String(key), { value, expiresAt: Date.now() + ttlMs }); return value },
    delete(key) { return entries.delete(String(key)) },
    clear() { entries.clear() },
  })
}
