// app/App.tsx
// Application shell. Decides Home vs Viewer from the hash route.
// The chapter id is resolved against the registry; the Viewer only mounts for
// an available chapter. Back/Esc return home.

import { useEffect } from 'react'
import { useHashRoute } from './useHashRoute'
import { isAvailable } from '../chapter-loader/registry'
import Home from '../home/Home'
import Viewer from '../viewer/Viewer'

export default function App() {
  const { route, navigate } = useHashRoute()

  // Esc → leave the viewer and return home.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') navigate('#/')
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [navigate])

  const inViewer = route.name === 'viewer' && isAvailable(route.chapterId)

  if (inViewer) {
    // The current Viewer still imports chapter 1's runtime statically (Phase 4
    // makes it chapter-agnostic via the registry's loadStory). Mounting it
    // conditionally guarantees its raf/listeners are cleaned up on unmount.
    return (
      <>
        <Viewer />
        <button
          className="viewer-back"
          onClick={() => navigate('#/')}
          title="Back to home (Esc)"
          aria-label="Back to home"
        >
          ◁ <span>Home</span>
        </button>
      </>
    )
  }

  // Unknown or coming-soon chapter id → fall back to home.
  return <Home onOpen={(id) => navigate('#/' + id)} />
}
