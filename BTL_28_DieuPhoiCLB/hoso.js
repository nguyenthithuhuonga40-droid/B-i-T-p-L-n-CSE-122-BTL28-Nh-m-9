const formHoSo = document.querySelector("#form-ho-so");

if (formHoSo instanceof HTMLFormElement) {
    const khoaLuu = "courtconnect-ho-so";
    const nutSuaLich = document.querySelector("#nut-sua-lich");
    const thongBaoLuu = document.querySelector("#thong-bao-luu-ho-so");
    const tepAnh = document.querySelector("#tep-anh-dai-dien");
    const anhDaiDien = document.querySelector("#anh-dai-dien");
    const tenTrenMenu = document.querySelector("#ten-tren-menu");
    const truongTen = formHoSo.elements.namedItem("tenHienThi");
    const nutDongTaiKhoan = document.querySelector("#nut-dong-tai-khoan");
    const hopThoaiDongTaiKhoan = document.querySelector("#hop-thoai-dong-tai-khoan");
    const nutXacNhanDongTaiKhoan = document.querySelector("#xac-nhan-dong-tai-khoan");
    let dangSuaLich = false;
    let urlAnhTam = null;

    if (
        !(nutSuaLich instanceof HTMLButtonElement) ||
        !(thongBaoLuu instanceof HTMLElement) ||
        !(tepAnh instanceof HTMLInputElement) ||
        !(anhDaiDien instanceof HTMLElement) ||
        !(tenTrenMenu instanceof HTMLElement) ||
        !(truongTen instanceof HTMLInputElement) ||
        !(nutDongTaiKhoan instanceof HTMLButtonElement) ||
        !(hopThoaiDongTaiKhoan instanceof HTMLDialogElement) ||
        !(nutXacNhanDongTaiKhoan instanceof HTMLButtonElement)
    ) {
        throw new Error("Trang hồ sơ thiếu thành phần cần thiết.");
    }

    const layGiaTriHoSo = () => {
        const duLieu = {};
        const cacTenTruong = new Set(
            Array.from(formHoSo.elements)
                .filter((truong) => truong.name && !(truong instanceof HTMLButtonElement))
                .map((truong) => truong.name)
        );

        cacTenTruong.forEach((khoa) => {
            const input = formHoSo.elements.namedItem(khoa);
            if (input instanceof RadioNodeList || (input instanceof NodeList)) {
                const cacMuc = Array.from(input);
                duLieu[khoa] = cacMuc.some((muc) => muc instanceof HTMLInputElement && muc.type === "radio")
                    ? cacMuc.find((muc) => muc instanceof HTMLInputElement && muc.checked)?.value ?? ""
                    : cacMuc.some((muc) => muc instanceof HTMLInputElement && muc.type === "checkbox")
                        ? cacMuc.map((muc) => muc instanceof HTMLInputElement && muc.checked)
                        : cacMuc.map((muc) => muc.value);
            } else if (input instanceof HTMLInputElement && input.type === "checkbox") {
                duLieu[khoa] = input.checked;
            } else if (input instanceof HTMLInputElement || input instanceof HTMLTextAreaElement || input instanceof HTMLSelectElement) {
                duLieu[khoa] = input.value;
            }
        });
        return duLieu;
    };

    const hienThongBao = (noiDung, daLuu = false) => {
        thongBaoLuu.textContent = noiDung;
        thongBaoLuu.classList.toggle("da-luu", daLuu);
    };

    truongTen.addEventListener("input", () => {
        tenTrenMenu.textContent = truongTen.value.trim() || "Người chơi";
    });

    try {
        const duLieuDaLuu = localStorage.getItem(khoaLuu);
        if (duLieuDaLuu) {
            const duLieu = JSON.parse(duLieuDaLuu);
            Object.entries(duLieu).forEach(([khoa, giaTri]) => {
                const input = formHoSo.elements.namedItem(khoa);
                if (input instanceof RadioNodeList) {
                    Array.from(input).forEach((muc) => {
                        if (muc instanceof HTMLInputElement) {
                            muc.checked = Array.isArray(giaTri) ? giaTri.includes(muc.value) : muc.value === giaTri;
                        }
                    });
                } else if (input instanceof HTMLInputElement || input instanceof HTMLTextAreaElement || input instanceof HTMLSelectElement) {
                    if (input.type === "checkbox" && input instanceof HTMLInputElement) {
                        input.checked = Boolean(giaTri);
                    } else if (typeof giaTri === "string") {
                        input.value = giaTri;
                    }
                }
            });
            tenTrenMenu.textContent = truongTen.value.trim() || "Người chơi";
            hienThongBao("Đã khôi phục thông tin đã lưu trên trình duyệt này.", true);
        }
    } catch (loi) {
        console.error("Không thể đọc thông tin hồ sơ đã lưu.", loi);
        hienThongBao("Không thể đọc dữ liệu đã lưu. Hãy kiểm tra cài đặt lưu trữ của trình duyệt.");
    }

    formHoSo.addEventListener("submit", (suKien) => {
        suKien.preventDefault();
        if (!formHoSo.reportValidity()) {
            return;
        }

        try {
            localStorage.setItem(khoaLuu, JSON.stringify(layGiaTriHoSo()));
            hienThongBao("Đã lưu hồ sơ trên trình duyệt này. Đây là bản demo, dữ liệu chưa được gửi lên máy chủ.", true);
        } catch (loi) {
            console.error("Không thể lưu thông tin hồ sơ.", loi);
            hienThongBao("Không thể lưu hồ sơ vào trình duyệt. Hãy kiểm tra dung lượng hoặc quyền lưu trữ.");
        }
    });

    nutSuaLich.addEventListener("click", () => {
        dangSuaLich = !dangSuaLich;
        formHoSo.querySelectorAll(".dong-lich input, .dong-lich select").forEach((truong) => {
            truong.disabled = !dangSuaLich;
        });
        nutSuaLich.textContent = dangSuaLich ? "Xong chỉnh sửa" : "Chỉnh sửa lịch rảnh";
        if (dangSuaLich) {
            formHoSo.querySelector(".dong-lich input")?.focus();
        } else {
            hienThongBao("Lịch rảnh đã được cập nhật. Chọn “Lưu thay đổi” để lưu trên trình duyệt.", true);
        }
    });

    tepAnh.addEventListener("change", () => {
        const tep = tepAnh.files?.[0];
        if (!tep) {
            return;
        }

        if (!tep.type.startsWith("image/")) {
            hienThongBao("Vui lòng chọn tệp ảnh hợp lệ.");
            tepAnh.value = "";
            return;
        }

        if (tep.size > 5 * 1024 * 1024) {
            hienThongBao("Ảnh đại diện cần nhỏ hơn 5 MB.");
            tepAnh.value = "";
            return;
        }

        if (urlAnhTam) {
            URL.revokeObjectURL(urlAnhTam);
        }
        urlAnhTam = URL.createObjectURL(tep);
        anhDaiDien.classList.add("co-anh");
        anhDaiDien.replaceChildren();
        const anh = document.createElement("img");
        anh.src = urlAnhTam;
        anh.alt = "Ảnh đại diện vừa chọn";
        anhDaiDien.append(anh);
        hienThongBao("Ảnh xem trước đã cập nhật trong phiên này. Ảnh chưa được tải lên máy chủ.");
    });

    nutDongTaiKhoan.addEventListener("click", () => {
        hopThoaiDongTaiKhoan.showModal();
    });

    hopThoaiDongTaiKhoan.addEventListener("close", () => {
        if (hopThoaiDongTaiKhoan.returnValue === "confirm") {
            hienThongBao("Đã ghi nhận yêu cầu minh họa. Tài khoản chưa bị thay đổi hoặc xóa.");
        }
    });

    window.addEventListener("beforeunload", () => {
        if (urlAnhTam) {
            URL.revokeObjectURL(urlAnhTam);
        }
    });
}