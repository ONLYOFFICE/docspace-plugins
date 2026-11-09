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

const arSA: TStrings = {
  "file.typeName": "رسالة بريد إلكتروني",
  "header.from": "من",
  "header.to": "إلى",
  "header.cc": "نسخة",
  "header.bcc": "نسخة مخفية",
  "header.date": "التاريخ",
  "subject.empty": "(بدون موضوع)",
  "body.empty": "لا تحتوي هذه الرسالة على نص.",
  "body.title": "نص الرسالة",
  "attachments.title": "المرفقات ({count})",
  "attachments.save": "حفظ في هذا المجلد",
  "attachments.saveAll": "حفظ الكل",
  "images.blocked": "تم حظر الصور الخارجية لحماية خصوصيتك.",
  "images.load": "تحميل الصور",
  "images.hide": "إخفاء الصور",
  "toast.saved": "تم حفظ {name} في المجلد الحالي",
  "toast.savedAll": "المرفقات المحفوظة في المجلد الحالي: {count}",
  "toast.saveFailed": "تعذّر حفظ {name}",
  "toast.saveFailedSome": "مرفقات تعذّر حفظها: {failed} من {total}",
  "state.loading": "جارٍ تحميل الرسالة…",
  "state.empty": "هذا الملف فارغ.",
  "state.loadFailed": "تعذّر تحميل الملف.",
  "state.parseFailed": "تعذّرت قراءة هذه الرسالة. قد يكون الملف تالفًا أو ليس رسالة بريد إلكتروني.",
  "state.noFile": "لم يتم تحديد أي ملف.",
};

export default arSA;
