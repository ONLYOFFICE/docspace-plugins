# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository layout

Each top-level folder is an independent ONLYOFFICE Apps (formerly DocSpace) plugin with its own `package.json`, `yarn.lock` and `node_modules`. There is no root package or workspace, and no code is shared between plugins: helpers such as `createAPIUrl` or the locale setup are copied into every plugin, so a cross-cutting change has to be made in each folder.

The folder name and the plugin name are not always the same: `archives` is `zip-archives` and `reader` is `book-reader`. The `name` field in `package.json` is the plugin's identity in the portal and on S3; the folder name is used for git tags and release assets.

## Commands

Run these inside a plugin folder. Dependencies use Yarn classic (1.x); `yarn.lock` is committed and the release build runs `yarn install --frozen-lockfile`, so keep it in sync with `package.json`.

```sh
yarn                     # install
yarn build               # vite build -> dist/plugin.js, then build-docspace-plugin -> dist/plugin.zip
npx tsc --noEmit -p .    # type check (vite build does not type-check)
yarn format              # prettier --write . (printWidth differs per plugin)
```

There are no tests or linters. To build everything: `for d in */; do (cd "$d" && [ -f package.json ] && yarn && yarn build); done`.

## How a plugin is built and loaded

- **Plugins SDK 3.0, module runtime.** `package.json` has `"runtime": "module"`. `src/index.ts` defines a class implementing `IPlugin` plus one interface per scope (`IContextMenuPlugin`, `IFilePlugin`, `ISettingsPlugin`, ...), registers its items, and `export default plugin`. The portal (ONLYOFFICE Apps 4.0.0+) loads `plugin.js` with `import()` directly into the portal window, not into an iframe. So there is no `window.parent`, globals and `window` message listeners are shared with the portal, and patching globals affects the whole portal.
- **`vite.config.ts`** builds an ES library into a single `dist/plugin.js`. `react`, `react-dom`, `react/jsx-runtime` and `@onlyoffice/docspace-plugin-sdk/react` stay external because the portal supplies them at load time. A second bundled React would break the SDK hooks.
- **`config.json` is generated, not edited.** `build-docspace-plugin` (from the SDK) writes it from `package.json`: `name` (lowercased), `version`, `nameLocale`, `descriptionLocale`, `pluginName`, `scopes` (array joined into a string), `cspDomains` (array joined into a string), `logo` (becomes `image`) and `runtime`. `minDocSpaceVersion` comes from the SDK package. The listed `scopes` must match the interfaces the plugin class implements.
- **`assets/`** is copied flat (no subfolders) into the zip. Item icons and the logo are referenced by bare file name.
- **UI is declarative.** Item callbacks return an `IMessage` whose `actions` (`Actions.showModal`, `Actions.showToast`, `Actions.updateProps`, `Actions.saveSettings`, ...) tell the portal what to do. Dialogs and settings are trees of SDK component descriptors (`IBox`, `IButton`, `IModalDialog`, `IInput`, ...); no plugin here renders its own React.
- **Editors and viewers live in an iframe.** archives, codemirror, draw.io, image-editor, markdown and reader put a `Components.iFrame` into their modal. They then find it in the portal DOM by name or id and write HTML into `iframe.contentWindow.document`, or point it at an external editor and talk to it with `postMessage` (draw.io). That `about:blank` iframe has the portal's origin.
- **Portal API.** Calls go through `fetch` to `${apiURL}/files/...`, where `apiURL` is built from `plugin.getAPI()` (origin + proxy + prefix) by each plugin's `createAPIUrl`. They rely on the user's portal session.
- **Admin settings.** Under the `Settings` scope, a value is saved with `Actions.saveSettings` and comes back as a string through `setAdminPluginSettingsValue`.
- **External services and CSP.** Any third-party origin the plugin fetches from or frames (ConvertAPI, AssemblyAI, draw.io, CDNs) must be listed in `cspDomains` in `package.json`. The portal adds these domains to its Content-Security-Policy when the plugin is installed or enabled and removes them when it is disabled; without them the request is blocked by `connect-src`/`frame-src`.
- **Localization.** `src/locales/<lang>.json` files are wired up in `src/locales/index.ts` (i18n-js, keyed by `PluginLocale`). `setLanguage` recreates the items so their labels update. When adding a string, add the key to every locale file.

## Testing in a portal

Upload `dist/plugin.zip` in Settings → Integration → Plugins, or with `POST /api/2.0/settings/webplugins`. The portal serves `plugin.js?hash=<version>`, so bump the version when re-uploading a changed build, or the browser may keep the cached file. The portal backend caches plugin metadata indefinitely: system plugins replaced directly in storage keep their old `config.json` (including `runtime` and `cspDomains`) until the backend restarts.

## Branches, releases and changelog

- Work goes into `feature/*` or `bugfix/*` branches merged into `develop` through pull requests; `develop` is protected. Commit subjects follow `<plugin>: <change>`.
- On a push to `master`, CI creates a tag `<folder>/<version>` for every plugin whose version has no tag yet. The job fails if that plugin's `CHANGELOG.md` has no exact `## <version>` heading. The tag triggers a GitHub release with `<folder>-<version>.zip` and the release notes from that changelog section. The same push publishes every plugin to S3 under `webplugins/<package name>`.
- A release therefore needs both the `version` bump in `package.json` and a matching `## x.y.z` section in `CHANGELOG.md`, with `### Added` / `### Changed` / `### Fixed` subsections.
- A licenses workflow checks every plugin's dependency licenses on pushes and pull requests to `master`/`develop`, so new dependencies must be compatible with the repository license (Apache-2.0).
- Most source files begin with the Apache-2.0 "(c) Copyright Ascensio System SIA" header; add it to new source files.
