
function dinhDangNamThangNgay(doiTuongNgay) {
    const nam = doiTuongNgay.getFullYear();
    const thang = String(doiTuongNgay.getMonth() + 1).padStart(2, '0');
    const ngay = String(doiTuongNgay.getDate()).padStart(2, '0');
    return `${nam}-${thang}-${ngay}`;
}
const dateThietBi = new Date();

const chuoiHomNay = dinhDangNamThangNgay(dateThietBi); 

const dateNgayMai = new Date(dateThietBi);
dateNgayMai.setDate(dateThietBi.getDate() + 1);
const chuoiNgayMai = dinhDangNamThangNgay(dateNgayMai); 

const dateNgayKia = new Date(dateThietBi);
dateNgayKia.setDate(dateThietBi.getDate() + 2);
const chuoiNgayKia = dinhDangNamThangNgay(dateNgayKia); 

const khoDuLieuSan = [
    {
        idSân: 1,
        tênSân: "Tây Hồ Sports",
        mônThểThao: "pickleball",
        khuVực: "Tay Ho",
        môiTrường: "ngoai-troi",
        môTảChiTiết: "Ngoài trời • 4 sân Pickleball tiêu chuẩn quốc tế",
        giáThuê: "180.000đ / giờ",
        linkAnh: "../assets/tayhosport.webp",
        lichTrong: {
            [chuoiHomNay]: "16:00 - 20:00", 
            [chuoiNgayMai]: "08:00 - 12:00",
            [chuoiNgayKia]: "14:00 - 18:00" 
        }
    },
    {
        idSân: 2,
        tênSân: "Cầu Giấy Racket Club",
        mônThểThao: "cau-long",
        khuVực: "Cau Giay",
        môiTrường: "trong-nha",
        môTảChiTiết: "Trong nhà • 6 sân Cầu lông thảm chuyên dụng",
        giáThuê: "120.000đ / giờ",
        linkAnh: "../assets/caugiayclublub.jpg",
        lichTrong: {
            [chuoiHomNay]: "17:00 - 19:00",
            [chuoiNgayMai]: "18:00 - 21:00",
            [chuoiNgayKia]: "19:00 - 22:00"
        }
    },
    {
        idSân: 3,
        tênSân: "Long Biên Pickle Hub",
        mônThểThao: "pickleball",
        khuVực: "Long Bien",
        môiTrường: "ngoai-troi",
        môTảChiTiết: "Ngoài trời • 4 sân Pickleball chất lượng cao mới xây",
        giáThuê: "160.000đ / giờ",
        linkAnh: "../assets/longbien-club.webp",
        lichTrong: {
            [chuoiHomNay]: "16:00 - 18:00",
            [chuoiNgayMai]: "06:00 - 09:00",
            [chuoiNgayKia]: "15:00 - 17:00"
        }
    }
];

// Hàm lấy chuỗi hiển thị trạng thái giờ trống dựa theo ngày đang chọn trên lịch
function layTrangThaiTheoNgay(san) {
    const ngayDaChon = document.getElementById("ngayChoi").value; 
    
    let ngayHienThi = ngayDaChon;
    if (ngayDaChon) {
        const parts = ngayDaChon.split('-');
        if (parts.length === 3) {
            ngayHienThi = `${parts[2]}/${parts[1]}`; 
        }
    }

    if (san.lichTrong && san.lichTrong[ngayDaChon]) {
        return `Còn giờ trống ngày ${ngayHienThi} (${san.lichTrong[ngayDaChon]})`;
    }
    return `Hết giờ trống ngày ${ngayHienThi}`;
}

document.addEventListener("DOMContentLoaded", function () {
    const oNgayChoi = document.getElementById("ngayChoi");
    oNgayChoi.value = chuoiHomNay;
    
    // Hiển thị danh sách sân mặc định ban đầu
    hienThiDanhSachSan(khoDuLieuSan);
    
    // Khi đổi ngày trên lịch, tự động gọi bộ lọc để cập nhật lại khung giờ công suất công khai
    oNgayChoi.addEventListener('change', locSanTheThao);
});
const luoiDanhSachSan = document.getElementById('luoiDanhSachSan');
const soLuongKetQua = document.getElementById('soLuongKetQua');
const nutTimKiemChinh = document.getElementById('nutTimKiemChinh');
const nutApDungBoLoc = document.getElementById('nutApDungBoLoc');
const nutXoaBoLoc = document.getElementById('nutXoaBoLoc');
const hopThoaiXemSan = document.getElementById('hopThoaiXemSan');
const vungNoiDungChiTiet = document.getElementById('vungNoiDungChiTiet');
const nutDongHopThoai = document.getElementById('nutDongHopThoai');

function hienThiDanhSachSan(danhSachSauKhiLoc) {
    luoiDanhSachSan.innerHTML = '';
    soLuongKetQua.textContent = `${danhSachSauKhiLoc.length} địa điểm phù hợp`;
    
    if (danhSachSauKhiLoc.length === 0) {
        luoiDanhSachSan.innerHTML = `
            <div style="grid-column: 1/-1; text-align:center; color:#999; padding:50px 0;">
                <p>Không tìm thấy sân nào đúng yêu cầu tìm kiếm của bạn.</p>
            </div>`;
        return;
    }

    danhSachSauKhiLoc.forEach(san => {
        const theSan = document.createElement('div');
        theSan.className = 'the-thong-tin-san';
        
        const tenNhanTheThao = san.mônThểThao === 'pickleball' ? 'Pickleball' : 'Cầu lông';
        const lopNhanTheThao = san.mônThểThao === 'pickleball' ? 'loai-pickleball' : 'loai-cau-long';
        
        const trangThaiDong = layTrangThaiTheoNgay(san);
        
        theSan.innerHTML = `
            <img src="${san.linkAnh}" alt="${san.tênSân}">
            <div class="noi-dung-trong-the">
                <span class="nhan-mon-hoc ${lopNhanTheThao}">${tenNhanTheThao}</span>
                <h3 class="ten-san">${san.tênSân}</h3>
                <p class="mo-ta-san">
                    ${san.môTảChiTiết}<br>
                    <span class="ghichu">✓ ${trangThaiDong}</span>
                </p>
                <div class="day-duoi-the">
                    <span class="gia-tien-san">${san.giáThuê}</span>
                    <button class="nut-xem-san" onclick="xemChiTietSan(${san.idSân})">Xem sân</button>
                </div>
            </div>
        `;
        luoiDanhSachSan.appendChild(theSan);
    });
}

// Chức năng lọc thông tin sân theo bộ lọc
function locSanTheThao() {
    const monTheThaoDaChon = document.getElementById('chonMonTheThao').value;
    const khuVucDaChon = document.getElementById('chonKhuVuc').value;
    const coTichNgoaiTroi = document.getElementById('locNgoaiTroi').checked;
    const coTichTrongNha = document.getElementById('locTrongNha').checked;

    const mangKetQuaLoc = khoDuLieuSan.filter(san => {
        if (monTheThaoDaChon !== 'tat-ca' && san.mônThểThao !== monTheThaoDaChon) return false;
        if (khuVucDaChon !== 'tat-ca' && san.khuVực !== khuVucDaChon) return false;
        if (!coTichNgoaiTroi && san.môiTrường === 'ngoai-troi') return false;
        if (!coTichTrongNha && san.môiTrường === 'trong-nha') return false;
        return true;
    });

    hienThiDanhSachSan(mangKetQuaLoc);
}

// Bật Popup xem chi tiết sân
function xemChiTietSan(idDuocChon) {
    const thongTinSanCầnTìm = khoDuLieuSan.find(s => s.idSân === idDuocChon);
    if (!thongTinSanCầnTìm) return;

    const tenMoiTruongTiengViet = thongTinSanCầnTìm.môiTrường === 'ngoai-troi' ? 'Ngoài trời thoáng đãng' : 'Trong nhà có trần cao';
    const trangThaiDong = layTrangThaiTheoNgay(thongTinSanCầnTìm);

    vungNoiDungChiTiet.innerHTML = `
        <h2 style="color: #0d4633; margin: 0 0 15px 0; font-size:1.6rem;">${thongTinSanCầnTìm.tênSân}</h2>
        <img src="${thongTinSanCầnTìm.linkAnh}" alt="${thongTinSanCầnTìm.tênSân}" style="width:100%; height:220px; object-fit:cover; border-radius:8px; margin-bottom:15px; display:block;">
        <div style="background: #e8f5e9; padding: 12px; border-radius: 8px; color: #2e7d32; font-weight: 600; margin-bottom: 20px;">
            📍 Khu vực hoạt động: ${thongTinSanCầnTìm.tênSân} tại Hà Nội
        </div>
        <div style="margin-bottom: 25px;">
            <h4 style="margin:0 0 10px 0; color:#333;">Thông tin tùy chọn đặt sân:</h4>
            <ul style="padding-left:20px; margin:0; line-height: 1.8; color:#555;">
                <li><strong>Hình thức thiết kế:</strong> Sân thể thao ${tenMoiTruongTiengViet}</li>
                <li><strong>Khung thời gian trống:</strong> ${trangThaiDong}</li>
                <li><strong>Giá niêm yết:</strong> <span >${thongTinSanCầnTìm.giáThuê}</span></li>
            </ul>
        </div>
        <button onclick="xacNhanDatChoThanhCong('${thongTinSanCầnTìm.tênSân}')" style="width:100%; background:#0d4633; color:white; border:none; padding:14px; border-radius:8px; font-weight:bold; cursor:pointer; font-size:1rem;">
            Xác nhận lựa chọn sân này & Đặt lịch
        </button>
    `;
    
    hopThoaiXemSan.style.display = 'flex';
}

function xacNhanDatChoThanhCong(tenSanXacNhan) {
    alert(`[Hệ thống thông báo]\nBạn đã lựa chọn thành công địa điểm: ${tenSanXacNhan}.\nLịch hẹn của bạn đang được lưu lại vào hệ thống!`);
    hopThoaiXemSan.style.display = 'none';
}

// Chức năng làm mới bộ lọc và dọn sạch dấu tích
function lamMoiBoLocVeBanDau() {
    document.getElementById('chonMonTheThao').value = 'tat-ca';
    document.getElementById('chonKhuVuc').value = 'tat-ca';
    
    if(document.getElementById('locTrongNha')) document.getElementById('locTrongNha').checked = false;
    if(document.getElementById('locNgoaiTroi')) document.getElementById('locNgoaiTroi').checked = false;
    if(document.getElementById('locCoMaiChe')) document.getElementById('locCoMaiChe').checked = false;
    if(document.getElementById('locCoChoGuiXe')) document.getElementById('locCoChoGuiXe').checked = false;
    if(document.getElementById('locChoThueVot')) document.getElementById('locChoThueVot').checked = false;
    
    // Trả lịch chọn về ngày hôm nay động theo thiết bị
    document.getElementById("ngayChoi").value = chuoiHomNay;

    hienThiDanhSachSan(khoDuLieuSan);
}

// Lắng nghe hành vi bấm nút của người dùng
nutTimKiemChinh.addEventListener('click', locSanTheThao);
nutApDungBoLoc.addEventListener('click', locSanTheThao);
nutXoaBoLoc.addEventListener('click', lamMoiBoLocVeBanDau);
nutDongHopThoai.onclick = () => hopThoaiXemSan.style.display = 'none';

window.onclick = (suKien) => {
    if (suKien.target === hopThoaiXemSan) {
        hopThoaiXemSan.style.display = 'none';
    }
}