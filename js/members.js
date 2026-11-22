// ================================
// MEMBERS
// ================================

const membersList =
    document.getElementById("members-list");


// ================================
// SUPABASE
// ================================

const membersSupabase =
    window.supabase.createClient(
        "https://butfmjiweebysxnebauh.supabase.co",
        "sb_publishable_GlYqr6HhT8s_JJfNCpt15w_gpe2Yg6O"
    );


// ================================
// DATA THÀNH VIÊN TỪ SUPABASE
// ================================

let membersDirectoryData = [];


// ================================
// LẤY DANH SÁCH THÀNH VIÊN
// ================================

async function loadMembers() {

    const {
        data,
        error
    } =
        await membersSupabase
            .from("profile_directory")
            .select(`
                id,
                full_name,
                age,
                gender,
                gen,
                role,
                department,
                avatar_url,
                bio
            `)
            .order("full_name", {
                ascending: true
            });


    if (error) {

        console.error(
            "MEMBERS LOAD ERROR:",
            error
        );

        if (membersList) {

            membersList.innerHTML = `
                <div class="members-empty">
                    Không thể tải danh sách thành viên.
                </div>
            `;

        }

        return;
    }


    membersDirectoryData =
        (data || []).map(member => ({

            id:
                member.id,

            name:
                member.full_name ||
                "Chưa có tên",

            age:
                member.age,

            gender:
                member.gender ||
                "—",

            generation:
                member.gen,

            role:
                member.role ||
                "Thành viên",

            department:
                member.department ||
                "—",

            bio:
                member.bio ||
                "Chưa có bio.",

            avatar:
                member.avatar_url ||
                "images/non-avatar.png",

            status:
                "offline"

        }));


    filterMembers();

    updateFilterCounts();
}


// ================================
// TẠO 1 CARD THÀNH VIÊN
// ================================

function createMemberCard(member) {

    const card =
        document.createElement("button");

    card.className =
        "member-card";

    card.type =
        "button";
    
    const memberRole =
    member.department &&
    member.department.trim()
        ? `${member.role || "Thành viên"} · ${member.department}`
        : "Thành viên PSC";


    const genderIcon =
        member.gender === "Nam"
            ? "♂"
            : member.gender === "Nữ"
                ? "♀"
                : "—";


    card.innerHTML = `

        <div class="member-left">

            <div class="member-avatar-area">

                <div class="member-avatar">

                    <img
                        src="${member.avatar}"
                        alt="Avatar"
                    >

                    <span
                        class="member-status ${member.status}"
                    ></span>

                </div>

            </div>


            <div class="member-basic-info">

                <div class="member-age-gender">

                    <span>
                        ${
                            member.age !== null &&
                            member.age !== undefined
                                ? `${member.age}t`
                                : "—"
                        }
                    </span>

                    <span>
                        ${genderIcon}
                    </span>

                </div>


                <div class="member-generation">

                    Gen ${member.generation ?? "—"}

                </div>

            </div>

        </div>


        <div class="member-details">

            <div class="member-name">

                ${member.name}

            </div>


            <div class="member-divider"></div>


            <div class="member-role">
                ${memberRole}
            </div>


            <div class="member-bio">

                ${member.bio}

            </div>

        </div>
    `;


    // ================================
    // CLICK CARD → PROFILE
    // ================================

    card.addEventListener(
        "click",
        () => {

            if (
                typeof window.openMemberProfile ===
                "function"
            ) {

                window.openMemberProfile(
                    member.id
                );

            }

        }
    );

return card;
}


// ================================
// BỎ DẤU TIẾNG VIỆT
// ================================

function removeVietnameseTones(str) {

    return str
        .normalize("NFD")
        .replace(
            /[\u0300-\u036f]/g,
            ""
        )
        .replace(/đ/g, "d")
        .replace(/Đ/g, "D");
}


// ================================
// LẤY CÁC FILTER ĐANG ĐƯỢC CHỌN
// ================================

function getCheckedValues(selector) {

    return [
        ...document.querySelectorAll(selector)
    ].map(input => input.value);
}


// ================================
// BỘ LỌC CHUNG
// ================================

function filterMembers() {

    let filteredMembers =
        [...membersDirectoryData];


    // ================================
    // SEARCH
    // ================================

    const searchInput =
        document.querySelector(
            ".search-box input"
        );


    const keyword =
        removeVietnameseTones(
            (searchInput?.value || "")
                .toLowerCase()
                .trim()
        );


    if (keyword !== "") {

        filteredMembers =
            filteredMembers.filter(
                member => {

                    const name =
                        removeVietnameseTones(
                            member.name
                                .toLowerCase()
                        );


                    return name.includes(
                        keyword
                    );
                }
            );
    }


    // ================================
    // FILTER GEN
    // ================================

    const selectedGens =
        getCheckedValues(
            "#gen-filter-menu input:checked"
        ).map(Number);


    if (
        selectedGens.length > 0
    ) {

        filteredMembers =
            filteredMembers.filter(
                member =>
                    selectedGens.includes(
                        Number(
                            member.generation
                        )
                    )
            );
    }


    // ================================
    // FILTER TUỔI
    // ================================

    const selectedAges =
        getCheckedValues(
            "#age-filter-menu input:checked"
        );


    if (
        selectedAges.length > 0
    ) {

        filteredMembers =
            filteredMembers.filter(
                member => {

                    return selectedAges.some(
                        age => {

                            if (
                                age === "19+"
                            ) {

                                return (
                                    Number(
                                        member.age
                                    ) >= 19
                                );
                            }


                            return (
                                Number(
                                    member.age
                                ) ===
                                Number(age)
                            );

                        }
                    );

                }
            );
    }


    // ================================
    // FILTER GIỚI TÍNH
    // ================================

    const selectedGenders =
        getCheckedValues(
            "#gender-filter-menu input:checked"
        );


    if (
        selectedGenders.length > 0
    ) {

        filteredMembers =
            filteredMembers.filter(
                member =>
                    selectedGenders.includes(
                        member.gender
                    )
            );
    }


    // ================================
    // FILTER CHỨC VỤ
    // ================================

    const selectedRoles =
        getCheckedValues(
            "#role-filter-menu input:checked"
        );


    if (
        selectedRoles.length > 0
    ) {

        filteredMembers =
            filteredMembers.filter(
                member =>
                    selectedRoles.includes(
                        member.role
                    )
            );
    }


    // ================================
    // FILTER BAN
    // ================================

    const departmentDropdown =
        filterDropdowns[4];


    const selectedDepartments =
        departmentDropdown
            ? [
                ...departmentDropdown.querySelectorAll(
                    "input[type='checkbox']:checked"
                )
            ].map(input => input.value)
            : [];


    if (
        selectedDepartments.length > 0
    ) {

        filteredMembers =
            filteredMembers.filter(
                member =>
                    selectedDepartments.includes(
                        member.department
                    )
            );
    }


    // ================================
    // HIỂN THỊ
    // ================================

    renderFilteredMembers(
        filteredMembers
    );
}


// ================================
// HIỂN THỊ DANH SÁCH
// ================================

function renderFilteredMembers(
    members
) {

    if (!membersList) {
        return;
    }


    membersList.innerHTML = "";


    if (members.length === 0) {

        membersList.innerHTML = `
            <div class="members-empty">
                Không tìm thấy thành viên phù hợp.
            </div>
        `;

        updateFilterResult(0);

        return;
    }


    members.forEach(
        member => {

            const card =
                createMemberCard(
                    member
                );

            membersList.appendChild(
                card
            );

        }
    );


    updateFilterResult(
        members.length
    );
}


// ================================
// CẬP NHẬT SỐ LƯỢNG KẾT QUẢ
// ================================

function updateFilterResult(
    count
) {

    const result =
        document.getElementById(
            "filter-result"
        );


    if (!result) {
        return;
    }


    result.textContent =
        `${count} members found`;
}


// ================================
// DROPDOWN FILTER
// ================================

const filterDropdowns =
    document.querySelectorAll(
        ".filter-dropdown"
    );


// ================================
// MỞ / ĐÓNG DROPDOWN
// ================================

filterDropdowns.forEach(
    dropdown => {

        const button =
            dropdown.querySelector(
                ".filter-option"
            );

        const menu =
            dropdown.querySelector(
                ".filter-menu"
            );


        if (
            !button ||
            !menu
        ) {
            return;
        }


        button.addEventListener(
            "click",
            event => {

                event.stopPropagation();


                filterDropdowns.forEach(
                    otherDropdown => {

                        const otherMenu =
                            otherDropdown.querySelector(
                                ".filter-menu"
                            );


                        if (
                            otherMenu &&
                            otherDropdown !==
                                dropdown
                        ) {

                            otherMenu.classList.remove(
                                "show"
                            );

                        }

                    }
                );


                menu.classList.toggle(
                    "show"
                );

            }
        );


        menu.addEventListener(
            "click",
            event => {

                event.stopPropagation();

            }
        );

    }
);


// ================================
// HIỂN THỊ SỐ OPTION ĐÃ CHỌN
// ================================

function updateFilterCounts() {

    filterDropdowns.forEach(
        dropdown => {

            const button =
                dropdown.querySelector(
                    ".filter-option"
                );


            const checked =
                dropdown.querySelectorAll(
                    "input[type='checkbox']:checked"
                );


            if (!button) {
                return;
            }


            const count =
                checked.length;


            const label =
                button.querySelector(
                    "span:first-child"
                );


            if (!label) {
                return;
            }


            if (
                !button.dataset.originalText
            ) {

                button.dataset.originalText =
                    label.textContent.trim();

            }


            const originalText =
                button.dataset.originalText;


            if (count > 0) {

                label.textContent =
                    `${originalText} (${count})`;

            } else {

                label.textContent =
                    originalText;

            }

        }
    );
}


// ================================
// ĐÓNG DROPDOWN KHI CLICK RA NGOÀI
// ================================

document.addEventListener(
    "click",
    () => {

        filterDropdowns.forEach(
            dropdown => {

                const menu =
                    dropdown.querySelector(
                        ".filter-menu"
                    );


                if (menu) {

                    menu.classList.remove(
                        "show"
                    );

                }

            }
        );

    }
);


// ================================
// FILTER EVENTS
// ================================

const filterInputs =
    document.querySelectorAll(
        ".members-filter input[type='checkbox']"
    );


filterInputs.forEach(
    input => {

        input.addEventListener(
            "change",
            () => {

                filterMembers();

                updateFilterCounts();

            }
        );

    }
);


// ================================
// SEARCH EVENT
// ================================

const searchInput =
    document.querySelector(
        ".search-box input"
    );


if (searchInput) {

    searchInput.addEventListener(
        "input",
        () => {

            filterMembers();

        }
    );
}


// ================================
// RESET FILTER
// ================================

const resetButton =
    document.querySelector(
        ".reset-filter"
    );


if (resetButton) {

    resetButton.addEventListener(
        "click",
        () => {

            filterInputs.forEach(
                input => {

                    input.checked =
                        false;

                }
            );


            if (searchInput) {

                searchInput.value =
                    "";

            }


            filterDropdowns.forEach(
                dropdown => {

                    const menu =
                        dropdown.querySelector(
                            ".filter-menu"
                        );


                    if (menu) {

                        menu.classList.remove(
                            "show"
                        );

                    }

                }
            );


            filterMembers();

            updateFilterCounts();

        }
    );
}


// ================================
// MEMBERS SUB TABS
// ================================

const membersTabs =
    document.querySelectorAll(
        ".members-tab"
    );


const membersTabContents =
    document.querySelectorAll(
        ".members-tab-content"
    );


function activateMembersTab(
    tabName,
    save = true
) {

    const targetTab =
        [
            ...membersTabs
        ].find(
            tab =>
                tab.dataset.membersTab ===
                tabName
        );


    if (!targetTab) {
        return;
    }


    membersTabs.forEach(
        tab => {

            tab.classList.toggle(
                "active",
                tab === targetTab
            );

        }
    );


    membersTabContents.forEach(
        content => {

            content.classList.toggle(
                "active",
                content.dataset.membersContent ===
                    tabName
            );

        }
    );


    if (save) {

        localStorage.setItem(
            "members-active-tab",
            tabName
        );

    }
}


membersTabs.forEach(
    tab => {

        tab.addEventListener(
            "click",
            () => {

                activateMembersTab(
                    tab.dataset.membersTab
                );

            }
        );

    }
);


const savedMembersTab =
    localStorage.getItem(
        "members-active-tab"
    );


activateMembersTab(
    savedMembersTab ||
        membersTabs[0]?.dataset.membersTab,
    false
);


// ================================
// KHỞI TẠO
// ================================

loadMembers();