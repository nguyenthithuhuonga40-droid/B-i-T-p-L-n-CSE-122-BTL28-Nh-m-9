document.addEventListener('DOMContentLoaded', () => {
    // --- 1. KHỞI TẠO LUCIDE ICONS ---
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // --- 2. QUẢN LÝ DỮ LIỆU ĐỘNG (STATE) ---
    const state = {
        pendingBookings: [
            { id: 'CC-1011', customer: 'Quốc Bảo', court: 'P04', time: '20:00–22:00' },
            { id: 'CC-1012', customer: 'Mai Linh', court: 'P03', time: '18:00–20:00' },
            { id: 'CC-1013', customer: 'Hoàng Long', court: 'P01', time: '16:00–18:00' }
        ],
        totalSlots: 32,
        bookedSlots: 16
    };

    // --- 3. KHỞI TẠO BIỂU ĐỒ DOANH THU 7 NGÀY (CHART.JS) ---
    const ctx = document.getElementById('revenueChart');
    if (ctx) {
        if (typeof Chart === 'undefined') {
            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/chart.js';
            script.onload = () => initChart(ctx);
            document.head.appendChild(script);
        } else {
            initChart(ctx);
        }
    }

    function initChart(canvasContext) {
        new Chart(canvasContext, {
            type: 'line',
            data: {
                labels: ['04/10', '05/10', '06/10', '07/10', '08/10', '09/10', '10/10'],
                datasets: [{
                    label: 'Doanh thu',
                    data: [1.2, 2.1, 1.8, 3.4, 3.0, 4.6, 5.22],
                    borderColor: '#0B231C',
                    backgroundColor: 'transparent',
                    borderWidth: 2.5,
                    tension: 0.3,
                    pointBackgroundColor: '#0B231C',
                    pointRadius: 4,
                    pointHoverRadius: 6
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return ` Doanh thu: ${context.parsed.y} triệu VNĐ`;
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 6,
                        ticks: {
                            stepSize: 2,
                            font: { size: 10, family: 'Inter' },
                            color: '#9CA3AF',
                            callback: function(value) { return value + ' tr'; }
                        },
                        grid: { color: '#F3F4F6' }
                    },
                    x: {
                        ticks: {
                            font: { size: 10, family: 'Inter' },
                            color: '#9CA3AF'
                        },
                        grid: { display: false }
                    }
                }
            }
        });
    }

    // --- 4. THAM CHIẾU DOM & CẬP NHẬT GIAO DIỆN ---
    const metricPendingEl = document.querySelector('.metrics-grid .card-metric:nth-child(3) .metric-value');
    const metricBookedSlotsEl = document.querySelector('.metrics-grid .card-metric:nth-child(1) .metric-value');
    const alertHeaderSpan = document.querySelector('.alert-header span');
    const ordersListContainer = document.querySelector('.orders-list');
    const tableBody = document.querySelector('.data-table tbody');
    const btnViewPending = document.querySelector('.priority-actions .btn-primary');

    function updateUI() {
        const pendingCount = state.pendingBookings.length;
        
        if (metricPendingEl) metricPendingEl.textContent = pendingCount;
        if (metricBookedSlotsEl) metricBookedSlotsEl.textContent = `${state.bookedSlots}/${state.totalSlots}`;
        if (alertHeaderSpan) alertHeaderSpan.textContent = `${pendingCount} đơn cần duyệt`;

        if (ordersListContainer) {
            ordersListContainer.innerHTML = '';
            if (pendingCount === 0) {
                ordersListContainer.innerHTML = '<p class="order-item" style="color: #9CA3AF; font-style: italic;">Không có đơn chờ duyệt nào</p>';
            } else {
                state.pendingBookings.forEach(item => {
                    const p = document.createElement('p');
                    p.className = 'order-item';
                    p.textContent = `${item.id} · ${item.customer} · ${item.court}`;
                    p.addEventListener('click', () => openModal());
                    ordersListContainer.appendChild(p);
                });
            }
        }
    }

    // --- 5. XỬ LÝ CLICK TRÊN BẢNG (GIỮ NGUYÊN GIAO DIỆN, CHIA VÙNG TỌA ĐỘ) ---
    if (tableBody) {
        tableBody.addEventListener('click', (e) => {
            const target = e.target;
            const row = target.closest('tr');
            if (!row) return;

            const codeText = row.querySelector('.td-highlight')?.textContent || '';
            const orderId = codeText.split('·')[0].trim();
            const statusCell = row.cells[3];
            const actionCell = row.cells[4];

            // Kiểm tra nếu click vào ô thao tác đang có chữ "Duyệt / Từ chối"
            if (actionCell && actionCell.contains(target) && actionCell.textContent.includes('Duyệt')) {
                // Lấy tọa độ X của điểm click so với ô (chia đôi ô)
                const rect = actionCell.getBoundingClientRect();
                const clickX = e.clientX - rect.left;
                const isLeftSide = clickX < (rect.width / 2); // Nửa trái: Duyệt, Nửa phải: Từ chối

                if (isLeftSide) {
                    // Bấm vào bên "Duyệt"
                    statusCell.textContent = 'Đã xác nhận';
                    statusCell.style.color = '#0B231C';
                    actionCell.innerHTML = 'Xem / Nhận sân';
                    actionCell.style.cursor = 'pointer';

                    state.pendingBookings = state.pendingBookings.filter(b => b.id !== orderId);
                    state.bookedSlots += 1;
                    updateUI();
                } else {
                    // Bấm vào bên "Từ chối" -> Chuyển thành Đã hủy
                    statusCell.textContent = 'Đã hủy';
                    statusCell.style.color = '#EF4444';
                    actionCell.innerHTML = '<span style="color: #9CA3AF;">Đã hủy</span>';

                    state.pendingBookings = state.pendingBookings.filter(b => b.id !== orderId);
                    updateUI();
                }
            }
        });
    }

    // --- 6. XÂY DỰNG MODAL XEM ĐƠN CHỜ ---
    const modalHTML = `
        <div id="custom-pending-modal" style="display:none; position:fixed; inset:0; background:rgba(0,0,0,0.4); backdrop-filter:blur(2px); z-index:100; align-items:center; justify-content:center; padding:1rem;">
            <div style="background:#FFFFFF; border-radius:1rem; padding:1.5rem; width:100%; max-width:440px; box-shadow:0 20px 25px -5px rgba(0,0,0,0.1); display:flex; flex-direction:column; gap:1rem;">
                <div style="display:flex; align-items:center; justify-content:space-between; border-bottom:1px solid #F3F4F6; padding-bottom:0.75rem;">
                    <h3 style="font-size:1rem; font-weight:700; color:#0B231C;">Danh sách đơn chờ duyệt</h3>
                    <button id="modal-close-btn" style="background:#F3F4F6; border:none; width:28px; height:28px; border-radius:50%; font-size:0.875rem; cursor:pointer; color:#4B5563; font-weight:700; display:flex; align-items:center; justify-content:center;">✕</button>
                </div>
                <div id="modal-orders-container" style="display:flex; flex-direction:column; gap:0.75rem; max-height:280px; overflow-y:auto;"></div>
                <div style="display:flex; justify-content:flex-end; padding-top:0.5rem; border-top:1px solid #F3F4F6;">
                    <button id="modal-close-bottom" style="padding:0.5rem 1rem; background:#F3F4F6; border:none; border-radius:0.5rem; font-size:0.75rem; font-weight:500; cursor:pointer; color:#374151;">Đóng</button>
                </div>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHTML);

    const modal = document.getElementById('custom-pending-modal');
    const modalOrdersContainer = document.getElementById('modal-orders-container');
    const modalCloseBtn = document.getElementById('modal-close-btn');
    const modalCloseBottom = document.getElementById('modal-close-bottom');

    function openModal() {
        modalOrdersContainer.innerHTML = '';
        if (state.pendingBookings.length === 0) {
            modalOrdersContainer.innerHTML = '<p style="font-size:0.75rem; color:#6B7280; text-align:center; padding:1.5rem 0;">Không có đơn chờ duyệt nào cần xử lý!</p>';
        } else {
            state.pendingBookings.forEach(item => {
                const itemCard = document.createElement('div');
                itemCard.style.cssText = 'display:flex; align-items:center; justify-content:space-between; padding:0.875rem 1rem; background:#F9FAFB; border-radius:0.75rem; border:1px solid #F3F4F6; font-size:0.75rem; gap:1rem;';
                itemCard.innerHTML = `
                    <div style="flex:1;">
                        <div style="font-weight:700; color:#0B231C; margin-bottom:2px;">${item.id} · ${item.customer}</div>
                        <div style="color:#6B7280; font-size:11px;">Sân: ${item.court} | Giờ: ${item.time}</div>
                    </div>
                    <div style="display:flex; align-items:center; gap:0.5rem; flex-shrink:0;">
                        <button data-id="${item.id}" class="modal-approve-btn" style="background:#0B231C; color:#FFFFFF; border:none; padding:0.375rem 0.875rem; border-radius:0.5rem; font-size:11px; font-weight:600; cursor:pointer;">Duyệt ngay</button>
                    </div>
                `;
                modalOrdersContainer.appendChild(itemCard);
            });

            modalOrdersContainer.querySelectorAll('.modal-approve-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const idToApprove = e.target.getAttribute('data-id');
                    
                    if (tableBody) {
                        tableBody.querySelectorAll('tr').forEach(row => {
                            const codeText = row.querySelector('.td-highlight')?.textContent || '';
                            if (codeText.includes(idToApprove)) {
                                row.cells[3].textContent = 'Đã xác nhận';
                                row.cells[3].style.color = '#0B231C';
                                row.cells[4].innerHTML = 'Xem / Nhận sân';
                            }
                        });
                    }

                    state.pendingBookings = state.pendingBookings.filter(b => b.id !== idToApprove);
                    state.bookedSlots += 1;
                    updateUI();
                    openModal();
                });
            });
        }
        modal.style.display = 'flex';
    }

    function closeModal() {
        modal.style.display = 'none';
    }

    if (btnViewPending) {
        btnViewPending.addEventListener('click', (e) => {
            e.preventDefault();
            openModal();
        });
    }

    if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);
    if (modalCloseBottom) modalCloseBottom.addEventListener('click', closeModal);
    window.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });

    // --- 7. ĐIỀU HƯỚNG SIDEBAR ---


    updateUI();
});