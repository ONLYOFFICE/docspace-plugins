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

/**
 * Syntax colouring for the source view: HTML, the CSS in `<style>` blocks and `style`
 * attributes, and the JavaScript in `<script>`. A highlighter library would be ten times
 * the size of the plugin for what is only colour - a token it gets wrong is painted the
 * wrong colour, never lost, and every character is escaped on the way out.
 */

export type TokenKind =
  | "punct"
  | "tag"
  | "attr"
  | "string"
  | "comment"
  | "keyword"
  | "selector"
  | "property"
  | "number"
  | "entity";

type Token = [kind: TokenKind | "", text: string];

// The repeated parts are written as "run, then (special, run)*" rather than "(a|b)*": an
// alternation repeated per character keeps a backtracking frame per character, and a
// multi-megabyte string or data URI overflowed the stack.
const MARKUP =
  /<!--[\s\S]*?(?:-->|$)|<![^>]*>?|<\/?[A-Za-z][^\s/>]*[^>"']*(?:(?:"[^"]*"|'[^']*')[^>"']*)*>?|&#?\w+;/g;

// Inside a tag matched by MARKUP quotes are always balanced.
const ATTRIBUTE = /(\s+)|([^\s"'>/=]+)(?:(\s*=\s*)("[^"]*"|'[^']*'|[^\s"'>]+))?|([\s\S])/gy;

// url(...) is one token: the ";" of a data: URI inside it is not the end of a declaration.
const CSS =
  /\/\*[\s\S]*?(?:\*\/|$)|"[^"\\\n]*(?:\\.[^"\\\n]*)*"?|'[^'\\\n]*(?:\\.[^'\\\n]*)*'?|url\(\s*(?:"[^"\\\n]*(?:\\.[^"\\\n]*)*"?|'[^'\\\n]*(?:\\.[^'\\\n]*)*'?|[^)"']*)\s*\)?|@[\w-]+|!\s*important|#[\da-f]{3,8}\b|-?(?:\d+\.?\d*|\.\d+)[a-z%]*|[\w.#-]+|[{};:]/gi;

const JS =
  /\/\*[\s\S]*?(?:\*\/|$)|\/\/[^\n]*|"[^"\\\n]*(?:\\.[^"\\\n]*)*"?|'[^'\\\n]*(?:\\.[^'\\\n]*)*'?|`[^`\\]*(?:\\[\s\S][^`\\]*)*`?|\b\d[\w.]*|\b(?:async|await|break|case|catch|class|const|continue|default|delete|do|else|export|extends|false|finally|for|from|function|if|import|in|instanceof|let|new|null|of|return|switch|this|throw|true|try|typeof|undefined|var|void|while|yield)\b/g;

const NEXT_BRACE = /[;{}]/g;

const NUMBER = /^(?:-?\.?\d|#)/; // 12px, -.5em, #fff - not .class

/** Splits an HTML source into coloured runs; joined back together they are the source. */
export function tokenize(source: string): Token[] {
  const out: Token[] = [];
  let last = 0;
  MARKUP.lastIndex = 0;
  for (let m; (m = MARKUP.exec(source));) {
    if (m.index > last) out.push(["", source.slice(last, m.index)]);
    const text = m[0];
    last = MARKUP.lastIndex;
    if (text.startsWith("<!--")) out.push(["comment", text]);
    else if (text.startsWith("<!")) out.push(["keyword", text]);
    else if (text[0] === "&") out.push(["entity", text]);
    else {
      const name = tag(text, out).toLowerCase();
      if ((name === "style" || name === "script") && text[1] !== "/" && !text.endsWith("/>")) {
        // Raw text up to the closing tag: markup inside it is not markup.
        const close = new RegExp(`</${name}`, "gi");
        close.lastIndex = last;
        const end = close.exec(source)?.index ?? source.length;
        if (name === "style") css(source.slice(last, end), out, false);
        else js(source.slice(last, end), out);
        MARKUP.lastIndex = last = end;
      }
    }
  }
  if (last < source.length) out.push(["", source.slice(last)]);
  return out;
}

/** Pushes the runs of one tag and returns its name. */
function tag(text: string, out: Token[]): string {
  const [, open, name] = /^(<\/?)([^\s/>]*)/.exec(text)!;
  out.push(["punct", open], ["tag", name]);
  ATTRIBUTE.lastIndex = open.length + name.length;
  for (let m; (m = ATTRIBUTE.exec(text));) {
    const [, space, attr, equals, value, other] = m;
    if (space) out.push(["", space]);
    else if (other) out.push(["punct", other]);
    else {
      out.push(["attr", attr]);
      if (!equals) continue;
      out.push(["punct", equals]);
      const quote = value[0] === '"' || value[0] === "'" ? value[0] : "";
      if (quote && attr.toLowerCase() === "style") {
        out.push(["string", quote]);
        css(value.slice(1, -1), out, true);
        out.push(["string", quote]);
      } else out.push(["string", value]);
    }
  }
  return name;
}

/** `inline` is the body of a `style` attribute: declarations with no selector or braces. */
function css(source: string, out: Token[], inline: boolean): void {
  let depth = inline ? 1 : 0;
  let property = inline; // the next word names a property, not a value
  let selector = false; // inside a selector nested in an at-rule, where ':' is a pseudo-class
  let prelude = false; // between an at-rule and its block
  // The next ";", "{" or "}" at or after `last`, found once: rescanning for every word
  // was quadratic in a long value.
  let braceAt = -1;
  let brace: string | undefined;
  let last = 0;
  for (const m of source.matchAll(CSS)) {
    if (m.index > last) out.push(["", source.slice(last, m.index)]);
    const s = m[0];
    last = m.index + s.length;
    let kind: TokenKind | "" = "";
    if (s.startsWith("/*")) kind = "comment";
    else if (s[0] === '"' || s[0] === "'" || /^url\(/i.test(s)) kind = "string";
    else if (s[0] === "@") [kind, prelude] = ["keyword", true];
    else if (s[0] === "!") kind = "keyword";
    else if (s === "{") [depth, property, selector, prelude] = [depth + 1, true, false, false];
    else if (s === "}") [depth, property] = [Math.max(depth - 1, 0), true];
    else if (s === ";") [property, prelude] = [true, false];
    else if (s === ":") property = property && (selector || depth === 0);
    else if (prelude) kind = NUMBER.test(s) ? "number" : "";
    else if (depth === 0) kind = "selector";
    else if (property) {
      // A word that opens a block is a selector nested in @media, not a property.
      if (braceAt < last) {
        NEXT_BRACE.lastIndex = last;
        const next = NEXT_BRACE.exec(source);
        braceAt = next ? next.index : Infinity;
        brace = next?.[0];
      }
      selector = brace === "{";
      kind = selector ? "selector" : "property";
    } else if (NUMBER.test(s)) kind = "number";
    out.push([kind, s]);
  }
  if (last < source.length) out.push(["", source.slice(last)]);
}

function js(source: string, out: Token[]): void {
  let last = 0;
  for (const m of source.matchAll(JS)) {
    if (m.index > last) out.push(["", source.slice(last, m.index)]);
    const s = m[0];
    last = m.index + s.length;
    const kind =
      s[0] === "/"
        ? "comment"
        : /["'`]/.test(s[0])
          ? "string"
          : /\d/.test(s[0])
            ? "number"
            : "keyword";
    out.push([kind, s]);
  }
  if (last < source.length) out.push(["", source.slice(last)]);
}

const ESCAPES: Record<string, string> = { "&": "&amp;", "<": "&lt;", ">": "&gt;" };

/**
 * The source as markup: one `hv-l` block per line, each run in a `hv-<kind>` span. Lines
 * are elements rather than newlines so the stylesheet can number them and wrap long ones
 * under their own number; a run that spans lines is closed and reopened at each break.
 */
export function highlight(source: string): string {
  let html = '<span class="hv-l">';
  for (const [kind, text] of tokenize(source.replace(/\r\n?/g, "\n"))) {
    text.split("\n").forEach((part, i) => {
      if (i) html += '</span><span class="hv-l">';
      if (!part) return;
      const escaped = part.replace(/[&<>]/g, (c) => ESCAPES[c]);
      html += kind ? `<span class="hv-${kind}">${escaped}</span>` : escaped;
    });
  }
  return html + "</span>";
}
