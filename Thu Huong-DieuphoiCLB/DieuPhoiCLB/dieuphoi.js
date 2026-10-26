document.addEventListener("click", (event) => {
    if (!(event.target instanceof Element)) return;

    const link = event.target.closest("a[href]");
    if (!link || event.defaultPrevented || event.button !== 0 ||
        event.metaKey || event.ctrlKey || event.shiftKey || event.altKey ||
        link.target || link.hasAttribute("download")) {
        return;
    }

    const destination = new URL(link.href, window.location.href);
    if (destination.origin !== window.location.origin ||
        destination.pathname === window.location.pathname ||
        !destination.pathname.toLowerCase().endsWith(".html")) {
        return;
    }

    event.preventDefault();
    dieuPhoiChuyenTrang(destination.href);
});

function dieuPhoiChuyenTrang(trang, thamSo = {}) {
    const destination = new URL(trang, window.location.href);
    if (destination.origin !== window.location.origin) {
        throw new Error("Chỉ hỗ trợ chuyển trang trong CourtConnect.");
    }

    Object.entries(thamSo).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
            destination.searchParams.set(key, String(value));
        }
    });

    if (document.body.classList.contains("page-leaving")) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        window.location.assign(destination.href);
        return;
    }

    document.body.classList.add("page-leaving");
    window.setTimeout(() => window.location.assign(destination.href), 160);
}

window.dieuPhoiChuyenTrang = dieuPhoiChuyenTrang;
