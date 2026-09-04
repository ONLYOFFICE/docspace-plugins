## Overview

Generate a QR code for the public sharing link of a file, folder, or room — from the context menu or from its own tab in the info panel. No external service is called, the code is rendered entirely in the browser.

## How to configure

To start working with the plugin, it is not needed to change the default settings.

## How to use

From the context menu:

- Make sure the file, folder, or room already has a public link enabled (Sharing settings → General access).
- Open the context menu for that item in the file list.
- Click **Get QR code**.

A dialog opens with the QR code for the item's public link. Scan it with a phone camera, or click **Copy link** to copy the URL to the clipboard.

From the info panel:

- Select a file, folder, or room.
- Open its info panel and switch to the **QR code** tab.

The tab shows the same QR code for whatever is currently selected, updating as the selection changes.

If the item has no public link yet, the dialog or tab asks to create one from the sharing settings first — the plugin only reads an existing link, it never creates or changes sharing settings on its own. For a room that has no link because its room type does not support one at all (Collaboration and Virtual Data rooms — only Public, Custom and Form filling rooms do), it says so instead of suggesting to create one.

## User feedback and support

To ask questions and share feedback, use [Issues](https://github.com/ONLYOFFICE/docspace-plugins/issues) in this repository. Alternatively, you can contact ONLYOFFICE team via [community.onlyoffice.com](https://community.onlyoffice.com).
