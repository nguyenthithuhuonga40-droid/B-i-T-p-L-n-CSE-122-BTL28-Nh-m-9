document.addEventListener('DOMContentLoaded', () => {
    // --- 1. KHỞI TẠO LUCIDE ICONS ---
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // --- 2. THAM CHIẾU DOM CÁC THÀNH PHẦN ---
    const btnPrintOrder = document.getElementById('btnPrintOrder');
    
    // Khu vực Tại quầy
    const btnConfirmCheckin = document.getElementById('btnConfirmCheckin');
    const btnEditReschedule = document.getElementById('btnEditReschedule');
    const btnCancelBooking = document.getElementById('btnCancelBooking');

    // Khu vực Biến thể & Form Đổi lịch phía dưới
    const btnApprovePending = document.getElementById('btnApprovePending');
    const btnRejectPending = document.getElementById('btnRejectPending');
    const rejectReasonInput = document.getElementById('rejectReasonInput');
    
    const btnCheckAndSaveReschedule = document.getElementById('btnCheckAndSaveReschedule');
    const btnConfirmRefund = document.getElementById('btnConfirmRefund');

    // Tham chiếu đến các ô input trong form đổi lịch
    const rescheduleFormCard = document.querySelector('.detail-variants-grid .variant-card:nth-child(2)');
    const newDateInput = rescheduleFormCard ? rescheduleFormCard.querySelectorAll('.input-text-model')[0] : null;
    const newTimeInput = rescheduleFormCard ? rescheduleFormCard.querySelectorAll('.input-text-model')[1] : null;
    const reasonInput = rescheduleFormCard ? rescheduleFormCard.querySelectorAll('.input-text-model')[2] : null;

    // Tham chiếu tiêu đề đơn phía trên để cập nhật dữ liệu động
    const pageSubtitle = document.querySelector('.page-header-model .page-subtitle');

    // Trạng thái đơn hàng nội bộ
    let orderState = 'DA_XAC_NHAN'; // 'DA_XAC_NHAN', 'DANG_CHOI', 'HOAN_THANH', 'DA_HUY'

    const getMarkCompletedBtn = () => {
        return document.querySelector('.counter-primary-actions .btn-disabled-pill') || 
               document.querySelector('.counter-primary-actions .btn-primary-dark-pill[id="btnMarkCompleted"]');
    };

    // --- 3. IN THÔNG TIN ĐƠN ---
    if (btnPrintOrder) {
        btnPrintOrder.addEventListener('click', () => {
            window.print();
        });
    }

    // --- 4. LUỒNG TẠI QUẦY: XÁC NHẬN NHẬN SÂN ---
    if (btnConfirmCheckin) {
        btnConfirmCheckin.addEventListener('click', () => {
            if (orderState === 'DA_HUY') {
                alert('Không thể nhận sân vì đơn đặt này đã bị hủy!');
                return;
            }
            if (orderState === 'HOAN_THANH') {
                alert('Buổi chơi này đã hoàn thành.');
                return;
            }

            orderState = 'DANG_CHOI';
            btnConfirmCheckin.textContent = 'Đã nhận sân (Đang chơi)';
            btnConfirmCheckin.style.backgroundColor = '#3F6212';
            btnConfirmCheckin.style.color = '#FFFFFF';
            btnConfirmCheckin.setAttribute('disabled', 'true');
            btnConfirmCheckin.style.cursor = 'not-allowed';

            const completedBtn = getMarkCompletedBtn();
            if (completedBtn) {
                completedBtn.removeAttribute('disabled');
                completedBtn.className = 'btn-primary-dark-pill';
                completedBtn.textContent = 'Đánh dấu hoàn thành';
                completedBtn.id = 'btnMarkCompleted';
                completedBtn.style.cursor = 'pointer';
            }

            alert('Đã xác nhận nhận sân thành công!');
        });
    }

    // Đánh dấu hoàn thành
    document.addEventListener('click', (e) => {
        if (e.target && e.target.id === 'btnMarkCompleted') {
            if (orderState === 'DA_HUY') return;

            orderState = 'HOAN_THANH';
            e.target.textContent = 'Đã hoàn thành buổi chơi';
            e.target.style.backgroundColor = '#166534';
            e.target.setAttribute('disabled', 'true');
            e.target.style.cursor = 'not-allowed';

            if (btnConfirmCheckin) {
                btnConfirmCheckin.setAttribute('disabled', 'true');
                btnConfirmCheckin.style.cursor = 'not-allowed';
            }
            alert('Đã đánh dấu hoàn thành buổi chơi!');
        }
    });

    // --- 5. TÍNH NĂNG MỚI: BẤM "CHỈNH SỬA / ĐỔI LỊCH" -> TỰ ĐỘNG CUỘN XUỐNG FORM ---
    if (btnEditReschedule) {
        btnEditReschedule.addEventListener('click', () => {
            if (orderState === 'DA_HUY' || orderState === 'HOAN_THANH') {
                alert('Không thể đổi lịch cho đơn đã hủy hoặc đã hoàn thành!');
                return;
            }

            // Tìm vị trí của card đổi lịch ở phía dưới và cuộn màn hình mượt mà đến đó
            if (rescheduleFormCard) {
                rescheduleFormCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
                // Hiệu ứng nhấp nháy nhẹ để thu hút sự chú ý vào form
                rescheduleFormCard.style.transition = 'box-shadow 0.3s ease';
                rescheduleFormCard.style.boxShadow = '0 0 0 3px #C8F05A';
                setTimeout(() => {
                    rescheduleFormCard.style.boxShadow = 'none';
                }, 1500);
            }
        });
    }

    // --- 6. HỦY ĐƠN TẠI QUẦY + VÔ HIỆU HÓA HOÀN TOÀN FORM ĐỔI LỊCH ---
    if (btnCancelBooking) {
        btnCancelBooking.addEventListener('click', () => {
            if (orderState === 'HOAN_THANH') {
                alert('Không thể hủy đơn đã hoàn thành!');
                return;
            }
            if (orderState === 'DA_HUY') return;

            const confirmCancel = confirm('Bạn có chắc chắn muốn hủy đơn đặt sân CC-1010 không? Thao tác này sẽ khóa toàn bộ tiến trình và form chỉnh sửa bên dưới.');
            if (confirmCancel) {
                orderState = 'DA_HUY';

                // Khóa các nút tại quầy
                if (btnConfirmCheckin) {
                    btnConfirmCheckin.setAttribute('disabled', 'true');
                    btnConfirmCheckin.style.opacity = '0.5';
                    btnConfirmCheckin.style.cursor = 'not-allowed';
                }
                const completedBtn = getMarkCompletedBtn();
                if (completedBtn) {
                    completedBtn.setAttribute('disabled', 'true');
                    completedBtn.style.opacity = '0.5';
                    completedBtn.style.cursor = 'not-allowed';
                }
                if (btnEditReschedule) {
                    btnEditReschedule.setAttribute('disabled', 'true');
                    btnEditReschedule.style.opacity = '0.5';
                    btnEditReschedule.style.cursor = 'not-allowed';
                }

                btnCancelBooking.textContent = 'Đã hủy đơn';
                btnCancelBooking.style.backgroundColor = '#FEE2E2';
                btnCancelBooking.style.color = '#991B1B';
                btnCancelBooking.setAttribute('disabled', 'true');

                // VÔ HIỆU HÓA TOÀN BỘ FORM ĐỔI LỊCH PHÍA DƯỚI THEO YÊU CẦU
                if (rescheduleFormCard) {
                    rescheduleFormCard.style.opacity = '0.5';
                    rescheduleFormCard.style.pointerEvents = 'none'; // Chặn mọi thao tác click/nhập liệu
                }
                if (newDateInput) newDateInput.setAttribute('disabled', 'true');
                if (newTimeInput) newTimeInput.setAttribute('disabled', 'true');
                if (reasonInput) reasonInput.setAttribute('disabled', 'true');
                if (btnCheckAndSaveReschedule) btnCheckAndSaveReschedule.setAttribute('disabled', 'true');
                if (btnConfirmRefund) btnConfirmRefund.setAttribute('disabled', 'true');

                alert('Đã hủy đơn thành công! Form chỉnh sửa lịch bên dưới đã bị vô hiệu hóa.');
            }
        });
    }

    // --- 7. TÍNH NĂNG MỚI: BẤM "KIỂM TRA & LƯU LỊCH" -> CẬP NHẬT LÊN PHÍA TRÊN ---
    if (btnCheckAndSaveReschedule) {
        btnCheckAndSaveReschedule.addEventListener('click', () => {
            if (orderState === 'DA_HUY') {
                alert('Đơn đã bị hủy, không thể lưu thay đổi lịch!');
                return;
            }

            const updatedDate = newDateInput ? newDateInput.value.trim() : '11/10/2026';
            const updatedTime = newTimeInput ? newTimeInput.value.trim() : '16:00–18:00';
            const changeReason = reasonInput ? reasonInput.value.trim() : '';

            // Cập nhật thông tin lên phần tiêu đề phụ (sub-title) ở phía trên màn hình
            if (pageSubtitle) {
                pageSubtitle.textContent = `Tây Hồ Sports - P01 · ${updatedDate} · ${updatedTime}`;
            }

            alert(`Đã kiểm tra và cập nhật lịch thành công!\n- Ngày mới: ${updatedDate}\n- Giờ mới: ${updatedTime}\n- Lý do: ${changeReason || 'Không có'}\n\nThông tin phía trên đơn hàng đã được tự động cập nhật.`);
        });
    }

    // --- 8. CÁC NÚT BIẾN THỂ KHÁC ---
    if (btnApprovePending) {
        btnApprovePending.addEventListener('click', () => {
            alert('Đã duyệt đơn chờ CC-1011 thành công!');
        });
    }

    if (btnRejectPending) {
        btnRejectPending.addEventListener('click', () => {
            const reason = rejectReasonInput ? rejectReasonInput.value.trim() : '';
            if (!reason || reason.includes('Nhập lý do')) {
                alert('Vui lòng nhập lý do từ chối cụ thể!');
                if (rejectReasonInput) rejectReasonInput.focus();
                return;
            }
            alert(`Đã từ chối đơn CC-1011 với lý do: "${reason}"`);
            if (rejectReasonInput) rejectReasonInput.value = '';
        });
    }

    if (btnConfirmRefund) {
        btnConfirmRefund.addEventListener('click', () => {
            const confirmRefund = confirm('Xác nhận hoàn tất quy trình hủy lịch và hoàn tiền mô phỏng 360.000đ?');
            if (confirmRefund) {
                alert('Trạng thái hoàn tiền đã được chuyển sang "Đã hoàn".');
            }
        });
    }
});