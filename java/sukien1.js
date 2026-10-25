// Dữ liệu danh sách sự kiện mẫu đúng theo ảnh
const danhSachSuKien = [
    {
        id: 1,
        tenSuKien: "Giao lưu Nhịp Sân thứ bảy",
        lichDiaDiem: "10/10 · Tây Hồ Sports",
        dangKy: "8/8",
        trangThai: "Sắp diễn ra",
        maTrangThai: "sap-dien-ra",
        thaoTac: ["Xem", "Sửa", "Hủy"]
    },
    {
        id: 2,
        tenSuKien: "Cầu lông giữa tuần",
        lichDiaDiem: "14/10 · Cầu Giấy",
        dangKy: "6/12",
        trangThai: "Sắp diễn ra",
        maTrangThai: "sap-dien-ra",
        thaoTac: ["Xem", "Sửa"]
    },
    {
        id: 3,
        tenSuKien: "Buổi tập kỹ thuật sáng",
        lichDiaDiem: "10/10 · Long Biên",
        dangKy: "4/4",
        trangThai: "Đang diễn ra",
        maTrangThai: "dang-dien-ra",
        thaoTac: ["Xem", "Tổng kết"]
    },
    {
        id: 4,
        tenSuKien: "Giao lưu tháng 9",
        lichDiaDiem: "26/09 · Tây Hồ Sports",
        dangKy: "8/8",
        trangThai: "Hoàn thành",
        maTrangThai: "hoan-thanh",
        thaoTac: ["Xem", "Lưu trữ"]
    },
    {
        id: 5,
        tenSuKien: "Trận giao hữu ngoài trời",
        lichDiaDiem: "03/10 · Long Biên",
        dangKy: "0/8",
        trangThai: "Đã hủy",
        maTrangThai: "da-huy",
        thaoTac: ["Xem lý do", "Lưu trữ"]
    }
];

// Hàm hiển thị danh sách sự kiện ra bảng
function hienThiBangSuKien(danhSach) {
    const thanBang = document.getElementById("thanBangSuKien");
    thanBang.innerHTML = "";

    danhSach.forEach(item => {
        const hang = document.createElement("tr");

        // Tạo các nút thao tác
        const thaoTacHtml = item.thaoTac.map(act => 
            `<a href="#" class="nut-thao-tac" onclick="thucHienThaoTac('${act}', '${item.tenSuKien}'); return false;">${act}</a>`
        ).join(' · ');

        hang.innerHTML = `
            <td class="cot-tieu-de-su-kien">${item.tenSuKien}</td>
            <td>${item.lichDiaDiem}</td>
            <td>${item.dangKy}</td>
            <td>${item.trangThai}</td>
            <td>${thaoTacHtml}</td>
        `;
        thanBang.appendChild(hang);
    });
}

// Khởi tạo hiển thị ban đầu
document.addEventListener("DOMContentLoaded", () => {
    hienThiBangSuKien(danhSachSuKien);

    // Chức năng chuyển các tab lọc trạng thái
    const cacTheLoc = document.querySelectorAll(".the-loc");
    cacTheLoc.forEach(the => {
        the.addEventListener("click", () => {
            cacTheLoc.forEach(t => t.classList.remove("kich-hoat"));
            the.classList.add("kich-hoat");

            const trangThaiChon = the.getAttribute("data-trangthai");
            if (trangThaiChon === "tat-ca") {
                hienThiBangSuKien(danhSachSuKien);
            } else {
                const ketQuaLoc = danhSachSuKien.filter(item => item.maTrangThai === trangThaiChon);
                hienThiBangSuKien(ketQuaLoc);
            }
        });
    });

    // Chức năng lọc từ Ô Tìm Kiếm
    document.getElementById("nutXacNhanLoc").addEventListener("click", () => {
        const tuKhoa = document.getElementById("inputTimKiem").value.toLowerCase().trim();
        const ketQua = danhSachSuKien.filter(item => 
            item.tenSuKien.toLowerCase().includes(tuKhoa) || 
            item.lichDiaDiem.toLowerCase().includes(tuKhoa)
        );
        hienThiBangSuKien(ketQua);
    });

    // Chức năng nút Tạo Sự Kiện
    document.getElementById("nutTaoSuKien").addEventListener("click", () => {
        alert("Mở biểu mẫu tạo sự kiện mới cho CLB Nhịp Sân!");
    });

    // Nút thông báo
    document.getElementById("nutThongBao").addEventListener("click", () => {
        alert("Bạn không có thông báo mới nào.");
    });

});

// Chức năng xử lý cho các nút hành động
function xemSuKien(tenSuKien) {
    alert(`Đang mở thông tin chi tiết sự kiện: ${tenSuKien}`);
}

function xepDoi(tenSuKien) {
    alert(`Đang chuyển tới trình xếp đội cho: ${tenSuKien}`);
}

function thucHienThaoTac(hanhDong, tenSuKien) {
    alert(`Bạn đã chọn "${hanhDong}" cho sự kiện "${tenSuKien}"`);
}