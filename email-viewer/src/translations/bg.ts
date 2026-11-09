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
  "file.typeName": "Имейл съобщение",
  "header.from": "От",
  "header.to": "До",
  "header.cc": "Копие",
  "header.bcc": "Скрито копие",
  "header.date": "Дата",
  "subject.empty": "(без тема)",
  "body.empty": "Това съобщение няма текст.",
  "body.title": "Текст на съобщението",
  "attachments.title": "Прикачени файлове ({count})",
  "attachments.save": "Запазване в тази папка",
  "attachments.saveAll": "Запазване на всички",
  "images.blocked": "Външните изображения са блокирани, за да се защити поверителността ви.",
  "images.load": "Зареждане на изображенията",
  "images.hide": "Скриване на изображенията",
  "toast.saved": "Файлът {name} е запазен в текущата папка",
  "toast.savedAll": "Прикачени файлове, запазени в текущата папка: {count}",
  "toast.saveFailed": "Неуспешно запазване на {name}",
  "toast.saveFailedSome": "Незапазени прикачени файлове: {failed} от {total}",
  "state.loading": "Зареждане на съобщението…",
  "state.empty": "Този файл е празен.",
  "state.loadFailed": "Файлът не можа да бъде зареден.",
  "state.parseFailed":
    "Съобщението не може да бъде прочетено. Файлът може да е повреден или да не е имейл.",
  "state.noFile": "Не е избран файл.",
};

export default bg;
