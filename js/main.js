// ================================
// MAIN TAB SYSTEM
// ================================

document.documentElement.classList.add("tab-loading");
document.addEventListener("DOMContentLoaded", () => {
  const tabs = document.querySelectorAll(".menu a[data-tab]");
  const contents = document.querySelectorAll(".tab-content");

  if (!tabs.length || !contents.length) return;

  function activateTab(tabName, updateUrl = true) {
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

      const tabName = tab.dataset.tab;

      if (!tabName) return;

      activateTab(tabName);
    });
  });
  document.documentElement.classList.remove("tab-loading");

  // Đọc tab khi mở/reload trang
  const savedTab = window.location.hash.replace("#", "");

  if (savedTab) {
    activateTab(savedTab, false);
  } else {
    // Lần đầu vào website → Home
    activateTab("home", true);
  }
});