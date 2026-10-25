# Bai Tap Lon CSE-122-BTL28-Nhóm 9
Court Connect
P4. Thiếu công cụ cho Điều phối viên: Các CLB thể thao thiếu công cụ sắp xếp đội hình (Lineup) và chia đội cân bằng cho các giải đấu/buổi giao lưu.🎯 2. Mục tiêu sản phẩmO1. Trải nghiệm người dùng thông suốt: Chuyển hóa bài toán thể thao thành sản phẩm Web Frontend hoàn chỉnh với luồng hành trình từ Khám phá ➔ Đặt lịch / Ghép trận ➔ Phản hồi / Đánh giá.O2. Đáp ứng chuẩn nghiệp vụ: Xây dựng đầy đủ các màn hình theo từng vai trò (tối thiểu 3 màn hình/vai trò, ưu tiên độ đầy đủ nghiệp vụ hơn số lượng hình thức).O3. Quản lý dữ liệu & Trạng thái (CRUD): Thực thi đầy đủ vòng đời dữ liệu (Tạo, Đọc, Sửa, Hủy/Đóng/Lưu trữ) và bao phủ các trạng thái UI (Đang tải, Rỗng, Lỗi, Thành công).O4. Tích hợp AI có giải thích: Mô phỏng 3 tính năng AI thiết thực giúp giải quyết bài toán ghép trận, chia đội và dự báo rủi ro no-show.O5. Quy chuẩn kỹ thuật: HTML5 Semantic, CSS Responsive, JavaScript ES6 DOM Manipulation, Git Flow và quản lý công việc trên Trello.👥 3. Các Vai trò & Phân công trách nhiệmHệ thống được thiết kế dành cho 4 nhóm người dùng chính, kết hợp phân công trách nhiệm chéo nhằm đảm bảo tính toàn vẹn của ứng dụng:                  ┌─────────────────────────────────────────┐
                  │          COURTCONNECT SYSTEM            │
                  └────────────────────┬────────────────────┘
                                       │
      ┌────────────────┬───────────────┴───────────────┬────────────────┐
      ▼                ▼                               ▼                ▼
┌───────────┐    ┌───────────┐                   ┌───────────┐    ┌───────────┐
│ Người chơi│    │  Chủ sân  │                   │Điều phối  │    │ Quản trị  │
│ (Player)  │    │  (Venue)  │                   │   CLB     │    │  (Admin)  │
└─────┬─────┘    └─────┬─────┘                   └─────┬─────┘    └─────┬─────┘
      │                │                               │                │
     SV1              SV2                             SV3              SV3
Vai tròMô tả nhiệm vụSinh viên phụ tráchTrách nhiệm chéo toàn dự ánNgười chơi (Player)Tìm sân/trận, đăng ký ghép trận, quản lý lịch cá nhân.SV1Design System, UI Components & Responsive LayoutChủ sân (Venue Owner)Cấu hình sân, mở slot, quản lý đơn đặt và doanh thu.SV2JavaScript Core, Mock API Data & AI InteractivityĐiều phối CLB (Organizer)Tạo sự kiện, quản lý danh sách VĐV, xếp lineup thi đấu.SV3Git Integration, Dashboard Layout & Quality ControlQuản trị viên (Admin)Quản lý danh mục thể thao, duyệt người dùng, báo cáo.SV3Chuẩn hóa mã nguồn & Deployment🔄 4. Luồng Người Dùng Tổng Quát (User Flow)[Khách / Người dùng] 
       │
       ▼
 🔓 Đăng nhập / Chọn Vai trò
       │
       ├───────────────────────────────┬───────────────────────────────┐
       ▼                               ▼                               ▼
 [1. NGƯỜI CHƠI]                 [2. CHỦ SÂN]                   [3. ĐIỀU PHỐI CLB]
 ├─ Tìm sân / Trận mở           ├─ Tạo slot trống               ├─ Lên danh sách VĐV
 ├─ Đăng ký ghép trận           ├─ Xác nhận/Hủy booking         ├─ Xếp đội hình (Lineup)
 └─ Dùng AI Skill Match         └─ Dùng AI No-show Risk         └─ Dùng AI Team Balancer
       │                               │                               │
       └───────────────────────────────┼───────────────────────────────┘
                                       ▼
                       [4. XỬ LÝ & ĐỒNG BỘ TRẠNG THÁI]
                                       │
                                       ▼
                     📊 Dashboard Báo cáo & Cập nhật Dữ liệu
📋 5. Bảng Kiểm Kê Màn Hình (Screen Inventory)Danh sách các màn hình nền tảng chính thức của hệ thống CourtConnect:#Vai tròTệp HTML (role-function-action.html)Tên màn hìnhThao tác CRUD / Trạng tháiTính năng AIPhụ trách1Người chơiplayer-court-search.htmlTìm kiếm sân & trậnR (Đang tải, Rỗng, Thành công)Đề xuất sân gần nhấtSV12Người chơiplayer-open-matches.htmlTrận đấu mở & Ghép cặpC / R / U (Đã đặt, Đầy slot)AI-1: Skill MatchSV13Người chơiplayer-my-sports.htmlLịch thể thao cá nhânR / U / D (Sắp tới, Đã hủy)–SV14Chủ sânvenue-court-management.htmlQuản lý danh sách sânR / U (Hoạt động, Bảo trì)–SV25Chủ sânvenue-slot-management.htmlQuản lý khung giờ (Slot)C / R / U (Trống, Đã khóa)Gợi ý giá slot linh hoạtSV26Chủ sânvenue-booking-management.htmlQuản lý đơn đặt sânC / R / U / D (Duyệt, Hủy đơn)AI-3: No-show RiskSV27Điều phốiorganizer-event-management.htmlQuản lý giải đấu / Sự kiệnR / U (Đang mở, Đóng)–SV38Điều phốiorganizer-player-roster.htmlDanh sách VĐV tham giaC / R / U (Đủ trình độ, Chờ)–SV39Điều phốiorganizer-team-lineup.htmlXếp đội hình thi đấuC / R / U / D (Lưu lineup)AI-2: Team BalancerSV310Quản trịadmin-sport-management.htmlQuản lý danh mục thể thaoR / U (Kích hoạt, Ẩn)–SV311Quản trịadmin-user-management.htmlQuản lý tài khoản người dùngC / R / U (Khóa, Mở khóa)–SV312Quản trịadmin-sports-report.htmlBáo cáo & Thống kê hệ thốngC / R / U / D (Xem biểu đồ)Dự báo xu hướngSV3🤖 6. Các Tính Năng & Trải Nghiệm AI (AI Products)Hệ thống tích hợp 3 trải nghiệm AI mô phỏng phía Frontend tuân thủ đầy đủ luồng tương tác chuẩn:NGƯỜI DÙNG NHẬP DỮ LIỆU ➔ KIỂM TRA HỢP LỆ ➔ ĐANG XỬ LÝ (SKELETON/LOADING) 
➔ HIỂN THỊ KẾT QUẢ AI ➔ GIẢI THÍCH LÝ DO (EXPLANABILITY) ➔ NGƯỜI DÙNG DUYỆT (CHẤP NHẬN / SỬA / HỦY)
🧠 AI-1: Skill Match (Ghép người chơi theo trình độ & lịch rảnh)Vị trí: Trang player-open-matches.htmlMô tả: Đề xuất danh sách trận đấu mở có chỉ số phù hợp nhất với trình độ kỹ năng (NTRP/DUPR) và khung giờ rảnh của người chơi.Khả năng giải thích: Hiển thị tỉ lệ % tương thích (VD: Match 95% – Cùng trình độ Khá (3.5), thời gian di chuyển < 15 phút).Xử lý ngoại lệ (Fallback): Khi dữ liệu rỗng ➔ "Chưa tìm thấy trận phù hợp 100%, bạn có muốn mở rộng bán kính tìm kiếm?"⚖️ AI-2: Team Balancer (Chia đội hình cân bằng lực lượng)Vị trí: Trang organizer-team-lineup.htmlMô tả: Tự động phân chia danh sách VĐV thành 2 đội (Đội Xanh / Đội Đỏ) sao cho tổng điểm trình độ và kinh nghiệm là tương đương nhất.Khả năng giải thích: Cung cấp thông số so sánh lực lượng (Chỉ số tấn công, phòng thủ, kinh nghiệm thi đấu).Quyền người dùng: Cho phép kéo-thả (Drag & Drop) để điều chỉnh thủ công sau khi AI gợi ý.⚠️ AI-3: No-show Risk Warning (Cảnh báo rủi ro bùng lịch)Vị trí: Trang venue-booking-management.htmlMô tả: Phân tích lịch sử đặt sân và điểm uy tín của người đặt để cảnh báo cho Chủ sân các đơn có rủi ro bỏ trận cao.Khả năng giải thích: Hiển thị nhãn rủi ro (Cảnh báo rủi ro 70%: Tài khoản mới tạo, chưa thanh toán đặt cọc).Hành động đề xuất: Nhắc chủ sân gửi thông báo yêu cầu xác nhận cọc qua tin nhắn.🛠️ 7. Công Nghệ Sử DụngFrontend: HTML5 (Semantic), CSS3 (Flexbox, Grid), Tailwind CSS Framework.JavaScript: ES6+, DOM Manipulation, Event Handling, Dynamic Rendering.Dữ liệu giả lập: JSON format, localStorage / sessionStorage, Mock API.Quản lý dự án: Trello (Quy trình Kanban 5 cột).Quản lý mã nguồn: Git, GitHub (Git Flow: main, dev, feature/*).Minh chứng: OBS Studio (Video quay lại quá trình làm việc và giải thích code).📁 8. Cấu Trúc Kho Mã Nguồn (Directory Structure)cse122-courtconnect-teamXX/
├── README.md                          # Tài liệu hướng dẫn chính
├── docs/                              # Tài liệu dự án
│   ├── project-proposal.md            # Đề xuất dự án & Ngữ cảnh
│   ├── roles-and-features.md          # Phân tích Vai trò & Tính năng
│   ├── screen-inventory.md            # Bảng kiểm kê màn hình
│   ├── team-assignment.md             # Phân công nhiệm vụ nhóm
│   ├── ai-usage-report.md             # Báo cáo chi tiết việc sử dụng AI
│   └── obs-evidence.md                # Tổng hợp link Video OBS
├── design/                            # Thiết kế UI/UX
│   ├── figma-link.txt                 # Đường dẫn bản thiết kế Figma/Canva
│   └── mockups/                       # Ảnh chụp bản thiết kế Figma
├── pages/                             # Toàn bộ tệp giao diện HTML
│   ├── index.html                     # Trang chủ Landing Page
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
├── assets/                            # Tài nguyên dự án
│   ├── images/                        # Hình ảnh sản phẩm
│   ├── icons/                         # Biểu tượng
│   └── data/                          # Các tệp JSON mock data (courts.json, matches.json,...)
├── css/                               # Tệp định dạng CSS
│   ├── style.css                      # CSS tùy chỉnh chính
│   └── responsive.css                 # CSS cấu hình responsive
└── js/                                # Mã nguồn JavaScript
    ├── main.js                        # Xử lý giao diện chung
    ├── api.js                         # Mô phỏng gọi API / LocalStorage
    └── modules/                       # Các mô-đun xử lý (ai-engine.js, validation.js)
🔀 9. Quy Trình Git & Quản Lý Công Việc9.1. Quy trình Git FlowMọi thành viên tuân thủ nghiêm ngặt quy trình làm việc nhánh (Branching & Pull Request):  main  ─────────────────────────────────────────────────────────► [STABLE RELEASE]
           ▲                                                 ▲
           │ (Merge Release)                                 │ (Merge Release)
   dev  ───┴─────────────────┬───────────────────────────────┴───► [INTEGRATION]
                             │                 ▲
                             │ (Git Checkout)  │ (Pull Request & Code Review)
feature/player-search ───────┴─────────────────┘
Mẫu tên Commit chuẩn:feat: add player court search responsive pagefix: validate empty input form in booking slotstyle: adjust lime accent color for sports vibedocs: update screen inventory table and obs links(Tuyệt đối không sử dụng commit ngắn vô nghĩa như: update, done, fix code).9.2. Bảng quản lý TrelloBảng Trello dự án duy trì 5 cột chuẩn:TỒN ĐỌNG ➔ CẦN LÀM ➔ ĐANG LÀM ➔ CHỜ DUYỆT (PR) ➔ HOÀN THÀNH🎥 10. Minh Chứng Quá Trình Làm Việc (OBS Evidence)Mỗi màn hình giao diện đã hoàn thành tương ứng với 01 Video OBS minh chứng gồm mặt sinh viên, giọng nói giải thích mã nguồn và thao tác commit trực tiếp.Mã TaskMàn hình giao diệnSinh viên thực hiệnNhánh GitMã CommitLink Video OBSTASK-01player-court-search.htmlSV1feature/player-court-searcha1b2c3dXem Video SV1-01TASK-02player-open-matches.htmlSV1feature/player-open-matchesb2c3d4eXem Video SV1-02TASK-03player-my-sports.htmlSV1feature/player-my-sportsc3d4e5fXem Video SV1-03TASK-04venue-court-management.htmlSV2feature/venue-court-managementd4e5f6aXem Video SV2-01TASK-05venue-slot-management.htmlSV2feature/venue-slot-managemente5f6a7bXem Video SV2-02TASK-06venue-booking-management.htmlSV2feature/venue-booking-managementf6a7b8cXem Video SV2-03TASK-07organizer-event-management.htmlSV3feature/organizer-event-mgmtg7h8i9jXem Video SV3-01TASK-08organizer-player-roster.htmlSV3feature/organizer-player-rosterh8i9j0kXem Video SV3-02TASK-09organizer-team-lineup.htmlSV3feature/organizer-team-lineupi9j0k1lXem Video SV3-03TASK-10admin-sport-management.htmlSV3feature/admin-sport-mgmtj0k1l2mXem Video SV3-04TASK-11admin-user-management.htmlSV3feature/admin-user-mgmtk1l2m3nXem Video SV3-05TASK-12admin-sports-report.htmlSV3feature/admin-sports-reportl2m3n4oXem Video SV3-06🤖 11. Báo Cáo Sử Dụng Trợ Lý AI (AI Usage Declaration)Nhóm cam kết sử dụng các công cụ AI (ChatGPT, Claude, Gemini, Cursor) làm công cụ hỗ trợ tăng tốc công việc và có khai báo minh bạch:Công cụ đã sử dụng: ChatGPT / Claude 3.5 Sonnet / Gemini.Mục đích: Gợi ý cấu trúc HTML Semantic, sinh dữ liệu JSON giả lập (Mock data) và hỗ trợ tối ưu hóa thuật toán chia đội ngẫu nhiên.Quy trình kiểm chứng:Sinh viên viết Prompt đưa ra yêu cầu cụ thể.Đọc hiểu mã do AI tạo ra.Tiến hành refactor, sửa đổi lớp CSS Tailwind để tương thích giao diện chung.Test trực tiếp các sự kiện DOM và kiểm tra trên DevTools trước khi commit.🚀 12. Hướng Dẫn Chạy Dự Án (Getting Started)Sao chép kho mã nguồn:git clone https://github.com/cse122-team/cse122-courtconnect-teamXX.git
cd cse122-courtconnect-teamXX
Mở dự án:Không cần cài đặt node_modules hoặc máy chủ phức tạp.Sử dụng extension Live Server trên VS Code và mở tệp pages/index.html.Hoặc nhấp đúp trực tiếp vào tệp pages/index.html trên trình duyệt web bất kỳ.© 2026 CourtConnect Project – Bộ môn Công nghệ Phần mềm, Khoa CNTT, Trường Đại học Thủy lợi.
