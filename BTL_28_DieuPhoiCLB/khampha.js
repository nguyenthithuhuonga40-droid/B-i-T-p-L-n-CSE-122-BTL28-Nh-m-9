const cacNutTheLoai = document.querySelectorAll(".the-loai");

cacNutTheLoai.forEach((nut) => {
    nut.addEventListener("click", () => {
        cacNutTheLoai.forEach((muc) => {
            const dangChon = muc === nut;
            muc.classList.toggle("dang-chon", dangChon);
            muc.setAttribute("aria-pressed", String(dangChon));
        });
    });
});