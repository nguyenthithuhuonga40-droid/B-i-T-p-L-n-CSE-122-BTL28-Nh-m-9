document.addEventListener('DOMContentLoaded', () => {
    const cacNhan = document.querySelectorAll('.nhan');
    cacNhan.forEach(nhan => {
        nhan.addEventListener('click', () => {
            cacNhan.forEach(n => n.classList.remove('active'));
            nhan.classList.add('active');
        });
    });
});