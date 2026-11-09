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

const cs: TStrings = {
  "file.typeName": "E-mailová zpráva",
  "header.from": "Od",
  "header.to": "Komu",
  "header.cc": "Kopie",
  "header.bcc": "Skrytá kopie",
  "header.date": "Datum",
  "subject.empty": "(bez předmětu)",
  "body.empty": "Tato zpráva neobsahuje žádný text.",
  "body.title": "Text zprávy",
  "attachments.title": "Přílohy ({count})",
  "attachments.save": "Uložit do této složky",
  "attachments.saveAll": "Uložit vše",
  "images.blocked": "Vzdálené obrázky jsou z důvodu ochrany soukromí blokovány.",
  "images.load": "Načíst obrázky",
  "images.hide": "Skrýt obrázky",
  "toast.saved": "Soubor {name} byl uložen do aktuální složky",
  "toast.savedAll": "Přílohy uložené do aktuální složky: {count}",
  "toast.saveFailed": "Soubor {name} se nepodařilo uložit",
  "toast.saveFailedSome": "Neuložené přílohy: {failed} z {total}",
  "state.loading": "Načítání zprávy…",
  "state.empty": "Tento soubor je prázdný.",
  "state.loadFailed": "Soubor se nepodařilo načíst.",
  "state.parseFailed":
    "Tuto zprávu se nepodařilo přečíst. Soubor může být poškozený nebo nejde o e-mail.",
  "state.noFile": "Není vybrán žádný soubor.",
};

export default cs;
