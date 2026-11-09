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

const sl: TStrings = {
  "file.typeName": "E-poštno sporočilo",
  "header.from": "Od",
  "header.to": "Za",
  "header.cc": "Kp",
  "header.bcc": "Skp",
  "header.date": "Datum",
  "subject.empty": "(brez zadeve)",
  "body.empty": "To sporočilo nima besedila.",
  "body.title": "Besedilo sporočila",
  "attachments.title": "Priloge ({count})",
  "attachments.save": "Shrani v to mapo",
  "attachments.saveAll": "Shrani vse",
  "images.blocked": "Oddaljene slike so zaradi zaščite vaše zasebnosti blokirane.",
  "images.load": "Naloži slike",
  "images.hide": "Skrij slike",
  "toast.saved": "Datoteka {name} je shranjena v trenutno mapo",
  "toast.savedAll": "Priloge, shranjene v trenutno mapo: {count}",
  "toast.saveFailed": "Datoteke {name} ni bilo mogoče shraniti",
  "toast.saveFailedSome": "Prilog ni bilo mogoče shraniti: {failed} od {total}",
  "state.loading": "Nalaganje sporočila…",
  "state.empty": "Ta datoteka je prazna.",
  "state.loadFailed": "Datoteke ni bilo mogoče naložiti.",
  "state.parseFailed":
    "Tega sporočila ni bilo mogoče prebrati. Datoteka je morda poškodovana ali ni e-poštno sporočilo.",
  "state.noFile": "Nobena datoteka ni izbrana.",
};

export default sl;
