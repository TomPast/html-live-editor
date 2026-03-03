import { EditorView } from "@codemirror/view";
import { EditorState } from "@codemirror/state";
import { basicSetup } from "codemirror";
import { html } from "@codemirror/lang-html";
import { oneDark } from "@codemirror/theme-one-dark";
import "./panel.js";

const DEFAULT_HTML = `<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }

    body {
      min-height: 100vh;
      background: linear-gradient(
        135deg,
        #1a1a2e 0%,
        #16213e 25%,
        #0f3460 50%,
        #533483 75%,
        #e94560 100%
      );
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      font-family: 'Segoe UI', system-ui, sans-serif;
      color: #fff;
      gap: 1.5rem;
      overflow: hidden;
    }

    h1 {
      font-size: clamp(2rem, 6vw, 4rem);
      font-weight: 800;
      letter-spacing: -0.02em;
      text-shadow: 0 0 60px rgba(233, 69, 96, 0.7);
    }

    p {
      font-size: clamp(1rem, 2.5vw, 1.3rem);
      opacity: 0.75;
      text-align: center;
      max-width: 50ch;
      line-height: 1.7;
    }

    .orb {
      position: fixed;
      border-radius: 50%;
      filter: blur(90px);
      opacity: 0.55;
      animation: drift 9s ease-in-out infinite alternate;
    }
    .orb-1 { width: 600px; height: 600px; background: #e94560; top: -150px; left: -150px; }
    .orb-2 { width: 500px; height: 500px; background: #533483; bottom: -150px; right: -150px; animation-delay: -4s; }
    .orb-3 { width: 350px; height: 350px; background: #0f3460; top: 35%; left: 45%; animation-delay: -7s; }

    @keyframes drift {
      from { transform: translate(0, 0) scale(1); }
      to   { transform: translate(50px, 35px) scale(1.08); }
    }
  </style>
</head>
<body>
  <div class="orb orb-1"></div>
  <div class="orb orb-2"></div>
  <div class="orb orb-3"></div>
  <h1>HTML Live Editor</h1>
  <p>Edit the code on the left and watch your changes appear here instantly.</p>
</body>
</html>`;

const preview = document.getElementById("preview");
const editorMount = document.getElementById("editor-mount");
const consolePanel = document.getElementById("console-panel");
const consoleOutput = document.getElementById("console-output");
const consoleToggle = document.getElementById("console-toggle");
const consoleClear = document.getElementById("console-clear");

const CONSOLE_SCRIPT = `<script>
(function() {
  ['log','warn','error','info'].forEach(function(m) {
    var orig = console[m];
    console[m] = function() {
      var args = Array.prototype.slice.call(arguments).map(function(a) {
        if (typeof a === 'string') return a;
        try { return JSON.stringify(a, null, 2); } catch(e) { return String(a); }
      });
      window.parent.postMessage({ type: 'console', method: m, args: args }, '*');
      orig.apply(console, arguments);
    };
  });
  window.addEventListener('error', function(e) {
    window.parent.postMessage({
      type: 'console', method: 'error',
      args: [e.message + (e.lineno ? ' (line ' + e.lineno + ')' : '')]
    }, '*');
  });
})();
<\/script>`;

const ICONS = { log: '▶', warn: '⚠', error: '✕', info: 'ℹ' };

function addConsoleEntry(method, args) {
  const entry = document.createElement('div');
  entry.className = `console-entry ${method}`;

  const icon = document.createElement('i');
  icon.className = 'console-icon';
  icon.textContent = ICONS[method] || '▶';

  const msg = document.createElement('span');
  msg.className = 'console-msg';
  msg.textContent = args.join(' ');

  const now = new Date();
  const time = document.createElement('span');
  time.className = 'console-time';
  time.textContent = now.toTimeString().slice(0, 8);

  entry.append(icon, msg, time);
  consoleOutput.appendChild(entry);
  consoleOutput.scrollTop = consoleOutput.scrollHeight;
}

function injectConsoleScript(html) {
  if (html.includes('<head>')) return html.replace('<head>', '<head>' + CONSOLE_SCRIPT);
  if (html.includes('<body>')) return html.replace('<body>', CONSOLE_SCRIPT + '<body>');
  return CONSOLE_SCRIPT + html;
}

function updatePreview(content) {
  consoleOutput.innerHTML = '';
  preview.srcdoc = injectConsoleScript(content);
}

window.addEventListener('message', (e) => {
  if (e.source !== preview.contentWindow) return;
  if (e.data?.type === 'console') addConsoleEntry(e.data.method, e.data.args);
});

consoleToggle.addEventListener('click', () => {
  consolePanel.classList.toggle('hidden');
  consoleToggle.classList.toggle('active');
});

consoleClear.addEventListener('click', () => { consoleOutput.innerHTML = ''; });

document.addEventListener('keydown', (e) => {
  if (e.ctrlKey && e.key === '`') {
    e.preventDefault();
    consolePanel.classList.toggle('hidden');
    consoleToggle.classList.toggle('active');
  }
});

const state = EditorState.create({
  doc: DEFAULT_HTML,
  extensions: [
    basicSetup,
    html(),
    oneDark,
    EditorView.updateListener.of((update) => {
      if (update.docChanged) updatePreview(update.state.doc.toString());
    }),
    EditorView.theme({
      "&": { height: "100%" },
      ".cm-scroller": { overflow: "auto" },
    }),
  ],
});

new EditorView({ state, parent: editorMount });

updatePreview(DEFAULT_HTML);
