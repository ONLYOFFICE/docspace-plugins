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

const sqAL: TStrings = {
  "file.typeName": "Mesazh email-i",
  "header.from": "Nga",
  "header.to": "Për",
  "header.cc": "Cc",
  "header.bcc": "Bcc",
  "header.date": "Data",
  "subject.empty": "(pa subjekt)",
  "body.empty": "Ky mesazh nuk ka tekst.",
  "body.title": "Teksti i mesazhit",
  "attachments.title": "Bashkëngjitjet ({count})",
  "attachments.save": "Ruaje në këtë dosje",
  "attachments.saveAll": "Ruaji të gjitha",
  "images.blocked": "Imazhet në distancë janë bllokuar për të mbrojtur privatësinë tuaj.",
  "images.load": "Ngarko imazhet",
  "images.hide": "Fshih imazhet",
  "toast.saved": "{name} u ruajt në dosjen aktuale",
  "toast.savedAll": "Bashkëngjitje të ruajtura në dosjen aktuale: {count}",
  "toast.saveFailed": "{name} nuk mund të ruhej",
  "toast.saveFailedSome": "Bashkëngjitje që nuk mund të ruheshin: {failed} nga {total}",
  "state.loading": "Mesazhi po ngarkohet…",
  "state.empty": "Ky skedar është bosh.",
  "state.loadFailed": "Skedari nuk mund të ngarkohej.",
  "state.parseFailed":
    "Ky mesazh nuk mund të lexohej. Skedari mund të jetë i dëmtuar ose nuk është email.",
  "state.noFile": "Nuk është zgjedhur asnjë skedar.",
};

export default sqAL;
