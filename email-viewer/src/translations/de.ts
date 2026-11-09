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

import type { TStrings } from "../locales";

const de: TStrings = {
  "file.typeName": "E-Mail-Nachricht",
  "header.from": "Von",
  "header.to": "An",
  "header.cc": "Cc",
  "header.bcc": "Bcc",
  "header.date": "Datum",
  "subject.empty": "(kein Betreff)",
  "body.empty": "Diese Nachricht enthält keinen Text.",
  "body.title": "Nachrichtentext",
  "attachments.title": "Anhänge ({count})",
  "attachments.save": "In diesem Ordner speichern",
  "attachments.saveAll": "Alle speichern",
  "images.blocked": "Externe Bilder werden zum Schutz Ihrer Privatsphäre blockiert.",
  "images.load": "Bilder laden",
  "images.hide": "Bilder ausblenden",
  "toast.saved": "{name} wurde im aktuellen Ordner gespeichert",
  "toast.savedAll": "Im aktuellen Ordner gespeicherte Anhänge: {count}",
  "toast.saveFailed": "{name} konnte nicht gespeichert werden",
  "toast.saveFailedSome": "Nicht gespeicherte Anhänge: {failed} von {total}",
  "state.loading": "Nachricht wird geladen…",
  "state.empty": "Diese Datei ist leer.",
  "state.loadFailed": "Die Datei konnte nicht geladen werden.",
  "state.parseFailed":
    "Diese Nachricht konnte nicht gelesen werden. Die Datei ist möglicherweise beschädigt oder keine E-Mail.",
  "state.noFile": "Keine Datei ausgewählt.",
};

export default de;
