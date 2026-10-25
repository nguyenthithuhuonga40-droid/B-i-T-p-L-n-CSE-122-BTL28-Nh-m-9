// Dữ liệu 8 thành viên mặc định theo giao diện
const danhSachThanhVienGoc = [
    { ten: "Lan Phương", diem: 3.5, duocChon: true },
    { ten: "Đức Huy", diem: 3.0, duocChon: true },
    { ten: "Mai Linh", diem: 3.0, duocChon: true },
    { ten: "Tuấn Anh", diem: 3.5, duocChon: true },
    { ten: "Quốc Bảo", diem: 3.5, duocChon: true },
    { ten: "Thu Hà", diem: 3.0, duocChon: true },
    { ten: "Hoàng Long", diem: 3.5, duocChon: true },
    { ten: "Ngọc Mai", diem: 3.0, duocChon: true }
];

// Hàm render danh sách checkbox bên trái
function hienThiCheckboxThanhVien() {
    const vungChua = document.getElementById("danhSachCheckboxThanhVien");
    vungChua.innerHTML = "";

    danhSachThanhVienGoc.forEach((tv, index) => {
        const label = document.createElement("label");
        label.className = "muc-checkbox-item";
        label.innerHTML = `
            <input type="checkbox" data-index="${index}" ${tv.duocChon ? "checked" : ""}>
            <span>${tv.ten} · ${tv.diem}</span>
        `;
        
        // Sự kiện thay đổi checkbox
        label.querySelector("input").addEventListener("change", (e) => {
            danhSachThanhVienGoc[index].duocChon = e.target.checked;
            capNhatHaiDoi();
        });

        vungChua.appendChild(label);
    });
}

// Chia đều tự động vào Đội A và Đội B
function capNhatHaiDoi() {
    const duocChonList = danhSachThanhVienGoc.filter(tv => tv.duocChon);
    
    const vungDoiA = document.getElementById("danhSachDoiA");
    const vungDoiB = document.getElementById("danhSachDoiB");
    
    vungDoiA.innerHTML = "";
    vungDoiB.innerHTML = "";

    // Phân nửa sang Đội A, nửa sang Đội B để làm mẫu
    const giua = Math.ceil(duocChonList.length / 2);
    const doiA = duocChonList.slice(0, giua);
    const doiB = duocChonList.slice(giua);

    doiA.forEach(tv => {
        const div = document.createElement("div");
        div.className = "the-thanh-vien-trong-doi";
        div.innerText = `${tv.ten} - ${tv.diem}`;
        vungDoiA.appendChild(div);
    });

    doiB.forEach(tv => {
        const div = document.createElement("div");
        div.className = "the-thanh-vien-trong-doi";
        div.innerText = `${tv.ten} - ${tv.diem}`;
        vungDoiB.appendChild(div);
    });

    document.querySelector(".nhan-so-luong-doi").innerText = `2 đội • ${duocChonList.length} người`;
}

// Các nút tương tác sự kiện thực tế
document.getElementById("nutCongBoDoiHinh").addEventListener("click", () => {
    alert("Đã công bố đội hình và gửi thông báo thành công tới các thành viên!");
});

document.getElementById("nutChonTatCa").addEventListener("click", () => {
    danhSachThanhVienGoc.forEach(tv => tv.duocChon = true);
    hienThiCheckboxThanhVien();
    capNhatHaiDoi();
    alert("Đã chọn tất cả 8 người vào danh sách xếp đội.");
});

document.getElementById("nutDoiNguoiHaiDoi").addEventListener("click", () => {
    alert("Đã tráo đổi vị trí người chơi giữa Đội A và Đội B để cân bằng lại chiến thuật.");
});

document.getElementById("nutChapNhanDoiHinh").addEventListener("click", () => {
    alert("Đã chấp nhận đội hình do AI đề xuất!");
});

document.getElementById("nutSuaThuCong").addEventListener("click", () => {
    alert("Chế độ chỉnh sửa thủ công đã sẵn sàng. Bạn có thể kéo thả hoặc đổi thành viên.");
});

document.getElementById("nutTuChoi").addEventListener("click", () => {
    if(confirm("Bạn có muốn từ chối đội hình này và tạo lại không?")) {
        alert("Đã hủy bỏ đội hình hiện tại.");
    }
});

document.getElementById("nutTaoLai").addEventListener("click", () => {
    alert("AI đang tiến hành chạy lại thuật toán cân bằng đội hình mới...");
    capNhatHaiDoi();
});

document.getElementById("nutLuuNhap").addEventListener("click", () => {
    alert("Đã lưu đội hình nháp vào hệ thống CLB!");
});

document.getElementById("nutNguoiDung").addEventListener("click", () => {
    alert("Tài khoản đang đăng nhập: Lan Phương (Điều phối CLB)");
});

document.getElementById("nutThongBaoTop").addEventListener("click", () => {
    alert("Không có thông báo mới.");
});

// Chuyển tab menu bên trái
const cacMucMenu = document.querySelectorAll(".muc-menu");
cacMucMenu.forEach(muc => {
    muc.addEventListener("click", function(e) {
        e.preventDefault();
        cacMucMenu.forEach(m => m.classList.remove("dang-chon"));
        this.classList.add("dang-chon");
    });
});

// Khởi chạy khi trang tải xong
document.addEventListener("DOMContentLoaded", () => {
    hienThiCheckboxThanhVien();
    capNhatHaiDoi();
});