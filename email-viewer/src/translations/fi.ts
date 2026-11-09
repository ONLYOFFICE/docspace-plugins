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
  "file.typeName": "Sähköpostiviesti",
  "header.from": "Lähettäjä",
  "header.to": "Vastaanottaja",
  "header.cc": "Kopio",
  "header.bcc": "Piilokopio",
  "header.date": "Päivämäärä",
  "subject.empty": "(ei aihetta)",
  "body.empty": "Tässä viestissä ei ole tekstiä.",
  "body.title": "Viestin sisältö",
  "attachments.title": "Liitteet ({count})",
  "attachments.save": "Tallenna tähän kansioon",
  "attachments.saveAll": "Tallenna kaikki",
  "images.blocked": "Etäkuvat on estetty yksityisyytesi suojaamiseksi.",
  "images.load": "Lataa kuvat",
  "images.hide": "Piilota kuvat",
  "toast.saved": "{name} tallennettiin nykyiseen kansioon",
  "toast.savedAll": "Nykyiseen kansioon tallennetut liitteet: {count}",
  "toast.saveFailed": "Tiedostoa {name} ei voitu tallentaa",
  "toast.saveFailedSome": "Tallentamatta jääneet liitteet: {failed}/{total}",
  "state.loading": "Ladataan viestiä…",
  "state.empty": "Tämä tiedosto on tyhjä.",
  "state.loadFailed": "Tiedostoa ei voitu ladata.",
  "state.parseFailed":
    "Tätä viestiä ei voitu lukea. Tiedosto voi olla vioittunut, tai se ei ole sähköpostiviesti.",
  "state.noFile": "Tiedostoa ei ole valittu.",
};

export default fi;
