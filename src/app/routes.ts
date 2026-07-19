// app/routes.ts
// The ONLY place that defines route shapes. Two screens total.

export type Route =
  | { name: 'home' }
  | { name: 'viewer'; chapterId: string }

/** Parse `window.location.hash` into a Route. Unknown/empty → home. */
export function parseHash(hash: string): Route {
  // accept "#/chapter-id" or "#chapter-id"; treat bare "#/" or "" as home
  const m = hash.match(/^#\/?([^/?#]+)?$/)
  if (!m || !m[1]) return { name: 'home' }
  return { name: 'viewer', chapterId: decodeURIComponent(m[1]) }
}
