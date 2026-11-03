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

const lv: TStrings = {
  "contextMenu.label": "Iegūt QR kodu",
  "infoPanel.tabName": "QR kods",
  "modal.header": "Koplietotās saites QR kods",
  "hint.header": "QR kods atver koplietoto saiti",
  "hint.body":
    "Pavērsiet tālruņa kameru pret kodu, lai atvērtu šo vienumu. Cilnē „{tab}” varat iestatīt, kas drīkst atvērt saiti, kā arī piekļuves tiesības, derīguma termiņu un paroli.",
  "hint.emptyBody":
    "Šim vienumam vēl nav koplietotas saites. Izveidojiet to cilnē „{tab}”, kur varat arī norādīt, kas drīkst to atvērt, kā arī iestatīt tiesības, derīguma termiņu un paroli.",
  "hint.shareTab": "Kopīgot",
  "hint.membersTab": "Kontakti",
  "error.header": "Neizdevās ielādēt saiti",
  "error.body":
    "Serveris neatbildēja vai atgrieza kļūdu. Parasti tā ir īslaicīga savienojuma problēma, tāpēc „Mēģiniet vēlreiz” pieprasīs saiti atkārtoti. Ja kļūda neizzūd, saite ir pieejama arī cilnē „{tab}”.",
  "modal.retry": "Mēģiniet vēlreiz",
  "modal.unsupportedRoom":
    "Šim telpas veidam nav publiskas saites telpas līmenī. Tāda ir tikai publiskajām telpām, pielāgotajām telpām un veidlapu aizpildīšanas telpām.",
  "modal.copy": "Kopēt saiti",
  "modal.copied": "Saite ir kopēta starpliktuvē",
  "modal.copyFailed": "Neizdevās kopēt saiti",
  "modal.close": "Aizvērt",
  "link.create": "Izveidot saiti",
  "link.createFailed": "Neizdevās izveidot saiti. Mēģiniet vēlāk vēlreiz.",
  "link.anyone": "Ikviens, kam ir saite",
  "link.internal": "Tikai darbvietas lietotājiem",
  "link.password": "Aizsargāta ar paroli",
  "link.noTimeLimit": "Šai saitei nav laika ierobežojuma",
  "link.validUntil": "Šī saite ir derīga līdz {date}",
  "link.expired": "Saitei ir beidzies derīguma termiņš",
  "access.read": "Tikai lasīšana",
  "access.edit": "Rediģēšana",
  "access.review": "Pārskatīt",
  "access.comment": "Komentārs",
  "access.fillForms": "Aizpildīšana",
  "access.customFilter": "Pielāgots filtrs",
};

export default lv;
