const formDangNhap = document.querySelector("#form-dang-nhap");

if (formDangNhap instanceof HTMLFormElement) {
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

        thongBaoForm.textContent = "Thông tin đã đầy đủ. Hãy kết nối hệ thống xác thực để đăng nhập tài khoản.";
        thongBaoForm.classList.add("hien-thi");
    });
}