## Overview

Create, edit, and insert professional-looking diagrams.

## How to configure

To start working with the plugin, it is not needed to change the default settings.

In case you want to adjust the plugin settings, go to *Settings -> Developer Tools -> Plugins* and click on the gear symbol next to the draw.io plugin.

**draw.io address**

By default the plugin uses the public service at *https://embed.diagrams.net*. If draw.io is deployed on your own server, enter its address in the *draw.io address* field and save the settings. The address may contain a path (for example, *https://your-drawio-domain.com/drawio*); the plugin adds the required query parameters itself.

Two things are required for a self-hosted instance to work:

* the portal must be allowed to embed it: the draw.io server must not send *X-Frame-Options* and its *frame-ancestors* policy must include the portal address;
* the address must be allowed by the portal Content Security Policy. The plugin registers *https://embed.diagrams.net* on installation, so any other domain has to be added by hand: go to *Settings -> Developer Tools -> JavaScript SDK* and add it under *Add the allowed domains for this workspace*. Enter the domain only, without a path, *https://your-drawio-domain.com*. The same list is available through the *GET/POST /api/2.0/security/csp* API.

## How to use

**Creating a new diagram**

* The plugin is available via the *Action button -> More* in the My documents section or in the selected room.
* When you click on the draw.io icon, a pop-up window appears where you can change/enter the file name.
* A new *.drawio* file appears in the file list.

To open the created diagram, click on the file name or do it via the *file context menu -> Actions -> Edit diagram*. The file will open in the same tab. To get back to the file list, click "Save&Exit" or "Exit".

If a diagram is opened by a user with the view rights, only the Exit button is available. Any changes made by this user will not be saved.

**Editing an exported diagram**

draw.io diagrams can be exported as images. Such images can be re-opened and edited using the plugin.

## User feedback and support

To ask questions and share feedback, use [Issues](https://github.com/ONLYOFFICE/docspace-plugins/issues) in this repository. Alternatively, you can contact ONLYOFFICE team via [community.onlyoffice.com](https://community.onlyoffice.com) or [feedback.onlyoffice.com](https://feedback.onlyoffice.com/forums/966080-your-voice-matters).