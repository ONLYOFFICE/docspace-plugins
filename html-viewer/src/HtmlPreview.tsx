/*
 * (c) Copyright Ascensio System SIA 2026
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
  type CSSProperties,
  type ReactNode,
} from "react";
import { useCurrentFile, usePluginActions } from "@onlyoffice/docspace-plugin-sdk/react";
import { Link, LinkType, Loader, LoaderTypes, Text, useTheme } from "@onlyoffice/apps-ui-kit";

import { buildHtmlDocument, hasRemoteReferences } from "./html/document";
import { highlight } from "./html/highlight";
import { t } from "./locales";
import { useHtmlFile } from "./useHtmlFile";
import styles from "./HtmlPreview.module.css";

type View = "preview" | "code";
type Device = "desktop" | "tablet" | "mobile";

// Common viewports: each wide enough for a template's media queries at that size to apply.
const DEVICES: { value: Device; width?: number; height?: number }[] = [
  { value: "desktop" },
  { value: "tablet", width: 768, height: 1024 },
  { value: "mobile", width: 375, height: 812 },
];

// What a framed device needs beyond its own width: the canvas padding and the bezel,
// both sides (.stage[data-framed] and .device in the stylesheet).
const FRAME = 2 * 24 + 2 * 10;

const centered: CSSProperties = {
  flex: "1 1 auto",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: 16,
  textAlign: "center",
};

// The kit's own chain for the accent: the portal's variable, the colour scheme's, the default.
const accent = "var(--accent-main, var(--color-scheme-main-accent, #4781d1))";

// The test the viewer makes before drawing its header, close cross and side arrows: the
// portal's mobile width (600px) or a touch screen. Where it passes there are none, and
// the plugin draws its own.
const CHROMELESS = "(max-width: 600px), (pointer: coarse)";

const useChromeless = (): boolean =>
  useSyncExternalStore(
    (onChange) => {
      const query = matchMedia(CHROMELESS);
      query.addEventListener("change", onChange);
      return () => query.removeEventListener("change", onChange);
    },
    () => matchMedia(CHROMELESS).matches,
    () => false,
  );

export function HtmlPreview() {
  const file = useCurrentFile();
  const state = useHtmlFile(file?.id);
  const { isBase } = useTheme();
  const chromeless = useChromeless();
  // Held here rather than per page, so the chosen view and width survive paging.
  const [view, setView] = useState<View>("preview");
  const [device, setDevice] = useState<Device>("desktop");

  let content: ReactNode;
  switch (state.status) {
    case "loading":
      content = (
        <Message>
          <Loader type={LoaderTypes.oval} size="40px" color={accent} label={t("state.loading")} />
        </Message>
      );
      break;
    case "empty":
      content = (
        <Message>
          <Text fontSize="14px">{t("state.empty")}</Text>
        </Message>
      );
      break;
    case "error":
      content = (
        <Message>
          <Text fontSize="14px">
            {t(state.kind === "noFile" ? "state.noFile" : "state.loadFailed")}
          </Text>
        </Message>
      );
      break;
    case "ready":
      content = (
        <PageView
          key={String(state.fileId)}
          source={state.source}
          view={view}
          device={device}
          onView={setView}
          onDevice={setDevice}
        />
      );
      break;
  }

  return (
    <div
      id="html-viewer-root"
      className={styles.root}
      data-theme={isBase ? "light" : "dark"}
      data-chromeless={chromeless || undefined}
    >
      <div className={styles.card}>
        {content}
        {chromeless && <Pager title={file?.title} />}
      </div>
    </div>
  );
}

// The viewer pages through the folder on ← and → pressed anywhere in the document, and
// a plugin has no other way to ask it to: the playlist is the portal's, not the plugin's.
// ponytail: relies on the viewer's own key handler, not on the SDK - switch to an SDK
// paging action once there is one.
const page = (key: "ArrowLeft" | "ArrowRight") =>
  document.dispatchEvent(new KeyboardEvent("keydown", { key, code: key, bubbles: true }));

/**
 * Where the viewer draws no side arrows and no header - on a phone or a tablet - its
 * only paging is a swipe, which the preview frame swallows. So the file name and the
 * arrows are drawn here. At either end of the folder an arrow does nothing, as the
 * swipe does: the plugin cannot see the playlist.
 */
function Pager({ title }: { title?: string }) {
  return (
    <div id="html-viewer-pager" className={styles.pager}>
      <button
        id="html-viewer-previous"
        type="button"
        className={styles.action}
        aria-label={t("file.previous")}
        title={t("file.previous")}
        onClick={() => page("ArrowLeft")}
      >
        {icons.previous}
      </button>
      <span className={styles.fileName}>{title}</span>
      <button
        id="html-viewer-next"
        type="button"
        className={styles.action}
        aria-label={t("file.next")}
        title={t("file.next")}
        onClick={() => page("ArrowRight")}
      >
        {icons.next}
      </button>
    </div>
  );
}

/** A state with no toolbar yet still needs the way out on a phone. */
function Message({ children }: { children: ReactNode }) {
  const chromeless = useChromeless();
  return (
    <>
      {chromeless && (
        <div className={styles.closeBar}>
          <CloseButton />
        </div>
      )}
      <div style={centered}>{children}</div>
    </>
  );
}

function PageView({
  source,
  view,
  device,
  onView,
  onDevice,
}: {
  source: string;
  view: View;
  device: Device;
  onView: (view: View) => void;
  onDevice: (device: Device) => void;
}) {
  // Per page, not kept while paging: each file's remote content is a separate choice.
  const [allowRemote, setAllowRemote] = useState(false);
  const remote = useMemo(() => hasRemoteReferences(source), [source]);
  const srcDoc = useMemo(() => {
    try {
      return buildHtmlDocument(source, { allowRemote });
    } catch {
      return null; // the source is still worth showing
    }
  }, [source, allowRemote]);
  const preview = view === "preview" && srcDoc !== null;
  const chromeless = useChromeless();

  // A device is offered only where its frame fits the card. One that does not is hidden
  // rather than squeezed - a phone frame on a phone is no preview - and the choice is
  // kept, so it comes back when the window is widened again.
  const toolbar = useRef<HTMLDivElement>(null);
  const [cardWidth, setCardWidth] = useState(0);
  useLayoutEffect(() => {
    const element = toolbar.current!;
    const measure = () => setCardWidth(element.offsetWidth);
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    measure(); // before the first paint, so no frame flashes on a phone
    return () => observer.disconnect();
  }, []);
  const devices = DEVICES.filter((d) => !d.width || d.width + FRAME <= cardWidth);
  const size = devices.find((d) => d.value === device) ?? DEVICES[0];

  return (
    <>
      <div id="html-viewer-toolbar" ref={toolbar} className={styles.toolbar}>
        <Segmented
          id="html-viewer-view"
          label={t("view.label")}
          value={preview ? "preview" : "code"}
          onChange={onView}
          options={[
            { value: "preview", label: t("view.preview"), icon: icons.eye },
            { value: "code", label: t("view.code"), icon: icons.code },
          ]}
        />
        {preview && devices.length > 1 && (
          <div className={styles.center}>
            <Segmented
              id="html-viewer-device"
              label={t("device.label")}
              value={size.value}
              onChange={onDevice}
              iconsOnly
              options={devices.map(({ value, width }) => ({
                value,
                label: t(`device.${value}`),
                title: width ? `${t(`device.${value}`)} · ${width} px` : t(`device.${value}`),
                icon: icons[value],
              }))}
            />
          </div>
        )}
        <div className={styles.end}>
          <CopyButton source={source} />
          {chromeless && <CloseButton />}
        </div>
      </div>

      {preview && remote && (
        <div id="html-viewer-remote" className={styles.notice}>
          {icons.shield}
          {!allowRemote && <span>{t("images.blocked")}</span>}
          <Link
            type={LinkType.action}
            fontSize="12px"
            color="accent"
            onClick={() => setAllowRemote((v) => !v)}
          >
            {allowRemote ? t("images.hide") : t("images.load")}
          </Link>
        </div>
      )}

      {preview ? (
        <div
          className={styles.stage}
          data-device={size.value}
          data-framed={size.width ? "" : undefined}
        >
          <div className={styles.device} style={{ width: size.width, height: size.height }}>
            <iframe
              id="html-viewer-frame"
              title={t("body.title")}
              sandbox="allow-popups allow-popups-to-escape-sandbox"
              srcDoc={srcDoc ?? undefined}
            />
          </div>
        </div>
      ) : (
        <CodeView source={source} />
      )}
    </>
  );
}

function CodeView({ source }: { source: string }) {
  // Highlighted only once the source is asked for; most files are only ever previewed.
  const html = useMemo(() => highlight(source), [source]);
  // Every character of the source is escaped by highlight(); only its own spans are markup.
  return (
    <pre
      id="html-viewer-code"
      className={styles.code}
      dir="ltr"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

type Option<T> = { value: T; label: string; title?: string; icon: ReactNode };

/** A row of toggle buttons with a selected background that slides between them. */
function Segmented<T extends string>({
  id,
  label,
  value,
  options,
  onChange,
  iconsOnly,
}: {
  id: string;
  label: string;
  value: T;
  options: Option<T>[];
  onChange: (value: T) => void;
  iconsOnly?: boolean;
}) {
  // No arrow-key handling: while the viewer is open ←/→ page between files.
  const index = options.findIndex((o) => o.value === value);
  return (
    <div
      id={id}
      role="group"
      aria-label={label}
      className={styles.segmented}
      style={{ "--count": options.length, "--index": index } as CSSProperties}
    >
      <span className={styles.thumb} aria-hidden />
      {options.map((o) => (
        <button
          key={o.value}
          id={`${id}-${o.value}`}
          type="button"
          className={styles.segment}
          aria-pressed={o.value === value}
          aria-label={o.label}
          title={o.title}
          onClick={() => onChange(o.value)}
        >
          {o.icon}
          {!iconsOnly && <span className={styles.label}>{o.label}</span>}
        </button>
      ))}
    </div>
  );
}

function CopyButton({ source }: { source: string }) {
  const [result, setResult] = useState<"done" | "failed" | null>(null);

  // The outcome replaces the label for a moment; a toast may sit under the media viewer.
  useEffect(() => {
    if (!result) return;
    const timer = setTimeout(() => setResult(null), 2000);
    return () => clearTimeout(timer);
  }, [result]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(source);
      setResult("done");
    } catch {
      setResult("failed");
    }
  };

  const label = t(result ? `copy.${result}` : "copy.label");
  return (
    <button
      id="html-viewer-copy"
      type="button"
      className={styles.action}
      data-state={result ?? undefined}
      aria-label={label}
      onClick={copy}
    >
      {result === "done" ? icons.check : icons.copy}
      <span className={styles.label}>{label}</span>
    </button>
  );
}

/** Only where the viewer draws no close cross of its own. */
function CloseButton() {
  const { closeMediaViewer } = usePluginActions();
  return (
    <button
      id="html-viewer-close"
      type="button"
      className={`${styles.action} ${styles.close}`}
      aria-label={t("close")}
      title={t("close")}
      onClick={() => closeMediaViewer()}
    >
      {icons.close}
    </button>
  );
}

const icon = (children: ReactNode) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden
  >
    {children}
  </svg>
);

const icons = {
  eye: icon(
    <>
      <path d="M1.5 8S4 3.25 8 3.25 14.5 8 14.5 8 12 12.75 8 12.75 1.5 8 1.5 8Z" />
      <circle cx="8" cy="8" r="2" />
    </>,
  ),
  code: icon(<path d="M5 4.5 1.75 8 5 11.5M11 4.5 14.25 8 11 11.5M9.25 3l-2.5 10" />),
  desktop: icon(
    <>
      <rect x="1.5" y="2.25" width="13" height="9" rx="1.5" />
      <path d="M5.5 14h5M8 11.25V14" />
    </>,
  ),
  tablet: icon(
    <>
      <rect x="2.75" y="1.5" width="10.5" height="13" rx="1.5" />
      <path d="M7 12.25h2" />
    </>,
  ),
  mobile: icon(
    <>
      <rect x="4.25" y="1.5" width="7.5" height="13" rx="1.75" />
      <path d="M7.25 12.25h1.5" />
    </>,
  ),
  copy: icon(
    <>
      <rect x="5.5" y="5.5" width="8.5" height="8.5" rx="1.5" />
      <path d="M10.5 5.5v-2A1.5 1.5 0 0 0 9 2H3.5A1.5 1.5 0 0 0 2 3.5V9a1.5 1.5 0 0 0 1.5 1.5h2" />
    </>,
  ),
  check: icon(<path d="m3 8.5 3.25 3.25L13 5" />),
  close: icon(<path d="m4 4 8 8m0-8-8 8" />),
  previous: icon(<path d="M10 3.5 5.5 8l4.5 4.5" />),
  next: icon(<path d="M6 3.5 10.5 8 6 12.5" />),
  shield: icon(
    <path d="M8 1.75 2.75 3.5v4c0 3.25 2.25 5.75 5.25 6.75 3-1 5.25-3.5 5.25-6.75v-4L8 1.75Z" />,
  ),
};
