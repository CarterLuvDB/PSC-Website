const form =
    document.getElementById(
        "create-account-form"
    );

const message =
    document.getElementById(
        "create-account-message"
    );

const button =
    document.getElementById(
        "create-account-button"
    );


const CREATE_ACCOUNT_URL =
    "https://butfmjiweebysxnebauh.supabase.co/functions/v1/create-account";


// =========================
// KEY
// =========================

const key =
    sessionStorage.getItem(
        "psc-create-account-key"
    ) || "";


// =========================
// CHECK KEY
// =========================

if (!key) {
    button.disabled = true;
}


// =========================
// SHOW / HIDE PASSWORD
// =========================

const passwordToggles =
    document.querySelectorAll(
        ".password-toggle"
    );


passwordToggles.forEach(
    (toggle) => {

        toggle.addEventListener(
            "click",
            () => {

                const targetId =
                    toggle.dataset.target;

                const input =
                    document.getElementById(
                        targetId
                    );

                const icon =
                    toggle.querySelector("img");

                if (!input || !icon) {
                    return;
                }


                if (
                    input.type === "password"
                ) {

                    // Hiện mật khẩu
                    input.type = "text";

                    icon.src =
                        "../images/icon/view.png";

                    icon.alt =
                        "Ẩn mật khẩu";

                    toggle.setAttribute(
                        "aria-label",
                        "Ẩn mật khẩu"
                    );

                } else {

                    // Ẩn mật khẩu
                    input.type = "password";

                    icon.src =
                        "../images/icon/hide.png";

                    icon.alt =
                        "Hiện mật khẩu";

                    toggle.setAttribute(
                        "aria-label",
                        "Hiện mật khẩu"
                    );

                }

            }
        );

    }
);
// =========================
// TẠO TÀI KHOẢN
// =========================

form.addEventListener(
    "submit",
    async (event) => {

        event.preventDefault();


        if (!key) {

            message.textContent =
                "Không có Key. Vui lòng quay lại Login.";

            message.className =
                "message error";

            return;

        }


        const username =
            document
                .getElementById(
                    "username"
                )
                .value
                .trim();


        const password =
            document.getElementById(
                "password"
            ).value;


        const confirmPassword =
            document.getElementById(
                "confirm-password"
            ).value;


        const fullName =
            document
                .getElementById(
                    "full-name"
                )
                .value
                .trim();


        const genderInput =
            document.querySelector(
                'input[name="gender"]:checked'
            );


        const gender =
            genderInput
                ? genderInput.value
                : "";


        const dateOfBirth =
            document.getElementById(
                "date-of-birth"
            ).value;


        message.textContent = "";

        message.className =
            "message";


        // =========================
        // VALIDATION
        // =========================

        if (
            !username ||
            !password ||
            !confirmPassword ||
            !fullName ||
            !gender ||
            !dateOfBirth
        ) {

            message.textContent =
                "Vui lòng nhập đầy đủ thông tin.";

            message.classList.add(
                "error"
            );

            return;

        }


        if (
            !/^[A-Za-z0-9._-]{3,30}$/.test(
                username
            )
        ) {

            message.textContent =
                "Username chỉ được dùng chữ, số, dấu chấm, gạch dưới hoặc gạch ngang; dài 3-30 ký tự.";

            message.classList.add(
                "error"
            );

            return;

        }


        if (
            password.length < 6
        ) {

            message.textContent =
                "Mật khẩu phải có ít nhất 6 ký tự.";

            message.classList.add(
                "error"
            );

            return;

        }


        if (
            password !==
            confirmPassword
        ) {

            message.textContent =
                "Mật khẩu nhập lại không khớp.";

            message.classList.add(
                "error"
            );

            return;

        }


        // =========================
        // SUBMIT
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

                        body:
                            JSON.stringify({

                                key,

                                username,

                                password,

                                full_name:
                                    fullName,

                                gender,

                                date_of_birth:
                                    dateOfBirth

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


            message.textContent =
                "Tạo tài khoản thành công! Đang chuyển đến đăng nhập...";

            message.classList.add(
                "success"
            );


            sessionStorage.removeItem(
                "psc-create-account-key"
            );


            form.reset();


            setTimeout(
                () => {

                    window.location.href =
                        "../login.html";

                },
                1200
            );


        } catch (error) {

            console.error(
                error
            );


            message.textContent =
                error.message ||
                "Có lỗi xảy ra. Vui lòng thử lại.";

            message.classList.add(
                "error"
            );


        } finally {

            button.disabled = false;

            button.textContent =
                "Tạo tài khoản";

        }

    }
);