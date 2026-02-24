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
import mammoth from "mammoth";

import plugin from ".";

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

  private turndownService = new TurndownService({
    headingStyle: "atx",
    codeBlockStyle: "fenced",
    emDelimiter: "*",
    bulletListMarker: "-",
  });

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
      throw new Error("Unable to get file information");
    }
    
    const data = await response.json();
    if (data.error) {
      throw new Error(data.error.message || "Failed to get file details");
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
      throw new Error(`Failed to download file: ${response.statusText}`);
    }
    
    const buffer = await response.arrayBuffer();
    if (!buffer || buffer.byteLength === 0) {
      throw new Error("Downloaded file is empty");
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
      throw new Error(`Failed to initiate upload: ${sessionResponse.status}`);
    }

    const session = await sessionResponse.json();
    if (session.error) {
      throw new Error(session.error.message || "Upload session failed");
    }

    if (!session.response?.data?.location) {
      throw new Error("Invalid upload session response");
    }

    // Upload the file
    const formData = new FormData();
    formData.append("file", file);

    const uploadResponse = await fetch(session.response.data.location, {
      method: "POST",
      body: formData,
    });

    if (!uploadResponse.ok) {
      throw new Error(`Upload failed: ${uploadResponse.status} ${uploadResponse.statusText}`);
    }

    // Verify the upload result
    const uploadResult = await uploadResponse.json();
    
    // Check for various error conditions in the response
    if (uploadResult.error) {
      throw new Error(uploadResult.error.message || "Upload failed");
    }
    
    if (uploadResult.success === false) {
      throw new Error(uploadResult.message || "Upload was not successful");
    }

    // For chunked uploads, check if file was actually created
    if (uploadResult.data && uploadResult.data.id === undefined && uploadResult.data.uploaded !== true) {
      throw new Error("File was not created on server");
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
        throw new Error(`Unsupported format: ${fileExst}`);
      }

      // 3. Download the source file
      const buffer = await this.downloadFile(viewUrl);

      // 4. Convert to markdown
      const markdown = await converter(buffer);

      // 5. Upload the new markdown file
      const newFileName = `${baseName}.md`;
      await this.uploadMarkdownFile(folderId, newFileName, markdown);

      this.createLock = false;
      return this.showSuccess(`Created "${newFileName}"`);
    } catch (error: any) {
      this.createLock = false;
      return this.showError(error?.message || "Conversion failed");
    }
  };
}

const convertFile = new ConvertFile();

export default convertFile;
