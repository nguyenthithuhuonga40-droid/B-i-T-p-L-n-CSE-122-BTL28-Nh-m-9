const formKhoiPhuc = document.querySelector("#form-khoi-phuc");

if (formKhoiPhuc instanceof HTMLFormElement) {
    const emailKhoiPhuc = formKhoiPhuc.elements.namedItem("email");
    const truongEmail = document.querySelector(".truong-email-khoi-phuc");
    const loiEmail = document.querySelector("#loi-email-khoi-phuc");
    const trangThai = document.querySelector("#trang-thai-khoi-phuc");
    const nutGuiLai = document.querySelector("#nut-gui-lai");
    const nutDoiEmail = document.querySelector("#nut-doi-email");
    let boDemGuiLai = null;

    if (
        !(emailKhoiPhuc instanceof HTMLInputElement) ||
        !(truongEmail instanceof HTMLElement) ||
        !(loiEmail instanceof HTMLElement) ||
        !(trangThai instanceof HTMLElement) ||
        !(nutGuiLai instanceof HTMLButtonElement) ||
        !(nutDoiEmail instanceof HTMLButtonElement)
    ) {
        throw new Error("Biểu mẫu khôi phục mật khẩu thiếu thành phần cần thiết.");
    }

    const xoaLoiEmail = () => {
        truongEmail.classList.remove("co-loi");
        emailKhoiPhuc.removeAttribute("aria-invalid");
        loiEmail.textContent = "";
    };

    const batDauDemNguoc = () => {
        let giayConLai = 60;
        nutGuiLai.disabled = true;
        nutGuiLai.textContent = `Gửi lại sau ${giayConLai} giây`;

        boDemGuiLai = window.setInterval(() => {
            giayConLai -= 1;
            if (giayConLai <= 0) {
                window.clearInterval(boDemGuiLai);
                boDemGuiLai = null;
                nutGuiLai.disabled = false;
                nutGuiLai.textContent = "Gửi lại liên kết";
                return;
            }

            nutGuiLai.textContent = `Gửi lại sau ${giayConLai} giây`;
        }, 1000);
    };

    const hienTrangThai = () => {
        trangThai.hidden = false;
        if (boDemGuiLai === null) {
            batDauDemNguoc();
        }
    };

    const guiYeuCau = () => {
        xoaLoiEmail();
        if (!emailKhoiPhuc.value.trim()) {
            truongEmail.classList.add("co-loi");
            emailKhoiPhuc.setAttribute("aria-invalid", "true");
            loiEmail.textContent = "Vui lòng nhập email tài khoản.";
            emailKhoiPhuc.focus();
            return false;
        }

        if (!emailKhoiPhuc.validity.valid) {
            truongEmail.classList.add("co-loi");
            emailKhoiPhuc.setAttribute("aria-invalid", "true");
            loiEmail.textContent = "Email chưa đúng định dạng. Vui lòng kiểm tra lại.";
            emailKhoiPhuc.focus();
            return false;
        }

        hienTrangThai();
        return true;
    };

    emailKhoiPhuc.addEventListener("input", xoaLoiEmail);

    formKhoiPhuc.addEventListener("submit", (suKien) => {
        suKien.preventDefault();
        guiYeuCau();
    });

    nutGuiLai.addEventListener("click", () => {
        if (!nutGuiLai.disabled) {
            guiYeuCau();
        }
    });

    nutDoiEmail.addEventListener("click", () => {
        if (boDemGuiLai !== null) {
            window.clearInterval(boDemGuiLai);
            boDemGuiLai = null;
        }
        trangThai.hidden = true;
        nutGuiLai.disabled = true;
        nutGuiLai.textContent = "Gửi lại sau 60 giây";
        emailKhoiPhuc.value = "";
        xoaLoiEmail();
        emailKhoiPhuc.focus();
    });
}