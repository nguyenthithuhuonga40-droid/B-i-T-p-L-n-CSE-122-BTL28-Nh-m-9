document.addEventListener("DOMContentLoaded", function () {
    // Thu thập các nút chức năng từ giao diện
    const nutXacNhanDat = document.getElementById("nut-xac-nhan-dat");
    const nutDongYDieuKhoan = document.getElementById("nut-dong-y-dieu-khoan");
    const nutDoiGio = document.getElementById("nut-doi-gio");
    const nutChonLaiGio = document.getElementById("nut-chon-lai-gio");
    const nutTimSanKhac = document.getElementById("nut-tim-san-khac");
    const nutXemTheThao = document.getElementById("nut-xem-the-thao");

    // Xử lý bật/tắt nút xác nhận dựa trên hộp kiểm đồng ý điều khoản
    if (nutDongYDieuKhoan && nutXacNhanDat) {
        nutDongYDieuKhoan.addEventListener("change", function () {
            if (this.checked) {
                nutXacNhanDat.disabled = false;
                nutXacNhanDat.style.opacity = "1";
                nutXacNhanDat.style.cursor = "pointer";
            } else {
                nutXacNhanDat.disabled = true;
                nutXacNhanDat.style.opacity = "0.5";
                nutXacNhanDat.style.cursor = "not-allowed";
            }
        });
    }

    // Sự kiện khi bấm "Xác nhận đặt sân"
    if (nutXacNhanDat) {
        nutXacNhanDat.addEventListener("click", function () {
            alert("Mô phỏng: Hệ thống đang gửi yêu cầu đặt sân Tây Hồ Sports - P01!");
        });
    }

    // Sự kiện khi bấm "Đổi khung giờ" hoặc "Chọn lại giờ"
    const xuLyDoiGio = function () {
        alert("Mô phỏng: Quay lại bước chọn khung giờ trống.");
    };

    if (nutDoiGio) nutDoiGio.addEventListener("click", xuLyDoiGio);
    if (nutChonLaiGio) nutChonLaiGio.addEventListener("click", xuLyDoiGio);

    // Sự kiện tìm sân khác
    if (nutTimSanKhac) {
        nutTimSanKhac.addEventListener("click", function () {
            alert("Mô phỏng: Chuyển hướng về danh sách tìm kiếm sân thể thao.");
        });
    }

    // Sự kiện xem danh sách lịch đặt cá nhân
    if (nutXemTheThao) {
        nutXemTheThao.addEventListener("click", function () {
            alert("Mô phỏng: Chuyển đến mục danh sách sân đã đặt của tôi.");
        });
    }
});