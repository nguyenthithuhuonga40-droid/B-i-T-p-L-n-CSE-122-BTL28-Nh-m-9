document.addEventListener("DOMContentLoaded", function () {
    // 1. Thu thập dữ liệu các phần tử điều hướng và hành động
    const nutLocTran = document.querySelector(".nut-loc-tran");
    const cacNutXemTran = document.querySelectorAll(".nut-xem-tran");
    const nutTaoTranMoi = document.querySelector(".nut-kich-hoat-tao");
    const nutTaoTranTren = document.querySelector(".nut-tao-tran-tren");
    const nutTaoGoiYAI = document.querySelector(".nut-tao-goi-y");
    
    const nutXacNhanAI = document.querySelector(".nut-xac-nhan");
    const khoiGoiYAI = document.querySelector(".khoi-ket-qua-phu-hop");

    // 2. Chức năng bộ lọc tìm kiếm trận đấu
    if (nutLocTran) {
        nutLocTran.addEventListener("click", function () {
            const monHienTai = document.getElementById("loc-mon").value;
            const khuVucHienTai = document.getElementById("loc-khu-vực").value;
            alert(`Đang tiến hành lọc danh sách trận đấu môn [${monHienTai}] tại khu vực [${khuVucHienTai}]...`);
        });
    }

    // 3. Chức năng xem chi tiết trận đấu cụ thể
    cacNutXemTran.forEach((nut, chiSo) => {
        nut.addEventListener("click", function () {
            const tieuDeTran = this.closest(".the-tran").querySelector(".ten-tran").innerText;
            alert(`Đang tải dữ liệu chi tiết của trận: "${tieuDeTran}"`);
        });
    });

    // 4. Đồng bộ hành động tạo trận mới
    const hanhDongTaoTran = function () {
        alert("Chuyển hướng người dùng sang trang khởi tạo thông số trận đấu mới.");
    };
    if (nutTaoTranMoi) nutTaoTranMoi.addEventListener("click", hanhDongTaoTran);
    if (nutTaoTranTren) nutTaoTranTren.addEventListener("click", hanhDongTaoTran);

    // 5. Mô phỏng chạy tính toán Skill Match AI gợi ý trận
    if (nutTaoGoiYAI) {
        nutTaoGoiYAI.addEventListener("click", function () {
            alert("Hệ thống trí tuệ nhân tạo đang quét tìm trận đấu tối ưu nhất với lịch rảnh và trình độ của bạn...");
            if (khoiGoiYAI) {
                khoiGoiYAI.style.border = "1px solid #006d5b";
                khoiGoiYAI.style.backgroundColor = "#f0faf7";
            }
        });
    }

    // 6. Chấp nhận gợi ý trận đấu phù hợp
    if (nutXacNhanAI) {
        nutXacNhanAI.addEventListener("click", function () {
            alert("Bạn đã chọn chấp nhận trận đấu gợi ý. Hệ thống đang tiến hành mở chi tiết trận để bạn gửi yêu cầu tham gia!");
        });
    }

    // 7. Gắn sự kiện nhanh cho nhóm thao tác nhỏ bên dưới
    document.querySelectorAll(".nut-thao-tac-nho").forEach(nutPhu => {
        nutPhu.addEventListener("click", function () {
            alert(`Thao tác mô phỏng: [${this.innerText}] gợi ý trận thành công.`);
        });
    });
});