document.addEventListener('DOMContentLoaded', () => {
    // --- 1. KHỞI TẠO LUCIDE ICONS ---
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // --- 2. QUẢN LÝ DỮ LIỆU SÂN (STATE) ---
    const state = {
        courts: [
            { id: 'P01', name: 'Sân vườn', sport: 'Pickleball', type: 'Ngoài trời', price: '180.000đ', status: 'Đang hoạt động', utilities: 'Đèn · Gửi xe · Phòng thay đồ', desc: 'Mặt acrylic xanh, lưới tiêu chuẩn, khu nghỉ chung.' },
            { id: 'P02', name: 'Sân trung tâm', sport: 'Pickleball', type: 'Ngoài trời', price: '180.000đ', status: 'Đang hoạt động', utilities: 'Đèn · Gửi xe · Phòng thay đồ', desc: 'Sân chính tiêu chuẩn thi đấu.' },
            { id: 'P03', name: 'Sân CLB', sport: 'Pickleball', type: 'Ngoài trời', price: '180.000đ', status: 'Đang hoạt động', utilities: 'Đèn · Gửi xe', desc: 'Khu vực dành cho hội viên câu lạc bộ.' },
            { id: 'P04', name: 'Sân CLB', sport: 'Pickleball', type: 'Ngoài trời', price: '180.000đ', status: 'Đang hoạt động', utilities: 'Đèn · Gửi xe', desc: 'Sân phụ phục vụ tập luyện.' },
            { id: 'P05', name: 'Sân mở rộng', sport: 'Pickleball', type: 'Ngoài trời', price: '180.000đ', status: 'Bảo trì', utilities: 'Đèn · Gửi xe', desc: 'Đang tiến hành bảo trì mặt sân định kỳ.' },
            { id: 'P00', name: 'Sân cũ', sport: 'Pickleball', type: 'Ngoài trời', price: '—', status: 'Đã lưu trữ', utilities: 'Không có', desc: 'Đã ngừng khai thác từ 01/09.' }
        ],
        currentFilter: {
            keyword: '',
            status: 'all' // 'all', 'active', 'maintenance', 'archived'
        },
        editingCourtId: 'P01' // Lưu ID sân đang được chọn chỉnh sửa
    };

    // --- 3. THAM CHIẾU DOM ELEMENTS ---
    const searchInput = document.querySelector('.search-filter-container .field-input');
    const filterStatusSelect = document.querySelector('.search-filter-container .filter-card-item:nth-child(3) select.field-select');
    const tableBody = document.querySelector('.data-table tbody');
    
    const formCard = document.querySelector('.form-edit-card');
    const allFormInputs = formCard ? formCard.querySelectorAll('.model-input') : [];
    
    const formInputs = {
        name: allFormInputs[0],      // Tên sân
        id: allFormInputs[1],        // Mã sân
        sport: allFormInputs[2],     // Môn
        type: allFormInputs[3],      // Loại sân
        utilities: allFormInputs[4], // Tiện ích
        price: allFormInputs[5],     // Giá cao điểm / giờ
        status: allFormInputs[6],    // Trạng thái (Dropdown)
        desc: formCard ? formCard.querySelector('textarea') : null // Mô tả
    };

    const btnSave = formCard ? formCard.querySelector('.btn-primary') : null;
    const btnCancel = formCard ? formCard.querySelector('.btn-cancel-edit') : null;
    const btnAddCourt = document.querySelector('.btn-add-custom');
    const statusTabs = document.querySelectorAll('.status-tabs-bold-row .tab-bold-item');
    const btnSearch = document.querySelector('.btn-search-standalone');

    const maintenanceBox = document.querySelector('.maintenance-box');
    const btnArchiveMaintenance = document.querySelector('.btn-archive-action');

    // --- 4. HÀM RENDER BẢNG DỮ LIỆU ---
    function renderTable() {
        if (!tableBody) return;
        tableBody.innerHTML = '';

        const filteredCourts = state.courts.filter(court => {
            const matchKeyword = court.name.toLowerCase().includes(state.currentFilter.keyword.toLowerCase()) || 
                                 court.id.toLowerCase().includes(state.currentFilter.keyword.toLowerCase());
            
            const matchStatus = state.currentFilter.status === 'all' || 
                                (state.currentFilter.status === 'active' && court.status === 'Đang hoạt động') ||
                                (state.currentFilter.status === 'maintenance' && court.status === 'Bảo trì') ||
                                (state.currentFilter.status === 'archived' && court.status === 'Đã lưu trữ');

            return matchKeyword && matchStatus;
        });

        if (filteredCourts.length === 0) {
            tableBody.innerHTML = `<tr><td colspan="5" style="text-align: center; padding: 1.5rem; color: var(--gray-400);">Không tìm thấy sân phù hợp</td></tr>`;
            updateTabCounts();
            return;
        }

        filteredCourts.forEach(court => {
            const tr = document.createElement('tr');
            
            let statusStyle = 'color: #059669; font-weight: 600;';
            if (court.status === 'Bảo trì') statusStyle = 'color: #D97706; font-weight: 600;';
            if (court.status === 'Đã lưu trữ') statusStyle = 'color: var(--gray-400);';

            let actionText = 'Sửa · Xem lịch';
            if (court.status === 'Bảo trì') actionText = 'Sửa · Lưu trữ';
            if (court.status === 'Đã lưu trữ') actionText = 'Đọc lịch sử';

            tr.innerHTML = `
                <td class="td-left td-highlight" style="cursor: pointer;" data-id="${court.id}">${court.id} · ${court.name}</td>
                <td>${court.sport} / ${court.type}</td>
                <td>${court.price}</td>
                <td><span style="${statusStyle}">${court.status}</span></td>
                <td class="td-right td-action" data-id="${court.id}">${actionText}</td>
            `;

            tableBody.appendChild(tr);
        });

        updateTabCounts();
    }

    // --- 5. ĐỔ DỮ LIỆU LÊN FORM KHI CHỌN SÂN HOẶC THÊM MỚI ---
    function loadCourtToForm(court) {
        if (!court) {
            // Form rỗng để chuẩn bị thêm sân mới (Cho phép sửa tất cả các ô)
            state.editingCourtId = null;
            if (formInputs.name) formInputs.name.value = '';
            if (formInputs.id) {
                formInputs.id.value = `P0${state.courts.length + 1}`;
                formInputs.id.disabled = false; // Cho phép nhập/sửa mã sân mới
            }
            if (formInputs.sport) formInputs.sport.value = 'Pickleball';
            if (formInputs.type) formInputs.type.value = 'Ngoài trời';
            if (formInputs.utilities) formInputs.utilities.value = 'Đèn · Gửi xe · Phòng thay đồ';
            if (formInputs.price) formInputs.price.value = '180.000đ';
            if (formInputs.status) formInputs.status.value = 'Đang hoạt động';
            if (formInputs.desc) formInputs.desc.value = '';
        } else {
            // Đổ dữ liệu sân được chọn lên form để sửa (Cho phép sửa tất cả các thông tin)
            state.editingCourtId = court.id;
            if (formInputs.name) formInputs.name.value = court.name;
            if (formInputs.id) {
                formInputs.id.value = court.id;
                formInputs.id.disabled = false; // Cho phép chỉnh sửa cả mã sân nếu cần
            }
            if (formInputs.sport) formInputs.sport.value = court.sport;
            if (formInputs.type) formInputs.type.value = court.type;
            if (formInputs.utilities) formInputs.utilities.value = court.utilities;
            if (formInputs.price) formInputs.price.value = court.price;
            if (formInputs.status) formInputs.status.value = court.status;
            if (formInputs.desc) formInputs.desc.value = court.desc;

            updateMaintenanceBox(court);
        }
    }

    function updateMaintenanceBox(court) {
        if (!maintenanceBox) return;
        const alertTitleSpan = maintenanceBox.querySelector('.maintenance-alert-title span');
        const descP = maintenanceBox.querySelector('.maintenance-desc');
        const btnArchive = maintenanceBox.querySelector('.btn-archive-action');

        if (court.status === 'Bảo trì') {
            maintenanceBox.style.display = 'flex';
            if (alertTitleSpan) alertTitleSpan.textContent = `${court.id} · Bảo trì`;
            if (descP) descP.textContent = `Đóng đặt mới sân ${court.name} để bảo trì. Lưu trữ không xóa lịch sử đơn.`;
            if (btnArchive) {
                btnArchive.textContent = `Lưu trữ sân ${court.id}`;
                btnArchive.setAttribute('data-target-id', court.id);
            }
        } else {
            if (btnArchive) btnArchive.setAttribute('data-target-id', court.id);
        }
    }

    // --- 6. XỬ LÝ SỰ KIỆN CLICK TRÊN BẢNG (BẤM SỬA SÂN -> TRƯỢT XUỐNG FORM) ---
    if (tableBody) {
        tableBody.addEventListener('click', (e) => {
            const target = e.target;
            const courtId = target.getAttribute('data-id') || target.closest('tr')?.querySelector('.td-highlight')?.getAttribute('data-id');
            
            if (!courtId) return;

            const court = state.courts.find(c => c.id === courtId);
            if (court) {
                loadCourtToForm(court);
                document.querySelector('.bottom-grid-layout')?.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }

    // --- 7. NÚT THÊM SÂN MỚI (TRƯỢT XUỐNG FORM) ---
    if (btnAddCourt) {
        btnAddCourt.addEventListener('click', (e) => {
            e.preventDefault();
            loadCourtToForm(null);
            document.querySelector('.bottom-grid-layout')?.scrollIntoView({ behavior: 'smooth' });
        });
    }

    // --- 8. NÚT LƯU SÂN (CẬP NHẬT HOẶC THÊM MỚI VÀO BẢNG) ---
    if (btnSave) {
        btnSave.addEventListener('click', (e) => {
            e.preventDefault();

            const newId = formInputs.id ? formInputs.id.value.trim() : '';
            const name = formInputs.name ? formInputs.name.value.trim() : '';

            if (!newId || !name) {
                alert('Vui lòng nhập đầy đủ Mã sân và Tên sân!');
                return;
            }

            const courtData = {
                id: newId,
                name: name,
                sport: formInputs.sport ? formInputs.sport.value.trim() : 'Pickleball',
                type: formInputs.type ? formInputs.type.value.trim() : 'Ngoài trời',
                price: formInputs.price ? formInputs.price.value.trim() : '180.000đ',
                status: formInputs.status ? formInputs.status.value : 'Đang hoạt động',
                utilities: formInputs.utilities ? formInputs.utilities.value.trim() : '',
                desc: formInputs.desc ? formInputs.desc.value.trim() : ''
            };

            if (state.editingCourtId) {
                // Trường hợp đang sửa sân: Cập nhật thông tin vào vị trí cũ (cho phép đổi cả mã sân)
                const index = state.courts.findIndex(c => c.id === state.editingCourtId);
                if (index !== -1) {
                    // Nếu đổi mã sân sang mã mới, cần kiểm tra xem mã mới đã bị trùng chưa
                    if (newId !== state.editingCourtId && state.courts.some(c => c.id === newId)) {
                        alert(`Mã sân ${newId} đã tồn tại trong hệ thống. Vui lòng nhập mã khác!`);
                        return;
                    }
                    state.courts[index] = courtData;
                    state.editingCourtId = newId; // Cập nhật lại ID đang chỉnh sửa
                    alert(`Đã cập nhật thành công thông tin sân ${newId}!`);
                }
            } else {
                // Trường hợp thêm sân mới: Kiểm tra trùng mã sân
                const existing = state.courts.find(c => c.id === newId);
                if (existing) {
                    alert(`Mã sân ${newId} đã tồn tại trong hệ thống. Vui lòng nhập mã khác!`);
                    return;
                }
                state.courts.unshift(courtData);
                state.editingCourtId = newId;
                alert(`Đã thêm sân mới ${newId} thành công!`);
            }

            renderTable();
            if (formInputs.id) formInputs.id.disabled = false;
        });
    }

    // --- 9. NÚT HỦY CHỈNH SỬA ---
    if (btnCancel) {
        btnCancel.addEventListener('click', (e) => {
            e.preventDefault();
            if (state.editingCourtId) {
                const court = state.courts.find(c => c.id === state.editingCourtId);
                loadCourtToForm(court);
            } else {
                loadCourtToForm(null);
            }
            if (formInputs.id) formInputs.id.disabled = false;
            alert('Đã hủy chỉnh sửa. Thông tin giữ nguyên.');
        });
    }

    // --- 10. LƯU TRỮ TẠI KHỐI BẢO TRÌ ---
    if (btnArchiveMaintenance) {
        btnArchiveMaintenance.addEventListener('click', (e) => {
            const targetId = btnArchiveMaintenance.getAttribute('data-target-id') || 'P05';
            const court = state.courts.find(c => c.id === targetId);

            if (court) {
                court.status = 'Đã lưu trữ';
                alert(`Đã chuyển sân ${court.id} (${court.name}) sang trạng thái Đã lưu trữ thành công!`);
                renderTable();
                loadCourtToForm(court);
            } else {
                alert(`Không tìm thấy thông tin sân ${targetId}!`);
            }
        });
    }

    // --- 11. TÌM KIẾM & LỌC THEO TRẠNG THÁI (THANH BỘ LỌC PHÍA TRÊN & TAB TRẠNG THÁI) ---
    
    // Xử lý bộ lọc từ ô chọn trạng thái trên thanh tìm kiếm
    if (filterStatusSelect) {
        filterStatusSelect.addEventListener('change', (e) => {
            const val = e.target.value; // 'all', 'active', 'maintenance', 'archived'
            state.currentFilter.status = val;
            
            // Đồng bộ trạng thái với các tab phía dưới
            statusTabs.forEach(t => t.classList.remove('active'));
            if (val === 'all' && statusTabs[0]) statusTabs[0].classList.add('active');
            if (val === 'active' && statusTabs[1]) statusTabs[1].classList.add('active');
            if (val === 'maintenance' && statusTabs[2]) statusTabs[2].classList.add('active');
            if (val === 'archived' && statusTabs[3]) statusTabs[3].classList.add('active');

            renderTable();
        });
    }

    // Xử lý nút Tìm kiếm
    if (btnSearch) {
        btnSearch.addEventListener('click', () => {
            if (searchInput) state.currentFilter.keyword = searchInput.value.trim();
            renderTable();
        });
    }

    if (searchInput) {
        searchInput.addEventListener('keyup', (e) => {
            state.currentFilter.keyword = e.target.value.trim();
            renderTable();
        });
    }

    // Xử lý click chọn các tab trạng thái
    statusTabs.forEach((tab, index) => {
        tab.addEventListener('click', () => {
            statusTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            if (index === 0) {
                state.currentFilter.status = 'all';
                if (filterStatusSelect) filterStatusSelect.value = 'all';
            } else if (index === 1) {
                state.currentFilter.status = 'active';
                if (filterStatusSelect) filterStatusSelect.value = 'active';
            } else if (index === 2) {
                state.currentFilter.status = 'maintenance';
                if (filterStatusSelect) filterStatusSelect.value = 'maintenance';
            } else if (index === 3) {
                state.currentFilter.status = 'archived';
                if (filterStatusSelect) filterStatusSelect.value = 'archived';
            }

            renderTable();
        });
    });

    function updateTabCounts() {
        const total = state.courts.length;
        const active = state.courts.filter(c => c.status === 'Đang hoạt động').length;
        const maintenance = state.courts.filter(c => c.status === 'Bảo trì').length;
        const archived = state.courts.filter(c => c.status === 'Đã lưu trữ').length;

        if (statusTabs[0]) statusTabs[0].textContent = `Tất cả · ${total}`;
        if (statusTabs[1]) statusTabs[1].textContent = `Đang hoạt động · ${active}`;
        if (statusTabs[2]) statusTabs[2].textContent = `Bảo trì · ${maintenance}`;
        if (statusTabs[3]) statusTabs[3].textContent = `Đã lưu trữ · ${archived}`;
    }

    // Khởi chạy đồng bộ lần đầu
    const initialCourt = state.courts.find(c => c.id === state.editingCourtId);
    if (initialCourt) loadCourtToForm(initialCourt);
    renderTable();
});