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

const ukUA: TStrings = {
  "contextMenu.label": "Отримати QR-код",
  "infoPanel.tabName": "QR-код",
  "modal.header": "QR-код спільного посилання",
  "hint.header": "QR-код відкриває спільне посилання",
  "hint.body":
    "Наведіть камеру телефона на код, щоб відкрити цей елемент. На вкладці «{tab}» можна налаштувати, хто може відкрити посилання, права доступу, термін дії та пароль.",
  "hint.emptyBody":
    "Цей елемент ще не має спільного посилання. Створіть його на вкладці «{tab}», де також можна вибрати, хто може його відкрити, права, термін дії та пароль.",
  "hint.shareTab": "Надати спільний доступ",
  "hint.membersTab": "Контакти",
  "error.header": "Не вдалося завантажити посилання",
  "error.body":
    "Сервер не відповів або повернув помилку. Зазвичай це короткочасний збій з’єднання, тому «Спробуйте ще раз» повторно запитає посилання. Якщо помилка не зникає, посилання також доступне на вкладці «{tab}».",
  "modal.retry": "Спробуйте ще раз",
  "modal.unsupportedRoom":
    "Цей тип кімнати не має публічного посилання на рівні кімнати. Воно є лише в публічних кімнатах, налаштовуваних кімнатах і просторах заповнення форм.",
  "modal.copy": "Копіювати посилання",
  "modal.copied": "Посилання скопійовано до буфера обміну",
  "modal.copyFailed": "Не вдалося скопіювати посилання",
  "modal.close": "Закрити",
  "link.create": "Створити посилання",
  "link.createFailed": "Не вдалося створити посилання. Спробуйте пізніше.",
  "link.anyone": "Усі, хто має посилання",
  "link.internal": "Тільки для користувачів робочого простору",
  "link.password": "Захищено паролем",
  "link.noTimeLimit": "Це посилання не має часового обмеження",
  "link.validUntil": "Це посилання діє до {date}",
  "link.expired": "Термін дії посилання закінчився",
  "access.read": "Лише читання",
  "access.edit": "Редагування",
  "access.review": "Огляд",
  "access.comment": "Коментар",
  "access.fillForms": "Заповнення",
  "access.customFilter": "Настроюваний фільтр",
};

export default ukUA;
