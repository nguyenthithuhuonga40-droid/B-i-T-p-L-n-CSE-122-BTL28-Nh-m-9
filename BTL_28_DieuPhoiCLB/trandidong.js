const formTaoTran = document.querySelector("#form-tao-tran");
const nutTaoMoi = document.querySelector("#nut-tao-moi");
const danhSachTran = document.querySelector("#danh-sach-tran");
const hopThoaiTran = document.querySelector("#hop-thoai-tran");
const ketQuaGoiY = document.querySelector("#ket-qua-goi-y");
const ngayChoi = document.querySelector("#ngay-choi");
const thongBaoTrangThai = document.querySelector("#thong-bao-trang-thai");
const thongBaoChung = document.querySelector("#thong-bao-chung");
const thongBaoHopThoai = document.querySelector("#thong-bao-hop-thoai");
const nutXemThem = document.querySelector("#nut-xem-them");

if (
    !(formTaoTran instanceof HTMLFormElement) ||
    !(nutTaoMoi instanceof HTMLButtonElement) ||
    !(danhSachTran instanceof HTMLElement) ||
    !(hopThoaiTran instanceof HTMLDialogElement) ||
    !(ketQuaGoiY instanceof HTMLElement) ||
    !(ngayChoi instanceof HTMLInputElement) ||
    !(thongBaoTrangThai instanceof HTMLElement) ||
    !(thongBaoChung instanceof HTMLElement) ||
    !(thongBaoHopThoai instanceof HTMLElement) ||
    !(nutXemThem instanceof HTMLButtonElement)
) {
    throw new Error("Trang trận mở thiếu thành phần cần thiết.");
}

const khoaDuLieu = "courtconnect-tran-mo";
const khoaGoiYDaLuu = "courtconnect-goi-y-da-luu";
const cacGoiY = [
    { ten: "Đôi vui cuối tuần", gio: "18:00–20:00", diem: "≈ 92% phù hợp · Mô phỏng" },
    { ten: "Giao lưu nhẹ nhàng", gio: "16:00–18:00", diem: "≈ 88% phù hợp · Mô phỏng" },
    { ten: "Rally sau giờ làm", gio: "20:00–22:00", diem: "≈ 85% phù hợp · Mô phỏng" }
];
let chiSoGoiY = 0;
let tranDangXem = null;

const hienThongBao = (phanTu, noiDung) => {
    phanTu.textContent = noiDung;
};

const dinhDangNgay = (giaTri) => {
    const ngay = new Date(`${giaTri}T00:00:00`);
    return Number.isNaN(ngay.getTime()) ? "ngày chưa chọn" : `${ngay.getDate()}/${ngay.getMonth() + 1}`;
};

const docDuLieuDaLuu = () => {
    try {
        const duLieu = localStorage.getItem(khoaDuLieu);
        if (!duLieu) return [];
        const danhSach = JSON.parse(duLieu);
        return Array.isArray(danhSach) ? danhSach : [];
    } catch (loi) {
        console.error("Không thể đọc các trận đã tạo.", loi);
        hienThongBao(thongBaoChung, "Không thể đọc dữ liệu đã lưu trên thiết bị này.");
        return [];
    }
};

const luuDuLieu = (khoa, duLieu) => {
    try {
        localStorage.setItem(khoa, JSON.stringify(duLieu));
        return true;
    } catch (loi) {
        console.error("Không thể lưu dữ liệu trận mở.", loi);
        hienThongBao(thongBaoChung, "Không thể lưu trên thiết bị này. Hãy kiểm tra cài đặt bộ nhớ trình duyệt.");
        return false;
    }
};

const taoNutXemTran = (maTran) => {
    const nut = document.createElement("button");
    nut.className = "nut-phu nut-xem-tran";
    nut.type = "button";
    nut.dataset.xemTran = maTran;
    nut.textContent = "Xem trận";
    return nut;
};

const taoTheTran = (tran) => {
    const the = document.createElement("article");
    the.className = "the-tran";
    the.dataset.matchId = tran.id;

    const dauThe = document.createElement("div");
    dauThe.className = "dau-the-tran";
    const dangMo = document.createElement("span");
    dangMo.className = "nhan-dang-mo";
    dangMo.textContent = "Đang mở";
    const soNguoi = document.createElement("span");
    soNguoi.className = "so-nguoi";
    soNguoi.textContent = `${tran.soNguoi || 1}/${tran.tongNguoi || 4} người · Còn ${Math.max(0, (tran.tongNguoi || 4) - (tran.soNguoi || 1))} chỗ`;
    dauThe.append(dangMo, soNguoi);

    const ten = document.createElement("h3");
    ten.textContent = tran.ten;
    const mon = document.createElement("p");
    mon.className = "mon-trinh-do";
    mon.textContent = `${tran.mon} · ${tran.trinhDo}`;
    const chiTiet = document.createElement("div");
    chiTiet.className = "chi-tiet-tran";
    const gio = document.createElement("p");
    gio.textContent = `◷ ${tran.ngay} · ${tran.gio}`;
    const diaDiem = document.createElement("p");
    diaDiem.textContent = tran.diaDiem;
    chiTiet.append(gio, diaDiem);

    const chanThe = document.createElement("div");
    chanThe.className = "chan-the-tran";
    const gia = document.createElement("strong");
    gia.textContent = `${Number(tran.gia).toLocaleString("vi-VN")}đ / người`;
    chanThe.append(gia, taoNutXemTran(tran.id));
    the.append(dauThe, ten, mon, chiTiet, chanThe);
    return the;
};

const capNhatSoTran = () => {
    const nhanSoTran = document.querySelector("#so-tran-mo");
    if (nhanSoTran) nhanSoTran.textContent = `${danhSachTran.querySelectorAll(".the-tran").length} trận`;
};

docDuLieuDaLuu().forEach((tran) => {
    if (tran && typeof tran.id === "string" && typeof tran.ten === "string") {
        danhSachTran.append(taoTheTran(tran));
    }
});
capNhatSoTran();

nutTaoMoi.addEventListener("click", () => {
    formTaoTran.hidden = !formTaoTran.hidden;
    nutTaoMoi.setAttribute("aria-expanded", String(!formTaoTran.hidden));
    if (!formTaoTran.hidden) {
        formTaoTran.scrollIntoView({ behavior: "smooth", block: "start" });
        document.querySelector("#ten-tran-moi")?.focus();
    }
});

document.querySelector("#nut-dong-form")?.addEventListener("click", () => {
    formTaoTran.hidden = true;
    nutTaoMoi.setAttribute("aria-expanded", "false");
});

formTaoTran.addEventListener("submit", (suKien) => {
    suKien.preventDefault();
    if (!formTaoTran.reportValidity()) return;
    const duLieuForm = new FormData(formTaoTran);
    const tran = {
        id: `tran-${Date.now()}`,
        ten: String(duLieuForm.get("tenTran") || "").trim(),
        mon: String(duLieuForm.get("mon") || ""),
        trinhDo: String(duLieuForm.get("trinhDo") || ""),
        diaDiem: String(duLieuForm.get("khuVuc") || "").trim(),
        gio: String(duLieuForm.get("gio") || ""),
        ngay: dinhDangNgay(ngayChoi.value),
        gia: Number(duLieuForm.get("gia")),
        soNguoi: 1,
        tongNguoi: 4
    };
    if (!tran.ten || !tran.diaDiem || !Number.isFinite(tran.gia) || tran.gia < 0) {
        hienThongBao(thongBaoChung, "Vui lòng kiểm tra tên trận, địa điểm và mức phí.");
        return;
    }
    if (!luuDuLieu(khoaDuLieu, [...docDuLieuDaLuu(), tran])) return;
    danhSachTran.append(taoTheTran(tran));
    capNhatSoTran();
    formTaoTran.reset();
    formTaoTran.hidden = true;
    nutTaoMoi.setAttribute("aria-expanded", "false");
    hienThongBao(thongBaoChung, "Đã thêm trận vào danh sách trên thiết bị này. Đây là dữ liệu minh họa, chưa đăng lên máy chủ.");
    document.querySelector(".tran-mo")?.scrollIntoView({ behavior: "smooth", block: "start" });
});

const capNhatGoiY = (goiY) => {
    const tenGoiY = document.querySelector("#ten-goi-y");
    const nhanPhuHop = document.querySelector("#nhan-phu-hop");
    const truongTen = document.querySelector("#sua-ten-goi-y");
    const truongGio = document.querySelector("#sua-gio-goi-y");
    if (tenGoiY) tenGoiY.textContent = goiY.ten;
    if (nhanPhuHop) nhanPhuHop.textContent = goiY.diem;
    if (truongTen instanceof HTMLInputElement) truongTen.value = goiY.ten;
    if (truongGio instanceof HTMLSelectElement) truongGio.value = goiY.gio;
};

document.querySelector("#nut-goi-y")?.addEventListener("click", () => {
    ketQuaGoiY.hidden = false;
    capNhatGoiY(cacGoiY[chiSoGoiY]);
    hienThongBao(thongBaoTrangThai, "Đã tạo gợi ý dựa trên dữ liệu minh họa; không có thuật toán ghép trận hoặc máy chủ.");
});

document.querySelector("#nut-tao-lai")?.addEventListener("click", () => {
    chiSoGoiY = (chiSoGoiY + 1) % cacGoiY.length;
    ketQuaGoiY.hidden = false;
    capNhatGoiY(cacGoiY[chiSoGoiY]);
    hienThongBao(thongBaoTrangThai, "Đã tạo gợi ý minh họa khác.");
});

const nutSuaGoiY = document.querySelector("#nut-sua-goi-y");
const formSuaGoiY = document.querySelector("#form-sua-goi-y");
nutSuaGoiY?.addEventListener("click", () => {
    if (!(formSuaGoiY instanceof HTMLElement)) return;
    formSuaGoiY.hidden = !formSuaGoiY.hidden;
    nutSuaGoiY.setAttribute("aria-expanded", String(!formSuaGoiY.hidden));
});

document.querySelector("#nut-luu-sua-goi-y")?.addEventListener("click", () => {
    const ten = document.querySelector("#sua-ten-goi-y");
    const gio = document.querySelector("#sua-gio-goi-y");
    if (!(ten instanceof HTMLInputElement) || !(gio instanceof HTMLSelectElement) || !ten.reportValidity()) return;
    if (!ten.value.trim()) {
        ten.setCustomValidity("Vui lòng nhập tên trận.");
        ten.reportValidity();
        ten.setCustomValidity("");
        return;
    }
    capNhatGoiY({ ten: ten.value.trim(), gio: gio.value, diem: "Tùy chỉnh · Mô phỏng" });
    if (formSuaGoiY instanceof HTMLElement) formSuaGoiY.hidden = true;
    nutSuaGoiY?.setAttribute("aria-expanded", "false");
    hienThongBao(thongBaoTrangThai, "Đã cập nhật gợi ý trên trang này.");
});

document.querySelector("#nut-chap-nhan")?.addEventListener("click", () => {
    hienThongBao(thongBaoTrangThai, `Đã chọn “${document.querySelector("#ten-goi-y")?.textContent}”. Đây là bước xem trước; chưa gửi yêu cầu tham gia.`);
});

document.querySelector("#nut-tu-choi")?.addEventListener("click", () => {
    ketQuaGoiY.hidden = true;
    hienThongBao(thongBaoTrangThai, "Đã ẩn gợi ý. Bạn có thể tạo lại để xem gợi ý khác.");
});

const nutLuuGoiY = document.querySelector("#nut-luu-goi-y");
nutLuuGoiY?.addEventListener("click", () => {
    const dangLuu = nutLuuGoiY.getAttribute("aria-pressed") === "true";
    if (dangLuu) {
        try {
            localStorage.removeItem(khoaGoiYDaLuu);
            nutLuuGoiY.setAttribute("aria-pressed", "false");
            nutLuuGoiY.textContent = "Lưu";
            hienThongBao(thongBaoTrangThai, "Đã bỏ lưu gợi ý trên thiết bị này.");
        } catch (loi) {
            console.error("Không thể bỏ lưu gợi ý.", loi);
            hienThongBao(thongBaoTrangThai, "Không thể cập nhật trạng thái lưu trên thiết bị này.");
        }
        return;
    }
    const ten = document.querySelector("#ten-goi-y")?.textContent || "";
    const truongGio = document.querySelector("#sua-gio-goi-y");
    const gio = truongGio instanceof HTMLSelectElement ? truongGio.value : cacGoiY[chiSoGoiY].gio;
    if (luuDuLieu(khoaGoiYDaLuu, { ten, gio })) {
        nutLuuGoiY.setAttribute("aria-pressed", "true");
        nutLuuGoiY.textContent = "Đã lưu";
        hienThongBao(thongBaoTrangThai, "Đã lưu gợi ý trên thiết bị này.");
    }
});

nutXemThem.addEventListener("click", () => {
    danhSachTran.append(taoTheTran({
        id: "giao-luu-long-bien",
        ten: "Rally cuối ngày",
        mon: "Pickleball",
        trinhDo: "3.0–3.5",
        diaDiem: "Long Biên Pickle Hub · Sân P03",
        gio: "20:00–22:00",
        ngay: dinhDangNgay(ngayChoi.value),
        gia: 85000,
        soNguoi: 2,
        tongNguoi: 4
    }));
    nutXemThem.hidden = true;
    capNhatSoTran();
});

danhSachTran.addEventListener("click", (suKien) => {
    const mucTieu = suKien.target;
    if (!(mucTieu instanceof Element)) return;
    const nutXem = mucTieu.closest("[data-xem-tran]");
    if (!(nutXem instanceof HTMLButtonElement)) return;
    const theTran = nutXem.closest(".the-tran");
    if (!(theTran instanceof HTMLElement)) throw new Error("Không tìm thấy thông tin trận cần xem.");
    const tran = {
        ten: theTran.querySelector("h3")?.textContent || "Trận mở",
        chiTiet: `${theTran.querySelector(".mon-trinh-do")?.textContent || ""} · ${theTran.querySelector(".chi-tiet-tran p:first-child")?.textContent || ""} · ${theTran.querySelector(".chi-tiet-tran p:nth-child(2)")?.textContent || ""}`,
        gia: theTran.querySelector(".chan-the-tran strong")?.textContent || ""
    };
    document.querySelector("#ten-tran-hop-thoai").textContent = tran.ten;
    document.querySelector("#chi-tiet-hop-thoai").textContent = tran.chiTiet;
    document.querySelector("#gia-hop-thoai").textContent = tran.gia;
    thongBaoHopThoai.textContent = "";
    hopThoaiTran.showModal();
});

document.querySelector("#nut-gui-yeu-cau")?.addEventListener("click", (suKien) => {
    suKien.preventDefault();
    hienThongBao(thongBaoHopThoai, "Đã chọn gửi yêu cầu tham gia. Đây là bản xem trước; chưa gửi yêu cầu thật.");
});

ngayChoi.addEventListener("change", () => {
    const ngay = dinhDangNgay(ngayChoi.value);
    document.querySelectorAll("[data-ngay-tran]").forEach((phanTu) => {
        phanTu.textContent = ngay;
    });
    const lichRanh = document.querySelector("#lich-ranh");
    if (lichRanh) lichRanh.textContent = `${ngay} · 18:00–20:00`;
});

try {
    if (localStorage.getItem(khoaGoiYDaLuu)) {
        nutLuuGoiY?.setAttribute("aria-pressed", "true");
        if (nutLuuGoiY) nutLuuGoiY.textContent = "Đã lưu";
    }
} catch (loi) {
    console.error("Không thể đọc trạng thái gợi ý đã lưu.", loi);
    hienThongBao(thongBaoTrangThai, "Không thể đọc trạng thái đã lưu trên thiết bị này.");
}
