// app/useHashRoute.ts
// The ONLY navigation primitive in the app. Hash-based so URLs are deep-linkable
// and the browser back button works for free. ~25 lines, no dependency.

import { useCallback, useEffect, useState } from 'react'
import { parseHash, type Route } from './routes'

export function useHashRoute() {
  const [route, setRoute] = useState<Route>(() => parseHash(window.location.hash))

  useEffect(() => {
    const onChange = () => setRoute(parseHash(window.location.hash))
    window.addEventListener('hashchange', onChange)
    return () => window.removeEventListener('hashchange', onChange)
  }, [])

  const navigate = useCallback((hash: string) => {
    if (window.location.hash === hash) {
      // same hash — force a re-parse (e.g. re-entering home from home)
      setRoute(parseHash(hash))
    } else {
      window.location.hash = hash
    }
  }, [])

  return { route, navigate }
}
