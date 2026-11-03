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
  "contextMenu.label": "الحصول على رمز QR",
  "infoPanel.tabName": "رمز QR",
  "modal.header": "رمز QR لرابط المشاركة",
  "hint.header": "يفتح رمز QR رابط المشاركة",
  "hint.body":
    "وجّه كاميرا الهاتف نحو الرمز لفتح هذا العنصر. يمكنك ضبط من يمكنه فتح الرابط وأذونات الوصول ومدة الصلاحية وكلمة المرور في علامة التبويب «{tab}».",
  "hint.emptyBody":
    "لا يوجد لهذا العنصر رابط مشاركة بعد. أنشئه في علامة التبويب «{tab}»، حيث يمكنك أيضًا تحديد من يمكنه فتحه وأذوناته ومدة صلاحيته وكلمة المرور.",
  "hint.shareTab": "شارك",
  "hint.membersTab": "جهات الاتصال",
  "error.header": "تعذّر تحميل الرابط",
  "error.body":
    "لم يستجب الخادم أو أعاد خطأً. عادةً ما تكون هذه مشكلة اتصال مؤقتة، لذا يعيد زر «المحاولة مرة أخرى» طلب الرابط. إذا استمر الخطأ، فالرابط متاح أيضًا في علامة التبويب «{tab}».",
  "modal.retry": "المحاولة مرة أخرى",
  "modal.unsupportedRoom":
    "لا يحتوي هذا النوع من الغرف على رابط عام على مستوى الغرفة. يتوفر هذا الرابط فقط في الغرف العامة والغرف المخصصة ومساحات تعبئة النماذج.",
  "modal.copy": "نسخ الرابط",
  "modal.copied": "تم نسخ الرابط إلى الحافظة",
  "modal.copyFailed": "تعذّر نسخ الرابط",
  "modal.close": "إغلاق",
  "link.create": "إنشاء رابط",
  "link.createFailed": "تعذّر إنشاء الرابط. حاول مرة أخرى لاحقًا.",
  "link.anyone": "أي شخص لديه الرابط",
  "link.internal": "خاص بمستخدمي مساحة العمل فقط",
  "link.password": "محمي بكلمة مرور",
  "link.noTimeLimit": "هذا الرابط بلا حد زمني",
  "link.validUntil": "هذا الرابط صالح حتى {date}",
  "link.expired": "انتهت صلاحية الرابط",
  "access.read": "للقراءة فقط",
  "access.edit": "التعديل",
  "access.review": "مراجعة",
  "access.comment": "تعليق",
  "access.fillForms": "ملء",
  "access.customFilter": "تصفية مخصصة",
};

export default arSA;
