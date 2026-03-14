/* Info modal — about / author links */

const GITHUB_ICON = `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>`;

const CODE_ICON = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>`;

const GLOBE_ICON = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/></svg>`;

const LINKS = [
  {
    icon: GITHUB_ICON,
    label: "GitHub",
    desc: "@TomPast",
    href: "https://github.com/TomPast",
  },
  {
    icon: CODE_ICON,
    label: "Source Code",
    desc: "html-live-editor",
    href: "https://github.com/TomPast/html-live-editor",
  },
];

function showInfoModal() {
  const existing = document.getElementById("info-modal");
  if (existing) existing.remove();

  const overlay = document.createElement("div");
  overlay.id = "info-modal";

  const linksHTML = LINKS.map(
    (l, i) => `
    <a class="info-link" href="${
      l.href
    }" target="_blank" rel="noopener" style="animation-delay:${
      0.06 + i * 0.04
    }s">
      <span class="info-link-icon">${l.icon}</span>
      <span class="info-link-text">
        <span class="info-link-label">${l.label}</span>
        <span class="info-link-desc">${l.desc}</span>
      </span>
      <span class="info-link-arrow"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg></span>
    </a>`
  ).join("");

  overlay.innerHTML = `
    <div class="info-modal-card">
      <div class="info-modal-header">
        <div class="info-identity">
          <img class="info-avatar" src="https://github.com/TomPast.png" alt="TomPast" />
          <div class="info-name-block">
            <span class="info-author">TomPast</span>
            <span class="info-role">software engineer</span>
          </div>
        </div>
        <button class="share-modal-close" title="Close">&times;</button>
      </div>
      <div class="info-divider"></div>
      <div class="info-links">${linksHTML}</div>
    </div>
  `;

  document.body.appendChild(overlay);

  /* Trigger entrance animation */
  requestAnimationFrame(() => overlay.classList.add("visible"));

  const closeBtn = overlay.querySelector(".share-modal-close");

  function close() {
    overlay.remove();
  }
  closeBtn.addEventListener("click", close);
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) close();
  });
  document.addEventListener("keydown", function onEsc(e) {
    if (e.key === "Escape") {
      close();
      document.removeEventListener("keydown", onEsc);
    }
  });
}

export function initInfo() {
  document.getElementById("info-btn").addEventListener("click", showInfoModal);
}
