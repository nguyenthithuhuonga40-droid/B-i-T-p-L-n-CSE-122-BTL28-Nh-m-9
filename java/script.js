document.addEventListener("DOMContentLoaded", () => {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const year = today.getFullYear();
    const formattedDate = `${day}/${month}/${year}`;
    const daysOfWeek = ["Chủ nhật", "Thứ hai", "Thứ ba", "Thứ tư", "Thứ năm", "Thứ sáu", "Thứ bảy"];
    const currentDayOfWeek = daysOfWeek[today.getDay()];
    const eventSubtitle = document.querySelector(".title-group p");
    if (eventSubtitle) {
        eventSubtitle.textContent = `Sự kiện EV-1010 • ${currentDayOfWeek} ${formattedDate} • CLB Nhịp Sân`;
    }
    const scheduleInput = document.querySelector('input[value*="18:00–20:00"]');
    if (scheduleInput) {
        scheduleInput.value = `${formattedDate} - 18:00–20:00`;
    }
    const btnViewTeam = document.getElementById("btnViewTeam");
    if (btnViewTeam) {
        btnViewTeam.addEventListener("click", () => {
            const members = [
                "Lan Phương (3.5)", 
                "Đức Huy (3.0)", 
                "Thu Hà (3.0)", 
                "Quốc Bảo (3.5)", 
                "Mai Linh (3.0)", 
                "Hoàng Long (3.5)", 
                "Ngọc Mai (3.0)", 
                "Tuấn Anh (3.5)"
            ];
            const court1Match1 = `${members[0]} & ${members[1]} đấu với ${members[2]} & ${members[3]}`;
            const court2Match1 = `${members[4]} & ${members[5]} đấu với ${members[6]} & ${members[7]}`;
            alert(
                "SƠ ĐỒ ĐỘI HÌNH & PHÂN CẶP THI ĐẤU (Sự kiện EV-1010)\n\n" +
                "📍 Sân P03 (Tây Hồ Sports):\n- Trận 1: " + court1Match1 + "\n\n" +
                "📍 Sân P04 (Tây Hồ Sports):\n- Trận 1: " + court2Match1 + "\n\n" +
                "(Lưu ý: Các cặp sẽ xoay vòng đổi cặp sau mỗi ván 11 điểm theo luật CLB)."
            );
        });
    }
    const btnSave = document.getElementById("btnSave");
    if (btnSave) {
        btnSave.addEventListener("click", () => {
            alert("Đã lưu thay đổi sự kiện thành công!");
        });
    }

    const btnDraft = document.getElementById("btnDraft");
    if (btnDraft) {
        btnDraft.addEventListener("click", () => {
            alert("Đã lưu nháp sự kiện mới!");
        });
    }

    const btnPublish = document.getElementById("btnPublish");
    if (btnPublish) {
        btnPublish.addEventListener("click", () => {
            alert("Sự kiện đã được chuyển sang trạng thái sẵn sàng công bố.");
        });
    }

    const btnCancelEvent = document.getElementById("btnCancelEvent");
    if (btnCancelEvent) {
        btnCancelEvent.addEventListener("click", () => {
            const confirmBox = confirm("Bạn có chắc chắn muốn hủy sự kiện này không?");
            if (confirmBox) {
                alert("Sự kiện đã bị hủy.");
            }
        });
    }

    const btnConfirmPublish = document.getElementById("btnConfirmPublish");
    if (btnConfirmPublish) {
        btnConfirmPublish.addEventListener("click", () => {
            alert("Đã gửi thông báo cho thành viên CLB và mở đăng ký thành công!");
        });
    }

    const btnConfirmCancel = document.getElementById("btnConfirmCancel");
    if (btnConfirmCancel) {
        btnConfirmCancel.addEventListener("click", () => {
            const reason = document.getElementById("cancelReason").value;
            alert(`Đã hủy sự kiện với lý do: "${reason}". Đã thông báo cho 8 người đăng ký.`);
        });
    }
    const btnKeepEvent = document.getElementById("btnKeepEvent");
    if (btnKeepEvent) {
        btnKeepEvent.addEventListener("click", () => {
            alert("Đã giữ lại sự kiện. Sự kiện tiếp tục diễn ra bình thường!");
        });
    }
    const btnEditAgain = document.getElementById("btnEditAgain");
    if (btnEditAgain) {
        btnEditAgain.addEventListener("click", () => {
            alert("Đã chuyển về chế độ chỉnh sửa thông tin sự kiện.");
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
});