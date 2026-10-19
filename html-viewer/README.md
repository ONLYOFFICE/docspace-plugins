## Overview

Open `.html` and `.htm` files right in ONLYOFFICE Apps and see them the way a browser renders them: web pages, landing pages, email templates, exported reports. A click on a file shows the page at desktop, tablet or phone width, with the highlighted source one click away. Everything happens in the browser; no external service is called.

## How to configure

To start working with the plugin, it is not needed to change the default settings.

## How to use

- Upload `.html` or `.htm` files to a room or to My documents.
- Click a file in the list, or choose **More options → Preview HTML** in its context menu. It opens in the ONLYOFFICE Apps viewer; the arrow keys or the side strips page through the other HTML files in the same folder.
- The icons in the middle of the toolbar switch the width of the preview: desktop, tablet (768 px) or phone (375 px). At the tablet and phone widths the page is shown in a device frame, and the template's media queries for that width apply. Only the widths whose frame fits the window are offered, so on a phone the preview simply fills the screen. There the viewer has no header, close button or side arrows of its own, and its swipe does not reach through the preview, so the plugin adds a close button at the top and the file name with arrows to the previous and next file at the bottom.
- Remote images are blocked by default, because loading them tells the server that hosts them the file was opened. Click **Load images** to show them for the current file.
- **Code** shows the source exactly as it is stored, with syntax highlighting (including the CSS in `<style>` blocks and `style` attributes) and line numbers. **Copy HTML** puts it on the clipboard.

The page is sanitised and rendered in an isolated frame: scripts, forms and embedded objects are removed, and links open in a new tab.

## Limitations

- Scripts do not run, so a page that builds its content with JavaScript shows only its static markup.
- Images and styles referenced by a relative path (`images/logo.png`) are not resolved. Use absolute URLs or embedded `data:` images.
- The Codemirror plugin opens `.html` and `.htm` files too. With both plugins enabled, a click goes to the one the portal loaded last. **Preview HTML** in the context menu always opens this viewer, and **Edit file with Codemirror** stays available.

## User feedback and support

To ask questions and share feedback, use [Issues](https://github.com/ONLYOFFICE/docspace-plugins/issues) in this repository. Alternatively, you can contact ONLYOFFICE team via [community.onlyoffice.com](https://community.onlyoffice.com).

## Build

```sh
yarn
yarn build
```

The uploadable archive is `dist/plugin.zip`. `yarn test` runs the sanitiser, decoding and highlighting tests; `yarn typecheck` runs the compiler.
