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

const sk: TStrings = {
  "file.typeName": "E-mailová správa",
  "header.from": "Od",
  "header.to": "Komu",
  "header.cc": "Kópia",
  "header.bcc": "Skrytá kópia",
  "header.date": "Dátum",
  "subject.empty": "(bez predmetu)",
  "body.empty": "Táto správa neobsahuje text.",
  "body.title": "Telo správy",
  "attachments.title": "Prílohy ({count})",
  "attachments.save": "Uložiť do tohto priečinka",
  "attachments.saveAll": "Uložiť všetko",
  "images.blocked": "Vzdialené obrázky sú blokované na ochranu vášho súkromia.",
  "images.load": "Načítať obrázky",
  "images.hide": "Skryť obrázky",
  "toast.saved": "Súbor {name} bol uložený do aktuálneho priečinka",
  "toast.savedAll": "Prílohy uložené do aktuálneho priečinka: {count}",
  "toast.saveFailed": "Súbor {name} sa nepodarilo uložiť",
  "toast.saveFailedSome": "Nepodarilo sa uložiť prílohy: {failed} z {total}",
  "state.loading": "Načítava sa správa…",
  "state.empty": "Tento súbor je prázdny.",
  "state.loadFailed": "Súbor sa nepodarilo načítať.",
  "state.parseFailed":
    "Túto správu sa nepodarilo prečítať. Súbor môže byť poškodený alebo nejde o e-mail.",
  "state.noFile": "Nie je vybraný žiadny súbor.",
};

export default sk;
