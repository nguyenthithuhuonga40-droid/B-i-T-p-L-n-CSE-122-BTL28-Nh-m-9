const ngayHienTai = document.querySelector("#ngay-hien-tai");

if (ngayHienTai instanceof HTMLSelectElement) {
    const cacNgayNhanh = document.querySelectorAll(".ngay-nhanh");
    const cacKhungGio = document.querySelectorAll(".khung-gio:not(:disabled)");
    const chonSan = document.querySelector("#chon-san");
    const tongTien = document.querySelector("#tong-tien");
    const tenSanChon = document.querySelector("#ten-san-chon");
    const nutLuuSan = document.querySelector("#nut-luu-san");
    const nutTiepTuc = document.querySelector("#nut-tiep-tuc");
    const thongBaoDatSan = document.querySelector("#thong-bao-dat-san");
    let khungGioChon = document.querySelector(".khung-gio.dang-chon");

    if (
        !(chonSan instanceof HTMLSelectElement) ||
        !(tongTien instanceof HTMLElement) ||
        !(tenSanChon instanceof HTMLElement) ||
        !(nutLuuSan instanceof HTMLButtonElement) ||
        !(nutTiepTuc instanceof HTMLButtonElement) ||
        !(thongBaoDatSan instanceof HTMLElement) ||
        !(khungGioChon instanceof HTMLButtonElement)
    ) {
        throw new Error("Trang chi tiết sân thiếu thành phần đặt sân.");
    }

    const capNhatNgayChon = () => {
        cacNgayNhanh.forEach((nut) => {
            const dangChon = nut instanceof HTMLButtonElement && nut.dataset.ngay === ngayHienTai.value;
            nut.classList.toggle("dang-chon", dangChon);
            nut.setAttribute("aria-pressed", String(dangChon));
        });
    };

    const capNhatTomTat = () => {
        const gia = Number(khungGioChon.dataset.gia);
        tongTien.textContent = `${new Intl.NumberFormat("vi-VN").format(gia)}đ`;
        tenSanChon.textContent = chonSan.value;
    };

    cacNgayNhanh.forEach((nut) => {
        nut.addEventListener("click", () => {
            if (!(nut instanceof HTMLButtonElement) || !nut.dataset.ngay) {
                return;
            }
            ngayHienTai.value = nut.dataset.ngay;
            capNhatNgayChon();
        });
    });

    ngayHienTai.addEventListener("change", capNhatNgayChon);
    chonSan.addEventListener("change", capNhatTomTat);

    cacKhungGio.forEach((nut) => {
        if (!(nut instanceof HTMLButtonElement)) {
            return;
        }
        nut.addEventListener("click", () => {
            khungGioChon.classList.remove("dang-chon");
            khungGioChon.setAttribute("aria-pressed", "false");
            khungGioChon = nut;
            nut.classList.add("dang-chon");
            nut.setAttribute("aria-pressed", "true");
            capNhatTomTat();
            thongBaoDatSan.hidden = true;
        });
    });

    const khoaYeuThich = "courtconnect-san-yeu-thich";
    const maSan = "tay-ho";
    try {
        const duLieu = localStorage.getItem(khoaYeuThich);
        const cacSanYeuThich = duLieu ? JSON.parse(duLieu) : [];
        if (Array.isArray(cacSanYeuThich) && cacSanYeuThich.includes(maSan)) {
            nutLuuSan.setAttribute("aria-pressed", "true");
            nutLuuSan.textContent = "♥ Đã lưu sân";
        }
    } catch (loi) {
        console.error("Không thể đọc danh sách sân yêu thích.", loi);
    }

    nutLuuSan.addEventListener("click", () => {
        let cacSanYeuThich = [];
        try {
            const duLieu = localStorage.getItem(khoaYeuThich);
            const danhSach = duLieu ? JSON.parse(duLieu) : [];
            if (Array.isArray(danhSach)) {
                cacSanYeuThich = danhSach.filter((san) => typeof san === "string");
            }
            const daLuu = cacSanYeuThich.includes(maSan);
            cacSanYeuThich = daLuu
                ? cacSanYeuThich.filter((san) => san !== maSan)
                : [...cacSanYeuThich, maSan];
            localStorage.setItem(khoaYeuThich, JSON.stringify(cacSanYeuThich));
            nutLuuSan.setAttribute("aria-pressed", String(!daLuu));
            nutLuuSan.textContent = daLuu ? "♡ Lưu sân" : "♥ Đã lưu sân";
        } catch (loi) {
            console.error("Không thể cập nhật danh sách sân yêu thích.", loi);
            thongBaoDatSan.hidden = false;
            thongBaoDatSan.textContent = "Không thể lưu sân vào trình duyệt. Hãy kiểm tra quyền lưu trữ.";
        }
    });

    nutTiepTuc.addEventListener("click", () => {
        const ngay = new Date(`${ngayHienTai.value}T00:00:00`);
        const ngayHienThi = new Intl.DateTimeFormat("vi-VN", {
            weekday: "long",
            day: "2-digit",
            month: "2-digit",
            year: "numeric"
        }).format(ngay);
        thongBaoDatSan.hidden = false;
        thongBaoDatSan.textContent = `Đã chọn Tây Hồ Sports · ${chonSan.value} · ${ngayHienThi} · ${khungGioChon.textContent.replace(/^✓\\s*/, "")}. Đây là bước xem trước; sân chưa được đặt và chưa giữ chỗ.`;
        thongBaoDatSan.scrollIntoView({ behavior: "smooth", block: "nearest" });
    });

    const thamSo = new URLSearchParams(window.location.search);
    const ngayTuLienKet = thamSo.get("ngay");
    if (ngayTuLienKet && Array.from(ngayHienTai.options).some((muc) => muc.value === ngayTuLienKet)) {
        ngayHienTai.value = ngayTuLienKet;
        capNhatNgayChon();
    }

    capNhatTomTat();
}