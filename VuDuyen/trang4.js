// --- 1. ĐỒNG BỘ THỜI GIAN THEO THIẾT BỊ ---
function layDinhDangNgayThietBi() {
    const homNay = new Date();
    const ngay = String(homNay.getDate()).padStart(2, '0');
    const thang = String(homNay.getMonth() + 1).padStart(2, '0');
    const nam = homNay.getFullYear();
    const ngayMai = new Date(homNay);
    ngayMai.setDate(homNay.getDate() + 1);
    return {
        chuoiBoLoc: `${ngay}-${String(ngayMai.getDate()).padStart(2, '0')}/${thang}/${nam}`,
        chuoiNgayHomNay: `${ngay}/${thang}`,
        chuoiNgayMai: `${String(ngayMai.getDate()).padStart(2, '0')}/${String(ngayMai.getMonth() + 1).padStart(2, '0')}`
    };
}
const thoiGianThietBi = layDinhDangNgayThietBi();
document.getElementById('bo-loc-ngay').value = thoiGianThietBi.chuoiBoLoc;
document.getElementById('ai-lich-ranh').innerText = `${thoiGianThietBi.chuoiNgayHomNay} - 18:00-20:00`;

// --- 2. CƠ SỞ DỮ LIỆU JSON GIẢ LẬP ---
let CHUOI_JSON_GOC = JSON.stringify([
    { "id": "1", "tenTran": "Đôi vui cuối tuần", "trinhDo": "3.0 - 3.5", "ngayThang": thoiGianThietBi.chuoiNgayHomNay, "gioGiac": "18:00 - 20:00", "diaDiem": "Tây Hồ Sports - Sân P02", "chiPhi": "90.000đ / người", "choTrong": "Còn trống 1 chỗ", "tiLeGhepHop": "3/4 người" },
    { "id": "2", "tenTran": "Rally tối thứ bảy", "trinhDo": "3.0 - 3.5", "ngayThang": thoiGianThietBi.chuoiNgayHomNay, "gioGiac": "19:00 - 21:00", "diaDiem": "Long Biên Pickle Hub - Sân P02", "chiPhi": "80.000đ / người", "choTrong": "Còn trống 2 chỗ", "tiLeGhepHop": "2/4 người" },
    { "id": "3", "tenTran": "Sáng chủ nhật nhẹ nhàng", "trinhDo": "2.0 - 2.5", "ngayThang": thoiGianThietBi.chuoiNgayMai, "gioGiac": "08:00 - 10:00", "diaDiem": "Long Biên Pickle Hub - Sân P01", "chiPhi": "80.000đ / người", "choTrong": "Còn trống 2 chỗ", "tiLeGhepHop": "2/4 người" }
]);

// --- 3. HÀM FETCH GIẢ LẬP ---
const DUONG_DAN_MOCK_API = "https://courtconnect.vn";
window.fetch = function(url, options = {}) {
    return new Promise((resolve) => {
        setTimeout(() => {
            let danhSachHienTai = JSON.parse(CHUOI_JSON_GOC);
            if (options.method === 'POST') {
                const duLieuNhanDuoc = JSON.parse(options.body);
                const tranMoi = { "id": String(danhSachHienTai.length + 1), ...duLieuNhanDuoc };
                danhSachHienTai.push(tranMoi); // .push giúp đẩy xuống cuối hàng cùng với các trận cũ
                CHUOI_JSON_GOC = JSON.stringify(danhSachHienTai);
                resolve(new Response(JSON.stringify(tranMoi), { status: 201 }));
            } else if (url.includes(`${DUONG_DAN_MOCK_API}/`)) {
                const idCanTim = url.split('/').pop();
                resolve(new Response(JSON.stringify(danhSachHienTai.find(t => t.id === idCanTim)), { status: 200 }));
            } else {
                resolve(new Response(CHUOI_JSON_GOC, { status: 200 }));
            }
        }, 200);
    });
};

// --- 4. ĐỔ DỮ LIỆU RA GIAO DIỆN ---
const vungDanhSachTran = document.getElementById('vung-danh-sach-tran');
const hopThoaiModal = document.getElementById('hop-thoai-chi-tiet');

async function khoiDongUngDung() {
    const phanHoi = await fetch(DUONG_DAN_MOCK_API);
    const danhSachTranDau = await phanHoi.json();
    vungDanhSachTran.innerHTML = "";
    danhSachTranDau.forEach(tran => {
        const theHienThi = document.createElement('div');
        theHienThi.className = "the-tran";
        theHienThi.innerHTML = `
            <span class="trang-thai-nhan">Đang mở</span>
            <span class="cho-trong-text">${tran.tiLeGhepHop} - ${tran.choTrong}</span>
            <h3 class="ten-tran-dau">${tran.tenTran}</h3>
            <p class="thong-tin-phu-tran">Pickleball • ${tran.trinhDo}</p>
            <p class="chi-tiet-hang">🕒 ${tran.ngayThang} - ${tran.gioGiac}</p>
            <p class="chi-tiet-hang">📍 ${tran.diaDiem}</p>
            <p class="gia-tien">${tran.chiPhi}</p>
            <button class="nut-bam nut-xem-tran" onclick="moChiTietTran('${tran.id}')">Xem trận</button>
        `;
        vungDanhSachTran.appendChild(theHienThi);
    });
    if(danhSachTranDau.length > 0) {
        document.getElementById('ai-ten-tran').innerText = danhSachTranDau[0].tenTran;
        document.getElementById('ai-gio-tran').innerText = `🕒 Cùng giờ rảnh ${danhSachTranDau[0].ngayThang} (${danhSachTranDau[0].gioGiac})`;
    }
}

window.moChiTietTran = async function(idTran) {
    const phanHoi = await fetch(`${DUONG_DAN_MOCK_API}/${idTran}`);
    const thongTinTran = await phanHoi.json();
    document.getElementById('modal-ten-tran').innerText = thongTinTran.tenTran;
    document.getElementById('modal-trinh-do').innerText = thongTinTran.trinhDo;
    document.getElementById('modal-thoi-gian').innerText = `${thongTinTran.ngayThang} từ ${thongTinTran.gioGiac}`;
    document.getElementById('modal-dia-diem').innerText = thongTinTran.diaDiem;
    document.getElementById('modal-chi-phi').innerText = thongTinTran.chiPhi;
    document.getElementById('modal-so-cho').innerText = `${thongTinTran.choTrong} (${thongTinTran.tiLeGhepHop})`;
    hopThoaiModal.style.display = "flex";
};

document.getElementById('nut-dong-modal').addEventListener('click', () => { hopThoaiModal.style.display = "none"; });

// --- 5. ĐÓNG MỞ POP-UP TẠO TRẬN ---
const hopThoaiTaoTran = document.getElementById('hop-thoai-tao-tran');
const formThongTinTaoTran = document.getElementById('form-thong-tin-tao-tran');

function moModalTaoTran() { if (hopThoaiTaoTran) hopThoaiTaoTran.style.display = 'flex'; }
function dongModalTaoTran() { if (hopThoaiTaoTran) hopThoaiTaoTran.style.display = 'none'; }

document.getElementById('nut-kich-hoat-tao-1')?.addEventListener('click', moModalTaoTran);
document.getElementById('nut-kich-hoat-tao-2')?.addEventListener('click', moModalTaoTran);
document.getElementById('nut-dong-modal-tao')?.addEventListener('click', dongModalTaoTran);
document.getElementById('nut-huy-tao-tran')?.addEventListener('click', dongModalTaoTran);

window.addEventListener('click', (suKien) => {
    if (suKien.target === hopThoaiModal) hopThoaiModal.style.display = "none";
    if (suKien.target === hopThoaiTaoTran) dongModalTaoTran();
});
    
const nutGuiYeuCau = document.getElementById('nut-gui-yeu-cau');

if (nutGuiYeuCau) {
    nutGuiYeuCau.addEventListener('click', function() {
        // Lấy tên trận đấu đang hiển thị trên hộp thoại để đưa vào thông báo
        const tenTranHienTai = document.getElementById('modal-ten-tran').innerText;
        
        // Hiển thị thông báo xác nhận cho người dùng
        alert(`Yêu cầu tham gia trận "${tenTranHienTai}" đã được gửi đi thành công!`);
        
        // Thực hiện kích hoạt sự kiện click của nút đóng modal có sẵn để ẩn hộp thoại
        document.getElementById('nut-dong-modal').click();
    });
}


// --- 6. GỬI FORM TẠO TRẬN ---
if (formThongTinTaoTran) {
    formThongTinTaoTran.addEventListener('submit', async function(suKien) {
        suKien.preventDefault();
        const tenNguoiTao = document.getElementById('tao-ten').value;
        const soNguoiChoiYeuCau = parseInt(document.getElementById('tao-so-nguoi').value) || 4;
        const nguoiDiCung = document.getElementById('tao-nguoi-di-cung').value;
        const soLuongCoSan = nguoiDiCung ? (nguoiDiCung.split(',').length + 1) : 1;
        const choTrongConLai = soNguoiChoiYeuCau - soLuongCoSan > 0 ? soNguoiChoiYeuCau - soLuongCoSan : 1;

        const duLieuPost = {
            "tenTran": `Giao lưu cùng ${tenNguoiTao}`,
            "trinhDo": "3.0 - Trung cấp",
            "ngayThang": thoiGianThietBi.chuoiNgayHomNay,
            "gioGiac": "18:00 - 20:00",
            "diaDiem": "Tây Hồ Sports - Sân P01",
            "chiPhi": "90.000đ / người",
            "choTrong": `Còn trống ${choTrongConLai} chỗ`,
            "tiLeGhepHop": `${soLuongCoSan}/${soNguoiChoiYeuCau} người`
        };

        const phanHoi = await fetch(DUONG_DAN_MOCK_API, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(duLieuPost)
        });

        if (phanHoi.ok) {
            alert("Khởi tạo trận đấu thành công!");
            dongModalTaoTran();
            formThongTinTaoTran.reset();
            await khoiDongUngDung();
        }
    });
}
khoiDongUngDung();


