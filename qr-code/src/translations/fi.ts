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

const fi: TStrings = {
  "contextMenu.label": "Näytä QR-koodi",
  "infoPanel.tabName": "QR-koodi",
  "modal.header": "Jaetun linkin QR-koodi",
  "hint.header": "QR-koodi avaa jaetun linkin",
  "hint.body":
    "Osoita puhelimen kameralla koodia avataksesi tämän kohteen. {tab}-välilehdellä voit määrittää, kuka linkin voi avata, sekä käyttöoikeudet, voimassaolon ja salasanan.",
  "hint.emptyBody":
    "Tällä kohteella ei ole vielä jaettua linkkiä. Luo se {tab}-välilehdellä, jossa voit myös määrittää, kuka sen voi avata, sekä käyttöoikeudet, voimassaolon ja salasanan.",
  "hint.shareTab": "Jaa",
  "hint.membersTab": "Yhteystiedot",
  "error.header": "Linkin lataaminen epäonnistui",
  "error.body":
    "Palvelin ei vastannut tai palautti virheen. Yleensä kyse on lyhyestä yhteyskatkoksesta, joten Yritä uudelleen -painike hakee linkin vielä kerran. Jos virhe toistuu, linkki löytyy myös {tab}-välilehdeltä.",
  "modal.retry": "Yritä uudelleen",
  "modal.unsupportedRoom":
    "Tällä huonetyypillä ei ole huonetason julkista linkkiä. Sellainen on vain julkisissa huoneissa, mukautetuissa huoneissa ja lomakkeiden täyttötiloissa.",
  "modal.copy": "Kopioi linkki",
  "modal.copied": "Linkki kopioitu leikepöydälle",
  "modal.copyFailed": "Linkin kopioiminen epäonnistui",
  "modal.close": "Sulje",
  "link.create": "Luo linkki",
  "link.createFailed": "Linkin luominen epäonnistui. Yritä myöhemmin uudelleen.",
  "link.anyone": "Kuka tahansa, jolla on linkki",
  "link.internal": "Vain työtilan käyttäjille",
  "link.password": "Suojattu salasanalla",
  "link.noTimeLimit": "Tällä linkillä ei ole aikarajaa",
  "link.validUntil": "Tämä linkki on voimassa {date} asti",
  "link.expired": "Linkki on vanhentunut",
  "access.read": "Vain luku",
  "access.edit": "Muokkaus",
  "access.review": "Tarkastelu",
  "access.comment": "Kommentoi",
  "access.fillForms": "Täyttäminen",
  "access.customFilter": "Mukautettu suodatin",
};

export default fi;
