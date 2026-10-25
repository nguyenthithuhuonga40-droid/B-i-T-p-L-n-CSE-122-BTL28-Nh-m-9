# CourtConnect - Hệ Thống Vận Hành & Quản Lý Sân Thể Thao (Phân hệ Chủ Sân)

<p align="center">
  <b>Giải pháp công nghệ điều phối lịch sân, quản lý đơn đặt, tối ưu vận hành tại quầy và dự báo rủi ro hỗ trợ chủ sân.</b>
</p>

---

## 📌 Giới thiệu hệ thống

**CourtConnect** là nền tảng quản lý vận hành chuyên nghiệp dành cho các cơ sở thể thao (Pickleball, Cầu lông, Tennis,...). Hệ thống phân hệ **Chủ sân (Tây Hồ Sports - Tuấn Phong)** cung cấp giao diện trực quan, khoa học, giúp tự động hóa quy trình quản lý lịch sân, tiếp nhận và duyệt đơn hàng, xử lý thủ tục check-in tại quầy và theo dõi dòng tiền minh bạch.

---

## 🖥️ Chi tiết các màn hình giao diện

Hệ thống bao gồm các màn hình chức năng chính được thiết kế đồng bộ theo chuẩn UI/UX hiện đại:

### 1. Tổng quan vận hành (`chusan_tongquan.html`)
* **Dashboard chỉ số cốt lõi:** Theo dõi nhanh số khung 2 giờ đã đặt (`16/32`), tỷ lệ lấp đầy sân (`50%`), số đơn chờ duyệt (`3 đơn`) và tổng doanh thu mô phỏng trong ngày (`5.22 triệu`).
* **Biểu đồ nhịp doanh thu:** Trực quan hóa doanh thu 7 ngày gần nhất bằng Chart.js canvas.
* **Ưu tiên trong ngày & Lịch tiếp theo:** Danh sách nhắc nhở các đơn cần duyệt gấp và bảng tổng hợp lịch khách đến sân tiếp theo.

### 2. Quản lý danh sách sân (`chusan_quanlysan.html`)
* **Danh mục sân bãi:** Quản lý chi tiết danh sách từng sân (P01 đến P05, P00) kèm loại sân, loại hình, tiện ích và mức giá giờ cao điểm (`180.000đ`).
* **Bộ lọc & Phân loại:** Tra cứu nhanh theo tên/mã sân, môn thể thao và trạng thái (`Đang hoạt động`, `Bảo trì`, `Đã lưu trữ`).
* **Biến thể Thêm/Sửa sân & Bảo trì:** Giao diện cập nhật thông tin sân, cấu hình đóng đặt mới để sửa chữa mặt sân mà không ảnh hưởng lịch sử đơn.

### 3. Điều phối Lịch & Khung giờ (`chusan_lichkhunggio.html`)
* **Ma trận lịch theo tuần:** Hiển thị trực quan trạng thái từng khung 2 giờ (từ 06:00 đến 22:00) cho toàn bộ các sân.
* **Nhận diện trạng thái mã màu:** Phân định rõ ràng các ô `Trống`, `Đã đặt`, `Đang chọn` và `Bị chặn / Bảo trì`.
* **Tương tác động & Tự động cảnh báo:** Cho phép nhấp chọn ô để xem chi tiết người đặt, thực hiện đổi lịch trực quan trên ma trận và tự động phát hiện xung đột khi thiết lập lịch lặp hàng tuần.

### 4. Xử lý Đơn đặt sân (`chusan_dondatsan.html`)
* **Quản lý danh sách đơn:** Tra cứu đơn theo mã (`CC-1010`, `CC-1011`,...), tên khách hàng, số điện thoại, ngày chơi, sân và bộ lọc trạng thái (`Tất cả`, `Chờ duyệt`, `Đã xác nhận`, `Hoàn thành`, `Đã hủy`).
* **Tính năng AI "No-show Risk":** Mô phỏng phân tích tỷ lệ rủi ro vắng mặt không báo trước dựa trên lịch sử đặt hẹn, giúp nhân viên đưa ra quyết định liên hệ xác nhận lại kịp thời.

### 5. Chi tiết đơn & Thao tác tại quầy (`chusan_chitietdon.html`)
* **Thông tin chi tiết & Audit Log:** Hiển thị đầy đủ thông tin người đặt, danh sách người chơi chung, chi tiết giá tiền sân và nhật ký xử lý theo mốc thời gian.
* **Bảng thao tác tại quầy:** Xác nhận khách đã nhận sân (Check-in), đánh dấu hoàn thành, đổi lịch/hủy đơn và duyệt/từ chối đơn chờ kèm lý do bắt buộc.

---

## 🛠️ Công nghệ & Thư viện sử dụng

* **Front-end:** HTML5, CSS3 (sử dụng CSS Variables, Flexbox, Grid Layout).
* **Phông chữ:** `Inter` (Google Fonts) – tối ưu hiển thị giao diện quản trị.
* **Icon Set:** Lucide Icons CDN.
* **JavaScript Engine:** Vanilla JS (DOM Manipulation, Event Handling, Modal Control & Dynamic Schedule Engine).

---

## 📂 Cấu trúc thư mục dự án

```text
├── chusan_tongquan.html        # Màn hình Tổng quan vận hành (Dashboard)
├── chusan_quanlysan.html       # Màn hình Quản lý danh sách sân & Bảo trì
├── chusan_lichkhunggio.html    # Màn hình Ma trận Lịch & Khung giờ
├── chusan_dondatsan.html       # Màn hình Quản lý Đơn đặt sân & No-show Risk
├── chusan_chitietdon.html      # Màn hình Chi tiết đơn & Thao tác tại quầy
├── chusan_tongquan.css         # Style chính & biến màu hệ thống
├── chusan_quanlysan.css        # Style giao diện Quản lý sân
├── chusan_lichkhunggio.css     # Style ma trận Lịch & Khung giờ
├── chusan_dondatsan.css        # Style bảng đơn hàng & Khối AI No-show Risk
├── chusan_chitietdon.css       # Style màn hình chi tiết đơn
├── chusan_lichkhunggio.js      # Script tương tác bảng lịch & đổi lịch
└── screen-inventory.md         # Bảng kiểm kê tiến độ màn hình
