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

const ro: TStrings = {
  "file.typeName": "Mesaj de e-mail",
  "header.from": "De la",
  "header.to": "Către",
  "header.cc": "Cc",
  "header.bcc": "Bcc",
  "header.date": "Dată",
  "subject.empty": "(fără subiect)",
  "body.empty": "Acest mesaj nu conține text.",
  "body.title": "Corpul mesajului",
  "attachments.title": "Atașamente ({count})",
  "attachments.save": "Salvați în acest folder",
  "attachments.saveAll": "Salvați toate",
  "images.blocked": "Imaginile externe sunt blocate pentru a vă proteja confidențialitatea.",
  "images.load": "Încărcați imaginile",
  "images.hide": "Ascundeți imaginile",
  "toast.saved": "Fișierul {name} a fost salvat în folderul curent",
  "toast.savedAll": "Atașamente salvate în folderul curent: {count}",
  "toast.saveFailed": "Nu s-a putut salva {name}",
  "toast.saveFailedSome": "Nu s-au putut salva atașamente: {failed} din {total}",
  "state.loading": "Se încarcă mesajul…",
  "state.empty": "Acest fișier este gol.",
  "state.loadFailed": "Nu s-a putut încărca fișierul.",
  "state.parseFailed":
    "Nu s-a putut citi acest mesaj. Fișierul poate fi deteriorat sau nu este un e-mail.",
  "state.noFile": "Niciun fișier selectat.",
};

export default ro;
