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
  "contextMenu.label": "Pridobi kodo QR",
  "infoPanel.tabName": "Koda QR",
  "modal.header": "Koda QR za povezavo v skupni rabi",
  "hint.header": "Koda QR odpre povezavo v skupni rabi",
  "hint.body":
    "Usmerite kamero telefona v kodo, da odprete ta element. Na zavihku »{tab}« nastavite, kdo lahko odpre povezavo, ter pravice dostopa, veljavnost in geslo.",
  "hint.emptyBody":
    "Ta element še nima povezave v skupni rabi. Ustvarite jo na zavihku »{tab}«, kjer nastavite tudi, kdo jo lahko odpre, ter pravice, veljavnost in geslo.",
  "hint.shareTab": "Deli",
  "hint.membersTab": "Kontakti",
  "error.header": "Povezave ni bilo mogoče naložiti",
  "error.body":
    "Strežnik se ni odzval ali je vrnil napako. Običajno gre za kratkotrajno težavo z omrežjem, zato »Poskusite znova« povezavo zahteva še enkrat. Če napaka ne izgine, je povezava na voljo tudi na zavihku »{tab}«.",
  "modal.retry": "Poskusite znova",
  "modal.unsupportedRoom":
    "Ta vrsta sobe nima javne povezave na ravni sobe. Imajo jo le javne sobe, sobe po meri in prostori za izpolnjevanje obrazcev.",
  "modal.copy": "Kopiraj povezavo",
  "modal.copied": "Povezava je bila kopirana v odložišče",
  "modal.copyFailed": "Povezave ni bilo mogoče kopirati",
  "modal.close": "Zapri",
  "link.create": "Ustvari povezavo",
  "link.createFailed": "Povezave ni bilo mogoče ustvariti. Poskusite znova pozneje.",
  "link.anyone": "Vsak s povezavo",
  "link.internal": "Samo delovnega prostora uporabniki",
  "link.password": "Zaščitena z geslom",
  "link.noTimeLimit": "Ta povezava nima časovne omejitve",
  "link.validUntil": "Ta povezava velja do {date}",
  "link.expired": "Povezava je potekla",
  "access.read": "Samo za branje",
  "access.edit": "Urejanje",
  "access.review": "Preglej",
  "access.comment": "Komentar",
  "access.fillForms": "Izpolnjevanje",
  "access.customFilter": "Filter po meri",
};

export default sl;
