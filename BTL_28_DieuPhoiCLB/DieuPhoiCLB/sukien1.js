let danhSachSuKien = [];
let trangThaiDangLoc = "sap-dien-ra";
let thongBaoTimeout;

function hienThongBao(noiDung, laLoi = false) {
    const thongBao = document.getElementById("thongBaoTrang");
    if (!thongBao) {
        if (laLoi) console.error(noiDung);
        return;
    }

    thongBao.textContent = noiDung;
    thongBao.style.backgroundColor = laLoi ? "#9f2424" : "";
    thongBao.classList.add("dang-hien");
    window.clearTimeout(thongBaoTimeout);
    thongBaoTimeout = window.setTimeout(() => thongBao.classList.remove("dang-hien"), 3200);
}

function taoLienKetHanhDong(tenHanhDong, suKien) {
    const lienKet = document.createElement("a");
    lienKet.className = "nut-thao-tac";
    lienKet.textContent = tenHanhDong;

    if (["Xem", "Xem lý do", "Sửa", "Tổng kết"].includes(tenHanhDong)) {
        const thamSo = new URLSearchParams({
            suKien: suKien.id,
            tenSuKien: suKien.tenSuKien
        });
        if (tenHanhDong === "Sửa") thamSo.set("cheDo", "sua");
        lienKet.href = `chitiet.html?${thamSo}`;
        return lienKet;
    }

    lienKet.href = "#";
    lienKet.dataset.thaoTac = tenHanhDong;
    lienKet.dataset.suKienId = suKien.id;
    return lienKet;
}

function hienThiBangSuKien(danhSach) {
    const thanBang = document.getElementById("thanBangSuKien");
    const soBanGhi = document.querySelector(".foot-bang");
    thanBang.replaceChildren();

    danhSach.forEach(suKien => {
        const hang = document.createElement("tr");
        const cotTen = document.createElement("td");
        cotTen.className = "cot-tieu-de-su-kien";
        cotTen.textContent = suKien.tenSuKien;

        const cotLich = document.createElement("td");
        cotLich.textContent = suKien.lichDiaDiem;

        const cotDangKy = document.createElement("td");
        cotDangKy.textContent = suKien.dangKy;

        const cotTrangThai = document.createElement("td");
        cotTrangThai.textContent = suKien.trangThai;

        const cotThaoTac = document.createElement("td");
        const hanhDong = suKien.luuTru
            ? ["Xem", "Khôi phục"]
            : suKien.maTrangThai === "da-huy" || suKien.maTrangThai === "hoan-thanh"
                ? ["Xem", "Lưu trữ"]
                : suKien.maTrangThai === "dang-dien-ra"
                    ? ["Xem", "Tổng kết", "Hủy"]
                    : ["Xem", "Sửa", "Hủy"];

        hanhDong.forEach((tenHanhDong, index) => {
            if (index > 0) cotThaoTac.append(" · ");
            cotThaoTac.append(taoLienKetHanhDong(tenHanhDong, suKien));
        });

        hang.append(cotTen, cotLich, cotDangKy, cotTrangThai, cotThaoTac);
        thanBang.appendChild(hang);
    });

    if (soBanGhi) {
        soBanGhi.textContent = danhSach.length
            ? `Hiển thị ${danhSach.length} sự kiện`
            : "Không tìm thấy sự kiện phù hợp.";
    }
}

function locDanhSachSuKien() {
    const tuKhoa = document.getElementById("inputTimKiem").value.trim().toLocaleLowerCase("vi");
    const mon = document.getElementById("chonMon").value;
    const nhapThang = document.getElementById("khoangNgay").value.trim();
    const khopThang = nhapThang.match(/^(?:(\d{4})-(0[1-9]|1[0-2])|(0[1-9]|1[0-2])\/(\d{4}))$/);
    const thang = khopThang
        ? `${khopThang[1] || khopThang[4]}-${khopThang[2] || khopThang[3]}`
        : "";

    const ketQua = danhSachSuKien.filter(suKien => {
        const dungLuuTru = trangThaiDangLoc === "luu-tru"
            ? suKien.luuTru
            : !suKien.luuTru;
        const dungTrangThai = trangThaiDangLoc === "tat-ca" ||
            trangThaiDangLoc === "luu-tru" ||
            suKien.maTrangThai === trangThaiDangLoc;
        const dungMon = mon === "tat-ca" || suKien.mon === mon;
        const dungThang = !nhapThang || (Boolean(khopThang) && suKien.ngay.startsWith(thang));
        const noiDung = `${suKien.tenSuKien} ${suKien.lichDiaDiem} ${suKien.trangThai}`
            .toLocaleLowerCase("vi");
        return dungLuuTru && dungTrangThai && dungMon && dungThang && noiDung.includes(tuKhoa);
    });

    hienThiBangSuKien(ketQua);
}

function dinhDangNgay(ngay) {
    const [nam, thang, ngayTrongThang] = ngay.split("-");
    return `${ngayTrongThang}/${thang}/${nam}`;
}

function moTrangChiTiet(suKien, cheDo = "") {
    const thamSo = new URLSearchParams({
        suKien: suKien.id,
        tenSuKien: suKien.tenSuKien
    });
    if (cheDo) thamSo.set("cheDo", cheDo);
    window.dieuPhoiChuyenTrang(`chitiet.html?${thamSo}`);
}

document.addEventListener("DOMContentLoaded", async () => {
    try {
        danhSachSuKien = await window.CourtConnectStore.docSuKien();
    } catch (error) {
        console.error("Không thể đọc dữ liệu sự kiện.", error);
        hienThongBao("Không thể tải dữ liệu sự kiện đã lưu trong trình duyệt. Hãy kiểm tra bộ nhớ trình duyệt.", true);
        return;
    }

    locDanhSachSuKien();

    const cacTheLoc = document.querySelectorAll(".the-loc");
    cacTheLoc.forEach(the => {
        the.addEventListener("click", () => {
            cacTheLoc.forEach(muc => {
                muc.classList.remove("kich-hoat");
                muc.setAttribute("aria-pressed", "false");
            });
            the.classList.add("kich-hoat");
            the.setAttribute("aria-pressed", "true");
            trangThaiDangLoc = the.dataset.trangthai;
            locDanhSachSuKien();
        });
        the.setAttribute("aria-pressed", String(the.classList.contains("kich-hoat")));
    });

    document.getElementById("nutXacNhanLoc").addEventListener("click", locDanhSachSuKien);
    document.getElementById("inputTimKiem").addEventListener("input", locDanhSachSuKien);
    document.getElementById("chonMon").addEventListener("change", locDanhSachSuKien);
    document.getElementById("khoangNgay").addEventListener("change", locDanhSachSuKien);

    const hopTaoSuKien = document.getElementById("hopTaoSuKien");
    document.getElementById("nutTaoSuKien").addEventListener("click", () => hopTaoSuKien.showModal());
    document.getElementById("dongHopTaoSuKien").addEventListener("click", () => hopTaoSuKien.close());

    document.getElementById("formTaoSuKien").addEventListener("submit", async event => {
        event.preventDefault();
        const form = event.currentTarget;
        if (!form.reportValidity()) return;

        const duLieu = new FormData(form);
        const ngay = String(duLieu.get("ngay"));
        const tenSuKien = String(duLieu.get("tenSuKien")).trim();
        const diaDiem = String(duLieu.get("diaDiem")).trim();
        const suKienMoi = {
            id: String(Date.now()),
            tenSuKien,
            mon: String(duLieu.get("mon")),
            lichDiaDiem: `${dinhDangNgay(ngay)} · ${diaDiem}`,
            ngay,
            diaDiem,
            dangKy: `0/${Number(duLieu.get("sucChua"))}`,
            trangThai: "Sắp diễn ra",
            maTrangThai: "sap-dien-ra",
            luuTru: false
        };

        try {
            danhSachSuKien.unshift(suKienMoi);
            await window.CourtConnectStore.luuSuKien(danhSachSuKien);
            trangThaiDangLoc = "tat-ca";
            cacTheLoc.forEach(the => {
                const dangChon = the.dataset.trangthai === "tat-ca";
                the.classList.toggle("kich-hoat", dangChon);
                the.setAttribute("aria-pressed", String(dangChon));
            });
            document.getElementById("inputTimKiem").value = "";
            document.getElementById("chonMon").value = "tat-ca";
            document.getElementById("khoangNgay").value = "";
            form.reset();
            hopTaoSuKien.close();
            locDanhSachSuKien();
            hienThongBao("Đã tạo sự kiện. Mở chi tiết để bổ sung lịch và nội dung.");
            moTrangChiTiet(suKienMoi, "sua");
        } catch (error) {
            console.error("Không thể lưu sự kiện mới.", error);
            danhSachSuKien = danhSachSuKien.filter(item => item.id !== suKienMoi.id);
            locDanhSachSuKien();
            hienThongBao("Không thể lưu sự kiện. Vui lòng thử lại.", true);
        }
    });

    document.getElementById("nutThongBao").addEventListener("click", () => {
        hienThongBao("Bạn không có thông báo mới.");
    });

    document.getElementById("thanBangSuKien").addEventListener("click", async event => {
        if (!(event.target instanceof Element)) return;
        const lienKet = event.target.closest("a[data-thao-tac]");
        if (!lienKet) return;
        event.preventDefault();

        const suKien = danhSachSuKien.find(item => item.id === lienKet.dataset.suKienId);
        if (!suKien) {
            hienThongBao("Không tìm thấy sự kiện cần thao tác.", true);
            return;
        }

        if (lienKet.dataset.thaoTac === "Lưu trữ") {
            const trangThaiLuuTru = suKien.luuTru;
            suKien.luuTru = true;
            try {
                await window.CourtConnectStore.luuSuKien(danhSachSuKien);
                locDanhSachSuKien();
                hienThongBao(`Đã lưu trữ "${suKien.tenSuKien}".`);
            } catch (error) {
                suKien.luuTru = trangThaiLuuTru;
                console.error("Không thể lưu trạng thái lưu trữ.", error);
                hienThongBao("Không thể lưu trữ sự kiện. Vui lòng thử lại.", true);
            }
            return;
        }
        if (lienKet.dataset.thaoTac === "Khôi phục") {
            const trangThaiLuuTru = suKien.luuTru;
            suKien.luuTru = false;
            try {
                await window.CourtConnectStore.luuSuKien(danhSachSuKien);
                locDanhSachSuKien();
                hienThongBao(`Đã khôi phục "${suKien.tenSuKien}" về danh sách hoạt động.`);
            } catch (error) {
                suKien.luuTru = trangThaiLuuTru;
                console.error("Không thể khôi phục sự kiện.", error);
                hienThongBao("Không thể khôi phục sự kiện. Vui lòng thử lại.", true);
            }
            return;
        }

        if (lienKet.dataset.thaoTac === "Hủy") {
            if (!window.confirm(`Bạn có chắc muốn hủy "${suKien.tenSuKien}" không?`)) return;
            const trangThai = suKien.trangThai;
            const maTrangThai = suKien.maTrangThai;
            suKien.trangThai = "Đã hủy";
            suKien.maTrangThai = "da-huy";
            try {
                await window.CourtConnectStore.luuSuKien(danhSachSuKien);
                locDanhSachSuKien();
                hienThongBao(`Đã cập nhật "${suKien.tenSuKien}" thành Đã hủy.`);
            } catch (error) {
                suKien.trangThai = trangThai;
                suKien.maTrangThai = maTrangThai;
                console.error("Không thể lưu trạng thái sự kiện.", error);
                hienThongBao("Không thể hủy sự kiện. Vui lòng thử lại.", true);
            }
        }
    });
});

function xemSuKien(tenSuKien) {
    const suKien = danhSachSuKien.find(item => item.tenSuKien === tenSuKien);
    if (suKien) moTrangChiTiet(suKien);
}

function xepDoi(tenSuKien) {
    window.dieuPhoiChuyenTrang("xepdoi.html", { tenSuKien });
}

function thucHienThaoTac(hanhDong, tenSuKien) {
    const suKien = danhSachSuKien.find(item => item.tenSuKien === tenSuKien);
    if (suKien) moTrangChiTiet(suKien, hanhDong === "Sửa" ? "sua" : "");
}
