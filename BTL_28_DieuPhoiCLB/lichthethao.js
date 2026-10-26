
const cacTab = Array.from(document.querySelectorAll(".tab-lich"));
const cacBang = Array.from(document.querySelectorAll(".noi-dung-tab"));
const thongBaoTrangThai = document.querySelector("#thong-bao-trang-thai");
const hopThoai = document.querySelector("#hop-thoai");
const noiDungHopThoai = document.querySelector("#noi-dung-hop-thoai");
const cacNutHopThoai = document.querySelector("#cac-nut-hop-thoai");
const thongBaoHopThoai = document.querySelector("#thong-bao-hop-thoai");
const theSanDaDat = document.querySelector("#the-san-da-dat");
const theYeuCauTran = document.querySelector("#the-yeu-cau-tran");
const danhSachDaLuu = document.querySelector("#danh-sach-da-luu");
const thongBaoTrong = document.querySelector("#thong-bao-trong");

if (
    cacTab.length !== 3 ||
    cacBang.length !== 3 ||
    !(thongBaoTrangThai instanceof HTMLElement) ||
    !(hopThoai instanceof HTMLDialogElement) ||
    !(noiDungHopThoai instanceof HTMLElement) ||
    !(cacNutHopThoai instanceof HTMLElement) ||
    !(thongBaoHopThoai instanceof HTMLElement) ||
    !(theSanDaDat instanceof HTMLElement) ||
    !(theYeuCauTran instanceof HTMLElement) ||
    !(danhSachDaLuu instanceof HTMLElement) ||
    !(thongBaoTrong instanceof HTMLElement)
) {
    throw new Error("Trang lịch thể thao thiếu thành phần cần thiết.");
}

const hienThongBao = (phanTu, noiDung) => {
    phanTu.textContent = noiDung;
};

const capNhatNgayLich = (giaTri) => {
    const ngay = new Date(`${giaTri}T00:00:00`);
    if (Number.isNaN(ngay.getTime())) return false;
    const tenThu = ["CHỦ NHẬT", "THỨ HAI", "THỨ BA", "THỨ TƯ", "THỨ NĂM", "THỨ SÁU", "THỨ BẢY"];
    document.querySelector("#thu-hien-thi").textContent = tenThu[ngay.getDay()];
    document.querySelector("#ngay-hien-thi").textContent = `${String(ngay.getDate()).padStart(2, "0")}/${String(ngay.getMonth() + 1).padStart(2, "0")}/${ngay.getFullYear()}`;
    return true;
};

const hienTab = (tenTab) => {
    cacTab.forEach((tab) => {
        const dangChon = tab.dataset.tab === tenTab;
        tab.classList.toggle("dang-chon", dangChon);
        tab.setAttribute("aria-selected", String(dangChon));
        tab.tabIndex = dangChon ? 0 : -1;
    });
    cacBang.forEach((bang) => {
        bang.hidden = bang.dataset.noiDung !== tenTab;
    });
    const ghiChu = document.querySelector('[data-ghi-chu="sap-toi"]');
    if (ghiChu instanceof HTMLElement) {
        ghiChu.hidden = tenTab !== "sap-toi";
    }
    if (tenTab === "da-luu") {
        hienThiDaLuu();
    }
};

cacTab.forEach((tab, chiSo) => {
    tab.addEventListener("click", () => hienTab(tab.dataset.tab || "sap-toi"));
    tab.addEventListener("keydown", (suKien) => {
        if (suKien.key !== "ArrowLeft" && suKien.key !== "ArrowRight") return;
        suKien.preventDefault();
        const buoc = suKien.key === "ArrowRight" ? 1 : -1;
        const tabMoi = cacTab[(chiSo + buoc + cacTab.length) % cacTab.length];
        tabMoi.focus();
        hienTab(tabMoi.dataset.tab || "sap-toi");
    });
});

const docKho = (khoa, giaTriMacDinh) => {
    try {
        const noiDung = localStorage.getItem(khoa);
        return noiDung === null ? giaTriMacDinh : JSON.parse(noiDung);
    } catch (loi) {
        console.error(`Không thể đọc dữ liệu ${khoa}.`, loi);
        hienThongBao(thongBaoTrangThai, "Không thể đọc một số dữ liệu đã lưu trên thiết bị này.");
        return giaTriMacDinh;
    }
};

const luuKho = (khoa, duLieu) => {
    try {
        localStorage.setItem(khoa, JSON.stringify(duLieu));
        return true;
    } catch (loi) {
        console.error(`Không thể lưu dữ liệu ${khoa}.`, loi);
        hienThongBao(thongBaoTrangThai, "Không thể lưu thay đổi trên thiết bị này. Hãy kiểm tra cài đặt bộ nhớ trình duyệt.");
        return false;
    }
};

const moHopThoai = ({ nhan, tieuDe, noiDung, nutChinh, nutPhu = null, khiXacNhan = null }) => {
    document.querySelector("#nhan-hop-thoai").textContent = nhan;
    document.querySelector("#tieu-de-hop-thoai").textContent = tieuDe;
    noiDungHopThoai.replaceChildren();
    noiDung.forEach((dong) => {
        const doan = document.createElement("p");
        doan.textContent = dong;
        noiDungHopThoai.append(doan);
    });
    cacNutHopThoai.replaceChildren();
    const nutXacNhan = document.createElement("button");
    nutXacNhan.className = "nut-xanh";
    nutXacNhan.type = "button";
    nutXacNhan.textContent = nutChinh;
    nutXacNhan.addEventListener("click", () => {
        if (khiXacNhan) {
            const daThanhCong = khiXacNhan();
            if (daThanhCong === false) return;
        }
        hopThoai.close();
    });
    cacNutHopThoai.append(nutXacNhan);
    if (nutPhu) {
        const nutHuy = document.createElement("button");
        nutHuy.className = "nut-sang";
        nutHuy.type = "button";
        nutHuy.textContent = nutPhu;
        nutHuy.addEventListener("click", () => hopThoai.close());
        cacNutHopThoai.append(nutHuy);
    }
    thongBaoHopThoai.textContent = "";
    hopThoai.showModal();
};

document.querySelector("#nut-dong-hop-thoai").addEventListener("click", () => hopThoai.close());
document.querySelector("#nut-xac-nhan-hop-thoai").addEventListener("click", () => hopThoai.close());

document.querySelector("#nut-nhan-san").addEventListener("click", () => {
    const ngay = document.querySelector("#ngay-hien-thi").textContent;
    const gio = document.querySelector("#gio-hien-thi").textContent;
    const diaDiem = document.querySelector("#dia-diem-hien-thi").textContent;
    moHopThoai({
        nhan: "THÔNG TIN NHẬN SÂN",
        tieuDe: diaDiem,
        noiDung: [
            `Thứ bảy · ${ngay} · ${gio}`,
            "Mã lịch CC-1010 · Pickleball · Nhóm 4 người",
            "Đến trước 10 phút và báo mã lịch với quầy sân.",
            "Thông tin thanh toán và nhận sân chỉ là minh họa."
        ],
        nutChinh: "Đã hiểu"
    });
});

document.querySelector("#nut-doi-lich").addEventListener("click", () => {
    const ngayInput = document.createElement("input");
    ngayInput.type = "date";
    ngayInput.id = "ngay-doi-lich";
    ngayInput.value = "2026-10-11";
    ngayInput.setAttribute("aria-label", "Chọn ngày mới");
    const truongNgay = document.createElement("div");
    truongNgay.className = "truong-ngay-hop-thoai";
    const nhanNgay = document.createElement("label");
    nhanNgay.htmlFor = ngayInput.id;
    nhanNgay.textContent = "Chọn ngày mới";
    truongNgay.append(nhanNgay, ngayInput);
    noiDungHopThoai.replaceChildren(truongNgay);

    document.querySelector("#nhan-hop-thoai").textContent = "ĐỔI LỊCH · BẢN XEM TRƯỚC";
    document.querySelector("#tieu-de-hop-thoai").textContent = "Chọn ngày chơi mới";
    cacNutHopThoai.replaceChildren();
    const nutLuu = document.createElement("button");
    nutLuu.className = "nut-xanh";
    nutLuu.type = "button";
    nutLuu.textContent = "Xem thay đổi";
    nutLuu.addEventListener("click", () => {
        if (!ngayInput.value) {
            ngayInput.reportValidity();
            return;
        }
        const duLieu = docKho("courtconnect-lich-choi", {});
        if (!luuKho("courtconnect-lich-choi", { ...duLieu, ngay: ngayInput.value })) return;
        capNhatNgayLich(ngayInput.value);
        hienThongBao(thongBaoTrangThai, "Ngày lịch đã được cập nhật trên thiết bị này. Thay đổi chưa gửi tới sân.");
        hopThoai.close();
    });
    const nutHuy = document.createElement("button");
    nutHuy.className = "nut-sang";
    nutHuy.type = "button";
    nutHuy.textContent = "Để sau";
    nutHuy.addEventListener("click", () => hopThoai.close());
    cacNutHopThoai.append(nutLuu, nutHuy);
    thongBaoHopThoai.textContent = "";
    hopThoai.showModal();
});

document.querySelector("#nut-huy-san").addEventListener("click", () => {
    moHopThoai({
        nhan: "HỦY ĐẶT SÂN",
        tieuDe: "Bạn muốn hủy lịch này?",
        noiDung: [
            "Hủy hoặc đổi lịch có thể ảnh hưởng chính sách hoàn tiền.",
            "Bản minh họa này chỉ cập nhật trạng thái trên thiết bị, không liên hệ sân và không hoàn tiền."
        ],
        nutChinh: "Xác nhận hủy",
        nutPhu: "Giữ lịch",
        khiXacNhan: () => {
            const lichDaHuy = { daHuy: true };
            if (!luuKho("courtconnect-lich-choi", lichDaHuy)) return false;
            theSanDaDat.hidden = true;
            hienThongBao(thongBaoTrangThai, "Lịch đã được ẩn trong bản xem trước. Chưa gửi yêu cầu hủy tới sân.");
            return true;
        }
    });
});

document.querySelector("#nut-xem-yeu-cau").addEventListener("click", () => {
    moHopThoai({
        nhan: "YÊU CẦU THAM GIA · ĐANG CHỜ DUYỆT",
        tieuDe: "Đôi vui cuối tuần",
        noiDung: [
            "Pickleball · 3.0–3.5 · Tây Hồ Sports · Sân P02",
            "10/10 · 18:00–20:00 · 3/4 người",
            "Yêu cầu gửi đến Bảo Trâm. Bạn chưa được xác nhận chỗ."
        ],
        nutChinh: "Đóng"
    });
});

document.querySelector("#nut-rut-yeu-cau").addEventListener("click", () => {
    moHopThoai({
        nhan: "YÊU CẦU THAM GIA",
        tieuDe: "Rút yêu cầu tham gia?",
        noiDung: ["Bạn có thể gửi yêu cầu mới sau nếu trận còn chỗ.", "Thao tác chỉ cập nhật trạng thái minh họa trên thiết bị."],
        nutChinh: "Rút yêu cầu",
        nutPhu: "Giữ yêu cầu",
        khiXacNhan: () => {
            if (!luuKho("courtconnect-yeu-cau-tran", { daRut: true })) return false;
            theYeuCauTran.hidden = true;
            hienThongBao(thongBaoTrangThai, "Đã rút yêu cầu khỏi bản xem trước. Chưa gửi cập nhật tới người tổ chức.");
            return true;
        }
    });
});

const taoTheDaLuu = ({ tieuDe, moTa, href, loai, id }) => {
    const the = document.createElement("article");
    the.className = "the-da-luu";
    const tieuDeThe = document.createElement("h2");
    tieuDeThe.textContent = tieuDe;
    const moTaThe = document.createElement("p");
    moTaThe.textContent = moTa;
    const hangNut = document.createElement("div");
    hangNut.className = "hang-nut-yeu-cau";
    const nutXem = document.createElement("a");
    nutXem.className = "nut-xanh";
    nutXem.href = href;
    nutXem.textContent = loai === "tran" ? "Xem trận" : "Xem sân";
    const nutBoLuu = document.createElement("button");
    nutBoLuu.className = "nut-sang nut-bo-luu";
    nutBoLuu.type = "button";
    nutBoLuu.textContent = "Bỏ lưu";
    nutBoLuu.addEventListener("click", () => {
        if (loai === "san") {
            const cacSan = docKho("courtconnect-san-yeu-thich", []);
            if (!Array.isArray(cacSan)) {
                hienThongBao(thongBaoTrangThai, "Danh sách sân đã lưu không hợp lệ.");
                return;
            }
            const capNhat = cacSan.filter((maSan) => maSan !== id);
            if (!luuKho("courtconnect-san-yeu-thich", capNhat)) return;
        } else if (loai === "tran") {
            const cacTran = docKho("courtconnect-tran-mo", []);
            if (!Array.isArray(cacTran)) {
                hienThongBao(thongBaoTrangThai, "Danh sách trận đã lưu không hợp lệ.");
                return;
            }
            const capNhat = cacTran.filter((tran) => tran.id !== id);
            if (!luuKho("courtconnect-tran-mo", capNhat)) return;
        } else {
            try {
                localStorage.removeItem("courtconnect-goi-y-da-luu");
            } catch (loi) {
                console.error("Không thể bỏ lưu gợi ý Skill Match.", loi);
                hienThongBao(thongBaoTrangThai, "Không thể bỏ lưu gợi ý trên thiết bị này.");
                return;
            }
        }
        the.remove();
        thongBaoTrong.hidden = danhSachDaLuu.childElementCount !== 0;
        hienThongBao(thongBaoTrangThai, `Đã bỏ lưu “${tieuDe}”.`);
    });
    hangNut.append(nutXem, nutBoLuu);
    the.append(tieuDeThe, moTaThe, hangNut);
    return the;
};

const hienThiDaLuu = () => {
    danhSachDaLuu.replaceChildren();
    let soDaLuu = 0;
    const cacSanDaLuu = docKho("courtconnect-san-yeu-thich", []);
    if (Array.isArray(cacSanDaLuu)) {
        const thongTinSan = {
            "tay-ho": ["Tây Hồ Sports", "Pickleball · Tây Hồ, Hà Nội · 180.000đ/giờ"],
            "cau-giay": ["Cầu Giấy Racket Club", "Cầu lông · Cầu Giấy, Hà Nội · 120.000đ/giờ"],
            "long-bien": ["Long Biên Pickle Hub", "Pickleball · Long Biên, Hà Nội · 160.000đ/giờ"]
        };
        cacSanDaLuu.forEach((id) => {
            const thongTin = thongTinSan[id];
            if (!thongTin) return;
            danhSachDaLuu.append(taoTheDaLuu({
                tieuDe: thongTin[0],
                moTa: thongTin[1],
                href: "sangiodidong.html",
                loai: "san",
                id
            }));
            soDaLuu += 1;
        });
    } else {
        hienThongBao(thongBaoTrangThai, "Danh sách sân đã lưu không hợp lệ.");
    }
    const goiYDaLuu = docKho("courtconnect-goi-y-da-luu", null);
    if (goiYDaLuu && typeof goiYDaLuu.ten === "string") {
        danhSachDaLuu.append(taoTheDaLuu({
            tieuDe: goiYDaLuu.ten,
            moTa: `Skill Match · Pickleball · ${goiYDaLuu.gio || "Chưa chọn giờ"} · Gợi ý mô phỏng`,
            href: "trandidong.html",
            loai: "goi-y",
            id: "goi-y-skill-match"
        }));
        soDaLuu += 1;
    }
    thongBaoTrong.hidden = soDaLuu > 0;
};

const lichDaLuu = docKho("courtconnect-lich-choi", null);
if (lichDaLuu?.daHuy === true) {
    theSanDaDat.hidden = true;
}
if (lichDaLuu?.ngay) {
    capNhatNgayLich(lichDaLuu.ngay);
}
const yeuCauTranDaRut = docKho("courtconnect-yeu-cau-tran", null);
if (yeuCauTranDaRut?.daRut === true) {
    theYeuCauTran.hidden = true;
}
