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
  "contextMenu.label": "QR kodu əldə edin",
  "infoPanel.tabName": "QR kod",
  "modal.header": "Paylaşılan linkin QR kodu",
  "hint.header": "QR kod paylaşılan linki açır",
  "hint.body":
    "Bu elementi açmaq üçün telefonun kamerasını koda yönəldin. Linki kimin aça biləcəyini, giriş hüquqlarını, etibarlılıq müddətini və şifrəni «{tab}» tabında təyin edə bilərsiniz.",
  "hint.emptyBody":
    "Bu elementin hələ paylaşılan linki yoxdur. Onu «{tab}» tabında yaradın; orada linki kimin aça biləcəyini, hüquqları, etibarlılıq müddətini və şifrəni də təyin edə bilərsiniz.",
  "hint.shareTab": "Paylaş",
  "hint.membersTab": "Əlaqələr",
  "error.header": "Linki yükləmək mümkün olmadı",
  "error.body":
    "Server cavab vermədi və ya xəta qaytardı. Bu, adətən qısamüddətli şəbəkə problemidir, ona görə də «Yenidən cəhd et» linki bir daha tələb edir. Xəta təkrarlanarsa, linki «{tab}» tabında da tapa bilərsiniz.",
  "modal.retry": "Yenidən cəhd et",
  "modal.unsupportedRoom":
    "Bu otaq növünün otaq səviyyəsində ümumi linki yoxdur. Belə link yalnız ümumi otaqlarda, fərdi otaqlarda və forma doldurma sahələrində olur.",
  "modal.copy": "Linki kopyalayın",
  "modal.copied": "Link buferə kopyalandı",
  "modal.copyFailed": "Linki kopyalamaq mümkün olmadı",
  "modal.close": "Bağlayın",
  "link.create": "Link yaradın",
  "link.createFailed": "Linki yaratmaq mümkün olmadı. Daha sonra yenidən cəhd edin.",
  "link.anyone": "Linki olan hər kəs",
  "link.internal": "Yalnız iş sahəsi istifadəçiləri",
  "link.password": "Şifrə ilə qorunur",
  "link.noTimeLimit": "Bu linkin vaxt məhdudiyyəti yoxdur",
  "link.validUntil": "Bu link {date} tarixinədək etibarlıdır",
  "link.expired": "Linkin müddəti bitib",
  "access.read": "Yalnız oxumaq üçün",
  "access.edit": "Redaktə etmə",
  "access.review": "Nəzərdən keçirin",
  "access.comment": "Şərh",
  "access.fillForms": "Doldurma",
  "access.customFilter": "Fərdi süzgəc",
};

export default az;
