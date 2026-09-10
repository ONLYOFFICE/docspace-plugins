## Overview

Open `.eml` and `.msg` email files right in DocSpace. A click on a message in the file list opens it in the viewer: subject, sender, recipients and date, the message body, and the list of attachments. Any attachment can be saved into the folder the message is in, one at a time or all at once. Everything is parsed in the browser; no external service is called and the message never leaves the portal.

Supported formats:

- `.eml` — MIME messages as saved by Thunderbird, Apple Mail, Gmail ("Download message"), most mail servers and archiving tools.
- `.msg` — Outlook items (the OLE compound file format). Embedded messages are listed as `.msg` attachments.

## How to configure

To start working with the plugin, it is not needed to change the default settings.

## How to use

- Upload `.eml` or `.msg` files to a room or to My documents.
- Click a message in the file list. It opens in the DocSpace viewer; the arrow keys or the side strips page through the other messages in the same folder.
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
npm install
npm run build
```

The uploadable archive is `dist/plugin.zip`. `npm test` runs the parser and sanitiser tests; `npm run typecheck` runs the compiler.

`@docspace/ui-kit` and `@onlyoffice/docspace-plugin-sdk` 3.x are not published to npm yet, so they are installed from the tarballs next to this file. The bundle keeps both external; the portal supplies its own copies at load time.
