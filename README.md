# CourtConnect — Đặt sân và ghép người chơi theo trình độ

> **Mã đề tài:** BTL-28  
> **Học phần:** Phát triển Ứng dụng Web Cơ bản — CSE122  
> **Lĩnh vực:** Thể thao / SportsTech  
> **Năm học theo tài liệu hướng dẫn:** 2026–2027  
> **Quy mô nhóm:** 3 sinh viên  
> **Loại sản phẩm:** Nguyên mẫu Frontend nhiều vai trò, dùng dữ liệu mô phỏng

CourtConnect kết nối người chơi pickleball/cầu lông với sân và trận phù hợp, đồng thời cung cấp giao diện vận hành cho chủ sân, điều phối câu lạc bộ và quản trị viên. Sản phẩm mô phỏng các luồng tìm kiếm, đặt sân, quản lý đơn, tổ chức trận/CLB và các gợi ý AI để người dùng xem xét trước khi quyết định.

README này mô tả **mã nguồn và luồng hiện có trong kho**, không thay thế bảng kiểm kê màn hình đã được giảng viên duyệt. Tên và cấu trúc tệp thực tế có thể khác các tên ví dụ tiếng Anh trong tài liệu môn học.

## Mục lục

1. [Bối cảnh và vấn đề](#1-bối-cảnh-và-vấn-đề)
2. [Mục tiêu và phạm vi](#2-mục-tiêu-và-phạm-vi)
3. [Bắt đầu chạy dự án](#3-bắt-đầu-chạy-dự-án)
4. [Luồng tổng thể và tài khoản demo](#4-luồng-tổng-thể-và-tài-khoản-demo)
5. [Vai trò và màn hình hiện có](#5-vai-trò-và-màn-hình-hiện-có)
6. [Các tính năng AI mô phỏng](#6-các-tính-năng-ai-mô-phỏng)
7. [Công nghệ và cách lưu dữ liệu](#7-công-nghệ-và-cách-lưu-dữ-liệu)
8. [Cấu trúc thư mục](#8-cấu-trúc-thư-mục)
9. [Kiểm thử thủ công](#9-kiểm-thử-thủ-công)
10. [Thiết kế, phân công và quy trình nhóm](#10-thiết-kế-phân-công-và-quy-trình-nhóm)
11. [Yêu cầu hoàn thiện và minh chứng](#11-yêu-cầu-hoàn-thiện-và-minh-chứng)
12. [Giới hạn và an toàn dữ liệu](#12-giới-hạn-và-an-toàn-dữ-liệu)

## 1. Bối cảnh và vấn đề

Pickleball và cầu lông là các môn cần ghép người chơi và khớp lịch với sân. Khi thông tin nằm rải rác trong nhiều nhóm chat, người chơi khó tìm trận vừa trình độ, lịch sân khó đồng bộ với lịch rảnh, chủ sân khó theo dõi yêu cầu đặt và CLB mất công chia đội.

CourtConnect tập trung vào bốn vấn đề:

| Mã | Vấn đề |
|---|---|
| P1 | Khó tìm bạn chơi/đối thủ có trình độ tương đương. |
| P2 | Lịch trống của sân và lịch rảnh của người chơi không đồng bộ. |
| P3 | Chủ sân phải theo dõi slot và xử lý đơn đặt thủ công, bao gồm nguy cơ khách không đến. |
| P4 | Điều phối CLB khó quản lý sự kiện, danh sách tham gia và chia đội cân bằng. |

## 2. Mục tiêu và phạm vi

### Mục tiêu

- Tạo hành trình Frontend liền mạch từ trang khám phá tới chức năng phù hợp với vai trò.
- Triển khai giao diện riêng cho người chơi, chủ sân, điều phối CLB và quản trị viên.
- Mô phỏng các thao tác nghiệp vụ như tìm kiếm/lọc, tạo và cập nhật dữ liệu, xác nhận/từ chối/hủy đơn.
- Dùng HTML ngữ nghĩa, CSS responsive và JavaScript cho tương tác, kiểm tra biểu mẫu, kết xuất dữ liệu và trạng thái giao diện.
- Thiết kế ba trải nghiệm AI mô phỏng có giải thích và thao tác để người dùng chấp nhận, chỉnh sửa hoặc bỏ qua gợi ý.

### Phạm vi nguyên mẫu

Đây là ứng dụng tĩnh chạy phía trình duyệt. Kho mã hiện không yêu cầu cài đặt máy chủ hoặc bước build. Tài khoản, dữ liệu, biểu đồ và gợi ý AI được dùng để minh họa trải nghiệm; dự án chưa kết nối dịch vụ đặt sân, thanh toán, xác thực hoặc mô hình AI thật.

Số màn hình trong README được liệt kê theo các trang đang có trong repo. Theo hướng dẫn CSE122, ngưỡng tối thiểu không thay thế việc phân tích đầy đủ nghiệp vụ: nhóm cần duy trì bảng kiểm kê màn hình được duyệt, các trạng thái phù hợp và minh chứng cho từng màn hình thực tế.

## 3. Bắt đầu chạy dự án

### Mở nhanh

1. Mở thư mục repository trong Visual Studio Code.
2. Mở [index.html](./index.html) ở thư mục gốc bằng trình duyệt. Trang này chuyển tới trang Khám phá trong module CourtConnect chính.
3. Nếu muốn mở trực tiếp ứng dụng chính, mở [BTL_28_DieuPhoiCLB/khampha.html](./BTL_28_DieuPhoiCLB/khampha.html).
4. Chọn **Chọn vai trò**, sau đó chọn đăng nhập hoặc đăng ký để đi tới luồng tương ứng.

### Khuyến nghị khi phát triển

Chạy repository bằng một tiện ích máy chủ tĩnh trong VS Code (ví dụ Live Server) rồi mở URL do tiện ích cung cấp. Cách này giúp điều hướng giữa các trang và tải tài nguyên cục bộ nhất quán hơn so với mở từng tệp độc lập bằng `file://`.

Không cần `npm install` hoặc lệnh build cho cấu trúc hiện tại. Một số màn hình tải thư viện, font hoặc ảnh từ CDN/Internet; nếu mất mạng, các phần phụ thuộc bên ngoài đó có thể không hiển thị.

## 4. Luồng tổng thể và tài khoản demo

```text
index.html ở thư mục gốc
        ↓
Khám phá (BTL_28_DieuPhoiCLB/khampha.html)
        ↓
Chọn vai trò (chonvaitro.html)
        ↓
Đăng nhập hoặc đăng ký — biểu mẫu được điền theo vai trò nếu là luồng demo
        ↓
Trang chức năng của vai trò
```

Trang đăng nhập nhận vai trò qua tham số `vaiTro` trên URL. Trang `dangnhap.js` tra tài khoản demo từ `auth.js` rồi điền vào trường email/mật khẩu; khi gửi biểu mẫu, `auth.js` điều hướng đến module tương ứng. Trang chọn vai trò **không hiển thị công khai thông tin đăng nhập**. Đăng ký hỗ trợ người chơi, chủ sân và điều phối CLB; quản trị viên chỉ được cấp qua luồng quản trị.

Tài khoản demo được định nghĩa tập trung trong [auth.js](./BTL_28_DieuPhoiCLB/auth.js), không chép lại trong README. Chọn vai trò trên giao diện để tự điền tài khoản; chỉ dùng tài khoản demo trong trình duyệt phát triển.

| Vai trò | Trang đích sau đăng nhập |
|---|---|
| Người chơi | [VuDuyen/index.html](./VuDuyen/index.html) |
| Chủ sân | [BaiTapLon_28/chusan_tongquan.html](./BaiTapLon_28/chusan_tongquan.html) |
| Điều phối CLB | [BTL_28_DieuPhoiCLB/DieuPhoiCLB/index1.html](./BTL_28_DieuPhoiCLB/DieuPhoiCLB/index1.html) |
| Quản trị viên | [BTL_28_DieuPhoiCLB/quantrivien.html](./BTL_28_DieuPhoiCLB/quantrivien.html) |

Các trang chức năng đã được gắn thanh **“Quay về chọn vai trò”**. Mã dùng chung nằm tại [dieu-huong-vai-tro.js](./BTL_28_DieuPhoiCLB/dieu-huong-vai-tro.js) và [dieu-huong-vai-tro.css](./BTL_28_DieuPhoiCLB/dieu-huong-vai-tro.css).

## 5. Vai trò và màn hình hiện có

### 5.1. Người chơi

Mô-đun [VuDuyen/](./VuDuyen/) cung cấp luồng tìm sân, đặt lịch, ghép người và theo dõi lịch:

| Tệp | Màn hình / nhiệm vụ |
|---|---|
| [index.html](./VuDuyen/index.html) | Tìm kiếm, lọc sân theo môn/khu vực/ngày và xem thông tin sân. |
| [trang2.html](./VuDuyen/trang2.html) | Chi tiết sân, giá và lựa chọn khung giờ. |
| [trang3.html](./VuDuyen/trang3.html) | Xem thông tin đặt sân và xác nhận quy trình thanh toán mô phỏng. |
| [trang4.html](./VuDuyen/trang4.html) | Tìm trận mở, lọc trận và xem gợi ý Skill Match. |
| [trang5.html](./VuDuyen/trang5.html) | Chi tiết trận, người tham gia và gửi/rút yêu cầu tham gia. |
| [trang6.html](./VuDuyen/trang6.html) | Lịch sắp tới, trạng thái trận và sân đã lưu. |

Các trang này dùng chung tài nguyên hình ảnh trong [assets/](./assets/). JavaScript và CSS nằm cạnh từng trang; trang tìm sân dùng [main.js](./VuDuyen/main.js).

### 5.2. Chủ sân

Mô-đun [BaiTapLon_28/](./BaiTapLon_28/) là bộ giao diện quản lý sân được nối vào vai trò Chủ sân:

| Tệp | Màn hình / nhiệm vụ |
|---|---|
| [chusan_tongquan.html](./BaiTapLon_28/chusan_tongquan.html) | Tổng quan hoạt động sân, chỉ số và đơn cần xử lý. |
| [chusan_quanlysan.html](./BaiTapLon_28/chusan_quanlysan.html) | Quản lý các sân và thông tin khai thác. |
| [chusan_lichkhunggio.html](./BaiTapLon_28/chusan_lichkhunggio.html) | Xem và quản lý lịch, khung giờ. |
| [chusan_dondatsan.html](./BaiTapLon_28/chusan_dondatsan.html) | Tra cứu và xử lý đơn đặt; có khu vực gợi ý No-show Risk mô phỏng. |
| [chusan_chitietdon.html](./BaiTapLon_28/chusan_chitietdon.html) | Xem chi tiết một đơn đặt sân. |

Mỗi trang có CSS/JavaScript tương ứng cùng tiền tố `chusan_`. [BTL_28_DieuPhoiCLB/chusan.html](./BTL_28_DieuPhoiCLB/chusan.html) là giao diện quản lý sân cũ trong module CourtConnect; luồng đăng nhập Chủ sân hiện trỏ tới dashboard `BaiTapLon_28/chusan_tongquan.html`.

### 5.3. Điều phối câu lạc bộ

Mô-đun [BTL_28_DieuPhoiCLB/DieuPhoiCLB/](./BTL_28_DieuPhoiCLB/DieuPhoiCLB/) bao gồm:

| Tệp | Màn hình / nhiệm vụ |
|---|---|
| [index1.html](./BTL_28_DieuPhoiCLB/DieuPhoiCLB/index1.html) | Tổng quan và quản lý sự kiện CLB. |
| [chitiet.html](./BTL_28_DieuPhoiCLB/DieuPhoiCLB/chitiet.html) | Thông tin chi tiết sự kiện. |
| [thanhvien.html](./BTL_28_DieuPhoiCLB/DieuPhoiCLB/thanhvien.html) | Danh sách thành viên. |
| [xepdoi.html](./BTL_28_DieuPhoiCLB/DieuPhoiCLB/xepdoi.html) | Tạo, xem xét và điều chỉnh phương án chia đội. |

Các tệp `xepdoi.js`, `duLieuCLB.js`, `api.json` và `api-data.json` hỗ trợ giao diện điều phối/xếp đội bằng dữ liệu mô phỏng.

### 5.4. Quản trị viên và các trang CourtConnect dùng chung

Các trang quản trị nằm trong [BTL_28_DieuPhoiCLB/](./BTL_28_DieuPhoiCLB/):

| Tệp | Màn hình / nhiệm vụ |
|---|---|
| [quantrivien.html](./BTL_28_DieuPhoiCLB/quantrivien.html) | Quản lý danh mục môn thể thao. |
| [nguoidung.html](./BTL_28_DieuPhoiCLB/nguoidung.html) | Quản lý người dùng. |
| [baocao.html](./BTL_28_DieuPhoiCLB/baocao.html) | Báo cáo thể thao. |
| [thongbao.html](./BTL_28_DieuPhoiCLB/thongbao.html) | Thông báo. |
| [hethong.html](./BTL_28_DieuPhoiCLB/hethong.html) | Giao diện hệ thống/đề xuất mô phỏng. |
| [rasoatquyen.html](./BTL_28_DieuPhoiCLB/rasoatquyen.html) | Rà soát quyền và trạng thái vận hành. |

Repository còn có [BaiTapLon_28/chusan_baocao.html](./BaiTapLon_28/chusan_baocao.html), một trang báo cáo phụ trong thư mục `BaiTapLon_28`. Nội dung giao diện hiện ghi vai trò Quản trị viên; tên tệp mang tiền tố `chusan_` không đồng nghĩa đây là một màn hình Chủ sân trong luồng đăng nhập.

Các trang dùng chung và luồng Người chơi trong module CourtConnect gồm:

- [index.html](./BTL_28_DieuPhoiCLB/index.html): trang chuyển tiếp của module.
- [khampha.html](./BTL_28_DieuPhoiCLB/khampha.html): trang khám phá, điểm vào hành trình chính.
- [chonvaitro.html](./BTL_28_DieuPhoiCLB/chonvaitro.html): chọn vai trò, không công khai email/mật khẩu demo.
- [dangnhap.html](./BTL_28_DieuPhoiCLB/dangnhap.html), [dangky.html](./BTL_28_DieuPhoiCLB/dangky.html): biểu mẫu xác thực demo và đăng ký.
- [khoiphucmatkhau.html](./BTL_28_DieuPhoiCLB/khoiphucmatkhau.html): giao diện khôi phục mật khẩu mô phỏng.
- [timsandidong.html](./BTL_28_DieuPhoiCLB/timsandidong.html), [sangiodidong.html](./BTL_28_DieuPhoiCLB/sangiodidong.html), [trandidong.html](./BTL_28_DieuPhoiCLB/trandidong.html), [lichthethao.html](./BTL_28_DieuPhoiCLB/lichthethao.html), [hoso.html](./BTL_28_DieuPhoiCLB/hoso.html): các luồng tìm sân, sân, trận, lịch và hồ sơ trong module này.
- [trangthai.html](./BTL_28_DieuPhoiCLB/trangthai.html): xem các trạng thái và hành động của các gợi ý AI mô phỏng.
- [hethong.html](./BTL_28_DieuPhoiCLB/hethong.html) và [kiemke.html](./BTL_28_DieuPhoiCLB/kiemke.html): hệ thống thiết kế và kiểm kê/luồng dự kiến.

## 6. Các tính năng AI mô phỏng

Ba trải nghiệm AI theo đề tài được thể hiện dưới dạng **mô phỏng Frontend**:

| Tính năng | Vai trò | Vị trí trong mã | Mục đích |
|---|---|---|---|
| Skill Match | Người chơi | [VuDuyen/trang4.html](./VuDuyen/trang4.html), [BTL_28_DieuPhoiCLB/trandidong.html](./BTL_28_DieuPhoiCLB/trandidong.html) | Gợi ý trận theo trình độ/lịch và cho người chơi xem xét. |
| Team Balancer | Điều phối CLB | [DieuPhoiCLB/xepdoi.html](./BTL_28_DieuPhoiCLB/DieuPhoiCLB/xepdoi.html) | Gợi ý chia đội; điều phối viên có thể xem và điều chỉnh trước khi dùng. |
| No-show Risk | Chủ sân | [BaiTapLon_28/chusan_dondatsan.html](./BaiTapLon_28/chusan_dondatsan.html) | Minh họa cảnh báo nguy cơ khách không đến để chủ sân cân nhắc hành động. |

Giao diện trạng thái và hành động được minh họa thêm tại [trangthai.html](./BTL_28_DieuPhoiCLB/trangthai.html). Các đề xuất AI không tự thay quyết định của người dùng. Không có LLM/API AI thật được cấu hình trong repository.

Theo yêu cầu CSE122, khi hoàn thiện mỗi tính năng AI cần thể hiện đủ các bước phù hợp:

```text
Nhập dữ liệu → Kiểm tra hợp lệ → Đang xử lý → Kết quả
→ Giải thích → Chấp nhận / Sửa / Từ chối / Tạo lại
→ Lưu vào trạng thái ứng dụng
```

Cũng cần có trạng thái thất bại/không chắc chắn, như thiếu dữ liệu, kết quả không chắc chắn hoặc không thể xử lý; cung cấp lựa chọn thử lại, chỉnh sửa hoặc xử lý thủ công.

## 7. Công nghệ và cách lưu dữ liệu

- **HTML5:** cấu trúc trang và biểu mẫu.
- **CSS3:** bố cục, thành phần giao diện và responsive theo từng module.
- **JavaScript ES6:** sự kiện DOM, tìm kiếm/lọc, kiểm tra biểu mẫu, hiển thị trạng thái và điều hướng.
- **LocalStorage / SessionStorage:** dùng ở luồng demo để lưu một số dữ liệu người dùng, phiên trình duyệt hoặc thao tác mô phỏng.
- **Dữ liệu tĩnh/mock:** dữ liệu JavaScript/JSON phục vụ sân, đơn, sự kiện và thành viên CLB.
- **Thư viện/CDN tùy trang:** một số trang `BaiTapLon_28` dùng Lucide, Google Fonts hoặc Chart.js; kiểm tra kết nối mạng nếu các tài nguyên này không tải.

Không có server/API sản phẩm được yêu cầu để chạy ứng dụng. Dữ liệu lưu cục bộ trong trình duyệt không đồng bộ giữa người dùng, máy tính hoặc trình duyệt khác.

## 8. Cấu trúc thư mục

```text
Court-Connect-main/
├── index.html                         # Entry point cấp repository → trang Khám phá
├── README.md                          # Tài liệu dự án
├── assets/                            # Ảnh dùng chung và bộ tài nguyên BaiTapLon_28
├── VuDuyen/                           # Luồng giao diện Người chơi (6 màn hình)
│   ├── index.html                     # Tìm kiếm sân
│   ├── trang2.html                    # Chi tiết sân/khung giờ
│   ├── trang3.html                    # Đặt sân/thanh toán mô phỏng
│   ├── trang4.html                    # Trận mở/Skill Match
│   ├── trang5.html                    # Chi tiết trận
│   └── trang6.html                    # Lịch đã đặt
├── BaiTapLon_28/                      # Bộ giao diện Chủ sân và trang báo cáo phụ
│   ├── chusan_tongquan.html
│   ├── chusan_quanlysan.html
│   ├── chusan_lichkhunggio.html
│   ├── chusan_dondatsan.html
│   ├── chusan_chitietdon.html
│   └── chusan_baocao.html             # Nội dung hiện ghi vai trò Quản trị viên
└── BTL_28_DieuPhoiCLB/                # Khám phá, auth, Người chơi và Quản trị
    ├── index.html                     # Entry point module → khampha.html
    ├── khampha.html                   # Trang Khám phá
    ├── chonvaitro.html                # Chọn vai trò
    ├── dangnhap.html / dangky.html    # Xác thực demo/đăng ký
    ├── auth.js                        # Tài khoản demo, session, điều hướng vai trò
    ├── dieu-huong-vai-tro.js          # Thanh quay về dùng chung
    ├── trangthai.html                 # Trạng thái các gợi ý AI
    └── DieuPhoiCLB/                   # Sự kiện, thành viên, xếp đội
        ├── index1.html
        ├── chitiet.html
        ├── thanhvien.html
        └── xepdoi.html
```

Phần lớn màn hình có tệp CSS/JS cùng tên nằm cạnh HTML. Một số thư mục tài liệu và tài nguyên có thể chứa bản mẫu/phiên bản phụ; các liên kết trong luồng đăng nhập ở mục 4 là các trang đích chính thức hiện tại của từng vai trò.

## 9. Kiểm thử thủ công

Trước khi trình bày hoặc thay đổi luồng điều hướng, kiểm tra tối thiểu:

1. Mở `index.html` ở thư mục gốc và xác nhận trang chuyển tới Khám phá.
2. Từ Khám phá mở trang chọn vai trò; xác nhận trang này không hiện email hoặc mật khẩu demo.
3. Chọn từng vai trò và xác nhận biểu mẫu đăng nhập được điền đúng vai trò.
4. Đăng nhập thử và kiểm tra đúng trang đích:
   - Người chơi → `VuDuyen/index.html`.
   - Chủ sân → `BaiTapLon_28/chusan_tongquan.html`.
   - Điều phối CLB → `BTL_28_DieuPhoiCLB/DieuPhoiCLB/index1.html`.
   - Quản trị viên → `BTL_28_DieuPhoiCLB/quantrivien.html`.
5. Mở đăng ký theo vai trò được hỗ trợ; kiểm tra vai trò và hồ sơ demo điền sẵn; quản trị viên không tự đăng ký.
6. Thử các thao tác chính của từng màn hình: lọc/tìm kiếm, xác nhận/hủy, tạo/sửa, gợi ý AI, thông báo và các trạng thái rỗng/lỗi khi có.
7. Kiểm tra thanh “Quay về chọn vai trò” trên desktop và kích thước màn hình nhỏ.
8. Mở Console/Network để nhận biết lỗi JavaScript hoặc tài nguyên CDN không tải.

Repository hiện không khai báo runner test tự động hoặc pipeline build; vì vậy các bước trên là checklist kiểm thử thủ công, không phải báo cáo rằng có bộ test tự động.

## 10. Thiết kế, phân công và quy trình nhóm

Tài liệu hướng dẫn CSE122 yêu cầu nhóm phân tích theo chuỗi:

```text
Ngữ cảnh → Vấn đề → Mục tiêu → Vai trò
→ Nhiệm vụ → Luồng người dùng → Kiểm kê màn hình
→ Bao phủ trạng thái → Thiết kế → Triển khai
```

Trước khi triển khai chính thức, nhóm cần trình duyệt luồng người dùng, bảng kiểm kê màn hình và bản thiết kế Figma/Canva. Số lượng màn hình phải xuất phát từ độ đầy đủ nghiệp vụ, không phải chỉ nhằm đạt ngưỡng tối thiểu.

### Phân công tham chiếu trong tài liệu đề tài

| Thành viên | Phạm vi phụ trách đề xuất |
|---|---|
| SV1 | Người chơi và một phần giao diện dùng chung. |
| SV2 | Chủ sân và tương tác/dữ liệu mô phỏng. |
| SV3 | Điều phối CLB, quản trị, tích hợp và phát hành. |

Đây là phân công tham chiếu từ tài liệu đề tài, không ghi tên cá nhân vì repository chưa cung cấp tên thành viên. Mỗi sinh viên cần có ít nhất một lát cắt dọc: phân tích, thiết kế, HTML/CSS/JS, dữ liệu, responsive, Git/PR và minh chứng OBS.

### Quy trình Git đề xuất theo hướng dẫn môn học

```text
Task → Nhánh feature/fix/docs → Code → Commit
→ Push → Pull Request → Review chéo → Merge dev
→ Kiểm thử tích hợp → Merge main
```

Ví dụ thông điệp commit:

```text
feat: add player match filters
fix: validate booking form
style: improve owner dashboard on mobile
docs: update screen inventory
```

Không phát triển toàn bộ trực tiếp trên `main`; mỗi PR cần mô tả thay đổi, liên kết công việc và được thành viên khác review.

## 11. Yêu cầu hoàn thiện và minh chứng

Theo hướng dẫn thực hiện BTL:

- Mỗi giao diện trong bảng kiểm kê được duyệt cần có thiết kế phù hợp, HTML ngữ nghĩa, CSS responsive, tương tác JavaScript và dữ liệu/trạng thái cần thiết.
- Phân tích các trạng thái có ý nghĩa cho chức năng: bình thường, đang tải, rỗng, lỗi, thành công, đang chờ, bị từ chối, hoàn thành hoặc hủy/lưu trữ khi phù hợp.
- Mỗi màn hình chỉ được đánh dấu hoàn thành khi đã kiểm tra responsive, khả năng tiếp cận cơ bản và các trạng thái/form tương ứng; quy trình nhóm cần có task, nhánh, commit, PR/review và tích hợp.
- Mỗi màn hình độc lập đã duyệt cần video OBS riêng. Video nên thể hiện sinh viên, mockup, mã nguồn, giải thích HTML/CSS/JS, một chỉnh sửa trực tiếp, chạy thử và mã công việc/nhánh/commit.
- README/bảng kiểm kê cần được cập nhật khi màn hình, luồng hoặc phân công thay đổi.

### Bộ sản phẩm cần chuẩn bị để nộp

1. Báo cáo đề tài: bối cảnh, vấn đề, mục tiêu, vai trò, luồng người dùng, kiểm kê màn hình và tính năng AI.
2. Bản mô phỏng Figma/Canva cho tất cả màn hình trong bảng kiểm kê, gồm liên kết và ảnh xuất.
3. Mã nguồn HTML/CSS/JavaScript trong một repository GitHub chung.
4. Dữ liệu mock/API được dùng cho nguyên mẫu.
5. Bảng Trello/Jira/Notion hoặc công cụ tương đương; tối thiểu các cột **Tồn đọng → Cần làm → Đang làm → Chờ duyệt → Hoàn thành**, task liên kết người phụ trách và commit/PR.
6. Một video OBS cho mỗi màn hình độc lập đã duyệt.
7. README và báo cáo khai báo sử dụng AI.

### Tỷ trọng đánh giá định hướng trong hướng dẫn CSE122

| Hạng mục | Tỷ trọng |
|---|---:|
| Tư duy bài toán và sản phẩm | 10% |
| Vai trò, luồng người dùng và độ đầy đủ màn hình | 20% |
| Giao diện, trải nghiệm và responsive | 15% |
| HTML/CSS | 10% |
| JavaScript/DOM/API | 15% |
| Trải nghiệm sản phẩm AI | 10% |
| Git/Trello/làm việc nhóm | 10% |
| OBS, bảo vệ và giải thích | 10% |

### Tài liệu cần nhóm bổ sung hoặc liên kết khi sẵn sàng

- Link Figma/Canva đã duyệt và mockup xuất.
- Bảng kiểm kê màn hình cuối cùng đã duyệt.
- Link Trello/Jira/Notion hoặc GitHub Projects.
- Link repository GitHub, các PR và ghi nhận review.
- Danh sách video OBS theo từng màn hình và sinh viên.
- Báo cáo sử dụng AI: công cụ/prompt, phần sinh ra, phần sinh viên chỉnh sửa, cách kiểm chứng và điều đã học.

README không tự khai báo các minh chứng này là đã hoàn thành nếu link/tài liệu chưa có trong repository.

## 12. Giới hạn và an toàn dữ liệu

- Xác thực chỉ phục vụ demo Frontend; tài khoản đăng ký và phiên lưu trong browser storage, không có backend xác minh danh tính.
- Không dùng mật khẩu thật hoặc tài khoản này cho hệ thống thật. Mật khẩu demo phía trình duyệt **không phải cơ chế bảo mật**.
- Không có thanh toán thật, giao dịch tiền hoặc đồng bộ đơn đặt với sân.
- Các AI Skill Match, Team Balancer và No-show Risk là mô phỏng; không phải dự đoán được huấn luyện hoặc dịch vụ AI đảm bảo độ chính xác.
- Dữ liệu có thể được lưu ở LocalStorage/SessionStorage hoặc dựng từ mock data; xóa dữ liệu trình duyệt có thể làm mất trạng thái demo.
- Một số tài nguyên bên ngoài cần Internet; nội dung và ảnh minh họa chỉ phục vụ nguyên mẫu học tập.

---

**Tài liệu tham chiếu khi biên soạn README:** đề cương BTL-28 CourtConnect và tài liệu “Hướng dẫn thực hiện Bài tập lớn” của học phần CSE122. README mô tả cấu trúc repository hiện có và giữ tách biệt yêu cầu hướng dẫn với tính năng đã được xác minh trong mã nguồn.
