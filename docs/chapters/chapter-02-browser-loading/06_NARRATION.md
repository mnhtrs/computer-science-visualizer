# Chapter 02 — Phase 6: Narration Script (FROZEN)

- **Chapter ID:** `chapter-02-browser-loading`
- **Parent artifacts:** `05_SCENE_DESIGN.md` (FROZEN) and all earlier frozen artifacts
- **Produced artifact:** full bilingual narration script (beat lines + entity glosses)
- **Review status:** Passed — reviewed against `03_NARRATIVE_FRAMING`
- **Frozen status:** FROZEN — this exact text ships in `narration/beats.ts`, `narration/labels.ts` and entity glosses

Laws enforced: observation before explanation (`§3`) · question before answer (`§4`) · terminology only after the phenomenon (`§13`) · no checklist/documentation tone (`§14`) · neutral, plain, dual-audience language (`§15`) · core terms locked to English, VI glosses bilingual (`§16`).

---

## 1. Beat lines (EN / VI) — the exact strings

| Beat | EN | VI |
|---|---|---|
| b0 click | You searched, and now you click the link. The Browser's job begins. | Bạn đã tìm kiếm, và giờ bạn bấm vào đường link. Công việc của Browser bắt đầu. |
| b1 knows | From the click, the Browser learns the address you want — the URL. But a name is not a place yet. | Từ cú click, Browser biết được địa chỉ bạn muốn tới — URL. Nhưng một cái tên thì chưa phải là một nơi. |
| b2 dns-q | So, first question: where is it? The Browser asks the DNS — the address book of the web — "who is best-cats.example?" | Vậy, câu hỏi đầu tiên: nó ở đâu? Browser hỏi DNS — cuốn sổ địa chỉ của web — "best-cats.example là ai?" |
| b3 dns-a | DNS answers with the real address: a number. And notice — the Browser only asked once. DNS is not a stop on the road. | DNS trả lời bằng địa chỉ thật: một con số. Và để ý — Browser chỉ hỏi đúng một lần. DNS không phải một trạm trên đường đi. |
| b4 https | Before any page data, the Browser knocks politely: it and the server agree on secret keys. From now on, they talk privately — that is HTTPS. | Trước khi có dữ liệu trang, Browser gõ cửa lễ phép: nó và server thống nhất những chiếc chìa khóa bí mật. Từ giờ, hai bên nói chuyện riêng tư — đó là HTTPS. |
| b5 request | Now the real ask — an HTTP request: "please, send me the page". | Giờ là yêu cầu thật — một HTTP request: "làm ơn, gửi cho tôi trang web". |
| b6 server | The server hears it, finds the page's file, and wraps it into a response. | Server nhận được, tìm tệp của trang, và gói nó vào một response. |
| b7 response | Back comes the answer: a stream of bytes — the HTML file. The NIC catches them with the net card, and RAM holds them tight. | Câu trả lời quay về: một dòng bytes — tệp HTML. NIC hứng chúng bằng card mạng, và RAM giữ chúng thật chặt. |
| b8 to-engine | But bytes in RAM mean nothing yet. The Browser hands them to its inner workshop — the Browser Engine. | Nhưng bytes trong RAM chưa có nghĩa gì. Browser trao chúng cho xưởng bên trong nó — Browser Engine. |
| b9 decode | First, the Engine decodes the bytes into characters it can read: `<`, `h`, `t`, `m`, `l`… the file was saved with the UTF-8 rulebook. | Trước tiên, Engine giải mã các bytes thành ký tự nó đọc được: `<`, `h`, `t`, `m`, `l`… tệp được lưu theo bộ quy tắc UTF-8. |
| b10 tokenize | Then it chops the stream into tokens — pieces with meaning: an opening tag, a word, a closing tag. Without tokens, all this is just alphabet soup. | Rồi nó cắt dòng chữ thành các tokens — những mảnh có nghĩa: thẻ mở, một từ, thẻ đóng. Không có tokens, tất cả chỉ là cháo chữ cải. |
| b11 dom | Watch the Parser: each token becomes a node on a growing family tree — parents and children. This is the DOM Tree: the page as one living structure. | Nhìn Parser này: mỗi token trở thành một node trên cây gia đình đang lớn dần — có cha mẹ, có con cái. Đây là DOM Tree: trang web dưới dạng một cấu trúc sống. |
| b12 css-fetch | Half-way, the Parser met a link: this page's outfit lives in another file. The Browser fetches it — and the Parser doesn't wait; it keeps reading. | Giữa chừng, Parser gặp một link: bộ cánh của trang nằm ở tệp khác. Browser đi lấy nó — và Parser không chờ; nó vẫn đọc tiếp. |
| b13 cssom | The CSS arrives, and grows its own little tree — the CSSOM: a map of every styling rule. | CSS về tới, và mọc thành một cây nhỏ của riêng nó — CSSOM: bản đồ của mọi quy tắc trang trí. |
| b14 js-pause | Then — a script! The Parser must freeze right here: JavaScript can rewrite the page itself, so it has to run now, before anything moves on. | Rồi — một script! Parser phải đông cứng ngay tại đây: JavaScript có thể tự viết lại trang, nên nó phải chạy ngay, trước khi thứ gì đi tiếp. |
| b15 js-run | The JavaScript Engine runs it… and look — the script edits a line of the page. Only now may the Parser finish its work. | JavaScript Engine chạy nó… và nhìn kìa — script sửa một dòng của trang. Chỉ đến lúc này Parser mới được hoàn tất công việc. |
| b16 render-tree | Now the Engine marries structure and style: every visible node learns how it should look. This styled tree is the Render Tree — and notice: only things you can see are allowed in. | Giờ Engine kết hợp cấu trúc và trang trí: mỗi node hiển thị học xem mình phải trông thế nào. Cây đã tô màu này là Render Tree — và để ý: chỉ những gì nhìn thấy được mới được vào. |
| b17 layout | Layout: the Engine measures every box — exactly where, exactly how big. Without this step, everything would pile up in one single corner. | Layout: Engine đo mọi chiếc hộp — chính xác ở đâu, lớn cỡ nào. Thiếu bước này, mọi thứ sẽ dồn đống vào một góc duy nhất. |
| b18 paint | Paint decides the ORDER of drawing: background first, then the header, then the words. But no pixels exist yet — this is a list of instructions. | Paint quyết định THỨ TỰ vẽ: nền trước, rồi header, rồi chữ. Nhưng chưa có pixel nào tồn tại — đây chỉ là một danh sách chỉ dẫn. |
| b19 raster | Rasterization finally follows the list, and colors real dots — the page now exists as pixels in memory. | Rasterization cuối cùng làm theo danh sách, và tô những chấm thật — trang giờ đã tồn tại dưới dạng các pixels trong bộ nhớ. |
| b20 composite | Almost home. The layers go to the GPU, which stacks them into one final image — the same GPU you met in Chapter 1. | Gần xong rồi. Các lớp được đưa tới GPU — nơi xếp chúng thành một bức ảnh cuối cùng — chính chiếc GPU bạn đã gặp ở Chapter 1. |
| b21 screen | …and the image travels to the screen. The page is here. From one click, to living pixels. | …và bức ảnh đi tới màn hình. Trang web đã ở đây. Từ một cú click, tới những pixel biết sống. |
| b22 recap | The whole journey: the Browser received your wish, found the address, fetched the files, built the DOM, dressed it in CSS, ran the JavaScript, measured the Layout, wrote the Paint orders, colored the pixels, and the GPU showed the page. Next — Chapter 03: how the data really crosses the Internet. | Cả hành trình: Browser nhận điều bạn muốn, tìm ra địa chỉ, tải các tệp, dựng DOM, mặc CSS, chạy JavaScript, đo Layout, viết lệnh Paint, tô các pixels, và GPU trình chiếu trang. Kế tiếp — Chapter 03: dữ liệu thực sự vượt qua Internet thế nào. |

## 2. UI labels (labels.ts)
- chapterTitle: "How does a website reach my screen?" / "Một trang web đến màn hình của mình như thế nào?"
- waitingLine: "Click the first search result to begin." / "Hãy bấm vào kết quả tìm kiếm đầu tiên để bắt đầu."
- startButton: "Open the page" / "Mở trang web"
- sceneTag (engine): "Inside the Browser Engine" / "Bên trong Browser Engine"
- tip: "Click the first result to begin. Use ◀ ▶ or the dots to step." / "Bấm vào kết quả đầu tiên để bắt đầu. Dùng ◀ ▶ hoặc các chấm để lùi/tới."
- doneLabel: "Done" / "Xong"

## 3. Glosses (side panel; EN / VI) — one per entity

- **Browser**: The main character of this story. It asks, it downloads, it builds, it paints. It never leaves your computer — everything comes to it. / Nhân vật chính của câu chuyện. Nó hỏi, nó tải, nó dựng, nó vẽ. Nó không bao giờ rời máy tính — mọi thứ tự đến với nó.
- **DNS**: The address book of the web. Give it a name, it gives back a number. It sits off to the side — never on the road between Browser and server. / Cuốn sổ địa chỉ của web. Đưa nó một cái tên, nó trả lại một con số. Nó ngồi lệch sang bên — không bao giờ nằm giữa đường Browser – server.
- **Server**: A far-away computer whose whole job is answering. This one stores the page's files. / Một máy tính ở xa mà toàn bộ công việc là trả lời. Máy này lưu các tệp của trang.
- **HTTPS**: The private agreement between Browser and server — they set the rules of the conversation, then scramble every word for outsiders. / Thỏa thuận riêng tư giữa Browser và server — hai bên đặt ra quy tắc cuộc trò chuyện, rồi xáo trộn mọi từ với người ngoài.
- **NIC**: The Network Interface Card — the computer's door to the network. Every byte in or out passes through it. You met it in Chapter 1. / Network Interface Card — cánh cửa của máy tính ra mạng. Mọi byte ra vào đều qua nó. Bạn đã gặp nó ở Chapter 1.
- **RAM**: Fast working memory, exactly like in Chapter 1. The freshly downloaded HTML waits here. / Bộ nhớ làm việc nhanh, y như Chapter 1. Tệp HTML vừa tải xuống chờ ở đây.
- **CPU**: The CPU runs the Browser like any other program — one instruction at a time, just as you saw in Chapter 1. / CPU chạy Browser như mọi chương trình khác — từng lệnh một, đúng như bạn đã thấy ở Chapter 1.
- **GPU**: The GPU assembles the final image and sends it to the monitor — same job as in Chapter 1. / GPU lắp ráp bức ảnh cuối cùng và gửi ra màn hình — đúng vai trò ở Chapter 1.
- **Decoder**: Turns raw bytes into readable characters, using the file's encoding rulebook. / Biến các bytes thô thành ký tự đọc được, theo bộ quy tắc mã hóa của tệp.
- **Tokenizer**: Cuts the character stream into meaningful pieces — tokens. / Cắt dòng ký tự thành những mảnh có nghĩa — tokens.
- **HTML Parser**: Reads tokens one by one and grows the DOM Tree. It can be paused by scripts — never by CSS. / Đọc từng token một và làm DOM Tree lớn dần. Nó chỉ bị script tạm dừng — không bao giờ bị CSS.
- **Network Port**: The Engine's little door back onto the network — the same road the HTML arrived on. / Cánh cửa nhỏ của Engine quay lại mạng — đúng con đường HTML đã tới.
- **JavaScript Engine**: Runs scripts immediately. A script can read and rewrite the page — that is why the Parser waits. / Chạy script ngay lập tức. Script có thể đọc và viết lại trang — đó là lý do Parser phải chờ.
- **Style**: Matches every CSS rule to its nodes. Structure from the DOM, outfits from the CSSOM. / Ghép mỗi quy tắc CSS với đúng node. Cấu trúc từ DOM, quần áo từ CSSOM.
- **Layout**: Computes exact geometry — the position and size of every box. / Tính hình học chính xác — vị trí và kích thước của mọi chiếc hộp.
- **Paint**: Decides the order of the drawing commands. Still zero pixels. / Quyết định thứ tự của các lệnh vẽ. Vẫn chưa có pixel nào.
- **Rasterizer**: Executes the commands, coloring a real grid of pixels. / Thực thi các lệnh, tô màu một lưới pixel thật.
- **GPU (compositor)**: Stacks the finished layers into the single image headed for your monitor. / Xếp các lớp hoàn chỉnh thành một bức ảnh duy nhất đi ra màn hình.
- **Workbench**: Watch the page transform here — from bytes to pixels. / Hãy nhìn trang web biến hình ở đây — từ bytes thành pixels.

## 4. Self-check against `03` (quick record)
- No term before its observation → see Phase 5 §4 matrix. ✓
- No standalone component description: glosses appear only when the entity is *active in the current beat*. ✓
- Misconceptions actively named (M2 "asked once", M6 "must freeze", M7 "no pixels", M8 door metaphor). ✓
- Central question kept open until b21 (b1 "not a place yet" → serial partial answers). ✓
