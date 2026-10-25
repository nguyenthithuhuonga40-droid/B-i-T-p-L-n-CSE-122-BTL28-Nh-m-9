document.addEventListener("DOMContentLoaded", () => {
    const thongBao = document.getElementById("thongBaoTrang");
    let thongBaoTimeout;
    const hienThongBao = (noiDung, laLoi = false) => {
        thongBao.textContent = noiDung;
        thongBao.style.backgroundColor = laLoi ? "#9f2424" : "";
        thongBao.classList.add("dang-hien");
        window.clearTimeout(thongBaoTimeout);
        thongBaoTimeout = window.setTimeout(() => thongBao.classList.remove("dang-hien"), 3200);
    };

    const thamSo = new URLSearchParams(window.location.search);
    const idSuKien = thamSo.get("suKien") || "1";
    let suKien;

    try {
        suKien = window.CourtConnectStore.docSuKien().find(item => item.id === idSuKien);
    } catch (error) {
        console.error("Không thể tải dữ liệu sự kiện.", error);
        hienThongBao("Không thể tải dữ liệu sự kiện. Hãy kiểm tra dữ liệu trình duyệt.", true);
        return;
    }

    if (!suKien) {
        hienThongBao("Không tìm thấy sự kiện. Hãy quay lại danh sách sự kiện.", true);
        return;
    }

    const dinhDangNgay = ngay => {
        if (!/^\d{4}-\d{2}-\d{2}$/.test(ngay || "")) return "";
        const [nam, thang, ngayTrongThang] = ngay.split("-");
        return `${ngayTrongThang}/${thang}/${nam}`;
    };
    const layNgayTuLich = lich => {
        const ketQua = lich.match(/(\d{2})\/(\d{2})\/(\d{4})/);
        return ketQua ? `${ketQua[3]}-${ketQua[2]}-${ketQua[1]}` : suKien.ngay;
    };
    const nhap = {
        ten: document.getElementById("tenSuKienChiTiet"),
        mon: document.getElementById("monSuKienChiTiet"),
        diaDiem: document.getElementById("diaDiemChiTiet"),
        lich: document.getElementById("lichSuKienChiTiet"),
        sucChua: document.getElementById("sucChuaChiTiet"),
        trinhDo: document.getElementById("trinhDoChiTiet"),
        luat: document.getElementById("luatSuKienChiTiet"),
        ghiChu: document.getElementById("ghiChuSuKienChiTiet")
    };

    nhap.ten.value = suKien.tenSuKien;
    nhap.mon.value = suKien.mon === "cau-long" ? "Cầu lông" : "Pickleball";
    nhap.diaDiem.value = suKien.diaDiem || suKien.lichDiaDiem.split(" · ").slice(1).join(" · ");
    nhap.lich.value = `${dinhDangNgay(suKien.ngay) || "Chưa đặt lịch"} - 18:00–20:00`;
    nhap.sucChua.value = suKien.dangKy.split("/")[1] + " người";
    document.querySelector(".title-group h1").textContent = suKien.tenSuKien;
    document.querySelector(".title-group p").textContent =
        `${suKien.lichDiaDiem} • CLB Nhịp Sân`;
    document.querySelector(".badge-status").lastChild.textContent = ` ${suKien.trangThai}`;
    document.querySelector(".capacity-notice").textContent =
        `Đăng ký hiện tại: ${suKien.dangKy}. Số chỗ còn lại được tính theo sức chứa sự kiện.`;

    if (thamSo.get("cheDo") === "sua") {
        nhap.ten.focus();
        hienThongBao("Bạn đang chỉnh sửa thông tin sự kiện.");
    }

    function capNhatSuKien(thayDoi) {
        const danhSach = window.CourtConnectStore.docSuKien();
        const viTri = danhSach.findIndex(item => item.id === suKien.id);
        if (viTri < 0) throw new Error("Sự kiện không còn trong danh sách.");
        danhSach[viTri] = { ...danhSach[viTri], ...thayDoi };
        window.CourtConnectStore.luuSuKien(danhSach);
        suKien = danhSach[viTri];
    }

    function layDuLieuBieuMau() {
        const ngay = layNgayTuLich(nhap.lich.value);
        const mon = nhap.mon.value.toLocaleLowerCase("vi").includes("cầu lông")
            ? "cau-long"
            : "pickleball";
        const diaDiem = nhap.diaDiem.value.trim();
        const sucChua = Number.parseInt(nhap.sucChua.value, 10);
        const dangKyHienTai = Number.parseInt(suKien.dangKy.split("/")[0], 10) || 0;

        if (!nhap.ten.value.trim() || !diaDiem || !Number.isInteger(sucChua) || sucChua < dangKyHienTai) {
            throw new Error("Vui lòng nhập tên, địa điểm hợp lệ và sức chứa không nhỏ hơn số người đã đăng ký.");
        }

        return {
            tenSuKien: nhap.ten.value.trim(),
            mon,
            ngay,
            diaDiem,
            lichDiaDiem: `${dinhDangNgay(ngay)} · ${diaDiem}`,
            dangKy: `${dangKyHienTai}/${sucChua}`,
            trinhDo: nhap.trinhDo.value.trim(),
            luat: nhap.luat.value.trim(),
            ghiChu: nhap.ghiChu.value.trim()
        };
    }

    document.getElementById("btnViewTeam").addEventListener("click", () => {
        window.dieuPhoiChuyenTrang("xepdoi.html", { suKien: suKien.id, tenSuKien: suKien.tenSuKien });
    });

    document.getElementById("btnSave").addEventListener("click", () => {
        try {
            capNhatSuKien(layDuLieuBieuMau());
            document.querySelector(".title-group h1").textContent = suKien.tenSuKien;
            document.querySelector(".title-group p").textContent = `${suKien.lichDiaDiem} • CLB Nhịp Sân`;
            hienThongBao("Đã lưu thay đổi sự kiện.");
        } catch (error) {
            console.error("Không thể lưu thay đổi sự kiện.", error);
            hienThongBao(error.message || "Không thể lưu thay đổi. Vui lòng thử lại.", true);
        }
    });

    document.getElementById("btnDraft").addEventListener("click", () => {
        document.getElementById("btnSave").click();
    });

    document.getElementById("btnPublish").addEventListener("click", () => {
        try {
            capNhatSuKien({ trangThai: "Sắp diễn ra", maTrangThai: "sap-dien-ra", luuTru: false });
            document.querySelector(".badge-status").lastChild.textContent = ` ${suKien.trangThai}`;
            hienThongBao("Sự kiện đã được công bố và xuất hiện trong danh sách sắp diễn ra.");
        } catch (error) {
            console.error("Không thể công bố sự kiện.", error);
            hienThongBao("Không thể công bố sự kiện. Vui lòng thử lại.", true);
        }
    });

    function huySuKien() {
        const lyDo = document.getElementById("cancelReason").value.trim();
        if (!lyDo) {
            hienThongBao("Vui lòng nhập lý do hủy sự kiện.", true);
            return;
        }
        try {
            capNhatSuKien({ trangThai: "Đã hủy", maTrangThai: "da-huy", lyDoHuy: lyDo });
            document.querySelector(".badge-status").lastChild.textContent = " Đã hủy";
            hienThongBao(`Đã hủy sự kiện: ${lyDo}`);
        } catch (error) {
            console.error("Không thể hủy sự kiện.", error);
            hienThongBao("Không thể hủy sự kiện. Vui lòng thử lại.", true);
        }
    }

    document.getElementById("btnCancelEvent").addEventListener("click", () => {
        document.getElementById("cancelReason").focus();
        document.getElementById("cancelReason").scrollIntoView({ behavior: "smooth", block: "center" });
    });
    document.getElementById("btnConfirmCancel").addEventListener("click", huySuKien);
    document.getElementById("btnKeepEvent").addEventListener("click", () => {
        document.getElementById("cancelReason").value = "";
        hienThongBao("Giữ nguyên sự kiện, chưa có thay đổi nào được thực hiện.");
    });
    document.getElementById("btnConfirmPublish").addEventListener("click", () => {
        document.getElementById("btnPublish").click();
    });
    document.getElementById("btnEditAgain").addEventListener("click", () => {
        nhap.ten.focus();
        window.scrollTo({ top: 0, behavior: "smooth" });
        hienThongBao("Bạn có thể tiếp tục chỉnh sửa thông tin sự kiện.");
    });

    const thongBaoNut = document.querySelector(".notification-bell");
    if (thongBaoNut) {
        thongBaoNut.addEventListener("click", () => hienThongBao("Bạn không có thông báo mới."));
    }
});
