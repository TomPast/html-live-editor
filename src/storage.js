/* Storage — LocalStorage persistence */

const KEYS = {
  content: "hle:content",
  panel: "hle:panel",
  panelState: "hle:panelState",
};

/* Debounce helper */
function debounce(fn, ms) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), ms);
  };
}

/* Save indicator */
let fadeTimer;
function flashSaveStatus() {
  const el = document.getElementById("save-status");
  if (!el) return;
  el.classList.add("visible");
  clearTimeout(fadeTimer);
  fadeTimer = setTimeout(() => el.classList.remove("visible"), 1500);
}

/* Content */
const _saveContentNow = (htmlString) => {
  try {
    localStorage.setItem(KEYS.content, htmlString);
    flashSaveStatus();
  } catch { /* quota exceeded — silently fail */ }
};

export const saveContent = debounce(_saveContentNow, 1000);

export function loadContent() {
  return localStorage.getItem(KEYS.content);
}

export function clearContent() {
  localStorage.removeItem(KEYS.content);
}

/* Panel rect */
export function savePanelRect(rect) {
  try {
    localStorage.setItem(KEYS.panel, JSON.stringify(rect));
  } catch { /* ignore */ }
}

export function loadPanelRect() {
  try {
    const raw = localStorage.getItem(KEYS.panel);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

/* Panel state */
export function savePanelState(state) {
  try {
    localStorage.setItem(KEYS.panelState, state);
  } catch { /* ignore */ }
}

export function loadPanelState() {
  return localStorage.getItem(KEYS.panelState);
}

/* Reset all */
export function clearAll() {
  Object.values(KEYS).forEach((k) => localStorage.removeItem(k));
}
