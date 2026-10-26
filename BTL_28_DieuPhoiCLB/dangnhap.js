const formDangNhap = document.querySelector("#form-dang-nhap");

if (formDangNhap instanceof HTMLFormElement) {
    const inputEmail = formDangNhap.elements.namedItem("email");
    const inputMatKhau = formDangNhap.elements.namedItem("matKhau");
    const cacTaiKhoanDemo = document.querySelectorAll("[data-demo-account]");
    const taiKhoanAuth = window.CourtConnectAuth;
    const cacTruong = [
        {
            input: formDangNhap.elements.namedItem("email"),
            thongBao: document.querySelector("#loi-email"),
            nhom: "email"
        },
        {
            input: formDangNhap.elements.namedItem("matKhau"),
            thongBao: document.querySelector("#loi-mat-khau"),
            nhom: "mat-khau"
        }
    ];
    const thongBaoForm = document.querySelector("#thong-bao-form");

    if (!(inputEmail instanceof HTMLInputElement) || !(inputMatKhau instanceof HTMLInputElement)) {
        throw new Error("Không tìm thấy trường đăng nhập email hoặc mật khẩu.");
    }
    if (!taiKhoanAuth) {
        throw new Error("Không tải được mô-đun xác thực demo.");
    }

    const napTaiKhoanDemo = (vaiTro) => {
        const taiKhoan = taiKhoanAuth.demoAccounts.find((muc) => muc.role === vaiTro);
        if (!taiKhoan) {
            throw new Error(`Không tìm thấy tài khoản demo cho vai trò ${vaiTro}.`);
        }
        inputEmail.value = taiKhoan.email;
        inputMatKhau.value = taiKhoan.password;
        inputEmail.dispatchEvent(new Event("input", { bubbles: true }));
        inputMatKhau.dispatchEvent(new Event("input", { bubbles: true }));
    };

    cacTaiKhoanDemo.forEach((nut) => {
        nut.addEventListener("click", () => napTaiKhoanDemo(nut.dataset.demoAccount));
    });

    const vaiTroTuUrl = new URLSearchParams(window.location.search).get("vaiTro");
    napTaiKhoanDemo(vaiTroTuUrl || "nguoi-choi");

    cacTruong.forEach(({ input }) => {
        if (input instanceof HTMLInputElement) {
            input.addEventListener("input", () => {
                input.removeAttribute("aria-invalid");
                input.closest(".truong-nhap")?.classList.remove("co-loi");
                const thongBao = input.closest(".truong-nhap")?.querySelector(".loi-truong");
                if (thongBao) {
                    thongBao.textContent = "";
                }
            });
        }
    });

    formDangNhap.addEventListener("submit", (suKien) => {
        suKien.preventDefault();
        if (!(thongBaoForm instanceof HTMLElement)) {
            throw new Error("Không tìm thấy khu vực thông báo của biểu mẫu.");
        }

        thongBaoForm.classList.remove("hien-thi");
        thongBaoForm.textContent = "";
        let truongLoiDauTien = null;

        cacTruong.forEach(({ input, thongBao, nhom }) => {
            if (!(input instanceof HTMLInputElement) || !(thongBao instanceof HTMLElement)) {
                throw new Error(`Không tìm thấy trường ${nhom} của biểu mẫu.`);
            }

            const hopLe = input.validity.valid;
            const nhomNhap = input.closest(".truong-nhap");
            if (!(nhomNhap instanceof HTMLElement)) {
                throw new Error(`Không tìm thấy vùng nhập ${nhom} của biểu mẫu.`);
            }

            nhomNhap.classList.toggle("co-loi", !hopLe);
            if (hopLe) {
                input.removeAttribute("aria-invalid");
                thongBao.textContent = "";
                return;
            }

            input.setAttribute("aria-invalid", "true");
            thongBao.textContent = input.validity.valueMissing
                ? "Vui lòng nhập thông tin này."
                : nhom === "email"
                    ? "Email chưa đúng định dạng. Vui lòng kiểm tra lại."
                    : "Mật khẩu không hợp lệ.";
            truongLoiDauTien ??= input;
        });

        if (truongLoiDauTien) {
            truongLoiDauTien.focus();
            return;
        }

        try {
            const dangNhapThanhCong = taiKhoanAuth.login(inputEmail.value, inputMatKhau.value);
            if (dangNhapThanhCong) {
                return;
            }
            thongBaoForm.textContent = "Email hoặc mật khẩu không đúng. Hãy chọn tài khoản demo hoặc kiểm tra lại.";
        } catch (loi) {
            thongBaoForm.textContent = loi instanceof Error
                ? `Không thể đăng nhập: ${loi.message}`
                : "Không thể đăng nhập do lỗi không xác định.";
        }
        thongBaoForm.classList.add("hien-thi");
    });
}