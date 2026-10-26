const KHOA_LUU_NGUOI_DUNG = "courtconnect-nguoi-dung";

const nguoiDungMacDinh = [
    { id: "nguyen-minh-anh", name: "Nguyễn Minh Anh", email: "minhanh@example.com", role: "Người chơi", status: "active" },
    { id: "tran-tuan-phong", name: "Trần Tuấn Phong", email: "phong@example.com", role: "Chủ sân", status: "active" },
    { id: "vu-lan-phuong", name: "Vũ Lan Phương", email: "phuong@example.com", role: "Điều phối CLB", status: "active" },
    { id: "le-hai-nam", name: "Lê Hải Nam", email: "nam@example.com", role: "Quản trị viên", status: "active" },
    { id: "le-ngoc-mai", name: "Lê Ngọc Mai", email: "mai@example.com", role: "Người chơi", status: "active" },
    { id: "bui-hai-yen", name: "Bùi Hải Yến", email: "yen@example.com", role: "Người chơi", status: "pending" },
    { id: "pham-van-son", name: "Phạm Văn Sơn", email: "son@example.com", role: "Chủ sân", status: "inactive" }
];

const danhSachNguoiDung = document.querySelector("#danh-sach-nguoi-dung");
const formTimKiem = document.querySelector("#form-tim-kiem");
const formNguoiDung = document.querySelector("#form-nguoi-dung");
const tuKhoa = document.querySelector("#tu-khoa");
const locVaiTro = document.querySelector("#loc-vai-tro");
const locTrangThai = document.querySelector("#loc-trang-thai");
const maNguoiDung = document.querySelector("#ma-nguoi-dung");
const tenNguoiDung = document.querySelector("#ten-nguoi-dung");
const emailNguoiDung = document.querySelector("#email-nguoi-dung");
const vaiTroNguoiDung = document.querySelector("#vai-tro-nguoi-dung");
const lyDoVaiTro = document.querySelector("#ly-do-vai-tro");
const loiForm = document.querySelector("#loi-form");
const thongTinBang = document.querySelector("#thong-tin-bang");
const khongCoKetQua = document.querySelector("#khong-co-ket-qua");
const thongBaoTacVu = document.querySelector("#thong-bao-tac-vu");
const hopThoai = document.querySelector("#hop-thoai-xac-nhan");
const tenNguoiXacNhan = document.querySelector("#ten-nguoi-xac-nhan");
const moTaXacNhan = document.querySelector("#mo-ta-xac-nhan");
const lyDoVoHieuHoa = document.querySelector("#ly-do-vo-hieu-hoa");
const loiVoHieuHoa = document.querySelector("#loi-vo-hieu-hoa");
const nutXacNhan = document.querySelector("#nut-xac-nhan");
const nutKichHoat = document.querySelector("#nut-kich-hoat");
const nutDongY = document.querySelector("#nut-dong-y");
const tieuDeHopThoai = document.querySelector("#tieu-de-hop-thoai");
const noiDungHopThoai = document.querySelector("#noi-dung-hop-thoai");

if (
    !(danhSachNguoiDung instanceof HTMLElement) ||
    !(formTimKiem instanceof HTMLFormElement) ||
    !(formNguoiDung instanceof HTMLFormElement) ||
    !(tuKhoa instanceof HTMLInputElement) ||
    !(locVaiTro instanceof HTMLSelectElement) ||
    !(locTrangThai instanceof HTMLSelectElement) ||
    !(maNguoiDung instanceof HTMLInputElement) ||
    !(tenNguoiDung instanceof HTMLInputElement) ||
    !(emailNguoiDung instanceof HTMLInputElement) ||
    !(vaiTroNguoiDung instanceof HTMLSelectElement) ||
    !(lyDoVaiTro instanceof HTMLTextAreaElement) ||
    !(loiForm instanceof HTMLElement) ||
    !(thongTinBang instanceof HTMLElement) ||
    !(khongCoKetQua instanceof HTMLElement) ||
    !(thongBaoTacVu instanceof HTMLElement) ||
    !(hopThoai instanceof HTMLDialogElement) ||
    !(tenNguoiXacNhan instanceof HTMLElement) ||
    !(moTaXacNhan instanceof HTMLElement) ||
    !(lyDoVoHieuHoa instanceof HTMLInputElement) ||
    !(loiVoHieuHoa instanceof HTMLElement) ||
    !(nutXacNhan instanceof HTMLButtonElement) ||
    !(nutKichHoat instanceof HTMLButtonElement) ||
    !(nutDongY instanceof HTMLButtonElement) ||
    !(tieuDeHopThoai instanceof HTMLElement) ||
    !(noiDungHopThoai instanceof HTMLElement)
) {
    throw new Error("Trang quản lý người dùng thiếu thành phần cần thiết.");
}

let nguoiDung = nguoiDungMacDinh.map((muc) => ({ ...muc }));
let nguoiDungDangXacNhan = "pham-van-son";
let hanhDongChoXacNhan = "";
let lyDoChoXacNhan = "";
let boDemThongBao;

const layNguoiDungTheoId = (id) => nguoiDung.find((muc) => muc.id === id);

const hienThongBao = (noiDung) => {
    thongBaoTacVu.textContent = noiDung;
    thongBaoTacVu.classList.add("dang-hien");
    window.clearTimeout(boDemThongBao);
    boDemThongBao = window.setTimeout(() => thongBaoTacVu.classList.remove("dang-hien"), 3300);
};

const luuNguoiDung = () => {
    try {
        localStorage.setItem(KHOA_LUU_NGUOI_DUNG, JSON.stringify(nguoiDung));
        return true;
    } catch (loi) {
        console.error("Không thể lưu danh sách người dùng.", loi);
        hienThongBao("Không thể lưu thay đổi trên trình duyệt này.");
        return false;
    }
};

const docNguoiDung = () => {
    try {
        const duLieu = localStorage.getItem(KHOA_LUU_NGUOI_DUNG);
        if (!duLieu) return;
        const danhSach = JSON.parse(duLieu);
        const vaiTroHopLe = ["Người chơi", "Chủ sân", "Điều phối CLB", "Quản trị viên"];
        const trangThaiHopLe = ["active", "pending", "inactive"];
        if (
            !Array.isArray(danhSach) ||
            danhSach.some((muc) =>
                !muc ||
                typeof muc.id !== "string" ||
                typeof muc.name !== "string" ||
                typeof muc.email !== "string" ||
                !vaiTroHopLe.includes(muc.role) ||
                !trangThaiHopLe.includes(muc.status) ||
                (muc.history !== undefined &&
                    (!Array.isArray(muc.history) ||
                        muc.history.some((suKien) =>
                            !suKien ||
                            typeof suKien.action !== "string" ||
                            typeof suKien.reason !== "string" ||
                            typeof suKien.at !== "string"
                        )))
            ) ||
            new Set(danhSach.map((muc) => muc.id)).size !== danhSach.length
        ) {
            throw new Error("Dữ liệu người dùng đã lưu không hợp lệ.");
        }
        nguoiDung = danhSach;
    } catch (loi) {
        console.error("Không thể đọc dữ liệu người dùng đã lưu.", loi);
        hienThongBao("Không thể đọc dữ liệu đã lưu. Đang dùng lại danh sách mẫu.");
        nguoiDung = nguoiDungMacDinh.map((muc) => ({ ...muc }));
    }
};

const tenTrangThai = (trangThai) => ({
    active: "Hoạt động",
    pending: "Chờ lời mời",
    inactive: "Vô hiệu hóa"
}[trangThai]);

const layNguoiDungDangLoc = () => {
    const tuKhoaChuanHoa = tuKhoa.value.trim().toLocaleLowerCase("vi");
    return nguoiDung.filter((muc) => {
        const khopTuKhoa = !tuKhoaChuanHoa ||
            `${muc.name} ${muc.email} ${muc.id}`.toLocaleLowerCase("vi").includes(tuKhoaChuanHoa);
        const khopVaiTro = !locVaiTro.value || muc.role === locVaiTro.value;
        const khopTrangThai = !locTrangThai.value || muc.status === locTrangThai.value;
        return khopTuKhoa && khopVaiTro && khopTrangThai;
    });
};

const taoNutHanhDong = (ten, hanhDong, id) => {
    const nut = document.createElement("button");
    nut.className = "nut-hanh-dong";
    nut.type = "button";
    nut.dataset.action = hanhDong;
    nut.dataset.userId = id;
    nut.textContent = ten;
    return nut;
};

const taoDongNguoiDung = (muc) => {
    const dong = document.createElement("tr");
    const ten = document.createElement("td");
    ten.textContent = muc.name;
    const email = document.createElement("td");
    email.textContent = muc.email;
    const vaiTro = document.createElement("td");
    vaiTro.textContent = muc.role;
    const trangThai = document.createElement("td");
    const nhanTrangThai = document.createElement("span");
    nhanTrangThai.className = `trang-thai${muc.status === "pending" ? " cho" : muc.status === "inactive" ? " vo-hieu-hoa" : ""}`;
    nhanTrangThai.textContent = tenTrangThai(muc.status);
    trangThai.append(nhanTrangThai);
    const thaoTac = document.createElement("td");
    const nhomThaoTac = document.createElement("div");
    nhomThaoTac.className = "thao-tac";

    if (muc.status === "pending") {
        nhomThaoTac.append(
            taoNutHanhDong("Gửi lại", "resend", muc.id),
            document.createTextNode("·"),
            taoNutHanhDong("Hủy", "cancel", muc.id)
        );
    } else if (muc.status === "inactive") {
        nhomThaoTac.append(
            taoNutHanhDong("Xem", "edit", muc.id),
            document.createTextNode("·"),
            taoNutHanhDong("Bật lại", "enable", muc.id)
        );
    } else {
        nhomThaoTac.append(
            taoNutHanhDong(muc.role === "Quản trị viên" ? "Xem quyền" : "Xem · Sửa", "edit", muc.id)
        );
    }
    thaoTac.append(nhomThaoTac);
    dong.append(ten, email, vaiTro, trangThai, thaoTac);
    return dong;
};

const capNhatTheXacNhan = () => {
    const muc = layNguoiDungTheoId(nguoiDungDangXacNhan);
    if (!muc) {
        tenNguoiXacNhan.textContent = "Chọn người dùng để xem trạng thái";
        moTaXacNhan.textContent = "Chọn một người dùng trong danh sách để quản lý trạng thái tài khoản.";
        nutXacNhan.hidden = true;
        nutKichHoat.hidden = true;
        return;
    }

    tenNguoiXacNhan.textContent = muc.status === "inactive"
        ? `Tài khoản ${muc.name} đã vô hiệu hóa`
        : `Vô hiệu hóa ${muc.name}?`;
    moTaXacNhan.textContent = muc.status === "inactive"
        ? "Tài khoản hiện không thể đăng nhập. Có thể bật lại để người dùng tiếp tục sử dụng dịch vụ."
        : "Chặn đăng nhập mới, giữ lịch sử. Kiểm tra các đơn đặt và sân còn hoạt động trước khi tiếp tục.";
    nutXacNhan.hidden = muc.status !== "active";
    nutKichHoat.hidden = muc.status !== "inactive";
    lyDoVoHieuHoa.value = "";
    loiVoHieuHoa.hidden = true;
    loiVoHieuHoa.textContent = "";
};

const veDanhSach = () => {
    const ketQua = layNguoiDungDangLoc();
    danhSachNguoiDung.replaceChildren(...ketQua.map(taoDongNguoiDung));
    khongCoKetQua.hidden = ketQua.length !== 0;
    thongTinBang.textContent = `Hiển thị ${ketQua.length} / ${nguoiDung.length} bản ghi minh họa · Trang 1`;
};

const hienForm = (muc) => {
    maNguoiDung.value = muc?.id || "";
    tenNguoiDung.value = muc?.name || "";
    emailNguoiDung.value = muc?.email || "";
    vaiTroNguoiDung.value = muc?.role || "Người chơi";
    lyDoVaiTro.value = "";
    loiForm.hidden = true;
    loiForm.textContent = "";
    document.querySelector("#tieu-de-form").textContent = muc
        ? `Biến thể · Chỉnh sửa ${muc.name}`
        : "Biến thể · Mời người dùng mới";
    document.querySelector("#nut-luu").textContent = muc ? "Lưu chỉnh sửa" : "Gửi lời mời";
    if (muc) {
        nguoiDungDangXacNhan = muc.id;
        capNhatTheXacNhan();
    }
};

const moHopThoai = (hanhDong, muc) => {
    hanhDongChoXacNhan = hanhDong;
    if (hanhDong === "deactivate") {
        tieuDeHopThoai.textContent = "Xác nhận vô hiệu hóa tài khoản?";
        noiDungHopThoai.textContent = `Tài khoản ${muc.name} sẽ không thể đăng nhập. Lịch sử và dữ liệu hiện có vẫn được giữ nguyên.`;
    } else if (hanhDong === "enable") {
        tieuDeHopThoai.textContent = "Bật lại tài khoản?";
        noiDungHopThoai.textContent = `${muc.name} sẽ có thể đăng nhập và tiếp tục sử dụng tài khoản.`;
    } else {
        tieuDeHopThoai.textContent = "Hủy lời mời?";
        noiDungHopThoai.textContent = `Lời mời dành cho ${muc.name} sẽ bị hủy khỏi danh sách.`;
    }
    nutDongY.textContent = hanhDong === "deactivate" ? "Vô hiệu hóa" : hanhDong === "enable" ? "Bật lại" : "Hủy lời mời";
    nutDongY.classList.toggle("nut-nguy-hiem", hanhDong !== "enable");
    if (!hopThoai.open) hopThoai.showModal();
};

const xacNhanHanhDong = () => {
    const muc = layNguoiDungTheoId(nguoiDungDangXacNhan);
    if (!muc) {
        throw new Error("Không tìm thấy người dùng đang xác nhận.");
    }

    if (hanhDongChoXacNhan === "deactivate") {
        if (muc.role === "Quản trị viên" && nguoiDung.filter((nguoi) => nguoi.role === "Quản trị viên" && nguoi.status === "active").length <= 1) {
            hienThongBao("Không thể vô hiệu hóa quản trị viên cuối cùng.");
            return;
        }
        muc.status = "inactive";
        muc.history = [
            ...(muc.history || []),
            { action: "Vô hiệu hóa tài khoản", reason: lyDoChoXacNhan, at: new Date().toISOString() }
        ];
    } else if (hanhDongChoXacNhan === "enable") {
        muc.status = "active";
    } else if (hanhDongChoXacNhan === "cancel") {
        nguoiDung = nguoiDung.filter((nguoi) => nguoi.id !== muc.id);
        if (nguoiDungDangXacNhan === muc.id) nguoiDungDangXacNhan = "";
    }

    if (!luuNguoiDung()) {
        docNguoiDung();
        return;
    }
    hopThoai.close();
    veDanhSach();
    capNhatTheXacNhan();
    hienThongBao(hanhDongChoXacNhan === "deactivate"
        ? `Đã vô hiệu hóa tài khoản ${muc.name}.`
        : hanhDongChoXacNhan === "enable"
            ? `Đã bật lại tài khoản ${muc.name}.`
            : `Đã hủy lời mời của ${muc.name}.`);
    hanhDongChoXacNhan = "";
};

formTimKiem.addEventListener("submit", (suKien) => {
    suKien.preventDefault();
    veDanhSach();
});

tuKhoa.addEventListener("input", veDanhSach);
locVaiTro.addEventListener("change", veDanhSach);
locTrangThai.addEventListener("change", () => {
    document.querySelectorAll("[data-status-filter]").forEach((nut) => {
        const dangChon = nut.dataset.statusFilter === locTrangThai.value;
        nut.classList.toggle("dang-chon", dangChon);
        nut.setAttribute("aria-pressed", String(dangChon));
    });
    veDanhSach();
});

document.querySelectorAll("[data-status-filter]").forEach((nut) => {
    nut.addEventListener("click", () => {
        locTrangThai.value = nut.dataset.statusFilter || "";
        document.querySelectorAll("[data-status-filter]").forEach((muc) => {
            const dangChon = muc === nut;
            muc.classList.toggle("dang-chon", dangChon);
            muc.setAttribute("aria-pressed", String(dangChon));
        });
        veDanhSach();
    });
});

danhSachNguoiDung.addEventListener("click", (suKien) => {
    const mucTieu = suKien.target;
    if (!(mucTieu instanceof Element)) return;
    const nut = mucTieu.closest("[data-action]");
    if (!(nut instanceof HTMLButtonElement)) return;
    const id = nut.dataset.userId;
    const muc = id ? layNguoiDungTheoId(id) : null;
    if (!muc) throw new Error("Không tìm thấy người dùng đã chọn.");

    nguoiDungDangXacNhan = muc.id;
    capNhatTheXacNhan();
    if (nut.dataset.action === "edit") {
        hienForm(muc);
        document.querySelector(".the-form").scrollIntoView({ behavior: "smooth", block: "center" });
    } else if (nut.dataset.action === "resend") {
        muc.status = "active";
        if (!luuNguoiDung()) {
            muc.status = "pending";
            return;
        }
        veDanhSach();
        capNhatTheXacNhan();
        hienThongBao(`Đã gửi lại lời mời đến ${muc.email}.`);
    } else if (nut.dataset.action === "cancel") {
        moHopThoai("cancel", muc);
    } else if (nut.dataset.action === "enable") {
        moHopThoai("enable", muc);
    }
});

formNguoiDung.addEventListener("submit", (suKien) => {
    suKien.preventDefault();
    const ten = tenNguoiDung.value.trim();
    const email = emailNguoiDung.value.trim().toLocaleLowerCase("vi");
    const vaiTro = vaiTroNguoiDung.value;
    const lyDo = lyDoVaiTro.value.trim();
    const mucCu = maNguoiDung.value ? layNguoiDungTheoId(maNguoiDung.value) : null;

    if (ten.length < 2) {
        loiForm.textContent = "Họ tên cần có ít nhất 2 ký tự.";
        loiForm.hidden = false;
        tenNguoiDung.focus();
        return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        loiForm.textContent = "Vui lòng nhập địa chỉ email hợp lệ.";
        loiForm.hidden = false;
        emailNguoiDung.focus();
        return;
    }
    if (nguoiDung.some((muc) => muc.id !== mucCu?.id && muc.email.toLocaleLowerCase("vi") === email)) {
        loiForm.textContent = "Email này đã có trong danh sách người dùng.";
        loiForm.hidden = false;
        emailNguoiDung.focus();
        return;
    }
    if (mucCu && !lyDo) {
        loiForm.textContent = "Vui lòng nêu lý do khi thay đổi thông tin hoặc vai trò.";
        loiForm.hidden = false;
        lyDoVaiTro.focus();
        return;
    }
    if (
        mucCu &&
        mucCu.status === "active" &&
        mucCu.role === "Quản trị viên" &&
        vaiTro !== "Quản trị viên" &&
        nguoiDung.filter((muc) => muc.status === "active" && muc.role === "Quản trị viên").length <= 1
    ) {
        loiForm.textContent = "Không thể hạ quyền của quản trị viên cuối cùng đang hoạt động.";
        loiForm.hidden = false;
        vaiTroNguoiDung.focus();
        return;
    }

    const mucMoi = mucCu
        ? {
            ...mucCu,
            name: ten,
            email,
            role: vaiTro,
            history: [
                ...(mucCu.history || []),
                { action: "Cập nhật thông tin và vai trò", reason: lyDo, at: new Date().toISOString() }
            ]
        }
        : {
            id: `nguoi-dung-${Date.now().toString(36)}`,
            name: ten,
            email,
            role: vaiTro,
            status: "pending"
        };
    if (mucCu) {
        nguoiDung = nguoiDung.map((muc) => muc.id === mucCu.id ? mucMoi : muc);
    } else {
        nguoiDung = [...nguoiDung, mucMoi];
    }
    if (!luuNguoiDung()) {
        if (mucCu) nguoiDung = nguoiDung.map((muc) => muc.id === mucCu.id ? mucCu : muc);
        else nguoiDung = nguoiDung.filter((muc) => muc.id !== mucMoi.id);
        veDanhSach();
        return;
    }

    nguoiDungDangXacNhan = mucMoi.id;
    veDanhSach();
    hienForm(mucMoi);
    hienThongBao(mucCu ? `Đã lưu thay đổi cho ${ten}.` : `Đã tạo lời mời cho ${email}.`);
});

document.querySelector("#nut-them-nguoi-dung").addEventListener("click", () => {
    hienForm(null);
    tenNguoiDung.focus();
    document.querySelector(".the-form").scrollIntoView({ behavior: "smooth", block: "center" });
});

document.querySelector("#nut-lam-moi").addEventListener("click", () => {
    hienForm(null);
    hienThongBao("Đã làm mới biểu mẫu mời người dùng.");
});

nutXacNhan.addEventListener("click", () => {
    const muc = layNguoiDungTheoId(nguoiDungDangXacNhan);
    if (!muc || muc.status !== "active") {
        hienThongBao("Hãy chọn một tài khoản đang hoạt động để vô hiệu hóa.");
        return;
    }
    if (lyDoVoHieuHoa.value.trim().length < 5) {
        loiVoHieuHoa.textContent = "Vui lòng nhập lý do cụ thể (ít nhất 5 ký tự).";
        loiVoHieuHoa.hidden = false;
        lyDoVoHieuHoa.focus();
        return;
    }
    lyDoChoXacNhan = lyDoVoHieuHoa.value.trim();
    moHopThoai("deactivate", muc);
});

nutKichHoat.addEventListener("click", () => {
    const muc = layNguoiDungTheoId(nguoiDungDangXacNhan);
    if (muc) moHopThoai("enable", muc);
});

nutDongY.addEventListener("click", xacNhanHanhDong);
document.querySelector("#nut-dong-hop-thoai").addEventListener("click", () => hopThoai.close());
hopThoai.addEventListener("click", (suKien) => {
    if (suKien.target === hopThoai) hopThoai.close();
});

docNguoiDung();
veDanhSach();
hienForm(layNguoiDungTheoId("nguyen-minh-anh") || null);
document.querySelector("#tieu-de-form").textContent = "Biến thể · Mới / chỉnh sửa vai trò";
nguoiDungDangXacNhan = "pham-van-son";
capNhatTheXacNhan();