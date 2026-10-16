# jupyterlab-relative-line-numbers

Vim-style **relative line numbers** for JupyterLab 4 editors (code cells, console, file editor), with a clearly highlighted current line, plus a **system clipboard integration** for Vim yank/delete (the equivalent of `set clipboard=unnamedplus`).

```
2
1
10   <- cursor is here (shows its absolute number)
1
2
```

Every line shows its distance from the cursor line, except the cursor line itself, which shows its real line number. This makes motions like `5j`, `12k` or `d7j` easy to count, especially when using Vim keybindings via [`jupyterlab-vim`](https://github.com/jupyterlab-contrib/jupyterlab-vim).

## Features

- Relative numbers that update whenever the cursor moves or the text changes.
- The current line number is white on a dark gray block; all other numbers are gray.
- The current line gets a slightly different background (only in the focused editor, so a notebook with many cells doesn't show many highlighted lines).
- Colors follow the active JupyterLab theme (light or dark) through `--jp-*` CSS variables.
- Works together with **View → Show Line Numbers** (`Shift-L` in the setup this was built for): turning line numbers off hides the relative column too.
- Enabled by default; can be toggled per editor type in the settings.
- Vim yank, delete and change (`y`, `d`, `c`, `x`, `D`, `C`, `Y`...) also copy to the system clipboard, and text copied elsewhere can be pasted with `p`. Counts such as `5dd` or `3yy` keep working.

## Requirements

- JupyterLab >= 4.0 (CodeMirror 6)
- A browser with support for the CSS `:has()` selector (current Chrome, Edge, Safari and Firefox). Without it, the relative column stays visible after turning line numbers off.
- For the clipboard feature: [`jupyterlab-vim`](https://github.com/jupyterlab-contrib/jupyterlab-vim) and a secure browser context (`http://localhost` or HTTPS). See [Vim clipboard](#vim-clipboard) for browser differences.

## Installation

From the extension folder:

```bash
npm install
npm run build:prod
pip install .
```

Restart JupyterLab (or reload the page) and check that the extension is listed:

```bash
jupyter labextension list
```

The Python build tools (`hatchling`, `hatch-jupyter-builder`, `hatch-nodejs-version`) are fetched automatically by pip. A regular (non-editable) `pip install .` copies the built extension into Jupyter's `share/jupyter/labextensions` directory, so the source folder is no longer needed afterwards.

### Docker

```dockerfile
COPY --chown=jovyan extensions/jupyterlab-relative-line-numbers /tmp/relnum
RUN cd /tmp/relnum && \
    npm install && \
    npm run build:prod && \
    pip install . && \
    cd / && rm -rf /tmp/relnum ~/.npm
```

Node.js 20 or newer is recommended for the build. Because the install is not editable, the source folder and `node_modules` can be deleted in the same layer, which keeps the image smaller.

## Settings

The extension registers a boolean editor option named `relativeLineNumbers` (default: `true`). Like the other CodeMirror options, it can be set per cell type in the notebook settings (`@jupyterlab/notebook-extension:tracker`):

```json
{
    "codeCellConfig": {
        "lineNumbers": true,
        "relativeLineNumbers": true
    },
    "markdownCellConfig": {
        "relativeLineNumbers": false
    }
}
```

The same key works in the console (`promptCellConfig`) and the file editor (`editorConfig`).

Keep `lineNumbers` and `relativeLineNumbers` in agreement: the extension hides JupyterLab's stock gutter and draws its own, so `relativeLineNumbers: true` is only meaningful when line numbers are shown.

## Vim clipboard

The Vim layer of `jupyterlab-vim` has no `clipboard` option, so `set clipboard=unnamedplus` does nothing. This extension provides the same behavior:

- **Yank / delete / change → clipboard.** Anything that goes to Vim's unnamed register (`yy`, `y$`, `v…y`, `dd`, `dw`, `x`, `D`, `cw`...) is also written to the system clipboard. Named registers (`"ayy`) and the black hole register (`"_dd`) are left alone, and `"+` keeps working as usual.
- **Clipboard → `p`.** When the window or tab regains focus, the clipboard content is copied into the unnamed register, so `p`/`P` paste text copied in other applications. Text ending in a newline is pasted linewise.

No keybinding changes are needed. **Do not** remap `y`/`d` to `"+y`/`"+d` in the `jupyterlab-vim` settings: the Vim engine drops a count typed before a register prefix, so `5dd` would delete a single line.

Notes:

- The clipboard API only works in a secure context: `http://localhost` and HTTPS are fine, plain HTTP on a LAN address is not.
- Chromium-based browsers ask for the clipboard-read permission once. Firefox only allows reading the clipboard after a user gesture, so the automatic sync on focus is skipped there; yanking out still works, and `"+p` (which shows Firefox's paste prompt) pastes from the system clipboard.
- The clipboard is read automatically whenever the page gets focus and is only kept in memory (in the unnamed register). To disable this, remove the `focus`/`visibilitychange` listeners in `vimClipboardPlugin`.
- On Wayland (e.g. Sway) nothing extra is needed: the browser writes to the Wayland clipboard itself, so `wl-paste` and `Ctrl+V` in other applications see the yanked text.

## How it works

### Relative line numbers

CodeMirror's built-in line number gutter only redraws when the document or viewport changes, not when the cursor moves, so `formatNumber` alone can't produce relative numbers. This extension:

1. Adds a custom gutter (`cm-relativeLineNumbers`) whose markers are recomputed on every selection change.
2. Hides the stock `cm-lineNumbers` gutter with CSS (CodeMirror forces `display: flex !important`, so the rule uses `!important` as well).
3. Hides its own gutter when the stock one is absent, so JupyterLab's line number toggle keeps working.
4. Adds `highlightActiveLine()` and theme rules for the colors.

### Vim clipboard

A second plugin (`jupyterlab-relative-line-numbers:vim-clipboard`) wraps `pushText` of the register controller of `@replit/codemirror-vim`, the library behind `jupyterlab-vim`, so writes to the unnamed register are mirrored to `navigator.clipboard`. The library is declared as a singleton shared package, so both extensions use the same instance.

The code is in [`src/index.ts`](src/index.ts).

## Customizing the look

The colors are defined in the `EditorView.theme` block in `src/index.ts`:

| Element                    | Default                                      |
| -------------------------- | -------------------------------------------- |
| Other line numbers         | `var(--jp-ui-font-color2)` (gray)            |
| Current line number        | `var(--jp-ui-font-color0)` on `--jp-layout-color3`, bold |
| Current line background    | `rgba(128, 128, 128, 0.18)`                  |

Replace the values with literal colors (for example `#ffffff`, `#888888`, `#444444`) if you don't want them to follow the theme. To left-align the current line number like Vim does, add `'.cm-activeLineGutter': { textAlign: 'left' }`.

## Troubleshooting

- **Yanked text doesn't reach the clipboard:** make sure the page is served from `localhost` or HTTPS, then check the browser console for errors. If the extension loaded its own copy of `@replit/codemirror-vim` instead of sharing the one from `jupyterlab-vim`, the patch has no effect on the editor.
- **`p` pastes old text after copying elsewhere (Firefox):** expected, see the notes above; use `"+p`.

## Development

```bash
npm install
npm run build          # development build (with source maps)
pip install -e .       # editable install, only needed for development
jupyter labextension develop . --overwrite
```

Rebuild with `npm run build` and reload the browser page after each change. If you change `package.json` dependencies, run `npm install` again.

## Uninstall

```bash
pip uninstall jupyterlab_relative_line_numbers
```

## License

BSD-3-Clause
