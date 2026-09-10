import { describe, expect, it } from "vitest";

import { parseEmail } from "./parse";

// 1x1 transparent PNG.
const PNG_BASE64 =
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==";

const EML = [
  "From: =?UTF-8?B?0JjQstCw0L0g0J/QtdGC0YDQvtCy?= <ivan@example.com>",
  "To: Anna Smith <anna@example.com>, bob@example.com",
  "Cc: undisclosed-recipients:;",
  "Subject: =?UTF-8?B?0J7RgtGH0ZHRgiDQt9CwINC80LDRgNGC?=",
  "Date: Tue, 14 Apr 2026 09:30:00 +0300",
  "MIME-Version: 1.0",
  'Content-Type: multipart/mixed; boundary="outer"',
  "",
  "--outer",
  'Content-Type: multipart/related; boundary="inner"',
  "",
  "--inner",
  "Content-Type: text/html; charset=utf-8",
  "Content-Transfer-Encoding: 8bit",
  "",
  '<html><head><style>p { color: red }</style></head><body><p>Привет, <b>Анна</b>!</p><img src="cid:logo@example"><script>alert(1)</script></body></html>',
  "",
  "--inner",
  "Content-Type: image/png",
  "Content-Transfer-Encoding: base64",
  "Content-ID: <logo@example>",
  "Content-Disposition: inline; filename=logo.png",
  "",
  PNG_BASE64,
  "--inner--",
  "",
  "--outer",
  "Content-Type: application/pdf; name=report.pdf",
  "Content-Transfer-Encoding: base64",
  'Content-Disposition: attachment; filename="report.pdf"',
  "",
  "JVBERi0xLjQK",
  "--outer--",
  "",
].join("\r\n");

const toBuffer = (s: string): ArrayBuffer => new TextEncoder().encode(s).buffer as ArrayBuffer;

describe("parseEmail (.eml)", () => {
  it("decodes headers, addresses and the date", async () => {
    const email = await parseEmail(toBuffer(EML));
    expect(email.subject).toBe("Отчёт за март");
    expect(email.from).toEqual([{ name: "Иван Петров", address: "ivan@example.com" }]);
    expect(email.to).toEqual([
      { name: "Anna Smith", address: "anna@example.com" },
      { name: "", address: "bob@example.com" },
    ]);
    expect(email.cc).toEqual([]);
    expect(email.date?.toISOString()).toBe("2026-04-14T06:30:00.000Z");
  });

  it("separates inline images from real attachments", async () => {
    const email = await parseEmail(toBuffer(EML));
    const names = email.attachments.map((a) => [a.name, a.inline, a.contentId]);
    expect(names).toEqual([
      ["logo.png", true, "logo@example"],
      ["report.pdf", false, null],
    ]);
    const pdf = email.attachments[1];
    expect(pdf.mimeType).toBe("application/pdf");
    expect(new TextDecoder().decode(pdf.content)).toBe("%PDF-1.4\n");
    expect(pdf.size).toBe(9);
  });

  it("keeps the HTML body raw for the sanitiser", async () => {
    const email = await parseEmail(toBuffer(EML));
    expect(email.html).toContain("<script>");
    expect(email.text).toBeNull();
  });

  it("reads a plain-text message", async () => {
    const plain = [
      "From: a@example.com",
      "Subject: hi",
      "",
      "Just text.",
      "https://example.com/x.",
    ].join("\r\n");
    const email = await parseEmail(toBuffer(plain));
    expect(email.html).toBeNull();
    expect(email.text).toBe("Just text.\nhttps://example.com/x.\n");
    expect(email.attachments).toEqual([]);
  });

  it("rejects a compound file that is not a message", async () => {
    const ole = new Uint8Array(1024);
    ole.set([0xd0, 0xcf, 0x11, 0xe0, 0xa1, 0xb1, 0x1a, 0xe1]);
    await expect(parseEmail(ole.buffer)).rejects.toThrow();
  });
});
