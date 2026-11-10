## Overview

Open `.eml` and `.msg` email files right in ONLYOFFICE Apps. A click on a message in the file list opens it in the viewer: subject, sender, recipients and date, the message body, and the list of attachments. Any attachment can be saved into the folder the message is in, one at a time or all at once. Everything is parsed in the browser; no external service is called and the message never leaves the portal.

Supported formats:

- `.eml` — MIME messages as saved by Thunderbird, Apple Mail, Gmail ("Download message"), most mail servers and archiving tools.
- `.msg` — Outlook items (the OLE compound file format). Embedded messages are listed as `.msg` attachments.

## How to configure

To start working with the plugin, it is not needed to change the default settings.

## How to use

- Upload `.eml` or `.msg` files to a room or to My documents.
- Click a message in the file list. It opens in the portal's media viewer; the arrow keys or the side strips page through the other messages in the same folder.
- Attachments are listed under the headers. Click **Save to this folder** next to one of them, or **Save all**, to copy them into the current folder next to the message. Images that are shown inside the body are not listed as attachments.
- Remote images in HTML messages are blocked by default, because loading them tells the sender the message was opened. Click **Load images** to show them for the current message.

The HTML body is sanitised and rendered in an isolated frame: scripts, forms and embedded objects are removed, and links open in a new tab.

## Limitations

- Outlook messages whose body is stored only as RTF are shown as plain text. The HTML is not extracted from the RTF wrapper.
- Encrypted or signed (S/MIME) messages are shown as they are stored: the signature is listed as an attachment and an encrypted body is not decrypted.
- Calendar invitations are shown as regular messages; the `.ics` part is listed as an attachment.

## User feedback and support

To ask questions and share feedback, use [Issues](https://github.com/ONLYOFFICE/docspace-plugins/issues) in this repository. Alternatively, you can contact ONLYOFFICE team via [community.onlyoffice.com](https://community.onlyoffice.com).

## Build

```sh
yarn
yarn build
```

The uploadable archive is `dist/plugin.zip`. `yarn test` runs the unit tests; `yarn typecheck` runs the compiler; `yarn format` applies Prettier.

## Code layout

The code is grouped by feature: a folder holds a feature's components, its hooks, its stylesheet and its plain logic, so a change to one feature stays in one folder.

| Folder           | What lives there                                                                                                                                                                                                                             |
| ---------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `index.ts`       | The plugin class: registers the `.eml` and `.msg` file items and opens the viewer.                                                                                                                                                           |
| `viewer/`        | The media viewer's content: `EmailPreview` loads the file (`useEmail`) and picks a state, `MessageView` lays out a parsed message.                                                                                                           |
| `headers/`       | The From / To / Cc / Bcc / Date block and the sender avatar.                                                                                                                                                                                 |
| `attachments/`   | The attachment list and saving: `pick-folder.ts` (the portal's folder selector), `upload.ts` (the upload session and the bytes), `save-store.ts` (the save in progress, shared by every open message), `useSaveAttachments`, `SaveProgress`. |
| `remote-images/` | The bar about images from the internet, and `csp-probe.ts`, which finds the sites the portal's Content Security Policy refuses.                                                                                                              |
| `html-frame/`    | Showing the body on the portal's `/static/html-frame/` page, with `srcdoc` as the fallback.                                                                                                                                                  |
| `email/`         | Parsing `.eml` and `.msg`, sanitising the HTML body, formatting. No SDK and no hooks: plain functions with their tests (`linkify` returns React nodes).                                                                                      |
| `ui/`            | What every feature shares: icons and the theme variables (`tokens.ts`).                                                                                                                                                                      |
| `locales/`       | Translations, one JSON file per portal language, read through i18n-js.                                                                                                                                                                       |

## Conventions

- **Files.** A React component is `PascalCase.tsx`, a hook `useCamelCase.ts`, any other module `kebab-case.ts`, a feature's stylesheet `<folder>.module.css`, a test `<module>.test.ts` beside its module.
- **Dependencies point inward.** A component may use its own folder's hooks and modules, `email/`, `ui/` and `locales/`. `email/` imports nothing from the plugin and nothing from the SDK, and holds no hooks; feature folders do not reach into each other except through what `viewer/` composes. Logic that can be a plain function is one, in a `kebab-case.ts` module, and gets a test.
- **Types.** The plugin's own types carry no prefix (`SaveJob`, `FileInfo`); the `T`/`I` prefixes belong to the SDK's types.
- **Styles.** Layout that never changes stays inline; hover states, the theme (`:global(.dark)`) and anything that follows the viewer's chrome go into the folder's CSS module, whose classes Vite hashes with the plugin name. Colours come from the portal's theme variables through `ui/tokens.ts`; secondary text is `SECONDARY_TEXT`, never `--text-disable-color`.
- **Strings.** Every visible string goes through `i18n.t()` with its key in all locale files, placeholders written `%{name}`.
- **Comments** say why: what the portal or the viewer does that the code works around, not what the next line does.
- **Formatting** is Prettier's (`yarn format`); the copyright header opens every source file.
