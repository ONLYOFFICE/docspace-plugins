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

const srCyrlRS: TStrings = {
  "contextMenu.label": "Прикажи QR код",
  "infoPanel.tabName": "QR код",
  "modal.header": "QR код дељеног линка",
  "hint.header": "QR код отвара дељени линк",
  "hint.body":
    "Усмерите камеру телефона ка коду да бисте отворили ову ставку. На картици „{tab}“ подешавате ко може да отвори линк, права приступа, рок важења и лозинку.",
  "hint.emptyBody":
    "Ова ставка још нема дељени линк. Креирајте га на картици „{tab}“, где бирате и ко може да га отвори, права, рок важења и лозинку.",
  "hint.shareTab": "Дели",
  "hint.membersTab": "Контакти",
  "error.header": "Није могуће учитати линк",
  "error.body":
    "Сервер није одговорио или је вратио грешку. Обично је то кратак прекид везе, па ће „Покушајте поново“ још једном затражити линк. Ако грешка и даље траје, линк можете пронаћи и на картици „{tab}“.",
  "modal.retry": "Покушајте поново",
  "modal.unsupportedRoom":
    "Овај тип собе нема јавни линк на нивоу собе. Имају га само јавне собе, прилагођене собе и простори за попуњавање образаца.",
  "modal.copy": "Копирај линк",
  "modal.copied": "Линк је копиран у цлипбоард",
  "modal.copyFailed": "Није могуће копирати линк",
  "modal.close": "Затвори",
  "link.create": "Креирај линк",
  "link.createFailed": "Није могуће креирати линк. Покушајте поново касније.",
  "link.anyone": "Свако ко има линк",
  "link.internal": "Само радног простора корисници",
  "link.password": "Заштићен лозинком",
  "link.noTimeLimit": "Овај линк нема временско ограничење",
  "link.validUntil": "Овај линк важи до {date}",
  "link.expired": "Линк је истекао",
  "access.read": "Само за читање",
  "access.edit": "Уређивање",
  "access.review": "Преглед",
  "access.comment": "Коментар",
  "access.fillForms": "Попуњавање",
  "access.customFilter": "Прилагођени филтер",
};

export default srCyrlRS;
