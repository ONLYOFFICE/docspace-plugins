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

import { FileTreeItem } from "../Archives";
import { addStyles } from "./Styles";
import { fileTypes } from "../properties.json";
import archives from "../Archives";

const current = {
  file: undefined as string | undefined,
  root: [] as FileTreeItem[],
  path: "" as string,
  selection: [] as string[],
  iframe: undefined as HTMLIFrameElement | undefined,
  myDocumentsId: undefined as number | undefined,
};

export function drawInIframe(id: string, callback: Function, ...args: any) {
  const iframe = window.parent.document.getElementById(id) as HTMLIFrameElement;

  if (!iframe) {
    setTimeout(() => drawInIframe(id, callback, ...args), 200);
    return;
  }

  callback(iframe, ...args);
}

export function loader(iframe: HTMLIFrameElement) {
  // TODO: do
  iframe.contentWindow!.document.body.innerHTML = "Loading...";
}

export function error(iframe: HTMLIFrameElement, error: string) {
  // TODO: do and use
  iframe.contentWindow!.document.body.innerHTML = `Error:\n${error}`;
}

export function viewer(iframe: HTMLIFrameElement, root: FileTreeItem[], fileName: string, dark: boolean) {
  current.file = fileName;
  current.root = root;
  current.path = "";
  current.iframe = iframe;

  addStyles(iframe, dark);

  const sidePanel = iframe.contentWindow!.document.createElement("div");
  sidePanel.id = "side-panel";

  const explorerHeader = iframe.contentWindow!.document.createElement("div");
  explorerHeader.id = "explorer-header";

  const explorerBody = iframe.contentWindow!.document.createElement("div");
  explorerBody.id = "explorer-body";

  const explorer = iframe.contentWindow!.document.createElement("div");
  explorer.id = "explorer";

  const viewer = iframe.contentWindow!.document.createElement("div");
  viewer.id = "viewer";

  if (root.some((item) => item.type == "folder")) {
    viewer.appendChild(sidePanel);
    addSideElements(sidePanel, root, "");
  } else {
    explorer.style.width = "100%";
  }

  explorer.appendChild(explorerHeader);
  createExplorerHeader(explorerHeader);

  explorer.appendChild(explorerBody);
  addExplorerElements(explorerBody);

  viewer.appendChild(explorer);

  const selector = iframe.contentWindow!.document.createElement("div"); // TODO: [temp]
  selector.id = "selector";
  selector.style.display = "none";

  iframe.contentWindow!.document.body.innerHTML = "";
  iframe.contentWindow!.document.body.appendChild(viewer);
  iframe.contentWindow!.document.body.appendChild(selector);
}

export async function selector(
  iframe: HTMLIFrameElement,
  body: HTMLElement,
  path: { title: string; id: number | undefined }[],
  content: FileTreeItem[],
  buttons?: boolean, // TODO: [temp]
  dark?: boolean
) {
  if (!body) {
    body = iframe.contentWindow!.document.body;
    addStyles(iframe, dark!);
    selector(iframe, body, path, content, buttons);
    return;
  }

  body.innerHTML = ""; // TODO: clean only body in separate selector

  const selectorHeader = body.ownerDocument.createElement("div");
  selectorHeader.id = "selector-header";
  const docSpaceFolder = body.ownerDocument.createElement("div");
  docSpaceFolder.innerHTML = "DocSpace";
  docSpaceFolder.onclick = () => {
    selector(iframe, body, [], content, buttons);
  };
  selectorHeader.appendChild(docSpaceFolder);

  const selectorBody = body.ownerDocument.createElement("div");
  selectorBody.id = "selector-body";

  body.appendChild(selectorHeader);
  body.appendChild(selectorBody);

  const addSelectorFolder = (title: string, image: string, id?: number) => {
    const icon = body.ownerDocument.createElement("div");
    icon.className = "selector-folder-icon";
    icon.innerHTML = getSVGIcon(image);

    const text = body.ownerDocument.createElement("div");
    text.className = "selector-folder-title";
    text.innerText = title;
    text.onclick = () => {
      selector(iframe, body, [...path, { title: title, id: id }], content, buttons);
    };

    const folder = body.ownerDocument.createElement("div");
    folder.className = "selector-folder";
    folder.appendChild(icon);
    folder.appendChild(text);

    selectorBody.appendChild(folder);
  };

  const addHeaderArrow = () => {
    const arrow = body.ownerDocument.createElement("div");
    arrow.className = "selector-arrow";
    arrow.innerHTML = getSVGIcon("selector-arrow");
    selectorHeader.appendChild(arrow);
  };

  if (path.length == 0) {
    docSpaceFolder.classList.add("current-folder");

    if (!current.myDocumentsId) {
      current.myDocumentsId = (await archives.getFolder("@my")).pathParts[0].id;
    }
    addSelectorFolder("My documents", "my-documents", current.myDocumentsId);
    addSelectorFolder("Rooms", "rooms");
  } else {
    archives.destinationFolderId = path[path.length - 1].id;
    const currentFolder = await archives.getFolder(archives.destinationFolderId);
    let startIndex = 0;

    if (path.length > 2) {
      startIndex = path.length - 2;
      addHeaderArrow();
      const skip = body.ownerDocument.createElement("div");
      skip.innerText = "...";
      skip.style.cursor = "default";
      selectorHeader.appendChild(skip);
    }

    for (let i = startIndex; i < path.length; i++) {
      addHeaderArrow();
      const folder = body.ownerDocument.createElement("div");
      folder.innerHTML = path[i].title;

      if (i == path.length - 1) {
        folder.classList.add("current-folder");
      } else {
        folder.onclick = () => {
          selector(iframe, body, path.slice(0, i + 1), content, buttons);
        };
      }

      selectorHeader.appendChild(folder);
    }

    for (const folder of currentFolder.folders) {
      addSelectorFolder(folder.title, "selector-folder", folder.id);
    }
  }

  // TODO: [temp]
  if (!buttons) return;

  const footer = body.ownerDocument.createElement("div");
  footer.id = "temp-footer";
  const extractButton = body.ownerDocument.createElement("div");
  extractButton.innerText = "Unzip here";
  extractButton.id = "temp-extract-button";
  if (path.length > 0 && path[path.length - 1].id != undefined) {
    extractButton.onclick = async () => {
      footer.style.display = "none";
      await archives.unzip(path[path.length - 1].id!, content);
      const viewer = current.iframe!.contentDocument!.querySelector("#viewer") as HTMLDivElement; // TODO: [temp]
      const hiddenSelector = current.iframe!.contentDocument!.querySelector("#selector") as HTMLDivElement;
      viewer.style.display = "flex";
      hiddenSelector.style.display = "none";
    };
  } else {
    extractButton.style.opacity = "50%";
    extractButton.style.cursor = "default";
  }
  const cancelButton = body.ownerDocument.createElement("div");
  cancelButton.innerText = "Cancel";
  cancelButton.id = "temp-cancel-button";
  cancelButton.onclick = () => {
    const viewer = current.iframe!.contentDocument!.querySelector("#viewer") as HTMLDivElement; // TODO: [temp]
    const hiddenSelector = current.iframe!.contentDocument!.querySelector("#selector") as HTMLDivElement;
    viewer.style.display = "flex";
    hiddenSelector.style.display = "none";
  };
  footer.appendChild(extractButton);
  footer.appendChild(cancelButton);
  body.appendChild(footer);
}

function addSideElements(sidePanel: HTMLDivElement, folder: FileTreeItem[], path: string) {
  const createFolderIcon = () => {
    const icon = sidePanel.ownerDocument.createElement("div");
    icon.className = "side-folder-icon";
    icon.innerHTML = getSVGIcon("side-folder");
    return icon;
  };

  const createFolderTitle = (title: string) => {
    const titleElement = sidePanel.ownerDocument.createElement("div");
    titleElement.className = "side-folder-title";
    titleElement.innerText = title;
    return titleElement;
  };

  if (path == "") {
    const rootSideElement = sidePanel.ownerDocument.createElement("div");
    rootSideElement.className = "root-side-element";
    rootSideElement.style.display = "flex";
    rootSideElement.style.paddingLeft = "8px";
    rootSideElement.appendChild(createFolderIcon());
    rootSideElement.appendChild(createFolderTitle(current.file!));
    rootSideElement.addEventListener("dblclick", () => {
      changeFolder("");
    });
    sidePanel.appendChild(rootSideElement);
  }

  const padding = 16 * (path.split("/").length - 1);
  const subFolders = [];

  for (const item of folder) {
    if (item.type == "folder") {
      const newPath = `${path}${item.title}/`;
      const withSubFolders = (item.content as FileTreeItem[]).filter((item) => item.type == "folder").length > 0;

      let arrow = sidePanel.ownerDocument.createElement("div");
      arrow.className = "side-folder-arrow";
      if (withSubFolders) {
        arrow.innerHTML = getSVGIcon("side-arrow");
        arrow.addEventListener("click", (event) => {
          event.stopPropagation();
          const sideElements = sidePanel.ownerDocument.querySelectorAll(".side-element");
          if (arrow!.classList.contains("rotate")) {
            for (const el of Array.from(sideElements) as HTMLDivElement[]) {
              if (el.id.startsWith(newPath) && el.id != newPath) {
                el.style.display = "none";
                el.children[0].classList.remove("rotate");
              }
            }
            arrow!.classList.remove("rotate");
          } else {
            for (const el of Array.from(sideElements) as HTMLDivElement[]) {
              if (el.id.startsWith(newPath) && el.id.split("/").length == newPath.split("/").length + 1) {
                el.style.display = "flex";
              }
            }
            arrow!.classList.add("rotate");
          }
        });
      } else {
        arrow.style.minWidth = "8px";
      }

      const sideElement = sidePanel.ownerDocument.createElement("div");
      sideElement.id = newPath;
      sideElement.className = "side-element";
      sideElement.style.paddingLeft = `${padding}px`;
      sideElement.style.display = path == "" ? "flex" : "none";
      sideElement.appendChild(arrow);
      sideElement.appendChild(createFolderIcon());
      sideElement.appendChild(createFolderTitle(item.title));
      sideElement.addEventListener("click", () => {
        changeFolder(newPath);
      });

      if (withSubFolders) {
        sidePanel.appendChild(sideElement);
        addSideElements(sidePanel, item.content as FileTreeItem[], newPath);
      } else {
        subFolders.push(sideElement);
      }
    }
  }

  for (const subFolder of subFolders) {
    sidePanel.appendChild(subFolder);
  }
}

function createExplorerHeader(header: HTMLElement) {
  const nFolders = current.path.split("/").filter((f) => f != "").length;

  const pathHeader = header.ownerDocument.createElement("div");
  pathHeader.id = "path-header";
  pathHeader.style.display = "flex";

  if (nFolders > 0) {
    const backArrow = header.ownerDocument.createElement("div");
    backArrow.id = "header-arrow";
    backArrow.innerHTML = getSVGIcon("header-arrow");
    pathHeader.appendChild(backArrow);
    backArrow.onclick = () => {
      changeFolder(
        current.path
          .split("/")
          .filter((f) => f != "")
          .slice(0, -1)
          .join("/") + "/"
      );
    };
  }

  const title = header.ownerDocument.createElement("div");
  title.id = "header-file-title";
  title.innerText = current.file!;
  title.classList.add("root-name");
  if (nFolders > 0) {
    title.classList.remove("root-name");
    title.innerText += " /";
  }
  if (nFolders > 1) {
    title.innerText += " ... /";
  }
  pathHeader.appendChild(title);

  const folder = header.ownerDocument.createElement("div");
  folder.id = "header-folder-title";
  folder.innerText =
    current.path
      .split("/")
      .filter((f) => f != "")
      .pop() || "";
  pathHeader.appendChild(folder);

  const extractHeader = header.ownerDocument.createElement("div");
  extractHeader.id = "extract-header";
  extractHeader.style.display = "none";

  const extractCheckbox = header.ownerDocument.createElement("div");
  extractCheckbox.id = "extract-checkbox";
  extractCheckbox.innerHTML = getSVGIcon("checkbox-none");
  extractCheckbox.onclick = () => {
    const elements = header.ownerDocument.querySelectorAll(".explorer-element");
    current.selection = [];
    if (extractCheckbox.classList.contains("all")) {
      for (const element of Array.from(elements) as HTMLDivElement[]) {
        element.classList.remove("checked");
        element.children[0].innerHTML = getSVGIcon("checkbox-none");
      }
    } else if (extractCheckbox.classList.contains("some")) {
      for (const element of Array.from(elements) as HTMLDivElement[]) {
        if (!element.classList.contains("checked")) {
          element.classList.add("checked");
          element.children[0].innerHTML = getSVGIcon("checkbox-all");
        }
      }
      const folder = getFolderFromPath(current.path, current.root);
      for (const f of folder) {
        current.selection.push(`${current.path}${f.title}${f.type == "folder" ? "/" : ""}`);
      }
    }

    validateChecked();
  };
  extractHeader.appendChild(extractCheckbox);

  const extractBorder = header.ownerDocument.createElement("div");
  extractBorder.id = "extract-border";
  extractHeader.appendChild(extractBorder);

  const extractButton = header.ownerDocument.createElement("div");
  extractButton.id = "extract-button";
  extractButton.innerHTML = getSVGIcon("extract");
  extractButton.onclick = () => {
    let content: FileTreeItem[] = [];
    for (const p of current.selection) {
      content.push(getFileTreeItem(p, current.root));
    }
    console.log(content);

    const viewer = current.iframe!.contentDocument!.querySelector("#viewer") as HTMLDivElement; // TODO: [temp]
    const hiddenSelector = current.iframe!.contentDocument!.querySelector("#selector") as HTMLDivElement;
    viewer.style.display = "none";
    hiddenSelector.style.display = "flex";
    selector(current.iframe!, hiddenSelector, [], content, true);
  };
  extractHeader.appendChild(extractButton);

  header.appendChild(pathHeader);
  header.appendChild(extractHeader);
}

function addExplorerElements(explorerBody: HTMLElement) {
  const folder = getFolderFromPath(current.path, current.root);

  for (const f of folder) {
    let fPath = `${current.path}${f.title}`;
    const element = explorerBody.ownerDocument.createElement("div");
    element.setAttribute("data-path", f.title);
    element.className = "explorer-element";
    if (f.type == "folder") {
      fPath += "/";
      element.addEventListener("dblclick", () => {
        changeFolder(fPath);
      });
    }

    const iconBox = explorerBody.ownerDocument.createElement("div");
    iconBox.className = `explorer-icon ${f.type == "folder" ? "folder" : getFileType(f.title)}`;
    iconBox.innerHTML = getSVGIcon("checkbox-none");
    iconBox.addEventListener("click", (event) => {
      event.stopPropagation();

      if (element.classList.contains("checked")) {
        element.classList.remove("checked");
        iconBox.innerHTML = getSVGIcon("checkbox-none");
        current.selection = current.selection.filter((item) => item != fPath);
      } else {
        element.classList.add("checked");
        iconBox.innerHTML = getSVGIcon("checkbox-all");
        current.selection.push(fPath);
      }

      validateChecked();
    });

    const title = explorerBody.ownerDocument.createElement("div");
    title.className = "explorer-title";
    title.innerText = f.title;

    const extract = explorerBody.ownerDocument.createElement("div");
    extract.className = "file-extract-mini";
    extract.innerHTML = getSVGIcon("extract-mini");
    extract.onclick = () => {
      // TODO: [temp]
      const viewer = current.iframe!.contentDocument!.querySelector("#viewer") as HTMLDivElement;
      const hiddenSelector = current.iframe!.contentDocument!.querySelector("#selector") as HTMLDivElement;

      viewer.style.display = "none";
      hiddenSelector.style.display = "flex";
      selector(current.iframe!, hiddenSelector, [], [f], true);
    };

    element.appendChild(iconBox);
    element.appendChild(title);
    element.appendChild(extract);

    explorerBody.appendChild(element);
  }
}

function validateChecked() {
  const elements = current.iframe!.contentDocument!.querySelectorAll(".explorer-element");
  let checked = 0;
  for (const element of Array.from(elements) as HTMLDivElement[]) {
    if (element.classList.contains("checked")) checked++;
  }

  const mainCheckbox = current.iframe!.contentDocument!.getElementById("extract-checkbox");
  const extractHeader = current.iframe!.contentDocument!.getElementById("extract-header");
  const pathHeader = current.iframe!.contentDocument!.getElementById("path-header");
  switch (checked) {
    case 0:
      mainCheckbox!.innerHTML = getSVGIcon("checkbox-none");
      mainCheckbox!.classList.remove("some");
      mainCheckbox!.classList.remove("all");
      extractHeader!.style.display = "none";
      pathHeader!.style.display = "flex";
      break;
    case elements.length:
      mainCheckbox!.innerHTML = getSVGIcon("checkbox-all");
      mainCheckbox!.classList.remove("some");
      mainCheckbox!.classList.add("all");
      extractHeader!.style.display = "flex";
      pathHeader!.style.display = "none";
      break;
    default:
      mainCheckbox!.innerHTML = getSVGIcon("checkbox-some");
      mainCheckbox!.classList.remove("all");
      mainCheckbox!.classList.add("some");
      extractHeader!.style.display = "flex";
      pathHeader!.style.display = "none";
      break;
  }
}

function getFolderFromPath(path: string | string[], currentFolder: FileTreeItem[]): FileTreeItem[] {
  if (typeof path == "string") {
    path = path.split("/").filter((item) => item != "");
  }

  if (path.length == 0) return currentFolder;

  const folder = currentFolder.find((item) => item.title == path[0] && item.type == "folder");

  return getFolderFromPath(path.slice(1), folder!.content as FileTreeItem[]);
}

function getFileTreeItem(path: string, currentFolder: FileTreeItem[]): FileTreeItem {
  const p = path.split("/");
  const newPath = p.slice(1);

  const f = currentFolder.find((item) => item.title == p[0] && item.type == (newPath.length == 0 ? "file" : "folder"));

  if (newPath.length == 0 || (newPath.length == 1 && p[p.length - 1] == "")) return f!;

  return getFileTreeItem(newPath.join("/"), f!.content as FileTreeItem[]);
}

function changeFolder(path: string) {
  current.path = path == "/" ? "" : path;
  current.selection = [];

  const allFolders = current.iframe!.contentWindow!.document.querySelectorAll(".side-element");
  for (const folder of Array.from(allFolders) as HTMLDivElement[]) {
    folder.classList.remove("current");
  }
  if (current.path != "") {
    const folder = current.iframe!.contentWindow!.document.getElementById(current.path);
    folder!.classList.add("current");
    if (folder!.style.display == "none") {
      const openParent = (path: string) => {
        const parentPath =
          path
            .split("/")
            .filter((f) => f != "")
            .slice(0, -1)
            .join("/") + "/";
        if (!parentPath || parentPath == "/") return;

        const parent = current.iframe!.contentWindow!.document.getElementById(parentPath);
        for (const el of Array.from(allFolders) as HTMLDivElement[]) {
          if (el.id.startsWith(parentPath) && el.id.split("/").length == parentPath.split("/").length + 1) {
            el.style.display = "flex";
          }
        }
        parent!.style.display = "flex";
        parent!.children[0].classList.add("rotate");
        openParent(parentPath);
        folder!.scrollIntoView({ behavior: "smooth" });
      };
      openParent(current.path);
    }
  }

  const explorerHeader = current.iframe!.contentWindow!.document.getElementById("explorer-header");
  const explorerBody = current.iframe!.contentWindow!.document.getElementById("explorer-body");

  explorerHeader!.innerHTML = "";
  explorerBody!.innerHTML = "";

  createExplorerHeader(explorerHeader!);
  addExplorerElements(explorerBody!);
}

function getFileType(filename: string) {
  const ext = filename.split(".").pop() || "";

  for (const f of fileTypes) {
    if (f.extensions.includes(ext)) return f.type;
  }

  return "file";
}

function getSVGIcon(icon: string) {
  switch (icon.toLowerCase()) {
    case "checkbox-none":
      return `
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" tabindex="-1">
            <rect x="0.5" y="0.5" width="15" height="15" rx="2.5"/>
          </svg>
        `;
    case "checkbox-some":
      return `
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="0.5" y="0.5" width="15" height="15" rx="2.5"/>
            <rect x="3" y="3" width="10" height="10" rx="2"/>
          </svg>
        `;
    case "checkbox-all":
      return `
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="0.5" y="0.5" width="15" height="15" rx="2.5"/>
            <path d="M7.97926 11.6351C7.48054 12.1216 6.67132 12.1216 6.17284 11.6351L3.37404 8.90491C2.87532 8.41864 2.87532 7.62926 3.37404 7.14299C3.87252 6.65649 4.68174 6.65649 5.18046 7.14299L6.84799 8.76943C6.97387 8.89199 7.17822 8.89199 7.30435 8.76943L11.8195 4.36487C12.318 3.87838 13.1272 3.87838 13.626 4.36487C13.8655 4.5985 14 4.91547 14 5.24583C14 5.57619 13.8655 5.89317 13.626 6.12679L7.97926 11.6351Z"/>
          </svg>
        `;
    case "side-folder":
      return `
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M0.00397432 3.00531C0.00100911 1.89884 0.89718 1 2.00397 1H5.96626L8.36394 3.00003H14.0008C15.1054 3.00003 16.0008 3.89546 16.0008 5.00003V12C16.0008 13.1046 15.1054 14 14.0008 14H2.0471C1.00059 14 0.00453657 13.1588 7.56979e-06 12.0039L0 11.9996L0.00397432 3.00531ZM5.24161 3H2.00397L2.00398 3.00436L2.00001 11.9752L2.00285 11.978C2.01068 11.9854 2.02062 11.9918 2.03054 11.9958C2.03996 11.9997 2.0471 12 2.0471 12H14.0008V5.00003H7.63929L5.24161 3Z"/>
          </svg>
        `;
    case "side-arrow":
      return `
          <svg width="8" height="8" viewBox="0 0 8 8" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M2 1.20711C2 0.761654 2.53857 0.538571 2.85355 0.853553L5.64645 3.64645C5.84171 3.84171 5.84171 4.15829 5.64645 4.35355L2.85355 7.14645C2.53857 7.46143 2 7.23835 2 6.79289V1.20711Z"/>
          </svg>
        `;
    case "header-arrow":
      return `
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path fill-rule="evenodd" clip-rule="evenodd" d="M1.29289 7.28998C0.902369 7.6805 0.902369 8.31367 1.29289 8.70419L6.29289 13.7042L7.70711 12.29L4.41421 8.99708L14 8.99709L14 6.99709L4.41421 6.99708L7.70711 3.70419L6.29289 2.28998L1.29289 7.28998Z"/>
        </svg>
      `;
    case "extract":
      return `
        <svg width="65" height="48" viewBox="0 0 65 48" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M31.5 11H27.5V21H37.5V17L39.5 17V21C39.5 22.1046 38.6046 23 37.5 23H27.5C26.3954 23 25.5 22.1046 25.5 21L25.5 11C25.5 9.89543 26.3954 9 27.5 9L31.5 9V11ZM38.5 9C39.0523 9 39.5 9.44772 39.5 10V15L37.5 15V12.4141L32.207 17.707L30.793 16.293L36.0859 11H33.5V9H38.5Z"/>
          <path d="M18.0215 41H13.1699V32.4336H18.0215V33.6172H14.5762V35.9434H17.8047V37.1211H14.5762V39.8105H18.0215V41ZM21.168 37.6836L19 34.5137H20.5703L22.0527 36.793L23.541 34.5137H25.1055L22.9258 37.6836L25.2168 41H23.6406L22.0527 38.5684L20.459 41H18.8945L21.168 37.6836ZM28.7559 40.0039C28.9355 40.0039 29.1133 39.9883 29.2891 39.957C29.4648 39.9219 29.625 39.8809 29.7695 39.834V40.877C29.6172 40.9434 29.4199 41 29.1777 41.0469C28.9355 41.0938 28.6836 41.1172 28.4219 41.1172C28.0547 41.1172 27.7246 41.0566 27.4316 40.9355C27.1387 40.8105 26.9062 40.5977 26.7344 40.2969C26.5625 39.9961 26.4766 39.5801 26.4766 39.0488V35.5625H25.5918V34.9473L26.541 34.4609L26.9922 33.0723H27.8594V34.5137H29.7168V35.5625H27.8594V39.0312C27.8594 39.3594 27.9414 39.6035 28.1055 39.7637C28.2695 39.9238 28.4863 40.0039 28.7559 40.0039ZM34.375 34.3906C34.4844 34.3906 34.6035 34.3965 34.7324 34.4082C34.8613 34.4199 34.9727 34.4355 35.0664 34.4551L34.9375 35.7441C34.8555 35.7207 34.7539 35.7031 34.6328 35.6914C34.5156 35.6797 34.4102 35.6738 34.3164 35.6738C34.0703 35.6738 33.8359 35.7148 33.6133 35.7969C33.3906 35.875 33.1934 35.9961 33.0215 36.1602C32.8496 36.3203 32.7148 36.5215 32.6172 36.7637C32.5195 37.0059 32.4707 37.2871 32.4707 37.6074V41H31.0879V34.5137H32.166L32.3535 35.6562H32.418C32.5469 35.4258 32.707 35.2148 32.8984 35.0234C33.0898 34.832 33.3086 34.6797 33.5547 34.5664C33.8047 34.4492 34.0781 34.3906 34.375 34.3906ZM38.8105 34.3906C39.6309 34.3906 40.25 34.5723 40.668 34.9355C41.0898 35.2988 41.3008 35.8652 41.3008 36.6348V41H40.3223L40.0586 40.0801H40.0117C39.8281 40.3145 39.6387 40.5078 39.4434 40.6602C39.248 40.8125 39.0215 40.9258 38.7637 41C38.5098 41.0781 38.1992 41.1172 37.832 41.1172C37.4453 41.1172 37.0996 41.0469 36.7949 40.9062C36.4902 40.7617 36.25 40.543 36.0742 40.25C35.8984 39.957 35.8105 39.5859 35.8105 39.1367C35.8105 38.4688 36.0586 37.9668 36.5547 37.6309C37.0547 37.2949 37.8086 37.1094 38.8164 37.0742L39.9414 37.0332V36.6934C39.9414 36.2441 39.8359 35.9238 39.625 35.7324C39.418 35.541 39.125 35.4453 38.7461 35.4453C38.4219 35.4453 38.1074 35.4922 37.8027 35.5859C37.498 35.6797 37.2012 35.7949 36.9121 35.9316L36.4668 34.959C36.7832 34.791 37.1426 34.6543 37.5449 34.5488C37.9512 34.4434 38.373 34.3906 38.8105 34.3906ZM39.9355 37.9004L39.0977 37.9297C38.4102 37.9531 37.9277 38.0703 37.6504 38.2812C37.373 38.4922 37.2344 38.7812 37.2344 39.1484C37.2344 39.4688 37.3301 39.7031 37.5215 39.8516C37.7129 39.9961 37.9648 40.0684 38.2773 40.0684C38.7539 40.0684 39.1484 39.9336 39.4609 39.6641C39.7773 39.3906 39.9355 38.9902 39.9355 38.4629V37.9004ZM45.8418 41.1172C45.2285 41.1172 44.6973 40.998 44.248 40.7598C43.7988 40.5215 43.4531 40.1562 43.2109 39.6641C42.9688 39.1719 42.8477 38.5469 42.8477 37.7891C42.8477 37 42.9805 36.3555 43.2461 35.8555C43.5117 35.3555 43.8789 34.9863 44.3477 34.748C44.8203 34.5098 45.3613 34.3906 45.9707 34.3906C46.3574 34.3906 46.707 34.4297 47.0195 34.5078C47.3359 34.582 47.6035 34.6738 47.8223 34.7832L47.4121 35.8848C47.1738 35.7871 46.9297 35.7051 46.6797 35.6387C46.4297 35.5723 46.1895 35.5391 45.959 35.5391C45.5801 35.5391 45.2637 35.623 45.0098 35.791C44.7598 35.959 44.5723 36.209 44.4473 36.541C44.3262 36.873 44.2656 37.2852 44.2656 37.7773C44.2656 38.2539 44.3281 38.6562 44.4531 38.9844C44.5781 39.3086 44.7637 39.5547 45.0098 39.7227C45.2559 39.8867 45.5586 39.9688 45.918 39.9688C46.2734 39.9688 46.5918 39.9258 46.873 39.8398C47.1543 39.7539 47.4199 39.6426 47.6699 39.5059V40.7012C47.4238 40.8418 47.1602 40.9453 46.8789 41.0117C46.5977 41.082 46.252 41.1172 45.8418 41.1172ZM51.6074 40.0039C51.7871 40.0039 51.9648 39.9883 52.1406 39.957C52.3164 39.9219 52.4766 39.8809 52.6211 39.834V40.877C52.4688 40.9434 52.2715 41 52.0293 41.0469C51.7871 41.0938 51.5352 41.1172 51.2734 41.1172C50.9062 41.1172 50.5762 41.0566 50.2832 40.9355C49.9902 40.8105 49.7578 40.5977 49.5859 40.2969C49.4141 39.9961 49.3281 39.5801 49.3281 39.0488V35.5625H48.4434V34.9473L49.3926 34.4609L49.8438 33.0723H50.7109V34.5137H52.5684V35.5625H50.7109V39.0312C50.7109 39.3594 50.793 39.6035 50.957 39.7637C51.1211 39.9238 51.3379 40.0039 51.6074 40.0039Z"/>
        </svg>
      `;
    case "extract-mini":
      return `
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M7 3H3V13H13V9H15V13C15 14.1046 14.1046 15 13 15H3C1.89543 15 1 14.1046 1 13V3C1 1.89543 1.89543 1 3 1H7V3ZM14 1C14.5523 1 15 1.44772 15 2V7H13V4.41406L7.70703 9.70703L6.29297 8.29297L11.5859 3H9V1H14Z"/>
        </svg>
      `;
    case "my-documents":
      return `
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="16" cy="16" r="16"/>
          <path fill-rule="evenodd" clip-rule="evenodd" d="M15.9994 10.0001C15.4473 10.0001 14.9997 10.4477 14.9997 10.9999V11.5001C14.9997 12.4114 15.155 13.1038 15.382 13.5295C15.5892 13.9178 15.7935 14.0001 15.9997 14.0001C16.2058 14.0001 16.41 13.9179 16.617 13.5296C16.8439 13.104 16.9992 12.4115 16.9992 11.5001V10.9999C16.9992 10.4477 16.5516 10.0001 15.9994 10.0001ZM12.9997 10.9999C12.9997 9.34312 14.3428 8.00009 15.9995 8.00012C17.6562 8.00016 18.9992 9.34317 18.9992 10.9999V11.5001C18.9992 12.5886 18.8213 13.6462 18.3819 14.4705C17.9225 15.3322 17.1269 16.0001 15.9997 16.0001C14.8725 16.0001 14.0769 15.3323 13.6173 14.4707C13.1777 13.6463 12.9997 12.5887 12.9997 11.5001V10.9999ZM10.1949 18.6851C10.817 17.647 11.8536 16.6428 13.4286 16.6428C13.7223 16.6428 13.9725 16.743 14.1081 16.8024C14.2523 16.8656 14.4045 16.9471 14.5266 17.0126L14.5438 17.0219C15.0226 17.2784 15.4636 17.5 16.0001 17.5C16.5362 17.5 16.9771 17.2785 17.4558 17.0219C17.4615 17.0189 17.4673 17.0158 17.4731 17.0127C17.5953 16.9472 17.7476 16.8655 17.892 16.8023C18.0277 16.7429 18.2782 16.6426 18.5725 16.6428C20.1468 16.6443 21.183 17.6481 21.8051 18.686C22.4244 19.719 22.7451 20.9472 22.8913 21.8463C23.0937 23.0911 22.0725 24.0001 21.0001 24.0001H11.0001C9.92759 24.0001 8.90652 23.0911 9.1088 21.8464C9.25495 20.9471 9.57564 19.7183 10.1949 18.6851ZM11.1118 22.0001H20.8883C20.7537 21.2637 20.497 20.3936 20.0897 19.7143C19.6785 19.0282 19.2145 18.683 18.6682 18.6461C18.6447 18.6571 18.6155 18.6715 18.5787 18.6904C18.5268 18.7171 18.4702 18.7474 18.4005 18.7847C18.3896 18.7906 18.3785 18.7966 18.3672 18.8026C17.8982 19.0543 17.0678 19.5 16.0001 19.5C14.9321 19.5 14.1016 19.0543 13.6325 18.8026C13.6212 18.7965 13.61 18.7905 13.5991 18.7847C13.5295 18.7474 13.4729 18.7171 13.4211 18.6904C13.3842 18.6714 13.3549 18.657 13.3314 18.646C12.7854 18.6822 12.3217 19.0269 11.9104 19.7132C11.5031 20.3927 11.2464 21.2633 11.1118 22.0001Z"/>
        </svg>
      `;
    case "rooms":
      return `
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="16" cy="16" r="16"/>
          <path fill-rule="evenodd" clip-rule="evenodd" d="M8 12C8 10.3431 9.34315 9 11 9H20C21.6569 9 23 10.3431 23 12V21C23 22.6569 21.6569 24 20 24H11C9.34315 24 8 22.6569 8 21V12ZM11 11C10.4477 11 10 11.4477 10 12V21C10 21.5523 10.4477 22 11 22H20C20.5523 22 21 21.5523 21 21V12C21 11.4477 20.5523 11 20 11H11ZM12 14C12 13.4477 12.4477 13 13 13H14C14.5523 13 15 13.4477 15 14V15C15 15.5523 14.5523 16 14 16H13C12.4477 16 12 15.5523 12 15V14ZM13 17C12.4477 17 12 17.4477 12 18V19C12 19.5523 12.4477 20 13 20H14C14.5523 20 15 19.5523 15 19V18C15 17.4477 14.5523 17 14 17H13ZM16 14C16 13.4477 16.4477 13 17 13H18C18.5523 13 19 13.4477 19 14V15C19 15.5523 18.5523 16 18 16H17C16.4477 16 16 15.5523 16 15V14ZM17 17C16.4477 17 16 17.4477 16 18V19C16 19.5523 16.4477 20 17 20H18C18.5523 20 19 19.5523 19 19V18C19 17.4477 18.5523 17 18 17H17Z"/>
        </svg>
      `;
    case "selector-folder":
      return `
        <svg width="33" height="32" viewBox="0 0 33 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M2.5 6C2.5 4.89551 3.39543 4 4.5 4H12.5C13.6046 4 14.5 4.89551 14.5 6V8H28.5C29.6046 8 30.5 8.89551 30.5 10V12C30.5 10.8955 29.6046 10 28.5 10H4.5C3.39543 10 2.5 10.8955 2.5 12V6Z" fill="#788790"/>
          <rect x="2.5" y="10" width="28" height="18" rx="2" fill="#B2BBC0"/>
        </svg>
      `;
    case "selector-arrow":
      return `
        <svg width="13" height="14" viewBox="0 0 13 14" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M10.207 7.29285C10.5976 7.68337 10.5976 8.31639 10.207 8.70691L5.20703 13.7069L3.79297 12.2928L8.08594 7.99988L3.79297 3.70691L5.20703 2.29285L10.207 7.29285Z" fill="#657077"/>
        </svg>
      `;
    default:
      return "";
  }
}
