const danhSachSan = document.querySelector("#danh-sach-san");

if (danhSachSan instanceof HTMLElement) {
    const cacTheSan = Array.from(danhSachSan.querySelectorAll(".the-san"));
    const cacTabMon = document.querySelectorAll(".tab-mon");
    const formTimSan = document.querySelector("#form-tim-san");
    const khuVuc = document.querySelector("#khu-vuc");
    const ngayChoi = document.querySelector("#ngay-choi");
    const gioChoi = document.querySelector("#gio-choi");
    const soDiaDiem = document.querySelector("#so-dia-diem");
    const soSanHienThi = document.querySelector("#so-san-hien-thi");
    const khongCoSan = document.querySelector("#khong-co-san");
    const nutXemThem = document.querySelector("#nut-xem-them");
    const nutBoLoc = document.querySelector("#nut-bo-loc");
    const tuyChonBoLoc = document.querySelector("#tuy-chon-bo-loc");
    const sapXep = document.querySelector("#sap-xep");
    let monHienTai = "tat-ca";
    let daHienSanMoRong = false;

    if (
        !(formTimSan instanceof HTMLFormElement) ||
        !(khuVuc instanceof HTMLSelectElement) ||
        !(ngayChoi instanceof HTMLInputElement) ||
        !(gioChoi instanceof HTMLSelectElement) ||
        !(soDiaDiem instanceof HTMLElement) ||
        !(soSanHienThi instanceof HTMLElement) ||
        !(khongCoSan instanceof HTMLElement) ||
        !(nutXemThem instanceof HTMLButtonElement) ||
        !(nutBoLoc instanceof HTMLButtonElement) ||
        !(tuyChonBoLoc instanceof HTMLElement) ||
        !(sapXep instanceof HTMLSelectElement)
    ) {
        throw new Error("Trang tìm sân thiếu thành phần cần thiết.");
    }

    const khoaYeuThich = "courtconnect-san-yeu-thich";
    let cacSanYeuThich = [];

    try {
        const duLieu = localStorage.getItem(khoaYeuThich);
        const danhSach = duLieu ? JSON.parse(duLieu) : [];
        if (Array.isArray(danhSach)) {
            cacSanYeuThich = danhSach.filter((maSan) => typeof maSan === "string");
        }
    } catch (loi) {
        console.error("Không thể đọc danh sách sân yêu thích.", loi);
    }

    const capNhatNutYeuThich = (nut, daLuu) => {
        nut.setAttribute("aria-pressed", String(daLuu));
        nut.textContent = daLuu ? "♥" : "♡";
        const theSan = nut.closest(".the-san");
        const tenSan = theSan?.querySelector("h3")?.textContent ?? "sân này";
        nut.setAttribute("aria-label", `${daLuu ? "Bỏ lưu" : "Lưu"} ${tenSan}`);
    };

    document.querySelectorAll(".nut-yeu-thich").forEach((nut) => {
        if (!(nut instanceof HTMLButtonElement)) {
            return;
        }

        const maSan = nut.closest(".the-san")?.dataset.san;
        if (maSan) {
            capNhatNutYeuThich(nut, cacSanYeuThich.includes(maSan));
        }

        nut.addEventListener("click", () => {
            const id = nut.closest(".the-san")?.dataset.san;
            if (!id) {
                throw new Error("Không tìm thấy mã sân cần lưu.");
            }

            cacSanYeuThich = cacSanYeuThich.includes(id)
                ? cacSanYeuThich.filter((muc) => muc !== id)
                : [...cacSanYeuThich, id];

            try {
                localStorage.setItem(khoaYeuThich, JSON.stringify(cacSanYeuThich));
                capNhatNutYeuThich(nut, cacSanYeuThich.includes(id));
            } catch (loi) {
                console.error("Không thể lưu danh sách sân yêu thích.", loi);
            }
        });
    });

    const capNhatKetQua = () => {
        let soKetQua = 0;
        const locKhuVuc = khuVuc.value;
        const khoaKhuVuc = locKhuVuc === "ha-noi" ? "" : locKhuVuc;
        const khoangGio = gioChoi.value;

        cacTheSan.forEach((theSan) => {
            const khopMon = monHienTai === "tat-ca" || theSan.dataset.mon === monHienTai;
            const khopKhuVuc = !khoaKhuVuc || theSan.dataset.khuVuc === khoaKhuVuc;
            const dangMo = !theSan.classList.contains("san-mo-rong") || daHienSanMoRong;
            let khopGio = true;

            if (khoangGio === "07-10") {
                khopGio = theSan.dataset.san !== "tay-ho";
            } else if (khoangGio === "18-22") {
                khopGio = theSan.dataset.san !== "long-bien";
            }

            const hienThi = khopMon && khopKhuVuc && dangMo && khopGio;
            theSan.hidden = !hienThi;
            if (hienThi) {
                soKetQua += 1;
            }
        });

        soDiaDiem.textContent = String(soKetQua);
        soSanHienThi.textContent = String(soKetQua);
        khongCoSan.hidden = soKetQua !== 0;
        nutXemThem.hidden = daHienSanMoRong || (khoaKhuVuc && khoaKhuVuc !== "long-bien");
    };

    cacTabMon.forEach((tab) => {
        tab.addEventListener("click", () => {
            const mon = tab.dataset.mon;
            if (!mon) {
                return;
            }

            monHienTai = mon;
            cacTabMon.forEach((muc) => {
                const dangChon = muc === tab;
                muc.classList.toggle("dang-chon", dangChon);
                muc.setAttribute("aria-pressed", String(dangChon));
            });
            capNhatKetQua();
        });
    });

    formTimSan.addEventListener("submit", (suKien) => {
        suKien.preventDefault();
        capNhatKetQua();
        document.querySelector(".ket-qua-tim-san")?.scrollIntoView({ behavior: "smooth", block: "start" });
    });

    khuVuc.addEventListener("change", capNhatKetQua);
    gioChoi.addEventListener("change", capNhatKetQua);
    ngayChoi.addEventListener("change", () => {
        const ngay = new Date(`${ngayChoi.value}T00:00:00`);
        const ngayHienThi = Number.isNaN(ngay.getTime())
            ? "ngày đã chọn"
            : `${ngay.getDate()}/${ngay.getMonth() + 1}`;
        document.querySelectorAll(".san-trong").forEach((ghiChu) => {
            ghiChu.textContent = `✓ Còn giờ trống ngày ${ngayHienThi}`;
        });
    });

    nutXemThem.addEventListener("click", () => {
        daHienSanMoRong = true;
        capNhatKetQua();
    });

    nutBoLoc.addEventListener("click", () => {
        const mo = tuyChonBoLoc.hidden;
        tuyChonBoLoc.hidden = !mo;
        nutBoLoc.setAttribute("aria-expanded", String(mo));
    });

    sapXep.addEventListener("change", () => {
        const thuTu = sapXep.value;
        const danhSachSapXep = [...cacTheSan].sort((a, b) => {
            const giaA = Number(a.dataset.gia);
            const giaB = Number(b.dataset.gia);
            return thuTu === "gia-tang"
                ? giaA - giaB
                : thuTu === "gia-giam"
                    ? giaB - giaA
                    : cacTheSan.indexOf(a) - cacTheSan.indexOf(b);
        });
        danhSachSapXep.forEach((theSan) => danhSachSan.append(theSan));
    });

    capNhatKetQua();
}