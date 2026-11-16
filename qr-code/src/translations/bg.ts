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

const bg: TStrings = {
  "contextMenu.label": "Получи QR код",
  "infoPanel.tabName": "QR код",
  "modal.header": "QR код за споделения линк",
  "hint.header": "QR кодът отваря споделения линк",
  "hint.body":
    "Насочете камерата на телефона към кода, за да отворите този елемент. В раздела „{tab}“ задавате кой може да отваря линка, както и правата за достъп, срока на валидност и паролата.",
  "hint.emptyBody":
    "Този елемент все още няма споделен линк. Създайте го в раздела „{tab}“, където задавате и кой може да го отваря, правата, срока на валидност и паролата.",
  "hint.shareTab": "Сподели",
  "hint.membersTab": "Контакти",
  "error.header": "Линкът не можа да се зареди",
  "error.body":
    "Сървърът не отговори или върна грешка. Обикновено това е кратък проблем с връзката, затова „Опитайте отново“ ще поиска линка още веднъж. Ако грешката продължава, линкът е достъпен и в раздела „{tab}“.",
  "modal.retry": "Опитайте отново",
  "modal.unsupportedRoom":
    "Този тип стая няма публичен линк на ниво стая. Такъв имат само публичните стаи, персонализираните стаи и пространствата за попълване на формуляри.",
  "modal.copy": "Копиране на линка",
  "modal.copied": "Линкът е копиран в системния буфер",
  "modal.copyFailed": "Линкът не можа да се копира",
  "modal.close": "Затвори",
  "link.create": "Създай линк",
  "link.createFailed": "Линкът не можа да се създаде. Опитайте отново по-късно.",
  "link.anyone": "Всеки с линка",
  "link.internal": "Само за потребители на работното пространство",
  "link.password": "Защитен с парола",
  "link.noTimeLimit": "Този линк няма времеви лимит",
  "link.validUntil": "Този линк е валиден до {date}",
  "link.expired": "Линкът е изтекъл",
  "access.read": "Само за четене",
  "access.edit": "Редактиране",
  "access.review": "Преглед",
  "access.comment": "Коментирай",
  "access.fillForms": "Попълване",
  "access.customFilter": "Персонализиран филтър",
};

export default bg;
