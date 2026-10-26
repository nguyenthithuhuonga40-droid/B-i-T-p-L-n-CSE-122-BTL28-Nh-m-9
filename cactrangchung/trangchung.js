document.addEventListener("DOMContentLoaded", function () {
    
    // --- 1. CHUYỂN ĐỔI CÁC THANH MENU BÊN TRÁI ---
    const cacMucMenu = document.querySelectorAll(".muc-menu");
    const cacNoiDungTab = document.querySelectorAll(".noi-dung-tab");

    cacMucMenu.forEach(muc => {
        muc.addEventListener("click", function() {
            cacMucMenu.forEach(m => m.classList.remove("muc-kich-hoat"));
            cacNoiDungTab.forEach(tab => tab.classList.remove("kich-hoat"));

            this.classList.add("muc-kich-hoat");
            const tenTabCanMo = this.getAttribute("data-tab");
            document.getElementById(`tab-${tenTabCanMo}`).classList.add("kich-hoat");
        });
    });

    // --- 2. KHAI BÁO CÁC NÚT VÀ VÙNG HIỂN THỊ ĐỂ TƯƠNG TÁC ---
    const nutLuuQuyetDinh = document.getElementById("nut-luu-quyet-dinh");
    const nutLuuRaSoat = document.getElementById("nut-luu-ra-soat");
    const nutDoiVaiTro = document.getElementById("nut-doi-vai-tro");
    const nutVoHieuHoa = document.getElementById("nut-vo-hieu-hoa");
    const oNhapLyDo = document.getElementById("o-nhap-ly-do");
    
    const trangThaiTaiKhoan = document.getElementById("trang-thai-tai-khoan");
    const chuVaiTroHienTai = document.getElementById("chu-vai-tro-hien-tai");
    const hienThiVaiTroPhai = document.getElementById("hien-thi-vai-tro-phai");
    const hienThiTruyCapPhai = document.getElementById("hien-thi-truy-cap-phai");
    const thanBangLichSu = document.getElementById("than-bang-lich-su");
    const vungDanhSachQuyen = document.getElementById("vung-danh-sach-quyen");

    // HÀM TIỆN ÍCH: Lấy thời gian thực tế để chèn vào bảng
    function layThoiGianHienTai() {
        const bayGio = new Date();
        const ngay = String(bayGio.getDate()).padStart(2, '0');
        const thang = String(bayGio.getMonth() + 1).padStart(2, '0');
        const gio = String(bayGio.getHours()).padStart(2, '0');
        const phut = String(bayGio.getMinutes()).padStart(2, '0');
        return `${ngay}/${thang} - ${gio}:${phut}`;
    }

    // --- 3. LOGIC XỬ LÝ CHO TỪNG NÚT BẤM CỤ THỂ ---

    // A. Nút "Lưu rà soát": Thêm một dòng ghi nhận tạm thời vào bảng lịch sử
    nutLuuRaSoat.addEventListener("click", function () {
        const lyDoChu = oNhapLyDo.value.trim();
        if (lyDoChu === "") {
            alert("Lỗi: Bạn cần gõ nội dung vào ô 'Lý do quyết định' trước khi bấm Lưu rà soát!");
            oNhapLyDo.focus();
            return;
        }

        const dongMoi = document.createElement("tr");
        dongMoi.innerHTML = `
            <td><strong>${layThoiGianHienTai()}</strong></td>
            <td>Hải Nam</td>
            <td>Cập nhật hệ thống</td>
            <td class="chu-mo">${lyDoChu}</td>
        `;
        thanBangLichSu.insertBefore(dongMoi, thanBangLichSu.firstChild);
        alert("Đã thêm một dòng lịch sử rà soát tạm thời ở bảng bên dưới!");
    });

    // B. Nút "Đổi vai trò": Thay đổi chữ và bộ danh sách quyền ngay trên màn hình
    nutDoiVaiTro.addEventListener("click", function () {
        if (hienThiVaiTroPhai.textContent === "Người chơi") {
            chuVaiTroHienTai.textContent = "Chủ sân";
            hienThiVaiTroPhai.textContent = "Chủ sân";
            
            vungDanhSachQuyen.innerHTML = `
                <li class="quyen-co">✓ Tìm sân, đặt sân và quản lý đơn của mình</li>
                <li class="quyen-co">✓ Quản lý danh sách sân, duyệt lịch đặt của khách</li>
                <li class="quyen-co">✓ Cấu hình câu lạc bộ thành viên</li>
            `;
        } else {
            chuVaiTroHienTai.textContent = "Người chơi";
            hienThiVaiTroPhai.textContent = "Người chơi";
            
            vungDanhSachQuyen.innerHTML = `
                <li class="quyen-co">✓ Tìm sân, đặt sân và quản lý đơn của mình</li>
                <li class="quyen-co">✓ Tạo trận, gửi yêu cầu và quản lý trận của mình</li>
                <li class="quyen-khong">─ Không quản lý sân, thành viên CLB hay hệ thống</li>
            `;
        }
    });

    // C. Nút "Vô hiệu hóa": Đổi màu nhãn trạng thái tài khoản Đỏ / Xanh trực quan
    nutVoHieuHoa.addEventListener("click", function () {
        if (!trangThaiTaiKhoan.classList.contains("bi-khoa")) {
            trangThaiTaiKhoan.textContent = "MA - Bị vô hiệu hóa";
            trangThaiTaiKhoan.classList.add("bi-khoa");
            hienThiTruyCapPhai.textContent = "Đang bị khóa";
            nutVoHieuHoa.textContent = "Kích hoạt lại";
        } else {
            trangThaiTaiKhoan.textContent = "MA - Hoạt động";
            trangThaiTaiKhoan.classList.remove("bi-khoa");
            hienThiTruyCapPhai.textContent = "Đang hoạt động";
            nutVoHieuHoa.textContent = "Vô hiệu hóa";
        }
    });

    // D. NÚT TỔNG "LƯU QUYẾT ĐỊNH" (GÓC TRÊN CÙNG BÊN PHẢI)
    nutLuuQuyetDinh.addEventListener("click", function () {
        // Thu thập thông tin hiện tại từ giao diện để làm dữ liệu gửi đi
        const vaiTroHienTai = hienThiVaiTroPhai.textContent;
        const trangThaiHienTai = hienThiTruyCapPhai.textContent;
        const lyDoCuoiCung = oNhapLyDo.value.trim() || "(Không ghi lý do mới)";

        // Hiển thị hộp thoại tổng hợp dữ liệu để bạn nhìn thấy sự thay đổi dữ liệu thật
        alert(
            "=== HỆ THỐNG COURTCONNECT ===\n" +
            "Đã đồng bộ dữ liệu quyết định thành công!\n\n" +
            "• Tài khoản: Nguyễn Minh Anh\n" +
            "• Vai trò mới lưu: " + vaiTroHienTai + "\n" +
            "• Trạng thái truy cập: " + trangThaiHienTai + "\n" +
            "• Lý do rà soát: " + lyDoCuoiCung
        );
        
        // Sau khi lưu thành công, tự động dọn dẹp sạch ô nhập lý do
        oNhapLyDo.value = "";
    });
});
