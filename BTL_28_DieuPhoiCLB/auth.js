(() => {
    const USERS_KEY = "courtconnect.demoUsers";
    const SESSION_KEY = "courtconnect.session";
    const ROUTES = {
        "nguoi-choi": "../VuDuyen/index.html",
        "chu-san": "../BaiTapLon_28/chusan_tongquan.html",
        "dieu-phoi-clb": "DieuPhoiCLB/index1.html",
        "quan-tri-vien": "quantrivien.html"
    };
    const DEMO_ACCOUNTS = [
        { name: "Minh Anh", email: "nguoi-choi@courtconnect.demo", password: "Player123", role: "nguoi-choi" },
        { name: "Tây Hồ Sports", email: "chu-san@courtconnect.demo", password: "Owner123", role: "chu-san" },
        { name: "Thu Hương", email: "dieu-phoi@courtconnect.demo", password: "Coord123", role: "dieu-phoi-clb" },
        { name: "Hải Nam", email: "admin@courtconnect.demo", password: "Admin123", role: "quan-tri-vien" }
    ];

    function readRegisteredUsers() {
        const storedUsers = localStorage.getItem(USERS_KEY);
        if (!storedUsers) {
            return [];
        }

        const users = JSON.parse(storedUsers);
        if (!Array.isArray(users)) {
            throw new Error("Danh sách tài khoản demo không hợp lệ trong bộ nhớ trình duyệt.");
        }
        return users;
    }

    function navigateAs(user) {
        const session = { name: user.name, email: user.email, role: user.role };
        sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
        window.location.assign(ROUTES[user.role]);
    }

    function login(email, password) {
        const user = [...DEMO_ACCOUNTS, ...readRegisteredUsers()].find((account) =>
            account.email.toLowerCase() === email.trim().toLowerCase() &&
            account.password === password
        );
        if (!user) {
            return false;
        }

        navigateAs(user);
        return true;
    }

    function register(user) {
        if (!ROUTES[user.role] || user.role === "quan-tri-vien") {
            throw new Error("Vai trò này chỉ được cấp bởi quản trị viên.");
        }

        const users = readRegisteredUsers();
        const email = user.email.trim().toLowerCase();
        const emailDaTonTai = [...DEMO_ACCOUNTS, ...users].some((account) =>
            account.email.toLowerCase() === email
        );
        if (emailDaTonTai) {
            throw new Error("Email đã được dùng. Hãy đăng nhập hoặc nhập email khác.");
        }

        const taiKhoan = { ...user, email };
        users.push(taiKhoan);
        localStorage.setItem(USERS_KEY, JSON.stringify(users));
        navigateAs(taiKhoan);
    }

    window.CourtConnectAuth = {
        demoAccounts: DEMO_ACCOUNTS.map(({ name, email, password, role }) => ({ name, email, password, role })),
        login,
        register
    };
})();
