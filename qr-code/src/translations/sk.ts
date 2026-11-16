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
  "contextMenu.label": "Získať QR kód",
  "infoPanel.tabName": "QR kód",
  "modal.header": "QR kód zdieľaného odkazu",
  "hint.header": "QR kód otvorí zdieľaný odkaz",
  "hint.body":
    "Namierte fotoaparát telefónu na kód a otvorte túto položku. Kto môže odkaz otvoriť, prístupové práva, platnosť a heslo nastavíte na karte „{tab}“.",
  "hint.emptyBody":
    "Táto položka zatiaľ nemá zdieľaný odkaz. Vytvorte ho na karte „{tab}“, kde tiež zvolíte, kto ho môže otvoriť, jeho práva, platnosť a heslo.",
  "hint.shareTab": "Zdieľať",
  "hint.membersTab": "Kontakty",
  "error.header": "Odkaz sa nepodarilo načítať",
  "error.body":
    "Server neodpovedal alebo vrátil chybu. Zvyčajne ide o krátkodobý problém s pripojením, preto „Skúste to znova“ odkaz vyžiada ešte raz. Ak chyba pretrváva, odkaz nájdete aj na karte „{tab}“.",
  "modal.retry": "Skúste to znova",
  "modal.unsupportedRoom":
    "Tento typ miestnosti nemá verejný odkaz na úrovni miestnosti. Majú ho iba verejná miestnosť, vlastná miestnosť a priestor na vypĺňanie formulárov.",
  "modal.copy": "Kopírovať odkaz",
  "modal.copied": "Odkaz bol skopírovaný do schránky",
  "modal.copyFailed": "Odkaz sa nepodarilo skopírovať",
  "modal.close": "Zatvoriť",
  "link.create": "Vytvoriť odkaz",
  "link.createFailed": "Odkaz sa nepodarilo vytvoriť. Skúste to znova neskôr.",
  "link.anyone": "Ktokoľvek s odkazom",
  "link.internal": "Len pre používateľov pracovného priestoru",
  "link.password": "Chránený heslom",
  "link.noTimeLimit": "Tento odkaz nemá časové obmedzenie",
  "link.validUntil": "Tento odkaz je platný do {date}",
  "link.expired": "Platnosť odkazu vypršala",
  "access.read": "Iba na čítanie",
  "access.edit": "Úprava",
  "access.review": "Preskúmanie",
  "access.comment": "Komentár",
  "access.fillForms": "Dopĺňanie",
  "access.customFilter": "Vlastný filter",
};

export default sk;
