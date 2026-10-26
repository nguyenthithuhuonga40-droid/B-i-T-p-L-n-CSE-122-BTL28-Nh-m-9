const cacTheAi = Array.from(document.querySelectorAll(".the-ai"));
const cacThePhanHoi = Array.from(document.querySelectorAll(".the-phan-hoi"));
const thongBaoChung = document.querySelector("#thong-bao-chung");

if (cacTheAi.length !== 3 || cacThePhanHoi.length !== 12 || !(thongBaoChung instanceof HTMLElement)) {
    throw new Error("Trang trạng thái thiếu nội dung hoặc thành phần tương tác.");
}

const ketQuaAi = {
    "skill-match": "Đôi vui cuối tuần · P02",
    "team-balancer": "Đội A 13.0 · Đội B 13.0",
    "no-show": "Gợi ý gọi để xác nhận lại"
};

const capNhatTrangThaiAi = (the, thongDiep, { processing = false, complete = false } = {}) => {
    const mucXuLy = the.querySelector("[data-processing]");
    const mucGhiChu = the.querySelector("[data-process-note]");
    const mucKetQua = the.querySelector("[data-result-status]");
    if ((processing || complete) && mucXuLy) mucXuLy.textContent = thongDiep;
    the.classList.toggle("dang-xu-ly", processing);
    the.classList.toggle("da-xu-ly", complete);
    if ((processing || complete) && mucGhiChu && thongDiep) {
        mucGhiChu.textContent = thongDiep;
    }
    if (!processing && !complete && mucKetQua && thongDiep) {
        mucKetQua.textContent = thongDiep;
    }
};

const batDauGiaLap = (the) => {
    the.classList.remove("da-xu-ly");
    the.classList.add("dang-xu-ly");
    const mucXuLy = the.querySelector("[data-processing]");
    if (mucXuLy) mucXuLy.textContent = "Đang kiểm tra dữ liệu minh họa...";
    const mucKetQua = the.querySelector("[data-result-status]");
    if (mucKetQua) mucKetQua.textContent = "";
    capNhatTrangThaiAi(the, "Đang kiểm tra dữ liệu giả lập; không thực hiện thao tác thật.", { processing: true });
    window.setTimeout(() => {
        if (!the.isConnected) return;
        capNhatTrangThaiAi(the, "Đã hoàn tất kiểm tra giả lập. Xem lý do rồi tự quyết định.", { complete: true });
    }, 550);
};

const hienHopThoaiChinhSua = (the) => {
    const ketQua = the.querySelector(".buoc-ket-qua h3");
    if (!(ketQua instanceof HTMLElement)) {
        throw new Error("Không tìm thấy phần kết quả để chỉnh sửa.");
    }
    const tenMoi = window.prompt("Sửa nội dung gợi ý:", ketQua.textContent || "");
    if (tenMoi === null) return;
    const tenHopLe = tenMoi.trim().slice(0, 90);
    if (!tenHopLe) {
        capNhatTrangThaiAi(the, "Nội dung không được để trống. Gợi ý cũ vẫn được giữ nguyên.");
        return;
    }
    ketQua.textContent = tenHopLe;
    capNhatTrangThaiAi(the, "Đã sửa kết quả trên màn hình này. Chưa lưu vào hệ thống.");
};

const xuLyHanhDongAi = (the, hanhDong, nut) => {
    const tenLoai = the.dataset.ai;
    switch (hanhDong) {
        case "generate":
        case "retry":
            batDauGiaLap(the);
            break;
        case "manual":
            capNhatTrangThaiAi(the, "Đã chọn xử lý thủ công. Hãy kiểm tra dữ liệu và tự hoàn tất.");
            break;
        case "skip":
            capNhatTrangThaiAi(the, "Đã bỏ qua gợi ý; không thay đổi lịch, đơn hoặc danh sách người chơi.");
            break;
        case "accept":
            capNhatTrangThaiAi(the, `Đã chọn “${ketQuaAi[tenLoai]}”. Bước tiếp theo vẫn cần con người xác nhận; chưa có giao dịch nào được thực hiện.`);
            break;
        case "edit":
            hienHopThoaiChinhSua(the);
            break;
        case "reject":
            capNhatTrangThaiAi(the, "Đã từ chối gợi ý. Không thay đổi trạng thái của người chơi, đơn đặt hoặc sự kiện.");
            break;
        case "save": {
            const daLuu = nut.getAttribute("aria-pressed") !== "true";
            nut.setAttribute("aria-pressed", String(daLuu));
            nut.textContent = daLuu ? "Đã lưu" : "Lưu";
            capNhatTrangThaiAi(the, daLuu ? "Đã lưu gợi ý trong phiên xem trước này." : "Đã bỏ lưu gợi ý trong phiên xem trước này.");
            break;
        }
        default:
            throw new Error(`Thao tác AI không được hỗ trợ: ${hanhDong}`);
    }
};

cacTheAi.forEach((the) => {
    the.addEventListener("click", (suKien) => {
        const mucTieu = suKien.target;
        if (!(mucTieu instanceof Element)) return;
        const nut = mucTieu.closest("[data-action]");
        if (!(nut instanceof HTMLButtonElement)) return;
        const hanhDong = nut.dataset.action;
        if (!hanhDong) {
            throw new Error("Nút AI thiếu mã thao tác.");
        }
        xuLyHanhDongAi(the, hanhDong, nut);
    });
});

const thongBaoTacVu = (the, noiDung) => {
    const trangThai = the.querySelector(".phan-hoi-tac-vu");
    if (trangThai) trangThai.textContent = noiDung;
};

document.querySelectorAll("[data-state-action]").forEach((nut) => {
    if (!(nut instanceof HTMLButtonElement)) return;
    nut.addEventListener("click", () => {
        const hanhDong = nut.dataset.stateAction;
        const the = nut.closest(".the-phan-hoi");
        if (!(the instanceof HTMLElement) || !hanhDong) return;

        switch (hanhDong) {
            case "clear-filters":
                thongBaoTacVu(the, "Đã xóa bộ lọc trong bản xem trước. Chưa tải dữ liệu thật.");
                break;
            case "retry-load":
                thongBaoTacVu(the, "Chưa kết nối máy chủ. Dữ liệu đã nhập được giữ lại để thử sau.");
                break;
            case "withdraw":
                thongBaoTacVu(the, "Đã ghi nhận ý định rút yêu cầu trong bản xem trước. Chưa gửi cập nhật tới người tổ chức.");
                break;
            case "confirm-cancel": {
                const lyDo = document.querySelector("#ly-do-huy");
                const noiDungLyDo = lyDo instanceof HTMLInputElement ? lyDo.value.trim() : "";
                if (!noiDungLyDo) {
                    if (lyDo instanceof HTMLInputElement) {
                        lyDo.setCustomValidity("Vui lòng nhập lý do hủy.");
                        lyDo.reportValidity();
                        lyDo.setCustomValidity("");
                    }
                    return;
                }
                thongBaoTacVu(the, `Đã xác nhận ý định hủy với lý do “${noiDungLyDo}”. Chưa gửi tới sân và chưa hoàn tiền.`);
                break;
            }
            case "dismiss":
                thongBaoTacVu(the, "Đã giữ lịch đặt sân.");
                break;
            case "archive":
                thongBaoTacVu(the, "Đã chọn lưu trữ sự kiện trong bản xem trước. Chưa thay đổi dữ liệu thật.");
                break;
            case "restore":
                thongBaoTacVu(the, "Đã quay lại; sự kiện vẫn ở trạng thái hiện tại.");
                break;
            default:
                throw new Error(`Thao tác trạng thái không được hỗ trợ: ${hanhDong}`);
        }
    });
});
