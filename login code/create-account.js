const form =
    document.getElementById("create-account-form");

const message =
    document.getElementById("create-account-message");

const button =
    document.getElementById("create-account-button");


const CREATE_ACCOUNT_URL =
    "https://butfmjiweebysxnebauh.supabase.co/functions/v1/create-account";


// =========================
// KEY
// =========================

const key =
    sessionStorage.getItem(
        "psc-create-account-key"
    ) || "";


// Nếu không có Key
if (!key) {

    message.textContent =
        "Không có Key. Vui lòng quay lại Login.";

    message.classList.add("error");

    button.disabled = true;

}


// =========================
// TẠO TÀI KHOẢN
// =========================

form.addEventListener("submit", async (event) => {

    event.preventDefault();


    if (!key) {

        message.textContent =
            "Không có Key. Vui lòng quay lại Login.";

        message.className = "message error";

        return;

    }


    const username =
        document
            .getElementById("username")
            .value
            .trim();


    const password =
        document
            .getElementById("password")
            .value;


    const confirmPassword =
        document
            .getElementById("confirm-password")
            .value;


    message.textContent = "";
    message.className = "message";


    // =========================
    // KIỂM TRA THÔNG TIN
    // =========================

    if (!username || !password || !confirmPassword) {

        message.textContent =
            "Vui lòng nhập đầy đủ thông tin.";

        message.classList.add("error");

        return;

    }


    if (password !== confirmPassword) {

        message.textContent =
            "Mật khẩu nhập lại không khớp.";

        message.classList.add("error");

        return;

    }


    if (username.length < 3) {

        message.textContent =
            "Username phải có ít nhất 3 ký tự.";

        message.classList.add("error");

        return;

    }


    if (password.length < 6) {

        message.textContent =
            "Mật khẩu phải có ít nhất 6 ký tự.";

        message.classList.add("error");

        return;

    }


    // =========================
    // TẠO TÀI KHOẢN
    // =========================

    button.disabled = true;

    button.textContent =
        "Đang tạo tài khoản...";


    try {

        const response =
            await fetch(
                CREATE_ACCOUNT_URL,
                {

                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({

                        key,
                        username,
                        password

                    })

                }
            );


        const data =
            await response.json();


        if (!response.ok) {

            throw new Error(
                data.error ||
                "Không thể tạo tài khoản."
            );

        }


        // =========================
        // THÀNH CÔNG
        // =========================

        message.textContent =
            "Tạo tài khoản thành công! Đang chuyển đến đăng nhập...";

        message.classList.add("success");


        // Xóa Key sau khi dùng
        sessionStorage.removeItem(
            "psc-create-account-key"
        );


        form.reset();


        setTimeout(() => {

            window.location.href =
                "../login.html";

        }, 1200);


    } catch (error) {

        console.error(error);


        message.textContent =
            error.message ||
            "Có lỗi xảy ra. Vui lòng thử lại.";

        message.classList.add("error");


    } finally {

        button.disabled = false;

        button.textContent =
            "Tạo tài khoản";

    }

});