(function () {
  const HOST = window.__HOST__ || { current: 1, total: 3, urls: {} };

  // --- Transition matchers: substring → navigation action ---
  // Order matters: success is checked before screen advances.
  const TRANSITIONS = [
    { match: "Sign off on the Make-A-Wish referral for J.T.", action: "success" },
    { match: "Draft the referral inquiry for patient J.T.",  action: "goto", screen: 2 },
    { match: "Send the referral draft to Dr. Patel",          action: "goto", screen: 3 },
  ];

  function go(num) {
    const url = HOST.urls[num];
    if (url) window.location.assign(url);
  }

  // --- Toast ---
  const toastEl = document.getElementById("host-toast");
  let toastTimer = null;
  function toast(msg) {
    if (!toastEl) return;
    toastEl.textContent = msg;
    toastEl.classList.add("is-visible");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove("is-visible"), 2600);
  }
  function hideToast() {
    if (toastEl) toastEl.classList.remove("is-visible");
  }

  // Build a friendly verb-phrase from a prompt for the toast fallback.
  function describe(prompt) {
    let p = String(prompt || "").trim();
    if (!p) return "do that";
    p = p.replace(/[.!?]+$/, "");
    // Lowercase first word for natural reading after "Claude to ...".
    p = p.charAt(0).toLowerCase() + p.slice(1);
    if (p.length > 140) p = p.slice(0, 137) + "…";
    return p;
  }

  // --- sendPrompt shim (replaces the host-injected function) ---
  window.sendPrompt = function (prompt) {
    for (const t of TRANSITIONS) {
      if (typeof prompt === "string" && prompt.indexOf(t.match) !== -1) {
        if (t.action === "success") {
          showSuccess();
        } else if (t.action === "goto") {
          go(t.screen);
        }
        return;
      }
    }
    toast("In production, this would prompt Claude to " + describe(prompt));
  };

  // --- Success overlay ---
  const successEl = document.getElementById("host-success");
  function showSuccess() {
    if (!successEl) return;
    successEl.hidden = false;
  }
  function hideSuccess() {
    if (!successEl) return;
    successEl.hidden = true;
  }

  // Restart actions (top-nav refresh button + success card button)
  document.querySelectorAll('[data-action="restart"]').forEach((el) => {
    el.addEventListener("click", function (e) {
      e.preventDefault();
      hideSuccess();
      if (HOST.current === 1) {
        window.location.reload();
      } else {
        go(1);
      }
    });
  });

  // Sidebar items / new-chat: harmless toasts so the chrome feels alive.
  document.querySelectorAll('[data-action="toast"]').forEach((el) => {
    el.addEventListener("click", function (e) {
      e.preventDefault();
      const prompt = el.getAttribute("data-prompt") || "do that";
      toast("In production, this would prompt Claude to " + describe(prompt));
    });
  });

  // Sidebar collapse toggle.
  const shell = document.querySelector(".host-shell");
  const toggleBtn = document.querySelector(".host-sidebar-toggle");
  function toggleSidebar() {
    if (shell) shell.classList.toggle("is-collapsed");
  }
  if (toggleBtn) toggleBtn.addEventListener("click", toggleSidebar);

  // --- Keyboard shortcuts ---
  document.addEventListener("keydown", function (e) {
    // Ignore when typing in an editable field.
    const t = e.target;
    const tag = (t && t.tagName) || "";
    const editable =
      tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT" ||
      (t && t.isContentEditable);
    if (editable) return;

    if (e.key === "ArrowRight") {
      e.preventDefault();
      if (HOST.current < HOST.total) go(HOST.current + 1);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      if (HOST.current > 1) go(HOST.current - 1);
    } else if (e.key === "r" || e.key === "R") {
      e.preventDefault();
      hideSuccess();
      if (HOST.current === 1) window.location.reload();
      else go(1);
    } else if (e.key === "Escape") {
      hideToast();
      hideSuccess();
    } else if (e.key === "\\") {
      e.preventDefault();
      toggleSidebar();
    }
  });
})();
