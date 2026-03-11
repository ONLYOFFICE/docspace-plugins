# Reader Mode Plugin

## Overview

View EPUB, FB2, and DjVu files in a dedicated two-page spread reader. Supports compressed formats (.fb2.zip, .zip containing supported files).

## How to configure

To start working with the plugin, it is not needed to change the default settings.

In case you want to adjust the plugin settings, go to Settings -> Integration -> Plugins and click on the gear symbol next to the Reader Mode plugin.

## How to use

### Supported formats

The plugin supports the following file formats:

- **.epub** — Electronic Publication (EPUB 2.0/3.0)
- **.fb2** — FictionBook 2.0
- **.fb2.zip** — Compressed FictionBook files
- **.djvu / .djv** — DjVu scanned documents
- **.zip** — Archives containing EPUB, FB2, or DjVu files

### Opening files

- The plugin is available in the file's context menu (right-click on a file or click the three dots next to it).
- Select any supported file and choose Reader mode from the context menu.
- The file will open in a two-page spread view in a modal window.

### Reader interface

The reader displays books in a two-page spread layout (like an open book):

- **Navigation**: Use the ‹ and › buttons at the bottom to move between pages
- **Progress**: A progress bar shows your position in the book
- **Page counter**: Displays current page numbers and percentage complete

For DjVu files, scanned pages are rendered as images. For EPUB and FB2 files, text content is displayed with proper formatting.

### ZIP files

The plugin automatically detects book formats inside ZIP archives:

- ZIP containing a single .epub file
- ZIP containing raw EPUB structure (META-INF/container.xml)
- ZIP containing a single .fb2 file
- ZIP containing a single .djvu file

## Technical details

The plugin uses the following open-source libraries:

- [@lingo-reader](https://github.com/hhk-png/lingo-reader) — EPUB and FB2 parsing
- [djvujs](https://github.com/RussCoder/djvujs) — DjVu document rendering
- [jszip](https://github.com/Stuk/jszip) — ZIP archive handling

## User feedback and support

To ask questions and share feedback, use **Issues** in this repository. Alternatively, you can contact ONLYOFFICE team via **community.onlyoffice.com** or **feedback.onlyoffice.com**.
