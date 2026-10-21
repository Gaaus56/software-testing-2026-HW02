"""Trích nguyên văn các mục đặc tả EShop vào khung report S0 của từng feature.

Cách dùng: python -I extract_spec.py <thư mục eshop-sut> <thư mục reports>
"""
import sys
from pathlib import Path

sys.stdout.reconfigure(encoding="utf-8")
sut, out_dir = Path(sys.argv[1]), Path(sys.argv[2])
readme = (sut / "README.md").read_text(encoding="utf-8").splitlines()
api = (sut / "api_specification.md").read_text(encoding="utf-8").splitlines()


def section(lines, heading):
    """Trả về các dòng từ tiêu đề `heading` đến trước tiêu đề/đường kẻ kế tiếp."""
    start = next(i for i, l in enumerate(lines) if l.strip() == heading)
    level = len(heading) - len(heading.lstrip("#"))
    end = len(lines)
    for j in range(start + 1, len(lines)):
        s = lines[j]
        if s.strip() == "---":
            end = j
            break
        if s.startswith("#"):
            lv = len(s) - len(s.lstrip("#"))
            if lv <= level:
                end = j
                break
    block = lines[start:end]
    while block and not block[-1].strip():
        block.pop()
    return block, start + 1, start + len(block)


def rows(lines, prefixes):
    """Trả về các dòng bảng bắt đầu bằng một trong các prefix (giữ header bảng)."""
    hdr_i = next(i for i, l in enumerate(lines) if l.startswith("| ID"))
    out = [lines[hdr_i], lines[hdr_i + 1]]
    out += [l for l in lines if any(l.startswith(p) for p in prefixes)]
    return out


def quote(block):
    return "\n".join("> " + l if l.strip() else ">" for l in block)


def cite(src, heading, a, b):
    return f"_Nguồn: `eshop-sut/{src}`, dòng {a}–{b}._"


def spec(heading, why=None, src="README.md"):
    lines = readme if src == "README.md" else api
    block, a, b = section(lines, heading)
    parts = []
    if why:
        parts.append(f"**{heading.lstrip('# ').strip()}**: {why}")
        parts.append("")
    parts.append(quote(block))
    parts.append("")
    parts.append(cite(src, heading, a, b))
    return "\n".join(parts)


def sec_rows(ids, why):
    block = rows(readme, [f"| {i} " for i in ids])
    return f"**Yêu cầu bảo mật {', '.join(ids)}**: {why}\n\n{quote(block)}\n\n_Nguồn: `eshop-sut/README.md`, mục 9._"


HEADER = """# {title}

> Trần Thanh An — 23120017 — HW02 Domain Testing
> SUT: `ttbhanh/eshop-sut`, commit `85af3ba`. Oracle: `eshop-sut/README.md` (Đặc tả v2.0, 2026-05-14).

## 1. Đặc tả và phạm vi (S0)

### 1.1 Đặc tả chính (trích nguyên văn)

{main}

### 1.2 Yêu cầu chung liên quan (trích nguyên văn)

{related}

### 1.3 API liên quan (trích nguyên văn `api_specification.md`)

{api}

### 1.4 Khám phá giao diện

_(Tự điền sau khi mở app. Mỗi dòng là một quan sát, chưa đánh giá đúng/sai.)_

| # | Màn hình / thành phần | Quan sát | Ảnh |
|---|---|---|---|
| U1 | | | |

### 1.5 Điểm mơ hồ và giả định

_(Tự điền. Mỗi điểm: trích câu đặc tả → câu hỏi → các cách hiểu → cách hiểu chọn → ảnh hưởng tới test.)_

| # | Câu đặc tả | Câu hỏi | Cách hiểu chọn | Lý do | Ảnh hưởng |
|---|---|---|---|---|---|
| A1 | | | | | |

### 1.6 Phạm vi

- **Trong phạm vi:** _(tự điền)_
- **Ngoài phạm vi:** _(tự điền, ghi FR thuộc người khác nếu chỉ dùng để chuẩn bị dữ liệu)_
"""

features = {
    "A-FR02_Login_Lockout.md": dict(
        title="A-FR02 — Đăng nhập & Khóa tài khoản (Web)",
        main=spec("### FR-02: Đăng nhập & Khóa tài khoản"),
        related="\n\n".join([
            spec("### FR-22: Form Requirements", "form đăng nhập phải theo các quy tắc chung về form (dấu `*`, `type=\"email\"`, `type=\"password\"`, vị trí thông báo lỗi)."),
            spec("### FR-21: Tiêu chuẩn Giao diện Chung", "thông báo lỗi/khóa phải bằng tiếng Việt, nút Đăng nhập màu xanh dương."),
            sec_rows(["SEC-01", "SEC-02"], "liên quan tới mật khẩu và token trả về sau khi đăng nhập."),
            spec("## 1. Tổng quan Hệ thống", "tài khoản mặc định dùng để test."),
        ]),
        api=spec("### 1.2 Đăng nhập", src="api_specification.md"),
    ),
    "B-FR09_Coupon.md": dict(
        title="B-FR09 — Mã giảm giá / Coupon (Web)",
        main=spec("### FR-09: Mã Giảm Giá (Coupon)"),
        related="\n\n".join([
            spec("### FR-08: Thanh toán (Checkout)", "coupon được nhập tại bước Checkout; quy tắc backend tự tính tổng tiền áp dụng cho `total` trong công thức giảm giá. FR-08 thuộc Hương, chỉ dùng làm ngữ cảnh."),
            spec("### FR-17: Quản lý Mã Giảm Giá (Coupon CRUD)", "định nghĩa các trường của coupon; dùng giao diện này để tạo coupon test (biên ngày, ngưỡng). FR-17 thuộc Ngọc, chỉ dùng để chuẩn bị dữ liệu."),
            spec("### FR-21: Tiêu chuẩn Giao diện Chung", "số tiền giảm và thành tiền phải hiển thị `₫` có phân cách hàng nghìn."),
            sec_rows(["SEC-02", "SEC-05"], "C4 yêu cầu JWT hợp lệ; ô nhập mã đi vào truy vấn CSDL."),
        ]),
        api="\n\n".join([
            spec("### 5.1 Áp dụng mã giảm giá", src="api_specification.md"),
            spec("### 4.3 Đặt hàng (Checkout)", src="api_specification.md"),
            spec("### 6.4 Quản lý Mã Giảm Giá", src="api_specification.md"),
        ]),
    ),
    "C-FR16_CSV_Import.md": dict(
        title="C-FR16 — Import sản phẩm từ CSV (Web Admin)",
        main=spec("### FR-16: Import Sản phẩm từ CSV"),
        related="\n\n".join([
            spec("### FR-15: Quản lý Sản phẩm (Product CRUD)", "ràng buộc dữ liệu sản phẩm (tên ≤ 255 ký tự, giá > 0, danh mục có sẵn). FR-16 không nhắc lại, cần ghi giả định có áp dụng hay không. FR-15 thuộc Hương."),
            spec("### FR-12: Kiểm soát truy cập (Access Control)", "API import là API Admin, phải yêu cầu token admin."),
            sec_rows(["SEC-03", "SEC-04", "SEC-05"], "chỉ admin được import; tên/mô tả sản phẩm import sẽ được hiển thị ở Web."),
        ]),
        api=spec("### 6.3 Import Sản phẩm từ CSV (JSON Array)", src="api_specification.md"),
    ),
    "D-FR06_Mobile_Product_Detail.md": dict(
        title="D-FR06 — Chi tiết sản phẩm (Mobile)",
        main=spec("### FR-06: Xem chi tiết sản phẩm"),
        related="\n\n".join([
            spec("### FR-20: Tính năng Mobile", "căn cứ để áp dụng FR-06 trên Mobile (\"Xem sản phẩm\", \"Giỏ hàng\")."),
            spec("### FR-24: Feedback & State Requirements", "phản hồi sau khi bấm \"Thêm vào giỏ\"."),
            spec("### FR-21: Tiêu chuẩn Giao diện Chung", "giá hiển thị `₫` có phân cách hàng nghìn, giao diện tiếng Việt."),
        ]),
        api="\n\n".join([
            spec("### 3.2 Xem chi tiết một sản phẩm", src="api_specification.md"),
            spec("### 4.2 Thêm vào giỏ hàng", src="api_specification.md"),
        ]),
    ),
}

out_dir.mkdir(parents=True, exist_ok=True)
for name, f in features.items():
    p = out_dir / name
    if p.exists():
        print("SKIP (đã tồn tại):", p)
        continue
    p.write_text(HEADER.format(**f), encoding="utf-8")
    print("Đã tạo:", p)
