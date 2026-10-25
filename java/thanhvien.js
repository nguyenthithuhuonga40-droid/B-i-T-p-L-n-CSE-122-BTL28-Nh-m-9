// Danh sách dữ liệu mẫu ban đầu
let danhSachThanhVien = [
    { id: 1, ten: "Lan Phương", pickleball: "3.5", lichRanh: "T7 · 18–20", coMat: "8/8 buổi", trangThai: "Đã xác nhận" },
    { id: 2, ten: "Đức Huy", pickleball: "3.0", lichRanh: "T7 · 18–20", coMat: "7/8 buổi", trangThai: "Đã xác nhận" },
    { id: 3, ten: "Thu Hà", pickleball: "3.0", lichRanh: "T7 · 18–20", coMat: "8/8 buổi", trangThai: "Đã xác nhận" },
    { id: 4, ten: "Quốc Bảo", pickleball: "3.5", lichRanh: "T7 · 18–22", coMat: "6/8 buổi", trangThai: "Đã xác nhận" },
    { id: 5, ten: "Mai Linh", pickleball: "3.0", lichRanh: "T7 · 18–22", coMat: "7/8 buổi", trangThai: "Đã xác nhận" },
    { id: 6, ten: "Hoàng Long", pickleball: "3.5", lichRanh: "T7 · 18–22", coMat: "8/8 buổi", trangThai: "Đã xác nhận" },
    { id: 7, ten: "Ngọc Mai", pickleball: "3.0", lichRanh: "T7 · 18–20", coMat: "6/8 buổi", trangThai: "Đã xác nhận" },
    { id: 8, ten: "Tuấn Anh", pickleball: "3.5", lichRanh: "T7 · 18–20", coMat: "8/8 buổi", trangThai: "Đã xác nhận" },
    { id: 9, ten: "Minh Anh", pickleball: "3.0", lichRanh: "T7 · 18–20", coMat: "Chưa đủ dữ liệu", trangThai: "Lời mời đang chờ" },
    { id: 10, ten: "Hải Yến", pickleball: "2.5", lichRanh: "CN · 08–10", coMat: "Chưa có", trangThai: "Đã từ chối lời mời" }
];

// Hàm hiển thị bảng dữ liệu có hỗ trợ TỰ SỬA TRỰC TIẾP
function hienThiBangThanhVien(danhSach) {
    const thanBang = document.getElementById("thanBangThanhVien");
    thanBang.innerHTML = "";

    danhSach.forEach(item => {
        const hang = document.createElement("tr");
        hang.innerHTML = `
            <td class="ten-dam">${item.ten}</td>
            
            <!-- Trình độ Pickleball tự sửa khi bấm vào -->
            <td>
                <span class="o-cho-phep-sua" onclick="suaTrinhDoDirect(${item.id}, this)">
                    ${item.pickleball} ✏️
                </span>
            </td>
            
            <!-- Lịch rảnh tự sửa khi bấm vào -->
            <td>
                <span class="o-cho-phep-sua" onclick="suaLichRanhDirect(${item.id}, this)">
                    ${item.lichRanh} ✏️
                </span>
            </td>

            <td>${item.coMat}</td>
            <td>${item.trangThai}</td>
        `;
        thanBang.appendChild(hang);
    });
}

// Hàm cho phép đổi trực tiếp Trình độ
function suaTrinhDoDirect(id, theElement) {
    const giaTriCu = theElement.innerText.replace('✏️', '').trim();
    const input = document.createElement("input");
    input.type = "text";
    input.value = giaTriCu;
    input.className = "o-sua-truc-tiep";

    theElement.replaceWith(input);
    input.focus();

    input.addEventListener("blur", () => {
        luuGiaTriSua(id, 'pickleball', input.value);
    });

    input.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
            luuGiaTriSua(id, 'pickleball', input.value);
        }
    });
}

// Hàm cho phép đổi trực tiếp Lịch rảnh
function suaLichRanhDirect(id, theElement) {
    const giaTriCu = theElement.innerText.replace('✏️', '').trim();
    const input = document.createElement("input");
    input.type = "text";
    input.value = giaTriCu;
    input.className = "o-sua-truc-tiep-rong";

    theElement.replaceWith(input);
    input.focus();

    input.addEventListener("blur", () => {
        luuGiaTriSua(id, 'lichRanh', input.value);
    });

    input.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
            luuGiaTriSua(id, 'lichRanh', input.value);
        }
    });
}

// Lưu giá trị vừa sửa vào Mảng dữ liệu
function luuGiaTriSua(id, truongCanSua, giaTriMoi) {
    const thanhVien = danhSachThanhVien.find(v => v.id === id);
    if (thanhVien && giaTriMoi.trim() !== "") {
        thanhVien[truongCanSua] = giaTriMoi.trim();
    }
    hienThiBangThanhVien(danhSachThanhVien);
}

// NÚT MỜI THÀNH VIÊN HOẠT ĐỘNG
document.getElementById("nutMoiThanhVien").addEventListener("click", function() {
    const tenMoi = prompt("Nhập tên thành viên bạn muốn mời:");
    if (tenMoi) {
        const idMoi = danhSachThanhVien.length + 1;
        danhSachThanhVien.push({
            id: idMoi,
            ten: tenMoi,
            pickleball: "3.0",
            lichRanh: "T7 · 18–20",
            coMat: "Chưa có",
            trangThai: "Lời mời đang chờ"
        });
        hienThiBangThanhVien(danhSachThanhVien);
        alert(`Đã gửi lời mời thành công tới "${tenMoi}"!`);
    }
});

// Xử lý Lọc dữ liệu
document.getElementById("oTimThanhVien").addEventListener("input", function() {
    const tuKhoa = this.value.toLowerCase();
    const ketQua = danhSachThanhVien.filter(item => item.ten.toLowerCase().includes(tuKhoa));
    hienThiBangThanhVien(ketQua);
});

// Gửi Form mời thành viên từ Biến thể
document.getElementById("formThanhVien").addEventListener("submit", function(e) {
    e.preventDefault();
    const ten = document.getElementById("nhapHoTen").value;
    const monTrinhDo = document.getElementById("nhapMonTrinhDo").value.replace('Pickleball • ', '');
    const lichRanh = document.getElementById("nhapLichRanh").value;

    danhSachThanhVien.push({
        id: danhSachThanhVien.length + 1,
        ten: ten,
        pickleball: monTrinhDo || "3.0",
        lichRanh: lichRanh || "T7 · 18–20",
        coMat: "Chưa có",
        trangThai: "Lời mời đang chờ"
    });

    hienThiBangThanhVien(danhSachThanhVien);
    alert("Đã lưu và thêm thành viên thành công!");
});

// Các nút tương tác khác
document.getElementById("nutLuuChinhSua").addEventListener("click", () => alert("Đã lưu các thay đổi!"));
document.getElementById("nutGuiLaiLoiMoi").addEventListener("click", () => alert("Đã gửi lại lời mời!"));
document.getElementById("nutHuyLoiMoi").addEventListener("click", () => alert("Đã hủy lời mời!"));

// Tải dữ liệu ban đầu khi khởi chạy
document.addEventListener("DOMContentLoaded", () => {
    hienThiBangThanhVien(danhSachThanhVien);
});