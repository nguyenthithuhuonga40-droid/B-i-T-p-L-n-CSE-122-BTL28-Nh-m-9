(function () {
    const khoaSuKien = "courtconnect-su-kien-v1";
    const suKienMacDinh = [
        {
            id: "1",
            tenSuKien: "Giao lưu Nhịp Sân thứ bảy",
            mon: "pickleball",
            lichDiaDiem: "10/10/2026 · Tây Hồ Sports",
            ngay: "2026-10-10",
            diaDiem: "Tây Hồ Sports",
            dangKy: "8/8",
            trangThai: "Sắp diễn ra",
            maTrangThai: "sap-dien-ra",
            luuTru: false
        },
        {
            id: "2",
            tenSuKien: "Cầu lông giữa tuần",
            mon: "cau-long",
            lichDiaDiem: "14/10/2026 · Cầu Giấy",
            ngay: "2026-10-14",
            diaDiem: "Cầu Giấy",
            dangKy: "6/12",
            trangThai: "Sắp diễn ra",
            maTrangThai: "sap-dien-ra",
            luuTru: false
        },
        {
            id: "3",
            tenSuKien: "Buổi tập kỹ thuật sáng",
            mon: "pickleball",
            lichDiaDiem: "10/10/2026 · Long Biên",
            ngay: "2026-10-10",
            diaDiem: "Long Biên",
            dangKy: "4/4",
            trangThai: "Đang diễn ra",
            maTrangThai: "dang-dien-ra",
            luuTru: false
        },
        {
            id: "4",
            tenSuKien: "Giao lưu tháng 9",
            mon: "pickleball",
            lichDiaDiem: "26/09/2026 · Tây Hồ Sports",
            ngay: "2026-09-26",
            diaDiem: "Tây Hồ Sports",
            dangKy: "8/8",
            trangThai: "Hoàn thành",
            maTrangThai: "hoan-thanh",
            luuTru: false
        },
        {
            id: "5",
            tenSuKien: "Trận giao hữu ngoài trời",
            mon: "pickleball",
            lichDiaDiem: "03/10/2026 · Long Biên",
            ngay: "2026-10-03",
            diaDiem: "Long Biên",
            dangKy: "0/8",
            trangThai: "Đã hủy",
            maTrangThai: "da-huy",
            luuTru: false
        }
    ];

    function docSuKien() {
        const duLieu = localStorage.getItem(khoaSuKien);
        if (duLieu === null) {
            localStorage.setItem(khoaSuKien, JSON.stringify(suKienMacDinh));
            return suKienMacDinh.map(suKien => ({ ...suKien }));
        }

        const suKien = JSON.parse(duLieu);
        if (!Array.isArray(suKien)) {
            throw new Error("Dữ liệu sự kiện trong trình duyệt không hợp lệ.");
        }
        return suKien;
    }

    function luuSuKien(suKien) {
        if (!Array.isArray(suKien)) {
            throw new TypeError("Danh sách sự kiện phải là một mảng.");
        }
        localStorage.setItem(khoaSuKien, JSON.stringify(suKien));
    }

    window.CourtConnectStore = {
        docSuKien,
        luuSuKien
    };
})();
