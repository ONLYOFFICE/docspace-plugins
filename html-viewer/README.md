## Overview

Open `.html` and `.htm` files right in ONLYOFFICE Apps and see them the way a browser renders them: web pages, landing pages, email templates, exported reports. A click on a file shows the page at desktop, tablet or phone width, with the highlighted source one click away. Everything happens in the browser; no external service is called.

## How to configure

To start working with the plugin, it is not needed to change the default settings.

## How to use

- Upload `.html` or `.htm` files to a room or to My documents.
- Click a file in the list, or choose **More options → Preview HTML** in its context menu. It opens in the ONLYOFFICE Apps viewer; the arrow keys or the side strips page through the other HTML files in the same folder.
- The icons in the middle of the toolbar switch the width of the preview: desktop, tablet (768 px) or phone (375 px). At the tablet and phone widths the page is shown in a device frame, and the template's media queries for that width apply. Only the widths whose frame fits the window are offered, so on a phone the preview simply fills the screen. There the viewer has no header, close button or side arrows of its own, and its swipe does not reach through the preview, so the plugin adds a close button at the top and the file name with arrows to the previous and next file at the bottom.
- Images, fonts and stylesheets from other websites load only from sites the portal's Content Security Policy allows: the preview frame inherits it, and by default it allows only the portal's own resources. An administrator adds sites in **Developer tools → JavaScript SDK**; note that a site added there is trusted by the whole portal, for scripts too. When the page references other websites, a note above it says that their images depend on these settings.
- **Code** shows the source exactly as it is stored, with syntax highlighting (including the CSS in `<style>` blocks and `style` attributes) and line numbers. **Copy HTML** puts it on the clipboard.
- If you may edit the file, the source in **Code** is editable. **Preview** shows the edited page right away, before anything is saved. **Save** (or Ctrl+S) writes the file as a new version, with the line breaks it had; the undo button drops the changes. If someone else saved the file after you started editing, **Save** stops and offers to overwrite their version or to discard your changes and load theirs. The viewer does not close over unsaved changes: it asks first.

The page is sanitised and rendered in an isolated frame: scripts, forms and embedded objects are removed, links within the page scroll the preview, and other links open in a new tab.

## Limitations

- Scripts do not run, so a page that builds its content with JavaScript shows only its static markup.
- The source is saved in UTF-8. A page that declared another charset (for example, windows-1251) is saved with a UTF-8 byte order mark, so browsers keep reading it correctly. A file whose bytes do not match its charset (windows-1251 with no `<meta charset>`, say) opens read-only: saving it would lose those characters.
- Files over 100 KB show their source as plain text, without highlighting or line numbers.
- An empty file cannot be edited here: it opens as empty.
- Relative paths (`images/logo.png`) are not resolved. Images embedded as `data:` URLs always show; images on other websites only as described above.
- The Codemirror plugin opens `.html` and `.htm` files too. With both plugins enabled, a click goes to the one the portal loaded last. **Preview HTML** in the context menu always opens this viewer, and **Edit file with Codemirror** stays available.

## User feedback and support

To ask questions and share feedback, use [Issues](https://github.com/ONLYOFFICE/docspace-plugins/issues) in this repository. Alternatively, you can contact ONLYOFFICE team via [community.onlyoffice.com](https://community.onlyoffice.com).

## Build

```sh
yarn
yarn build
```

The uploadable archive is `dist/plugin.zip`. `yarn test` runs the sanitiser, decoding and highlighting tests; `yarn typecheck` runs the compiler.
