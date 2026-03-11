import { Components } from "@onlyoffice/docspace-plugin-sdk";

// Iframe utilities

export function findIframe(name: string): HTMLIFrameElement | null {
  return (
    (window.parent?.document?.getElementsByName(
      name,
    )[0] as HTMLIFrameElement) ??
    (document.getElementsByName(name)[0] as HTMLIFrameElement) ??
    null
  );
}

export function makeIframeBody(frameName: string, height: string = "90vh") {
  // Inject CSS into parent document to override modal width on desktop
  if (typeof window !== "undefined" && window.parent?.document) {
    const styleId = "reader-modal-responsive-width";
    if (!window.parent.document.getElementById(styleId)) {
      const style = window.parent.document.createElement("style");
      style.id = styleId;
      style.textContent = `
        @media (min-width: 1025px) {
          div[class*="ModalDialog"][class*="body"][style*="90vw"],
          div[class*="modal"][style*="width: 90vw"],
          [data-testid*="modal"] div[style*="90vw"] {
            width: 60vw !important;
            max-width: 60vw !important;
          }
        }
      `;
      window.parent.document.head.appendChild(style);
    }
  }

  return {
    widthProp: "90vw",
    heightProp: height,
    children: [
      {
        component: Components.iFrame,
        props: {
          width: "100%",
          height: height,
          name: frameName,
          src: "about:blank",
        },
      },
    ],
  };
}

export function writeToIframe(
  iframeName: string,
  html: string,
  onReady?: (iframeWindow: Window) => void,
): void {
  const iframe = findIframe(iframeName);
  if (!iframe?.contentWindow) {
    console.error("Could not find iframe:", iframeName);
    return;
  }
  const doc = iframe.contentWindow.document;
  doc.open();
  doc.write(html);
  doc.close();
  // Inject any functions/values the iframe HTML needs on its own window
  if (onReady) onReady(iframe.contentWindow);
}
