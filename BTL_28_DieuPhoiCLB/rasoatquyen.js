const KHOA_LUU_RA_SOAT = "courtconnect-ra-soat-quyen";
const userMacDinh = {
    id: "USR-001",
    name: "Nguyễn Minh Anh",
    email: "minhanh@example.com",
    role: "Người chơi",
    status: "active",
    location: "Hà Nội",
    phone: "090 123 4567",
    joined: "12/08/2026",
    skills: ["Pickleball · 3.0", "Cầu lông · Trung bình"]
};
const lichSuMacDinh = [
    { at: "10/10 · 09:30", actor: "Hải Nam", decision: "Giữ hoạt động", reason: "Quyền phù hợp nhu cầu hiện tại" },
    { at: "20/09 · 15:00", actor: "Hải Nam", decision: "Không cấp Chủ sân", reason: "Chưa có địa điểm để quản lý" },
    { at: "12/08 · 10:00", actor: "Hệ thống mô phỏng", decision: "Tạo tài khoản người chơi", reason: "Đăng ký công khai" }
];
const quyenTheoVaiTro = {
    "Người chơi": [
        "Tìm sân, đặt sân và quản lý đơn của mình",
        "Tạo trận, gửi yêu cầu và quản lý trận của mình",
        "Không quản lý sân, thành viên CLB hay hệ thống"
    ],
    "Chủ sân": [
        "Tìm sân, đặt sân và quản lý đơn của mình",
        "Quản lý sân và lịch đặt tại địa điểm được cấp",
        "Không quản trị người dùng hoặc toàn hệ thống"
    ],
    "Điều phối CLB": [
        "Tìm sân, đặt sân và quản lý hoạt động cá nhân",
        "Quản lý thành viên, lịch và sự kiện trong CLB được phân công",
        "Không quản lý sân hoặc toàn bộ hệ thống"
    ],
    "Quản trị viên": [
        "Tìm sân, đặt sân và quản lý hoạt động cá nhân",
        "Quản lý người dùng, danh mục và báo cáo hệ thống",
        "Thực hiện các quyết định quản trị có ghi lý do"
    ]
};

const phanTu = (selector) => document.querySelector(selector);
const thongTinNguoiDung = phanTu("#thong-tin-nguoi-dung");
const tieuDeTrang = phanTu("#tieu-de-trang");
const trangThaiNguoiDung = phanTu("#trang-thai-nguoi-dung");
const vaiTroHoSo = phanTu("#vai-tro-ho-so");
const vaiTroHienTai = phanTu("#vai-tro-hien-tai");
const trangThaiTruyCap = phanTu("#trang-thai-truy-cap");
const danhSachQuyen = phanTu("#danh-sach-quyen");
const lyDoRaSoat = phanTu("#ly-do-ra-soat");
const loiRaSoat = phanTu("#loi-ra-soat");
const lichSuRaSoat = phanTu("#lich-su-ra-soat");
const thongTinLichSu = phanTu("#thong-tin-lich-su");
const khongCoLichSu = phanTu("#khong-co-lich-su");
const nhanDaLuu = phanTu("#nhan-da-luu");
const thongTinSauKhiLuu = phanTu("#thong-tin-sau-khi-luu");
const thongBaoTacVu = phanTu("#thong-bao-tac-vu");
const nutLuuRaSoat = phanTu("#nut-luu-ra-soat");
const nutLuuQuyetDinh = phanTu("#nut-luu-quyet-dinh");
const nutDoiVaiTro = phanTu("#nut-doi-vai-tro");
const nutVoHieuHoa = phanTu("#nut-vo-hieu-hoa");
const nutKichHoat = phanTu("#nut-kich-hoat");
const hopThoaiQuyen = phanTu("#hop-thoai-quyen");
const vaiTroMoi = phanTu("#vai-tro-moi");
const lyDoThayDoi = phanTu("#ly-do-thay-doi");
const loiHopThoai = phanTu("#loi-hop-thoai");
const hopThoaiHoatDong = phanTu("#hop-thoai-hoat-dong");
const noiDungHoatDong = phanTu("#noi-dung-hoat-dong");
const nutXacNhanHopThoai = phanTu("#nut-xac-nhan-hop-thoai");

if (
    !(thongTinNguoiDung instanceof HTMLElement) ||
    !(tieuDeTrang instanceof HTMLElement) ||
    !(trangThaiNguoiDung instanceof HTMLElement) ||
    !(vaiTroHoSo instanceof HTMLElement) ||
    !(vaiTroHienTai instanceof HTMLElement) ||
    !(trangThaiTruyCap instanceof HTMLElement) ||
    !(danhSachQuyen instanceof HTMLElement) ||
    !(lyDoRaSoat instanceof HTMLTextAreaElement) ||
    !(loiRaSoat instanceof HTMLElement) ||
    !(lichSuRaSoat instanceof HTMLElement) ||
    !(thongTinLichSu instanceof HTMLElement) ||
    !(khongCoLichSu instanceof HTMLElement) ||
    !(nhanDaLuu instanceof HTMLElement) ||
    !(thongTinSauKhiLuu instanceof HTMLElement) ||
    !(thongBaoTacVu instanceof HTMLElement) ||
    !(nutLuuRaSoat instanceof HTMLButtonElement) ||
    !(nutLuuQuyetDinh instanceof HTMLButtonElement) ||
    !(nutDoiVaiTro instanceof HTMLButtonElement) ||
    !(nutVoHieuHoa instanceof HTMLButtonElement) ||
    !(nutKichHoat instanceof HTMLButtonElement) ||
    !(hopThoaiQuyen instanceof HTMLDialogElement) ||
    !(vaiTroMoi instanceof HTMLSelectElement) ||
    !(lyDoThayDoi instanceof HTMLTextAreaElement) ||
    !(loiHopThoai instanceof HTMLElement) ||
    !(hopThoaiHoatDong instanceof HTMLDialogElement) ||
    !(noiDungHoatDong instanceof HTMLElement) ||
    !(nutXacNhanHopThoai instanceof HTMLButtonElement)
) {
    throw new Error("Trang rà soát quyền thiếu thành phần cần thiết.");
}

let nguoiDung = { ...userMacDinh, skills: [...userMacDinh.skills] };
let lichSu = lichSuMacDinh.map((item) => ({ ...item }));
let boDemThongBao;

const hienThongBao = (message) => {
    thongBaoTacVu.textContent = message;
    thongBaoTacVu.classList.add("dang-hien");
    window.clearTimeout(boDemThongBao);
    boDemThongBao = window.setTimeout(() => thongBaoTacVu.classList.remove("dang-hien"), 3200);
};

const datTrangThaiChuaLuu = (chuaLuu) => {
    nhanDaLuu.textContent = chuaLuu ? "• Có thay đổi chưa lưu" : "✓ Quyết định đã lưu";
    nhanDaLuu.classList.toggle("chua-luu", chuaLuu);
};

const capNhatQuyen = () => {
    vaiTroHienTai.textContent = nguoiDung.role;
    vaiTroHoSo.textContent = `${nguoiDung.role} · ${nguoiDung.location}`;
    trangThaiTruyCap.textContent = nguoiDung.status === "active" ? "Đang hoạt động" : "Đã vô hiệu hóa";
    trangThaiNguoiDung.textContent = `${nguoiDung.name.split(" ").map((part) => part[0]).join("").slice(0, 2).toLocaleUpperCase("vi")} · ${nguoiDung.status === "active" ? "Hoạt động" : "Vô hiệu hóa"}`;
    trangThaiNguoiDung.classList.toggle("vo-hieu-hoa", nguoiDung.status !== "active");
    danhSachQuyen.replaceChildren(...(quyenTheoVaiTro[nguoiDung.role] || quyenTheoVaiTro["Người chơi"]).map((text, index) => {
        const item = document.createElement("li");
        item.textContent = text;
        item.classList.toggle("bi-han-che", index === 2 && nguoiDung.role === "Người chơi");
        return item;
    }));
    nutVoHieuHoa.hidden = nguoiDung.status !== "active";
    nutKichHoat.hidden = nguoiDung.status === "active";
    tieuDeTrang.textContent = nguoiDung.name;
    thongTinNguoiDung.textContent = `${nguoiDung.id} · ${nguoiDung.email} · Hồ sơ và phạm vi truy cập`;
    document.title = `Rà soát quyền: ${nguoiDung.name} | CourtConnect`;
};

const veLichSu = () => {
    lichSuRaSoat.replaceChildren(...lichSu.map((item) => {
        const row = document.createElement("tr");
        [item.at, item.actor, item.decision, item.reason].forEach((value) => {
            const cell = document.createElement("td");
            cell.textContent = value;
            row.append(cell);
        });
        return row;
    }));
    thongTinLichSu.textContent = `Hiển thị ${lichSu.length} bản ghi minh họa · Trang 1`;
    khongCoLichSu.hidden = lichSu.length > 0;
};

const luuDuLieu = () => {
    try {
        localStorage.setItem(KHOA_LUU_RA_SOAT, JSON.stringify({ user: nguoiDung, history: lichSu, reviewNote: lyDoRaSoat.value.trim() }));
        return true;
    } catch (error) {
        console.error("Không thể lưu quyết định rà soát quyền.", error);
        hienThongBao("Không thể lưu thay đổi trong trình duyệt này.");
        return false;
    }
};

const docDuLieu = () => {
    try {
        const stored = localStorage.getItem(KHOA_LUU_RA_SOAT);
        if (!stored) return;
        const data = JSON.parse(stored);
        const validRoles = Object.keys(quyenTheoVaiTro);
        if (
            !data ||
            !data.user ||
            typeof data.user.id !== "string" ||
            typeof data.user.name !== "string" ||
            typeof data.user.email !== "string" ||
            !validRoles.includes(data.user.role) ||
            !["active", "inactive"].includes(data.user.status) ||
            !Array.isArray(data.history) ||
            data.history.some((item) =>
                !item ||
                typeof item.at !== "string" ||
                typeof item.actor !== "string" ||
                typeof item.decision !== "string" ||
                typeof item.reason !== "string"
            ) ||
            typeof data.reviewNote !== "string"
        ) {
            throw new Error("Dữ liệu rà soát đã lưu không hợp lệ.");
        }
        nguoiDung = { ...userMacDinh, ...data.user, skills: [...userMacDinh.skills] };
        lichSu = data.history;
        lyDoRaSoat.value = data.reviewNote;
    } catch (error) {
        console.error("Không thể đọc dữ liệu rà soát quyền đã lưu.", error);
        hienThongBao("Không thể đọc dữ liệu đã lưu. Đang dùng hồ sơ minh họa ban đầu.");
    }
};

const thoiGianHienTai = () => {
    const now = new Date();
    return `${String(now.getDate()).padStart(2, "0")}/${String(now.getMonth() + 1).padStart(2, "0")} · ${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
};

const ghiLichSu = (decision, reason) => {
    lichSu.unshift({
        at: thoiGianHienTai(),
        actor: "Hải Nam",
        decision,
        reason
    });
    veLichSu();
};

const luuRasoat = () => {
    const reason = lyDoRaSoat.value.trim();
    if (reason.length < 5) {
        loiRaSoat.textContent = "Vui lòng nhập lý do cụ thể (ít nhất 5 ký tự).";
        loiRaSoat.hidden = false;
        lyDoRaSoat.focus();
        return;
    }
    loiRaSoat.hidden = true;
    const oldHistory = [...lichSu];
    ghiLichSu(nguoiDung.status === "active" ? "Giữ hoạt động" : "Xác nhận vô hiệu hóa", reason);
    if (!luuDuLieu()) {
        lichSu = oldHistory;
        veLichSu();
        return;
    }
    datTrangThaiChuaLuu(false);
    thongTinSauKhiLuu.textContent = `Không thay đổi quyền. Nhật ký thêm người thực hiện Hải Nam và lý do: ${reason}`;
    hienThongBao("Đã lưu quyết định rà soát quyền.");
};

const moHopThoaiVaiTro = () => {
    vaiTroMoi.value = nguoiDung.role;
    lyDoThayDoi.value = "";
    loiHopThoai.hidden = true;
    hopThoaiQuyen.showModal();
};

const xacNhanDoiVaiTro = () => {
    const role = vaiTroMoi.value;
    const reason = lyDoThayDoi.value.trim();
    if (reason.length < 5) {
        loiHopThoai.textContent = "Vui lòng nhập lý do cụ thể (ít nhất 5 ký tự).";
        loiHopThoai.hidden = false;
        lyDoThayDoi.focus();
        return;
    }
    if (!Object.hasOwn(quyenTheoVaiTro, role)) {
        loiHopThoai.textContent = "Vai trò được chọn không hợp lệ.";
        loiHopThoai.hidden = false;
        return;
    }
    const oldRole = nguoiDung.role;
    const oldHistory = [...lichSu];
    nguoiDung.role = role;
    ghiLichSu(oldRole === role ? "Xác nhận vai trò" : `Đổi vai trò: ${oldRole} → ${role}`, reason);
    if (!luuDuLieu()) {
        nguoiDung.role = oldRole;
        lichSu = oldHistory;
        veLichSu();
        return;
    }
    capNhatQuyen();
    datTrangThaiChuaLuu(false);
    thongTinSauKhiLuu.textContent = `Đã cập nhật vai trò thành ${role}. Nhật ký lưu người thực hiện Hải Nam và lý do: ${reason}`;
    hopThoaiQuyen.close();
    hienThongBao(`Đã cập nhật vai trò ${nguoiDung.name}.`);
};

const batTatTaiKhoan = (status) => {
    const reason = lyDoRaSoat.value.trim();
    if (reason.length < 5) {
        loiRaSoat.textContent = "Vui lòng nhập lý do cụ thể (ít nhất 5 ký tự).";
        loiRaSoat.hidden = false;
        lyDoRaSoat.focus();
        return;
    }
    const oldStatus = nguoiDung.status;
    const oldHistory = [...lichSu];
    nguoiDung.status = status;
    const decision = status === "inactive" ? "Vô hiệu hóa tài khoản" : "Bật lại tài khoản";
    ghiLichSu(decision, reason);
    if (!luuDuLieu()) {
        nguoiDung.status = oldStatus;
        lichSu = oldHistory;
        veLichSu();
        return;
    }
    capNhatQuyen();
    datTrangThaiChuaLuu(false);
    thongTinSauKhiLuu.textContent = `${decision} thành công. Nhật ký lưu người thực hiện Hải Nam và lý do: ${reason}`;
    hienThongBao(`${decision} ${nguoiDung.name} thành công.`);
};

lyDoRaSoat.addEventListener("input", () => {
    loiRaSoat.hidden = true;
    datTrangThaiChuaLuu(true);
});

nutLuuRaSoat.addEventListener("click", luuRasoat);
nutLuuQuyetDinh.addEventListener("click", luuRasoat);
nutDoiVaiTro.addEventListener("click", moHopThoaiVaiTro);
nutXacNhanHopThoai.addEventListener("click", xacNhanDoiVaiTro);
nutVoHieuHoa.addEventListener("click", () => {
    if (lyDoRaSoat.value.trim().length < 5) {
        loiRaSoat.textContent = "Vui lòng nhập lý do cụ thể (ít nhất 5 ký tự).";
        loiRaSoat.hidden = false;
        lyDoRaSoat.focus();
        return;
    }
    if (!window.confirm(`Vô hiệu hóa tài khoản ${nguoiDung.name}? Người dùng sẽ không thể đăng nhập. Hãy kiểm tra và ghi lý do trước khi xác nhận.`)) return;
    batTatTaiKhoan("inactive");
});
nutKichHoat.addEventListener("click", () => {
    if (lyDoRaSoat.value.trim().length < 5) {
        loiRaSoat.textContent = "Vui lòng nhập lý do cụ thể (ít nhất 5 ký tự).";
        loiRaSoat.hidden = false;
        lyDoRaSoat.focus();
        return;
    }
    if (!window.confirm(`Bật lại tài khoản ${nguoiDung.name}?`)) return;
    batTatTaiKhoan("active");
});

document.querySelector("#nut-xem-hoat-dong").addEventListener("click", () => {
    noiDungHoatDong.textContent = `${nguoiDung.name}: tham gia CourtConnect ngày ${nguoiDung.joined}; đặt sân mẫu, tham gia trận và cập nhật trình độ tự đánh giá. Đây là dữ liệu minh họa, không phải lịch sử hoạt động thực tế.`;
    hopThoaiHoatDong.showModal();
});
document.querySelector("#nut-dong-hop-thoai").addEventListener("click", () => hopThoaiQuyen.close());
document.querySelector("#nut-dong-hoat-dong").addEventListener("click", () => hopThoaiHoatDong.close());
for (const dialog of [hopThoaiQuyen, hopThoaiHoatDong]) {
    dialog.addEventListener("click", (event) => {
        if (event.target === dialog) dialog.close();
    });
}

docDuLieu();
capNhatQuyen();
veLichSu();
datTrangThaiChuaLuu(false);