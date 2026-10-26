

/**
 * CourtConnect - Vận hành hệ thống & Báo cáo
 * File JS hoàn chỉnh - Xử lý tính năng Đọc báo cáo chi tiết và Tạo báo cáo linh hoạt với mọi thông tin
 */

document.addEventListener('DOMContentLoaded', () => {
    // --- 1. KHỞI TẠO LUCIDE ICONS ---
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // --- 2. QUẢN LÝ DỮ LIỆU (STATE) ---
    const state = {
        reports: [
            { id: 1, name: 'Nhịp chơi đầu tháng 10', range: '01–10/10 · Tất cả', creator: 'Hải Nam', status: 'Đã lưu' },
            { id: 2, name: 'Pickleball cuối tháng 9', range: '20–30/09 · Pickleball', creator: 'Hải Nam', status: 'Đã lưu' },
            { id: 3, name: 'Tổng kết tháng 8', range: '01–31/08 · Tất cả', creator: 'Hải Nam', status: 'Đã lưu trữ' }
        ],
        mockDataBySport: {
            all: { orders: '120', joins: '384', completed: '96', noshow: '6,25%', pkh: '78 đơn · 65%', bad: '42 đơn · 35%', pkhWidth: '65%', badWidth: '35%' },
            pickleball: { orders: '78', joins: '249', completed: '65', noshow: '4,1%', pkh: '78 đơn · 100%', bad: '0 đơn · 0%', pkhWidth: '100%', badWidth: '0%' },
            badminton: { orders: '42', joins: '135', completed: '31', noshow: '8,5%', pkh: '0 đơn · 0%', bad: '42 đơn · 100%', pkhWidth: '0%', badWidth: '100%' }
        },
        editingReportId: null
    };

    // --- 3. THAM CHIẾU DOM ELEMENTS ---
    const dateInput = document.querySelector('.search-filter-container .filter-card-item:nth-child(1) input');
    const sportSelect = document.querySelector('.search-filter-container .filter-card-item:nth-child(3) select');
    const btnApply = document.querySelector('.btn-search-standalone');

    const metricValues = document.querySelectorAll('.metric-value');
    const progressStats = document.querySelectorAll('.sport-stat');
    const progressFills = document.querySelectorAll('.progress-bar-fill');

    const tableBody = document.querySelector('.data-table tbody');
    const tableFooter = document.querySelector('.table-footer');
    
    const btnCreateFromFilter = document.querySelector('.btn-outline-custom');
    const btnHeaderCreate = document.querySelector('.page-header-model .btn-add-custom');

    const reportNameInput = document.querySelector('.input-card-box .model-input');
    const btnSaveReport = document.querySelector('.form-actions-inline .btn-primary');
    const btnArchiveReport = document.querySelector('.form-actions-inline .btn-danger-light');

    // --- 4. TOAST NOTIFICATION & MODAL SYSTEM STYLES ---
    const injectCustomStyles = () => {
        if (document.getElementById('custom-report-styles')) return;
        const style = document.createElement('style');
        style.id = 'custom-report-styles';
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
            .toast-container { position: fixed; bottom: 20px; right: 20px; z-index: 10000; display: flex; flex-direction: column; gap: 8px; }
            .toast-item { background: #0B2B22; color: #FFFFFF; padding: 0.75rem 1.25rem; border-radius: 8px; font-size: 0.8125rem; font-weight: 500; box-shadow: 0 4px 12px rgba(0,0,0,0.15); animation: slideIn 0.3s ease; display: flex; align-items: center; gap: 8px; }
            .action-btn-link { cursor: pointer; color: #0B2B22; font-weight: 500; transition: color 0.2s; }
            .action-btn-link:hover { color: #10B981; text-decoration: underline; }
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
        setTimeout(() => toast.remove(), 3200);
    };

    // --- 5. RENDER BẢNG BÁO CÁO ĐÃ LƯU ---
    function renderTable() {
        if (!tableBody) return;
        tableBody.innerHTML = '';

        if (state.reports.length === 0) {
            tableBody.innerHTML = `<tr><td colspan="5" style="text-align: center; color: #94A3B8; padding: 2rem;">Chưa có báo cáo nào được lưu.</td></tr>`;
            if (tableFooter) tableFooter.textContent = 'Hiển thị 0 bản ghi · Trang 1';
            return;
        }

        state.reports.forEach(item => {
            const tr = document.createElement('tr');
            
            const isArchived = item.status === 'Đã lưu trữ';
            const actionButtonsHtml = isArchived
                ? `<span class="action-btn-link" data-action="read" data-id="${item.id}">Đọc</span> · <span class="action-btn-link" data-action="restore" data-id="${item.id}">Khôi phục</span>`
                : `<span class="action-btn-link" data-action="read" data-id="${item.id}">Đọc</span> · <span class="action-btn-link" data-action="edit" data-id="${item.id}">Sửa</span> · <span class="action-btn-link" data-action="archive" data-id="${item.id}">Lưu trữ</span>`;

            tr.innerHTML = `
                <td class="td-left td-highlight" style="cursor: pointer;" data-action="read" data-id="${item.id}">${item.name}</td>
                <td>${item.range}</td>
                <td>${item.creator}</td>
                <td><span class="status-saved" style="${isArchived ? 'color: #94A3B8;' : ''}">${item.status}</span></td>
                <td class="td-right td-action">${actionButtonsHtml}</td>
            `;

            tableBody.appendChild(tr);
        });

        if (tableFooter) {
            tableFooter.textContent = `Hiển thị ${state.reports.length} bản ghi minh họa · Trang 1`;
        }
    }

    // --- 6. XỬ LÝ LỌC & CẬP NHẬT BIỂU ĐỒ ---
    if (btnApply) {
        btnApply.addEventListener('click', () => {
            const selectedSport = sportSelect ? sportSelect.value : 'all';
            const mock = state.mockDataBySport[selectedSport] || state.mockDataBySport.all;

            if (metricValues.length >= 4) {
                metricValues[0].textContent = mock.orders;
                metricValues[1].textContent = mock.joins;
                metricValues[2].textContent = mock.completed;
                metricValues[3].textContent = mock.noshow;
            }

            if (progressStats.length >= 2) {
                progressStats[0].textContent = mock.pkh;
                progressStats[1].textContent = mock.bad;
            }

            if (progressFills.length >= 2) {
                progressFills[0].style.width = mock.pkhWidth;
                progressFills[1].style.width = mock.badWidth;
            }

            showToast('Đã áp dụng bộ lọc và cập nhật báo cáo!');
        });
    }

    // --- 7. TÍNH NĂNG TẠO BÁO CÁO MỚI (CHO PHÉP ĐIỀN MỌI THÔNG TIN) ---
    const openCreateCustomReportModal = () => {
        const modalHtml = `
            <div class="custom-modal-overlay" id="createReportModal">
                <div class="custom-modal-box">
                    <div class="custom-modal-header">
                        <h3 class="custom-modal-title">+ Tạo Báo Cáo Tùy Chỉnh</h3>
                        <button class="custom-modal-close" onclick="document.getElementById('createReportModal').remove()">✕</button>
                    </div>
                    <form id="customReportForm">
                        <div style="margin-bottom: 1rem;">
                            <label style="display:block; font-size:12px; font-weight:600; color:#64748B; margin-bottom:0.375rem;">Tên báo cáo (*)</label>
                            <input type="text" id="modalReportName" required placeholder="Nhập tên báo cáo..." style="width:100%; padding:0.625rem 0.875rem; border:1px solid #CBD5E1; border-radius:8px; font-size:0.875rem; box-sizing:border-box;">
                        </div>
                        <div style="margin-bottom: 1rem;">
                            <label style="display:block; font-size:12px; font-weight:600; color:#64748B; margin-bottom:0.375rem;">Phạm vi dữ liệu</label>
                            <input type="text" id="modalReportRange" placeholder="Ví dụ: 15–20/10 · Cầu lông" value="01–15/10 · Tổng hợp" style="width:100%; padding:0.625rem 0.875rem; border:1px solid #CBD5E1; border-radius:8px; font-size:0.875rem; box-sizing:border-box;">
                        </div>
                        <div style="margin-bottom: 1rem;">
                            <label style="display:block; font-size:12px; font-weight:600; color:#64748B; margin-bottom:0.375rem;">Người tạo</label>
                            <input type="text" id="modalReportCreator" value="Hải Nam" style="width:100%; padding:0.625rem 0.875rem; border:1px solid #CBD5E1; border-radius:8px; font-size:0.875rem; box-sizing:border-box;">
                        </div>
                        <div style="display: flex; justify-content: flex-end; gap: 0.75rem; margin-top: 1.25rem;">
                            <button type="button" onclick="document.getElementById('createReportModal').remove()" style="padding: 0.5rem 1rem; background: #E2E8F0; border: none; border-radius: 6px; cursor: pointer; font-weight:500;">Hủy</button>
                            <button type="submit" style="padding: 0.5rem 1.25rem; background: #0B2B22; color: #fff; border: none; border-radius: 6px; cursor: pointer; font-weight:600;">Lưu báo cáo mới</button>
                        </div>
                    </form>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', modalHtml);

        document.getElementById('customReportForm').addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('modalReportName').value.trim();
            const range = document.getElementById('modalReportRange').value.trim();
            const creator = document.getElementById('modalReportCreator').value.trim();

            if (!name) return;

            const newReport = {
                id: Date.now(),
                name: name,
                range: range || '01–10/10 · Tùy chỉnh',
                creator: creator || 'Hải Nam',
                status: 'Đã lưu'
            };

            state.reports.unshift(newReport);
            renderTable();
            document.getElementById('createReportModal').remove();
            showToast(`Tạo thành công báo cáo "${name}"!`, '🎉');
        });
    };

    if (btnHeaderCreate) {
        btnHeaderCreate.addEventListener('click', (e) => {
            e.preventDefault();
            openCreateCustomReportModal();
        });
    }

    const fillFilterToInput = () => {
        const dateVal = dateInput ? dateInput.value : '01–10/10/2026';
        const sportText = sportSelect && sportSelect.options[sportSelect.selectedIndex] ? sportSelect.options[sportSelect.selectedIndex].text : 'Tất cả';
        
        if (reportNameInput) {
            reportNameInput.value = `Báo cáo ${sportText} (${dateVal.split('/2026')[0]})`;
            reportNameInput.focus();
            document.querySelector('.bottom-report-section')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    };

    if (btnCreateFromFilter) {
        btnCreateFromFilter.addEventListener('click', () => {
            fillFilterToInput();
            showToast('Đã điền tên báo cáo từ bộ lọc hiện tại!', '📌');
        });
    }

    // --- 8. LƯU & XÁC NHẬN LƯU TRỮ BÁO CÁO Ở FORM DƯỚI ---
    if (btnSaveReport) {
        btnSaveReport.addEventListener('click', (e) => {
            e.preventDefault();
            const name = reportNameInput ? reportNameInput.value.trim() : '';

            if (!name) {
                alert('Vui lòng nhập tên báo cáo mới!');
                return;
            }

            const dateVal = dateInput ? dateInput.value : '01–10/10/2026';
            const sportText = sportSelect && sportSelect.value !== 'all' 
                ? (sportSelect.value === 'pickleball' ? 'Pickleball' : 'Cầu lông') 
                : 'Tất cả';

            if (state.editingReportId) {
                const report = state.reports.find(r => r.id === state.editingReportId);
                if (report) {
                    report.name = name;
                    report.range = `${dateVal.split('/2026')[0]} · ${sportText}`;
                    showToast(`Đã cập nhật báo cáo "${name}"!`);
                }
                state.editingReportId = null;
            } else {
                const newReport = {
                    id: Date.now(),
                    name: name,
                    range: `${dateVal.split('/2026')[0]} · ${sportText}`,
                    creator: 'Hải Nam',
                    status: 'Đã lưu'
                };
                state.reports.unshift(newReport);
                showToast(`Đã lưu thành công báo cáo "${name}"!`);
            }

            renderTable();
        });
    }

    if (btnArchiveReport) {
        btnArchiveReport.addEventListener('click', (e) => {
            e.preventDefault();
            const name = reportNameInput ? reportNameInput.value.trim() : '';
            if (!name) {
                alert('Vui lòng nhập tên báo cáo cần lưu trữ!');
                return;
            }

            const existing = state.reports.find(r => r.name.toLowerCase() === name.toLowerCase());
            if (existing) {
                existing.status = 'Đã lưu trữ';
                showToast(`Đã chuyển báo cáo "${name}" sang lưu trữ!`, '📦');
            } else {
                showToast(`Đã xác nhận lưu trữ thiết lập "${name}"!`, '📦');
            }

            renderTable();
        });
    }

    // --- 9. THAO TÁC TRÊN BẢNG (ĐỌC, SỬA, LƯU TRỮ, KHÔI PHỤC) ---
    if (tableBody) {
        tableBody.addEventListener('click', (e) => {
            const action = e.target.getAttribute('data-action');
            const id = parseInt(e.target.getAttribute('data-id'), 10);
            if (!action || !id) return;

            const report = state.reports.find(r => r.id === id);
            if (!report) return;

            if (action === 'read') {
                openReportModal(report);
            } else if (action === 'edit') {
                state.editingReportId = report.id;
                if (reportNameInput) {
                    reportNameInput.value = report.name;
                    reportNameInput.focus();
                }
                document.querySelector('.bottom-report-section')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                showToast(`Đang chỉnh sửa báo cáo "${report.name}"`, '✏️');
            } else if (action === 'archive') {
                report.status = 'Đã lưu trữ';
                renderTable();
                showToast(`Đã chuyển "${report.name}" sang trạng thái Đã lưu trữ.`, '📦');
            } else if (action === 'restore') {
                report.status = 'Đã lưu';
                renderTable();
                showToast(`Đã khôi phục báo cáo "${report.name}".`, '🔄');
            }
        });
    }

    // Modal hiển thị chi tiết nội dung khi bấm "Đọc"
    const openReportModal = (report) => {
        const modalHtml = `
            <div class="custom-modal-overlay" id="reportModal">
                <div class="custom-modal-box">
                    <div class="custom-modal-header">
                        <h3 class="custom-modal-title">Chi Tiết Báo Cáo</h3>
                        <button class="custom-modal-close" onclick="document.getElementById('reportModal').remove()">✕</button>
                    </div>
                    <div style="font-size: 0.875rem; line-height: 1.8; color: #334155;">
                        <p><strong>Tên báo cáo:</strong> ${report.name}</p>
                        <p><strong>Phạm vi dữ liệu:</strong> ${report.range}</p>
                        <p><strong>Người tạo:</strong> ${report.creator}</p>
                        <p><strong>Trạng thái:</strong> ${report.status}</p>
                        <p style="margin-top: 1rem; color: #64748B; font-size: 13px;"><em>Ghi chú: Dữ liệu mô phỏng phản ánh đúng nhịp chơi cộng đồng trong kỳ khai thác của CourtConnect.</em></p>
                    </div>
                    <div style="display: flex; justify-content: flex-end; margin-top: 1.5rem;">
                        <button onclick="document.getElementById('reportModal').remove()" style="padding: 0.5rem 1.25rem; background: #0B2B22; color: #fff; border: none; border-radius: 6px; cursor: pointer; font-weight: 600;">Đóng</button>
                    </div>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', modalHtml);
    };

    // Khởi chạy bảng lần đầu
    renderTable();
});