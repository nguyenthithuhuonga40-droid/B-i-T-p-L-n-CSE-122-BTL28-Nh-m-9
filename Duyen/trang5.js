document.addEventListener("DOMContentLoaded", function () {
    // Thu thập các phần tử thao tác trên giao diện
    const nutLuuTran = document.querySelector(".nut-luu-tran");
    const nutGuiYeuCau = document.getElementById("nut-gui-yeu-cau");
    const nutRutYeuCau = document.getElementById("nut-rut-yeu-cau");
    const nhapLoiNhan = document.getElementById("nhap-loi-nhan");

    // Các nút bấm dưới khối biến thể tạo trận
    const nutLuuThayDoi = document.querySelector(".nut-luu-thay-doi");
    const nutDangTran = document.querySelector(".nut-dang-tran");
    const nutHuyTran = document.querySelector(".nut-huy-tran");

    // 1. Logic nút tương tác "Lưu trận" độc lập
    if (nutLuuTran) {
        nutLuuTran.addEventListener("click", function () {
            if (this.innerText.includes("❤️")) {
                this.innerHTML = "🤍 Đã lưu";
                this.style.backgroundColor = "#8c8b86";
            } else {
                this.innerHTML = "❤️ Lưu trận";
                this.style.backgroundColor = "#0c3322";
            }
        });
    }

    // 2. Mô phỏng luồng gửi yêu cầu tham gia trận đấu
    if (nutGuiYeuCau) {
        nutGuiYeuCau.addEventListener("click", function () {
            const noiDungLoiNhan = nhapLoiNhan ? nhapLoiNhan.value.trim() : "";
            alert(`Hệ thống đã gửi yêu cầu tham gia của bạn kèm lời nhắn: "${noiDungLoiNhan}". Vui lòng chờ Bảo Trâm phê duyệt!`);
        });
    }

    // 3. Mô phỏng thao tác rút lại yêu cầu
    if (nutRutYeuCau) {
        nutRutYeuCau.addEventListener("click", function () {
            const xacNhan = confirm("Bạn có chắc chắn muốn rút lại yêu cầu tham gia trận đấu này không?");
            if (xacNhan) {
                alert("Đã hủy bỏ trạng thái gửi yêu cầu thành công.");
            }
        });
    }

    // 4. Các nút thao tác trong khối quản trị/chỉnh sửa trận
    if (nutLuuThayDoi) {
        nutLuuThayDoi.addEventListener("click", function () {
            alert("Mô phỏng: Cập nhật thành công các thông số chỉnh sửa cho trận 'Đôi vui cuối tuần'.");
        });
    }

    if (nutDangTran) {
        nutDangTran.addEventListener("click", function () {
            alert("Mô phỏng: Đang tiến hành nhân bản và đăng tải một trận đấu mới lên hệ thống dựa trên thông tin sẵn có.");
        });
    }

    if (nutHuyTran) {
        nutHuyTran.addEventListener("click", function () {
            const xacNhanHuy = confirm("Hành động này sẽ hủy toàn bộ lịch đặt sân và hoàn tiền cho người tham gia (nếu có). Tiếp tục?");
            if (xacNhanHuy) {
                alert("Trận đấu đã được chuyển sang trạng thái: Đã hủy.");
            }
        });
    }
});