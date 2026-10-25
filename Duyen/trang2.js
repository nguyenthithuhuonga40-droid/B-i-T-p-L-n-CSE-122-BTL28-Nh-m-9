document.addEventListener("DOMContentLoaded", () => {
    // === 1. KHAI BÁO CÁC BIẾN VÀ PHẦN TỬ DOM ===
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

    // Biến lưu trữ trạng thái hiện tại (Mặc định theo HTML ban đầu)
    let ngaySelected = "10/10/2026";
    let thuSelected = "Thứ bảy";
    let khungGioSelected = "16:00–18:00";
    let donGiaHienTai = GIA_SAU_16H;
    let thoiGianChoi = 2; 

    if (nutLuuSan) {
        nutLuuSan.innerHTML = "🤍 Lưu sân";
    }

    if (nutLuuSan) {
        let daLuu = false; 
        
        nutLuuSan.addEventListener("click", () => {
            daLuu = !daLuu; // Đảo trạng thái đúng/sai mỗi khi click

            if (daLuu) {
                nutLuuSan.innerHTML = "❤️ Đã lưu sân";
                alert("Đã thêm Tây Hồ Sports vào danh sách sân yêu thích của bạn!");
            } else {
                nutLuuSan.innerHTML = "🤍 Lưu sân";
                alert("Đã xóa sân khỏi danh sách yêu thích.");
            }
        });
    }

    // === 3. XỬ LÝ SỰ KIỆN CHỌN NGÀY ===
    oNgayButtons.forEach(button => {
        button.addEventListener("click", () => {
            document.querySelector(".o-ngay.kich-hoat")?.classList.remove("kich-hoat");
            button.classList.add("kich-hoat");

            const ngayThang = button.textContent.trim();
            ngaySelected = `${ngayThang}/2026`;
            
            if (ngayThang === "10/10") thuSelected = "Thứ bảy";
            else if (ngayThang === "11/10") thuSelected = "Chủ nhật";
            else if (ngayThang === "12/10") thuSelected = "Thứ hai";

            hienThiNgayDaChon.textContent = `${thuSelected} • ${ngaySelected}`;
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
        hienThiTongTien.textContent = tongTien.toLocaleString("vi-VN") + "đ";
        giaPhuHoa.textContent = `${thoiGianChoi} giờ × ${donGiaHienTai.toLocaleString("vi-VN")}đ - Giá minh họa`;
    }

    // === 5. XỬ LÝ SỰ KIỆN NÚT ĐẶT SÂN ===
    nutXacNhanDat.addEventListener("click", () => {
        const sanSelected = chonSanSelect.value;
        const tongTienHienTai = hienThiTongTien.textContent;

        alert(`Bạn đang tiến hành đặt sân với thông tin sau:
- Sân: ${sanSelected}
- Ngày chơi: ${thuSelected}, ${ngaySelected}
- Khung giờ: ${khungGioSelected} (${thoiGianChoi} tiếng)
- Tổng tiền sân: ${tongTienHienTai}`);
    });
});