// narration/labels.ts — static UI/scene text used by the viewer.

import type { LocalizedText } from '../../../chapter-loader/types'

export const chapterTitle: LocalizedText = {
  en: 'How does a computer run my program?',
  vi: 'Máy tính chạy chương trình của mình như thế nào?',
}
export const waitingLine: LocalizedText = {
  en: 'Click the file on the screen to begin.',
  vi: 'Hãy bấm vào tệp trên màn hình để bắt đầu.',
}
export const finaleLine: LocalizedText = {
  en: 'Done! The CPU ran every instruction, one at a time \u2014 repeating this cycle until the program ends.',
  vi: 'Xong! CPU đã chạy từng lệnh, từng lệnh một \u2014 lặp lại chu kỳ này cho đến khi hết chương trình.',
}
export const insideCpuTag: LocalizedText = { en: 'Inside the CPU', vi: 'Bên trong CPU' }
export const programLabel: LocalizedText = { en: 'PROGRAM (in RAM)', vi: 'CHƯƠNG TRÌNH (trong RAM)' }
export const pcLabel: LocalizedText = { en: 'Counter', vi: 'Bộ đếm' }
export const memLabel: LocalizedText = { en: 'Memory', vi: 'Bộ nhớ' }
export const nowLabel: LocalizedText = { en: 'NOW', vi: 'ĐANG' }
export const doneLabel: LocalizedText = { en: 'Done', vi: 'Xong' }
