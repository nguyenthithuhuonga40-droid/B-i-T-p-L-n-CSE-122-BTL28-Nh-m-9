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

let doiA = [];
let doiB = [];
let suKienDangChon;
let thongBaoTimeout;

function hienThongBaoXepDoi(noiDung, laLoi = false) {
    const thongBao = document.getElementById("thongBaoTrang");
    thongBao.textContent = noiDung;
    thongBao.style.backgroundColor = laLoi ? "#9f2424" : "";
    thongBao.classList.add("dang-hien");
    window.clearTimeout(thongBaoTimeout);
    thongBaoTimeout = window.setTimeout(() => thongBao.classList.remove("dang-hien"), 3200);
}

function cacThanhVienDangChon() {
    return danhSachThanhVienGoc.filter(thanhVien => thanhVien.duocChon);
}

function chiaDoiCanBang(ngauNhien = false) {
    const thanhVien = cacThanhVienDangChon();
    if (ngauNhien) thanhVien.sort(() => Math.random() - 0.5);
    else thanhVien.sort((a, b) => b.diem - a.diem);

    doiA = [];
    doiB = [];
    let diemA = 0;
    let diemB = 0;

    thanhVien.forEach(thanhVienChon => {
        if (diemA < diemB || (diemA === diemB && doiA.length <= doiB.length)) {
            doiA.push(thanhVienChon);
            diemA += thanhVienChon.diem;
        } else {
            doiB.push(thanhVienChon);
            diemB += thanhVienChon.diem;
        }
    });
}

function hienThiCheckboxThanhVien() {
    const vungChua = document.getElementById("danhSachCheckboxThanhVien");
    vungChua.replaceChildren();

    danhSachThanhVienGoc.forEach(thanhVien => {
        const label = document.createElement("label");
        label.className = "muc-checkbox-item";

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = thanhVien.duocChon;
        checkbox.addEventListener("change", () => {
            thanhVien.duocChon = checkbox.checked;
            chiaDoiCanBang();
            capNhatHaiDoi();
        });

        const ten = document.createElement("span");
        ten.textContent = `${thanhVien.ten} · ${thanhVien.diem}`;
        label.append(checkbox, ten);
        vungChua.appendChild(label);
    });
}

function capNhatThongKeDoi(selector, doi) {
    const tongDiem = doi.reduce((tong, thanhVien) => tong + thanhVien.diem, 0);
    const diemTrungBinh = doi.length ? (tongDiem / doi.length).toFixed(2) : "0.00";
    document.querySelector(`${selector} .thong-ke-diem`).textContent =
        `Tổng điểm ${tongDiem.toFixed(1)} • Trung bình ${diemTrungBinh}`;

    const vungChua = document.querySelector(`${selector} .danh-sach-thanh-vien-doi`);
    vungChua.replaceChildren();
    doi.forEach(thanhVien => {
        const the = document.createElement("div");
        the.className = "the-thanh-vien-trong-doi";
        the.textContent = `${thanhVien.ten} - ${thanhVien.diem}`;
        vungChua.appendChild(the);
    });
}

function capNhatHaiDoi() {
    capNhatThongKeDoi(".khung-doi:first-child", doiA);
    capNhatThongKeDoi(".khung-doi:last-child", doiB);

    const tongA = doiA.reduce((tong, thanhVien) => tong + thanhVien.diem, 0);
    const tongB = doiB.reduce((tong, thanhVien) => tong + thanhVien.diem, 0);
    const daChon = cacThanhVienDangChon().length;
    document.querySelector(".nhan-so-luong-doi").textContent = `2 đội • ${daChon} người`;
    document.querySelector(".chenh-lech-ghi-chu").textContent =
        `Chênh lệch tổng điểm: ${Math.abs(tongA - tongB).toFixed(1)} • Đây là đội hình giao lưu, luân phiên cặp đánh đôi.`;
    document.querySelector(".tieu-de-de-xuat-ai").textContent =
        `Đề xuất cân bằng từ ${daChon} thành viên`;
    document.getElementById("nguoiDuocChon").value =
        `${daChon}/${suKienDangChon?.dangKy.split("/")[1] || 8} đã xác nhận`;
}

function napDoiHinh(suKien) {
    danhSachThanhVienGoc.forEach(thanhVien => {
        thanhVien.duocChon = true;
    });

    if (suKien.doiHinh) {
        const tenDaLuu = new Set([...suKien.doiHinh.doiA, ...suKien.doiHinh.doiB]);
        danhSachThanhVienGoc.forEach(thanhVien => {
            thanhVien.duocChon = tenDaLuu.has(thanhVien.ten);
        });
        doiA = danhSachThanhVienGoc.filter(thanhVien => suKien.doiHinh.doiA.includes(thanhVien.ten));
        doiB = danhSachThanhVienGoc.filter(thanhVien => suKien.doiHinh.doiB.includes(thanhVien.ten));
        document.querySelector(".nhan-ban-nhap").textContent =
            suKien.doiHinh.trangThai === "Đã công bố"
                ? "Đã công bố"
                : suKien.doiHinh.trangThai === "Đã từ chối"
                    ? "Đề xuất đã từ chối"
                    : "Bản nháp - Chưa công bố";
    } else {
        chiaDoiCanBang();
        document.querySelector(".nhan-ban-nhap").textContent = "⚠️ Bản nháp - Chưa công bố";
    }

    hienThiCheckboxThanhVien();
    capNhatHaiDoi();
}

function luuDoiHinh(daCongBo) {
    try {
        const danhSach = window.CourtConnectStore.docSuKien();
        const viTri = danhSach.findIndex(suKien => suKien.id === suKienDangChon.id);
        if (viTri < 0) throw new Error("Sự kiện không còn trong danh sách.");

        danhSach[viTri].doiHinh = {
            doiA: doiA.map(thanhVien => thanhVien.ten),
            doiB: doiB.map(thanhVien => thanhVien.ten),
            trangThai: daCongBo ? "Đã công bố" : "Bản nháp"
        };
        window.CourtConnectStore.luuSuKien(danhSach);
        suKienDangChon = danhSach[viTri];

        const nhanTrangThai = document.querySelector(".nhan-ban-nhap");
        nhanTrangThai.textContent = daCongBo ? "Đã công bố" : "Bản nháp - Chưa công bố";
        hienThongBaoXepDoi(daCongBo
            ? `Đã lưu và công bố đội hình cho "${suKienDangChon.tenSuKien}".`
            : `Đã lưu đội hình nháp cho "${suKienDangChon.tenSuKien}".`);
    } catch (error) {
        console.error("Không thể lưu đội hình.", error);
        hienThongBaoXepDoi("Không thể lưu đội hình. Vui lòng thử lại.", true);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    try {
        const danhSachSuKien = window.CourtConnectStore.docSuKien();
        const chonSuKien = document.getElementById("chonSuKien");
        const thamSo = new URLSearchParams(window.location.search);
        const tenTrenUrl = thamSo.get("tenSuKien");
        const idTrenUrl = thamSo.get("suKien");

        chonSuKien.replaceChildren();
        danhSachSuKien.filter(suKien => !suKien.luuTru).forEach(suKien => {
            const luaChon = document.createElement("option");
            luaChon.value = suKien.id;
            luaChon.textContent = suKien.tenSuKien;
            chonSuKien.appendChild(luaChon);
        });

        suKienDangChon = danhSachSuKien.find(suKien => suKien.id === idTrenUrl) ||
            danhSachSuKien.find(suKien => suKien.tenSuKien === tenTrenUrl) ||
            danhSachSuKien.find(suKien => !suKien.luuTru);
        if (!suKienDangChon) throw new Error("Chưa có sự kiện để xếp đội.");

        chonSuKien.value = suKienDangChon.id;
        document.querySelector(".mo-ta-trang").textContent =
            `${suKienDangChon.tenSuKien} • ${suKienDangChon.lichDiaDiem} • CLB Nhịp Sân`;
        napDoiHinh(suKienDangChon);

        chonSuKien.addEventListener("change", () => {
            const danhSachMoi = window.CourtConnectStore.docSuKien();
            const suKienMoi = danhSachMoi.find(suKien => suKien.id === chonSuKien.value);
            if (!suKienMoi) {
                hienThongBaoXepDoi("Không tìm thấy sự kiện đã chọn.", true);
                return;
            }
            suKienDangChon = suKienMoi;
            document.querySelector(".mo-ta-trang").textContent =
                `${suKienMoi.tenSuKien} • ${suKienMoi.lichDiaDiem} • CLB Nhịp Sân`;
            napDoiHinh(suKienMoi);
        });
    } catch (error) {
        console.error("Không thể khởi tạo trang xếp đội.", error);
        hienThongBaoXepDoi(error.message || "Không thể tải danh sách sự kiện.", true);
        return;
    }

    document.getElementById("nutCongBoDoiHinh").addEventListener("click", () => luuDoiHinh(true));

    document.getElementById("nutChonTatCa").addEventListener("click", () => {
        danhSachThanhVienGoc.forEach(thanhVien => {
            thanhVien.duocChon = true;
        });
        chiaDoiCanBang();
        hienThiCheckboxThanhVien();
        capNhatHaiDoi();
        hienThongBaoXepDoi("Đã chọn tất cả thành viên và cân bằng lại hai đội.");
    });

    document.getElementById("nutDoiNguoiHaiDoi").addEventListener("click", () => {
        if (!doiA.length || !doiB.length) {
            hienThongBaoXepDoi("Cần có thành viên ở cả hai đội để đổi người.", true);
            return;
        }

        let capDoiTotNhat;
        let chenhLechNhoNhat = Infinity;
        for (let i = 0; i < doiA.length; i++) {
            for (let j = 0; j < doiB.length; j++) {
                const diemA = doiA.reduce((tong, tv) => tong + tv.diem, 0) - doiA[i].diem + doiB[j].diem;
                const diemB = doiB.reduce((tong, tv) => tong + tv.diem, 0) - doiB[j].diem + doiA[i].diem;
                const chenhLech = Math.abs(diemA - diemB);
                if (chenhLech < chenhLechNhoNhat) {
                    capDoiTotNhat = [i, j];
                    chenhLechNhoNhat = chenhLech;
                }
            }
        }

        const [viTriA, viTriB] = capDoiTotNhat;
        [doiA[viTriA], doiB[viTriB]] = [doiB[viTriB], doiA[viTriA]];
        capNhatHaiDoi();
        hienThongBaoXepDoi("Đã đổi người giữa hai đội để giảm chênh lệch điểm.");
    });

    document.getElementById("nutChapNhanDoiHinh").addEventListener("click", () => {
        chiaDoiCanBang();
        hienThiCheckboxThanhVien();
        capNhatHaiDoi();
        luuDoiHinh(false);
    });

    document.getElementById("nutSuaThuCong").addEventListener("click", () => {
        document.getElementById("nutDoiNguoiHaiDoi").scrollIntoView({ behavior: "smooth", block: "center" });
        hienThongBaoXepDoi("Chọn thành viên bằng ô đánh dấu hoặc dùng Đổi người giữa hai đội.");
    });

    document.getElementById("nutTuChoi").addEventListener("click", () => {
        doiA = [];
        doiB = [];
        danhSachThanhVienGoc.forEach(thanhVien => {
            thanhVien.duocChon = false;
        });
        hienThiCheckboxThanhVien();
        capNhatHaiDoi();
        try {
            const danhSach = window.CourtConnectStore.docSuKien();
            const viTri = danhSach.findIndex(suKien => suKien.id === suKienDangChon.id);
            if (viTri < 0) throw new Error("Sự kiện không còn trong danh sách.");
            danhSach[viTri].doiHinh = { doiA: [], doiB: [], trangThai: "Đã từ chối" };
            window.CourtConnectStore.luuSuKien(danhSach);
            suKienDangChon = danhSach[viTri];
            document.querySelector(".nhan-ban-nhap").textContent = "Đề xuất đã từ chối";
            hienThongBaoXepDoi("Đã từ chối đề xuất; chọn thành viên để tạo đội hình mới.");
        } catch (error) {
            console.error("Không thể lưu trạng thái từ chối đội hình.", error);
            hienThongBaoXepDoi("Không thể lưu trạng thái từ chối. Vui lòng thử lại.", true);
        }
    });

    document.getElementById("nutTaoLai").addEventListener("click", () => {
        chiaDoiCanBang(true);
        hienThiCheckboxThanhVien();
        capNhatHaiDoi();
        hienThongBaoXepDoi("Đã tạo lại đội hình và cân bằng điểm trình độ.");
    });

    document.getElementById("nutLuuNhap").addEventListener("click", () => luuDoiHinh(false));

    document.getElementById("nutNguoiDung").addEventListener("click", () => {
        hienThongBaoXepDoi("Tài khoản đang đăng nhập: Thu Hương (Điều phối CLB).");
    });

    document.getElementById("nutThongBaoTop").addEventListener("click", () => {
        hienThongBaoXepDoi("Bạn không có thông báo mới.");
    });
});
