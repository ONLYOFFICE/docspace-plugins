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
  "contextMenu.label": "Obținere cod QR",
  "infoPanel.tabName": "Cod QR",
  "modal.header": "Cod QR pentru link-ul partajat",
  "hint.header": "Codul QR deschide link-ul partajat",
  "hint.body":
    "Îndreptați camera telefonului spre cod pentru a deschide acest element. În fila „{tab}” setați cine poate deschide link-ul, precum și drepturile de acces, valabilitatea și parola.",
  "hint.emptyBody":
    "Acest element nu are încă un link partajat. Creați-l în fila „{tab}”, unde alegeți și cine îl poate deschide, drepturile, valabilitatea și parola.",
  "hint.shareTab": "Partajează",
  "hint.membersTab": "Contacte",
  "error.header": "Link-ul nu a putut fi încărcat",
  "error.body":
    "Serverul nu a răspuns sau a returnat o eroare. De obicei este o problemă de conexiune de scurtă durată, așa că „Încercaţi din nou” solicită link-ul încă o dată. Dacă eroarea persistă, link-ul se găsește și în fila „{tab}”.",
  "modal.retry": "Încercaţi din nou",
  "modal.unsupportedRoom":
    "Acest tip de sală nu are un link public la nivel de sală. Doar sălile publice, sălile particularizate și spațiile de completare formulare au unul.",
  "modal.copy": "Copiere link",
  "modal.copied": "Link-ul a fost copiat în clipboard",
  "modal.copyFailed": "Link-ul nu a putut fi copiat",
  "modal.close": "Închidere",
  "link.create": "Creare link",
  "link.createFailed": "Link-ul nu a putut fi creat. Încercați din nou mai târziu.",
  "link.anyone": "Oricine are link-ul",
  "link.internal": "Doar utilizatorii spațiului de lucru",
  "link.password": "Protejat prin parolă",
  "link.noTimeLimit": "Acest link nu are limită de timp",
  "link.validUntil": "Acest link este valabil până la {date}",
  "link.expired": "Link-ul a expirat",
  "access.read": "Doar în citire",
  "access.edit": "Editare",
  "access.review": "Revizuire",
  "access.comment": "Comentariu",
  "access.fillForms": "Completare",
  "access.customFilter": "Filtru particularizat",
};

export default ro;
