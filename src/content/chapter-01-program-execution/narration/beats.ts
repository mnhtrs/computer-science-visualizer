// narration/beats.ts — the storyboard. The single narrative thread the viewer
// plays. Each beat is one short idea. The `cpu-run` beat owns the whole
// execution phase (intro + 8 instructions × 5 stages).

import type { AnyPartId, Beat } from '../types'
import { EXEC_DURATION, EXEC_OFFSET } from './cycle'

export const beats: Beat[] = [
  {
    id: 'click',
    line: { en: 'You opened the file.', vi: 'Bạn đã mở tệp.' },
    duration: 1300, active: 'monitor' as AnyPartId, rest: { at: 0 }, emerge: true,
  },
  {
    id: 'seek',
    line: {
      en: 'Your operating system (like Windows) opens the program and gets ready.',
      vi: 'Hệ điều hành (như Windows) mở chương trình và bắt đầu chuẩn bị.',
    },
    duration: 2200, active: 'bus', travel: { from: 0, to: 2 },
  },
  {
    id: 'found',
    line: { en: 'It reads the program from the SSD.', vi: 'Nó đọc chương trình từ SSD.' },
    duration: 2400, active: 'ssd', rest: { at: 2 },
  },
  {
    id: 'copy',
    line: {
      en: 'It makes space in RAM, then moves the program there.',
      vi: 'Nó dọn chỗ trong RAM, rồi chuyển chương trình sang đó.',
    },
    duration: 2200, active: 'bus', travel: { from: 2, to: 3 },
  },
  {
    id: 'ready',
    line: {
      en: 'Now it sits in RAM, ready for the CPU to run it.',
      vi: 'Giờ nó đã nằm trong RAM, sẵn sàng để CPU chạy.',
    },
    duration: 2400, active: 'ram', rest: { at: 3 },
  },
  {
    id: 'read',
    line: {
      en: 'Now the CPU (the computer\u2019s brain) starts running the instructions, one at a time.',
      vi: 'Giờ CPU (bộ não của máy tính) bắt đầu chạy các lệnh, từng cái một.',
    },
    duration: 2400, active: 'bus', travel: { from: 3, to: 5 },
  },
  {
    id: 'cpu-run',
    scene: 'cpu',
    line: {
      en: 'Inside the CPU: a counter, some fast boxes, a calculator, and a team leader. It runs each instruction one at a time \u2014 Fetch, Decode, Execute, Write Back \u2014 then on to the next.',
      vi: 'Bên trong CPU: một bộ đếm, mấy chiếc hộp nhanh, một máy tính, và một người chỉ huy. Nó chạy từng lệnh một \u2014 Lấy, Giải mã, Thực thi, Ghi lại \u2014 rồi sang lệnh kế.',
    },
    duration: EXEC_OFFSET + EXEC_DURATION + 1500,
    active: 'cu',
    rest: { at: 1 },
    effect: 'run',
  },
  {
    id: 'to-gpu',
    line: {
      en: 'When it is time to show something, the CPU asks the GPU to draw it.',
      vi: 'Đến lúc cần hiện gì lên, CPU nhờ GPU vẽ ra.',
    },
    duration: 2200, active: 'bus', travel: { from: 5, to: 8 },
  },
  {
    id: 'gpu-draw',
    line: {
      en: 'The GPU makes the picture. Lots of tiny cores work at once.',
      vi: 'GPU tạo ra bức tranh. Rất nhiều lõi nhỏ làm cùng một lúc.',
    },
    duration: 2800, active: 'gpu', rest: { at: 8 },
  },
  {
    id: 'to-monitor',
    line: {
      en: 'Then it sends the picture to the screen.',
      vi: 'Rồi nó gửi bức tranh ra màn hình.',
    },
    duration: 2000, active: 'bus', travel: { from: 8, to: 10 },
  },
  {
    id: 'loop',
    line: {
      en: 'Done! The CPU ran every instruction, one at a time \u2014 repeating this cycle until the program ends.',
      vi: 'Xong! CPU đã chạy từng lệnh, từng lệnh một \u2014 lặp lại chu kỳ này cho đến khi hết chương trình.',
    },
    duration: 4200, active: null, rest: { at: 0 }, effect: 'loop',
  },
]

export const RUN_I = beats.findIndex((b) => b.effect === 'run')
