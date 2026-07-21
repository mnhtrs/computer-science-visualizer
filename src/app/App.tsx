// app/App.tsx
// Application shell. Decides Home vs Viewer from the hash route.
// The chapter id is resolved against the registry; the Viewer only mounts for
// an available chapter. Back/Esc return home.

import { useEffect } from 'react'
import { useHashRoute } from './useHashRoute'
import { isAvailable } from '../chapter-loader/registry'
import Home from '../home/Home'
import Viewer from '../viewer/Viewer'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHouse } from '@fortawesome/free-solid-svg-icons'

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
    // The Viewer is chapter-agnostic: it receives the chapter id and lazy-loads
    // the chapter through the registry. Mounting it conditionally (and keying
    // by id) guarantees its raf/listeners/state are cleaned up between chapters.
    const id = (route as { name: 'viewer'; chapterId: string }).chapterId
    const homeBtn = (
      <button
        className="viewer-back"
        onClick={() => navigate('#/')}
        title="Back to home (Esc)"
        aria-label="Back to home"
      >
        <FontAwesomeIcon icon={faHouse} /> <span>Home</span>
      </button>
    )
    return <Viewer key={id} chapterId={id} controlsLeft={homeBtn} />
  }

  // Unknown or coming-soon chapter id → fall back to home.
  return <Home onOpen={(id) => navigate('#/' + id)} />
}
