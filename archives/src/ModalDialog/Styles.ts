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

import { colors } from "../properties.json";

export function addStyles(iframe: HTMLIFrameElement, dark: boolean) {
  iframe.contentWindow!.document.head.innerHTML += `
    <style>
    body {
        margin: 0;
        padding: 0;
        height: 99%;
    }
    #viewer {
        height: 100%;
        border-bottom: 1px solid ${dark ? colors.dark_border : colors.border};
        display: flex;
        flex-direction: row;
    }
    #side-panel {
        width: 28%;
        height: 100%;
        overflow: hidden auto;
        border-right: 1px solid ${dark ? colors.dark_border : colors.border};
        ${dark ? `scrollbar-color: ${colors.dark_tertiaryText} ${colors.dark_background};` : ""}
    }
    .root-side-element,
    .side-element {
        flex-direction: row;
        align-items: center;
        padding: 10px 0px;
        cursor: pointer;
        user-select: none;
    }
    .root-side-element:hover,
    .side-element:hover {
        background-color: ${dark ? colors.dark_contrastBackground : colors.contrastBackground};
    }
    .current {
        background-color: ${dark ? colors.dark_contrastBackground : colors.contrastBackground};
    }
    .side-folder-arrow {
        margin-left: 12px;
        padding: 4px;
    }
    .side-folder-arrow svg path {
        fill: ${dark ? colors.dark_text : colors.text};
    }
    .rotate {
        transform: rotate(90deg);
    }
    .side-folder-icon {
        margin: 0px 8px;
    }
    .side-folder-icon svg path {
        fill: ${dark ? colors.dark_text : colors.text};
    }
    .side-folder-title {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        font-size: 13px;
        font-weight: 600;
        font-family: "Open Sans", sans-serif;
        color: ${dark ? colors.dark_text : colors.text};
    }

    #explorer {
        width: 72%;
    }
    #explorer-header {
        height: 48px;
    }
    #path-header {
        height: 100%;
        padding-left: 16px;
        align-items: center;
        border-bottom: 1px solid ${dark ? colors.dark_border : colors.border};
    }
    #header-arrow {
        margin-right: 10px;
        cursor: pointer;
    }
    #header-arrow svg path {
        fill: ${dark ? colors.dark_tertiaryText : colors.secondaryText};
    }
    #header-file-title {
        margin-right: 6px;
        font-size: 12px;
        font-weight: 600;
        font-family: "Open Sans", sans-serif;
        color: ${dark ? colors.dark_secondaryText : colors.secondaryText};
    }
    #header-file-title.root-name {
        color: ${dark ? colors.dark_text : colors.text};
    }
    #header-folder-title {
        font-size: 12px;
        font-weight: 600;
        font-family: "Open Sans", sans-serif;
        color: ${dark ? colors.dark_text : colors.text};
    }
    #extract-header {
        height: 100%;
        align-items: center;
        padding-left: 24px;
        border-bottom-right-radius: 6px;
        border-bottom-left-radius: 6px;
        box-shadow: 0px 8px 16px 0px ${dark ? colors.dark_shadow : colors.shadow};
    }
    #extract-checkbox {
        cursor: pointer;
    }
    #extract-border {
        width: 1px;
        height: 36px;
        background-color: ${dark ? colors.dark_border : colors.border};
        margin: 0 16px 0 24px;
    }
    #extract-button {
        cursor: pointer;
    }
    #extract-button svg path {
        fill: ${dark ? colors.dark_contrastText : colors.contrastText};
    }
    #explorer-body {
        overflow: hidden auto;
        height: calc(100% - 49px);
        ${dark ? `scrollbar-color: ${colors.dark_tertiaryText} ${colors.dark_background};` : ""}
    }
    .explorer-element {
        height: 48px;
        display: flex;
        align-items: center;
        padding: 0 16px;
        user-select: none;
    }
    .explorer-icon {
        min-width: 32px;
        height: 32px;
        background-size: cover;
        background-position: center;
        align-items: center;
        display: flex;
    }
    .explorer-icon svg {
        margin: 0 8px;
        display: none;
    }
    #extract-checkbox svg rect,
    .explorer-icon svg rect {
        stroke: ${dark ? colors.dark_border : colors.grey};
        fill: ${dark ? colors.black : colors.background};
    }
    #extract-checkbox svg rect:not(:first-child),
    .explorer-icon svg rect:not(:first-child) {
        fill: ${dark ? colors.dark_contrastText : colors.contrastText} !important;
    }
    #extract-checkbox svg path,
    .explorer-icon svg path {
        fill: ${dark ? colors.dark_contrastText : colors.contrastText};
    }
    .explorer-icon:hover {
        background-image: none;
    }
    .explorer-icon:hover svg {
        display: block;
        cursor: pointer;
    }
    .explorer-element.checked {
        background-color: ${dark ? colors.dark_contrastBackground : colors.contrastBackground};
    }
    .explorer-element.checked .explorer-icon {
        background-image: none;
    }
    .explorer-element.checked .explorer-icon svg {
        display: block;
        cursor: pointer;
    }
    .explorer-title {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        margin-left: 8px;
        font-size: 14px;
        font-weight: 600;
        font-family: "Open Sans", sans-serif;
        color: ${dark ? colors.dark_contrastText : colors.contrastText};
    }
    .file-extract-mini {
        margin-left: auto;
        display: none;
    }
    .file-extract-mini svg path {
        fill: ${dark ? colors.dark_tertiaryText : colors.secondaryText};
    }
    .explorer-element:hover {
        background-color: ${dark ? colors.dark_contrastBackground : colors.contrastBackground};
    }
    .explorer-element:hover .file-extract-mini {
        display: block;
    }
    .file-extract-mini:hover {
        cursor: pointer;
    }

    .folder {
        background-image: url("data:image/svg+xml,%3Csvg width='32' height='32' viewBox='0 0 32 32' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M4 5C4 4.44772 4.44772 4 5 4H12.5858C12.851 4 13.1054 4.10536 13.2929 4.29289L15.7071 6.70711C15.8946 6.89464 16.149 7 16.4142 7H27C27.5523 7 28 7.44772 28 8V21C28 21.5523 27.5523 22 27 22H5C4.44772 22 4 21.5523 4 21V5Z' fill='%23DADADA'/%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M27 21V8H16.4142C15.8838 8 15.3751 7.78929 15 7.41421L12.5858 5H5V21H27ZM5 4C4.44772 4 4 4.44772 4 5V21C4 21.5523 4.44772 22 5 22H27C27.5523 22 28 21.5523 28 21V8C28 7.44772 27.5523 7 27 7H16.4142C16.149 7 15.8946 6.89464 15.7071 6.70711L13.2929 4.29289C13.1054 4.10536 12.851 4 12.5858 4H5Z' fill='%23AAAAAA'/%3E%3Cpath d='M3 11C3 10.4477 3.44772 10 4 10H28C28.5523 10 29 10.4477 29 11V27C29 27.5523 28.5523 28 28 28H4C3.44772 28 3 27.5523 3 27V11Z' fill='%23EEEEEE'/%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M28 11H4V27H28V11ZM4 10C3.44772 10 3 10.4477 3 11V27C3 27.5523 3.44772 28 4 28H28C28.5523 28 29 27.5523 29 27V11C29 10.4477 28.5523 10 28 10H4Z' fill='%23AAAAAA'/%3E%3C/svg%3E%0A");
    }
    .file {
        background-image: url("data:image/svg+xml,%3Csvg width='32' height='32' viewBox='0 0 32 32' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cg clip-path='url(%23clip0_188_23543)'%3E%3Cpath d='M7 1.5H20.5859C20.7185 1.50004 20.8457 1.55275 20.9395 1.64648L26.3535 7.06055C26.4472 7.15428 26.5 7.28151 26.5 7.41406V29C26.5 29.8284 25.8284 30.5 25 30.5H7C6.17157 30.5 5.5 29.8284 5.5 29V3C5.5 2.17157 6.17157 1.5 7 1.5Z' fill='white' stroke='%23BBBBBB'/%3E%3Cpath d='M20.5 2V5.1C20.5 5.94008 20.5 6.36012 20.6635 6.68099C20.8073 6.96323 21.0368 7.1927 21.319 7.33651C21.6399 7.5 22.0599 7.5 22.9 7.5H26' stroke='%23BBBBBB'/%3E%3C/g%3E%3Cdefs%3E%3CclipPath id='clip0_188_23543'%3E%3Crect width='32' height='32' fill='white'/%3E%3C/clipPath%3E%3C/defs%3E%3C/svg%3E%0A");
    }
    .word {
        background-image: url("data:image/svg+xml,%3Csvg width='32' height='32' viewBox='0 0 32 32' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cg clip-path='url(%23clip0_221_13537)'%3E%3Cpath d='M7 1.5H20.5859C20.7185 1.50004 20.8457 1.55275 20.9395 1.64648L26.3535 7.06055C26.4472 7.15428 26.5 7.28151 26.5 7.41406V29C26.5 29.8284 25.8284 30.5 25 30.5H7C6.17157 30.5 5.5 29.8284 5.5 29V3C5.5 2.17157 6.17157 1.5 7 1.5Z' fill='white' stroke='%23BBBBBB'/%3E%3Cpath d='M20.5 2V5.1C20.5 5.94008 20.5 6.36012 20.6635 6.68099C20.8073 6.96323 21.0368 7.1927 21.319 7.33651C21.6399 7.5 22.0599 7.5 22.9 7.5H26' stroke='%23BBBBBB'/%3E%3Cpath d='M13 20C13.5523 20 14 20.4477 14 21C14 21.5523 13.5523 22 13 22H10C9.44772 22 9 21.5523 9 21C9 20.4477 9.44772 20 10 20H13ZM13 16C13.5523 16 14 16.4477 14 17C14 17.5523 13.5523 18 13 18H10C9.44772 18 9 17.5523 9 17C9 16.4477 9.44772 16 10 16H13ZM22 12C22.5523 12 23 12.4477 23 13C23 13.5523 22.5523 14 22 14H10C9.44772 14 9 13.5523 9 13C9 12.4477 9.44772 12 10 12H22Z' fill='%23A9CBDD'/%3E%3Cpath d='M16 19.2C16 18.0799 16 17.5198 16.218 17.092C16.4097 16.7157 16.7157 16.4097 17.092 16.218C17.5198 16 18.0799 16 19.2 16H24.8C25.9201 16 26.4802 16 26.908 16.218C27.2843 16.4097 27.5903 16.7157 27.782 17.092C28 17.5198 28 18.0799 28 19.2V24.8C28 25.9201 28 26.4802 27.782 26.908C27.5903 27.2843 27.2843 27.5903 26.908 27.782C26.4802 28 25.9201 28 24.8 28H19.2C18.0799 28 17.5198 28 17.092 27.782C16.7157 27.5903 16.4097 27.2843 16.218 26.908C16 26.4802 16 25.9201 16 24.8V19.2Z' fill='%23287CA9'/%3E%3Cpath d='M26 19L24.5477 25H22.9412L22.2677 22.1008C22.2515 22.0392 22.2326 21.9496 22.211 21.8319C22.1893 21.7087 22.1623 21.5742 22.1298 21.4286C22.1028 21.2773 22.0784 21.1345 22.0568 21C22.0352 20.8599 22.0189 20.7479 22.0081 20.6639C21.9973 20.7479 21.9784 20.8599 21.9513 21C21.9297 21.1345 21.9053 21.2773 21.8783 21.4286C21.8513 21.5742 21.8242 21.7087 21.7972 21.8319C21.7755 21.9496 21.7566 22.0392 21.7404 22.1008L21.0588 25H19.4604L18 19H19.3469L20.0365 22.1513C20.0581 22.2353 20.0825 22.3473 20.1095 22.4874C20.1366 22.6218 20.1636 22.7675 20.1907 22.9244C20.2177 23.0756 20.2421 23.2241 20.2637 23.3697C20.2907 23.5098 20.3097 23.6303 20.3205 23.7311C20.3367 23.5966 20.3584 23.4426 20.3854 23.2689C20.4178 23.0952 20.4503 22.9188 20.4828 22.7395C20.5152 22.5602 20.5477 22.3922 20.5801 22.2353C20.6126 22.0784 20.6423 21.9524 20.6694 21.8571L21.359 19H22.6491L23.3387 21.8571C23.355 21.9524 23.3793 22.0784 23.4118 22.2353C23.4496 22.3922 23.4848 22.563 23.5172 22.7479C23.5551 22.9272 23.5876 23.1036 23.6146 23.2773C23.6417 23.451 23.6633 23.6022 23.6795 23.7311C23.6957 23.591 23.7201 23.423 23.7525 23.2269C23.7904 23.0252 23.8283 22.8263 23.8661 22.6303C23.904 22.4286 23.9364 22.2717 23.9635 22.1597L24.6531 19H26Z' fill='white'/%3E%3C/g%3E%3Cdefs%3E%3CclipPath id='clip0_221_13537'%3E%3Crect width='32' height='32' fill='white'/%3E%3C/clipPath%3E%3C/defs%3E%3C/svg%3E%0A");
    }
    .cell {
        background-image: url("data:image/svg+xml,%3Csvg width='32' height='32' viewBox='0 0 32 32' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cg clip-path='url(%23clip0_221_23481)'%3E%3Cpath d='M7 1.5H20.5859C20.7185 1.50004 20.8457 1.55275 20.9395 1.64648L26.3535 7.06055C26.4472 7.15428 26.5 7.28151 26.5 7.41406V29C26.5 29.8284 25.8284 30.5 25 30.5H7C6.17157 30.5 5.5 29.8284 5.5 29V3C5.5 2.17157 6.17157 1.5 7 1.5Z' fill='white' stroke='%23BBBBBB'/%3E%3Cpath d='M20.5 2V5.1C20.5 5.94008 20.5 6.36012 20.6635 6.68099C20.8073 6.96323 21.0368 7.1927 21.319 7.33651C21.6399 7.5 22.0599 7.5 22.9 7.5H26' stroke='%23BBBBBB'/%3E%3Cpath d='M14 20C14.5523 20 15 20.4477 15 21C15 21.5523 14.5523 22 14 22H10C9.44772 22 9 21.5523 9 21C9 20.4477 9.44772 20 10 20H14ZM14 16C14.5523 16 15 16.4477 15 17C15 17.5523 14.5523 18 14 18H10C9.44772 18 9 17.5523 9 17C9 16.4477 9.44772 16 10 16H14ZM14 12C14.5523 12 15 12.4477 15 13C15 13.5523 14.5523 14 14 14H10C9.44772 14 9 13.5523 9 13C9 12.4477 9.44772 12 10 12H14ZM22 12C22.5523 12 23 12.4477 23 13C23 13.5523 22.5523 14 22 14H18C17.4477 14 17 13.5523 17 13C17 12.4477 17.4477 12 18 12H22Z' fill='%23B0D9AD'/%3E%3Cpath d='M16 19.2C16 18.0799 16 17.5198 16.218 17.092C16.4097 16.7157 16.7157 16.4097 17.092 16.218C17.5198 16 18.0799 16 19.2 16H24.8C25.9201 16 26.4802 16 26.908 16.218C27.2843 16.4097 27.5903 16.7157 27.782 17.092C28 17.5198 28 18.0799 28 19.2V24.8C28 25.9201 28 26.4802 27.782 26.908C27.5903 27.2843 27.2843 27.5903 26.908 27.782C26.4802 28 25.9201 28 24.8 28H19.2C18.0799 28 17.5198 28 17.092 27.782C16.7157 27.5903 16.4097 27.2843 16.218 26.908C16 26.4802 16 25.9201 16 24.8V19.2Z' fill='%233AA133'/%3E%3Cpath d='M25 25H23.2957L21.9652 22.916L20.6348 25H19L21.0609 21.916L19 19H20.6435L22.0087 21.0168L23.3565 19H25L22.9043 22.0168L25 25Z' fill='white'/%3E%3C/g%3E%3Cdefs%3E%3CclipPath id='clip0_221_23481'%3E%3Crect width='32' height='32' fill='white'/%3E%3C/clipPath%3E%3C/defs%3E%3C/svg%3E%0A");
    }
    .slide {
        background-image: url("data:image/svg+xml,%3Csvg width='32' height='32' viewBox='0 0 32 32' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cg clip-path='url(%23clip0_221_23501)'%3E%3Cpath d='M7 1.5H20.5859C20.7185 1.50004 20.8457 1.55275 20.9395 1.64648L26.3535 7.06055C26.4472 7.15428 26.5 7.28151 26.5 7.41406V29C26.5 29.8284 25.8284 30.5 25 30.5H7C6.17157 30.5 5.5 29.8284 5.5 29V3C5.5 2.17157 6.17157 1.5 7 1.5Z' fill='white' stroke='%23BBBBBB'/%3E%3Cpath d='M20.5 2V5.1C20.5 5.94008 20.5 6.36012 20.6635 6.68099C20.8073 6.96323 21.0368 7.1927 21.319 7.33651C21.6399 7.5 22.0599 7.5 22.9 7.5H26' stroke='%23BBBBBB'/%3E%3Cpath opacity='0.4' d='M9.5 14C9.22386 14 8.99741 13.7756 9.02498 13.5008C9.07368 13.0155 9.19324 12.5389 9.3806 12.0866C9.63188 11.48 10.0002 10.9288 10.4645 10.4645C10.9288 10.0002 11.48 9.63188 12.0866 9.3806C12.5389 9.19324 13.0155 9.07368 13.5008 9.02498C13.7756 8.99741 14 9.22386 14 9.5V13.5C14 13.7761 13.7761 14 13.5 14H9.5Z' fill='%23ED771C'/%3E%3Cpath d='M10.5 16C10.2239 16 9.99784 16.2243 10.0208 16.4994C10.1052 17.51 10.4448 18.4857 11.0112 19.3334C11.6705 20.3201 12.6075 21.0892 13.7039 21.5433C14.8003 21.9974 16.0067 22.1162 17.1705 21.8847C18.3344 21.6532 19.4035 21.0818 20.2426 20.2426C21.0818 19.4035 21.6532 18.3344 21.8847 17.1705C22.1162 16.0067 21.9974 14.8003 21.5433 13.7039C21.0892 12.6075 20.3201 11.6705 19.3334 11.0112C18.4857 10.4448 17.51 10.1052 16.4994 10.0208C16.2243 9.99783 16 10.2239 16 10.5V15.5C16 15.7761 15.7761 16 15.5 16H10.5Z' fill='%23F8C9A4'/%3E%3Cpath d='M16 19.2C16 18.0799 16 17.5198 16.218 17.092C16.4097 16.7157 16.7157 16.4097 17.092 16.218C17.5198 16 18.0799 16 19.2 16H24.8C25.9201 16 26.4802 16 26.908 16.218C27.2843 16.4097 27.5903 16.7157 27.782 17.092C28 17.5198 28 18.0799 28 19.2V24.8C28 25.9201 28 26.4802 27.782 26.908C27.5903 27.2843 27.2843 27.5903 26.908 27.782C26.4802 28 25.9201 28 24.8 28H19.2C18.0799 28 17.5198 28 17.092 27.782C16.7157 27.5903 16.4097 27.2843 16.218 26.908C16 26.4802 16 25.9201 16 24.8V19.2Z' fill='%23ED771C'/%3E%3Cpath d='M22.3465 19C23.2508 19 23.9175 19.1681 24.3465 19.5042C24.7822 19.8347 25 20.2969 25 20.8908C25 21.1597 24.9538 21.4846 24.8614 21.7311C24.769 21.972 24.6139 22.1877 24.396 22.3782C24.1848 22.5686 23.9043 22.7199 23.5545 22.8319C23.2112 22.944 22.7855 23 22.2772 23H21.5V25H20V19H22.3465ZM22.5446 20.1681H21.5V21.7647H22.3861C22.6172 21.7647 22.8185 21.7367 22.9901 21.6807C23.1683 21.6246 23.3069 21.535 23.4059 21.4118C23.5049 21.2885 23.5545 21.1289 23.5545 20.9328C23.5545 20.6863 23.4719 20.4986 23.3069 20.3697C23.1419 20.2353 22.8878 20.1681 22.5446 20.1681Z' fill='white'/%3E%3C/g%3E%3Cdefs%3E%3CclipPath id='clip0_221_23501'%3E%3Crect width='32' height='32' fill='white'/%3E%3C/clipPath%3E%3C/defs%3E%3C/svg%3E%0A");
    }
    .pdf {
        background-image: url("data:image/svg+xml,%3Csvg width='32' height='32' viewBox='0 0 32 32' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cg clip-path='url(%23clip0_221_1064)'%3E%3Cg clip-path='url(%23clip1_221_1064)'%3E%3Cpath d='M7 1.5H20.5859C20.7185 1.50004 20.8457 1.55275 20.9395 1.64648L26.3535 7.06055C26.4472 7.15428 26.5 7.28151 26.5 7.41406V29C26.5 29.8284 25.8284 30.5 25 30.5H7C6.17157 30.5 5.5 29.8284 5.5 29V3C5.5 2.17157 6.17157 1.5 7 1.5Z' fill='white' stroke='%23BBBBBB'/%3E%3Cpath d='M20.5 2V5.1C20.5 5.94008 20.5 6.36012 20.6635 6.68099C20.8073 6.96323 21.0368 7.1927 21.319 7.33651C21.6399 7.5 22.0599 7.5 22.9 7.5H26' stroke='%23BBBBBB'/%3E%3Cpath d='M13 20C13.5523 20 14 20.4477 14 21C14 21.5523 13.5523 22 13 22H10C9.44772 22 9 21.5523 9 21C9 20.4477 9.44772 20 10 20H13ZM13 16C13.5523 16 14 16.4477 14 17C14 17.5523 13.5523 18 13 18H10C9.44772 18 9 17.5523 9 17C9 16.4477 9.44772 16 10 16H13ZM22 12C22.5523 12 23 12.4477 23 13C23 13.5523 22.5523 14 22 14H10C9.44772 14 9 13.5523 9 13C9 12.4477 9.44772 12 10 12H22Z' fill='%23F5A99F'/%3E%3Cpath d='M16 19.2C16 18.0799 16 17.5198 16.218 17.092C16.4097 16.7157 16.7157 16.4097 17.092 16.218C17.5198 16 18.0799 16 19.2 16H24.8C25.9201 16 26.4802 16 26.908 16.218C27.2843 16.4097 27.5903 16.7157 27.782 17.092C28 17.5198 28 18.0799 28 19.2V24.8C28 25.9201 28 26.4802 27.782 26.908C27.5903 27.2843 27.2843 27.5903 26.908 27.782C26.4802 28 25.9201 28 24.8 28H19.2C18.0799 28 17.5198 28 17.092 27.782C16.7157 27.5903 16.4097 27.2843 16.218 26.908C16 26.4802 16 25.9201 16 24.8V19.2Z' fill='%23E52910'/%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M21.0154 18C21.0154 19.1647 20.6828 20.5384 20.1205 21.8058C19.556 23.0783 18.7941 24.1669 18 24.8087L18.8628 26C21.003 24.5583 23.3728 23.5702 25.6658 23.901L26 22.469C24.0462 21.8117 22.4786 19.839 22.4786 18H21.0154ZM21.9697 21.0495C21.8234 21.5126 21.6501 21.9697 21.4542 22.4106C21.3484 22.6494 21.2358 22.8848 21.1149 23.1167C21.7956 22.8449 22.499 22.6315 23.2171 22.5015C22.7386 22.0763 22.319 21.5879 21.9697 21.0495Z' fill='white'/%3E%3C/g%3E%3C/g%3E%3Cdefs%3E%3CclipPath id='clip0_221_1064'%3E%3Crect width='32' height='32' fill='white'/%3E%3C/clipPath%3E%3CclipPath id='clip1_221_1064'%3E%3Crect width='32' height='32' fill='white'/%3E%3C/clipPath%3E%3C/defs%3E%3C/svg%3E%0A");
    }
    .text {
        background-image: url("data:image/svg+xml,%3Csvg width='32' height='32' viewBox='0 0 32 32' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cg clip-path='url(%23clip0_221_13554)'%3E%3Cg clip-path='url(%23clip1_221_13554)'%3E%3Cpath d='M7 1.5H20.5859C20.7185 1.50004 20.8457 1.55275 20.9395 1.64648L26.3535 7.06055C26.4472 7.15428 26.5 7.28151 26.5 7.41406V29C26.5 29.8284 25.8284 30.5 25 30.5H7C6.17157 30.5 5.5 29.8284 5.5 29V3C5.5 2.17157 6.17157 1.5 7 1.5Z' fill='white' stroke='%23BBBBBB'/%3E%3Cpath d='M20.5 2V5.1C20.5 5.94008 20.5 6.36012 20.6635 6.68099C20.8073 6.96323 21.0368 7.1927 21.319 7.33651C21.6399 7.5 22.0599 7.5 22.9 7.5H26' stroke='%23BBBBBB'/%3E%3Cpath d='M17 20C17.5523 20 18 20.4477 18 21C18 21.5523 17.5523 22 17 22H10C9.44772 22 9 21.5523 9 21C9 20.4477 9.44772 20 10 20H17ZM22 16C22.5523 16 23 16.4477 23 17C23 17.5523 22.5523 18 22 18H10C9.44772 18 9 17.5523 9 17C9 16.4477 9.44772 16 10 16H22ZM22 12C22.5523 12 23 12.4477 23 13C23 13.5523 22.5523 14 22 14H10C9.44772 14 9 13.5523 9 13C9 12.4477 9.44772 12 10 12H22Z' fill='%23A1A1A1'/%3E%3C/g%3E%3C/g%3E%3Cdefs%3E%3CclipPath id='clip0_221_13554'%3E%3Crect width='32' height='32' fill='white'/%3E%3C/clipPath%3E%3CclipPath id='clip1_221_13554'%3E%3Crect width='32' height='32' fill='white'/%3E%3C/clipPath%3E%3C/defs%3E%3C/svg%3E%0A");
    }
    .image {
        background-image: url("data:image/svg+xml,%3Csvg width='32' height='32' viewBox='0 0 32 32' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cg clip-path='url(%23clip0_221_1811)'%3E%3Cg clip-path='url(%23clip1_221_1811)'%3E%3Cpath d='M7 1.5H20.5859C20.7185 1.50004 20.8457 1.55275 20.9395 1.64648L26.3535 7.06055C26.4472 7.15428 26.5 7.28151 26.5 7.41406V29C26.5 29.8284 25.8284 30.5 25 30.5H7C6.17157 30.5 5.5 29.8284 5.5 29V3C5.5 2.17157 6.17157 1.5 7 1.5Z' fill='white' stroke='%23BBBBBB'/%3E%3Cpath d='M20.5 2V5.1C20.5 5.94008 20.5 6.36012 20.6635 6.68099C20.8073 6.96323 21.0368 7.1927 21.319 7.33651C21.6399 7.5 22.0599 7.5 22.9 7.5H26' stroke='%23BBBBBB'/%3E%3Cpath opacity='0.6' d='M19.5808 17.2273C19.7671 16.9242 20.2329 16.9242 20.4192 17.2273L22.9344 21.3182C23.1207 21.6212 22.8878 22 22.5152 22H17.4848C17.1122 22 16.8793 21.6212 17.0656 21.3182L19.5808 17.2273Z' fill='%23A671D8'/%3E%3Cpath d='M14.1215 13.2432C14.3201 12.9189 14.8165 12.9189 15.015 13.2432L19.9301 21.2703C20.1287 21.5946 19.8805 22 19.4834 22H9.51663C9.11952 22 8.87133 21.5946 9.06988 21.2703L14.1215 13.2432Z' fill='%23A671D8'/%3E%3Ccircle cx='19' cy='14' r='1' fill='%23A671D8'/%3E%3C/g%3E%3C/g%3E%3Cdefs%3E%3CclipPath id='clip0_221_1811'%3E%3Crect width='32' height='32' fill='white'/%3E%3C/clipPath%3E%3CclipPath id='clip1_221_1811'%3E%3Crect width='32' height='32' fill='white'/%3E%3C/clipPath%3E%3C/defs%3E%3C/svg%3E%0A");
    }

    #selector {
        height: 100%;
        flex-direction: column;
    }
    #selector-header {
        display: flex;
        flex-direction: row;
        align-items: center;
        height: 54px;
        padding-left: 16px;
    }
    #selector-header div:not(.selector-arrow) {
        cursor: pointer;
        font-weight: 600;
        font-size: 16px;
        font-family: "Open Sans", sans-serif;
        color: ${dark ? colors.dark_tertiaryText : colors.tertiaryText};
    }
    .selector-arrow {
        margin: 0 8px 0 8px;
    }
    .current-folder {
        color: ${dark ? colors.dark_contrastText : colors.contrastText} !important;
        cursor: default !important;
    }
    #selector-body {
        overflow-y: auto;
        height: calc(100% - 54px);
        ${dark ? `scrollbar-color: ${colors.dark_tertiaryText} ${colors.dark_background};` : ""}
    }
    .selector-folder {
        display: flex;
        flex-direction: row;
        align-items: center;
        padding: 8px 16px;
    }
    .selector-folder-icon svg circle {
        fill: ${dark ? colors.black : colors.border};
    }
    .selector-folder-icon svg path:not(:first-child) {
        fill: ${dark ? colors.dark_text : colors.tertiaryText};
    }
    .selector-folder-title {
        font-family: "Open Sans", sans-serif;
        cursor: pointer;
        font-weight: 600;
        font-size: 14px;
        margin-left: 8px;
        color: ${dark ? colors.dark_contrastText : colors.contrastText};
    }
    .selector-folder-title:hover {
        text-decoration: underline;
    }

    #temp-footer {
        display: flex;
        flex-direction: row;
        align-items: center;
        position: absolute;
        bottom: 8px;
        right: 16px;
    }
    #temp-footer div {
        cursor: pointer;
        font-weight: 600;
        font-size: 14px;
        font-family: "Open Sans", sans-serif;
        color: ${dark ? colors.dark_contrastText : colors.contrastText};
        background-color: ${dark ? colors.dark_background : colors.background};
        border-radius: 3px;
        border: 1px solid ${dark ? colors.dark_border : colors.border};
        padding: 12px 28px;
    }
    #temp-extract-button {
        background-color: ${colors.blue} !important;
        color: ${colors.dark_contrastText} !important;
        border: none !important;
        margin-right: 8px;
    }
    </style>
  `;

  const font = iframe.contentWindow!.document.createElement("link");
  font.rel = "stylesheet";
  font.href = "https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,300..800;1,300..800&display=swap";
  iframe.contentWindow!.document.head.appendChild(font);
}
