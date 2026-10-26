(() => {
    const script = document.currentScript;
    if (!(script instanceof HTMLScriptElement) || !script.src) {
        throw new Error("Không xác định được vị trí của điều hướng vai trò.");
    }

    const cssUrl = new URL("dieu-huong-vai-tro.css", script.src).href;
    const daNapCss = Array.from(document.querySelectorAll('link[rel="stylesheet"]'))
        .some((link) => link.href === cssUrl);
    if (!daNapCss) {
        const stylesheet = document.createElement("link");
        stylesheet.rel = "stylesheet";
        stylesheet.href = cssUrl;
        document.head.append(stylesheet);
    }

    const thanhVaiTro = document.createElement("nav");
    thanhVaiTro.className = "cc-thanh-quay-ve-vai-tro";
    thanhVaiTro.setAttribute("aria-label", "Điều hướng tài khoản");

    const lienKet = document.createElement("a");
    lienKet.href = new URL("chonvaitro.html", script.src).href;
    lienKet.textContent = "← Quay về chọn vai trò";

    thanhVaiTro.append(lienKet);
    document.body.append(thanhVaiTro);
})();
