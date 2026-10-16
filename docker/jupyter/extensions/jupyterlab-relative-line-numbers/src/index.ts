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
    color: 'var(--jp-ui-font-color2, #222)'
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

const plugin: JupyterFrontEndPlugin<void> = {
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

export default plugin;
