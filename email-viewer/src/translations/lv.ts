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
  "file.typeName": "E-pasta ziņojums",
  "header.from": "No",
  "header.to": "Kam",
  "header.cc": "Kopija",
  "header.bcc": "Diskrētā kopija",
  "header.date": "Datums",
  "subject.empty": "(bez temata)",
  "body.empty": "Šajā ziņojumā nav teksta.",
  "body.title": "Ziņojuma pamatteksts",
  "attachments.title": "Pielikumi ({count})",
  "attachments.save": "Saglabāt šajā mapē",
  "attachments.saveAll": "Saglabāt visus",
  "images.blocked": "Attālie attēli ir bloķēti, lai aizsargātu jūsu privātumu.",
  "images.load": "Ielādēt attēlus",
  "images.hide": "Paslēpt attēlus",
  "toast.saved": "Fails {name} saglabāts pašreizējā mapē",
  "toast.savedAll": "Pašreizējā mapē saglabātie pielikumi: {count}",
  "toast.saveFailed": "Neizdevās saglabāt {name}",
  "toast.saveFailedSome": "Neizdevās saglabāt pielikumus: {failed} no {total}",
  "state.loading": "Ielādē ziņojumu…",
  "state.empty": "Šis fails ir tukšs.",
  "state.loadFailed": "Neizdevās ielādēt failu.",
  "state.parseFailed":
    "Neizdevās nolasīt šo ziņojumu. Fails var būt bojāts vai nav e-pasta ziņojums.",
  "state.noFile": "Nav atlasīts neviens fails.",
};

export default lv;
