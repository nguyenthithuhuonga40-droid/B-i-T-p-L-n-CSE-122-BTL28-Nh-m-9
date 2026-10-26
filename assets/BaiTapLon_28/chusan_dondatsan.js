/**
 * CourtConnect - Quản lý đơn đặt sân
 * File JS hoàn chỉnh - Chỉ điều hướng sang trang chi tiết khi bấm nút "Xem / Nhận sân"
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Khởi tạo biểu tượng Lucide icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // DOM Elements
    const searchInput = document.getElementById('searchInput');
    const dateInput = document.getElementById('dateInput');
    const courtSelect = document.getElementById('courtSelect');
    const btnFilter = document.getElementById('btnFilter');
    const tabItems = document.querySelectorAll('.status-tabs-row .tab-item');
    const ordersTableBody = document.getElementById('ordersTableBody');
    const tableFooterInfo = document.getElementById('tableFooterInfo');
    const btnCreateBooking = document.getElementById('btnCreateBooking');

    // Các ô hiển thị dữ liệu trong khối No-show Risk & Thao tác
    const aiOrderInput = document.querySelector('.noshow-field:nth-child(1) input');
    const aiDataRangeInput = document.querySelector('.noshow-field:nth-child(2) input');
    const riskPercentageEl = document.querySelector('.risk-percentage');
    const aiRiskCard = document.querySelector('.noshow-risk-card');

    // 2. Tự động đọc dữ liệu ban đầu từ thẻ HTML <tbody>
    let bookingData = [];
    if (ordersTableBody) {
        const rows = ordersTableBody.querySelectorAll('tr');
        rows.forEach(tr => {
            const cells = tr.querySelectorAll('td');
            if (cells.length >= 5) {
                const codeSpan = cells[0].querySelector('.cell-order-code');
                const id = codeSpan ? codeSpan.textContent.trim() : '';
                const fullNameText = cells[0].textContent.trim();
                const name = fullNameText.includes('·') ? fullNameText.split('·')[1].trim() : fullNameText;
                
                const courtTime = cells[1].textContent.trim().split('·');
                const court = courtTime[0] ? courtTime[0].trim() : '';
                const time = courtTime[1] ? courtTime[1].trim() : '';
                
                const price = cells[2].textContent.trim();
                const statusText = cells[3].textContent.trim();
                const btnAction = cells[4].querySelector('.cell-action-btn');
                const actionText = btnAction ? btnAction.textContent.trim() : '';

                let status = 'confirmed';
                if (statusText.includes('Chờ duyệt')) status = 'pending';
                else if (statusText.includes('Hoàn thành')) status = 'completed';
                else if (statusText.includes('Đã hủy')) status = 'cancelled';

                bookingData.push({
                    id, name, court, time, price, status, statusText, actionText,
                    phone: '0981234567',
                    note: 'Dữ liệu từ hệ thống',
                    riskRate: status === 'pending' ? '≈ 38% - Tham khảo' : '≈ 5% - An toàn'
                });
            }
        });
    }

    // Đơn đang được chọn xử lý tại AI Risk Block (mặc định chọn CC-1011)
    let currentAIRiskOrder = bookingData.find(b => b.id === 'CC-1011') || bookingData[0];

    // State lưu bộ lọc
    let filterState = { keyword: '', date: '10/10/2026', court: 'all', tab: 'all' };

    /* ==========================================================================
       HÀM BỔ TRỢ: TOAST NOTIFICATION & MODALS SYSTEM
       ========================================================================== */
    const injectCustomStyles = () => {
        const style = document.createElement('style');
        style.innerHTML = `
            .custom-modal-overlay {
                position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
                background: rgba(11, 43, 34, 0.4); backdrop-filter: blur(4px);
                display: flex; align-items: center; justify-content: center; z-index: 9999;
                animation: fadeIn 0.2s ease;
            }
            .custom-modal-box {
                background: #FFFFFF; border-radius: 16px; padding: 1.5rem;
                width: 90%; max-width: 500px; box-shadow: 0 10px 25px rgba(0,0,0,0.15);
                border: 1px solid #E2E8F0; font-family: 'Inter', sans-serif;
            }
            .custom-modal-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; }
            .custom-modal-title { font-size: 1.125rem; font-weight: 700; color: #0B2B22; }
            .custom-modal-close { background: none; border: none; font-size: 1.25rem; cursor: pointer; color: #64748B; }
            .modal-form-group { margin-bottom: 1rem; }
            .modal-form-group label { display: block; font-size: 12px; font-weight: 600; color: #64748B; margin-bottom: 0.375rem; }
            .modal-form-group input, .modal-form-group select {
                width: 100%; padding: 0.625rem 0.875rem; border: 1px solid #CBD5E1; border-radius: 8px;
                font-size: 0.875rem; color: #0B2B22; outline: none; box-sizing: border-box;
            }
            .modal-actions { display: flex; justify-content: flex-end; gap: 0.75rem; margin-top: 1.25rem; }
            .toast-container { position: fixed; bottom: 20px; right: 20px; z-index: 10000; display: flex; flex-direction: column; gap: 8px; }
            .toast-item {
                background: #0B2B22; color: #FFFFFF; padding: 0.75rem 1.25rem; border-radius: 8px;
                font-size: 0.8125rem; font-weight: 500; box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                animation: slideIn 0.3s ease; display: flex; align-items: center; gap: 8px;
            }
            .tr-highlight { background-color: #F0FDF4 !important; transition: background-color 0.3s ease; }
            .badge-count {
                background: #EF4444; color: #FFFFFF; font-size: 10px; font-weight: 700;
                padding: 2px 6px; border-radius: 9999px; margin-left: 4px; display: inline-block;
            }
            @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
            @keyframes slideIn { from { transform: translateX(100%); } to { transform: translateX(0); } }
        `;
        document.head.appendChild(style);
    };
    injectCustomStyles();

    const showToast = (message, icon = '✓') => {
        let toastContainer = document.querySelector('.toast-container');
        if (!toastContainer) {
            toastContainer = document.createElement('div');
            toastContainer.className = 'toast-container';
            document.body.appendChild(toastContainer);
        }
        const toast = document.createElement('div');
        toast.className = 'toast-item';
        toast.innerHTML = `<span>${icon}</span> <span>${message}</span>`;
        toastContainer.appendChild(toast);
        setTimeout(() => toast.remove(), 3500);
    };

    /* ==========================================================================
       HÀM TỰ ĐỘNG ĐỒNG BỘ DỮ LIỆU ĐƠN BẤM XEM XUỐNG FORM BÊN DƯỚI
       ========================================================================== */
    const updateAIRiskFormWithOrder = (order) => {
        currentAIRiskOrder = order;

        // Cập nhật ô "Đơn cần xem xét"
        if (aiOrderInput) {
            aiOrderInput.value = `${order.id} · ${order.name}`;
        }

        // Cập nhật tỷ lệ rủi ro phù hợp với từng loại đơn
        if (riskPercentageEl) {
            riskPercentageEl.textContent = order.riskRate || '≈ 5% - An toàn';
        }

        // Cập nhật ô "Khoảng dữ liệu" nếu có
        if (aiDataRangeInput) {
            aiDataRangeInput.value = `${order.court} (${order.time}) · Mock`;
        }

        // Highlight dòng vừa bấm trên bảng
        applyFilters();
    };

    /* ==========================================================================
       1. TẬP NÚT TẠO ĐƠN, LỌC & TAB TRẠNG THÁI
       ========================================================================== */

    const updateTabBadges = () => {
        const pendingCount = bookingData.filter(b => b.status === 'pending').length;
        tabItems.forEach(tab => {
            if (tab.getAttribute('data-tab') === 'pending') {
                tab.innerHTML = `Chờ duyệt <span class="badge-count">${pendingCount}</span>`;
            }
        });
    };

    const renderTable = (data) => {
        if (!ordersTableBody) return;
        ordersTableBody.innerHTML = '';

        if (data.length === 0) {
            ordersTableBody.innerHTML = `<tr><td colspan="5" style="text-align: center; color: #94A3B8; padding: 2.5rem;">Không tìm thấy bản ghi phù hợp.</td></tr>`;
            if (tableFooterInfo) tableFooterInfo.textContent = 'Hiển thị 0 bản ghi · Trang 1';
            return;
        }

        data.forEach(item => {
            const tr = document.createElement('tr');
            tr.setAttribute('data-id', item.id);
            if (currentAIRiskOrder && currentAIRiskOrder.id === item.id) {
                tr.classList.add('tr-highlight');
            }

            tr.innerHTML = `
                <td><span class="cell-order-code">${item.id}</span> · ${item.name}</td>
                <td>${item.court} · ${item.time}</td>
                <td>${item.price}</td>
                <td>${item.statusText}</td>
                <td class="text-right"><button class="cell-action-btn" data-id="${item.id}">${item.actionText}</button></td>
            `;
            ordersTableBody.appendChild(tr);
        });

        if (tableFooterInfo) {
            tableFooterInfo.textContent = `Hiển thị ${data.length} bản ghi minh họa · Trang 1`;
        }
    };

    const applyFilters = () => {
        const keyword = filterState.keyword.toLowerCase().trim();
        const court = filterState.court;
        const tab = filterState.tab;

        const filtered = bookingData.filter(item => {
            const matchTab = (tab === 'all') || (item.status === tab);
            const matchCourt = (court === 'all') || item.court.includes(court);
            const matchKeyword = !keyword || 
                item.id.toLowerCase().includes(keyword) || 
                item.name.toLowerCase().includes(keyword);

            return matchTab && matchCourt && matchKeyword;
        });

        renderTable(filtered);
    };

    // Debounce tìm kiếm
    let debounceTimer;
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => {
                filterState.keyword = e.target.value;
                applyFilters();
            }, 300);
        });
    }

    if (courtSelect) {
        courtSelect.addEventListener('change', (e) => {
            filterState.court = e.target.value;
            applyFilters();
        });
    }

    if (btnFilter) {
        btnFilter.addEventListener('click', () => {
            applyFilters();
            showToast('Đã làm mới dữ liệu bộ lọc!');
        });
    }

    tabItems.forEach(tab => {
        tab.addEventListener('click', () => {
            tabItems.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            filterState.tab = tab.getAttribute('data-tab');
            applyFilters();
        });
    });

    // Modal Tạo đơn tại sân
    const openCreateBookingModal = () => {
        const modalHtml = `
            <div class="custom-modal-overlay" id="createModal">
                <div class="custom-modal-box">
                    <div class="custom-modal-header">
                        <h3 class="custom-modal-title">+ Tạo Đơn Đặt Sân Tốc Hành</h3>
                        <button class="custom-modal-close" onclick="document.getElementById('createModal').remove()">✕</button>
                    </div>
                    <form id="createBookingForm">
                        <div class="modal-form-group">
                            <label>Tên khách hàng (*)</label>
                            <input type="text" id="newCustName" required placeholder="Nhập tên khách...">
                        </div>
                        <div class="modal-form-group">
                            <label>Số điện thoại</label>
                            <input type="text" id="newCustPhone" placeholder="09xxxxxxx">
                        </div>
                        <div class="modal-form-group">
                            <label>Chọn sân</label>
                            <select id="newCustCourt">
                                <option value="P01">Sân P01</option>
                                <option value="P02">Sân P02</option>
                                <option value="P03">Sân P03</option>
                                <option value="P04">Sân P04</option>
                            </select>
                        </div>
                        <div class="modal-form-group">
                            <label>Khung giờ</label>
                            <input type="text" id="newCustTime" value="18:00–20:00">
                        </div>
                        <div class="modal-form-group">
                            <label>Giá tiền</label>
                            <input type="text" id="newCustPrice" value="360.000đ">
                        </div>
                        <div class="modal-actions">
                            <button type="button" class="btn-sub-white" onclick="document.getElementById('createModal').remove()">Hủy</button>
                            <button type="submit" class="btn-primary btn-add-custom">Tạo đơn ngay</button>
                        </div>
                    </form>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', modalHtml);

        document.getElementById('createBookingForm').addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('newCustName').value;
            const phone = document.getElementById('newCustPhone').value;
            const court = document.getElementById('newCustCourt').value;
            const time = document.getElementById('newCustTime').value;
            const price = document.getElementById('newCustPrice').value;

            const newId = `CC-10${Math.floor(14 + Math.random() * 80)}`;
            const newOrder = {
                id: newId,
                name,
                phone,
                court,
                time,
                price,
                status: 'confirmed',
                statusText: 'Đã xác nhận',
                actionText: 'Xem / Nhận sân',
                note: 'Đơn tạo trực tiếp tại sân',
                riskRate: '≈ 0% - Đơn mới tại sân'
            };

            bookingData.unshift(newOrder);
            updateTabBadges();
            
            // Tự động cập nhật dữ liệu đơn mới xuống khối No-show Risk
            updateAIRiskFormWithOrder(newOrder);

            document.getElementById('createModal').remove();
            showToast(`Tạo thành công đơn ${newId} cho ${name}!`);
        });
    };

    if (btnCreateBooking) {
        btnCreateBooking.addEventListener('click', openCreateBookingModal);
    }

    window.addEventListener('keydown', (e) => {
        if (e.key === 'F2' || (e.ctrlKey && e.key.toLowerCase() === 'n')) {
            e.preventDefault();
            openCreateBookingModal();
        }
    });

    /* ==========================================================================
       2. NHÓM NÚT HÀNH ĐỘNG TRÊN BẢNG & ĐIỀU HƯỚNG CHỈ KHI BẤM "Xem / Nhận sân"
       ========================================================================== */

    if (ordersTableBody) {
        ordersTableBody.addEventListener('click', (e) => {
            if (!e.target.classList.contains('cell-action-btn')) return;
            const id = e.target.getAttribute('data-id');
            const order = bookingData.find(b => b.id === id);
            if (!order) return;

            // ĐỒNG BỘ THÔNG TIN ĐƠN NÀY XUỐNG FORM BÊN DƯỚI
            updateAIRiskFormWithOrder(order);

            // CHỈ ĐIỀU HƯỚNG KHI NÚT LÀ "Xem / Nhận sân", CÒN LẠI GIỮ NGUYÊN LOGIC CŨ
            if (order.actionText === 'Xem / Nhận sân') {
                window.location.href = `chusan_chitietdon.html?id=${order.id}`;
                return;
            }

            // Xử lý các hành động khác (ví dụ: đơn chờ duyệt hoặc các trạng thái khác)
            if (order.status === 'pending') {
                aiRiskCard?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                showToast(`Đã chọn đơn ${order.id} (${order.name}) xuống khối AI Risk!`, '🔍');
            } else {
                openOrderDetailModal(order);
            }
        });
    }

    const openOrderDetailModal = (order) => {
        const modalHtml = `
            <div class="custom-modal-overlay" id="detailModal">
                <div class="custom-modal-box">
                    <div class="custom-modal-header">
                        <h3 class="custom-modal-title">Chi Tiết Đơn ${order.id}</h3>
                        <button class="custom-modal-close" onclick="document.getElementById('detailModal').remove()">✕</button>
                    </div>
                    <div style="font-size: 0.875rem; line-height: 1.8; color: #334155;">
                        <p><strong>Khách hàng:</strong> ${order.name} (${order.phone || 'Chưa có SĐT'})</p>
                        <p><strong>Sân & Giờ:</strong> ${order.court} | ${order.time}</p>
                        <p><strong>Tổng tiền:</strong> ${order.price}</p>
                        <p><strong>Trạng thái:</strong> ${order.statusText}</p>
                    </div>
                    <div class="modal-actions">
                        ${order.status === 'pending' ? `<button class="btn-primary btn-add-custom" onclick="approveOrder('${order.id}')">Phê duyệt đơn</button>` : ''}
                        <button class="btn-sub-white" onclick="cancelOrder('${order.id}')" style="color: #EF4444;">Hủy đơn này</button>
                        <button class="btn-sub-white" onclick="document.getElementById('detailModal').remove()">Đóng</button>
                    </div>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', modalHtml);
    };

    window.approveOrder = (id) => {
        const order = bookingData.find(b => b.id === id);
        if (order) {
            order.status = 'confirmed';
            order.statusText = 'Đã xác nhận';
            order.actionText = 'Xem / Nhận sân';
            updateTabBadges();
            applyFilters();
            document.getElementById('detailModal')?.remove();
            showToast(`Đã duyệt thành công đơn ${id}!`);
        }
    };

    window.cancelOrder = (id) => {
        if (confirm(`Bạn chắc chắn muốn hủy đơn ${id}?`)) {
            const order = bookingData.find(b => b.id === id);
            if (order) {
                order.status = 'cancelled';
                order.statusText = 'Đã hủy';
                order.actionText = 'Xem chi tiết';
                updateTabBadges();
                applyFilters();
                document.getElementById('detailModal')?.remove();
                showToast(`Đã hủy đơn ${id}.`, '⚠️');
            }
        }
    };

    /* ==========================================================================
       3. NHÓM NÚT KHỐI AI MÔ PHỎNG (NO-SHOW RISK)
       ========================================================================== */

    const aiActionButtons = document.querySelectorAll('.risk-actions-row button');
    aiActionButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const actionText = e.target.textContent.trim();
            const orderCode = currentAIRiskOrder ? currentAIRiskOrder.id : 'CC-1011';
            const custName = currentAIRiskOrder ? currentAIRiskOrder.name : 'Quốc Bảo';

            switch (actionText) {
                case 'Chấp nhận gợi ý':
                    showToast(`Đã tạo nhắc việc: Gọi điện xác nhận đơn ${orderCode} (${custName}) trước 19:00!`, '📌');
                    break;
                case 'Sửa':
                    const newRate = prompt('Nhập lại mức độ rủi ro (%) bạn đánh giá thủ công:', '5%');
                    if (newRate && riskPercentageEl) {
                        riskPercentageEl.textContent = `≈ ${newRate} - Đã chỉnh sửa`;
                        showToast(`Đã cập nhật mức rủi ro về ${newRate}`);
                    }
                    break;
                case 'Từ chối':
                    if (currentAIRiskOrder) {
                        currentAIRiskOrder.status = 'cancelled';
                        currentAIRiskOrder.statusText = 'Đã hủy';
                        currentAIRiskOrder.actionText = 'Xem chi tiết';
                        
                        updateTabBadges();
                        applyFilters();
                        showToast(`Đã từ chối và chuyển đơn ${currentAIRiskOrder.id} (${currentAIRiskOrder.name}) sang trạng thái Đã hủy!`, '⚠️');
                    }
                    break;
                case 'Tạo lại':
                    showToast('AI đang phân tích lại dữ liệu thời gian thực...', '🔄');
                    setTimeout(() => {
                        if (riskPercentageEl) riskPercentageEl.textContent = '≈ 35% - Cập nhật';
                        showToast('Đã tính toán lại tỷ lệ rủi ro!');
                    }, 1000);
                    break;
                case 'Lưu':
                    showToast('Đã lưu thiết lập và ghi chú AI vào hệ thống!');
                    break;
            }
        });
    });

    /* ==========================================================================
       4. NHÓM NÚT THAO TÁC CON NGƯỜI (HUMAN ACTIONS)
       ========================================================================== */

    const btnLogCall = document.getElementById('btnLogCall');
    const btnViewHistory = document.getElementById('btnViewHistory');

    if (btnLogCall) {
        btnLogCall.addEventListener('click', () => {
            const custName = currentAIRiskOrder ? currentAIRiskOrder.name : 'Quốc Bảo';
            const orderId = currentAIRiskOrder ? currentAIRiskOrder.id : 'CC-1011';

            const modalHtml = `
                <div class="custom-modal-overlay" id="callModal">
                    <div class="custom-modal-box">
                        <div class="custom-modal-header">
                            <h3 class="custom-modal-title">Ghi Nhận Cuộc Gọi - ${custName} (${orderId})</h3>
                            <button class="custom-modal-close" onclick="document.getElementById('callModal').remove()">✕</button>
                        </div>
                        <p style="font-size: 0.8125rem; color: #64748B; margin-bottom: 1rem;">Chọn kết quả cuộc gọi xác nhận lịch chơi:</p>
                        <div style="display: flex; flex-direction: column; gap: 0.625rem;">
                            <button class="btn-sub-white" onclick="handleCallResult('confirm', '${orderId}')" style="text-align: left; padding: 0.75rem;">✅ Đã xác nhận sẽ đến (Chuyển sang Đã xác nhận)</button>
                            <button class="btn-sub-white" onclick="handleCallResult('cancel', '${orderId}')" style="text-align: left; padding: 0.75rem; color: #EF4444;">❌ Khách báo hủy (Giải phóng sân)</button>
                            <button class="btn-sub-white" onclick="handleCallResult('retry', '${orderId}')" style="text-align: left; padding: 0.75rem;">📞 Không nhấc máy (Ghi nhận để gọi lại sau)</button>
                        </div>
                    </div>
                </div>
            `;
            document.body.insertAdjacentHTML('beforeend', modalHtml);
        });
    }

    window.handleCallResult = (type, orderId) => {
        const order = bookingData.find(b => b.id === orderId);
        document.getElementById('callModal')?.remove();

        if (type === 'confirm') {
            if (order) {
                order.status = 'confirmed';
                order.statusText = 'Đã xác nhận';
                order.actionText = 'Xem / Nhận sân';
            }
            updateTabBadges();
            applyFilters();
            showToast(`Đã chuyển đơn ${orderId} sang Đã xác nhận!`);
        } else if (type === 'cancel') {
            if (order) {
                order.status = 'cancelled';
                order.statusText = 'Đã hủy';
                order.actionText = 'Xem chi tiết';
            }
            updateTabBadges();
            applyFilters();
            showToast(`Đã hủy đơn ${orderId} và giải phóng sân.`, '⚠️');
        } else if (type === 'retry') {
            showToast(`Đã lưu lịch sử: Chưa liên lạc được với khách đơn ${orderId}.`, '📞');
        }
    };

    if (btnViewHistory) {
        btnViewHistory.addEventListener('click', () => {
            const custName = currentAIRiskOrder ? currentAIRiskOrder.name : 'Quốc Bảo';
            const modalHtml = `
                <div class="custom-modal-overlay" id="historyModal">
                    <div class="custom-modal-box" style="max-width: 550px;">
                        <div class="custom-modal-header">
                            <h3 class="custom-modal-title">Lịch Sử Hẹn - ${custName}</h3>
                            <button class="custom-modal-close" onclick="document.getElementById('historyModal').remove()">✕</button>
                        </div>
                        <div style="font-size: 0.8125rem; color: #334155; line-height: 1.8;">
                            <p>• <strong>08/10/2026:</strong> P01 (18:00–20:00) — <span style="color: #10B981;">Đúng giờ</span></p>
                            <p>• <strong>01/10/2026:</strong> P04 (20:00–22:00) — <span style="color: #EF4444;">Vắng không báo</span></p>
                            <p>• <strong>24/09/2026:</strong> P02 (18:00–20:00) — <span style="color: #10B981;">Đúng giờ</span></p>
                        </div>
                        <div class="modal-actions">
                            <button class="btn-sub-white" onclick="document.getElementById('historyModal').remove()">Đóng</button>
                        </div>
                    </div>
                </div>
            `;
            document.body.insertAdjacentHTML('beforeend', modalHtml);
        });
    }

    // Khởi chạy đồng bộ dữ liệu ban đầu
    updateTabBadges();
    if (currentAIRiskOrder) {
        updateAIRiskFormWithOrder(currentAIRiskOrder);
    } else {
        applyFilters();
    }
});