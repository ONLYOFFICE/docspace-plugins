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
  "file.typeName": "Повідомлення електронної пошти",
  "header.from": "Від",
  "header.to": "Кому",
  "header.cc": "Копія",
  "header.bcc": "Прихована копія",
  "header.date": "Дата",
  "subject.empty": "(без теми)",
  "body.empty": "У цьому повідомленні немає тексту.",
  "body.title": "Текст повідомлення",
  "attachments.title": "Вкладення ({count})",
  "attachments.save": "Зберегти в цю папку",
  "attachments.saveAll": "Зберегти всі",
  "images.blocked": "Зовнішні зображення заблоковано для захисту вашої конфіденційності.",
  "images.load": "Завантажити зображення",
  "images.hide": "Приховати зображення",
  "toast.saved": "{name} збережено в поточну папку",
  "toast.savedAll": "Вкладень збережено в поточну папку: {count}",
  "toast.saveFailed": "Не вдалося зберегти {name}",
  "toast.saveFailedSome": "Не вдалося зберегти вкладення: {failed} із {total}",
  "state.loading": "Завантаження повідомлення…",
  "state.empty": "Файл порожній.",
  "state.loadFailed": "Не вдалося завантажити файл.",
  "state.parseFailed": "Не вдалося прочитати повідомлення. Файл пошкоджено або це не лист.",
  "state.noFile": "Файл не вибрано.",
};

export default ukUA;
