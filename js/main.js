// ================================
// SUPABASE
// ================================

const SUPABASE_URL =
  "https://butfmjiweebysxnebauh.supabase.co";

const SUPABASE_KEY =
  "sb_publishable_GlYqr6HhT8s_JJfNCpt15w_gpe2Yg6O";

const supabaseClient =
  window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
  );


// ================================
// KIỂM TRA ĐĂNG NHẬP
// ================================

async function checkLogin() {

  const {
    data: { session }
  } =
    await supabaseClient.auth.getSession();

  if (!session) {

    window.location.href =
      "login.html";

    return false;
  }

  return true;
}


// ================================
// ĐĂNG XUẤT
// ================================

async function logout() {

  const logoutButton =
    document.getElementById(
      "logout-button"
    );

  if (logoutButton) {

    logoutButton.disabled = true;

    logoutButton.textContent =
      "Đang đăng xuất...";
  }


  const { error } =
    await supabaseClient.auth.signOut();


  if (error) {

    console.error(
      "Lỗi đăng xuất:",
      error
    );

    if (logoutButton) {

      logoutButton.disabled = false;

      logoutButton.textContent =
        "Đăng xuất";
    }

    alert(
      "Không thể đăng xuất. Vui lòng thử lại."
    );

    return;
  }


  window.location.href =
    "login.html";
}


// ================================
// MAIN
// ================================

document.documentElement.classList.add(
  "tab-loading"
);


document.addEventListener(
  "DOMContentLoaded",
  async () => {

    // ================================
    // KIỂM TRA LOGIN
    // ================================

    const isLoggedIn =
      await checkLogin();

    if (!isLoggedIn) {
      return;
    }


    // ================================
    // USER ACCOUNT
    // ================================

    const accountFullName =
      document.getElementById(
        "account-full-name"
      );

    const accountUsername =
      document.getElementById(
        "account-username"
      );


    const {
      data: { user }
    } =
      await supabaseClient.auth.getUser();


    if (user) {

      // ================================
      // USERNAME
      // ================================

      const username =
        user.email
          ?.replace(
            "@accounts.psc.example.com",
            ""
          );


      if (accountUsername) {

        accountUsername.textContent =
          username
            ? `@${username}`
            : "@username";
      }


      // ================================
      // PROFILE
      // ================================

      const {
        data: profile,
        error: profileError
      } =
        await supabaseClient
          .from("profiles")
          .select(
            "full_name, username"
          )
          .eq(
            "id",
            user.id
          )
          .maybeSingle();


      if (profileError) {

        console.error(
          "Lỗi lấy Profile:",
          profileError
        );

      }


      if (profile) {

        if (
          accountFullName &&
          profile.full_name
        ) {

          accountFullName.textContent =
            profile.full_name;

        }


        if (
          accountUsername &&
          profile.username
        ) {

          accountUsername.textContent =
            `@${profile.username}`;

        }

      }

    }


    // ================================
    // ACCOUNT MENU
    // ================================

    const accountButton =
      document.getElementById(
        "account-button"
      );

    const accountDropdown =
      document.getElementById(
        "account-dropdown"
      );

    const logoutButton =
      document.getElementById(
        "logout-button"
      );


    if (
      accountButton &&
      accountDropdown
    ) {

      accountButton.addEventListener(
        "click",
        event => {

          event.stopPropagation();

          accountDropdown.classList.toggle(
            "active"
          );

        }
      );


      document.addEventListener(
        "click",
        () => {

          accountDropdown.classList.remove(
            "active"
          );

        }
      );

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
      document.querySelectorAll(
        ".menu a[data-tab]"
      );

    const contents =
      document.querySelectorAll(
        ".tab-content"
      );


    if (
      !tabs.length ||
      !contents.length
    ) {

      document.documentElement.classList.remove(
        "tab-loading"
      );

      return;
    }


    function activateTab(
      tabName,
      updateUrl = true
    ) {

      // Nếu tab không tồn tại → Home
      const targetTab =
        [...tabs].find(
          tab =>
            tab.dataset.tab ===
            tabName
        );


      if (!targetTab) {

        tabName = "home";

      }


      // Active navigation
      tabs.forEach(tab => {

        tab.classList.toggle(
          "active",
          tab.dataset.tab ===
            tabName
        );

      });


      // Hiện đúng nội dung
      contents.forEach(
        content => {

          content.classList.toggle(
            "active",
            content.dataset
              .tabContent ===
              tabName
          );

        }
      );


      // Lưu tab vào URL
      if (updateUrl) {

        history.replaceState(
          null,
          "",
          `#${tabName}`
        );

      }

    }


    // ================================
    // BẤM TAB
    // ================================

    tabs.forEach(tab => {

      tab.addEventListener(
        "click",
        event => {

          event.preventDefault();

          const tabName =
            tab.dataset.tab;

          if (!tabName) {
            return;
          }

          activateTab(
            tabName
          );

        }
      );

    });


    // ================================
    // TAB KHI RELOAD
    // ================================

    const savedTab =
      window.location.hash.replace(
        "#",
        ""
      );


    if (savedTab) {

      activateTab(
        savedTab,
        false
      );

    } else {

      activateTab(
        "home",
        true
      );

    }


    document.documentElement.classList.remove(
      "tab-loading"
    );

  }
);