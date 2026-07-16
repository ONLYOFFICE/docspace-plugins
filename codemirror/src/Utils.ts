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

import { colors } from "./Extensions";
import { keymaps } from "./properties.json";

function isMobile() {
  const userAgent = navigator.userAgent.toLowerCase();
  return /mobile|iphone|ipad|ipod|android|blackberry|mini|windows\sce|palm/i.test(userAgent);
}

function getPlatform() {
  const userAgent = navigator.userAgent.toLowerCase();
  if (/windows|win/i.test(userAgent)) {
    return "win";
  } else if (/mac|osx/i.test(userAgent)) {
    return "mac";
  } else {
    return "win";
  }
}

function constructKeymaps(keymap: any[]) {
  const platform = getPlatform();
  let innerHTML = "<table>";
  for (const key of keymap) {
    innerHTML += `
            <tr class="keymap-line">
                <td class="keymap action">${key.action}</td>
                <td class="keymap keys">${key[platform]}</td>
            </tr>
        `;
  }
  return innerHTML + "</table>";
}

export function getCodemirrorBody(iframe: HTMLIFrameElement, theme: any[]) {
  iframe.contentWindow!.document.body.style.margin = "0";

  if (isMobile()) {
    return iframe.contentWindow?.document.body;
  }

  iframe.contentWindow!.document.body.innerHTML = `
    <div id="codemirror-plugin-editor" style="width: 100%;"></div>
    <div id="codemirror-plugin-keymaps" style="width: 30%; display: none;">
        ${constructKeymaps(keymaps)}
    </div>
    <div id="codemirror-plugin-svg" style="right: 13px;">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" class="i-svg">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M8 2C4.68629 2 2 4.68629 2 8C2 11.3137 4.68629 14 8 14C11.3137 14 14 11.3137 14 8C14 4.68629 11.3137 2 8 2ZM0 8C0 3.58172 3.58172 0 8 0C12.4183 0 16 3.58172 16 8C16 12.4183 12.4183 16 8 16C3.58172 16 0 12.4183 0 8ZM9 5C9 5.55228 8.55228 6 8 6C7.44772 6 7 5.55228 7 5C7 4.44772 7.44772 4 8 4C8.55228 4 9 4.44772 9 5ZM8 7C7.44772 7 7 7.44772 7 8V11C7 11.5523 7.44772 12 8 12C8.55228 12 9 11.5523 9 11V8C9 7.44772 8.55228 7 8 7Z" fill="#A3A9AE"/>
        </svg>
    </div>
  `;

  const svg = iframe.contentWindow!.document.getElementById("codemirror-plugin-svg") as HTMLDivElement;
  svg.onclick = () => {
    const editor = iframe.contentWindow!.document.getElementById("codemirror-plugin-editor") as HTMLDivElement;
    const keymaps = iframe.contentWindow!.document.getElementById("codemirror-plugin-keymaps") as HTMLDivElement;
    const svg = iframe.contentWindow!.document.getElementById("codemirror-plugin-svg") as HTMLDivElement;
    if (keymaps.style.display == "none") {
      keymaps.style.display = "block";
      editor.style.width = "70%";
      svg.style.right = "calc(30% + 38px)";
    } else {
      keymaps.style.display = "none";
      editor.style.width = "100%";
      svg.style.right = "13px";
    }
  };

  const light = theme.length == 1;
  iframe.contentWindow!.document.head.innerHTML = `
    <style>
        body {
            display: flex;
            flex-direction: row;
        }
        #codemirror-plugin-editor {
            height: 100%;
        }
        #codemirror-plugin-keymaps {
            height: 100%;
            padding: 0 20px 0 16px;
            border-left: 1px solid ${light ? colors.border : colors.dark_border};
            overflow-y: overlay;
            scrollbar-color: ${light ? colors.contrast : colors.dark_contrast} ${light ? colors.base : colors.dark};
        }
        #codemirror-plugin-svg {
            height: 32px;
            width: 32px;
            z-index: 1;
            cursor: pointer;
            position: absolute;
            top: 4px;
            border-radius: 50%;
        }
        #codemirror-plugin-svg:hover {
            background-color: ${light ? colors.secondary : colors.dark_secondary};
        }
        .i-svg {
            margin: 8px;
        }
        .i-svg path {
            fill: ${light ? colors.contrast : colors.dark_contrast};
        }
        #codemirror-plugin-svg:hover .i-svg path {
            fill: ${light ? colors.hoverBorder : "white"};
        }
        table {
            width: 100%;
            font-family: "Open Sans", sans-serif;
            font-weight: 600;
            border-collapse: collapse;
        }
        .keymap-line:not(:last-child) {
            border-bottom: 1px solid ${light ? colors.border : colors.dark_border};
        }
        .keymap {
            font-size: 90%;
        }
        .action {
            color: ${light ? "black" : "white"};
            padding: 12px 0 12px 0;
        }
        .keys {
            color: ${light ? colors.contrast : colors.dark_contrast};
            padding: 12px 0 12px 12px;
        }
    </style>
  `;

  const font = iframe.contentWindow!.document.createElement("link");
  font.rel = "stylesheet";
  font.href = "https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,300..800;1,300..800&display=swap";
  iframe.contentWindow!.document.head.appendChild(font);

  return iframe.contentWindow!.document.getElementById("codemirror-plugin-editor") as HTMLDivElement;
}
