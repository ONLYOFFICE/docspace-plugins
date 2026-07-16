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

import { EditorState, Extension } from "@codemirror/state";
import { defaultKeymap, history, historyKeymap, indentWithTab } from "@codemirror/commands";
import { highlightSelectionMatches, searchKeymap } from "@codemirror/search";
import {
  EditorView,
  crosshairCursor,
  drawSelection,
  dropCursor,
  highlightActiveLine,
  highlightActiveLineGutter,
  highlightTrailingWhitespace,
  highlightWhitespace,
  keymap,
  lineNumbers,
  rectangularSelection,
} from "@codemirror/view";
import {
  bracketMatching,
  defaultHighlightStyle,
  foldGutter,
  foldKeymap,
  indentOnInput,
  syntaxHighlighting,
  HighlightStyle,
} from "@codemirror/language";
import { tags } from "@lezer/highlight";
import { closeBrackets, autocompletion, closeBracketsKeymap, completionKeymap } from "@codemirror/autocomplete";
import { javascript } from "@codemirror/lang-javascript";
import { css } from "@codemirror/lang-css";
import { sass } from "@codemirror/lang-sass";
import { cpp } from "@codemirror/lang-cpp";
import { go } from "@codemirror/lang-go";
import { html } from "@codemirror/lang-html";
import { java } from "@codemirror/lang-java";
import { python } from "@codemirror/lang-python";
import { json } from "@codemirror/lang-json";
import { liquid } from "@codemirror/lang-liquid";
import { php } from "@codemirror/lang-php";
import { rust } from "@codemirror/lang-rust";
import { yaml } from "@codemirror/lang-yaml";
import { wast } from "@codemirror/lang-wast";
import { sql, StandardSQL, PostgreSQL, MySQL, MariaSQL, MSSQL, SQLite, Cassandra, PLSQL } from "@codemirror/lang-sql";
import { oneDark } from "@codemirror/theme-one-dark";

export const colors = {
  base: "#fff",
  secondary: "#f8f9f9",
  altSecondary: "#dfe2e3",
  contrast: "#a3a9ae",
  border: "#d0d5da",
  hoverBorder: "#4781d1",
  active_line: "#e4e4e444",
  dark: "#333333",
  dark_secondary: "#3d3d3d",
  dark_altSecondary: "#474747",
  dark_contrast: "#858585",
  dark_border: "#474747",
  dark_hoverBorder: "#a3a3a3",
  dark_active_line: "#5a5a5a44",
};

export const docSpaceTheme = (theme: string) => {
  if (theme === "System") {
    theme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "Dark" : "Base";
  }
  const light = theme === "Base";

  const customTheme = EditorView.theme(
    {
      "&": {
        color: light ? "black" : "white",
      },
      "&.cm-editor": {
        height: "100%",
      },
      ".cm-panels": {
        backgroundColor: light ? colors.base : colors.dark,
      },
      ".cm-scroller": {
        scrollbarColor: `${light ? colors.contrast : colors.dark_contrast} ${light ? colors.base : colors.dark}`,
        backgroundColor: light ? colors.base : colors.dark,
      },
      ".cm-panels.cm-panels-bottom": {
        borderTop: `1px solid ${light ? colors.border : colors.dark_border}`,
        color: light ? "black" : "white",
      },
      ".cm-button": {
        padding: "1vh 2vw",
        fontSize: "80%",
        fontFamily: "Open Sans, sans-serif",
        backgroundColor: light ? colors.base : colors.dark,
        backgroundImage: "none",
        border: `1px solid ${light ? colors.border : colors.dark_border}`,
        borderRadius: "3px",
        cursor: "pointer",
      },
      ".cm-button:hover": {
        borderColor: light ? colors.hoverBorder : colors.dark_hoverBorder,
      },
      ".cm-button:active": {
        backgroundImage: "none",
        backgroundColor: light ? colors.secondary : "#282828",
        border: `1px solid ${light ? colors.border : colors.dark_border}`,
      },
      ".cm-panel.cm-search input": {
        padding: "1vh 1vw",
        fontSize: "80%",
        fontFamily: "Open Sans, sans-serif",
        border: `1px solid ${light ? colors.border : colors.dark_border}`,
        borderRadius: "3px",
      },
      ".cm-panel.cm-search input:focus": {
        outline: `1px solid ${light ? colors.hoverBorder : colors.dark_hoverBorder}`,
      },
      ".cm-gutters": {
        border: "none",
        color: light ? "black" : "white",
        backgroundColor: light ? colors.secondary : colors.dark_secondary,
      },
      ".cm-activeLineGutter": {
        backgroundColor: light ? colors.altSecondary : colors.dark_altSecondary,
      },
      ".cm-activeLine": {
        backgroundColor: light ? colors.active_line : colors.dark_active_line,
      },
      ".cm-lineNumbers .cm-gutterElement": {
        padding: "0 3px 0 10px",
      },
      ".cm-panel.cm-search [name=close]": {
        color: light ? colors.contrast : colors.dark_contrast,
        fontWeight: "900",
        fontSize: "150%",
        right: "7px",
      },
      ".cm-panel.cm-search label": {
        display: "inline-flex",
        fontSize: "90%",
      },
      ".cm-tooltip-autocomplete ul li": {
        backgroundColor: light ? colors.secondary : colors.dark_secondary,
        color: light ? "black" : colors.dark_contrast,
      },
      ".cm-tooltip-autocomplete ul li[aria-selected]": {
        backgroundColor: light ? colors.hoverBorder : colors.dark_altSecondary,
        color: "white",
      },
      ".cm-panel.cm-search input[type=checkbox]": {
        accentColor: light ? colors.hoverBorder : "#646464",
      },
    },
    { dark: !light }
  );

  const customHighlight = HighlightStyle.define([
    { tag: [tags.definition(tags.name), tags.separator], color: light ? "black" : "white" },
  ]);

  return [customTheme, ...(light ? [] : [syntaxHighlighting(customHighlight), oneDark])];
};

function langExtensions(fileExt: string, settings: any) {
  switch (fileExt) {
    case "js":
    case "jsx":
    case "ts":
    case "tsx":
      const js = javascript({
        typescript: fileExt.includes("ts"),
        jsx: fileExt.includes("x"),
      });
      // @ts-ignore
      if (js.extension[1].length == 3 && !settings.autoCloseTags) {
        // @ts-ignore
        js.extension[1] = js.extension[1].slice(0, -1);
      }

      return [js];
    case "css":
      return [css()];
    case "sass":
      return [sass({ indented: true })];
    case "scss":
      return [sass({ indented: false })];
    case "cpp":
    case "cc":
    case "h":
    case "hpp":
      return [cpp()];
    case "go":
      return [go()];
    case "html":
    case "htm":
      return [
        html({
          matchClosingTags: true,
          selfClosingTags: true,
          autoCloseTags: settings.autoCloseTags,
        }),
      ];
    case "java":
    case "class":
      return [java()];
    case "py":
      return [python()];
    case "json":
      return [json()];
    case "liquid":
      return [liquid()];
    case "php":
      return [php()];
    case "rs":
      return [rust()];
    case "yaml":
    case "yml":
      return [yaml()];
    case "wast":
    case "wat":
      return [wast()];
    case "sql":
      return [sql({ dialect: StandardSQL })];
    case "mysql":
      return [sql({ dialect: MySQL })];
    case "pgsql":
    case "postgresql":
      return [sql({ dialect: PostgreSQL })];
    case "sqlite":
    case "db":
      return [sql({ dialect: SQLite })];
    case "mssql":
      return [sql({ dialect: MSSQL })];
    case "cql":
      return [sql({ dialect: Cassandra })];
    case "plsql":
      return [sql({ dialect: PLSQL })];
    case "mariadb":
      return [sql({ dialect: MariaSQL })];
    default:
      return [];
  }
}

function coreExtensions(settings: any) {
  const coreExtensions: Extension[] = [
    history(),
    lineNumbers(),
    highlightActiveLineGutter(),
    highlightActiveLine(),
    highlightSelectionMatches(),
    rectangularSelection(),
    drawSelection(),
    bracketMatching(),
    foldGutter(),
    dropCursor(),
    crosshairCursor(),
    closeBrackets(),
    indentOnInput(),
    autocompletion(),
    syntaxHighlighting(defaultHighlightStyle, { fallback: true }),
    EditorState.allowMultipleSelections.of(true),

    // EditorState.tabSize.of(), // TODO: handle tab size
    // EditorState.lineSeparator.of(), // TODO: handle line separator

    keymap.of([
      ...defaultKeymap,
      ...closeBracketsKeymap,
      ...searchKeymap,
      ...historyKeymap,
      ...foldKeymap,
      ...completionKeymap,
      indentWithTab, // TODO: tab = what? now "  ", not "\t"
    ]),
  ];

  if (settings.highlightWhitespace) coreExtensions.push(highlightWhitespace());
  if (settings.highlightTrailingWhitespace) coreExtensions.push(highlightTrailingWhitespace());

  return coreExtensions;
}

export function getExtensions(fileExt: string, settings: any) {
  return [...coreExtensions(settings), ...langExtensions(fileExt, settings)];
}
