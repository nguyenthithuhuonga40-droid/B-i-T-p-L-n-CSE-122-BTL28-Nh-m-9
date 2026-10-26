# 🏸 CourtConnect – Hệ Thống Đặt Sân & Ghép Người Chơi Theo Trình Độ

> **Học phần:** PHÁT TRIỂN ỨNG DỤNG WEB CƠ BẢN – CSE122  
> **Trường:** Đại học Thủy lợi (TLU) – Khoa Công nghệ Thông tin  
> **Năm học:** 2026 – 2027  
> **Nhóm thực hiện:** 3 sinh viên  
> **Đề tài:** BTL-28 (Lĩnh vực: Thể thao / SportsTech)

---

## 📋 MỤC LỤC
1. [Ngữ Cảnh & Phát Biểu Vấn Đề](#1-ngữ-cảnh--phát-biểu-vấn-đề)
2. [Mục Tiêu Dự Án](#2-mục-tiêu-dự-án)
3. [Phân Tích Vai Trò Người Dùng](#3-phân-tích-vai-trò-người-dùng)
4. [Bảng Kiểm Kê Màn Hình (Screen Inventory)](#4-bảng-kiểm-kê-màn-hình-screen-inventory)
5. [Trải Nghiệm & Tính Năng AI](#5-trải-nghiệm--tính-năng-ai)
6. [Cấu Trúc Kho Mã Nguồn](#6-cấu-trúc-kho-mã-nguồn)
7. [Phân Công Nhiệm Vụ & Lát Cắt Dọc](#7-phân-công-nhiệm-vụ--lát-cắt-dọc)
8. [Quy Trình Quản Lý & Git Workflow](#8-quy-trình-quản-lý--git-workflow)
9. [Minh Chứng Video OBS](#9-minh-chứng-video-obs)
10. [Khai Báo Sử Dụng AI](#10-khai-báo-sử-dụng-ai)

---

## 1. 📌 NGỮ CẢNH & PHÁT BIỂU VẤN ĐỀ

### 1.1. Ngữ cảnh
Các môn thể thao đối kháng và đồng đội như **Pickleball, Cầu lông** đang phát triển bùng nổ. Tuy nhiên, việc duy trì lịch chơi đều đặn đòi hỏi phải có đủ bạn chơi cùng trình độ và tìm được sân trống phù hợp theo thời gian thực. Hiện tại, các thao tác này chủ yếu diễn ra tự phát trên nhiều nhóm mạng xã hội/ngăn tin rời rạc.

### 1.2. Phát biểu vấn đề
* **P1. Lệch trình độ:** Người chơi khó tìm được đối thủ hoặc đồng đội có trình độ tương đương (Newbie, Intermediate, Advanced), dẫn đến trải nghiệm trận đấu không tốt.
* **P2. Rời rạc thông tin:** Lịch trống của chủ sân và lịch rảnh của người chơi không khớp nhau, mất nhiều thời gian trao đổi.
* **P3. Quản lý thủ công:** Chủ sân khó theo dõi, lấp đầy các khung giờ trống (off-peak slot) và xử lý tình trạng đặt rồi bỏ (No-show).
* **P4. Vận hành CLB phức tạp:** Ban điều phối CLB gặp khó khăn trong việc chia đội hình (lineup) cân sức cho các giải đấu/buổi giao lưu.

---

## 2. 🎯 MỤC TIÊU DỰ ÁN

* **O1. Trải nghiệm người dùng:** Biến bài toán thực tế thành một sản phẩm Web Frontend hoàn chỉnh với hành trình người dùng liền mạch.
* **O2. Đa vai trò:** Xây dựng đầy đủ hệ thống giao diện cho **4 vai trò người dùng**, bảo đảm tính nghiệp vụ chân thật.
* **O3. Nghiệp vụ & Trạng thái:** Thể hiện rõ vòng đời dữ liệu (CRUD nghiệp vụ: *Tạo ➔ Đang chờ ➔ Đã duyệt ➔ Đã hủy/Lưu trữ*) và bao phủ các trạng thái UI (*Normal, Loading, Empty, Error*).
* **O4. Công nghệ Frontend:** Áp dụng HTML5 semantic, CSS3 (Flexbox/Grid, Responsive), JavaScript ES6 (DOM, Event, Validation, LocalStorage/Fetch API).
* **O5. Trải nghiệm AI hữu ích:** Mô phỏng 3 tính năng AI thực tế tác động trực tiếp vào quyết định người dùng.
* **O6. Quy trình chuyên nghiệp:** Quản lý tiến độ bằng Trello, quản lý mã nguồn bằng Git/GitHub (Branch, PR, Code Review) và minh chứng kỹ năng qua video OBS.

---

## 3. 👥 PHÂN TÍCH VAI TRÒ NGƯỜI DÙNG

Hệ thống phân chia rõ ràng 4 vai trò tác động tương tác lẫn nhau:

| Vai trò | Biểu tượng | Mô tả người dùng | Mục tiêu chính |
|---|:---:|---|---|
| **Người chơi** *(Player)* | 🏸 | Người thích chơi Pickleball/Cầu lông cá nhân hoặc nhóm nhỏ | Tìm sân trống, tham gia trận mở, ghép đội chuẩn trình độ |
| **Chủ sân** *(Venue Owner)* | 🏟️ | Đơn vị sở hữu/quản lý cụm sân thể thao | Đăng tải cụm sân, quản lý slot, duyệt lịch đặt, tối ưu doanh thu |
| **Điều phối CLB** *(Organizer)* | 🏆 | Ban quản lý CLB thể thao, người tổ chức giao lưu/giải đấu | Tạo sự kiện, quản lý danh sách thành viên, xếp lineup thi đấu |
| **Quản trị viên** *(Admin)* | 🛡️ | Quản trị hệ thống CourtConnect | Quản lý danh mục bộ môn, duyệt người dùng, báo cáo tổng quan |

---

## 4. 📐 BẢNG KIỂM KÊ MÀN HÌNH (SCREEN INVENTORY)

Bảng kiểm kê màn hình chính thức được duyệt gồm 12 màn hình nền tảng nghiệp vụ (không bao gồm các màn hình dùng chung):

| # | Vai trò | Tên màn hình | Tệp HTML (`role-function-action.html`) | Thao tác CRUD / Nghiệp vụ | Tính năng AI hỗ trợ | SV Phụ trách |
|---|---|---|---|---|---|:---:|
| 1 | **Người chơi** | Tìm kiếm sân | `player-court-search.html` | Read (Tìm kiếm, lọc sân) | Gợi ý sân gần & phù hợp | **SV1** |
| 2 | **Người chơi** | Trận đấu mở | `player-open-matches.html` | Create / Read / Update (Ghép trận) | **AI-1: Skill Match** | **SV1** |
| 3 | **Người chơi** | Thể thao của tôi | `player-my-sports.html` | Read / Update / Cancel (Quản lý lịch) | - | **SV1** |
| 4 | **Chủ sân** | Quản lý cụm sân | `venue-court-management.html` | Create / Read / Update / Archive | - | **SV2** |
| 5 | **Chủ sân** | Quản lý Slot | `venue-slot-management.html` | Create / Read / Update (Giá/Giờ) | Gợi ý giá giờ thấp điểm | **SV2** |
| 6 | **Chủ sân** | Quản lý Lịch đặt | `venue-booking-management.html` | Read / Approve / Reject | **AI-3: No-show Risk** | **SV2** |
| 7 | **Điều phối** | Quản lý Sự kiện | `organizer-event-management.html` | Create / Read / Update / Close | - | **SV3** |
| 8 | **Điều phối** | Danh sách VĐV | `organizer-player-roster.html` | Read / Update (Xếp hạng/Trình độ) | - | **SV3** |
| 9 | **Điều phối** | Xếp Đội hình | `organizer-team-lineup.html` | Create / Read / Update (Cân bằng) | **AI-2: Team Balancer** | **SV3** |
| 10 | **Quản trị** | Quản lý Bộ môn | `admin-sport-management.html` | Create / Read / Update / Disable | - | **SV3** |
| 11 | **Quản trị** | Quản lý Người dùng | `admin-user-management.html` | Read / Update Status / Lock | - | **SV3** |
| 12 | **Quản trị** | Báo cáo Thể thao | `admin-sports-report.html` | Read (Thống kê & Biểu đồ) | Dự báo xu hướng đặt sân | **SV3** |

*Lưu ý: Các màn hình dùng chung bao gồm `index.html` (Trang chủ), `login.html`, `register.html`, `404.html`.*

---

## 5. 🤖 TRẢI NGHIỆM & TÍNH NĂNG AI

Mỗi tính năng AI trên CourtConnect đều tuân thủ **Quy trình tương tác chuẩn**:  
`Người dùng nhập ➔ Kiểm tra hợp lệ ➔ AI đang xử lý (Loading/Skeleton) ➔ Kết quả AI ➔ Giải thích lý do ➔ Người dùng Chấp nhận/Sửa/Từ chối ➔ Lưu vào ứng dụng`.

```text
[Nhập Dữ Liệu] ──> [Đang Xử Lý AI...] ──> [Hiển Thị Kết Quả + Lý Do] ──> [Người Dùng Duyệt/Chỉnh Sửa]
cse122-courtconnect-team05/
├── index.html                       # Trang chủ ứng dụng (Landing page)
├── README.md                        # Báo cáo tổng quan dự án
├── docs/                            # Tài liệu phân tích & Báo cáo
│   ├── project-proposal.md          # Đề xuất dự án & Ngữ cảnh
│   ├── roles-and-features.md        # Chi tiết vai trò & Tính năng
│   ├── screen-inventory.md          # Bảng kiểm kê màn hình
│   ├── team-assignment.md           # Phân công công việc nhóm
│   ├── ai-usage-report.md           # Báo cáo minh bạch sử dụng AI
│   └── obs-evidence.md              # Tổng hợp liên kết Video OBS
├── design/                          # Thiết kế UI/UX
│   ├── figma-link.txt               # Link dự án Figma chính thức
│   └── mockups/                     # Ảnh chụp các màn hình UI
├── pages/                           # Các màn hình nghiệp vụ
│   ├── player-court-search.html
│   ├── player-open-matches.html
│   ├── player-my-sports.html
│   ├── venue-court-management.html
│   ├── venue-slot-management.html
│   ├── venue-booking-management.html
│   ├── organizer-event-management.html
│   ├── organizer-player-roster.html
│   ├── organizer-team-lineup.html
│   ├── admin-sport-management.html
│   ├── admin-user-management.html
│   └── admin-sports-report.html
├── assets/                          # Tài nguyên tĩnh
│   ├── images/                      # Hình ảnh sân, avatar, banner
│   ├── icons/                       # Biểu tượng SVG
│   └── data/                        # Dữ liệu Mock JSON (courts.json, matches.json,...)
├── css/                             # Mã nguồn Stylesheet
│   ├── style.css                    # CSS dùng chung & Theme
│   └── responsive.css               # CSS Responsive (Desktop/Tablet/Mobile)
└── js/                              # Mã nguồn JavaScript
    ├── main.js                      # Tương tác giao diện chung & Navigation
    ├── api.js                       # Xử lý Fetch Mock Data / LocalStorage
    └── modules/                     # Các mô-đun chức năng (Validation, AI logic,...)
7.
┌────────────────────────────────────────────────────────┐
       │                 LÁT CẮT DỌC SINH VIÊN                  │
       └────────────────────────────────────────────────────────┘
  Figma ──> HTML ──> CSS ──> JS ──> Data ──> Git/PR ──> Video OBS
