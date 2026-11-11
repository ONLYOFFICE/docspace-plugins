## Overview

Open `.html` and `.htm` files right in ONLYOFFICE Apps and see them the way a browser renders them: web pages, landing pages, email templates, exported reports. A click on a file shows the page at desktop, tablet or phone width, with the highlighted source one click away. Everything happens in the browser; no external service is called.

## How to configure

To start working with the plugin, it is not needed to change the default settings.

## How to use

- Upload `.html` or `.htm` files to a room or to My documents.
- Click a file in the list, or choose **More options → Preview HTML** in its context menu. It opens in the ONLYOFFICE Apps viewer; the arrow keys or the side strips page through the other HTML files in the same folder.
- The icons in the middle of the toolbar switch the width of the preview: desktop, tablet (768 px) or phone (375 px). At the tablet and phone widths the page is shown in a device frame, and the template's media queries for that width apply. Only the widths whose frame fits the window are offered, so on a phone the preview simply fills the screen. There the viewer has no header, close button or side arrows of its own, and its swipe does not reach through the preview, so the plugin adds a close button at the top and the file name with arrows to the previous and next file at the bottom.
- Images, fonts and stylesheets from other websites load in the preview: the portal shows it on its `/static/html-frame/` page, which has a Content Security Policy of its own. On a portal without that page the preview frame inherits the portal's policy, which by default allows only the portal's own resources. An administrator adds sites in **Developer tools → JavaScript SDK**; note that a site added there is trusted by the whole portal, for scripts too. There, when the page references other websites, a note above it says that their images depend on these settings.
- **Code** shows the source exactly as it is stored, with syntax highlighting (including the CSS in `<style>` blocks and `style` attributes) and line numbers. **Copy HTML** puts it on the clipboard.
- If you may edit the file, the source in **Code** is editable. **Preview** shows the edited page right away, before anything is saved. **Save** (or Ctrl+S) writes the file as a new version, with the line breaks it had; the undo button drops the changes after asking. If someone else saved the file after you started editing, **Save** stops and offers to overwrite their version or to discard your changes and load theirs. The viewer does not close over unsaved changes: it asks first.

The page is sanitised and rendered in an isolated frame: scripts, forms and embedded objects are removed, links within the page scroll the preview, and other links open in a new tab.

## Limitations

- Scripts do not run, so a page that builds its content with JavaScript shows only its static markup.
- The source is saved in UTF-8. A page that declared another charset (for example, windows-1251) is saved with a UTF-8 byte order mark, so browsers keep reading it correctly. A file whose bytes do not match its charset (windows-1251 with no `<meta charset>`, say) opens read-only: saving it would lose those characters.
- Files over 100 KB show their source as plain text, without highlighting or line numbers.
- An empty file cannot be edited here: it opens as empty.
- Relative paths (`images/logo.png`) are not resolved; protocol-relative ones (`//example.com/logo.png`) load over https. Images embedded as `data:` URLs always show; images on other websites only as described above.
- The Codemirror plugin opens `.html` and `.htm` files too. With both plugins enabled, a click goes to the one the portal loaded last. **Preview HTML** in the context menu always opens this viewer, and **Edit file with Codemirror** stays available.

## User feedback and support

To ask questions and share feedback, use [Issues](https://github.com/ONLYOFFICE/docspace-plugins/issues) in this repository. Alternatively, you can contact ONLYOFFICE team via [community.onlyoffice.com](https://community.onlyoffice.com).

## Build

```sh
yarn
yarn build
```

The uploadable archive is `dist/plugin.zip`. `yarn test` runs the sanitiser, decoding and highlighting tests; `yarn typecheck` runs the compiler; `yarn format` applies Prettier.

## Code layout

The code is grouped by feature: a folder holds a feature's components, its hooks, its stylesheet and its plain logic, so a change to one feature stays in one folder.

| Folder     | What lives there                                                                                                                                                                                                                                   |
| ---------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `index.ts` | The plugin class: registers the `.html` and `.htm` file items and the **Preview HTML** context menu item, and opens the viewer.                                                                                                                    |
| `viewer/`  | The media viewer's content: `HtmlPreview` reads the file and picks a state, `PageView` lays out one file - toolbar, conflict bar, preview or source. On a phone, the close button and the pager. The theme colours (`--hv-*`) are set on its root. |
| `preview/` | The page as a browser draws it: `PreviewFrame` (the portal's `showHtmlInFrame` action, `srcdoc` where the portal has none) and the device widths.                                                                                                  |
| `code/`    | The source view: highlighted lines with a textarea over them.                                                                                                                                                                                      |
| `file/`    | The file itself: reading it (`useHtmlFile`), the drafts and saving them (`edits.ts`), the Save button and the questions before a draft is dropped.                                                                                                 |
| `html/`    | Sanitising, decoding and highlighting HTML. No SDK and no hooks: plain functions with their tests.                                                                                                                                                 |
| `ui/`      | What every feature shares: the buttons and the segmented control (`ui.module.css`), icons, the Ctrl+S test.                                                                                                                                        |
| `locales/` | Translations, one JSON file per portal language, read through i18n-js.                                                                                                                                                                             |

## Conventions

- **Files.** A React component is `PascalCase.tsx`, a hook `useCamelCase.ts`, any other module `kebab-case.ts`, a feature's stylesheet `<folder>.module.css`, a test `<module>.test.ts` beside its module.
- **Dependencies point inward.** A component may use its own folder's hooks and modules, `html/`, `ui/` and `locales/`; feature folders do not reach into each other; `viewer/` composes them. `html/` imports nothing from the plugin and nothing from the SDK, and holds no hooks.
- **Styles.** Layout that never changes stays inline; everything else goes into the folder's CSS module, whose classes Vite hashes with the plugin name. Colours come from the portal's theme variables or from the `--hv-*` palette on the viewer's root. A button variant stays in `ui.module.css` next to `.action`, so its order against it does not depend on the order of imports.
- **Strings.** Every visible string goes through `i18n.t()` with its key in all locale files.
- **Comments** say why: what the portal or the viewer does that the code works around, not what the next line does.
- **Formatting** is Prettier's (`yarn format`); the copyright header opens every source file.
