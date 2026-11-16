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

import { afterEach, describe, expect, it, vi } from "vitest";

import { copyText } from "./copy-text";

const setClipboard = (clipboard: unknown) =>
  Object.defineProperty(navigator, "clipboard", { value: clipboard, configurable: true });

// jsdom has no copy command; a test puts in the one it needs.
const setExecCommand = (result: boolean) => {
  const exec = vi.fn(() => result);
  Object.defineProperty(document, "execCommand", { value: exec, configurable: true });
  return exec;
};

describe("copyText", () => {
  afterEach(() => {
    setClipboard(undefined);
    document.body.innerHTML = "";
  });

  it("uses the Clipboard API where the page is a secure context", async () => {
    const writeText = vi.fn(() => Promise.resolve());
    setClipboard({ writeText });
    const exec = setExecCommand(true);

    await copyText("<p>Hi</p>", document.body);

    expect(writeText).toHaveBeenCalledWith("<p>Hi</p>");
    expect(exec).not.toHaveBeenCalled();
  });

  it("copies through a textarea in the container on plain http, then removes it", async () => {
    setClipboard(undefined);
    const container = document.createElement("div");
    document.body.appendChild(container);
    let copied: string | undefined;
    const exec = setExecCommand(true);
    exec.mockImplementation(() => {
      copied = container.querySelector("textarea")?.value;
      return true;
    });

    await copyText("<p>Hi</p>", container);

    expect(exec).toHaveBeenCalledWith("copy");
    expect(copied).toBe("<p>Hi</p>");
    expect(container.querySelector("textarea")).toBeNull();
  });

  it("fails when the browser refuses the copy command", async () => {
    setClipboard(undefined);
    setExecCommand(false);

    await expect(copyText("x", document.body)).rejects.toThrow();
    expect(document.querySelector("textarea")).toBeNull();
  });
});
