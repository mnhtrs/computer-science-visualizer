// narration/beats.ts — the storyboard of Chapter 03: 13 beats over 2 scenes.
// Facts frozen in docs/chapters/chapter-03-across-the-internet/06_NARRATION.md.
// Each beat introduces exactly ONE mutation (Constitution 01 §1.1); the two
// atomic chunks (b3 slicing, b4 road-in-motion, b9 ask+resend) are disclosed
// in 03_PIPELINE_VALIDATION.md V7. Scene is stated explicitly on EVERY beat
// (scene is non-sticky by contract — learned from Ch-02's self-review).

import type { BeatDescription } from '../../../chapter-loader/types'

export const beats: BeatDescription[] = [
  // ---- ACT 1 — the door & the road --------------------------------------------
  {
    id: 'ready',
    scene: 'wire',
    line: {
      en: 'Far away, a Server has finished preparing your page: the HTML file, one long stream of bytes. Watch what happens the moment it leaves the building.',
      vi: 'Ở nơi xa, Server đã chuẩn bị xong trang của bạn: tệp HTML, một dòng bytes dài. Hãy nhìn khoảnh khắc nó rời khỏi máy.',
    },
    duration: 2800, active: 'server', rest: { at: 0 }, emerge: true,
  },
  {
    id: 'road',
    scene: 'wire',
    line: {
      en: 'These bytes cannot travel in a straight line. There is no wire running from the Server all the way to you. Between the two machines lies a web of other computers, each one linked to a few neighbors. Your bytes must cross them one by one. Each of those machines is a Router, and the whole web is the Internet.',
      vi: 'Đống bytes này không thể đi thẳng. Chẳng có sợi dây nào chạy từ Server tới tận chỗ bạn cả. Giữa hai cỗ máy là một mạng lưới những máy tính khác, máy nào cũng nối với vài máy hàng xóm. Bytes của bạn phải băng qua từng máy một. Mỗi máy như vậy là một Router, và cả mạng lưới đó là Internet.',
    },
    duration: 4200, active: 'router4', rest: { at: 0 },
  },
  // ---- ACT 2 — the road in motion ----------------------------------------------
  {
    id: 'whole',
    scene: 'wire',
    line: {
      en: 'Why not just send the file whole? Picture it: the file hogs the entire cable while everyone else waits. And one bad bit is enough to spoil the whole stream, which would have to go all the way back and start again.',
      vi: 'Sao không gửi nguyên cả tệp cho rồi? Thử tưởng tượng: tệp chiếm trọn sợi cáp trong khi tất cả mọi người phải chờ. Và chỉ một bit hỏng là đủ làm hỏng cả dòng, phải quay về tận gốc và đi lại từ đầu.',
    },
    duration: 3400, active: 'server', travel: { from: 0, to: 1 },
  },
  {
    id: 'slice',
    scene: 'wire',
    line: {
      en: 'So the Server never sends it whole. It slices the file into small pieces: Packets. Every packet carries one slice of the file, plus a header on top: where it comes from, where it is going, that same number DNS once handed over, and its place in line, the Sequence Number.',
      vi: 'Nên Server không bao giờ gửi nguyên tệp. Nó cắt tệp thành những mảnh nhỏ: các Packet. Mỗi packet chở một lát của tệp, kèm một cái header ở trên: từ đâu tới, đi tới đâu, chính là con số DNS từng đưa, và vị trí trong hàng của nó, gọi là Sequence Number.',
    },
    duration: 3800, active: 'server', travel: { from: 1, to: 2 },
  },
  {
    id: 'route',
    scene: 'wire',
    line: {
      en: 'At each Router, the packet is read for one thing only: where it is going. The Router hands it to the neighbor closest to that place, and the next Router does the same, and the next. Watch packet two: at one crossing it is sent a different way, because the usual cable is busy. Every crossing decides for itself, right now, from what it can see. That is Routing.',
      vi: 'Ở mỗi Router, packet chỉ bị đọc đúng một thứ: nó đang đi đâu. Router trao nó cho người hàng xóm gần đích nhất, Router kế tiếp lại làm y hệt, rồi kế tiếp nữa. Nhìn packet số hai xem: ở một ngã rẽ nó được gửi đi đường khác, vì sợi cáp quen đang bận. Mỗi ngã rẽ tự quyết định, ngay lúc này, từ những gì nó nhìn thấy. Đó là Routing.',
    },
    // The spark (Packet 1) reaches the NIC at 70% of the beat and DWELLS there
    // while the sibling packets arrive (0.80 / 0.87 / 0.94) — arrival order
    // 1, 3, 5, 2. holdAt.to stays < 1 (update.ts divides by 1−h.to; at 1.0 it
    // would produce NaN at p=1 — the guard Ch-02 documented in its beats.ts).
    duration: 6200, active: 'router3',
    travel: { from: 2, to: 11, holdAt: { index: 11, from: 0.7, to: 0.99 } },
  },
  {
    id: 'mess',
    scene: 'wire',
    line: {
      en: 'The packets reach your computer through the NIC. But look at the order: 1, 3, 5, 2. Number 4 never showed up. Somewhere on the road, a busy Router had to let it go. The Internet does not promise order, and it does not promise delivery. So, who puts this mess back into a file?',
      vi: 'Các packet về tới máy của bạn qua NIC. Nhưng nhìn thứ tự xem: 1, 3, 5, 2. Số 4 chẳng thấy đâu. Ở đâu đó trên đường, một Router bận rộn đành phải bỏ rơi nó. Internet không hứa hẹn thứ tự, cũng không hứa hẹn giao đủ. Vậy, ai xếp đống lộn xộn này trở lại thành một tệp?',
    },
    duration: 3600, active: 'nic', rest: { at: 11 },
  },
  // ---- ACT 3 — the keeper & the hand-off ----------------------------------------
  {
    id: 'slot-1',
    scene: 'bench',
    line: {
      en: 'Inside your machine, someone is watching for the pieces. Each one gets a numbered slot: piece 1 settles into slot 1. This keeper has a name, TCP. And this bench, where the pieces wait to be put together, is its Reassembly Buffer.',
      vi: 'Bên trong máy của bạn, có người đang canh chừng từng mảnh. Mỗi mảnh có một ô đánh số: mảnh 1 yên vị vào ô 1. Người giữ trật tự này có tên, TCP. Còn chiếc bàn này, nơi các mảnh chờ được ghép lại, là Reassembly Buffer của nó.',
    },
    duration: 3200, active: 'bench', travel: { from: 0, to: 1 },
  },
  {
    id: 'park',
    scene: 'bench',
    line: {
      en: 'Piece 3 arrives next, but slot 2 is still empty. Does TCP throw it away? No. It parks 3 in its own slot, and 5 does the same. Out-of-order pieces are not errors. They simply wait in their numbered places.',
      vi: 'Mảnh 3 tới tiếp, nhưng ô số 2 vẫn trống. TCP có vứt nó đi không? Không. Nó xếp mảnh 3 vào đúng ô của nó, và mảnh 5 cũng vậy. Những mảnh đến sai thứ tự không phải là lỗi. Chúng chỉ đơn giản là chờ ở đúng chỗ có đánh số.',
    },
    duration: 3800, active: 'nicport', travel: { from: 1, to: 3 },
  },
  {
    id: 'counter',
    scene: 'bench',
    line: {
      en: 'Piece 2 lands, and watch the counter: it jumps from 1 straight to 3, because 1, 2, 3 are all here, in order. This little confirmation is the ACK: "I have everything up to here." It only ever moves forward, in order, and that is exactly how the other side learns what is missing.',
      vi: 'Mảnh 2 đáp xuống, và nhìn bộ đếm nhé: nó nhảy từ 1 lên thẳng 3, vì 1, 2, 3 đã có đủ, đúng thứ tự. Lời xác nhận nhỏ này là ACK: "tôi đã có đủ tới đây." Nó chỉ tiến về phía trước, đúng thứ tự, và chính nhờ vậy mà đầu bên kia biết được mảnh nào đang thiếu.',
    },
    duration: 4000, active: 'bench', travel: { from: 3, to: 4, holdAt: { index: 4, from: 0.6, to: 0.99 } },
  },
  {
    id: 'ask',
    scene: 'bench',
    line: {
      en: 'So TCP asks for exactly one thing: "send piece 4 again." Not the whole file, just the missing piece. The Server hears it, and piece 4 crosses the road a second time. Slot 4 fills, the counter jumps to 5: everything is here.',
      vi: 'Nên TCP chỉ xin đúng một thứ: "gửi lại mảnh 4." Không phải cả tệp, chỉ mảnh còn thiếu. Server nghe thấy, và mảnh 4 băng qua con đường lần thứ hai. Ô số 4 đầy, bộ đếm nhảy lên 5: đủ cả rồi.',
    },
    duration: 4200, active: 'bench', travel: { from: 4, to: 5, holdAt: { index: 5, from: 0.85, to: 0.99 } },
  },
  {
    id: 'merge',
    scene: 'bench',
    line: {
      en: 'Now the keeper reads the slots in order, 1, 2, 3, 4, 5, and stitches the slices back together. One stream of bytes, whole again: the HTML file, exactly as the Server sent it.',
      vi: 'Giờ người giữ trật tự đọc các ô theo thứ tự, 1, 2, 3, 4, 5, và khâu các lát lại với nhau. Một dòng bytes duy nhất, nguyên vẹn trở lại: tệp HTML, đúng y như Server đã gửi đi.',
    },
    duration: 3600, active: 'bench', travel: { from: 5, to: 8 },
  },
  // ---- finale ---------------------------------------------------------------------
  {
    id: 'home',
    scene: 'wire',
    line: {
      en: 'And the whole file settles into RAM, the fast working memory where every download waits. Not a byte missing, not a piece out of place. This is the exact hand-off you already know: the whole file in RAM, ready for the Browser Engine.',
      vi: 'Và cả tệp trọn vẹn nằm vào RAM, bộ nhớ làm việc tốc độ cao nơi mọi thứ tải xuống nằm chờ. Không thiếu một byte, không mảnh nào lệch chỗ. Đây chính là khoảnh khắc chuyển giao bạn đã biết: tệp nguyên vẹn trong RAM, sẵn sàng cho Browser Engine.',
    },
    duration: 3200, active: 'ram', rest: { at: 12 },
  },
  {
    // Rule A-01 honored: no naming of any future chapter — the hand-off
    // sentence points BACK into Chapter 02's engine, already experienced.
    id: 'recap',
    scene: 'wire',
    line: {
      en: 'So this is how data travels from the Server to the Browser. The file is sliced into Packets, each one stamped with a header and a Sequence Number. The Packets cross the Internet Router by Router, each choosing its own way. They arrive out of order, one is lost. TCP keeps them in numbered slots, asks only for the missing piece, and stitches everything whole, until the complete file rests in RAM.',
      vi: 'Vậy đó là cách dữ liệu đi từ Server tới Browser. Tệp được cắt thành các Packet, mỗi packet được đóng dấu header và Sequence Number. Các Packet băng qua Internet từng Router một, mỗi packet tự chọn đường. Chúng đến sai thứ tự, một packet bị thất lạc. TCP giữ chúng trong những ô đánh số, chỉ xin lại đúng mảnh thiếu, và khâu tất cả lại cho nguyên vẹn, cho tới khi tệp hoàn chỉnh nằm gọn trong RAM.',
    },
    duration: 7500, active: 'browser', rest: { at: 13 }, effect: 'loop',
  },
]
