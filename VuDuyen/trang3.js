document.addEventListener("DOMContentLoaded", function () {
    // Thu thập các nút chức năng từ giao diện
    const nutXacNhanDat = document.getElementById("nut-xac-nhan-dat");
    const nutDongYDieuKhoan = document.getElementById("nut-dong-y-dieu-khoan");
    const nutDoiGio = document.getElementById("nut-doi-gio");
    const nutChonLaiGio = document.getElementById("nut-chon-lai-gio");
    const nutTimSanKhac = document.getElementById("nut-tim-san-khac");
    const nutXemTheThao = document.getElementById("nut-xem-the-thao");

    // Xử lý bật/tắt nút xác nhận dựa trên hộp kiểm đồng ý điều khoản (Giữ nguyên gốc)
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

    // SỬA TẠI ĐÂY: Sự kiện khi bấm "Xác nhận đặt sân" thành công thực tế
    if (nutXacNhanDat) {
        nutXacNhanDat.addEventListener("click", function () {
            nutXacNhanDat.disabled = true;
            nutXacNhanDat.innerHTML = "⌛ Đang xử lý giao dịch đơn...";

            setTimeout(() => {
                alert("🎉 Đặt sân thành công!\nĐơn hàng của bạn đã được ghi nhận trên hệ thống CourtConnect.");
                
                // Khôi phục lại trạng thái nút
                nutXacNhanDat.disabled = false;
                nutXacNhanDat.innerHTML = "Xác nhận đặt sân - 360.000đ";

                // (Tùy chọn) Điều hướng thẳng khách hàng sang trang lịch đã đặt (trang6.html) sau khi đặt xong
                window.location.href = "trang6.html";
            }, 1000);
        });
    }

    // SỬA TẠI ĐÂY: Điều hướng thực tế quay lại bước chọn khung giờ trống ở trang 2
    const xuLyDoiGio = function () {
        // Sử dụng liên kết thẻ Neo #khu-vuc-dat-san để trang 2 tự động trượt xuống hộp chọn lịch
        window.location.href = "trang2.html#khu-vuc-dat-san";
    };

    if (nutDoiGio) nutDoiGio.addEventListener("click", xuLyDoiGio);
    if (nutChonLaiGio) nutChonLaiGio.addEventListener("click", xuLyDoiGio);

    // SỬA TẠI ĐÂY: Điều hướng thực tế về danh sách tìm kiếm sân thể thao (Trang chủ)
    if (nutTimSanKhac) {
        nutTimSanKhac.addEventListener("click", function () {
            window.location.href = "index.html";
        });
    }

    // SỬA TẠI ĐÂY: Điều hướng thực tế đến mục danh sách sân đã đặt của tôi (Trang lịch đã đặt)
    if (nutXemTheThao) {
        nutXemTheThao.addEventListener("click", function () {
            window.location.href = "trang6.html";
        });
    }
});
