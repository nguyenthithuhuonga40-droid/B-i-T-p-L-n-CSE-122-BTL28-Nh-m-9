const KHOA_DAT_SAN = "courtconnect.demoBookings";
const cacDatSanMacDinh = [
    { id: "CC-101", ten: "Nguyễn Minh Anh", ngay: "10/10/2026", gio: "16:00–18:00", mon: "Pickleball", san: "P01", chiPhi: "360.000đ", trangThai: "cho-xac-nhan" },
    { id: "CC-102", ten: "Trần Đức Long", ngay: "10/10/2026", gio: "18:00–20:00", mon: "Pickleball", san: "P03", chiPhi: "360.000đ", trangThai: "da-xac-nhan" },
    { id: "CC-103", ten: "Lê Thu Hà", ngay: "11/10/2026", gio: "14:00–16:00", mon: "Cầu lông", san: "C02", chiPhi: "240.000đ", trangThai: "cho-xac-nhan" }
];
const danhSachDatSan = document.querySelector("#danh-sach-dat-san");
const locTrangThai = document.querySelector("#loc-trang-thai");
const thongBao = document.querySelector("#thong-bao-chu-san");
const khongCoYeuCau = document.querySelector("#khong-co-yeu-cau");

if (
    !(danhSachDatSan instanceof HTMLTableSectionElement) ||
    !(locTrangThai instanceof HTMLSelectElement) ||
    !(thongBao instanceof HTMLElement) ||
    !(khongCoYeuCau instanceof HTMLElement)
) {
    throw new Error("Trang quản lý sân thiếu thành phần cần thiết.");
}

function taiDanhSachDatSan() {
    const daLuu = localStorage.getItem(KHOA_DAT_SAN);
    if (!daLuu) {
        localStorage.setItem(KHOA_DAT_SAN, JSON.stringify(cacDatSanMacDinh));
        return cacDatSanMacDinh;
    }

    const duLieu = JSON.parse(daLuu);
    if (!Array.isArray(duLieu) || !duLieu.every((datSan) =>
        datSan &&
        typeof datSan.id === "string" &&
        typeof datSan.ten === "string" &&
        ["cho-xac-nhan", "da-xac-nhan", "da-tu-choi"].includes(datSan.trangThai)
    )) {
        throw new Error("Danh sách đặt sân demo trong bộ nhớ trình duyệt không hợp lệ.");
    }
    return duLieu;
}

let cacDatSan = [];

function capNhatSoLieu() {
    const soCho = document.querySelector("#so-cho-xac-nhan");
    const soDaXacNhan = document.querySelector("#so-da-xac-nhan");
    const soDaTuChoi = document.querySelector("#so-da-tu-choi");
    if (
        !(soCho instanceof HTMLElement) ||
        !(soDaXacNhan instanceof HTMLElement) ||
        !(soDaTuChoi instanceof HTMLElement)
    ) {
        throw new Error("Không tìm thấy các số liệu tổng quan đặt sân.");
    }

    soCho.textContent = String(cacDatSan.filter((datSan) => datSan.trangThai === "cho-xac-nhan").length);
    soDaXacNhan.textContent = String(cacDatSan.filter((datSan) => datSan.trangThai === "da-xac-nhan").length);
    soDaTuChoi.textContent = String(cacDatSan.filter((datSan) => datSan.trangThai === "da-tu-choi").length);
}

function taoNutThaoTac(datSan, nhan, trangThaiMoi) {
    const nut = document.createElement("button");
    nut.type = "button";
    nut.textContent = nhan;
    nut.disabled = datSan.trangThai !== "cho-xac-nhan";
    nut.addEventListener("click", () => {
        const danhSachMoi = cacDatSan.map((muc) =>
            muc.id === datSan.id ? { ...muc, trangThai: trangThaiMoi } : muc
        );

        try {
            localStorage.setItem(KHOA_DAT_SAN, JSON.stringify(danhSachMoi));
            cacDatSan = danhSachMoi;
            thongBao.textContent = `${nhan} yêu cầu ${datSan.id}.`;
            veDanhSachDatSan();
        } catch (loi) {
            thongBao.textContent = loi instanceof Error
                ? `Không thể lưu thay đổi: ${loi.message}`
                : "Không thể lưu thay đổi do lỗi không xác định.";
        }
    });
    return nut;
}

function veDanhSachDatSan() {
    const trangThaiLoc = locTrangThai.value;
    const danhSachHienThi = cacDatSan.filter((datSan) =>
        trangThaiLoc === "tat-ca" || datSan.trangThai === trangThaiLoc
    );
    danhSachDatSan.replaceChildren();
    khongCoYeuCau.hidden = danhSachHienThi.length > 0;

    danhSachHienThi.forEach((datSan) => {
        const dong = document.createElement("tr");
        const oNguoiDat = document.createElement("td");
        const tenNguoiDat = document.createElement("strong");
        tenNguoiDat.textContent = datSan.ten;
        oNguoiDat.append(tenNguoiDat);

        const oLich = document.createElement("td");
        oLich.textContent = `${datSan.ngay} · ${datSan.gio}`;
        const oMonSan = document.createElement("td");
        oMonSan.textContent = `${datSan.mon} · ${datSan.san}`;
        const oChiPhi = document.createElement("td");
        oChiPhi.textContent = datSan.chiPhi;
        const oTrangThai = document.createElement("td");
        const nhanTrangThai = document.createElement("span");
        nhanTrangThai.className = `nhan-trang-thai nhan-${datSan.trangThai}`;
        nhanTrangThai.textContent = {
            "cho-xac-nhan": "Chờ xác nhận",
            "da-xac-nhan": "Đã xác nhận",
            "da-tu-choi": "Đã từ chối"
        }[datSan.trangThai];
        oTrangThai.append(nhanTrangThai);

        const oThaoTac = document.createElement("td");
        const nhomNut = document.createElement("div");
        nhomNut.className = "cac-thao-tac";
        nhomNut.append(
            taoNutThaoTac(datSan, "Xác nhận", "da-xac-nhan"),
            taoNutThaoTac(datSan, "Từ chối", "da-tu-choi")
        );
        oThaoTac.append(nhomNut);
        dong.append(oNguoiDat, oLich, oMonSan, oChiPhi, oTrangThai, oThaoTac);
        danhSachDatSan.append(dong);
    });
    capNhatSoLieu();
}

try {
    cacDatSan = taiDanhSachDatSan();
    veDanhSachDatSan();
} catch (loi) {
    thongBao.textContent = loi instanceof Error
        ? `Không thể tải danh sách đặt sân: ${loi.message}`
        : "Không thể tải danh sách đặt sân do lỗi không xác định.";
}

locTrangThai.addEventListener("change", veDanhSachDatSan);
