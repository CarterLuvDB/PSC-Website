const images = document.querySelectorAll(".ad-image");
const tabs = document.querySelectorAll(".ad-tab");

let currentIndex = 0;
let autoSlide;

// Hàm đổi ảnh
function showAd(index) {
    images.forEach(img => img.classList.remove("active"));
    tabs.forEach(tab => tab.classList.remove("active"));

    images[index].classList.add("active");
    tabs[index].classList.add("active");

    currentIndex = index;
}

// Tự động đổi ảnh
function startAutoSlide() {
    clearInterval(autoSlide);

    autoSlide = setInterval(() => {
        let nextIndex = currentIndex + 1;

        if (nextIndex >= images.length) {
            nextIndex = 0;
        }

        showAd(nextIndex);
    }, 6000);
}

// Rê chuột vào tab
tabs.forEach((tab, index) => {
    tab.addEventListener("mouseenter", () => {
        showAd(index);
        startAutoSlide();
    });
});

// Bắt đầu tự động
startAutoSlide();

const passwordInput = document.getElementById("password");
const showPasswordButton = document.getElementById("show-password");
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

const loginButton = document.querySelector(".login-button");

loginButton.addEventListener("click", () => {
    window.location.href = "index.html";
});