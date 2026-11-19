const membersList = document.getElementById("members-list");


// ================================
// TẠO 1 CARD THÀNH VIÊN
// ================================

function createMemberCard(member) {
    const card = document.createElement("button");

    card.className = "member-card";
    card.type = "button";

    const genderIcon = member.gender === "Nam" ? "♂" : "♀";

    card.innerHTML = `
        <div class="member-left">

            <div class="member-avatar-area">
                <div class="member-avatar">
                    <img src="${member.avatar}" alt="Avatar">
                    <span class="member-status ${member.status}"></span>
                </div>
            </div>

            <div class="member-basic-info">
                <div class="member-age-gender">
                    <span>${member.age}t</span>
                    <span>${genderIcon}</span>
                </div>

                <div class="member-generation">
                    Gen ${member.generation}
                </div>
            </div>

        </div>

        <div class="member-details">

            <div class="member-name">
                ${member.name}
            </div>

            <div class="member-divider"></div>

            <div class="member-role">
                ${member.role} · ${member.department}
            </div>

            <div class="member-bio">
                ${member.bio}
            </div>

        </div>
    `;

    return card;
}


// ================================
// BỎ DẤU TIẾNG VIỆT
// ================================

function removeVietnameseTones(str) {
    return str
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
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

    let filteredMembers = [...membersData];


    // ================================
    // SEARCH
    // ================================

    const searchInput = document.querySelector(".search-box input");

    const keyword = removeVietnameseTones(
        searchInput.value
            .toLowerCase()
            .trim()
    );

    if (keyword !== "") {

        filteredMembers = filteredMembers.filter(member => {

            const name = removeVietnameseTones(
                member.name.toLowerCase()
            );

            return name.includes(keyword);
        });
    }


    // ================================
    // FILTER GEN
    // ================================

    const selectedGens = getCheckedValues(
        "#gen-filter-menu input:checked"
    ).map(Number);

    if (selectedGens.length > 0) {

        filteredMembers = filteredMembers.filter(member =>
            selectedGens.includes(Number(member.generation))
        );
    }


    // ================================
    // FILTER TUỔI
    // ================================

    const selectedAges = getCheckedValues(
        "#age-filter-menu input:checked"
    );

    if (selectedAges.length > 0) {

        filteredMembers = filteredMembers.filter(member => {

            return selectedAges.some(age => {

                if (age === "19+") {
                    return Number(member.age) >= 19;
                }

                return Number(member.age) === Number(age);
            });

        });
    }


    // ================================
    // FILTER GIỚI TÍNH
    // ================================

    const selectedGenders = getCheckedValues(
        "#gender-filter-menu input:checked"
    );

    if (selectedGenders.length > 0) {

        filteredMembers = filteredMembers.filter(member =>
            selectedGenders.includes(member.gender)
        );
    }


    // ================================
    // FILTER CHỨC VỤ
    // ================================

    const selectedRoles = getCheckedValues(
        "#role-filter-menu input:checked"
    );

    if (selectedRoles.length > 0) {

        filteredMembers = filteredMembers.filter(member =>
            selectedRoles.includes(member.role)
        );
    }


    // ================================
    // FILTER BAN
    // ================================

    const selectedDepartments = getCheckedValues(
        ".members-filter .filter-dropdown:nth-of-type(5) input:checked"
    );

    if (selectedDepartments.length > 0) {

        filteredMembers = filteredMembers.filter(member =>
            selectedDepartments.includes(member.department)
        );
    }


    // ================================
    // HIỂN THỊ KẾT QUẢ
    // ================================

    renderFilteredMembers(filteredMembers);
}


// ================================
// HIỂN THỊ DANH SÁCH
// ================================

function renderFilteredMembers(members) {

    membersList.innerHTML = "";

    members.forEach(member => {

        const card = createMemberCard(member);

        membersList.appendChild(card);

    });

    updateFilterResult(members.length);
}


// ================================
// CẬP NHẬT SỐ LƯỢNG KẾT QUẢ
// ================================

function updateFilterResult(count) {

    const result = document.getElementById("filter-result");

    if (!result) return;

    result.textContent = `${count} members found`;
}


// ================================
// DROPDOWN FILTER
// ================================

// LẤY TẤT CẢ DROPDOWN
const filterDropdowns = document.querySelectorAll(
    ".filter-dropdown"
);


// MỞ / ĐÓNG DROPDOWN
filterDropdowns.forEach(dropdown => {

    const button = dropdown.querySelector(".filter-option");
    const menu = dropdown.querySelector(".filter-menu");

    if (!button || !menu) return;


    // Bấm nút filter
    button.addEventListener("click", event => {

        event.stopPropagation();

        filterDropdowns.forEach(otherDropdown => {

            const otherMenu = otherDropdown.querySelector(
                ".filter-menu"
            );

            if (
                otherMenu &&
                otherDropdown !== dropdown
            ) {
                otherMenu.classList.remove("show");
            }

        });

        menu.classList.toggle("show");

    });


    // Bấm checkbox bên trong menu
    // KHÔNG cho click chạy xuống document
    menu.addEventListener("click", event => {
        event.stopPropagation();
    });

});
// ================================
// HIỂN THỊ SỐ OPTION ĐÃ CHỌN
// ================================

function updateFilterCounts() {

    filterDropdowns.forEach(dropdown => {

        const button = dropdown.querySelector(".filter-option");
        const checked = dropdown.querySelectorAll(
            "input[type='checkbox']:checked"
        );

        if (!button) return;

        const count = checked.length;
        const label = button.querySelector("span:first-child");

        if (!label) return;

        if (!button.dataset.originalText) {
            button.dataset.originalText = label.textContent.trim();
        }

        const originalText = button.dataset.originalText;

        if (count > 0) {
            label.textContent = `${originalText} (${count})`;
        } else {
            label.textContent = originalText;
        }

    });

}


// ================================
// ĐÓNG DROPDOWN KHI CLICK RA NGOÀI
// ================================

document.addEventListener("click", () => {

    filterDropdowns.forEach(dropdown => {

        const menu = dropdown.querySelector(
            ".filter-menu"
        );

        if (menu) {
            menu.classList.remove("show");
        }

    });

});


// ================================
// FILTER EVENTS
// ================================

const filterInputs = document.querySelectorAll(
    ".members-filter input[type='checkbox']"
);

filterInputs.forEach(input => {

    input.addEventListener("change", () => {

        filterMembers();
        updateFilterCounts();

    });

});

// ================================
// SEARCH EVENT
// ================================

const searchInput = document.querySelector(
    ".search-box input"
);

searchInput.addEventListener("input", () => {

    filterMembers();

});


// ================================
// RESET FILTER
// ================================

const resetButton = document.querySelector(
    ".reset-filter"
);

resetButton.addEventListener("click", () => {


    // Bỏ toàn bộ lựa chọn
    filterInputs.forEach(input => {

        input.checked = false;

    });


    // Xóa ô tìm kiếm
    searchInput.value = "";


    // Đóng dropdown
    filterDropdowns.forEach(dropdown => {

        const menu = dropdown.querySelector(
            ".filter-menu"
        );

        if (menu) {
            menu.classList.remove("show");
        }

    });


    // Hiển thị lại tất cả
    filterMembers();
    updateFilterCounts();

});


// ================================
// KHỞI TẠO
// ================================

filterMembers();
updateFilterCounts();