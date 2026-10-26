const danhSachThongBao = document.querySelector("#cac-thong-bao");

if (danhSachThongBao instanceof HTMLElement) {
    const khoaDaDoc = "courtconnect-thongbao-da-doc";
    const khoaCaiDat = "courtconnect-thongbao-caidat";
    const cacThe = Array.from(danhSachThongBao.querySelectorAll(".the-thong-bao"));
    const cacBoLoc = document.querySelectorAll(".bo-loc");
    const nutDanhDauTatCa = document.querySelector("#nut-danh-dau-tat-ca");
    const soChuaDoc = document.querySelector("#so-thong-bao-chua-doc");
    const khongCoThongBao = document.querySelector("#khong-co-thong-bao");
    const nutLuuCaiDat = document.querySelector("#nut-luu-cai-dat");
    const thongBaoCaiDat = document.querySelector("#thong-bao-cai-dat");
    let boLocHienTai = "tat-ca";
    let cacIdDaDoc = [];

    if (
        !(nutDanhDauTatCa instanceof HTMLButtonElement) ||
        !(soChuaDoc instanceof HTMLElement) ||
        !(khongCoThongBao instanceof HTMLElement) ||
        !(nutLuuCaiDat instanceof HTMLButtonElement) ||
        !(thongBaoCaiDat instanceof HTMLElement)
    ) {
        throw new Error("Trang thông báo thiếu thành phần cần thiết.");
    }

    const docDanhSach = (khoa) => {
        try {
            const duLieu = localStorage.getItem(khoa);
            return duLieu ? JSON.parse(duLieu) : null;
        } catch (loi) {
            console.error(`Không thể đọc dữ liệu ${khoa}.`, loi);
            thongBaoCaiDat.hidden = false;
            thongBaoCaiDat.textContent = "Không thể đọc cài đặt đã lưu trên trình duyệt.";
            return null;
        }
    };

    const luuDanhSach = (khoa, duLieu) => {
        try {
            localStorage.setItem(khoa, JSON.stringify(duLieu));
            return true;
        } catch (loi) {
            console.error(`Không thể lưu dữ liệu ${khoa}.`, loi);
            thongBaoCaiDat.hidden = false;
            thongBaoCaiDat.textContent = "Không thể lưu cài đặt. Hãy kiểm tra quyền lưu trữ của trình duyệt.";
            return false;
        }
    };

    const capNhatThe = (the) => {
        const daDoc = cacIdDaDoc.includes(the.dataset.id);
        the.classList.toggle("da-doc", daDoc);
        the.classList.toggle("chua-doc", !daDoc);

        const nhanChuaDoc = the.querySelector(".nhan-chua-doc");
        const trangThaiDaDoc = the.querySelector(".trang-thai-da-doc");
        const nut = the.querySelector(".nut-danh-dau-doc");
        if (
            !(nhanChuaDoc instanceof HTMLElement) ||
            !(trangThaiDaDoc instanceof HTMLElement) ||
            !(nut instanceof HTMLButtonElement)
        ) {
            throw new Error("Thông báo thiếu thành phần trạng thái đọc.");
        }

        nhanChuaDoc.hidden = daDoc;
        trangThaiDaDoc.hidden = !daDoc;
        nut.textContent = daDoc ? "Chưa đọc" : "Đã đọc";
        nut.setAttribute(
            "aria-label",
            `Đánh dấu ${the.querySelector("h2")?.textContent ?? "thông báo"} là ${daDoc ? "chưa đọc" : "đã đọc"}`
        );
    };

    const capNhatDanhSach = () => {
        let soHienThi = 0;
        let demChuaDoc = 0;
        cacThe.forEach((the) => {
            const daDoc = cacIdDaDoc.includes(the.dataset.id);
            if (!daDoc) {
                demChuaDoc += 1;
            }

            const khopBoLoc = boLocHienTai === "tat-ca"
                || (boLocHienTai === "chua-doc" && !daDoc)
                || the.dataset.loai === boLocHienTai;
            the.hidden = !khopBoLoc;
            if (khopBoLoc) {
                soHienThi += 1;
            }
        });

        soChuaDoc.textContent = demChuaDoc ? String(demChuaDoc) : "";
        khongCoThongBao.hidden = soHienThi !== 0;
    };

    const luuTrangThaiDaDoc = () => {
        if (luuDanhSach(khoaDaDoc, cacIdDaDoc)) {
            cacThe.forEach(capNhatThe);
            capNhatDanhSach();
        }
    };

    const duLieuDaDoc = docDanhSach(khoaDaDoc);
    if (Array.isArray(duLieuDaDoc)) {
        cacIdDaDoc = duLieuDaDoc.filter((id) => typeof id === "string");
    } else {
        cacIdDaDoc = cacThe
            .filter((the) => the.classList.contains("da-doc"))
            .map((the) => the.dataset.id)
            .filter((id) => typeof id === "string");
    }
    cacThe.forEach(capNhatThe);
    capNhatDanhSach();

    cacBoLoc.forEach((nut) => {
        nut.addEventListener("click", () => {
            const boLoc = nut.dataset.boLoc;
            if (!boLoc) {
                return;
            }

            boLocHienTai = boLoc;
            cacBoLoc.forEach((muc) => {
                const dangChon = muc === nut;
                muc.classList.toggle("dang-chon", dangChon);
                muc.setAttribute("aria-pressed", String(dangChon));
            });
            capNhatDanhSach();
        });
    });

    danhSachThongBao.addEventListener("click", (suKien) => {
        const mucNut = suKien.target instanceof Element
            ? suKien.target.closest(".nut-danh-dau-doc")
            : null;
        if (!(mucNut instanceof HTMLButtonElement)) {
            return;
        }

        const the = mucNut.closest(".the-thong-bao");
        if (!(the instanceof HTMLElement) || !the.dataset.id) {
            throw new Error("Không tìm thấy thông báo cần cập nhật.");
        }

        cacIdDaDoc = cacIdDaDoc.includes(the.dataset.id)
            ? cacIdDaDoc.filter((id) => id !== the.dataset.id)
            : [...cacIdDaDoc, the.dataset.id];
        luuTrangThaiDaDoc();
    });

    nutDanhDauTatCa.addEventListener("click", () => {
        cacIdDaDoc = cacThe
            .map((the) => the.dataset.id)
            .filter((id) => typeof id === "string");
        luuTrangThaiDaDoc();
    });

    const cacTuyChon = Array.from(document.querySelectorAll(".cac-cai-dat-thong-bao input"));
    const caiDatDaLuu = docDanhSach(khoaCaiDat);
    if (caiDatDaLuu && typeof caiDatDaLuu === "object") {
        cacTuyChon.forEach((input) => {
            if (input instanceof HTMLInputElement && typeof caiDatDaLuu[input.name] === "boolean") {
                input.checked = caiDatDaLuu[input.name];
            }
        });
    }

    nutLuuCaiDat.addEventListener("click", () => {
        const caiDat = {};
        cacTuyChon.forEach((input) => {
            if (input instanceof HTMLInputElement) {
                caiDat[input.name] = input.checked;
            }
        });

        if (luuDanhSach(khoaCaiDat, caiDat)) {
            thongBaoCaiDat.hidden = false;
            thongBaoCaiDat.textContent = "Đã lưu tùy chọn thông báo trên trình duyệt này.";
        }
    });
}