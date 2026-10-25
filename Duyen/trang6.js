document.addEventListener("DOMContentLoaded", function () {
    
    // 1. Click các nút xem mã, đổi lịch, hủy đặt ở thẻ sắp tới
    document.querySelectorAll(".nut-hanh-dong-the").forEach(nut => {
        nut.addEventListener("click", function () {
            alert(`Hành động: [${this.innerText}] với mã đặt sân CC-1010.`);
        });
    });

    // 2. Bấm nút Xem trận dưới khung trận đang theo dõi
    const nutXemTran = document.querySelector(".the-tran-theo-doi .nut-den-nho");
    if (nutXemTran) {
        nutXemTran.addEventListener("click", function () {
            alert("[XEM CHI TIẾT TRẬN ĐẤU]\nTên trận: Đôi vui cuối tuần\nLịch chơi: 10/10 · 18:00–20:00 tại Tây Hồ Sports");
        });
    }

    // 3. Bấm nút Rút yêu cầu
    const nutRutYeuCau = document.querySelector(".nut-trang-nho");
    if (nutRutYeuCau) {
        nutRutYeuCau.addEventListener("click", function () {
            if (confirm("Bạn có chắc muốn rút lại yêu cầu tham gia trận đấu này?")) {
                alert("Đã rút yêu cầu thành công!");
            }
        });
    }

    // 4. Quản lý khối Sân Đã Lưu (Nút Bỏ lưu và nút Đặt lại)
    const nutBoLuuSan = document.querySelector(".nut-bo-luu");
    const nutDatLaiSan = document.querySelector(".nut-dat-lai-rieng");

    if (nutBoLuuSan) {
        nutBoLuuSan.addEventListener("click", function () {
            // CHỈ khóa và mờ nút Bỏ lưu, hình ảnh và nút Đặt lại vẫn giữ nguyên độ nét rõ ràng
            this.innerText = "Đã bỏ lưu";
            this.style.opacity = "0.4";
            this.style.pointerEvents = "none"; 
            alert("Đã xóa 'Tây Hồ Sports' khỏi danh sách yêu thích.");
        });
    }

    if (nutDatLaiSan) {
        nutDatLaiSan.addEventListener("click", function () {
            alert("Mô phỏng: Đang tiến hành đặt lại sân Tây Hồ Sports...");
        });
    }

    // 5. Điều hướng menu nhỏ và Bật Pop-up đè màn hình khi bấm "Sân đã lưu"
    const mucMenuNho = document.querySelectorAll(".thanh-menu-nho .muc-menu");
    const popupSanLuu = document.getElementById("popup-san-luu");
    const nutDongPopup = document.querySelector(".nut-dong-popup");

    mucMenuNho.forEach(muc => {
        muc.addEventListener("click", function() {
            mucMenuNho.forEach(m => m.classList.remove("kich-hoat"));
            this.classList.add("kich-hoat");

            const loaiMuc = this.getAttribute("data-muc");

            if (loaiMuc === "sap-toi") {
                window.scrollTo({ top: 0, behavior: "smooth" });
            } 
            else if (loaiMuc === "lich-su") {
                const vungLichSu = document.querySelector(".vung-lich-su-toan-trang");
                if (vungLichSu) vungLichSu.scrollIntoView({ behavior: "smooth", block: "start" });
            } 
            else if (loaiMuc === "san-da-luu") {
                // Hành động: Hiện bảng pop-up đè lên màn hình
                if (popupSanLuu) popupSanLuu.style.display = "flex";
            }
        });
    });

    // Các cách để tắt đóng Pop-up thông tin
    if (nutDongPopup && popupSanLuu) {
        // Đóng khi click vào dấu X
        nutDongPopup.addEventListener("click", () => popupSanLuu.style.display = "none");
        // Đóng khi click ra vùng nền đen bên ngoài hộp thoại
        popupSanLuu.addEventListener("click", (e) => {
            if (e.target === popupSanLuu) popupSanLuu.style.display = "none";
        });
    }
});
