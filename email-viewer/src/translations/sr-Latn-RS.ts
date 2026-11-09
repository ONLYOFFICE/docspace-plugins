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

const srLatnRS: TStrings = {
  "file.typeName": "Imejl poruka",
  "header.from": "Od",
  "header.to": "Za",
  "header.cc": "Kopija",
  "header.bcc": "Skrivena kopija",
  "header.date": "Datum",
  "subject.empty": "(bez naslova)",
  "body.empty": "Ova poruka nema tekst.",
  "body.title": "Tekst poruke",
  "attachments.title": "Prilozi ({count})",
  "attachments.save": "Sačuvaj u ovu fasciklu",
  "attachments.saveAll": "Sačuvaj sve",
  "images.blocked": "Spoljne slike su blokirane radi zaštite vaše privatnosti.",
  "images.load": "Učitaj slike",
  "images.hide": "Sakrij slike",
  "toast.saved": "Datoteka {name} je sačuvana u trenutnu fasciklu",
  "toast.savedAll": "Prilozi sačuvani u trenutnu fasciklu: {count}",
  "toast.saveFailed": "Nije moguće sačuvati datoteku {name}",
  "toast.saveFailedSome": "Nije moguće sačuvati priloge: {failed} od {total}",
  "state.loading": "Učitavanje poruke…",
  "state.empty": "Ova datoteka je prazna.",
  "state.loadFailed": "Nije moguće učitati datoteku.",
  "state.parseFailed":
    "Nije moguće pročitati ovu poruku. Datoteka je možda oštećena ili nije imejl.",
  "state.noFile": "Nijedna datoteka nije izabrana.",
};

export default srLatnRS;
