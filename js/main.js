// ================================
// SUPABASE
// ================================

const SUPABASE_URL =
  "https://butfmjiweebysxnebauh.supabase.co";

const SUPABASE_KEY =
  "sb_publishable_GlYqr6HhT8s_JJfNCpt15w_gpe2Yg6O";

const supabaseClient = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_KEY
);


// ================================
// KIỂM TRA ĐĂNG NHẬP
// ================================

async function checkLogin() {

  const {
    data: { session }
  } = await supabaseClient.auth.getSession();

  // Chưa đăng nhập → quay về login
  if (!session) {
    window.location.href = "login.html";
    return false;
  }

  return true;
}


// ================================
// ĐĂNG XUẤT
// ================================

async function logout() {

  const logoutButton =
    document.getElementById("logout-button");

  if (logoutButton) {
    logoutButton.disabled = true;
    logoutButton.textContent = "Đang đăng xuất...";
  }

  const { error } =
    await supabaseClient.auth.signOut();

  if (error) {
    console.error("Lỗi đăng xuất:", error);

    if (logoutButton) {
      logoutButton.disabled = false;
      logoutButton.textContent = "Đăng xuất";
    }

    alert("Không thể đăng xuất. Vui lòng thử lại.");
    return;
  }

  window.location.href = "login.html";
}


// ================================
// MAIN TAB SYSTEM
// ================================

document.documentElement.classList.add("tab-loading");

document.addEventListener("DOMContentLoaded", async () => {

  // Kiểm tra đăng nhập trước
  const isLoggedIn = await checkLogin();

  if (!isLoggedIn) return;

  // ================================
// HIỂN THỊ USERNAME
// ================================

const accountUsername =
  document.getElementById("account-username");

if (accountUsername) {

  const {
    data: { user }
  } = await supabaseClient.auth.getUser();

  if (user) {

    const username =
      user.email
        ?.replace("@accounts.psc.example.com", "");

    accountUsername.textContent =
      username ? `@${username}` : "Tài khoản";

  }

}

 // ================================
// ACCOUNT MENU
// ================================

const accountButton =
  document.getElementById("account-button");

const accountDropdown =
  document.getElementById("account-dropdown");

const logoutButton =
  document.getElementById("logout-button");


if (accountButton && accountDropdown) {

  accountButton.addEventListener("click", event => {

    event.stopPropagation();

    accountDropdown.classList.toggle("active");

  });


  document.addEventListener("click", () => {

    accountDropdown.classList.remove("active");

  });

}


// ================================
// LOGOUT
// ================================

if (logoutButton) {

  logoutButton.addEventListener(
    "click",
    logout
  );

}

  // ================================
  // TAB SYSTEM
  // ================================

  const tabs =
    document.querySelectorAll(".menu a[data-tab]");

  const contents =
    document.querySelectorAll(".tab-content");

  if (!tabs.length || !contents.length) {
    document.documentElement.classList.remove(
      "tab-loading"
    );
    return;
  }


  function activateTab(
    tabName,
    updateUrl = true
  ) {

    // Nếu tab không tồn tại → về Home
    const targetTab = [...tabs].find(
      tab => tab.dataset.tab === tabName
    );

    if (!targetTab) {
      tabName = "home";
    }


    // Active navigation
    tabs.forEach(tab => {

      tab.classList.toggle(
        "active",
        tab.dataset.tab === tabName
      );

    });


    // Hiện đúng nội dung
    contents.forEach(content => {

      content.classList.toggle(
        "active",
        content.dataset.tabContent === tabName
      );

    });


    // Lưu tab vào URL
    if (updateUrl) {

      history.replaceState(
        null,
        "",
        `#${tabName}`
      );

    }

  }


  // Bấm tab
  tabs.forEach(tab => {

    tab.addEventListener("click", event => {

      event.preventDefault();

      const tabName =
        tab.dataset.tab;

      if (!tabName) return;

      activateTab(tabName);

    });

  });


  // Đọc tab khi mở/reload trang
  const savedTab =
    window.location.hash.replace("#", "");


  if (savedTab) {

    activateTab(
      savedTab,
      false
    );

  } else {

    // Lần đầu vào website → Home
    activateTab(
      "home",
      true
    );

  }


  document.documentElement.classList.remove(
    "tab-loading"
  );

});