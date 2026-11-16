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
  "contextMenu.label": "Získat QR kód",
  "infoPanel.tabName": "QR kód",
  "modal.header": "QR kód sdíleného odkazu",
  "hint.header": "QR kód otevře sdílený odkaz",
  "hint.body":
    "Namiřte fotoaparát telefonu na kód a otevřete tuto položku. Kdo může odkaz otevřít, přístupová práva, platnost a heslo nastavíte na záložce „{tab}“.",
  "hint.emptyBody":
    "Tato položka zatím nemá sdílený odkaz. Vytvořte ho na záložce „{tab}“, kde také zvolíte, kdo ho může otevřít, jeho práva, platnost a heslo.",
  "hint.shareTab": "Sdílet",
  "hint.membersTab": "Kontakty",
  "error.header": "Odkaz se nepodařilo načíst",
  "error.body":
    "Server neodpověděl nebo vrátil chybu. Obvykle jde o krátkodobý problém s připojením, takže „Zkus to znovu“ odkaz vyžádá ještě jednou. Pokud chyba přetrvává, odkaz najdete také na záložce „{tab}“.",
  "modal.retry": "Zkus to znovu",
  "modal.unsupportedRoom":
    "Tento typ místnosti nemá veřejný odkaz na úrovni místnosti. Mají ho pouze veřejná místnost, vlastní místnost a prostor pro vyplňování formulářů.",
  "modal.copy": "Kopírovat odkaz",
  "modal.copied": "Odkaz zkopírován do schránky",
  "modal.copyFailed": "Odkaz se nepodařilo zkopírovat",
  "modal.close": "Zavřít",
  "link.create": "Vytvořit odkaz",
  "link.createFailed": "Odkaz se nepodařilo vytvořit. Zkuste to později.",
  "link.anyone": "Kdokoli s odkazem",
  "link.internal": "Pouze uživatelé pracovního prostoru",
  "link.password": "Chráněný heslem",
  "link.noTimeLimit": "Tento odkaz nemá časové omezení",
  "link.validUntil": "Tento odkaz je platný do {date}",
  "link.expired": "Platnost odkazu vypršela",
  "access.read": "Pouze pro čtení",
  "access.edit": "Úpravy",
  "access.review": "Prověřit",
  "access.comment": "Okomentovat",
  "access.fillForms": "Doplňování",
  "access.customFilter": "Vlastní filtr",
};

export default cs;
