// narration/labels.ts — UI strings of Chapter 03 (the Viewer reads these via
// chapter.ui; every key the generic Viewer may look for is provided).

import type { LocalizedText } from '../../../chapter-loader/types'

export const chapterTitle: LocalizedText = {
  en: 'How does data travel from Server to Browser?',
  vi: 'Dữ liệu đi từ Server đến Browser như thế nào?',
}
export const waitingLine: LocalizedText = {
  en: 'The Server is ready with your page. Click it to send the answer home.',
  vi: 'Server đã sẵn sàng với trang của bạn. Bấm vào đó để gửi câu trả lời về nhà.',
}
export const startButton: LocalizedText = {
  en: 'Send the response',
  vi: 'Gửi response về',
}
export const sceneTag: LocalizedText = {
  en: 'Inside the receiving machine',
  vi: 'Bên trong cỗ máy nhận',
}
export const tipText: LocalizedText = {
  en: 'Click the Server to begin. Use the < > buttons or the dots to step.',
  vi: 'Bấm vào Server để bắt đầu. Dùng nút < > hoặc các chấm để lùi/tới.',
}
export const doneLabel: LocalizedText = { en: 'Done', vi: 'Xong' }
