# Prompt Log — Trần Thanh An (23120017) — HW02

Nguyên văn phiên làm việc với Claude Code (giờ VN). Chỉ gồm prompt do sinh viên gõ và phần trả lời dạng chữ của Claude; đã bỏ message hệ thống, ngữ cảnh IDE và nội dung tool.

## Prompt 1 — 12:04 19/10/2026

```text
đọc tài liệu và repo, sau đó giải thích lại chi tiết tất cả những gì cần làm cho tôi. Chưa code:
- file yêu cầu của thầy là: D:\codeStudy\test\Homeworks\HW02\docs\2026.HW02.Domain Testing_En.md
- còn lại là các file giải thích, gọi ý, phân công của nhóm trưởng
- Bài tập cá nhân tuần 2 là làm theo cá nhân, nhưng các thành viên trong nhóm không được chọn feature chung với nhau. Nên là mọi người chọn feature trong sheet
```

**Claude:**

Mình đã đọc đề của thầy, 3 file của nhóm trưởng (sheet chọn feature, gói gợi ý, hướng dẫn PDF) và repo chung `software-testing-2026-HW02-group` (README và issue template). Dưới đây là toàn bộ những gì bạn cần làm.

---

## 1. Tóm tắt bài

- **Bài:** HW02, Domain Testing (phân lớp tương đương) và Boundary Value Analysis (BVA, phân tích giá trị biên) trên **EShop** (https://github.com/ttbhanh/eshop-sut).
- **Hình thức:** làm **cá nhân**, khoảng 10 giờ, nộp lên Moodle (deadline xem trên link nộp, **không nhận nộp trễ**).
- **AI:** được dùng thoải mái, nhưng **bắt buộc** có AI Audit Report và AI Critique.
- **Luật nặng nhất:** chép bài, **kể cả chép prompt**, thì cả hai người đều 0 điểm. Thiếu bất kỳ tài liệu bắt buộc nào cũng 0 điểm.
- **Vấn đáp:** 30% sinh viên được chọn ngẫu nhiên để vấn đáp 5–7 phút. Vì vậy bạn phải hiểu bài của chính mình.

---

## 2. Chọn feature: phần còn lại cho bạn

Quy tắc của nhóm (chặt hơn đề):
- Mỗi người làm 4 feature: **1 ở Pool A, 1 ở Pool B, 1 ở Pool C (Web/Admin) và 1 ở Pool D (Mobile)**.
- **Mỗi mã FR chỉ có một người làm trong cả nhóm, tính chung Web và Mobile.** Ví dụ Ngọc đã làm FR-04 trên Mobile thì không ai được làm FR-04 trên Web nữa.
- Pool D là các FR của Pool A/B nhưng chạy trên app mobile. Pool C không có bản mobile.

Hiện tại trong sheet:

| Người | A | B | C | D (Mobile) |
|---|---|---|---|---|
| Ngọc (Gói 1) | FR-01 | FR-07 | FR-17 | FR-04 |
| Hương (Gói 2) | FR-03 | FR-08 | FR-15 | FR-10 |
| **Còn trống (Gói 3)** | **FR-02** Đăng nhập & khóa TK | **FR-09** Coupon | **FR-16** Import CSV | **FR-06** Chi tiết SP |

Nếu bạn là **Trần Thanh An (23120017)** thì Gói 3 gần như là phần dành cho bạn. Gói này không trùng FR với ai, tổng độ nặng là 9. Bạn cần:
1. Điền tên mình vào cột "Người chọn" ở sheet.
2. Báo nhóm, rồi điền dòng của mình vào bảng phân công trong `README.md` của repo chung. Lưu ý dòng của Hương trong README cũng chưa được điền.
3. **Riêng FR-06 trên Mobile:** phải mở app kiểm tra màn chi tiết sản phẩm **có ô nhập số lượng** hay không. Nếu không có thì đổi sang FR-05 (tìm kiếm). FR-05 vẫn trống vì chưa ai làm.

Nếu muốn đổi feature thì chỉ được lấy các FR chưa ai làm: FR-05, FR-06, FR-11 (A/B/D), hoặc FR-12, 13, 14, 18, 19 (C). Nhóm trưởng khuyên tránh các FR này vì quá nhẹ, mà policy môn học thì **task quá đơn giản sẽ bị giới hạn điểm tối đa**.

### Điểm biên đáng chú ý của Gói 3

- **FR-02 Đăng nhập & khóa TK:** khóa khi sai ≥ 3 lần (test 2/3/4 lần), khóa 30 giây (test 29/30/31 giây), bộ đếm phải tăng đúng 1 mỗi lần sai. Khó nhất là canh thời gian khi test.
- **FR-09 Coupon:** tổng đơn ≥ min_order (299.999 / 300.000 / 300.001), ngày hiện tại so với `expired_at`, số lần đã dùng < `max_uses`, loại percent hoặc fixed, trạng thái đăng nhập. Có **5 điều kiện C1–C5 xét cùng lúc**, phải kiểm cả công thức tính tiền giảm.
- **FR-16 Import CSV:** đuôi file phải là `.csv`, header đúng, trường có dấu phẩy phải bọc nháy kép (RFC 4180), name không rỗng, price > 0, **một dòng lỗi thì rollback toàn bộ**. Bạn phải tự tạo nhiều file CSV để test.
- **FR-06 Mobile:** số lượng là số nguyên ≥ 1 (test 0/1/2), cộng thêm số âm, số thập phân, chữ. Đặc tả không nêu giá trị tối đa.

---

## 3. Chuẩn bị môi trường

1. Clone và chạy EShop. Đặc tả dùng làm oracle (căn cứ đúng/sai) là **`README.md` của repo eshop-sut**. Mình chưa đọc file này vì nó không có trong máy. Đây là tài liệu quan trọng nhất cần đọc kỹ.
2. Tài khoản test: Admin `admin@eshop.com` / `Admin123!`, User `test@eshop.com` / `Test1234!`. `setup_guide.md` ghi mật khẩu admin là `admin123`, nhưng như vậy là **sai**.
3. Reset dữ liệu trước mỗi đợt test: `cd backend && node database.js`.
4. Mobile: sửa `API_URL` trong `frontend-mobile/App.js` thành IP LAN của máy bạn. Điện thoại và máy tính phải dùng chung Wi-Fi (chạy qua Expo Go).
5. Tạo **repo GitHub Private cá nhân**, ví dụ `software-testing-2026-HW02`. **Không** add thành viên khác vào, **không** gửi prompt hay skill cho nhau. Khi review chéo thì chỉ gửi báo cáo.

---

## 4. Quy trình cho MỖI feature (S0 → S8), mỗi bước một commit

Commit theo định dạng `[<Pool>-<FR>][<Sx>] <Verb tiếng Anh> ...`, ví dụ `[B-FR09][S2] Identify equivalence classes`.

| Bước | Việc cần làm | Ví dụ commit |
|---|---|---|
| **S0** | Trích phần đặc tả của FR từ README EShop, mở app khám phá giao diện | `[A-FR02][S0] Extract spec and explore UI` |
| **S1** | Xác định các biến input/output (kể cả biến ẩn như thời gian, số lần, trạng thái) | `... [S1] Identify input/output variables` |
| **S2** | Chia lớp tương đương hợp lệ và không hợp lệ cho từng biến | `... [S2] Identify equivalence classes` |
| **S3** | Thiết kế test case Domain Testing | `... [S3] Design domain test cases` |
| **S4** | Thiết kế test case BVA (giá trị dưới biên, đúng biên, trên biên) | `... [S4] Design boundary value test cases` |
| **S5** | **Tự review** kết quả AI, sửa sai và bổ sung test case | `... [S5] Review and add missing test cases` |
| **S6** | Chạy test thật trên app, ghi Pass/Fail, chụp màn hình | `... [S6] Execute tests and record results` |
| **S7** | Báo bug vào report Markdown và GitHub Issues | `... [S7] Report bugs` |
| **S8** | Phân tích những gì AI bỏ sót và giải thích vì sao | `... [S8] Analyse AI gaps` |

Nếu sửa lại một bước đã commit thì giữ nguyên tag của bước đó. Các commit không thuộc feature nào dùng `[setup]`, `[skill]`, `[report]`, `[forms]`.

**Yêu cầu của thầy về cách dùng AI ("AI-First"):** không được chỉ gõ một câu kiểu "sinh test case và tìm bug cho feature này". Bạn phải **dẫn AI đi qua từng bước kỹ thuật** như trên lớp: xác định biến, rồi chia lớp, rồi tìm biên, rồi sinh test case. Sau đó tự review và chỉnh sửa. Trong report, mỗi feature phải **giải thích chi tiết từng bước** bạn đã áp dụng kỹ thuật như thế nào.

---

## 5. Báo bug lên GitHub Issues (repo chung của nhóm)

- Chỉ báo bug **trong feature của mình**, mỗi bug một issue. Trước khi tạo, tìm xem đã có issue tương tự chưa. Nếu cùng một lỗi thì ghi `Related #số` thay vì tạo issue trùng.
- Dùng template **Bug report**. Phải điền MSSV, FR, nền tảng, mã test case (ví dụ `FR09-BVA-03`), severity, các bước tái hiện, kết quả mong đợi (trích từ README EShop), kết quả thực tế, **ảnh chụp (bắt buộc)** và môi trường.
- **Tiêu đề:** `[23120017][FR-09][Web] Mô tả ngắn hành vi sai so với đặc tả`.
- **Label:** gắn đủ 4 nhóm:
  - 1 `severity`
  - 1 `platform` (web / admin / mobile)
  - ít nhất 1 `technique` (EP hoặc BVA)
  - 1 `pool`

  Ví dụ: FR-16 thì gắn `platform: admin` + `pool: C`. FR-06 Mobile thì gắn `platform: mobile` + `pool: D`.
- **Chọn severity:** đi lần lượt từng câu, gặp câu "Có" đầu tiên thì dừng:
  1. Lộ hoặc mất dữ liệu, vượt quyền, hay chặn luồng chính? → critical
  2. Chấp nhận dữ liệu sai hoặc tính sai mà không có cách tránh? → high
  3. Sai nghiệp vụ hoặc validation nhưng có cách đi vòng? → medium
  4. Chỉ sai giao diện, câu chữ? → low
- Tự assign issue cho mình. Nếu báo nhầm thì "Close as not planned" và ghi lý do, **không xoá issue**.

---

## 6. Agent Skill (10 điểm)

- Viết Agent Skill (ví dụ một skill của Claude Code) để tự động áp dụng Domain Testing và BVA, dùng lại được cho feature khác.
- Nộp skill kèm **video demo trên YouTube** quay từ đầu đến cuối quá trình dùng skill trên một feature hoàn chỉnh.
- Nên làm thêm một skill hoặc rule tự trích log AI (tool, thời gian, prompt, output) để làm Audit Report nhanh hơn.

---

## 7. Phần AI bắt buộc

- **AI Audit Report** (phụ lục): ghi "I use AI tools for the following tasks," rồi liệt kê **từng lần tương tác**: tên tool, ngày giờ, prompt, output. Vì vậy cần lưu log ngay từ đầu.
- **AI Critique** (200–300 từ): AI sai, thiên lệch hoặc thiếu ở đâu? Vì sao nó không bắt được lỗi? Bạn rút ra nguyên tắc gì khi làm việc với AI?
- Đề có nhắc "AI Templates" và README nhóm có nhắc các form "AI-0x". Hai thứ này **không có trong repo**, nên bạn cần lấy trên Moodle.

---

## 8. Nộp bài

**Tên file:** `23120017_HW02_AI_DomainTesting_<điểm tự chấm 3 chữ số>.zip`, ví dụ `..._090.zip`.

**Trong file zip gồm:**
1. Report chính (**Markdown + PDF**): Domain Testing và BVA cho cả 4 feature.
2. Bug report, kèm ảnh chụp các issue trên trang GitHub Issues.
3. AI Critique và AI Audit Report (**Markdown + PDF**).
4. Git commit log dạng text (`git log > commit_log.txt`).
5. `README.md` gồm:
   - Bảng tự chấm điểm.
   - Test summary: số feature; số test case đã thiết kế, đã chạy, Pass, Fail, chưa chạy; số bug; link video demo.
6. Tài liệu phụ khác: file CSV test, ảnh chụp, script…

**Thang điểm:**

| Phần | Điểm |
|---|---|
| Feature A, FR-02 (Domain + BVA) | 25 |
| Feature B, FR-09 | 25 |
| Feature C, FR-16 | 25 |
| Feature D, FR-06 Mobile | 15 |
| Agent Skills | 10 |
| **Tổng** | **100** |

Điểm chấm dựa trên **chất lượng và số lượng**: số test case, bug, ảnh chụp, video, link tham khảo. Làm đủ mục thôi thì chưa đủ để được điểm cao.

---

## 9. Thứ tự nên làm

1. Xác nhận Gói 3 với nhóm, điền vào sheet và README.
2. Chạy EShop (Web + Admin + Mobile), mở app kiểm tra FR-06 trên Mobile.
3. Tạo repo cá nhân, commit `[setup]`, bắt đầu lưu log AI ngay.
4. Đọc README EShop, trích đặc tả cho FR-02, FR-09, FR-16, FR-06.
5. Làm từng feature theo S0 → S8. Nên làm FR-09 và FR-16 trước vì nặng nhất và nhiều điểm nhất.
6. Viết Agent Skill, quay video demo.
7. Viết AI Critique, Audit Report, README tự chấm, xuất PDF và git log, rồi đóng zip và nộp.

Nếu muốn, bước tiếp theo mình có thể đọc README của eshop-sut và trích đặc tả chi tiết cho 4 feature của Gói 3.

## Prompt 2 — 12:18 19/10/2026

```text
xuất giải thích này vào docs/AIgui, tạo các file hưỡng dẫn chi tiết cho mỗi bước để hoàn thành đủ yêu cầu bài tập, mỗi file là 1 bước. Xuất nội dung cuộc trò chuyện này vào một file theo định dạng sau, mỗi lầm thêm tin nhắn mới thì cập nhật vào
```

**Claude:**

Có sẵn bản clone EShop, thư mục AI Templates và Homework Policies trên máy. Mình đọc chúng để viết hướng dẫn cho chính xác.

**Claude:**

Đặc tả FR-20 chỉ ghi "Xem sản phẩm", không nói rõ có màn chi tiết với ô số lượng. Mình kiểm tra nhanh code mobile để ghi vào hướng dẫn cho đúng.

**Claude:**

Còn thiếu mẫu AI Templates cho bước viết Audit/Critique. Mình đọc nhanh nội dung các form AI-02, AI-03, AI-04.

**Claude:**

Đã đủ thông tin. Giờ mình viết các file hướng dẫn vào `docs/AIgui/`.

**Claude:**

Giờ mình ghi log trò chuyện theo đúng định dạng file mẫu.

**Claude:**

Mình đã tạo thư mục [docs/AIgui/](docs/AIgui/) với 15 file. Mình chưa viết code và chưa commit gì.

**Các file hướng dẫn**
- [00_Tong_quan_HW02.md](docs/AIgui/00_Tong_quan_HW02.md): bản xuất phần giải thích lần trước, có thêm mục "Cập nhật" ở cuối và mục lục trỏ tới các file bước.
- 01: chốt feature, dựng EShop, tạo repo cá nhân, lưu log AI.
- 02 → 10: mỗi file là một bước S0 → S8.
- 11: Agent Skill và video demo.
- 12: AI Audit, AI Critique, các form AI-0x.
- 13: README tự chấm, xuất PDF, git log, đóng zip và nộp.

Mỗi file bước gồm:
- Commit cần tạo.
- Việc cần làm.
- Cách dẫn AI ở riêng bước đó.
- Danh sách đối chiếu riêng cho FR-02, FR-09, FR-16, FR-06. Danh sách này để bạn tự kiểm tra xem AI có bỏ sót gì, không phải để dán cho AI.
- Checklist cuối bước.

**Điểm mới so với lần giải thích trước**
- **FR-06 Mobile làm được.** App có ô "Số lượng" ở màn chi tiết sản phẩm ([App.js:564-569](../eshop-security-t09-group05/eshop-sut/frontend-mobile/App.js#L564-L569)), nên không cần đổi sang FR-05.
- **AI Templates có sẵn trên máy** tại `D:\codeStudy\test\Homeworks\AI Templates\`, không cần lên Moodle lấy. Policy yêu cầu nộp dạng text, nên phải chuyển các form .docx sang Markdown.
- **Đặc tả EShop có sẵn trên máy.** Bản clone EShop thuộc nhóm Security và có thể đã bị sửa, nên file 01 khuyên clone lại bản sạch từ GitHub.
- **Một số chỗ đặc tả mơ hồ cần chốt giả định ở S0**, ví dụ:
  - `expired_at` đúng bằng hôm nay thì mã còn hạn không?
  - Lần đăng nhập sai thứ 3 đã bị khóa ngay, hay lần thứ 4 mới bị chặn?
  - Không tắt được coupon (`is_active = 0`) qua giao diện Admin, nên phải tìm cách khác để tạo dữ liệu test cho C1.

**Prompt log:** [23120017_HW02_prompt_log.md](docs/AIgui/23120017_HW02_prompt_log.md) đã có đủ 2 prompt, giờ đổi sang giờ Việt Nam. Từ giờ, mỗi lần bạn nhắn tin mới trong cuộc trò chuyện này, mình sẽ cập nhật thêm vào file.

**Lưu ý:** `docs/AIgui/` chứa prompt của bạn, nên đừng gửi cho thành viên nhóm và đừng đẩy lên repo chung.

## Prompt 3 — 12:30 19/10/2026

```text
không đọc thư mục ngoài, repo eshop đó tôi đã làm bài tập khác, Tôi đã clone lại repo trong thư mục này. Đọc và kiểm tra lại tài liệu trước khi bắt đầu
```

**Claude:**

Bản clone mới nằm ở `eshop-sut/`. Mình đọc lại đặc tả, hướng dẫn cài đặt và API spec trong thư mục này.

**Claude:**

Có 3 chỗ trong hướng dẫn đang trỏ ra thư mục ngoài. `api_specification.md` cũng có thông tin làm thay đổi cách test FR-09 và FR-16. Mình sửa các file hướng dẫn.

**Claude:**

Mình đã kiểm tra lại toàn bộ hướng dẫn với bản clone `HW02/eshop-sut/`, và từ giờ chỉ đọc file trong thư mục HW02. Các file trong `docs/AIgui/` không còn tham chiếu nào ra thư mục ngoài. Mình chưa viết code và chưa commit gì.

**Kết quả kiểm tra**
- **Bản clone:** commit `85af3ba` ("first upload", 15/05/2026), lấy từ `ttbhanh/eshop-sut`, chưa có thay đổi nào.
- **Đặc tả `README.md`** (phiên bản 2.0) giống hệt bản mình đã dùng, nên các quy tắc và biên của FR-02, FR-09, FR-16, FR-06 trong hướng dẫn vẫn đúng.
- **FR-06 Mobile:** đã xác nhận lại trên bản clone này. Có màn chi tiết với ô "Số lượng" ([App.js:564-567](eshop-sut/frontend-mobile/App.js#L564-L567)).

**Thông tin mới từ [api_specification.md](eshop-sut/api_specification.md), đã bổ sung vào file 00–05**
- **FR-09:** `POST /api/apply-coupon` nhận `total_amount` và `user_id` do client gửi lên.
  - Cần thêm lớp kiểm thử: gửi tổng tiền giả để vượt ngưỡng C3, gửi `user_id` của người khác để vượt C5.
  - C4 test bằng API không kèm token.
  - Có thể tạo coupon biên ngày qua `POST /api/admin/coupons`.
- **FR-16:** API import nhận **mảng JSON**, không nhận file.
  - Phần đọc CSV (đuôi file, header, nháy kép) nằm ở frontend-admin.
  - Validation và rollback thì phải xem backend có làm hay không.
  - Vì vậy nên test ở 2 tầng: qua giao diện với file CSV, và gọi thẳng API.
- **FR-02:** `POST /api/login` dùng được để đo thời gian khóa 30 giây chính xác hơn bấm tay.

**Sửa hướng dẫn cài đặt ([01_Chuan_bi_feature_moi_truong_repo.md](docs/AIgui/01_Chuan_bi_feature_moi_truong_repo.md))**
- `setup_guide.md` ghi đường dẫn `EShop/...`, thực tế là `eshop-sut/...`.
- `run_servers.sh` dùng đường dẫn macOS của tác giả, không chạy được trên Windows.
- `API_URL` của mobile hiện là `192.168.10.13` ([App.js:16](eshop-sut/frontend-mobile/App.js#L16)), cần đổi thành IP LAN máy bạn.

**Phần chưa kiểm chứng được trong thư mục này:** AI Templates (AI-0x) và Homework Policies không nằm trong HW02. File 12 và 13 hiện ghi "lấy bản thầy phát trên Moodle". Khi bạn mở các mẫu đó, nên đối chiếu lại cấu trúc. Nếu bạn chép chúng vào `HW02/docs/`, mình sẽ kiểm tra lại.

Prompt log đã cập nhật thêm Prompt 3: [23120017_HW02_prompt_log.md](docs/AIgui/23120017_HW02_prompt_log.md).

## Prompt 4 — 14:36 20/10/2026

```text
Bước 1:
- hướng dẫn chi tiết chạy eshop
- khởi tạo 1 thư mục repo cá nhân
```

**Claude:**

Máy có Node 22.23.2, npm 10.9.8 và git 2.49. Chưa cài `gh`, và chưa thư mục nào có `node_modules`. Mình xem `package.json` và cấu hình cổng của từng phần.

**Claude:**

Cả 4 phần cài xong (chỉ có cảnh báo `npm audit`, không có lỗi). Giờ mình khởi tạo DB, chạy backend và gọi thử API.

**Claude:**

Hai tiến trình Vite vẫn giữ cổng 5173/5174 sau khi tắt task. Mình kiểm tra xem đúng là tiến trình mình đã mở thì mới tắt.

**Claude:**

Đã tắt hết, các cổng 3000/5173/5174 đều trống. Giờ mình tạo thư mục repo cá nhân `HW02/software-testing-2026-HW02/`.

**Claude:**

Giờ mình viết lại phần chạy EShop và phần repo cá nhân trong file 01 cho chi tiết, theo đúng những gì vừa chạy thử.

**Claude:**

Hai file 00 và 08 vẫn hướng dẫn reset bằng `node database.js`, nên mình sửa lại cho khớp với cơ chế vừa phát hiện.

**Claude:**

Bước 1 xong. Mình đã chạy thử EShop trên máy bạn, viết hướng dẫn chi tiết theo đúng kết quả chạy thử, và tạo repo cá nhân (mới `git init`, chưa commit).

**1. Hướng dẫn chạy EShop:** [01_Chuan_bi_feature_moi_truong_repo.md](docs/AIgui/01_Chuan_bi_feature_moi_truong_repo.md), mục 2

- Đã `npm install` cho cả 4 thư mục.
- Đã chạy thử backend, Web, Admin:
  - Cả 3 đều lên đúng cổng (3000 / 5173 / 5174).
  - Đăng nhập API bằng `test@eshop.com` và `admin@eshop.com` / `Admin123!` đều thành công.
  - Chạy thử xong mình đã tắt hết, các cổng đang trống.
- Hướng dẫn có:
  - Lệnh cho từng terminal theo đúng thứ tự.
  - Các bước cho mobile (IP Wi-Fi của máy hiện là `192.168.3.138`).
  - Lệnh smoke test bằng `curl.exe`.
  - Cách tắt server và xử lý kẹt cổng.
  - Bảng lỗi thường gặp.

Có 3 điểm `setup_guide.md` không nói, bạn cần nhớ:
- **Backend tự xóa và seed lại DB mỗi lần khởi động.** Muốn reset thì tắt rồi chạy lại `node server.js`. Mặt trái là mọi dữ liệu tạo thêm (tài khoản, coupon, sản phẩm import, lượt dùng mã) sẽ mất khi khởi động lại. Mình đã sửa cách reset trong file 00 và 08 cho khớp.
- **Phải chạy Web trước Admin.** Web không cố định cổng, nên nếu 5173 bận nó sẽ chiếm 5174 và Admin không chạy được.
- **Mobile chưa chạy thử được** vì cần điện thoại. `API_URL` trong [App.js:16](eshop-sut/frontend-mobile/App.js#L16) vẫn là IP của tác giả, bạn cần tự sửa theo mục 2.4.

**2. Repo cá nhân:** [software-testing-2026-HW02/](software-testing-2026-HW02/)

- Đã `git init`, nhánh `main`. Git dùng tên và email có sẵn trên máy: `Tran Thanh An` / `antranthanh2005@gmail.com`.
- Đã có [README.md](software-testing-2026-HW02/README.md) (bảng tự chấm, test summary, bảng môi trường đã điền phần đo được), `.gitignore`, và các thư mục `reports/`, `bugs/`, `evidence/FR02|09|16|06/`, `test-data/FR16/api/`, `skills/`, `ai/`, `pdf/`.
- Repo nằm cạnh `eshop-sut/` và repo nhóm, không lồng vào nhau.

**Bạn cần làm tiếp** (chi tiết ở mục 3.2 của file 01):
1. `git add .` rồi `git commit -m "[setup] Init folder structure"`. Mình chưa commit để bạn tự kiểm tra trước.
2. Tạo repo **Private** trên GitHub (máy chưa có `gh`, nên làm trên web), không tick tạo README.
3. Chạy `git remote add origin ...` rồi `git push -u origin main`.
4. Tự chạy EShop theo mục 2.4, chụp ảnh smoke test, rồi điền trình duyệt và điện thoại vào bảng Môi trường.

Prompt log đã cập nhật thêm Prompt 4.

## Prompt 5 — 15:15 20/10/2026

```text
Bước 2 - S0:
- Trích đặc tả
- Giải thích chi tiết hơn việc cần làm ở bước này
```

**Claude:**

Mình trích nguyên văn bằng script, cắt theo tiêu đề mục, để đảm bảo không sửa chữ nào của đặc tả.

**Claude:**

Đã tạo đủ 4 file. Mình kiểm tra lại: mọi dòng trích dẫn phải khớp đúng từng ký tự với đặc tả gốc.

**Claude:**

Cả 4 file khớp 100% với đặc tả gốc (0 dòng lệch). Giờ mình viết lại file hướng dẫn S0 chi tiết hơn.

**Claude:**

Đã xong phần trích đặc tả cho 4 feature, và đã viết lại hướng dẫn S0 chi tiết hơn. Mình chưa commit gì.

**1. Trích đặc tả:** 4 file report trong [software-testing-2026-HW02/reports/](software-testing-2026-HW02/reports/)

| File | 1.1 Đặc tả chính | 1.2 Yêu cầu liên quan | 1.3 API |
|---|---|---|---|
| [A-FR02_Login_Lockout.md](software-testing-2026-HW02/reports/A-FR02_Login_Lockout.md) | FR-02 | FR-22, FR-21, SEC-01/02, tài khoản mặc định | 1.2 Đăng nhập |
| [B-FR09_Coupon.md](software-testing-2026-HW02/reports/B-FR09_Coupon.md) | FR-09 | FR-08, FR-17, FR-21, SEC-02/05 | 5.1 apply-coupon, 4.3 checkout, 6.4 tạo coupon |
| [C-FR16_CSV_Import.md](software-testing-2026-HW02/reports/C-FR16_CSV_Import.md) | FR-16 | FR-15, FR-12, SEC-03/04/05 | 6.3 import-products |
| [D-FR06_Mobile_Product_Detail.md](software-testing-2026-HW02/reports/D-FR06_Mobile_Product_Detail.md) | FR-06 | FR-20, FR-24, FR-21 | 3.2 chi tiết SP, 4.2 thêm vào giỏ |

- Các đoạn trích lấy bằng script, cắt theo tiêu đề mục, và có ghi số dòng nguồn. Mình đã so khớp tự động từng dòng với `README.md` và `api_specification.md`: **0 dòng lệch**.
- Mỗi yêu cầu liên quan có một câu giải thích vì sao liên quan. Câu này ghi rõ FR nào thuộc Hương hoặc Ngọc và chỉ dùng làm ngữ cảnh hay để chuẩn bị dữ liệu.
- Các mục 1.4 (khám phá UI), 1.5 (mơ hồ và giả định), 1.6 (phạm vi) để trống, có sẵn khung bảng để bạn điền.

**2. Hướng dẫn S0 chi tiết hơn:** [02_S0_Trich_dac_ta_kham_pha_UI.md](docs/AIgui/02_S0_Trich_dac_ta_kham_pha_UI.md)

- Mục 0: S0 dùng để làm gì, và mỗi phần của S0 được dùng lại ở bước nào.
- Mục 2.1: tách đặc tả thành **quy tắc nguyên tử** R1…Rn để truy vết. Có làm mẫu cho FR-02, ba feature còn lại bạn tự làm.
- Mục 2.2: kịch bản khám phá giao diện cho từng feature, gồm xem gì trong DevTools (Elements, Network, Local Storage), lệnh `curl` để lấy bảng giá và danh mục, và cách đặt tên ảnh.
- Mục 2.3: 6 câu hỏi để tìm điểm mơ hồ, quy tắc chọn giả định, và mẫu bảng có cột "Ảnh hưởng".
- Mục 2.4–2.6: xác định phạm vi, cách dẫn AI ở S0 và review kết quả, lệnh commit riêng cho từng feature.
- Mục 3–4: checklist hoàn thành và các câu hỏi vấn đáp có thể gặp.
- Danh sách gợi ý điểm mơ hồ được dời xuống cuối file, ghi rõ chỉ mở ra sau khi bạn đã tự làm.

**Lưu ý cho AI Audit:**
- Phần trích 1.1–1.3 do AI (Claude Code) tạo bằng script, nên cần khai báo trong Audit.
- Script đang nằm trong thư mục scratchpad tạm, có thể bị xóa sau phiên này. Nếu muốn giữ làm minh chứng hoặc dùng lại cho Agent Skill, mình có thể chép nó vào repo.

**Việc tiếp theo của bạn:** chạy EShop, khám phá giao diện theo mục 2.2, điền 1.4–1.6 và bảng quy tắc nguyên tử, rồi commit 4 lần `[..][S0]`.

Prompt log đã cập nhật thêm Prompt 5.

## Prompt 6 — 08:08 21/10/2026

```text
không còn thời gian để tôi tự làm từng bước. Giờ bạn hãy hoàn thành toàn bộ bài tập này cho tôi. sau đó giải thích ngắn gọn và nói những gì tôi cần làm để nộp bài
```

**Claude:**

Bạn đã cho phép, nên mình sẽ làm toàn bộ phần có thể làm trên máy này, đi đúng quy trình S0 → S8 và chạy test thật trên EShop. Có vài việc mình không làm thay được: test trên điện thoại, đăng issue bằng tài khoản GitHub của bạn, quay video, nộp Moodle. Mình sẽ chuẩn bị sẵn để bạn làm nhanh nhất. Bắt đầu bằng kiểm tra công cụ và khởi động EShop.

**Claude:**

Script FR-02 đang chạy nền (có các ca phải chờ đúng 29/30/31 giây). Trong lúc đó mình viết script FR-09.

**Claude:**

Script FR-02 vẫn đang chạy. Mình tạo các file CSV test cho FR-16. Dùng Python để kiểm soát chính xác từng byte (BOM, CRLF, file nhị phân giả Excel).

**Claude:**

Reset backend chạy ổn (khoảng 1,7 giây mỗi lần). Mình chạy FR-16 trước vì nhanh, để kiểm tra luồng UI của Admin.

**Claude:**

Lỗi `ECONNRESET`: sau khi reset backend, `fetch` vẫn dùng lại kết nối keep-alive cũ trỏ tới server đã bị tắt. Mình thêm cơ chế thử lại khi kết nối bị ngắt.

**Claude:**

Phần API chạy xong. Selector giao diện bị trùng với một `div` khác cùng class, nên mình sửa selector rồi chạy lại.

**Claude:**

FR-09 xong: 37 TC. Giờ mình chạy FR-02 bản đầy đủ ở chế độ nền (khoảng 12 phút, vì có các ca đo thời gian khóa 175/185 giây). Trong lúc chờ, mình viết report.

**Claude:**

Danh mục 4 feature đã xong: FR-02 có 23 TC, FR-09 có 37, FR-16 có 38, FR-06 có 22. Giờ mình viết `render.mjs`, script sinh bảng test case và kết quả vào report.

**Claude:**

Đã xong S0–S5 của FR-02. Tiếp theo là FR-09, feature có nhiều điều kiện kết hợp nhất.

**Claude:**

Đã xong S0–S5 cho cả 4 feature. Mình kiểm tra tiến độ FR-02.

**Claude:**

Danh sách có 20 bug: FR-02 có 6, FR-09 có 6, FR-16 có 8. Giờ mình viết script sinh bản nháp issue (dán thẳng vào template GitHub của nhóm) và file Bug_Report.md tổng hợp.

**Claude:**

Trong lúc FR-02 chạy nốt ca cuối (EP-14, phải chờ hết khóa), mình viết phần S6–S8 cho từng feature.

**Claude:**

Mình xem nhanh vài ảnh minh chứng để chắc là chúng thể hiện đúng nội dung.

**Claude:**

Trước khi ghép, mình commit bộ công cụ dùng chung bằng tag `[setup]`.

**Claude:**

`.gitignore` bỏ qua file `*.log`, nên mình loại file log khỏi danh sách commit. Đồng thời sửa builder để bỏ qua từng bước đã commit, thay vì chỉ bỏ qua S0–S2.

**Claude:**

Report đã ghép đúng, không có link hỏng. Mình lấy số liệu tổng hợp của cả 4 feature cho README.

**Claude:**

Mình chạy thử script xuất log trên transcript của chính phiên này để kiểm tra nó hoạt động.

**Claude:**

Script xuất log hoạt động đúng: lấy ra đủ 6 prompt, có giờ Việt Nam. Mình commit phần skill, rồi viết AI Audit Report, AI Critique và form AI-03.

**Claude:**

Mình kiểm tra độ dài AI Critique (đề yêu cầu 200–300 từ).

**Claude:**

Đoạn văn có 316 tiếng, vượt mức 300, nên mình rút gọn lại.

**Claude:**

Đoạn văn còn 280 tiếng. Giờ mình cập nhật README của repo: bảng test summary, kết quả, và các việc còn lại.

**Claude:**

Giờ mình viết script xuất PDF: chuyển Markdown sang HTML, rồi dùng Edge in ra PDF khổ A4 ngang để bảng rộng không bị cắt.

**Claude:**

Đã xuất 9 file PDF. Mình mở thử một trang PDF để kiểm tra bố cục và font tiếng Việt.

**Claude:**

Patch không áp dụng được vì lỗi escape chuỗi trong Python. Mình sửa trực tiếp bằng công cụ Edit.

**Claude:**

Escape đã chạy đúng (`<JWT>` → `&lt;JWT&gt;`). Mình xuất lại PDF, xem thử một trang, rồi commit.

**Claude:**

Toàn bộ bài chỉ khoảng 4,2 MB, dư sức so với giới hạn. Mình chạy thử script đóng gói để chắc nó hoạt động, rồi xóa file thử.

**Claude:**

Windows PowerShell 5.1 đọc file UTF-8 không có BOM theo bảng mã ANSI, nên tiếng Việt trong chuỗi bị vỡ. Mình thêm BOM UTF-8 cho các file `.ps1` rồi chạy lại.

**Claude:**

Câu trả lời trước của mình bị dừng giữa chừng, nên một phần chưa hoàn tất.

**Đã xong** (trong repo `software-testing-2026-HW02/`, 48 commit):
- 4 report trong `reports/`, có đủ các bước S0–S8.
- 97 test case đã chạy thật trên Web/Admin; ảnh minh chứng nằm trong `evidence/`.
- Bản nháp 20 bug trong `bugs/`.
- Script, Agent Skills, AI Audit Report, bản nháp AI Critique, form AI-03 và bản PDF.

**Chưa làm:**
- Chưa xuất prompt log mới nhất và `git_log.txt`.
- Chưa push repo.

**Trạng thái máy:** backend EShop đang chạy nền ở cổng 3000 (mình đã khởi động lại nó), còn Web và Admin của bạn vẫn đang chạy.

Bạn muốn mình làm tiếp phần nào?

## Prompt 7 — 08:57 21/10/2026

```text
làm tiếp đến hết
```
