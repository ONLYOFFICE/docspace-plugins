import { Components } from "@onlyoffice/docspace-plugin-sdk";

export function findIframe(name: string): HTMLIFrameElement | null {
  return (
    (window.parent?.document?.getElementsByName(
      name,
    )[0] as HTMLIFrameElement) ??
    (document.getElementsByName(name)[0] as HTMLIFrameElement) ??
    null
  );
}

export function getModalHeight(): string {
  const width = window.parent?.innerWidth ?? window.innerWidth ?? 1024;
  if (width <= 768) {
    return "75vh";
  }
  return "calc(100vh - 80px)";
}

export function makeIframeBody(frameName: string, height: string = "100%") {
  const modalHeight = getModalHeight();

  return {
    widthProp: "90vw",
    heightProp: modalHeight,
    children: [
      {
        component: Components.iFrame,
        props: {
          width: "100%",
          height: "100%",
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
    return;
  }
  const doc = iframe.contentWindow.document;
  doc.open();
  doc.write(html);
  doc.close();
  if (onReady) onReady(iframe.contentWindow);
}
