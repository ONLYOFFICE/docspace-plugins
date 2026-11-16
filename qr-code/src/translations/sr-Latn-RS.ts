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
  "contextMenu.label": "Prikaži QR kod",
  "infoPanel.tabName": "QR kod",
  "modal.header": "QR kod deljenog linka",
  "hint.header": "QR kod otvara deljeni link",
  "hint.body":
    "Usmerite kameru telefona ka kodu da biste otvorili ovu stavku. Na kartici „{tab}“ podešavate ko može da otvori link, prava pristupa, rok važenja i lozinku.",
  "hint.emptyBody":
    "Ova stavka još nema deljeni link. Kreirajte ga na kartici „{tab}“, gde birate i ko može da ga otvori, prava, rok važenja i lozinku.",
  "hint.shareTab": "Deli",
  "hint.membersTab": "Kontakti",
  "error.header": "Nije moguće učitati link",
  "error.body":
    "Server nije odgovorio ili je vratio grešku. Obično je to kratak prekid veze, pa će „Pokušajte ponovo“ još jednom zatražiti link. Ako greška i dalje traje, link možete pronaći i na kartici „{tab}“.",
  "modal.retry": "Pokušajte ponovo",
  "modal.unsupportedRoom":
    "Ovaj tip sobe nema javni link na nivou sobe. Imaju ga samo javne sobe, prilagođene sobe i prostori za popunjavanje obrazaca.",
  "modal.copy": "Kopiraj link",
  "modal.copied": "Link je kopiran u clipboard",
  "modal.copyFailed": "Nije moguće kopirati link",
  "modal.close": "Zatvori",
  "link.create": "Kreiraj link",
  "link.createFailed": "Nije moguće kreirati link. Pokušajte ponovo kasnije.",
  "link.anyone": "Svako sa linkom",
  "link.internal": "Samo radnog prostora korisnici",
  "link.password": "Zaštićen lozinkom",
  "link.noTimeLimit": "Ovaj link nema vremensko ograničenje",
  "link.validUntil": "Ovaj link važi do {date}",
  "link.expired": "Link je istekao",
  "access.read": "Samo za čitanje",
  "access.edit": "Uređivanje",
  "access.review": "Pregled",
  "access.comment": "Komentar",
  "access.fillForms": "Popunjavanje",
  "access.customFilter": "Prilagođeni filter",
};

export default srLatnRS;
