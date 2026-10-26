const cacHang = Array.from(document.querySelectorAll("#cac-man-hinh tr"));
const tuKhoa = document.querySelector("#tu-khoa");
const locVaiTro = document.querySelector("#loc-vai-tro");
const demKetQua = document.querySelector("#dem-ket-qua");
const tongSoManHinh = document.querySelector("#tong-so-man-hinh");

if (
    cacHang.length !== 25 ||
    !(tuKhoa instanceof HTMLInputElement) ||
    !(locVaiTro instanceof HTMLSelectElement) ||
    !(demKetQua instanceof HTMLElement) ||
    !(tongSoManHinh instanceof HTMLElement)
) {
    throw new Error("Bảng kiểm kê thiếu dữ liệu hoặc thành phần lọc.");
}

const capNhatBang = () => {
    const tuKhoaTim = tuKhoa.value.trim().toLocaleLowerCase("vi");
    const vaiTroChon = locVaiTro.value;
    let soHangHien = 0;

    cacHang.forEach((hang) => {
        const khopVaiTro = !vaiTroChon || hang.dataset.vaiTro === vaiTroChon;
        const khopTuKhoa = !tuKhoaTim || hang.textContent.toLocaleLowerCase("vi").includes(tuKhoaTim);
        hang.hidden = !(khopVaiTro && khopTuKhoa);
        if (!hang.hidden) soHangHien += 1;
    });

    const ketQua = `${soHangHien}/${cacHang.length} màn hình`;
    demKetQua.textContent = ketQua;
    tongSoManHinh.textContent = `Hiển thị ${ketQua}`;
};

tuKhoa.addEventListener("input", capNhatBang);
locVaiTro.addEventListener("change", capNhatBang);
