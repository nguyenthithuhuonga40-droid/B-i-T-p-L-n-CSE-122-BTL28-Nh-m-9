document.addEventListener('DOMContentLoaded', () => {
    // --- 1. KHỞI TẠO LUCIDE ICONS ---
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // --- 2. DỮ LIỆU MẪU THEO TỪNG NGÀY TRONG TUẦN ---
    const scheduleData = {
        'T2 · 05': {
            title: 'Thứ hai · 05/10 · 4 sân hoạt động',
            slots: [
                ['trong', 'dadat', 'trong', 'trong', 'dadat', 'trong', 'dadat', 'trong'],
                ['dadat', 'trong', 'trong', 'dadat', 'trong', 'dadat', 'trong', 'dadat'],
                ['trong', 'dadat', 'dadat', 'trong', 'trong', 'dadat', 'trong', 'trong'],
                ['dadat', 'trong', 'dadat', 'trong', 'dadat', 'trong', 'dadat', 'trong'],
                ['baotri', 'baotri', 'baotri', 'baotri', 'baotri', 'baotri', 'baotri', 'baotri']
            ]
        },
        'T3 · 06': {
            title: 'Thứ ba · 06/10 · 4 sân hoạt động',
            slots: [
                ['dadat', 'dadat', 'trong', 'trong', 'dadat', 'trong', 'trong', 'dadat'],
                ['trong', 'trong', 'dadat', 'dadat', 'trong', 'trong', 'dadat', 'trong'],
                ['dadat', 'trong', 'trong', 'trong', 'dadat', 'dadat', 'trong', 'trong'],
                ['trong', 'dadat', 'trong', 'dadat', 'trong', 'trong', 'dadat', 'dadat'],
                ['baotri', 'baotri', 'baotri', 'baotri', 'baotri', 'baotri', 'baotri', 'baotri']
            ]
        },
        'T4 · 07': {
            title: 'Thứ tư · 07/10 · 4 sân hoạt động',
            slots: [
                ['trong', 'trong', 'dadat', 'dadat', 'trong', 'dadat', 'trong', 'trong'],
                ['dadat', 'dadat', 'trong', 'trong', 'dadat', 'trong', 'dadat', 'trong'],
                ['trong', 'dadat', 'dadat', 'trong', 'dadat', 'trong', 'dadat', 'trong'],
                ['dadat', 'trong', 'dadat', 'trong', 'trong', 'dadat', 'dadat', 'dadat'],
                ['baotri', 'baotri', 'baotri', 'baotri', 'baotri', 'baotri', 'baotri', 'baotri']
            ]
        },
        'T5 · 08': {
            title: 'Thứ năm · 08/10 · 4 sân hoạt động',
            slots: [
                ['dadat', 'trong', 'dadat', 'trong', 'dadat', 'trong', 'dadat', 'trong'],
                ['trong', 'dadat', 'trong', 'dadat', 'trong', 'dadat', 'trong', 'dadat'],
                ['dadat', 'dadat', 'trong', 'trong', 'dadat', 'dadat', 'trong', 'trong'],
                ['trong', 'trong', 'dadat', 'dadat', 'trong', 'dadat', 'dadat', 'trong'],
                ['baotri', 'baotri', 'baotri', 'baotri', 'baotri', 'baotri', 'baotri', 'baotri']
            ]
        },
        'T6 · 09': {
            title: 'Thứ sáu · 09/10 · 4 sân hoạt động',
            slots: [
                ['trong', 'dadat', 'trong', 'dadat', 'trong', 'dadat', 'trong', 'dadat'],
                ['dadat', 'trong', 'dadat', 'trong', 'dadat', 'trong', 'dadat', 'trong'],
                ['trong', 'trong', 'dadat', 'dadat', 'trong', 'trong', 'dadat', 'dadat'],
                ['dadat', 'dadat', 'trong', 'trong', 'dadat', 'dadat', 'trong', 'trong'],
                ['baotri', 'baotri', 'baotri', 'baotri', 'baotri', 'baotri', 'baotri', 'baotri']
            ]
        },
        'T7 · 10': {
            title: 'Thứ bảy · 10/10 · 4 sân hoạt động',
            slots: [
                ['trong', 'dadat', 'dadat', 'trong', 'trong', 'dangchon', 'dadat', 'trong'], 
                ['dadat', 'dadat', 'trong', 'trong', 'trong', 'trong', 'dadat', 'dadat'], 
                ['trong', 'dadat', 'dadat', 'trong', 'dadat', 'trong', 'dadat', 'trong'], 
                ['dadat', 'trong', 'trong', 'dadat', 'trong', 'trong', 'dadat', 'dadat'], 
                ['baotri', 'baotri', 'baotri', 'baotri', 'baotri', 'baotri', 'baotri', 'baotri']  
            ]
        },
        'CN · 11': {
            title: 'Chủ nhật · 11/10 · 4 sân hoạt động',
            slots: [
                ['dadat', 'dadat', 'dadat', 'trong', 'dadat', 'dadat', 'trong', 'trong'],
                ['trong', 'trong', 'dadat', 'dadat', 'trong', 'dadat', 'dadat', 'trong'],
                ['dadat', 'trong', 'trong', 'dadat', 'dadat', 'trong', 'trong', 'dadat'],
                ['trong', 'dadat', 'dadat', 'trong', 'trong', 'dadat', 'dadat', 'trong'],
                ['baotri', 'baotri', 'baotri', 'baotri', 'baotri', 'baotri', 'baotri', 'baotri']
            ]
        }
    };

    const timeHours = ['06–08', '08–10', '10–12', '12–14', '14–16', '16–18', '18–20', '20–22'];
    const courtIds = ['P01', 'P02', 'P03', 'P04', 'P05'];

    // --- 3. THAM CHIẾU DOM ---
    const dayItems = document.querySelectorAll('.day-text-item');
    const tableHeaderTitle = document.querySelector('.schedule-card-header h3');
    const tableBody = document.querySelector('.schedule-grid-table tbody');
    
    const detailCard = document.querySelector('.detail-slot-card');
    const badgeCodeSpan = detailCard ? detailCard.querySelector('.badge-code') : null;
    const slotTimeTitle = detailCard ? detailCard.querySelector('.slot-time-title') : null;
    const slotCustomerInfo = detailCard ? detailCard.querySelector('.slot-customer-info') : null;
    const btnReschedule = detailCard ? detailCard.querySelector('.slot-actions-row .btn-outline') : null;

    // Form lịch lặp & thông báo xung đột
    const recurringForm = document.querySelector('.recurring-form-card');
    const inputTimeRange = recurringForm ? recurringForm.querySelectorAll('.model-input')[2] : null;
    const conflictNoticeBox = recurringForm ? recurringForm.querySelector('.conflict-notice-box') : null;
    const btnSaveRecurring = recurringForm ? recurringForm.querySelector('.btn-primary') : null;
    const btnBlockSlot = recurringForm ? recurringForm.querySelector('.btn-outline') : null;

    let currentSelectedDay = 'T7 · 10';
    let activeSlotElement = null;
    let isReschedulingMode = false; // Biến trạng thái bật/tắt chế độ đổi lịch

    // --- 4. HÀM RENDER BẢNG LỊCH ---
    function renderScheduleGrid(dayKey) {
        if (!tableBody) return;
        tableBody.innerHTML = '';

        const dayData = scheduleData[dayKey];
        if (!dayData) return;

        if (tableHeaderTitle) {
            tableHeaderTitle.textContent = dayData.title;
        }

        courtIds.forEach((courtId, rowIndex) => {
            const tr = document.createElement('tr');
            let htmlContent = `<td class="td-left td-court-name">${courtId}</td>`;
            
            const rowSlots = dayData.slots[rowIndex];
            rowSlots.forEach((status, colIndex) => {
                const hourText = timeHours[colIndex];
                let priceText = (colIndex >= 5) ? '360.000đ' : '300.000đ';
                if (courtId === 'P05') priceText = 'Không mở';

                let innerLabel = 'Trống';
                let boxClass = 'slot-box slot-trong';

                if (status === 'dadat') {
                    innerLabel = 'Đã đặt';
                    boxClass = 'slot-box slot-dadat';
                } else if (status === 'dangchon') {
                    innerLabel = 'Đã đặt';
                    priceText = 'CC-1010';
                    boxClass = 'slot-box slot-dangchon';
                } else if (status === 'baotri') {
                    innerLabel = 'Bảo trì';
                    boxClass = 'slot-box slot-baotri';
                }

                htmlContent += `
                    <td>
                        <div class="${boxClass}" data-row="${rowIndex}" data-col="${colIndex}" data-court="${courtId}" data-day="${dayKey}" data-time="${hourText}" data-status="${status}">
                            <span>${innerLabel}</span>
                            <small>${priceText}</small>
                        </div>
                    </td>
                `;
            });

            tr.innerHTML = htmlContent;
            tableBody.appendChild(tr);
        });

        const defaultSelected = tableBody.querySelector('.slot-dangchon');
        if (defaultSelected) {
            applySelectedSlotStyle(defaultSelected);
        }
        detectConflictsAutomatically();
    }

    // --- 5. TỰ ĐỘNG PHÁT HIỆN XUNG ĐỘT & CẢNH BÁO ---
    function detectConflictsAutomatically() {
        if (!conflictNoticeBox) return;

        const dayData = scheduleData[currentSelectedDay];
        if (!dayData) return;

        let conflictMessages = [];

        // Quét toàn bộ bảng của ngày hiện tại để tìm các khung đã đặt (dadat / dangchon)
        dayData.slots.forEach((rowSlots, rIdx) => {
            rowSlots.forEach((status, cIdx) => {
                if (status === 'dadat' || status === 'dangchon') {
                    const courtName = courtIds[rIdx];
                    const slotHour = timeHours[cIdx];
                    const dateStr = currentSelectedDay.includes('·') ? currentSelectedDay.split('·')[1].trim() + '/10' : '17/10';
                    
                    // Nếu form đang chọn khung giờ trùng với khung đã có khách đặt -> ghi nhận xung đột
                    if (inputTimeRange && inputTimeRange.value.includes(slotHour.split('–')[0])) {
                        conflictMessages.push(`Xung đột: ${courtName} · ${dateStr} · ${slotHour} đã đặt. Bỏ khung này hoặc đổi giờ.`);
                    }
                }
            });
        });

        if (conflictMessages.length > 0) {
            conflictNoticeBox.textContent = conflictMessages[0]; // Hiển thị cảnh báo đầu tiên tìm thấy
            conflictNoticeBox.style.display = 'block';
            conflictNoticeBox.style.backgroundColor = '#FFF3D6';
            conflictNoticeBox.style.color = '#8C5810';
        } else {
            conflictNoticeBox.textContent = `Hợp lệ: Không phát hiện xung đột lịch lặp trong ngày ${currentSelectedDay}. Bạn có thể lưu cấu hình.`;
            conflictNoticeBox.style.display = 'block';
            conflictNoticeBox.style.backgroundColor = '#EAF0E8';
            conflictNoticeBox.style.color = '#0B2B22';
        }
    }

    // Lắng nghe sự kiện khi thay đổi thông tin trong form lịch lặp để tự động quét lại xung đột
    if (inputTimeRange) {
        inputTimeRange.addEventListener('input', detectConflictsAutomatically);
    }

    // --- 6. HÀM ÁP DỤNG STYLE CHO Ô ĐƯỢC CHỌN ---
    function applySelectedSlotStyle(slotBox) {
        document.querySelectorAll('.slot-box').forEach(b => {
            b.style.backgroundColor = '';
            b.style.borderColor = '';
            b.style.boxShadow = '';
            b.style.color = '';
            const spanEl = b.querySelector('span');
            const smallEl = b.querySelector('small');
            if (spanEl) spanEl.style.color = '';
            if (smallEl) smallEl.style.color = '';

            const st = b.getAttribute('data-status');
            if (st === 'dadat') b.className = 'slot-box slot-dadat';
            else if (st === 'dangchon') b.className = 'slot-box slot-dangchon';
            else if (st === 'trong') b.className = 'slot-box slot-trong';
            else if (st === 'baotri') b.className = 'slot-box slot-baotri';
        });

        activeSlotElement = slotBox;
        const status = slotBox.getAttribute('data-status');

        // Đổi màu ô được chọn sang xanh nõn chuối rực rỡ
        slotBox.style.backgroundColor = '#C8F05A';
        slotBox.style.borderColor = '#B4DC46';
        
        const span = slotBox.querySelector('span');
        const small = slotBox.querySelector('small');
        if (span) span.style.color = '#0B2B22';
        if (small) small.style.color = '#3F6212';

        updateBadgeStyle(status);
    }

    // --- 7. CẬP NHẬT MÀU SẮC THẺ BADGE ---
    function updateBadgeStyle(status) {
        if (!badgeCodeSpan) return;
        badgeCodeSpan.style.backgroundColor = '';
        badgeCodeSpan.style.color = '';
        badgeCodeSpan.style.border = '';

        if (status === 'dadat' || status === 'dangchon') {
            badgeCodeSpan.style.backgroundColor = '#0B2B22';
            badgeCodeSpan.style.color = '#FFFFFF';
            badgeCodeSpan.style.border = '1px solid #0B2B22';
        } else if (status === 'trong') {
            badgeCodeSpan.style.backgroundColor = '#EAF0E8';
            badgeCodeSpan.style.color = '#0B2B22                    ';
            badgeCodeSpan.style.border = '1px solid #F5E0B7';
        } else if (status === 'baotri') {
            badgeCodeSpan.style.backgroundColor = '#FFF3D6';
            badgeCodeSpan.style.color = '#8C5810';
            badgeCodeSpan.style.border = '1px solid #F5E0B7';
        }
    }

    // --- 8. SỰ KIỆN CHỌN NGÀY ---
    dayItems.forEach(item => {
        item.addEventListener('click', () => {
            dayItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');

            currentSelectedDay = item.textContent.trim();
            renderScheduleGrid(currentSelectedDay);
            activeSlotElement = null;
            isReschedulingMode = false;
        });
    });

    // --- 9. SỰ KIỆN CLICK Ô SLOT TRÊN BẢNG LỊCH (HỖ TRỢ CẢ ĐỔI LỊCH) ---
    if (tableBody) {
        tableBody.addEventListener('click', (e) => {
            const slotBox = e.target.closest('.slot-box');
            if (!slotBox) return;

            const clickedStatus = slotBox.getAttribute('data-status');

            // Xử lý nếu đang ở chế độ đổi lịch và người dùng bấm vào một ô trống mới làm đích đến
            if (isReschedulingMode && clickedStatus === 'trong') {
                const targetRow = parseInt(slotBox.getAttribute('data-row'));
                const targetCol = parseInt(slotBox.getAttribute('data-col'));
                const targetCourt = slotBox.getAttribute('data-court');
                const targetTime = slotBox.getAttribute('data-time');

                const sourceRow = parseInt(activeSlotElement.getAttribute('data-row'));
                const sourceCol = parseInt(activeSlotElement.getAttribute('data-col'));

                // Cập nhật mảng dữ liệu: ô cũ thành 'trong', ô mới thành 'dangchon' (hoặc 'dadat' mang mã đơn)
                scheduleData[currentSelectedDay].slots[sourceRow][sourceCol] = 'trong';
                scheduleData[currentSelectedDay].slots[targetRow][targetCol] = 'dangchon';

                isReschedulingMode = false;
                renderScheduleGrid(currentSelectedDay);
                alert(`Đã đổi lịch thành công sang sân ${targetCourt} vào khung giờ ${targetTime}!`);
                return;
            }

            // Thao tác chọn ô thông thường
            applySelectedSlotStyle(slotBox);
            isReschedulingMode = false;

            const court = slotBox.getAttribute('data-court');
            const day = slotBox.getAttribute('data-day');
            const time = slotBox.getAttribute('data-time');

            if (clickedStatus === 'dadat' || clickedStatus === 'dangchon') {
                if (badgeCodeSpan) badgeCodeSpan.textContent = `CC-1010 · Đã đặt`;
                if (slotTimeTitle) slotTimeTitle.textContent = `${court} · ${day.replace(/[^0-9\/]/g, '')} · ${time}`;
                if (slotCustomerInfo) slotCustomerInfo.textContent = `Minh Anh · 4 người · ${time.includes('18') || time.includes('20') ? '360.000đ' : '300.000đ'}`;
            } else if (clickedStatus === 'trong') {
                if (badgeCodeSpan) badgeCodeSpan.textContent = `Trống · Khung khả dụng`;
                if (slotTimeTitle) slotTimeTitle.textContent = `${court} · ${day.replace(/[^0-9\/]/g, '')} · ${time}`;
                if (slotCustomerInfo) slotCustomerInfo.textContent = `Chưa có khách đặt · ${time.includes('18') || time.includes('20') ? '360.000đ' : '300.000đ'}`;
            } else if (clickedStatus === 'baotri') {
                if (badgeCodeSpan) badgeCodeSpan.textContent = `Bảo trì hệ thống`;
                if (slotTimeTitle) slotTimeTitle.textContent = `${court} · ${day.replace(/[^0-9\/]/g, '')} · ${time}`;
                if (slotCustomerInfo) slotCustomerInfo.textContent = `Đang trong thời gian bảo dưỡng mặt sân.`;
            }
        });
    }

    // --- 10. LOGIC HOÀN CHỈNH CHO NÚT "ĐỔI LỊCH" ---
    if (btnReschedule) {
        btnReschedule.addEventListener('click', (e) => {
            e.preventDefault();
            if (!activeSlotElement) {
                alert('Vui lòng chọn một khung giờ đã đặt trên bảng lịch trước khi bấm đổi lịch!');
                return;
            }

            const currentStatus = activeSlotElement.getAttribute('data-status');
            if (currentStatus === 'trong' || currentStatus === 'baotri') {
                alert('Khung giờ này không có đơn đặt sân để thực hiện đổi lịch!');
                return;
            }

            isReschedulingMode = true;
            alert('Đã bật chế độ đổi lịch cho đơn CC-1010. Vui lòng bấm chọn một ô TRỐNG bất kỳ trên bảng lịch để chuyển đơn đến đó.');
        });
    }

    // --- 11. LOGIC NÚT "LƯU KHUNG HỢP LỆ" ---
    if (btnSaveRecurring) {
        btnSaveRecurring.addEventListener('click', (e) => {
            e.preventDefault();
            
            alert('Đã lưu cấu hình lịch lặp hợp lệ thành công!');
        });
    }

    // --- 12. LOGIC NÚT "CHẶN KHUNG TRỐNG" ---
    if (btnBlockSlot) {
        btnBlockSlot.addEventListener('click', (e) => {
            e.preventDefault();
            const dayData = scheduleData[currentSelectedDay];
            if (!dayData) return;

            let blockedCount = 0;
            // Chuyển tất cả các ô trống ở cột khung tối (index 6: 18–20) thành bảo trì
            dayData.slots.forEach((rowSlots) => {
                if (rowSlots[6] === 'trong') {
                    rowSlots[6] = 'baotri';
                    blockedCount++;
                }
            });

            if (blockedCount > 0) {
                renderScheduleGrid(currentSelectedDay);
                alert(`Đã chặn thành công ${blockedCount} khung trống sang trạng thái bảo trì!`);
            } else {
                alert('Không có khung trống nào để chặn trong khung giờ này.');
            }
        });
    }

    // Khởi chạy mặc định lần đầu
    renderScheduleGrid('T7 · 10');
});