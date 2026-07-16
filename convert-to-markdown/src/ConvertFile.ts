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
  Actions,
  IMessage,
  ToastType,
} from "@onlyoffice/docspace-plugin-sdk";
import TurndownService from "turndown";
import { tables } from "turndown-plugin-gfm";
import mammoth from "mammoth";
import { i18n } from "./locales";

import plugin from ".";

// Patch mammoths internal Element.prototype.text which throws "Not implemented"
// when an element has multiple or non text children 
// Both convertToHtml and extractRawText hit the same reader path, so patching
// at the source is the only reliable fix for the issue
const patchMammothNodes = (): void => {
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const nodes = require("mammoth/lib/xml/nodes");
    const collectText = (children: any[]): string =>
      children
        .map((child: any) => {
          if (child.type === "text") return child.value;
          if (Array.isArray(child.children)) return collectText(child.children);
          return "";
        })
        .join("");

    nodes.Element.prototype.text = function (): string {
      if (this.children.length === 0) return "";
      return collectText(this.children);
    };
  } catch (_) {
    // If patching fails mammoth will still work for docs that dont hit the bug
  }
};
patchMammothNodes();

// Supported file extensions
const SUPPORTED_EXTENSIONS = {
  docx: ".docx",
  html: ".html",
  txt: ".txt",
} as const;

type SupportedExtension = (typeof SUPPORTED_EXTENSIONS)[keyof typeof SUPPORTED_EXTENSIONS];

class ConvertFile {
  private apiURL = "";
  private createLock = false;

  private turndownService = (() => {
    const service = new TurndownService({
      headingStyle: "atx",
      codeBlockStyle: "fenced",
      emDelimiter: "*",
      bulletListMarker: "-",
    });
    service.use(tables);

    // Handle tables that have no <thead> (all rows in <tbody>)
    // The GFM tables plugin only produces pipe-tables when it finds <th> / <thead>
    // so we need a separate rule that treats the first <tr> as the header
    service.addRule("tableWithoutHeader", {
      filter: (node: HTMLElement): boolean => {
        return node.nodeName === "TABLE" && !node.querySelector("thead");
      },
      replacement: (_content: string, node: Node): string => {
        const el = node as HTMLElement;
        const rows = Array.from(el.querySelectorAll("tr"));
        if (rows.length === 0) return _content;

        const getCells = (row: Element): string[] =>
          Array.from(row.querySelectorAll("td, th")).map((cell) =>
            (cell.textContent || "")
              .trim()
              .replace(/\s+/g, " ")
              .replace(/\|/g, "\\|")
          );

        const allRows = rows.map(getCells);
        const header = allRows[0];
        const separator = header.map(() => "---");
        const body = allRows.slice(1);

        const fmt = (cells: string[]): string => `| ${cells.join(" | ")} |`;

        return (
          "\n\n" +
          [fmt(header), fmt(separator), ...body.map(fmt)].join("\n") +
          "\n\n"
        );
      },
    });

    return service;
  })();

  private createAPIUrl = (): void => {
    const api = plugin.getAPI();
    this.apiURL = api.origin.replace(/\/+$/, "");

    [api.proxy, api.prefix].forEach((part) => {
      if (!part) return;
      const cleaned = part.trim().replace(/^\/+/, "");
      if (cleaned) {
        this.apiURL += this.apiURL.endsWith("/") ? cleaned : `/${cleaned}`;
      }
    });
  };

  private decodeText = (buffer: ArrayBuffer): string => {
    return new TextDecoder("utf-8").decode(buffer);
  };

  private htmlToMarkdown = (html: string): string => {
    return this.turndownService.turndown(html);
  };

  private convertDocx = async (buffer: ArrayBuffer): Promise<string> => {
    const result = await mammoth.convertToHtml({ arrayBuffer: buffer });
    return this.htmlToMarkdown(result.value);
  };

  private convertHtml = (buffer: ArrayBuffer): string => {
    return this.htmlToMarkdown(this.decodeText(buffer));
  };

  private convertTxt = (buffer: ArrayBuffer): string => {
    return this.decodeText(buffer);
  };

  private getConverter = (ext: string): ((buffer: ArrayBuffer) => Promise<string> | string) | null => {
    const converters: Record<SupportedExtension, (buffer: ArrayBuffer) => Promise<string> | string> = {
      ".docx": this.convertDocx,
      ".html": this.convertHtml,
      ".txt": this.convertTxt,
    };
    return converters[ext as SupportedExtension] || null;
  };

  private showToast = (success: boolean, message: string): IMessage => ({
    actions: [Actions.showToast],
    toastProps: [{ type: success ? ToastType.success : ToastType.error, title: message }],
  });

  private showError = (message: string): IMessage => this.showToast(false, message);
  private showSuccess = (message: string): IMessage => this.showToast(true, message);

  /**
   * Fetches file from the API
   */
  private getFileInfo = async (fileId: number) => {
    const response = await fetch(`${this.apiURL}/files/file/${fileId}`);
    
    if (!response.ok) {
      throw new Error(i18n.t('toast.unable_to_get_file_info'));
    }
    
    const data = await response.json();
    if (data.error) {
      throw new Error(data.error.message || i18n.t('toast.failed_to_get_file_details'));
    }
    
    return data.response;
  };

  /**
   * Downloads the file content.
   * Note: Permission checks are handled by itemSecurity: FilesSecurity.Download
   */
  private downloadFile = async (url: string): Promise<ArrayBuffer> => {
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(i18n.t('toast.failed_to_download_file') + response.statusText);
    }

    const contentType = response.headers.get("Content-Type") || "";
    if (contentType.includes("application/pdf")) {
      throw new Error(i18n.t('toast.watermark_protected'));
    }
    
    const buffer = await response.arrayBuffer();
    if (!buffer || buffer.byteLength === 0) {
      throw new Error(i18n.t('toast.empty_file'));
    }
    
    return buffer;
  };

  /**
   * Uploads the markdown file to the specified folder.
   * Note: Permission checks are handled by SDK (security: Security.Create)
   */
  private uploadMarkdownFile = async (folderId: number, fileName: string, content: string): Promise<void> => {
    const blob = new Blob([content], { type: "text/markdown" });
    const file = new File([blob], fileName, { type: "text/markdown", lastModified: Date.now() });

    // Create upload session
    const sessionResponse = await fetch(`${this.apiURL}/files/${folderId}/upload/create_session`, {
      method: "POST",
      headers: { "Content-Type": "application/json;charset=utf-8" },
      body: JSON.stringify({
        createOn: new Date(),
        fileName,
        fileSize: file.size,
        relativePath: "",
      }),
    });

    if (!sessionResponse.ok) {
      throw new Error(i18n.t('toast.failed_to_initiate_upload') + sessionResponse.status);
    }

    const session = await sessionResponse.json();
    if (session.error) {
      throw new Error(session.error.message || i18n.t('toast.upload_failed'));
    }

    if (!session.response?.data?.location) {
      throw new Error(i18n.t('toast.invalid_upload_session'));
    }

    // Upload the file
    const formData = new FormData();
    formData.append("file", file);

    const uploadResponse = await fetch(session.response.data.location, {
      method: "POST",
      body: formData,
    });

    if (!uploadResponse.ok) {
      throw new Error(i18n.t('toast.upload_failed') + uploadResponse.status + " " + uploadResponse.statusText);
    }

    // Verify the upload result
    const uploadResult = await uploadResponse.json();
    
    // Check for various error conditions in the response
    if (uploadResult.error) {
      throw new Error(uploadResult.error.message || i18n.t('toast.upload_failed'));
    }
    
    if (uploadResult.success === false) {
      throw new Error(uploadResult.message || i18n.t('toast.upload_failed'));
    }

    // For chunked uploads, check if file was actually created
    if (uploadResult.data && uploadResult.data.id === undefined && uploadResult.data.uploaded !== true) {
      throw new Error(i18n.t('toast.file_not_created'));
    }
  };

  /**
   * Main conversion handler, called when user clicks "convert to markdown"
   */
  onConvertToMarkdown = async (id: number): Promise<IMessage | {}> => {
    if (!this.apiURL) this.createAPIUrl();
    if (this.createLock) return {};
    this.createLock = true;

    try {
      // 1. Get file info
      const { viewUrl, folderId, title, fileExst } = await this.getFileInfo(id);
      const baseName = title?.replace(/\.[^/.]+$/, "") || title;

      // 2. Check if we support this file type
      const converter = this.getConverter(fileExst);
      if (!converter) {
        throw new Error(i18n.t('toast.unsupported_format') + fileExst);
      }

      // 3. Download the source file
      const buffer = await this.downloadFile(viewUrl);

      // 4. Convert to markdown
      const markdown = await converter(buffer);

      // 5. Upload the new markdown file
      const newFileName = `${baseName}.md`;
      await this.uploadMarkdownFile(folderId, newFileName, markdown);

      this.createLock = false;
      return this.showSuccess(i18n.t('toast.created') + newFileName);
    } catch (error: any) {
      this.createLock = false;
      return this.showError(error?.message || i18n.t('toast.conversion_failed'));
    }
  };
}

const convertFile = new ConvertFile();

export default convertFile;
