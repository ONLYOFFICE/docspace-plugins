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

const az: TStrings = {
  "file.typeName": "E-poçt məktubu",
  "header.from": "Kimdən",
  "header.to": "Kimə",
  "header.cc": "Surət",
  "header.bcc": "Gizli surət",
  "header.date": "Tarix",
  "subject.empty": "(mövzusuz)",
  "body.empty": "Bu məktubda mətn yoxdur.",
  "body.title": "Məktubun mətni",
  "attachments.title": "Qoşmalar ({count})",
  "attachments.save": "Bu qovluqda saxla",
  "attachments.saveAll": "Hamısını saxla",
  "images.blocked": "Məxfiliyinizi qorumaq üçün xarici şəkillər bloklanıb.",
  "images.load": "Şəkilləri yüklə",
  "images.hide": "Şəkilləri gizlət",
  "toast.saved": "{name} cari qovluqda saxlanıldı",
  "toast.savedAll": "Cari qovluqda saxlanılan qoşmalar: {count}",
  "toast.saveFailed": "{name} saxlanıla bilmədi",
  "toast.saveFailedSome": "Saxlanıla bilməyən qoşmalar: {failed} / {total}",
  "state.loading": "Məktub yüklənir…",
  "state.empty": "Bu fayl boşdur.",
  "state.loadFailed": "Fayl yüklənə bilmədi.",
  "state.parseFailed":
    "Bu məktubu oxumaq mümkün olmadı. Fayl zədələnmiş ola bilər və ya e-poçt məktubu deyil.",
  "state.noFile": "Fayl seçilməyib.",
};

export default az;
