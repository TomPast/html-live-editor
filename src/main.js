import { EditorView } from "@codemirror/view";
import { EditorState } from "@codemirror/state";
import { basicSetup } from "codemirror";
import { html } from "@codemirror/lang-html";
import { oneDark } from "@codemirror/theme-one-dark";
import { saveContent, loadContent, clearAll } from "./storage.js";
import { initExport } from "./export.js";
import { initShare, getSharedContent } from "./share.js";
import { resetLayout } from "./panel.js";
import { injectConsole, clearOnRefresh, initConsole } from "./console.js";
import { DEFAULT_HTML, getTemplateContent, initTemplates } from "./templates.js";

const preview = document.getElementById("preview");
const editorMount = document.getElementById("editor-mount");

function updatePreview(content) {
  clearOnRefresh();
  preview.srcdoc = injectConsole(content);
}

const initialDoc = getSharedContent() || getTemplateContent() || loadContent() || DEFAULT_HTML;

const state = EditorState.create({
  doc: initialDoc,
  extensions: [
    basicSetup,
    html(),
    oneDark,
    EditorView.updateListener.of((update) => {
      if (update.docChanged) {
        const doc = update.state.doc.toString();
        updatePreview(doc);
        saveContent(doc);
      }
    }),
    EditorView.theme({
      "&": { height: "100%" },
      ".cm-scroller": { overflow: "auto" },
    }),
  ],
});

const view = new EditorView({ state, parent: editorMount });

updatePreview(initialDoc);

initExport(() => view.state.doc.toString());
initShare(() => view.state.doc.toString());
initConsole(() => updatePreview(view.state.doc.toString()));
initTemplates((newContent) => {
  view.dispatch({
    changes: { from: 0, to: view.state.doc.length, insert: newContent },
  });
  updatePreview(newContent);
});

/* Reset button */
document.getElementById("reset-btn").addEventListener("click", () => {
  if (!confirm("Reset to default? Your current code will be lost.")) return;
  clearAll();
  view.dispatch({
    changes: { from: 0, to: view.state.doc.length, insert: DEFAULT_HTML },
  });
  updatePreview(DEFAULT_HTML);
  resetLayout();
});
