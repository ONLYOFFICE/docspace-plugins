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

const nl: TStrings = {
  "contextMenu.label": "QR-code ophalen",
  "infoPanel.tabName": "QR-code",
  "modal.header": "QR-code voor de gedeelde link",
  "hint.header": "De QR-code opent de gedeelde link",
  "hint.body":
    "Richt de camera van een telefoon op de code om dit item te openen. Wie de link kan openen, de toegangsrechten, de vervaldatum en het wachtwoord stelt u in op het tabblad “{tab}”.",
  "hint.emptyBody":
    "Dit item heeft nog geen gedeelde link. Maak deze aan op het tabblad “{tab}”, waar u ook instelt wie de link kan openen, de rechten, de vervaldatum en het wachtwoord.",
  "hint.shareTab": "Delen",
  "hint.membersTab": "Contacten",
  "error.header": "Kan de link niet laden",
  "error.body":
    "De server reageerde niet of gaf een fout terug. Meestal is dit een kortstondig verbindingsprobleem, dus met “Probeer het opnieuw” wordt de link nogmaals opgevraagd. Blijft het misgaan, dan staat de link ook op het tabblad “{tab}”.",
  "modal.retry": "Probeer het opnieuw",
  "modal.unsupportedRoom":
    "Dit type kamer heeft geen openbare link op kamerniveau. Alleen een openbare kamer, een aangepaste kamer en een ruimte voor het invullen van formulieren hebben die.",
  "modal.copy": "Kopieer link",
  "modal.copied": "Link gekopieerd naar klembord",
  "modal.copyFailed": "Kan de link niet kopiëren",
  "modal.close": "Sluiten",
  "link.create": "Link aanmaken",
  "link.createFailed": "Kan de link niet aanmaken. Probeer het later opnieuw.",
  "link.anyone": "Iedereen met de link",
  "link.internal": "Alleen voor gebruikers van de werkruimte",
  "link.password": "Beveiligd met wachtwoord",
  "link.noTimeLimit": "Deze link heeft geen tijdslimiet",
  "link.validUntil": "Deze link is geldig tot {date}",
  "link.expired": "De link is verlopen",
  "access.read": "Alleen lezen",
  "access.edit": "Bewerken",
  "access.review": "Beoordeel",
  "access.comment": "Opmerking",
  "access.fillForms": "Invullen",
  "access.customFilter": "Aangepaste filter",
};

export default nl;
