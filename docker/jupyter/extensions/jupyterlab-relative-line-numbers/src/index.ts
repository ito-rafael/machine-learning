import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';
import {
  EditorExtensionRegistry,
  IEditorExtensionRegistry
} from '@jupyterlab/codemirror';
import {
  EditorView,
  gutter,
  GutterMarker,
  highlightActiveLine
} from '@codemirror/view';
import { Vim } from '@replit/codemirror-vim';

/* ------------------------------------------------------------------ *
 * 1. Relative line numbers
 * ------------------------------------------------------------------ */

class NumberMarker extends GutterMarker {
  constructor(
    readonly text: string,
    readonly current: boolean = false
  ) {
    super();
    // class applied to the gutter element of this line
    this.elementClass = current ? 'cm-currentRelLine' : '';
  }
  eq(other: GutterMarker): boolean {
    return (
      other instanceof NumberMarker &&
      other.text === this.text &&
      other.current === this.current
    );
  }
  toDOM(): Node {
    return document.createTextNode(this.text);
  }
}

const relativeGutter = gutter({
  class: 'cm-lineNumbers cm-relativeLineNumbers',
  lineMarker(view, line) {
    const doc = view.state.doc;
    const current = doc.lineAt(view.state.selection.main.head).number;
    const n = doc.lineAt(line.from).number;
    return n === current
      ? new NumberMarker(String(n), true)
      : new NumberMarker(String(Math.abs(n - current)));
  },
  lineMarkerChange: update => update.selectionSet || update.docChanged,
  initialSpacer: view => new NumberMarker(String(view.state.doc.lines)),
  updateSpacer: (_, update) => new NumberMarker(String(update.state.doc.lines))
});

const relativeTheme = EditorView.theme({
  // 1. hide the stock gutter (CodeMirror forces display:flex !important)
  '.cm-lineNumbers:not(.cm-relativeLineNumbers)': {
    display: 'none !important'
  },
  // 2. if the stock gutter is absent (View > Show Line Numbers is off),
  //    hide ours too, so Shift-L still works as the toggle
  '.cm-gutters:not(:has(.cm-lineNumbers:not(.cm-relativeLineNumbers))) .cm-relativeLineNumbers':
    { display: 'none !important' },

  // 3. other lines: gray numbers
  '.cm-relativeLineNumbers .cm-gutterElement': {
    color: 'var(--jp-ui-font-color2, #888)'
  },
  // 4. current line number: white on dark gray (only in the focused editor)
  '&.cm-focused .cm-relativeLineNumbers .cm-gutterElement.cm-currentRelLine': {
    color: 'var(--jp-ui-font-color0, #fff)',
    backgroundColor: 'var(--jp-layout-color3, #444)',
    fontWeight: 'bold'
  },
  // 5. current line: slightly different background (focused editor only)
  '.cm-activeLine': { backgroundColor: 'transparent !important' },
  '&.cm-focused .cm-activeLine': {
    backgroundColor: 'rgba(128, 128, 128, 0.18) !important'
  }
});

const relativeLineNumbersPlugin: JupyterFrontEndPlugin<void> = {
  id: 'jupyterlab-relative-line-numbers:plugin',
  autoStart: true,
  requires: [IEditorExtensionRegistry],
  activate: (app: JupyterFrontEnd, registry: IEditorExtensionRegistry) => {
    registry.addExtension({
      name: 'relativeLineNumbers',
      default: true, // follows "Show Line Numbers" automatically
      factory: () =>
        EditorExtensionRegistry.createConfigurableExtension(
          (enabled: boolean) =>
            enabled
              ? [relativeGutter, highlightActiveLine(), relativeTheme]
              : []
        ),
      schema: {
        type: 'boolean',
        title: 'Relative line numbers',
        description: 'Show distance from the cursor line, Vim-style.'
      }
    });
  }
};

/* ------------------------------------------------------------------ *
 * 2. Vim clipboard (the equivalent of `set clipboard=unnamedplus`)
 *
 * The Vim layer used by jupyterlab-vim has no `clipboard` option, and
 * remapping `y` to `"+y` loses counts typed before the operator
 * (`5dd` would delete one line). So instead of remapping keys, we wrap
 * the register controller: whatever lands in the unnamed register
 * (yank, delete, change) is also written to the system clipboard.
 * ------------------------------------------------------------------ */

function installVimClipboard(): void {
  const rc: any = (Vim as any).getRegisterController();
  if (rc.__clipboardPatched) {
    return;
  }
  const original = rc.pushText.bind(rc);
  rc.pushText = (
    name: string | null | undefined,
    operator: string,
    text: string,
    linewise?: boolean,
    blockwise?: boolean
  ): void => {
    original(name, operator, text, linewise, blockwise);
    // "_ (black hole) is ignored; named registers ("a, "b...) stay private;
    // "+ already writes to the clipboard on its own.
    if (name === '_') {
      return;
    }
    if (!name || !rc.isValidRegister(name)) {
      navigator.clipboard
        ?.writeText(rc.unnamedRegister.toString())
        .catch(() => undefined);
    }
  };
  rc.__clipboardPatched = true;
}

/** Copy the system clipboard into Vim's unnamed register, so `p` pastes it. */
async function syncFromClipboard(): Promise<void> {
  try {
    const text = await navigator.clipboard.readText();
    const rc: any = (Vim as any).getRegisterController();
    if (text && text !== rc.unnamedRegister.toString()) {
      // text ending in a newline is treated as linewise, like real Vim
      rc.unnamedRegister.setText(text, text.endsWith('\n'));
    }
  } catch {
    // no permission, insecure context, or no user gesture (Firefox): ignore
  }
}

const vimClipboardPlugin: JupyterFrontEndPlugin<void> = {
  id: 'jupyterlab-relative-line-numbers:vim-clipboard',
  autoStart: true,
  activate: () => {
    installVimClipboard();
    window.addEventListener('focus', () => void syncFromClipboard());
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) {
        void syncFromClipboard();
      }
    });
  }
};

export default [relativeLineNumbersPlugin, vimClipboardPlugin];
