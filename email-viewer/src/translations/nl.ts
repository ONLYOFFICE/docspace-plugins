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

const nl: TStrings = {
  "file.typeName": "E-mailbericht",
  "header.from": "Van",
  "header.to": "Aan",
  "header.cc": "CC",
  "header.bcc": "BCC",
  "header.date": "Datum",
  "subject.empty": "(geen onderwerp)",
  "body.empty": "Dit bericht bevat geen tekst.",
  "body.title": "Berichttekst",
  "attachments.title": "Bijlagen ({count})",
  "attachments.save": "Opslaan in deze map",
  "attachments.saveAll": "Alles opslaan",
  "images.blocked": "Externe afbeeldingen worden geblokkeerd om uw privacy te beschermen.",
  "images.load": "Afbeeldingen laden",
  "images.hide": "Afbeeldingen verbergen",
  "toast.saved": "{name} is opgeslagen in de huidige map",
  "toast.savedAll": "Bijlagen opgeslagen in de huidige map: {count}",
  "toast.saveFailed": "Kan {name} niet opslaan",
  "toast.saveFailedSome": "Bijlagen die niet konden worden opgeslagen: {failed} van {total}",
  "state.loading": "Bericht laden…",
  "state.empty": "Dit bestand is leeg.",
  "state.loadFailed": "Kan het bestand niet laden.",
  "state.parseFailed":
    "Kan dit bericht niet lezen. Het bestand is mogelijk beschadigd of is geen e-mail.",
  "state.noFile": "Er is geen bestand geselecteerd.",
};

export default nl;
