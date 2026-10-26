const cacMau = document.querySelectorAll(".mau");
const ghiChuMau = document.querySelector("#ghi-chu-mau");
const cacNutDieuHuong = document.querySelectorAll(".dieu-huong-mau button");
const thongBaoDieuHuong = document.querySelector("#thong-bao-dieu-huong");

if (!(ghiChuMau instanceof HTMLElement) || !(thongBaoDieuHuong instanceof HTMLElement)) {
    throw new Error("Trang hệ thống thiết kế thiếu thành phần tương tác.");
}

cacMau.forEach((mau) => {
    if (!(mau instanceof HTMLButtonElement)) return;
    mau.addEventListener("click", async () => {
        const maMau = mau.dataset.color;
        const tenMau = mau.querySelector("strong")?.textContent;
        if (!maMau || !tenMau) {
            throw new Error("Không tìm thấy thông tin màu để sao chép.");
        }
        if (!navigator.clipboard?.writeText) {
            ghiChuMau.textContent = `${tenMau}: ${maMau}. Trình duyệt này không cho phép sao chép tự động.`;
            return;
        }
        try {
            await navigator.clipboard.writeText(maMau);
            ghiChuMau.textContent = `Đã sao chép màu ${tenMau} ${maMau}.`;
        } catch (loi) {
            console.error("Không thể sao chép mã màu.", loi);
            ghiChuMau.textContent = `Mã màu ${tenMau}: ${maMau}. Không thể sao chép tự động trong trình duyệt này.`;
        }
    });
});

cacNutDieuHuong.forEach((nut) => {
    nut.addEventListener("click", () => {
        cacNutDieuHuong.forEach((muc) => muc.classList.toggle("dang-chon", muc === nut));
        thongBaoDieuHuong.textContent = `Đang xem mục mẫu: ${nut.dataset.muc || nut.textContent.trim()}.`;
    });
});

document.querySelectorAll("[data-thao-tac]").forEach((nut) => {
    if (!(nut instanceof HTMLButtonElement)) return;
    nut.addEventListener("click", () => {
        thongBaoDieuHuong.textContent = `${nut.dataset.thaoTac}: thao tác minh họa, chưa cập nhật dữ liệu thật.`;
    });
});

document.querySelector(".nut-yeu-thich")?.addEventListener("click", (suKien) => {
    const nut = suKien.currentTarget;
    if (!(nut instanceof HTMLButtonElement)) return;
    const daLuu = nut.getAttribute("aria-pressed") !== "true";
    nut.setAttribute("aria-pressed", String(daLuu));
    nut.textContent = daLuu ? "♥" : "♡";
});
