const images = document.querySelectorAll(".ad-image");
const tabs = document.querySelectorAll(".ad-tab");

let currentIndex = 0;
let autoSlide;

function showAd(index) {
    images.forEach(img => img.classList.remove("active"));
    tabs.forEach(tab => tab.classList.remove("active"));

    if (images[index] && tabs[index]) {
        images[index].classList.add("active");
        tabs[index].classList.add("active");
    }

    currentIndex = index;
}

function startAutoSlide() {
    clearInterval(autoSlide);

    if (images.length <= 1) return;

    autoSlide = setInterval(() => {
        let nextIndex = currentIndex + 1;

        if (nextIndex >= images.length) {
            nextIndex = 0;
        }

        showAd(nextIndex);
    }, 6000);
}

tabs.forEach((tab, index) => {
    tab.addEventListener("mouseenter", () => {
        showAd(index);
        startAutoSlide();
    });
});

startAutoSlide();

const passwordInput = document.getElementById("password");
const showPasswordButton = document.getElementById("show-password");

if (passwordInput && showPasswordButton) {
    const eyeIcon = showPasswordButton.querySelector("img");

    showPasswordButton.addEventListener("click", () => {
        if (passwordInput.type === "password") {
            passwordInput.type = "text";
            eyeIcon.src = "images/icon/hide.png";
            eyeIcon.alt = "Ẩn mật khẩu";
        } else {
            passwordInput.type = "password";
            eyeIcon.src = "images/icon/view.png";
            eyeIcon.alt = "Hiện mật khẩu";
        }
    });
}

const SUPABASE_URL = "https://butfmjiweebysxnebauh.supabase.co";
const SUPABASE_KEY = "sb_publishable_GlYqr6HhT8s_JJfNCpt15w_gpe2Yg6O";

const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);

const loginButton = document.querySelector(".login-button");
const usernameInput = document.getElementById("username");

if (loginButton) {
    loginButton.addEventListener("click", async () => {
        const rawUsername = usernameInput.value.trim();
        const password = passwordInput.value;

        if (rawUsername.toLowerCase().startsWith("key=")) {
            const key = rawUsername.slice(4).trim();

            if (!/^[A-Za-z0-9]{6}$/.test(key)) {
                alert("Key phải gồm đúng 6 ký tự chữ và số.");
                return;
            }

            loginButton.disabled = true;
            loginButton.textContent = "Đang kiểm tra Key...";

            try {
                const response = await fetch(
                    "https://butfmjiweebysxnebauh.supabase.co/functions/v1/check-key",
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            "apikey": SUPABASE_KEY
                        },
                        body: JSON.stringify({ key })
                    }
                );

                const data = await response.json();

                if (!response.ok || !data.valid) {
                    alert("Key không hợp lệ hoặc đã được sử dụng.");
                    return;
                }

                sessionStorage.setItem(
                    "psc-create-account-key",
                    key
                );

                window.location.href =
                    "login code/create-account.html";

                return;

            } catch (error) {
                console.error(error);
                alert("Không thể kiểm tra Key. Vui lòng thử lại.");
                return;

            } finally {
                loginButton.disabled = false;
                loginButton.textContent = "Đăng nhập";
            }
        }

        const username = rawUsername.toLowerCase();

        if (!username || !password) {
            alert("Vui lòng nhập Username và mật khẩu.");
            return;
        }

        loginButton.disabled = true;
        loginButton.textContent = "Đang đăng nhập...";

        try {
            const { data, error } =
                await supabaseClient.auth.signInWithPassword({
                    email: `${username}@accounts.psc.example.com`,
                    password
                });

            if (error) {
                console.error(error);
                throw new Error(
                    "Username hoặc mật khẩu không đúng."
                );
            }

            console.log("Đăng nhập thành công:", data.user);

            window.location.href = "index.html";

        } catch (error) {
            console.error(error);
            alert(error.message);

        } finally {
            loginButton.disabled = false;
            loginButton.textContent = "Đăng nhập";
        }
    });
}