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

const ru: TStrings = {
  "contextMenu.label": "Получить QR-код",
  "infoPanel.tabName": "QR-код",
  "modal.header": "QR-код ссылки для доступа",
  "hint.header": "QR-код открывает ссылку для доступа",
  "hint.body":
    "Наведите камеру телефона на код, чтобы открыть объект. Кому доступна ссылка, права, срок и пароль настраиваются во вкладке «{tab}».",
  "hint.emptyBody":
    "У этого объекта ещё нет ссылки для доступа. Создайте её во вкладке «{tab}» — там же настраиваются кому она доступна, права, срок и пароль.",
  "hint.shareTab": "Предоставить доступ",
  "hint.membersTab": "Контакты",
  "error.header": "Не удалось загрузить ссылку",
  "error.body":
    "Сервер не ответил или вернул ошибку. Обычно это кратковременный сбой связи, поэтому «Попробовать еще раз» запросит ссылку снова. Если ошибка не проходит, ссылку можно открыть во вкладке «{tab}».",
  "modal.retry": "Попробовать еще раз",
  "modal.unsupportedRoom":
    "У этого типа комнаты нет публичной ссылки на уровне комнаты. Она есть только у публичной комнаты, пользовательской комнаты и пространства заполнения форм.",
  "modal.copy": "Копировать ссылку",
  "modal.copied": "Ссылка скопирована в буфер обмена",
  "modal.copyFailed": "Не удалось скопировать ссылку",
  "modal.close": "Закрыть",
  "link.create": "Создать ссылку",
  "link.createFailed": "Не удалось создать ссылку. Попробуйте позже.",
  "link.anyone": "Любой, у кого есть ссылка",
  "link.internal": "Только для пользователей рабочего пространства",
  "link.password": "Защищена паролем",
  "link.noTimeLimit": "Эта ссылка действительна без ограничений",
  "link.validUntil": "Эта ссылка действительна до {date}",
  "link.expired": "Срок действия ссылки истёк",
  "access.read": "Только чтение",
  "access.edit": "Редактирование",
  "access.review": "Рецензирование",
  "access.comment": "Комментирование",
  "access.fillForms": "Заполнение",
  "access.customFilter": "Пользовательский фильтр",
};

export default ru;
