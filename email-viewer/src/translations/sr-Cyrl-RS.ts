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
  "file.typeName": "Имејл порука",
  "header.from": "Од",
  "header.to": "За",
  "header.cc": "Копија",
  "header.bcc": "Скривена копија",
  "header.date": "Датум",
  "subject.empty": "(без наслова)",
  "body.empty": "Ова порука нема текст.",
  "body.title": "Текст поруке",
  "attachments.title": "Прилози ({count})",
  "attachments.save": "Сачувај у ову фасциклу",
  "attachments.saveAll": "Сачувај све",
  "images.blocked": "Спољне слике су блокиране ради заштите ваше приватности.",
  "images.load": "Учитај слике",
  "images.hide": "Сакриј слике",
  "toast.saved": "Датотека {name} је сачувана у тренутну фасциклу",
  "toast.savedAll": "Прилози сачувани у тренутну фасциклу: {count}",
  "toast.saveFailed": "Није могуће сачувати датотеку {name}",
  "toast.saveFailedSome": "Није могуће сачувати прилоге: {failed} од {total}",
  "state.loading": "Учитавање поруке…",
  "state.empty": "Ова датотека је празна.",
  "state.loadFailed": "Није могуће учитати датотеку.",
  "state.parseFailed":
    "Није могуће прочитати ову поруку. Датотека је можда оштећена или није имејл.",
  "state.noFile": "Ниједна датотека није изабрана.",
};

export default srCyrlRS;
