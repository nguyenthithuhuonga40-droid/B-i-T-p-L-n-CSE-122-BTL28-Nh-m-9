const KHOA_LUU_DANH_MUC = "courtconnect-danh-muc-mon";

const danhMucMacDinh = [
    {
        id: "pickleball",
        name: "Pickleball",
        code: "PB",
        levels: ["2.0–2.5", "3.0–3.5", "4.0–4.5+"],
        description: "Thể thao dùng vợt, chơi đơn hoặc đôi.",
        active: true
    },
    {
        id: "cau-long",
        name: "Cầu lông",
        code: "CL",
        levels: ["Mới bắt đầu · Làm quen kỹ thuật", "Trung bình · Đánh đôi ổn định", "Nâng cao · Chiến thuật & tốc độ"],
        description: "Dùng nhãn riêng theo môn, không quy đổi sang pickleball.",
        active: true
    },
    {
        id: "bong-ban",
        name: "Bóng bàn",
        code: "BB",
        levels: ["Mới bắt đầu", "Trung bình", "Nâng cao"],
        description: "Danh mục chờ mở rộng trên nền tảng.",
        active: false
    }
];

const danhSachMon = document.querySelector("#danh-sach-mon");
const formMon = document.querySelector("#form-mon-the-thao");
const formTimKiem = document.querySelector("#form-tim-kiem");
const tuKhoa = document.querySelector("#tu-khoa");
const locTrangThai = document.querySelector("#loc-trang-thai");
const truongTen = document.querySelector("#ten-mon");
const truongMa = document.querySelector("#ma-viet-tat");
const truongMucKyNang = document.querySelector("#cac-muc-ky-nang");
const truongMoTa = document.querySelector("#mo-ta-mon");
const truongId = document.querySelector("#ma-mon");
const loiForm = document.querySelector("#loi-form");
const loiLyDo = document.querySelector("#ly-do-loi");
const truongLyDo = document.querySelector("#ly-do-an");
const hopThoai = document.querySelector("#hop-thoai-xac-nhan");
const nutXacNhanAn = document.querySelector("#nut-xac-nhan-an");
const thongBaoTacVu = document.querySelector("#thong-bao-tac-vu");
const thongBaoTim = document.querySelector("#thong-bao-tim");
const khongCoKetQua = document.querySelector("#khong-co-ket-qua");
const tieuDeForm = document.querySelector("#tieu-de-form");
const nutLuu = document.querySelector("#nut-luu-mon");
const trangThaiMonCho = document.querySelector("#trang-thai-mon-cho");
const moTaMonCho = document.querySelector("#mo-ta-mon-cho");
const nutXemMonCho = document.querySelector("#nut-xem-mon-cho");

if (
    !(danhSachMon instanceof HTMLElement) ||
    !(formMon instanceof HTMLFormElement) ||
    !(formTimKiem instanceof HTMLFormElement) ||
    !(tuKhoa instanceof HTMLInputElement) ||
    !(locTrangThai instanceof HTMLSelectElement) ||
    !(truongTen instanceof HTMLInputElement) ||
    !(truongMa instanceof HTMLInputElement) ||
    !(truongMucKyNang instanceof HTMLInputElement) ||
    !(truongMoTa instanceof HTMLTextAreaElement) ||
    !(truongId instanceof HTMLInputElement) ||
    !(loiForm instanceof HTMLElement) ||
    !(loiLyDo instanceof HTMLElement) ||
    !(truongLyDo instanceof HTMLInputElement) ||
    !(hopThoai instanceof HTMLDialogElement) ||
    !(nutXacNhanAn instanceof HTMLButtonElement) ||
    !(thongBaoTacVu instanceof HTMLElement) ||
    !(thongBaoTim instanceof HTMLElement) ||
    !(khongCoKetQua instanceof HTMLElement) ||
    !(tieuDeForm instanceof HTMLElement) ||
    !(nutLuu instanceof HTMLButtonElement) ||
    !(trangThaiMonCho instanceof HTMLElement) ||
    !(moTaMonCho instanceof HTMLElement) ||
    !(nutXemMonCho instanceof HTMLButtonElement)
) {
    throw new Error("Trang quản lý môn thể thao thiếu thành phần cần thiết.");
}

let cacMon = danhMucMacDinh.map((mon) => ({ ...mon, levels: [...mon.levels] }));
let maMonDangChon = "pickleball";
let maMonChoVoHieuHoa = "";
let boDemThongBao;

const hienThongBao = (noiDung) => {
    thongBaoTacVu.textContent = noiDung;
    thongBaoTacVu.classList.add("dang-hien");
    window.clearTimeout(boDemThongBao);
    boDemThongBao = window.setTimeout(() => thongBaoTacVu.classList.remove("dang-hien"), 3300);
};

const luuDanhMuc = () => {
    try {
        localStorage.setItem(KHOA_LUU_DANH_MUC, JSON.stringify(cacMon));
        return true;
    } catch (loi) {
        console.error("Không thể lưu danh mục môn thể thao.", loi);
        hienThongBao("Không thể lưu danh mục trên trình duyệt này. Thay đổi vừa thực hiện đã được hoàn tác.");
        return false;
    }
};

const docDanhMuc = () => {
    try {
        const duLieu = localStorage.getItem(KHOA_LUU_DANH_MUC);
        if (!duLieu) return;

        const danhSach = JSON.parse(duLieu);
        if (
            !Array.isArray(danhSach) ||
            danhSach.some((mon) =>
                !mon ||
                typeof mon.id !== "string" ||
                !/^[a-z0-9-]{2,40}$/.test(mon.id) ||
                typeof mon.name !== "string" ||
                typeof mon.code !== "string" ||
                !Array.isArray(mon.levels) ||
                mon.levels.some((muc) => typeof muc !== "string") ||
                typeof mon.description !== "string" ||
                typeof mon.active !== "boolean"
            ) ||
            new Set(danhSach.map((mon) => mon.id)).size !== danhSach.length ||
            danhMucMacDinh.some((mon) => !danhSach.some((muc) => muc.id === mon.id))
        ) {
            throw new Error("Dữ liệu danh mục đã lưu không hợp lệ.");
        }
        cacMon = danhSach;
    } catch (loi) {
        console.error("Không thể đọc danh mục môn thể thao đã lưu.", loi);
        hienThongBao("Không thể đọc dữ liệu danh mục đã lưu. Đang dùng lại dữ liệu mẫu ban đầu.");
        cacMon = danhMucMacDinh.map((mon) => ({ ...mon, levels: [...mon.levels] }));
    }
};

const layCacMonDangLoc = () => {
    const tuKhoaDaChuanHoa = tuKhoa.value.trim().toLocaleLowerCase("vi");
    const trangThai = locTrangThai.value;
    return cacMon.filter((mon) => {
        if (!trangThai && !tuKhoaDaChuanHoa && !mon.active) return false;
        const khopTuKhoa = !tuKhoaDaChuanHoa ||
            `${mon.name} ${mon.code}`.toLocaleLowerCase("vi").includes(tuKhoaDaChuanHoa);
        const khopTrangThai = !trangThai || (trangThai === "active" ? mon.active : !mon.active);
        return khopTuKhoa && khopTrangThai;
    });
};

const taoTheMon = (mon) => {
    const the = document.createElement("article");
    the.className = "the-mon";
    the.classList.toggle("dang-duoc-chon", mon.id === maMonDangChon);

    const dauThe = document.createElement("div");
    dauThe.className = "dau-the-mon";
    const ten = document.createElement("h2");
    ten.textContent = mon.name;
    const nhanTrangThai = document.createElement("span");
    nhanTrangThai.className = `nhan-trang-thai${mon.active ? "" : " tam-an"}`;
    nhanTrangThai.textContent = mon.active ? "Đang hoạt động" : "Đã tạm ẩn";
    dauThe.append(ten, nhanTrangThai);

    const ma = document.createElement("p");
    ma.className = "ma-mon-lon";
    ma.textContent = mon.code;

    const moTa = document.createElement("p");
    moTa.className = "mo-ta-mon-card";
    mon.levels.forEach((muc, viTri) => {
        const dong = document.createElement("span");
        if (mon.id === "pickleball") {
            dong.textContent = ["Mới bắt đầu", "Trung cấp", "Nâng cao"][viTri]
                ? `${["Mới bắt đầu", "Trung cấp", "Nâng cao"][viTri]}: ${muc}`
                : muc;
        } else if (mon.id === "cau-long") {
            dong.textContent = muc;
        } else {
            dong.textContent = muc;
        }
        moTa.append(dong);
    });

    const ghiChu = document.createElement("p");
    ghiChu.className = "ghi-chu-nho";
    ghiChu.textContent = mon.id === "pickleball"
        ? "Mức kỹ năng tự đánh giá, không phải chứng nhận."
        : mon.id === "cau-long"
            ? "Dùng nhãn riêng theo môn, không quy đổi sang pickleball."
            : mon.description;

    const nutSua = document.createElement("button");
    nutSua.className = "nut nut-vien nut-sua-mon";
    nutSua.type = "button";
    nutSua.dataset.editSport = mon.id;
    nutSua.textContent = "Sửa môn & mức kỹ năng";

    the.append(dauThe, ma, moTa, ghiChu, nutSua);
    return the;
};

const veDanhMuc = () => {
    const ketQua = layCacMonDangLoc();
    danhSachMon.replaceChildren();
    ketQua.forEach((mon) => danhSachMon.append(taoTheMon(mon)));
    khongCoKetQua.hidden = ketQua.length !== 0;

    const monCho = cacMon.find((mon) => !mon.active);
    if (monCho) {
        trangThaiMonCho.textContent = `◷ ${monCho.name} · Tạm tắt`;
        moTaMonCho.textContent = monCho.id === "bong-ban"
            ? "Chỉ pickleball và cầu lông được dùng trong hành trình chính."
            : "Môn này đang ẩn khỏi các lượt tạo sân và trận mới.";
        nutXemMonCho.textContent = `Xem / bật ${monCho.name}`;
        nutXemMonCho.dataset.sportId = monCho.id;
    } else {
        trangThaiMonCho.textContent = "✓ Tất cả danh mục đang hoạt động";
        moTaMonCho.textContent = "Không còn môn thể thao nào đang tạm tắt.";
        nutXemMonCho.textContent = "Xem danh mục";
        delete nutXemMonCho.dataset.sportId;
    }
};

const datLoiForm = (noiDung) => {
    loiForm.textContent = noiDung;
    loiForm.hidden = !noiDung;
};

const layMonTheoId = (id) => cacMon.find((mon) => mon.id === id);

const hienForm = (mon) => {
    maMonDangChon = mon?.id || "";
    truongId.value = mon?.id || "";
    truongTen.value = mon?.name || "";
    truongMa.value = mon?.code || "";
    truongMucKyNang.value = mon?.levels.join(", ") || "";
    truongMoTa.value = mon?.description || "";
    tieuDeForm.textContent = mon ? `Biến thể: Chỉnh sửa ${mon.name}` : "Biến thể: Tạo môn mới";
    nutLuu.textContent = mon ? "Lưu danh mục" : "Tạo danh mục";
    datLoiForm("");
    veDanhMuc();
};

const xuLyLuuMon = (suKien) => {
    suKien.preventDefault();
    const ten = truongTen.value.trim();
    const ma = truongMa.value.trim().toLocaleUpperCase("vi");
    const mucKyNang = [...new Set(
        truongMucKyNang.value.split(",").map((muc) => muc.trim()).filter(Boolean)
    )];
    const moTa = truongMoTa.value.trim();

    if (ten.length < 2) {
        datLoiForm("Tên môn cần có ít nhất 2 ký tự.");
        truongTen.focus();
        return;
    }
    if (!/^[A-Z0-9]{2,8}$/.test(ma)) {
        datLoiForm("Mã môn cần có từ 2–8 chữ cái hoặc chữ số.");
        truongMa.focus();
        return;
    }
    if (mucKyNang.length === 0) {
        datLoiForm("Hãy nhập ít nhất một mức kỹ năng, ngăn cách bằng dấu phẩy.");
        truongMucKyNang.focus();
        return;
    }

    const trungTen = cacMon.some((mon) =>
        mon.id !== truongId.value && mon.name.toLocaleLowerCase("vi") === ten.toLocaleLowerCase("vi")
    );
    const trungMa = cacMon.some((mon) => mon.id !== truongId.value && mon.code.toLocaleUpperCase("vi") === ma);
    if (trungTen || trungMa) {
        datLoiForm(trungTen ? "Tên môn đã tồn tại. Vui lòng chọn tên khác." : "Mã môn đã tồn tại. Vui lòng chọn mã khác.");
        (trungTen ? truongTen : truongMa).focus();
        return;
    }

    const idHienTai = truongId.value;
    const monCu = idHienTai ? layMonTheoId(idHienTai) : null;
    const idMoi = idHienTai || `${ma.toLocaleLowerCase("vi").replace(/[^a-z0-9]+/g, "-")}-${Date.now().toString(36)}`;
    const monMoi = {
        id: idMoi,
        name: ten,
        code: ma,
        levels: mucKyNang,
        description: moTa,
        active: monCu?.active ?? true
    };

    if (monCu) {
        cacMon = cacMon.map((mon) => mon.id === monCu.id ? monMoi : mon);
    } else {
        cacMon = [...cacMon, monMoi];
    }

    if (!luuDanhMuc()) {
        if (monCu) cacMon = cacMon.map((mon) => mon.id === monCu.id ? monCu : mon);
        else cacMon = cacMon.filter((mon) => mon.id !== idMoi);
        veDanhMuc();
        return;
    }

    maMonDangChon = idMoi;
    veDanhMuc();
    hienForm(monMoi);
    hienThongBao(monCu ? `Đã lưu thay đổi cho ${ten}.` : `Đã thêm môn ${ten} vào danh mục.`);
};

document.querySelector("#nut-them-mon")?.addEventListener("click", () => {
    hienForm(null);
    truongTen.focus();
    document.querySelector(".the-form")?.scrollIntoView({ behavior: "smooth", block: "center" });
});

document.querySelector("#nut-huy-sua")?.addEventListener("click", () => {
    const mon = layMonTheoId(maMonDangChon) || layMonTheoId("pickleball") || null;
    hienForm(mon);
    hienThongBao("Đã hủy nội dung chỉnh sửa.");
});

formMon.addEventListener("submit", xuLyLuuMon);

formTimKiem.addEventListener("submit", (suKien) => {
    suKien.preventDefault();
    veDanhMuc();
    const soKetQua = layCacMonDangLoc().length;
    thongBaoTim.textContent = soKetQua
        ? `Tìm thấy ${soKetQua} danh mục phù hợp.`
        : "Không có danh mục nào khớp với từ khóa hoặc trạng thái đã chọn.";
});

locTrangThai.addEventListener("change", () => {
    veDanhMuc();
    thongBaoTim.textContent = "";
});

danhSachMon.addEventListener("click", (suKien) => {
    const mucTieu = suKien.target;
    if (!(mucTieu instanceof Element)) return;
    const nutSua = mucTieu.closest("[data-edit-sport]");
    if (!(nutSua instanceof HTMLButtonElement)) return;
    const id = nutSua.dataset.editSport;
    const mon = id ? layMonTheoId(id) : null;
    if (!mon) throw new Error("Không tìm thấy danh mục môn thể thao cần sửa.");
    hienForm(mon);
    document.querySelector(".the-form")?.scrollIntoView({ behavior: "smooth", block: "center" });
});

nutXemMonCho.addEventListener("click", () => {
    const maMonCho = nutXemMonCho.dataset.sportId;
    const monCho = maMonCho ? layMonTheoId(maMonCho) : null;
    if (!monCho) {
        hienThongBao("Không tìm thấy danh mục bóng bàn trong dữ liệu hiện tại.");
        return;
    }
    if (!monCho.active) {
        const xacNhanBat = window.confirm(`Bật ${monCho.name} cho các lượt tạo sân và trận mới trong bản xem trước?`);
        if (!xacNhanBat) {
            hienForm(monCho);
            document.querySelector(".the-form")?.scrollIntoView({ behavior: "smooth", block: "center" });
            hienThongBao(`${monCho.name} vẫn đang tạm ẩn.`);
            return;
        }
        monCho.active = true;
        if (!luuDanhMuc()) {
            monCho.active = false;
            return;
        }
        hienThongBao(`Đã bật danh mục ${monCho.name} trong bản xem trước.`);
    }
    hienForm(monCho);
    document.querySelector(".the-form")?.scrollIntoView({ behavior: "smooth", block: "center" });
    if (monCho.active) {
        hienThongBao(`Đang chỉnh sửa danh mục ${monCho.name}.`);
    }
});

const nutMoXacNhan = document.querySelector("#nut-mo-xac-nhan");
nutMoXacNhan?.addEventListener("click", () => {
    const lyDo = truongLyDo.value.trim();
    if (lyDo.length < 5) {
        loiLyDo.textContent = "Vui lòng nhập lý do cụ thể (ít nhất 5 ký tự).";
        loiLyDo.hidden = false;
        truongLyDo.focus();
        return;
    }

    const mon = layMonTheoId(maMonDangChon);
    if (!mon) {
        loiLyDo.textContent = "Hãy chọn một môn thể thao trong danh sách trước khi vô hiệu hóa.";
        loiLyDo.hidden = false;
        return;
    }
    if (!mon.active) {
        hienThongBao(`${mon.name} đã tạm ẩn.`);
        return;
    }
    maMonChoVoHieuHoa = mon.id;
    loiLyDo.hidden = true;
    loiLyDo.textContent = "";
    const tenHopThoai = document.querySelector("#tieu-de-hop-thoai");
    const noiDungHopThoai = document.querySelector("#noi-dung-hop-thoai");
    const nutXacNhan = document.querySelector("#nut-xac-nhan-an");
    if (
        !(tenHopThoai instanceof HTMLElement) ||
        !(noiDungHopThoai instanceof HTMLElement) ||
        !(nutXacNhan instanceof HTMLButtonElement)
    ) {
        throw new Error("Không tìm thấy nội dung hộp thoại xác nhận.");
    }
    tenHopThoai.textContent = `Xác nhận tạm ẩn ${mon.name}?`;
    noiDungHopThoai.textContent = `${lyDo} Các sân, đơn và sự kiện đã tạo sẽ được giữ nguyên; người dùng không thể tạo mới với môn này.`;
    nutXacNhan.textContent = `Xác nhận tạm ẩn ${mon.code}`;
    hopThoai.showModal();
});

document.querySelector("#nut-dong-hop-thoai")?.addEventListener("click", () => hopThoai.close());

nutXacNhanAn.addEventListener("click", () => {
    const mon = layMonTheoId(maMonChoVoHieuHoa);
    if (!mon) {
        throw new Error("Danh mục cần vô hiệu hóa không còn tồn tại.");
    }
    if (!mon.active) {
        hopThoai.close();
        return;
    }
    mon.active = false;
    if (!luuDanhMuc()) {
        mon.active = true;
        return;
    }
    hopThoai.close();
    maMonDangChon = mon.id;
    hienForm(mon);
    truongLyDo.value = "";
    hienThongBao(`Đã tạm ẩn ${mon.name}. Sân và đơn hiện có vẫn được giữ nguyên.`);
});

document.querySelector("#nut-tai-khoan")?.addEventListener("click", () => {
    hienThongBao("Đang đăng nhập với vai trò Quản trị viên · Hải Nam.");
});

truongLyDo.addEventListener("input", () => {
    loiLyDo.hidden = true;
    loiLyDo.textContent = "";
});

docDanhMuc();
veDanhMuc();
hienForm(layMonTheoId("pickleball") || cacMon[0] || null);
