document.addEventListener("DOMContentLoaded", () => {
    const oNgayButtons = document.querySelectorAll(".o-ngay");
    const hienThiNgayDaChon = document.querySelector(".ngay-da-chon");
    const nutGioButtons = document.querySelectorAll(".nut-gio");
    const hienThiTongTien = document.getElementById("hien-thi-tong-tien");
    const giaPhuHoa = document.querySelector(".gia-phu-hoa");
    const nutXacNhanDat = document.getElementById("nut-xac-nhan-dat");
    const chonSanSelect = document.getElementById("chon-san");
    const nutLuuSan = document.querySelector(".nut-luu-san");

    // Định nghĩa giá tiền theo khung giờ
    const GIA_TRUOC_16H = 150000;
    const GIA_SAU_16H = 180000;

    // Biến lưu trữ trạng thái đơn hàng (sẽ cập nhật tự động bằng thời gian thực bên dưới)
    let ngaySelected = "";
    let thuSelected = "";
    let khungGioSelected = "16:00–18:00";
    let donGiaHienTai = GIA_SAU_16H;
    let thoiGianChoi = 2; 

    // Mảng chứa tên các thứ trong tuần bằng tiếng Việt
    const TEN_THU = ["Chủ nhật", "Thứ hai", "Thứ ba", "Thứ tư", "Thứ năm", "Thứ sáu", "Thứ bảy"];

    // === 2. TỰ ĐỘNG CẬP NHẬT NGÀY TRÊN MÁY TÍNH VÀO KHUNG CHỌN ===
    function khoiTaoNgayHeThong() {
        const homNay = new Date();

        oNgayButtons.forEach((button, chiSo) => {
            // Tính toán ngày tịnh tiến: mục 1 là hôm nay (chiSo=0), mục 2 là ngày mai (chiSo=1)...
            const ngayTinhToan = new Date();
            ngayTinhToan.setDate(homNay.getDate() + chiSo);

            const ngay = String(ngayTinhToan.getDate()).padStart(2, '0');
            const thang = String(ngayTinhToan.getMonth() + 1).padStart(2, '0');
            const nam = ngayTinhToan.getFullYear();
            const thu = TEN_THU[ngayTinhToan.getDay()];

            // Thay đổi chữ hiển thị trên 3 nút chọn ngày (Ví dụ: 25/10)
            button.textContent = `${ngay}/${thang}`;
            
            // Lưu lại thông tin ngày vào thuộc tính ẩn để JS dễ đọc khi click
            button.setAttribute("data-ngay-day-du", `${ngay}/${thang}/${nam}`);
            button.setAttribute("data-thu", thu);

            // Đặt mặc định chọn nút ngày đầu tiên (Ngày hôm nay)
            if (chiSo === 0) {
                button.classList.add("kich-hoat");
                ngaySelected = `${ngay}/${thang}/${nam}`;
                thuSelected = thu;
                if (hienThiNgayDaChon) {
                    hienThiNgayDaChon.textContent = `${thuSelected} • ${ngaySelected}`;
                }
            }
        });
    }
    
    // Chạy hàm khởi tạo ngày ngay khi tải trang
    khoiTaoNgayHeThong();

    // === 3. XỬ LÝ SỰ KIỆN CLICK CHỌN NGÀY ===
    oNgayButtons.forEach(button => {
        button.addEventListener("click", () => {
            document.querySelector(".o-ngay.kich-hoat")?.classList.remove("kich-hoat");
            button.classList.add("kich-hoat");

            // Lấy dữ liệu ngày thật máy tính đã lưu từ thuộc tính ẩn
            ngaySelected = button.getAttribute("data-ngay-day-du");
            thuSelected = button.getAttribute("data-thu");

            if (hienThiNgayDaChon) {
                hienThiNgayDaChon.textContent = `${thuSelected} • ${ngaySelected}`;
            }
        });
    });

    // === 4. XỬ LÝ SỰ KIỆN CHỌN KHUNG GIỜ VÀ TÍNH TIỀN ===
    nutGioButtons.forEach(button => {
        button.addEventListener("click", () => {
            if (button.classList.contains("bi-khoa")) return;

            document.querySelector(".nut-gio.kich-hoat")?.classList.remove("kich-hoat");
            button.classList.add("kich-hoat");

            khungGioSelected = button.textContent.trim();
            thoiGianChoi = parseInt(button.getAttribute("data-gio")) || 2;

            const gioBatDau = parseInt(khungGioSelected.split(":"));
            
            if (gioBatDau < 16) {
                donGiaHienTai = GIA_TRUOC_16H;
            } else {
                donGiaHienTai = GIA_SAU_16H;
            }

            tinhVaCapNhatTien();
        });
    });

    function tinhVaCapNhatTien() {
        const tongTien = thoiGianChoi * donGiaHienTai;
        if (hienThiTongTien) hienThiTongTien.textContent = tongTien.toLocaleString("vi-VN") + "đ";
        if (giaPhuHoa) giaPhuHoa.textContent = `${thoiGianChoi} giờ × ${donGiaHienTai.toLocaleString("vi-VN")}đ - Giá minh họa`;
    }

    // Nút Lưu Sân Yêu Thích
    if (nutLuuSan) {
        nutLuuSan.innerHTML = "🤍 Lưu sân";
        let daLuu = false; 
        nutLuuSan.addEventListener("click", () => {
            daLuu = !daLuu;
            if (daLuu) {
                nutLuuSan.innerHTML = "❤️ Đã lưu sân";
                alert("Đã thêm Tây Hồ Sports vào danh sách sân yêu thích của bạn!");
            } else {
                nutLuuSan.innerHTML = "🤍 Lưu sân";
                alert("Đã xóa sân khỏi danh sách yêu thích.");
            }
        });
    }

    // === 5. XỬ LÝ SỰ KIỆN NÚT ĐẶT SÂN VÀ HIỆN HÓA ĐƠN ===
    const hopThoai = document.getElementById("hop-thoai-thanh-toan");
    const nutDongHopThoai = document.getElementById("nut-dong-hop-thoai");
    const nutHoanTatDon = document.getElementById("nut-hoan-tat-don");
    
    const kqSan = document.getElementById("kq-san");
    const kqNgay = document.getElementById("kq-ngay");
    const kqGio = document.getElementById("kq-gio");
    const kqTien = document.getElementById("kq-tien");

    if (nutXacNhanDat) {
        nutXacNhanDat.addEventListener("click", () => {
            nutXacNhanDat.disabled = true;
            const chuGoc = nutXacNhanDat.innerHTML;
            nutXacNhanDat.innerHTML = "⌛ Đang kiểm tra lịch sân...";

            setTimeout(() => {
                nutXacNhanDat.disabled = false;
                nutXacNhanDat.innerHTML = chuGoc;

                // Điền thông tin chuẩn ngày máy tính vào hóa đơn
                if (kqSan) kqSan.textContent = chonSanSelect ? chonSanSelect.value : "P01 - Ngoài trời";
                if (kqNgay) kqNgay.textContent = `${thuSelected} • ${ngaySelected}`;
                if (kqGio) kqGio.textContent = `${khungGioSelected} (${thoiGianChoi} giờ)`;
                if (kqTien) kqTien.textContent = hienThiTongTien ? hienThiTongTien.textContent : "360.000đ";

                // Hiển thị hộp thoại dạng flex
                if (hopThoai) hopThoai.style.display = "flex";
            }, 800);
        });
    }

    if (nutDongHopThoai) {
        nutDongHopThoai.addEventListener("click", () => {
            if (hopThoai) hopThoai.style.display = "none";
        });
    }

    if (hopThoai) {
        hopThoai.addEventListener("click", (e) => {
            if (e.target === hopThoai) {
                hopThoai.style.display = "none";
            }
        });
    }

    if (nutHoanTatDon) {
        nutHoanTatDon.addEventListener("click", () => {
            nutHoanTatDon.disabled = true;
            nutHoanTatDon.innerHTML = "Đang khởi tạo cổng thanh toán...";

            setTimeout(() => {
                alert("🎉 Đặt sân thành công!\nMã đơn đặt đã được gửi về tài khoản CourtConnect của bạn.");
                if (hopThoai) hopThoai.style.display = "none";
                nutHoanTatDon.disabled = false;
                nutHoanTatDon.innerHTML = "Thanh toán ngay";
            }, 1200);
        });
    }

    // === 6. SỬA ĐỒNG BỘ: BỔ SUNG LOGIC CHO HAI NÚT BẤM CỦA TRANG SAU QUAY LẠI MÀN HÌNH CHỌN GIỜ ===
    const nutChonLaiGio = document.getElementById("nut-chon-lai-gio");
    const nutTimSanKhac = document.getElementById("nut-tim-san-khac");
    const nutDoiKhungGio = document.getElementById("nut-doi-khung-gio"); // Nút "Đổi khung giờ" ở cột bên phải lịch hẹn

    // Hàm tiện ích hỗ trợ cuộn màn hình mượt mà xuống đúng khu vực chọn lịch
    function cuonXuongKhucChonGio() {
        // Nếu hộp thoại tóm tắt đơn đang mở, ẩn nó đi trước
        if (hopThoai) hopThoai.style.display = "none";

        // Tìm đến khu vực chọn giờ và tự động trượt xuống
        const khuVucDatSan = document.getElementById("khu-vuc-dat-san");
        if (khuVucDatSan) {
            khuVucDatSan.scrollIntoView({ behavior: "smooth" });
        }
    }

    // A. Khi click nút "Chọn lại giờ"
    if (nutChonLaiGio) {
        nutChonLaiGio.addEventListener("click", () => {
            cuonXuongKhucChonGio();

            // Tìm và hủy lựa chọn khung giờ cũ (vừa bị báo hết) để bắt người dùng bấm chọn lại giờ khác
            nutGioButtons.forEach(button => {
                if (button.textContent.trim() === khungGioSelected) {
                    button.classList.remove("kich-hoat");
                }
            });
        });
    }

    // B. Khi click nút "Đổi khung giờ" (cột bên phải biên nhận)
    if (nutDoiKhungGio) {
        nutDoiKhungGio.addEventListener("click", cuonXuongKhucChonGio);
    }

    // C. Khi click nút "Tìm sân khác"
    if (nutTimSanKhac) {
        nutTimSanKhac.addEventListener("click", () => {
            // Trở về trang chủ hệ thống chứa danh sách các địa điểm câu lạc bộ thể thao
            window.location.href = "index.html";
        });
    }
});
