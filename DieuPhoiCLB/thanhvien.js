let danhSachThanhVien = [];
let thongBaoTimeout;
let dangCoThayDoi = false;

function hienThongBaoThanhVien(noiDung, laLoi = false) {
    const thongBao = document.getElementById("thongBaoTrang");
    thongBao.textContent = noiDung;
    thongBao.style.backgroundColor = laLoi ? "#9f2424" : "";
    thongBao.classList.add("dang-hien");
    window.clearTimeout(thongBaoTimeout);
    thongBaoTimeout = window.setTimeout(() => thongBao.classList.remove("dang-hien"), 3200);
}

async function luuThanhVien() {
    await window.CourtConnectStore.luuThanhVien(danhSachThanhVien);
    dangCoThayDoi = false;
    document.querySelector(".chu-chu-thich-bang").textContent =
        `Hiển thị ${danhSachThanhVien.length} thành viên • Đã lưu`;
}

function locThanhVien() {
    const tuKhoa = document.getElementById("oTimThanhVien").value.trim().toLocaleLowerCase("vi");
    const trinhDo = document.getElementById("boLocTrinhDo").value;
    const lich = document.getElementById("boLocLichRanh").value;
    const thamGia = document.getElementById("boLocThamGia").value;

    const ketQua = danhSachThanhVien.filter(thanhVien => {
        const khopTuKhoa = `${thanhVien.ten} ${thanhVien.email}`.toLocaleLowerCase("vi").includes(tuKhoa);
        const diem = Number.parseFloat(thanhVien.pickleball);
        const khopTrinhDo = trinhDo === "tat-ca" ||
            (trinhDo === "3.0-3.5" && diem >= 3 && diem <= 3.5) ||
            thanhVien.pickleball === trinhDo;
        const khopLich = lich === "tat-ca" ||
            (lich === "thu-bay-buoi-toi" && thanhVien.lichRanh.startsWith("T7")) ||
            (lich === "chu-nhat-buoi-sang" && thanhVien.lichRanh.startsWith("CN"));
        const khopThamGia = thamGia === "tat-ca" ||
            (thamGia === "da-xac-nhan" && thanhVien.trangThai === "Đã xác nhận") ||
            (thamGia === "cho-xac-nhan" && thanhVien.trangThai === "Lời mời đang chờ");
        return khopTuKhoa && khopTrinhDo && khopLich && khopThamGia;
    });

    hienThiBangThanhVien(ketQua);
}

function hienThiBangThanhVien(danhSach) {
    const thanBang = document.getElementById("thanBangThanhVien");
    thanBang.replaceChildren();

    danhSach.forEach(thanhVien => {
        const hang = document.createElement("tr");
        const cotTen = document.createElement("td");
        cotTen.className = "ten-dam";
        cotTen.textContent = thanhVien.ten;

        const cotTrinhDo = document.createElement("td");
        const nutTrinhDo = document.createElement("button");
        nutTrinhDo.type = "button";
        nutTrinhDo.className = "o-cho-phep-sua";
        nutTrinhDo.dataset.id = thanhVien.id;
        nutTrinhDo.dataset.truong = "pickleball";
        nutTrinhDo.textContent = `${thanhVien.pickleball} ✏️`;
        cotTrinhDo.appendChild(nutTrinhDo);

        const cotLich = document.createElement("td");
        const nutLich = document.createElement("button");
        nutLich.type = "button";
        nutLich.className = "o-cho-phep-sua";
        nutLich.dataset.id = thanhVien.id;
        nutLich.dataset.truong = "lichRanh";
        nutLich.textContent = `${thanhVien.lichRanh} ✏️`;
        cotLich.appendChild(nutLich);

        const cotCoMat = document.createElement("td");
        cotCoMat.textContent = thanhVien.coMat;
        const cotTrangThai = document.createElement("td");
        cotTrangThai.textContent = thanhVien.trangThai;

        hang.append(cotTen, cotTrinhDo, cotLich, cotCoMat, cotTrangThai);
        thanBang.appendChild(hang);
    });

    document.querySelector(".chu-chu-thich-bang").textContent =
        `Hiển thị ${danhSach.length} / ${danhSachThanhVien.length} thành viên${dangCoThayDoi ? " • Có thay đổi chưa lưu" : ""}`;
}

function chinhSuaTruong(id, truong) {
    const thanhVien = danhSachThanhVien.find(item => String(item.id) === id);
    if (!thanhVien) {
        hienThongBaoThanhVien("Không tìm thấy thành viên cần sửa.", true);
        return;
    }

    const nhan = truong === "pickleball" ? "trình độ" : "lịch rảnh";
    const giaTriMoi = window.prompt(`Nhập ${nhan} mới:`, thanhVien[truong]);
    if (giaTriMoi === null) return;
    if (!giaTriMoi.trim()) {
        hienThongBaoThanhVien(`Giá trị ${nhan} không được để trống.`, true);
        return;
    }

    thanhVien[truong] = giaTriMoi.trim();
    dangCoThayDoi = true;
    locThanhVien();
}

document.addEventListener("DOMContentLoaded", async () => {
    try {
        danhSachThanhVien = await window.CourtConnectStore.docThanhVien();
        if (!Array.isArray(danhSachThanhVien)) {
            throw new Error("Dữ liệu thành viên lưu trong trình duyệt không hợp lệ.");
        }
    } catch (error) {
        console.error("Không thể tải dữ liệu thành viên.", error);
        hienThongBaoThanhVien("Không thể tải dữ liệu thành viên đã lưu trong trình duyệt.", true);
        return;
    }

    locThanhVien();

    document.getElementById("nutMoiThanhVien").addEventListener("click", () => {
        document.getElementById("khuVucBiMoForm").scrollIntoView({ behavior: "smooth", block: "center" });
        document.getElementById("nhapHoTen").focus({ preventScroll: true });
    });

    ["oTimThanhVien", "boLocTrinhDo", "boLocLichRanh", "boLocThamGia"].forEach(id => {
        document.getElementById(id).addEventListener("input", locThanhVien);
        document.getElementById(id).addEventListener("change", locThanhVien);
    });

    document.getElementById("thanBangThanhVien").addEventListener("click", event => {
        if (!(event.target instanceof Element)) return;
        const nutSua = event.target.closest("button[data-id][data-truong]");
        if (nutSua) chinhSuaTruong(nutSua.dataset.id, nutSua.dataset.truong);
    });

    document.getElementById("formThanhVien").addEventListener("submit", async event => {
        event.preventDefault();
        const ten = document.getElementById("nhapHoTen").value.trim();
        const email = document.getElementById("nhapEmail").value.trim().toLocaleLowerCase("vi");
        if (danhSachThanhVien.some(item => item.email?.toLocaleLowerCase("vi") === email)) {
            hienThongBaoThanhVien("Email này đã có trong danh sách thành viên.", true);
            return;
        }

        const monTrinhDo = document.getElementById("nhapMonTrinhDo").value.trim();
        const lichRanh = document.getElementById("nhapLichRanh").value.trim();
        danhSachThanhVien.push({
            id: danhSachThanhVien.reduce((max, item) => Math.max(max, Number(item.id) || 0), 0) + 1,
            ten,
            email,
            pickleball: monTrinhDo.replace(/^Pickleball\s*[•·]\s*/i, "") || "3.0",
            lichRanh: lichRanh || "Chưa cập nhật",
            coMat: "Chưa có",
            trangThai: "Lời mời đang chờ"
        });

        try {
            await luuThanhVien();
            event.currentTarget.reset();
            document.getElementById("nhapMonTrinhDo").value = "Pickleball • 3.0";
            document.getElementById("nhapLichRanh").value = "T7 • 18:00–20:00";
            locThanhVien();
            hienThongBaoThanhVien(`Đã thêm ${ten} vào danh sách chờ lời mời.`);
        } catch (error) {
            console.error("Không thể lưu thành viên mới.", error);
            hienThongBaoThanhVien("Không thể lưu lời mời. Vui lòng thử lại.", true);
        }
    });

    document.getElementById("nutLuuChinhSua").addEventListener("click", async () => {
        try {
            await luuThanhVien();
            locThanhVien();
            hienThongBaoThanhVien("Đã lưu các thay đổi thành viên.");
        } catch (error) {
            console.error("Không thể lưu thay đổi thành viên.", error);
            hienThongBaoThanhVien("Không thể lưu thay đổi. Vui lòng thử lại.", true);
        }
    });

    document.getElementById("nutGuiLaiLoiMoi").addEventListener("click", async () => {
        const thanhVien = danhSachThanhVien.find(item => item.trangThai === "Lời mời đang chờ");
        if (!thanhVien) {
            hienThongBaoThanhVien("Không có lời mời đang chờ để gửi lại.", true);
            return;
        }
        thanhVien.lanGuiLai = (thanhVien.lanGuiLai || 0) + 1;
        thanhVien.lanGuiLaiLuc = new Date().toISOString();
        try {
            await luuThanhVien();
            hienThongBaoThanhVien(`Đã ghi nhận gửi lại lời mời cho ${thanhVien.ten} (${thanhVien.email}).`);
        } catch (error) {
            console.error("Không thể lưu yêu cầu gửi lại lời mời.", error);
            hienThongBaoThanhVien("Không thể lưu yêu cầu gửi lại lời mời. Vui lòng thử lại.", true);
        }
    });

    document.getElementById("nutHuyLoiMoi").addEventListener("click", async () => {
        const thanhVien = danhSachThanhVien.find(item => item.trangThai === "Lời mời đang chờ");
        if (!thanhVien) {
            hienThongBaoThanhVien("Không có lời mời đang chờ để hủy.", true);
            return;
        }
        thanhVien.trangThai = "Đã hủy lời mời";
        try {
            await luuThanhVien();
            locThanhVien();
            hienThongBaoThanhVien(`Đã hủy lời mời của ${thanhVien.ten}.`);
        } catch (error) {
            console.error("Không thể hủy lời mời.", error);
            hienThongBaoThanhVien("Không thể lưu trạng thái lời mời. Vui lòng thử lại.", true);
        }
    });

    const nutThongBao = document.getElementById("nutThongBaoTop");
    if (nutThongBao) nutThongBao.addEventListener("click", () => hienThongBaoThanhVien("Bạn không có thông báo mới."));
});
