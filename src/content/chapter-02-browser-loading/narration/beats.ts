// narration/beats.ts — the storyboard of Chapter 02: 23 beats over 2 scenes.
// Facts frozen in 06_NARRATION.md and amended by 10_REVIEW_REVISION_v1.1.md
// (senior review: key-never-sent, dynamic servers, resource plurality, status
// 200, compositor naming, css-fetch visual fix) and
// 11_ARCHITECTURAL_REVIEW_v1.2.md (TCP demoted to an unnamed "road"
// foreshadow; the UTF-8 name deferred).
// v1.4.0 (18_NARRATION_VOICE_v1.4.0.md): owner-ordered voice pass — same
// facts, everyday human phrasing, fewer dashes. No fact/term/M-truth changed.
// v1.4.1 (20_...): vi rewritten meaning-first (owner: "đừng dịch máy móc").
// v1.4.2 (22_...): curly quotes → straight; vi ellipses → plain dots.
// v1.3.8 (23_...): NIC dwell shortened 0.8 s → 0.4 s (owner round 8, F47).
// v1.3.9 (24_...): NIC dwell shortened 0.4 s → 0.24 s (owner round 9, F50).
// v1.3.11 (26_...): NIC dwell 0.24 s → 0.15 s (F57) + spark now routes
// through the CPU into the engine (F56, path anchors renumbered).
// v1.3.12 (27_...): to-engine rerouted RAM → loading screen → CPU → door
// (F58, owner round 12; anchors renumbered again — 28 points then).
// v1.3.13 (28_...): to-engine ENDS at the CPU (F60, owner round 13 —
// door anchor deleted, 27 points) + CPU/GPU zone divider (F61).
// Each beat introduces exactly ONE mutation (Constitution 01 §1.1).

import type { BeatDescription } from '../../../chapter-loader/types'

export const beats: BeatDescription[] = [
  // ---- ACT 1 — navigation -------------------------------------------------
  {
    id: 'click',
    line: { en: 'You searched, and you click the link. Now the Browser gets to work.', vi: 'Bạn vừa tìm xong và bấm vào đường link. Browser bắt tay làm việc.' },
    duration: 1400, active: 'browser', rest: { at: 0 }, emerge: true,
  },
  {
    id: 'knows',
    line: { en: 'From that click, the Browser reads the URL and pulls out the name it needs: best-cats.example. A name alone is not a place yet.', vi: 'Từ cú click đó, Browser đọc URL và rút ra cái tên nó cần: best-cats.example. Mà có tên thôi thì chưa biết ở đâu cả.' },
    duration: 2600, active: 'browser', travel: { from: 0, to: 2 },
  },
  // ---- ACT 2 — retrieving resources -----------------------------------------
  {
    id: 'dns-q',
    line: { en: 'First question: where is it? The Browser asks DNS, the web\u2019s address book: "who is best-cats.example?"', vi: 'Trước hết phải hỏi: nó ở đâu? Browser hỏi DNS, cuốn sổ địa chỉ của web: "best-cats.example là ai?"' },
    duration: 2800, active: 'dns', travel: { from: 2, to: 5 },
  },
  {
    id: 'dns-a',
    line: { en: 'DNS answers with the real address: a number called the IP address. Notice this: the Browser only asked once. DNS is not a stop along the road.', vi: 'DNS trả lời bằng địa chỉ thật: một con số gọi là địa chỉ IP. Để ý nha, Browser chỉ hỏi đúng một lần. DNS không phải một trạm dừng trên đường đi.' },
    duration: 2400, active: 'dns', travel: { from: 5, to: 8 },
  },
  {
    id: 'https',
    line: { en: 'Before any page data travels, the two machines open a road between them. Then the Browser knocks politely: they do a little math together and end up with the same secret keys on both sides, and the keys themselves are never sent anywhere. From now on their talk is private. That is HTTPS.', vi: 'Trước khi dữ liệu trang chạy đi, hai máy mở một con đường nối hai bên. Browser gõ cửa lễ phép: hai bên cùng làm một phép tính nhỏ và tính ra những chìa khóa bí mật giống hệt nhau ở cả hai đầu, còn bản thân chìa khóa thì không bao giờ đi trên đường cả. Từ giờ hai bên nói chuyện riêng tư. Đó là HTTPS.' },
    duration: 3200, active: 'httpslock', travel: { from: 8, to: 13 },
  },
  {
    id: 'request',
    line: { en: 'Now the real ask, an HTTP request: "please send me the page".', vi: 'Giờ mới là lời nhờ thật, một HTTP request: "làm ơn gửi cho tôi trang web".' },
    duration: 2400, active: 'server', travel: { from: 14, to: 16 },
  },
  {
    id: 'server',
    line: { en: 'The server hears it and works out the answer. Sometimes that\u2019s a file it already has, sometimes one it builds right there. Then it stamps "200 \u2014 OK" and sends the response back.', vi: 'Server nghe xong và tìm câu trả lời. Có khi là một tệp có sẵn, có khi nó phải dựng bytes ngay tại chỗ. Xong nó đóng dấu "200 — OK" rồi gửi response về.' },
    duration: 3000, active: 'server', rest: { at: 17 },
  },
  {
    id: 'response',
    line: { en: 'Back comes the answer: a stream of bytes. That\u2019s the HTML file, the page\u2019s first file. The NIC catches it, and RAM holds on tight.', vi: 'Câu trả lời quay về: một dòng bytes. Đó là tệp HTML, tệp đầu tiên của trang. NIC hứng lấy, RAM giữ chặt.' },
    duration: 3000, active: 'ram',
    // v1.3.7 (F45): the packet parks at the NIC (owner: "dừng 1 chút thì
    // nó mới sang RAM"). v1.3.8 (F47): ~800 → ~390 ms. v1.3.9 (F50):
    // ~390 → ~240 ms. v1.3.11 (F57, owner round 11 "nhanh hơn xíu nữa"):
    // → ~150 ms — hold window 0.52→0.57.
    travel: { from: 17, to: 22, holdAt: { index: 21, from: 0.52, to: 0.57 } },
  },
  // ---- ACT 3 — the rendering pipeline ----------------------------------------
  {
    id: 'to-engine',
    line: { en: 'But bytes in RAM mean nothing yet. So the Browser hands them to its own workshop inside: the Browser Engine.', vi: 'Mà bytes nằm trong RAM thì chưa nghĩa lý gì. Browser mang chúng vào xưởng bên trong mình: Browser Engine.' },
    // v1.3.12 (F58, owner round 12): "nó đi qua RAM xong nhảy lên màn hình
    // loading chứ ko phải đi tiếp sang CPU" — rerouted RAM(22) → loading
    // screen (23, the Waiting spinner at 470,453; crossed at frac ≈ 0.25) →
    // CPU (24). Measured hops: 354 + 372 world px.
    // v1.3.13 (F60, owner round 13 "đi tới CPU là mới vào inside browser
    // engine"): THE ROUTE ENDS AT THE CPU. The engine hall is the work the
    // CPU does, not a physical room; the spark parks on the lit chip (param
    // = 1.0 from frac 0.5 — fA = 1 because the CPU is the last anchor) and
    // REMAINS there to the beat's end; the scene cut IS the entry. The old
    // engine-door climb to the window is deleted — it read as a second,
    // nonsensical loading-screen visit. (h.to stays 0.77: at h.to = 1.0,
    // update.ts divides by 1−h.to = 0 → NaN; the parked tail rides the
    // fA = 1 plateau instead.)
    duration: 2400, active: 'cpu', travel: { from: 22, to: 24, holdAt: { index: 24, from: 0.5, to: 0.77 } },
  },
  {
    id: 'decode',
    scene: 'engine',
    line: { en: 'First job: turn the bytes into characters it can read. <, h, t, m, l\u2026 The file was saved following a rulebook, and the Decoder knows that rulebook.', vi: 'Việc đầu tiên: đổi bytes thành chữ đọc được. <, h, t, m, l... Tệp được ghi theo một quy ước riêng, và Decoder thuộc lòng quy ước đó.' },
    duration: 3000, active: 'decode', rest: { at: 0 },
  },
  {
    id: 'tokenize',
    scene: 'engine',
    line: { en: 'Next, chop the stream into tokens: pieces that mean something. An opening tag, a word, a closing tag. Without tokens, this is all just alphabet soup.', vi: 'Tiếp theo, thái dòng chữ thành các token: những mảnh có nghĩa. Thẻ mở, một từ, thẻ đóng. Không có token thì cả dòng chỉ là một mớ ký tự lộn xộn thôi.' },
    duration: 3000, active: 'tokens', travel: { from: 0, to: 1 },
  },
  {
    id: 'dom',
    scene: 'engine',
    line: { en: 'Watch the Parser work. Each token becomes a node on a family tree that keeps growing, with parents and children. This is the DOM Tree: the page as one living structure.', vi: 'Nhìn Parser làm này. Mỗi token thành một node trên cây gia đình đang lớn dần lên, có cha có con. Đây là DOM Tree: trang web dưới dạng một cấu trúc sống.' },
    duration: 3600, active: 'parser', travel: { from: 1, to: 2 },
  },
  {
    id: 'css-fetch',
    scene: 'engine',
    line: { en: 'Halfway through, the Parser hits a link: this page\u2019s outfit lives in another file. The Browser goes to get it, the same way it will fetch every other file the page asks for. And the Parser does not wait. It keeps reading.', vi: 'Giữa chừng, Parser gặp một cái link: bộ cánh của trang nằm trong một tệp khác. Browser đi lấy nó, đúng kiểu nó sẽ đi lấy bất cứ tệp nào khác trang đòi hỏi. Còn Parser thì không chờ. Nó đọc tiếp.' },
    duration: 3200, active: 'netport', travel: { from: 2, to: 4 },
  },
  {
    id: 'cssom',
    scene: 'engine',
    line: { en: 'The CSS arrives, and it grows its own little tree. Meet the CSSOM: a map of every styling rule.', vi: 'CSS về tới rồi, mọc thành một cây nhỏ của riêng nó. Đây là CSSOM: bản đồ của mọi quy tắc trang trí.' },
    duration: 2800, active: 'workbench', rest: { at: 4 },
  },
  {
    id: 'js-pause',
    scene: 'engine',
    line: { en: 'Oh, a script! The Parser freezes right here. JavaScript can rewrite the page itself, so it has to run now, before anything else moves.', vi: 'Ố, có script! Parser khựng lại ngay đó. JavaScript có thể tự viết lại trang, nên nó phải chạy trước, mọi thứ khác đứng im đợi.' },
    duration: 2800, active: 'js', travel: { from: 4, to: 5 },
  },
  {
    id: 'js-run',
    scene: 'engine',
    line: { en: 'The JavaScript Engine runs it\u2026 and look, it just edited one line of the page. Only now may the Parser finish up.', vi: 'JavaScript Engine chạy luôn... nhìn kìa, nó vừa sửa một dòng của trang. Giờ Parser mới được làm nốt.' },
    duration: 3400, active: 'js', rest: { at: 5 },
  },
  {
    id: 'render-tree',
    scene: 'engine',
    line: { en: 'Now the Engine marries structure and style: every visible node learns how it should look. This styled tree is the Render Tree. Notice the rule: only things you can actually see are allowed in.', vi: 'Giờ Engine ghép cấu trúc với phong cách trang trí: node nào hiện được cũng biết mình phải trông ra sao. Cây đã được tô style này là Render Tree. Luật nhé: chỉ những gì bạn thật sự thấy mới được vào.' },
    duration: 3200, active: 'style', travel: { from: 5, to: 9 },
  },
  {
    id: 'layout',
    scene: 'engine',
    line: { en: 'Layout time: the Engine measures every box. Exactly where, exactly how big. Skip this step and everything would pile up in one sad corner.', vi: 'Đến lượt Layout: Engine đo mọi chiếc hộp. Chính xác ở đâu, lớn cỡ nào. Bỏ qua bước này thì mọi thứ dồn đống vào một góc tội nghiệp.' },
    duration: 3200, active: 'layout', travel: { from: 9, to: 10 },
  },
  {
    id: 'paint',
    scene: 'engine',
    line: { en: 'Paint decides the order of drawing: background first, then the header, then the words. No pixels exist yet. This is just the to-do list.', vi: 'Paint quyết định thứ tự vẽ: nền trước, rồi header, rồi chữ. Vẫn chưa có pixel nào đâu. Đây mới chỉ là danh sách việc cần làm.' },
    duration: 3000, active: 'paint', travel: { from: 10, to: 11 },
  },
  {
    id: 'raster',
    scene: 'engine',
    line: { en: 'Finally, Rasterization follows that list and colors real dots. The page now exists as pixels in memory.', vi: 'Cuối cùng, Rasterization làm theo danh sách ấy và tô màu từng chấm pixel thật. Trang web giờ đã thành pixels nằm trong bộ nhớ.' },
    duration: 3200, active: 'raster', travel: { from: 11, to: 12 },
  },
  {
    id: 'composite',
    scene: 'engine',
    line: { en: 'Almost there. The drawing is done, so the painted layers go to the GPU. Its compositor stacks them into one final frame. Same GPU you met in Chapter 1, by the way.', vi: 'Gần xong rồi. Vẽ xong rồi nên các lớp đã tô được chuyển cho GPU. Compositor của GPU xếp các lớp lại thành một khung hình cuối cùng. À mà, đúng con GPU bạn gặp ở Chapter 1 đấy.' },
    duration: 3200, active: 'gpuEngine', travel: { from: 12, to: 14 },
  },
  // ---- finale ------------------------------------------------------------------
  {
    id: 'screen',
    scene: 'web',
    line: { en: '\u2026and the image travels to the screen. The page is here. From one click, to living pixels.', vi: '...và bức ảnh chạy tới màn hình. Trang web đây rồi. Từ một cú click đến những con pixel sống động.' },
    duration: 3000, active: 'gpu', travel: { from: 25, to: 26 }, // v1.3.13 (F60): renumbered after the engine-door anchor removal
  },
  {
    id: 'recap',
    line: { en: 'So the whole trip: the Browser took your wish, found the address, fetched the files, built the DOM, dressed it in CSS, ran the JavaScript, measured the Layout, wrote the Paint orders, colored the pixels, and the GPU put the page on screen. Next stop, Chapter 03: how data really crosses the Internet.', vi: 'Tóm lại cả hành trình: Browser nhận điều bạn muốn, tìm địa chỉ, tải các tệp, dựng DOM, mặc CSS, chạy JavaScript, đo Layout, viết lệnh Paint, tô các pixels, và GPU đưa trang lên màn hình. Trạm kế tiếp, Chapter 03: dữ liệu thật sự đi qua Internet ra sao.' },
    // v1.3.13 (F60): renumbered to the window center after the door-anchor
    // removal (shadowed by effect:'loop' anyway — hygiene only).
    duration: 7200, active: 'browser', rest: { at: 26 }, effect: 'loop',
  },
]
