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

const tr: TStrings = {
  "file.typeName": "E-posta iletisi",
  "header.from": "Kimden",
  "header.to": "Kime",
  "header.cc": "Bilgi",
  "header.bcc": "Gizli",
  "header.date": "Tarih",
  "subject.empty": "(konu yok)",
  "body.empty": "Bu iletide metin yok.",
  "body.title": "İleti metni",
  "attachments.title": "Ekler ({count})",
  "attachments.save": "Bu klasöre kaydet",
  "attachments.saveAll": "Tümünü kaydet",
  "images.blocked": "Gizliliğinizi korumak için uzak görüntüler engellendi.",
  "images.load": "Görüntüleri yükle",
  "images.hide": "Görüntüleri gizle",
  "toast.saved": "{name} geçerli klasöre kaydedildi",
  "toast.savedAll": "Geçerli klasöre kaydedilen ek sayısı: {count}",
  "toast.saveFailed": "{name} kaydedilemedi",
  "toast.saveFailedSome": "Kaydedilemeyen ek sayısı: {failed} / {total}",
  "state.loading": "İleti yükleniyor…",
  "state.empty": "Bu dosya boş.",
  "state.loadFailed": "Dosya yüklenemedi.",
  "state.parseFailed": "Bu ileti okunamadı. Dosya bozuk olabilir veya bir e-posta olmayabilir.",
  "state.noFile": "Hiçbir dosya seçilmedi.",
};

export default tr;
