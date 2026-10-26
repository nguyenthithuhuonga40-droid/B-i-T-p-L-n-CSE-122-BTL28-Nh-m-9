const formDangKy = document.querySelector("#form-dang-ky");

if (formDangKy instanceof HTMLFormElement) {
    const taiKhoanAuth = window.CourtConnectAuth;
    const vaiTroInputs = formDangKy.querySelectorAll('input[name="vaiTro"]');
    const cacMon = formDangKy.querySelectorAll('input[name="monTheThao"]');
    const truongMatKhau = formDangKy.elements.namedItem("matKhau");
    const truongXacNhan = formDangKy.elements.namedItem("xacNhanMatKhau");
    const thongBaoForm = document.querySelector("#thong-bao-dang-ky");
    const thongBaoMon = document.querySelector("#loi-mon-the-thao");
    const thongBaoDongY = document.querySelector("#loi-dong-y");
    const mauDangKy = {
        "nguoi-choi": { name: "Nguyễn Minh Anh", phone: "0901234567", email: "nguoi-choi-moi@example.com" },
        "chu-san": { name: "Chủ sân Tây Hồ", phone: "0912345678", email: "chu-san-moi@example.com" },
        "dieu-phoi-clb": { name: "Điều phối viên CLB", phone: "0923456789", email: "dieu-phoi-moi@example.com" }
    };

    const hienLoiTruong = (input, thongBao, noiDung) => {
        const khungTruong = input.closest(".truong-dang-ky");
        if (!(khungTruong instanceof HTMLElement) || !(thongBao instanceof HTMLElement)) {
            throw new Error("Không tìm thấy vùng hiển thị lỗi của trường đăng ký.");
        }

        khungTruong.classList.toggle("co-loi", Boolean(noiDung));
        thongBao.textContent = noiDung;
        if (noiDung) {
            input.setAttribute("aria-invalid", "true");
        } else {
            input.removeAttribute("aria-invalid");
        }
    };

    const capNhatMonTheThao = () => {
        cacMon.forEach((mon) => {
            const khungTrinhDo = formDangKy.querySelector(`[data-mon="${mon.value}"]`);
            if (khungTrinhDo instanceof HTMLElement) {
                khungTrinhDo.hidden = !mon.checked;
            }
        });
    };

    if (!taiKhoanAuth) {
        throw new Error("Không tải được mô-đun xác thực demo.");
    }

    formDangKy.querySelectorAll("[data-demo-signup]").forEach((nut) => {
        nut.addEventListener("click", () => {
            const vaiTro = nut.dataset.demoSignup;
            const hoSo = mauDangKy[vaiTro];
            if (!hoSo) {
                throw new Error(`Không tìm thấy hồ sơ đăng ký mẫu cho vai trò ${vaiTro}.`);
            }

            const luaChonVaiTro = formDangKy.querySelector(`input[name="vaiTro"][value="${vaiTro}"]`);
            const hoTen = formDangKy.elements.namedItem("hoTen");
            const soDienThoai = formDangKy.elements.namedItem("soDienThoai");
            const email = formDangKy.elements.namedItem("email");
            if (
                !(luaChonVaiTro instanceof HTMLInputElement) ||
                !(hoTen instanceof HTMLInputElement) ||
                !(soDienThoai instanceof HTMLInputElement) ||
                !(email instanceof HTMLInputElement) ||
                !(truongMatKhau instanceof HTMLInputElement) ||
                !(truongXacNhan instanceof HTMLInputElement)
            ) {
                throw new Error("Không tìm thấy đủ trường để điền hồ sơ đăng ký mẫu.");
            }

            luaChonVaiTro.checked = true;
            hoTen.value = hoSo.name;
            soDienThoai.value = hoSo.phone;
            email.value = hoSo.email;
            truongMatKhau.value = "CourtConnect123";
            truongXacNhan.value = "CourtConnect123";
            [hoTen, soDienThoai, email, truongMatKhau, truongXacNhan].forEach((input) => {
                input.dispatchEvent(new Event("input", { bubbles: true }));
            });
            capNhatMonTheThao();
        });
    });

    const vaiTroTuUrl = new URLSearchParams(window.location.search).get("vaiTro");
    const luaChonVaiTroTuUrl = vaiTroTuUrl
        ? formDangKy.querySelector(`input[name="vaiTro"][value="${vaiTroTuUrl}"]`)
        : null;
    const vaiTroMacDinh = luaChonVaiTroTuUrl instanceof HTMLInputElement
        ? luaChonVaiTroTuUrl.value
        : "nguoi-choi";
    const nutDienNhanh = formDangKy.querySelector(`[data-demo-signup="${vaiTroMacDinh}"]`);
    if (nutDienNhanh instanceof HTMLButtonElement) {
        nutDienNhanh.click();
    }

    cacMon.forEach((mon) => mon.addEventListener("change", () => {
        capNhatMonTheThao();
        if (thongBaoMon instanceof HTMLElement) {
            thongBaoMon.classList.remove("hien-thi");
            thongBaoMon.textContent = "";
        }
    }));
    capNhatMonTheThao();

    formDangKy.querySelectorAll(".truong-dang-ky input").forEach((input) => {
        input.addEventListener("input", () => {
            const khungTruong = input.closest(".truong-dang-ky");
            if (khungTruong instanceof HTMLElement) {
                khungTruong.classList.remove("co-loi");
                khungTruong.querySelectorAll(".loi-truong-dang-ky").forEach((thongBao) => {
                    thongBao.textContent = "";
                });
            }
            input.removeAttribute("aria-invalid");

            if (input === truongMatKhau && truongXacNhan instanceof HTMLInputElement && truongXacNhan.value) {
                truongXacNhan.dispatchEvent(new Event("input", { bubbles: true }));
            }
        });
    });

    formDangKy.addEventListener("submit", (suKien) => {
        suKien.preventDefault();
        if (
            !(thongBaoForm instanceof HTMLElement) ||
            !(truongMatKhau instanceof HTMLInputElement) ||
            !(truongXacNhan instanceof HTMLInputElement) ||
            !(thongBaoMon instanceof HTMLElement) ||
            !(thongBaoDongY instanceof HTMLElement)
        ) {
            throw new Error("Biểu mẫu đăng ký thiếu thành phần cần thiết.");
        }

        thongBaoForm.classList.remove("hien-thi");
        thongBaoForm.textContent = "";

        const truongBatBuoc = [
            ["hoTen", "#loi-ho-ten", "Vui lòng nhập họ và tên."],
            ["soDienThoai", "#loi-so-dien-thoai", "Vui lòng nhập số điện thoại hợp lệ."],
            ["email", "#loi-email-dang-ky", "Vui lòng nhập email hợp lệ."],
            ["matKhau", "#loi-mat-khau-dang-ky", "Mật khẩu cần ít nhất 8 ký tự, gồm chữ và số."]
        ];
        let truongLoiDauTien = null;

        truongBatBuoc.forEach(([ten, idThongBao, loiMacDinh]) => {
            const input = formDangKy.elements.namedItem(ten);
            const thongBao = document.querySelector(idThongBao);
            if (!(input instanceof HTMLInputElement) || !(thongBao instanceof HTMLElement)) {
                throw new Error(`Không tìm thấy trường ${ten} của biểu mẫu.`);
            }

            let loi = "";
            if (!input.value.trim()) {
                loi = ten === "matKhau" ? loiMacDinh : "Vui lòng nhập thông tin này.";
            } else if (!input.validity.valid) {
                loi = ten === "email"
                    ? "Email chưa đúng định dạng. Vui lòng kiểm tra lại."
                    : loiMacDinh;
            } else if (ten === "soDienThoai" && input.value.replace(/\D/g, "").length < 9) {
                loi = loiMacDinh;
            } else if (ten === "matKhau" && (!/[A-Za-zÀ-ỹ]/.test(input.value) || !/\d/.test(input.value))) {
                loi = loiMacDinh;
            }

            hienLoiTruong(input, thongBao, loi);
            if (loi && !truongLoiDauTien) {
                truongLoiDauTien = input;
            }
        });

        const loiXacNhan = document.querySelector("#loi-xac-nhan-mat-khau");
        if (!(loiXacNhan instanceof HTMLElement)) {
            throw new Error("Không tìm thấy vùng báo lỗi xác nhận mật khẩu.");
        }
        const matKhauKhongKhop = !truongXacNhan.value || truongXacNhan.value !== truongMatKhau.value;
        hienLoiTruong(
            truongXacNhan,
            loiXacNhan,
            matKhauKhongKhop
                ? truongXacNhan.value
                    ? "Mật khẩu nhập lại chưa khớp."
                    : "Vui lòng nhập lại mật khẩu."
                : ""
        );
        if (matKhauKhongKhop && !truongLoiDauTien) {
            truongLoiDauTien = truongXacNhan;
        }

        const dongY = formDangKy.elements.namedItem("dongY");
        if (!(dongY instanceof HTMLInputElement)) {
            throw new Error("Không tìm thấy lựa chọn đồng ý điều khoản.");
        }
        thongBaoDongY.textContent = dongY.checked ? "" : "Bạn cần đồng ý với điều khoản để tiếp tục.";
        thongBaoDongY.classList.toggle("hien-thi", !dongY.checked);
        dongY.setAttribute("aria-invalid", String(!dongY.checked));
        if (!dongY.checked && !truongLoiDauTien) {
            truongLoiDauTien = dongY;
        }

        const vaiTro = formDangKy.querySelector('input[name="vaiTro"]:checked');
        const canKhaiBaoTrinhDo = vaiTro instanceof HTMLInputElement && vaiTro.value === "nguoi-choi";
        const coMonDaChon = Array.from(cacMon).some((mon) => mon.checked);
        thongBaoMon.classList.toggle("hien-thi", canKhaiBaoTrinhDo && !coMonDaChon);
        thongBaoMon.textContent = canKhaiBaoTrinhDo && !coMonDaChon
            ? "Vui lòng chọn ít nhất một môn thể thao."
            : "";
        if (canKhaiBaoTrinhDo && !coMonDaChon && !truongLoiDauTien) {
            truongLoiDauTien = cacMon.item(0);
        }

        if (truongLoiDauTien) {
            truongLoiDauTien.focus();
            return;
        }

        const hoTen = formDangKy.elements.namedItem("hoTen");
        const soDienThoai = formDangKy.elements.namedItem("soDienThoai");
        const email = formDangKy.elements.namedItem("email");
        const vaiTroDaChon = formDangKy.querySelector('input[name="vaiTro"]:checked');
        if (
            !(hoTen instanceof HTMLInputElement) ||
            !(soDienThoai instanceof HTMLInputElement) ||
            !(email instanceof HTMLInputElement) ||
            !(vaiTroDaChon instanceof HTMLInputElement)
        ) {
            throw new Error("Không thể đọc đủ thông tin tài khoản đăng ký.");
        }

        try {
            taiKhoanAuth.register({
                name: hoTen.value.trim(),
                phone: soDienThoai.value.trim(),
                email: email.value,
                password: truongMatKhau.value,
                role: vaiTroDaChon.value
            });
        } catch (loi) {
            thongBaoForm.textContent = loi instanceof Error
                ? `Không thể tạo tài khoản: ${loi.message}`
                : "Không thể tạo tài khoản do lỗi không xác định.";
            thongBaoForm.classList.add("hien-thi");
        }
    });
}