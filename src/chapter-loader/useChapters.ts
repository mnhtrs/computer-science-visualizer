// chapter-loader/useChapters.ts
// React hook the Home page consumes. The list is built once at module load
// (eager glob), so this just returns it.

import { useMemo } from 'react'
import { chapters } from './registry'
import type { ChapterMeta } from './types'

export function useChapters(): ChapterMeta[] {
  // useMemo with empty deps — the registry is static for the app's lifetime.
  return useMemo(() => chapters, [])
}
