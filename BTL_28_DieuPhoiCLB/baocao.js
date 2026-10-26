const KHOA_LUU_BAO_CAO = "courtconnect-bao-cao-da-luu";

const baoCaoMacDinh = [
    {
        id: "bao-cao-dau-thang-10",
        name: "Nhịp chơi đầu tháng 10",
        range: "01–10/10 · Tất cả",
        creator: "Hải Nam",
        status: "saved",
        filters: { start: "2026-10-01", end: "2026-10-10", location: "", sport: "" }
    },
    {
        id: "pickleball-cuoi-thang-9",
        name: "Pickleball cuối tháng 9",
        range: "20–30/09 · Pickleball",
        creator: "Hải Nam",
        status: "saved",
        filters: { start: "2026-09-20", end: "2026-09-30", location: "", sport: "Pickleball" }
    },
    {
        id: "tong-ket-thang-8",
        name: "Tổng kết tháng 8",
        range: "01–31/08 · Tất cả",
        creator: "Hải Nam",
        status: "archived",
        filters: { start: "2026-08-01", end: "2026-08-31", location: "", sport: "" }
    }
];

const formBoLoc = document.querySelector("#form-bo-loc");
const ngayBatDau = document.querySelector("#ngay-bat-dau");
const ngayKetThuc = document.querySelector("#ngay-ket-thuc");
const locDiaDiem = document.querySelector("#loc-dia-diem");
const locMon = document.querySelector("#loc-mon");
const thongBaoLoc = document.querySelector("#thong-bao-loc");
const danhSachBaoCao = document.querySelector("#danh-sach-bao-cao");
const thongTinBang = document.querySelector("#thong-tin-bang");
const khongCoKetQua = document.querySelector("#khong-co-ket-qua");
const tenBaoCao = document.querySelector("#ten-bao-cao");
const formLuuBaoCao = document.querySelector("#form-luu-bao-cao");
const nutLuuTru = document.querySelector("#nut-luu-tru");
const hopThoai = document.querySelector("#hop-thoai-bao-cao");
const tieuDeHopThoai = document.querySelector("#tieu-de-hop-thoai");
const noiDungHopThoai = document.querySelector("#noi-dung-hop-thoai");
const nutXacNhanHopThoai = document.querySelector("#nut-xac-nhan-hop-thoai");
const thongBaoTacVu = document.querySelector("#thong-bao-tac-vu");
const thanhMon = document.querySelector("#thanh-mon");
const bieuDoCot = document.querySelector("#bieu-do-cot");

if (
    !(formBoLoc instanceof HTMLFormElement) ||
    !(ngayBatDau instanceof HTMLInputElement) ||
    !(ngayKetThuc instanceof HTMLInputElement) ||
    !(locDiaDiem instanceof HTMLSelectElement) ||
    !(locMon instanceof HTMLSelectElement) ||
    !(thongBaoLoc instanceof HTMLElement) ||
    !(danhSachBaoCao instanceof HTMLElement) ||
    !(thongTinBang instanceof HTMLElement) ||
    !(khongCoKetQua instanceof HTMLElement) ||
    !(tenBaoCao instanceof HTMLInputElement) ||
    !(formLuuBaoCao instanceof HTMLFormElement) ||
    !(nutLuuTru instanceof HTMLButtonElement) ||
    !(hopThoai instanceof HTMLDialogElement) ||
    !(tieuDeHopThoai instanceof HTMLElement) ||
    !(noiDungHopThoai instanceof HTMLElement) ||
    !(nutXacNhanHopThoai instanceof HTMLButtonElement) ||
    !(thongBaoTacVu instanceof HTMLElement) ||
    !(thanhMon instanceof HTMLElement) ||
    !(bieuDoCot instanceof HTMLElement)
) {
    throw new Error("Trang báo cáo thiếu thành phần cần thiết.");
}

let cacBaoCao = baoCaoMacDinh.map((baoCao) => ({ ...baoCao, filters: { ...baoCao.filters } }));
let baoCaoDangChon = "";
let hanhDongHopThoai = null;
let boDemThongBao;

const hienThongBao = (noiDung) => {
    thongBaoTacVu.textContent = noiDung;
    thongBaoTacVu.classList.add("dang-hien");
    window.clearTimeout(boDemThongBao);
    boDemThongBao = window.setTimeout(() => thongBaoTacVu.classList.remove("dang-hien"), 3200);
};

const luuDanhSachBaoCao = () => {
    try {
        localStorage.setItem(KHOA_LUU_BAO_CAO, JSON.stringify(cacBaoCao));
        return true;
    } catch (loi) {
        console.error("Không thể lưu báo cáo.", loi);
        hienThongBao("Không thể lưu báo cáo trên trình duyệt này.");
        return false;
    }
};

const docDanhSachBaoCao = () => {
    try {
        const duLieu = localStorage.getItem(KHOA_LUU_BAO_CAO);
        if (!duLieu) return;
        const danhSach = JSON.parse(duLieu);
        if (
            !Array.isArray(danhSach) ||
            danhSach.some((baoCao) =>
                !baoCao ||
                typeof baoCao.id !== "string" ||
                typeof baoCao.name !== "string" ||
                typeof baoCao.range !== "string" ||
                typeof baoCao.creator !== "string" ||
                !["saved", "archived"].includes(baoCao.status) ||
                !baoCao.filters ||
                typeof baoCao.filters.start !== "string" ||
                typeof baoCao.filters.end !== "string" ||
                typeof baoCao.filters.location !== "string" ||
                typeof baoCao.filters.sport !== "string"
            ) ||
            new Set(danhSach.map((baoCao) => baoCao.id)).size !== danhSach.length
        ) {
            throw new Error("Dữ liệu báo cáo đã lưu không hợp lệ.");
        }
        cacBaoCao = danhSach;
    } catch (loi) {
        console.error("Không thể đọc các báo cáo đã lưu.", loi);
        hienThongBao("Không thể đọc báo cáo đã lưu. Đang dùng dữ liệu mẫu.");
        cacBaoCao = baoCaoMacDinh.map((baoCao) => ({ ...baoCao, filters: { ...baoCao.filters } }));
    }
};

const layBoLocHienTai = () => ({
    start: ngayBatDau.value,
    end: ngayKetThuc.value,
    location: locDiaDiem.value,
    sport: locMon.value
});

const soNgay = (start, end) => {
    const mocDau = new Date(`${start}T00:00:00`);
    const mocCuoi = new Date(`${end}T00:00:00`);
    if (Number.isNaN(mocDau.getTime()) || Number.isNaN(mocCuoi.getTime()) || mocCuoi < mocDau) return 0;
    return Math.floor((mocCuoi - mocDau) / 86400000) + 1;
};

const tinhChiSo = () => {
    const filters = layBoLocHienTai();
    const days = soNgay(filters.start, filters.end);
    const dateFactor = days ? Math.min(1.5, Math.max(0.25, days / 10)) : 1;
    const locationFactor = filters.location ? 0.36 : 1;
    const sportFactor = filters.sport ? (filters.sport === "Pickleball" ? 0.65 : filters.sport === "Cầu lông" ? 0.35 : 0.18) : 1;
    const factor = dateFactor * locationFactor * sportFactor;
    const total = Math.max(0, Math.round(120 * factor));
    const completed = Math.round(total * 0.8);
    const participants = completed * 4;
    return { total, completed, participants, absent: Math.round(participants * 0.0625), factor };
};

const veChiSo = () => {
    const metrics = tinhChiSo();
    document.querySelector("#chi-so-don").textContent = String(metrics.total);
    document.querySelector("#chi-so-luot").textContent = String(metrics.participants);
    document.querySelector("#chi-so-buoi").textContent = String(metrics.completed);
    document.querySelector("#chi-so-vang").textContent = metrics.participants
        ? `${(metrics.absent / metrics.participants * 100).toLocaleString("vi-VN", { maximumFractionDigits: 2 })}%`
        : "0%";
    document.querySelector("#ghi-chu-luot").textContent = `${metrics.completed} buổi hoàn thành × 4 người`;
    document.querySelector("#chi-so-vang").nextElementSibling.textContent = `${metrics.absent}/${metrics.participants} lượt mẫu`;
    document.querySelector("#ghi-chu-mon").textContent = `Đã hoàn thành ${metrics.completed} · Đã hủy ${Math.round(metrics.total * 0.1)} · Chờ xác nhận ${Math.max(0, metrics.total - metrics.completed - Math.round(metrics.total * 0.1))}`;
    document.querySelector("#tong-don-mon").textContent = String(metrics.total);

    const mon = locMon.value;
    const values = mon
        ? [{ name: mon, count: metrics.total }]
        : [
            { name: "Pickleball", count: Math.round(metrics.total * 0.65) },
            { name: "Cầu lông", count: metrics.total - Math.round(metrics.total * 0.65) }
        ];
    const maxCount = Math.max(1, ...values.map((item) => item.count));
    thanhMon.replaceChildren(...values.map((item) => {
        const row = document.createElement("div");
        row.className = "dong-mon";
        const label = document.createElement("div");
        label.className = "nhan-mon";
        const name = document.createElement("strong");
        name.textContent = item.name;
        const count = document.createElement("span");
        count.textContent = `${item.count} đơn · ${metrics.total ? Math.round(item.count / metrics.total * 100) : 0}%`;
        label.append(name, count);
        const track = document.createElement("div");
        track.className = "nen-thanh-mon";
        const fill = document.createElement("span");
        fill.className = "do-dai-thanh-mon";
        fill.style.width = `${item.count ? Math.max(8, item.count / maxCount * 100) : 0}%`;
        track.append(fill);
        row.append(label, track);
        return row;
    }));

    const trendFactor = filtersFactor(layBoLocHienTai());
    const participantsPerWeek = Math.max(0, Math.round(metrics.participants / 3));
    const bars = [
        { label: "01–03/10", count: Math.round(8 * trendFactor) },
        { label: "04–06/10", count: Math.round(10 * trendFactor) },
        { label: "07–10/10", count: Math.round(6 * trendFactor) }
    ];
    const maxBar = Math.max(1, ...bars.map((bar) => bar.count));
    bieuDoCot.replaceChildren(...bars.map((bar) => {
        const column = document.createElement("div");
        column.className = "cot-tuan";
        const value = document.createElement("span");
        value.className = "gia-tri-cot";
        value.textContent = `${bar.count}/${participantsPerWeek}`;
        const stem = document.createElement("span");
        stem.className = "than-cot";
        stem.style.height = `${Math.max(14, bar.count / maxBar * 48)}px`;
        const label = document.createElement("span");
        label.className = "nhan-tuan";
        label.textContent = bar.label;
        column.append(value, stem, label);
        return column;
    }));
};

const filtersFactor = (filters) => {
    const days = soNgay(filters.start, filters.end);
    const dateFactor = days ? Math.min(1.5, Math.max(0.25, days / 10)) : 1;
    const locationFactor = filters.location ? 0.36 : 1;
    const sportFactor = filters.sport ? 0.65 : 1;
    return Math.max(0.25, dateFactor * locationFactor * sportFactor);
};

const dinhDangPhanVi = (filters) => {
    const format = (date) => {
        if (!date) return "—";
        const [year, month, day] = date.split("-");
        return `${day}/${month}`;
    };
    const sport = filters.sport || "Tất cả";
    const location = filters.location ? ` · ${filters.location}` : "";
    return `${format(filters.start)}–${format(filters.end)} · ${sport}${location}`;
};

const taoNutHanhDong = (label, action, id) => {
    const button = document.createElement("button");
    button.className = "nut-hanh-dong";
    button.type = "button";
    button.dataset.action = action;
    button.dataset.reportId = id;
    button.textContent = label;
    return button;
};

const taoDongBaoCao = (baoCao) => {
    const row = document.createElement("tr");
    const name = document.createElement("td");
    name.textContent = baoCao.name;
    const range = document.createElement("td");
    range.textContent = baoCao.range;
    const creator = document.createElement("td");
    creator.textContent = baoCao.creator;
    const statusCell = document.createElement("td");
    const status = document.createElement("span");
    status.className = `trang-thai-bao-cao${baoCao.status === "archived" ? " luu-tru" : ""}`;
    status.textContent = baoCao.status === "saved" ? "Đã lưu" : "Đã lưu trữ";
    statusCell.append(status);
    const actions = document.createElement("td");
    const actionGroup = document.createElement("div");
    actionGroup.className = "thao-tac";
    if (baoCao.status === "saved") {
        actionGroup.append(
            taoNutHanhDong("Đọc", "read", baoCao.id),
            document.createTextNode("·"),
            taoNutHanhDong("Lưu trữ", "archive", baoCao.id)
        );
    } else {
        actionGroup.append(
            taoNutHanhDong("Đọc", "read", baoCao.id),
            document.createTextNode("·"),
            taoNutHanhDong("Khôi phục", "restore", baoCao.id)
        );
    }
    actions.append(actionGroup);
    row.append(name, range, creator, statusCell, actions);
    return row;
};

const veDanhSachBaoCao = () => {
    danhSachBaoCao.replaceChildren(...cacBaoCao.map(taoDongBaoCao));
    thongTinBang.textContent = `Hiển thị ${cacBaoCao.length} bản ghi minh họa · Trang 1`;
    khongCoKetQua.hidden = cacBaoCao.length !== 0;
};

const luuBaoCaoMoi = (name) => {
    const filters = layBoLocHienTai();
    const report = {
        id: `bao-cao-${Date.now().toString(36)}`,
        name,
        range: dinhDangPhanVi(filters),
        creator: "Hải Nam",
        status: "saved",
        filters
    };
    cacBaoCao = [report, ...cacBaoCao];
    if (!luuDanhSachBaoCao()) {
        cacBaoCao = cacBaoCao.filter((item) => item.id !== report.id);
        return;
    }
    veDanhSachBaoCao();
    tenBaoCao.value = "";
    hienThongBao(`Đã lưu báo cáo “${name}”.`);
};

const moHopThoai = (title, message, action) => {
    tieuDeHopThoai.textContent = title;
    noiDungHopThoai.textContent = message;
    hanhDongHopThoai = action;
    if (!hopThoai.open) hopThoai.showModal();
};

const xuLyHanhDong = (event) => {
    const target = event.target;
    if (!(target instanceof Element)) return;
    const button = target.closest("[data-action]");
    if (!(button instanceof HTMLButtonElement)) return;
    const report = cacBaoCao.find((item) => item.id === button.dataset.reportId);
    if (!report) throw new Error("Không tìm thấy báo cáo đã chọn.");

    baoCaoDangChon = report.id;
    if (button.dataset.action === "read") {
        const range = report.range;
        moHopThoai(
            report.name,
            `Phạm vi: ${range}. Người tạo: ${report.creator}. Trạng thái: ${report.status === "saved" ? "Đã lưu" : "Đã lưu trữ"}. Đây là ảnh chụp bộ lọc và dữ liệu minh họa.`,
            "read"
        );
    } else if (button.dataset.action === "archive") {
        moHopThoai("Lưu trữ báo cáo?", `“${report.name}” sẽ được chuyển vào mục đã lưu trữ. Bạn có thể khôi phục báo cáo bất cứ lúc nào.`, "archive");
    } else if (button.dataset.action === "restore") {
        moHopThoai("Khôi phục báo cáo?", `“${report.name}” sẽ trở lại danh sách báo cáo đang lưu.`, "restore");
    }
};

formBoLoc.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!ngayBatDau.value || !ngayKetThuc.value || soNgay(ngayBatDau.value, ngayKetThuc.value) === 0) {
        thongBaoLoc.textContent = "Ngày kết thúc phải bằng hoặc sau ngày bắt đầu.";
        ngayKetThuc.focus();
        return;
    }
    veChiSo();
    thongBaoLoc.textContent = `Đang xem ${dinhDangPhanVi(layBoLocHienTai())}.`;
});

document.querySelector("#nut-tao-bao-cao").addEventListener("click", () => {
    tenBaoCao.focus();
    tenBaoCao.scrollIntoView({ behavior: "smooth", block: "center" });
});

document.querySelector("#nut-luu-bo-loc").addEventListener("click", () => {
    const filters = layBoLocHienTai();
    const sportName = filters.sport || "Tổng hợp";
    const dateName = filters.start && filters.end
        ? `${filters.start.slice(8, 10)}-${filters.end.slice(8, 10)}/${filters.end.slice(5, 7)}`
        : "thời gian đã chọn";
    luuBaoCaoMoi(`${sportName} · ${dateName}`);
});

formLuuBaoCao.addEventListener("submit", (event) => {
    event.preventDefault();
    const name = tenBaoCao.value.trim();
    if (name.length < 3) {
        hienThongBao("Tên báo cáo cần có ít nhất 3 ký tự.");
        tenBaoCao.focus();
        return;
    }
    luuBaoCaoMoi(name);
});

danhSachBaoCao.addEventListener("click", xuLyHanhDong);

nutLuuTru.addEventListener("click", () => {
    const selected = cacBaoCao.find((item) => item.id === baoCaoDangChon);
    if (!selected) {
        hienThongBao("Hãy chọn báo cáo trong danh sách trước khi lưu trữ.");
        return;
    }
    if (selected.status === "archived") {
        hienThongBao("Báo cáo đã ở trong mục lưu trữ.");
        return;
    }
    moHopThoai("Xác nhận lưu trữ báo cáo?", `“${selected.name}” sẽ được chuyển vào mục đã lưu trữ.`, "archive");
});

nutXacNhanHopThoai.addEventListener("click", () => {
    const report = cacBaoCao.find((item) => item.id === baoCaoDangChon);
    if (hanhDongHopThoai === "read") {
        hopThoai.close();
        return;
    }
    if (!report) throw new Error("Không tìm thấy báo cáo cần thay đổi.");
    const oldStatus = report.status;
    report.status = hanhDongHopThoai === "archive" ? "archived" : "saved";
    if (!luuDanhSachBaoCao()) {
        report.status = oldStatus;
        return;
    }
    veDanhSachBaoCao();
    hopThoai.close();
    hienThongBao(report.status === "archived"
        ? `Đã lưu trữ “${report.name}”.`
        : `Đã khôi phục “${report.name}”.`);
    hanhDongHopThoai = null;
});

document.querySelector("#nut-dong-hop-thoai").addEventListener("click", () => hopThoai.close());
hopThoai.addEventListener("click", (event) => {
    if (event.target === hopThoai) hopThoai.close();
});

docDanhSachBaoCao();
baoCaoDangChon = cacBaoCao.find((baoCao) => baoCao.status === "saved")?.id || cacBaoCao[0]?.id || "";
veChiSo();
veDanhSachBaoCao();