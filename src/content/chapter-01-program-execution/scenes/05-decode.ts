// scenes/05-decode.ts — Act 5: the Decode stage.
// The Control Unit reads each instruction and works out what to do.

import { CU_POS } from './04-fetch'
import type { PartSpec } from '../types'

export const cu: PartSpec = {
  id: 'cu',
  kind: 'control-unit',
  pos: CU_POS,
  color: '#facc15',
  name: 'Control Unit',
  gloss: {
    en: 'The team leader. It reads each instruction and tells every other part what to do.',
    vi: 'Người chỉ huy. Nó đọc từng lệnh và bảo các phần khác phải làm gì.',
  },
}
