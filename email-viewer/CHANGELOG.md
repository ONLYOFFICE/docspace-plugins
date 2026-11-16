# Change Log

## 1.0.0

### Added

- Initial version.
- `.eml` and `.msg` files open in the media viewer: headers, HTML or plain-text body, attachments.
- Attachments can be saved, one at a time or all at once, into a folder picked in the portal's folder selector, with the progress shown under the attachments.
- Remote images in HTML bodies are blocked until the reader chooses to load them. On a portal that serves `/static/html-frame/`, the body is shown there and remote images, styles and fonts load whatever the portal's Content Security Policy allows; elsewhere the viewer lists the sites that policy blocks.
- A phone layout: the viewer draws no header for a plugin there, so the message has its own bar with a back button and arrows to the previous and next message, and its text can be selected and copied on touch screens.
- Translated into all portal languages.
