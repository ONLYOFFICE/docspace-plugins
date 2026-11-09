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
  "file.typeName": "Почтовое сообщение",
  "header.from": "От",
  "header.to": "Кому",
  "header.cc": "Копия",
  "header.bcc": "Скрытая копия",
  "header.date": "Дата",
  "subject.empty": "(без темы)",
  "body.empty": "В этом сообщении нет текста.",
  "body.title": "Текст сообщения",
  "attachments.title": "Вложения ({count})",
  "attachments.save": "Сохранить в эту папку",
  "attachments.saveAll": "Сохранить все",
  "images.blocked": "Внешние изображения заблокированы для защиты приватности.",
  "images.load": "Загрузить изображения",
  "images.hide": "Скрыть изображения",
  "toast.saved": "{name} сохранён в текущую папку",
  "toast.savedAll": "Вложений сохранено в текущую папку: {count}",
  "toast.saveFailed": "Не удалось сохранить {name}",
  "toast.saveFailedSome": "Не удалось сохранить {failed} из {total} вложений",
  "state.loading": "Загрузка сообщения…",
  "state.empty": "Файл пуст.",
  "state.loadFailed": "Не удалось загрузить файл.",
  "state.parseFailed": "Не удалось прочитать сообщение. Файл повреждён или не является письмом.",
  "state.noFile": "Файл не выбран.",
};

export default ru;
