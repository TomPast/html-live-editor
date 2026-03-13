/* Templates */

import blank from "./templates/blank.html?raw";
import jsScript from "./templates/js-script.html?raw";
import threejs from "./templates/threejs.html?raw";

export { blank as DEFAULT_HTML };

const TEMPLATES = [
  { name: "blank", slug: "blank", html: blank },
  { name: "js script", slug: "js-script", html: jsScript },
  { name: "three.js", slug: "threejs", html: threejs },
];

const HASH_PREFIX = "template=";

/* Read template from URL hash on page load */
export function getTemplateContent() {
  const hash = window.location.hash.slice(1);
  if (!hash.startsWith(HASH_PREFIX)) return null;
  const slug = hash.slice(HASH_PREFIX.length);
  const t = TEMPLATES.find((t) => t.slug === slug);
  if (!t) return null;
  history.replaceState(null, "", window.location.pathname + window.location.search);
  return t.html;
}

function setTemplateHash(slug) {
  history.replaceState(null, "", window.location.pathname + window.location.search + "#" + HASH_PREFIX + slug);
}

export function initTemplates(setContent) {
  const btn = document.getElementById("templates-btn");
  let dropdown = null;

  function open() {
    if (dropdown) return;
    dropdown = document.createElement("div");
    dropdown.className = "templates-dropdown";

    TEMPLATES.forEach((t) => {
      const item = document.createElement("button");
      item.textContent = t.name;
      item.addEventListener("click", () => {
        if (!confirm("Load template? Your current code will be replaced.")) return;
        setContent(t.html);
        setTemplateHash(t.slug);
        close();
      });
      dropdown.appendChild(item);
    });

    document.getElementById("topbar").appendChild(dropdown);
    dropdown.style.left = btn.offsetLeft + "px";
    requestAnimationFrame(() => {
      document.addEventListener("click", onClickOutside);
      document.addEventListener("keydown", onEscape);
    });
  }

  function close() {
    if (!dropdown) return;
    dropdown.remove();
    dropdown = null;
    document.removeEventListener("click", onClickOutside);
    document.removeEventListener("keydown", onEscape);
  }

  function onClickOutside(e) {
    if (!dropdown.contains(e.target) && e.target !== btn) close();
  }

  function onEscape(e) {
    if (e.key === "Escape") close();
  }

  btn.addEventListener("click", () => {
    dropdown ? close() : open();
  });
}
