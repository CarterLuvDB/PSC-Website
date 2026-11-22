// =========================
// PROFILE
// =========================

const supabaseUrl =
    "https://butfmjiweebysxnebauh.supabase.co";

const supabaseKey =
    "sb_publishable_GlYqr6HhT8s_JJfNCpt15w_gpe2Yg6O";

const profileSupabase =
    window.supabase.createClient(
        supabaseUrl,
        supabaseKey
    );


// =========================
// HELPERS
// =========================

function calculateAge(dateOfBirth) {

    if (!dateOfBirth) {
        return "—";
    }

    const birthDate =
        new Date(dateOfBirth);

    const today =
        new Date();

    let age =
        today.getFullYear() -
        birthDate.getFullYear();

    const monthDifference =
        today.getMonth() -
        birthDate.getMonth();

    if (
        monthDifference < 0 ||
        (
            monthDifference === 0 &&
            today.getDate() <
                birthDate.getDate()
        )
    ) {
        age--;
    }

    return age;
}


function formatDate(date) {

    if (!date) {
        return "—";
    }

    const parts =
        date.split("-");

    if (parts.length !== 3) {
        return date;
    }

    return `${parts[2]}/${parts[1]}/${parts[0]}`;
}


function escapeHtml(value) {

    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}


// =========================
// LOAD PROFILE
// =========================

async function loadProfile() {

    const {
        data: {
            session
        }
    } =
        await profileSupabase
            .auth
            .getSession();

    if (!session) {
        return;
    }

    const user =
        session.user;


    const {
        data: profile,
        error
    } =
        await profileSupabase
            .from("profiles")
            .select(`
                username,
                full_name,
                gen,
                gender,
                role,
                department,
                avatar_url,
                date_of_birth,
                joined_at,
                email,
                social,
                phone,
                emergency_contact,
                contact_note,
                bio
            `)
            .eq("id", user.id)
            .maybeSingle();


    if (error) {

        console.error(
            "PROFILE LOAD ERROR:",
            error
        );

        return;
    }


    if (!profile) {

        console.warn(
            "Không tìm thấy profile."
        );

        return;
    }


    // =========================
    // LEFT SIDE
    // =========================

    const profileName =
        document.getElementById(
            "profile-name"
        );

    const profileAvatar =
        document.getElementById(
            "profile-avatar-image"
        );

    const profileMeta =
        document.getElementById(
            "profile-meta"
        );

    const profileBioText =
        document.getElementById(
            "profile-bio-text"
        );


    if (profileName) {

        profileName.textContent =
            profile.full_name ||
            profile.username ||
            "Chưa có tên";
    }


    if (profileAvatar) {

        profileAvatar.src =
            profile.avatar_url ||
            "images/non-avatar.png";
    }


    if (profileMeta) {

        let meta =
            "Thành viên";

        if (profile.department) {

            meta +=
                ` · ${profile.department}`;
        }

        if (
            profile.role &&
            profile.role.toLowerCase() ===
                "admin"
        ) {

            meta +=
                " · Administrator";
        }

        profileMeta.textContent =
            meta;
    }


    if (profileBioText) {

        profileBioText.textContent =
            profile.bio ||
            "Chưa có bio.";
    }


    // =========================
    // PERSONAL INFORMATION
    // =========================

    const fullName =
        document.getElementById(
            "profile-full-name"
        );

    const dateOfBirth =
        document.getElementById(
            "profile-date-of-birth"
        );

    const age =
        document.getElementById(
            "profile-age"
        );

    const gender =
        document.getElementById(
            "profile-gender"
        );


    if (fullName) {

        fullName.textContent =
            profile.full_name ||
            "—";
    }


    if (dateOfBirth) {

        dateOfBirth.textContent =
            formatDate(
                profile.date_of_birth
            );
    }


    if (age) {

        age.textContent =
            calculateAge(
                profile.date_of_birth
            );
    }


    if (gender) {

        gender.textContent =
            profile.gender ||
            "—";
    }


    // =========================
    // PSC INFORMATION
    // =========================

    const gen =
        document.getElementById(
            "profile-gen"
        );

    const department =
        document.getElementById(
            "profile-department"
        );

    const role =
        document.getElementById(
            "profile-role"
        );

    const joinedDate =
        document.getElementById(
            "profile-joined-date"
        );


    if (gen) {

        gen.textContent =
            profile.gen ||
            "—";
    }


    if (department) {

        department.textContent =
            profile.department ||
            "—";
    }


    if (role) {

        role.textContent =
            profile.role ||
            "—";
    }


    if (joinedDate) {

        joinedDate.innerHTML = `
            <span>
                ${
                    profile.joined_at
                        ? formatDate(
                            profile.joined_at
                        )
                        : "—"
                }
            </span>
        `;
    }


    // =========================
    // CONTACT
    // =========================

    const email =
        document.getElementById(
            "profile-email"
        );

    const social =
        document.getElementById(
            "profile-social"
        );

    const phone =
        document.getElementById(
            "profile-phone"
        );

    const emergency =
        document.getElementById(
            "profile-emergency"
        );

    const contactNote =
        document.getElementById(
            "profile-contact-note"
        );


    if (email) {

        email.textContent =
            profile.email ||
            "—";
    }


    if (social) {

        social.textContent =
            profile.social ||
            "—";
    }


    if (phone) {

        phone.textContent =
            profile.phone ||
            "—";
    }


    if (emergency) {

        emergency.innerHTML = `
            <span>
                ${
                    profile.emergency_contact ||
                    "—"
                }
            </span>

            <img
                src="images/icon/hide.png"
                alt="Ẩn"
                class="profile-private-icon"
            >
        `;
    }


    if (contactNote) {

        if (profile.contact_note) {

            contactNote.textContent =
                profile.contact_note;

        } else {

            contactNote.innerHTML =
                `<span class="profile-note-placeholder">
                    Chưa có lưu ý.
                </span>`;
        }
    }
}


// =========================
// EDIT BIO
// =========================

async function openBioEditor() {

    const {
        data: {
            session
        }
    } =
        await profileSupabase
            .auth
            .getSession();

    if (!session) {
        return;
    }

    const user =
        session.user;


    const {
        data: profile,
        error
    } =
        await profileSupabase
            .from("profiles")
            .select("bio")
            .eq("id", user.id)
            .maybeSingle();


    if (error) {

        console.error(
            "BIO LOAD ERROR:",
            error
        );

        return;
    }


    const currentBio =
        profile?.bio || "";


    const overlay =
        document.createElement("div");

    overlay.className =
        "profile-bio-edit-overlay";


    overlay.innerHTML = `

        <div class="profile-bio-edit-modal">

            <div class="profile-bio-edit-header">

                <span>
                    Chỉnh sửa Bio
                </span>

                <button
                    type="button"
                    class="profile-bio-edit-close"
                    aria-label="Đóng"
                >
                    ×
                </button>

            </div>


            <div class="profile-bio-edit-body">

                <label>

                    Bio

                    <textarea
                        id="profile-bio-edit-input"
                        maxlength="150"
                        placeholder="Viết một chút về bạn..."
                    >${escapeHtml(
                        currentBio
                    )}</textarea>

                </label>


                <div
                    class="profile-bio-edit-count"
                    id="profile-bio-edit-count"
                >
                    ${currentBio.length}/150
                </div>

            </div>


            <div class="profile-bio-edit-footer">

                <button
                    type="button"
                    class="profile-bio-edit-cancel"
                >
                    Hủy
                </button>

                <button
                    type="button"
                    class="profile-bio-edit-save"
                    id="profile-bio-edit-save"
                >
                    Lưu
                </button>

            </div>

        </div>
    `;


    document.body.appendChild(
        overlay
    );


    const input =
        overlay.querySelector(
            "#profile-bio-edit-input"
        );

    const count =
        overlay.querySelector(
            "#profile-bio-edit-count"
        );


    const closeModal = () => {

        overlay.remove();
    };


    overlay
        .querySelector(
            ".profile-bio-edit-close"
        )
        .addEventListener(
            "click",
            closeModal
        );


    overlay
        .querySelector(
            ".profile-bio-edit-cancel"
        )
        .addEventListener(
            "click",
            closeModal
        );


    overlay.addEventListener(
        "click",
        (event) => {

            if (
                event.target ===
                overlay
            ) {

                closeModal();
            }
        }
    );


    input.addEventListener(
        "input",
        () => {

            count.textContent =
                `${input.value.length}/150`;
        }
    );


    overlay
        .querySelector(
            "#profile-bio-edit-save"
        )
        .addEventListener(
            "click",
            async () => {

                const saveButton =
                    overlay.querySelector(
                        "#profile-bio-edit-save"
                    );

                const bio =
                    input.value.trim();


                saveButton.disabled =
                    true;

                saveButton.textContent =
                    "Đang lưu...";


                const {
                    error
                } =
                    await profileSupabase
                        .from("profiles")
                        .update({
                            bio:
                                bio || null
                        })
                        .eq(
                            "id",
                            user.id
                        );


                if (error) {

                    console.error(
                        "BIO UPDATE ERROR:",
                        error
                    );

                    alert(
                        "Không thể lưu Bio."
                    );

                    saveButton.disabled =
                        false;

                    saveButton.textContent =
                        "Lưu";

                    return;
                }


                closeModal();

                await loadProfile();
            }
        );
}


// =========================
// EDIT PROFILE
// =========================

async function openProfileEditor() {

    const {
        data: {
            session
        }
    } =
        await profileSupabase
            .auth
            .getSession();

    if (!session) {
        return;
    }

    const user =
        session.user;


    const {
        data: profile,
        error
    } =
        await profileSupabase
            .from("profiles")
            .select(`
                full_name,
                date_of_birth,
                gender,
                email,
                social,
                phone,
                emergency_contact,
                contact_note
            `)
            .eq("id", user.id)
            .maybeSingle();


    if (error || !profile) {

        console.error(
            "EDIT PROFILE LOAD ERROR:",
            error
        );

        return;
    }


    const overlay =
        document.createElement("div");

    overlay.className =
        "profile-edit-overlay";


    overlay.innerHTML = `

        <div class="profile-edit-modal">

            <div class="profile-edit-header">

                <span>
                    Chỉnh sửa thông tin
                </span>

                <button
                    type="button"
                    class="profile-edit-close"
                    id="profile-edit-close"
                >
                    ×
                </button>

            </div>


            <div class="profile-edit-body">

                <label>
                    Họ và tên

                    <input
                        type="text"
                        id="edit-full-name"
                        value="${escapeHtml(
                            profile.full_name || ""
                        )}"
                    >
                </label>


                <label>
                    Ngày sinh

                    <input
                        type="date"
                        id="edit-date-of-birth"
                        value="${
                            profile.date_of_birth || ""
                        }"
                    >
                </label>


                <label>
                    Giới tính

                    <select id="edit-gender">

                        <option value="">
                            Chưa chọn
                        </option>

                        <option
                            value="Nam"
                            ${
                                profile.gender ===
                                "Nam"
                                    ? "selected"
                                    : ""
                            }
                        >
                            Nam
                        </option>

                        <option
                            value="Nữ"
                            ${
                                profile.gender ===
                                "Nữ"
                                    ? "selected"
                                    : ""
                            }
                        >
                            Nữ
                        </option>

                    </select>
                </label>


                <label>
                    Email

                    <input
                        type="email"
                        id="edit-email"
                        value="${escapeHtml(
                            profile.email || ""
                        )}"
                        placeholder="Email liên hệ"
                    >
                </label>


                <label>
                    Facebook / Instagram

                    <input
                        type="text"
                        id="edit-social"
                        value="${escapeHtml(
                            profile.social || ""
                        )}"
                        placeholder="Facebook hoặc Instagram"
                    >
                </label>


                <label>
                    Số điện thoại cá nhân

                    <input
                        type="tel"
                        id="edit-phone"
                        value="${escapeHtml(
                            profile.phone || ""
                        )}"
                        placeholder="Số điện thoại"
                    >
                </label>


                <label>
                    Người liên hệ khẩn cấp

                    <input
                        type="text"
                        id="edit-emergency"
                        value="${escapeHtml(
                            profile.emergency_contact ||
                            ""
                        )}"
                        placeholder="Tên - số điện thoại"
                    >
                </label>


                <label>
                    Lưu ý khi nhận liên lạc

                    <textarea
                        id="edit-contact-note"
                        placeholder="Ví dụ: Chỉ liên lạc sau 18:00..."
                    >${escapeHtml(
                        profile.contact_note || ""
                    )}</textarea>

                </label>

            </div>


            <div class="profile-edit-footer">

                <button
                    type="button"
                    class="profile-edit-cancel"
                    id="profile-edit-cancel"
                >
                    Hủy
                </button>

                <button
                    type="button"
                    class="profile-edit-save"
                    id="profile-edit-save"
                >
                    Lưu thay đổi
                </button>

            </div>

        </div>
    `;


    document.body.appendChild(
        overlay
    );


    // =========================
    // CLOSE
    // =========================

    const closeEditor = () => {

        overlay.remove();
    };


    overlay
        .querySelector(
            "#profile-edit-close"
        )
        .addEventListener(
            "click",
            closeEditor
        );


    overlay
        .querySelector(
            "#profile-edit-cancel"
        )
        .addEventListener(
            "click",
            closeEditor
        );


    overlay.addEventListener(
        "click",
        (event) => {

            if (
                event.target ===
                overlay
            ) {

                closeEditor();
            }
        }
    );


    // =========================
    // SAVE
    // =========================

    overlay
        .querySelector(
            "#profile-edit-save"
        )
        .addEventListener(
            "click",
            async () => {

                const saveButton =
                    overlay.querySelector(
                        "#profile-edit-save"
                    );


                saveButton.disabled =
                    true;

                saveButton.textContent =
                    "Đang lưu...";


                const updatedProfile = {

                    full_name:
                        overlay
                            .querySelector(
                                "#edit-full-name"
                            )
                            .value
                            .trim(),

                    date_of_birth:
                        overlay
                            .querySelector(
                                "#edit-date-of-birth"
                            )
                            .value ||
                        null,

                    gender:
                        overlay
                            .querySelector(
                                "#edit-gender"
                            )
                            .value ||
                        null,

                    email:
                        overlay
                            .querySelector(
                                "#edit-email"
                            )
                            .value
                            .trim() ||
                        null,

                    social:
                        overlay
                            .querySelector(
                                "#edit-social"
                            )
                            .value
                            .trim() ||
                        null,

                    phone:
                        overlay
                            .querySelector(
                                "#edit-phone"
                            )
                            .value
                            .trim() ||
                        null,

                    emergency_contact:
                        overlay
                            .querySelector(
                                "#edit-emergency"
                            )
                            .value
                            .trim() ||
                        null,

                    contact_note:
                        overlay
                            .querySelector(
                                "#edit-contact-note"
                            )
                            .value
                            .trim() ||
                        null
                };


                const {
                    error
                } =
                    await profileSupabase
                        .from("profiles")
                        .update(
                            updatedProfile
                        )
                        .eq(
                            "id",
                            user.id
                        );


                if (error) {

                    console.error(
                        "PROFILE UPDATE ERROR:",
                        error
                    );

                    alert(
                        "Không thể lưu thông tin."
                    );

                    saveButton.disabled =
                        false;

                    saveButton.textContent =
                        "Lưu thay đổi";

                    return;
                }


                closeEditor();

                await loadProfile();
            }
        );
}


// =========================
// START
// =========================

document.addEventListener(
    "DOMContentLoaded",
    () => {

        loadProfile();


        // =========================
        // EDIT PROFILE BUTTON
        // =========================

        const editButton =
            document.getElementById(
                "profile-edit-button"
            );


        if (editButton) {

            editButton.addEventListener(
                "click",
                openProfileEditor
            );
        }


        // =========================
        // BIO BUTTON
        // =========================

        const bioButton =
            document.getElementById(
                "profile-bio"
            );


        if (bioButton) {

            bioButton.addEventListener(
                "click",
                openBioEditor
            );
        }


        // =========================
        // HELP BUTTON
        // =========================

        const helpButton =
            document.getElementById(
                "profile-help-button"
            );


        if (helpButton) {

            helpButton.addEventListener(
                "click",
                () => {

                    const overlay =
                        document.createElement(
                            "div"
                        );


                    overlay.className =
                        "profile-help-overlay";


                    overlay.innerHTML = `

                        <div class="profile-help-modal">

                            <div class="profile-help-header">

                                <span>
                                    Về quyền riêng tư Profile
                                </span>

                                <button
                                    type="button"
                                    class="profile-help-close"
                                    id="profile-help-close"
                                >
                                    ×
                                </button>

                            </div>


                            <div class="profile-help-body">

                                <div class="profile-help-item">

                                    <img
                                        src="images/icon/hide.png"
                                        alt=""
                                        class="profile-help-icon"
                                    >

                                    <div>

                                        <span class="profile-help-title">
                                            Thông tin được bảo vệ
                                        </span>

                                        <br>

                                        Một số thông tin chỉ hiển thị
                                        với chính bạn và người có
                                        quyền quản trị.

                                    </div>

                                </div>


                                <div class="profile-help-item">

                                    <div>

                                        <span class="profile-help-title">
                                            Tuổi
                                        </span>

                                        <br>

                                        Tuổi được hệ thống tự động
                                        tính từ ngày sinh và không
                                        thể chỉnh sửa trực tiếp.

                                    </div>

                                </div>


                                <div class="profile-help-item">

                                    <div>

                                        <span class="profile-help-title">
                                            Thông tin PSC
                                        </span>

                                        <br>

                                        Gen, Ban và Chức vụ do hệ thống
                                        quản lý và thành viên không
                                        thể tự thay đổi.

                                    </div>

                                </div>


                                <div class="profile-help-item">

                                    <div>

                                        <span class="profile-help-title">
                                            Thông tin liên hệ
                                        </span>

                                        <br>

                                        Email, mạng xã hội, số điện thoại
                                        và các thông tin liên hệ khác
                                        do bạn cung cấp và có thể
                                        chỉnh sửa trong Profile.
                                        Thông tin này sẽ được hiển thị
                                        cho tất cả mọi người.

                                    </div>

                                </div>

                            </div>

                        </div>
                    `;


                    document.body.appendChild(
                        overlay
                    );


                    const closeHelp = () => {

                        overlay.remove();
                    };


                    overlay
                        .querySelector(
                            "#profile-help-close"
                        )
                        .addEventListener(
                            "click",
                            closeHelp
                        );


                    overlay.addEventListener(
                        "click",
                        (event) => {

                            if (
                                event.target ===
                                overlay
                            ) {

                                closeHelp();
                            }
                        }
                    );

                }
            );
        }

    }
);