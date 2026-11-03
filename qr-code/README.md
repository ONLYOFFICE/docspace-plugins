## Overview

Generate a QR code for the shared link of a file, folder, or room — the same link as on the **Share** tab of the info panel. It opens from the context menu or from its own tab in the info panel. No external service is called, the code is rendered entirely in the browser.

## How to configure

To start working with the plugin, it is not needed to change the default settings.

## How to use

From the context menu:

- Open the context menu for a file, folder, or room in the file list.
- Click **Get QR code**.

A dialog opens with the QR code for the item's shared link. Scan it with a phone camera, or click **Copy link** to copy the URL to the clipboard.

From the info panel:

- Select a file, folder, or room.
- Open its info panel and switch to the **QR code** tab.

The tab shows the same QR code for whatever is currently selected, updating as the selection changes. Copy the link with the icon next to its name.

Under the code, the link is shown as on the **Share** tab: who can open it, its access rights, how long it is valid and whether it has a password. These are set on the **Share** tab (**Contacts** for a room), which the note above the code opens in one click; the QR code follows them, and stops working when the link is revoked or expires.

If the item has no shared link yet, the tab points to the **Share** tab (**Contacts** for a room) to create one there, and the dialog also offers **Create link**. Only that button creates one — with read-only access, no password and no time limit — opening the dialog or the tab never changes sharing settings. If the link cannot be loaded, **Try again** requests it once more.

The menu item and the tab are shown only to users who may copy the item's link, and for rooms only in a Public room, a Custom room or a Form Filling Space: other room types have no room-level public link. These filters need a portal that supports `itemSecurity` and `roomType` on info panel and context menu items; an older portal shows both everywhere and says so for a room without a public link.

## User feedback and support

To ask questions and share feedback, use [Issues](https://github.com/ONLYOFFICE/docspace-plugins/issues) in this repository. Alternatively, you can contact ONLYOFFICE team via [community.onlyoffice.com](https://community.onlyoffice.com).
