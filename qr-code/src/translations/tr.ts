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
  "contextMenu.label": "QR kodunu al",
  "infoPanel.tabName": "QR kodu",
  "modal.header": "Paylaşılan bağlantının QR kodu",
  "hint.header": "QR kodu paylaşılan bağlantıyı açar",
  "hint.body":
    "Bu öğeyi açmak için telefonunuzun kamerasını koda doğrultun. Bağlantıyı kimlerin açabileceğini, erişim haklarını, geçerlilik süresini ve şifreyi “{tab}” sekmesinden ayarlayabilirsiniz.",
  "hint.emptyBody":
    "Bu öğenin henüz paylaşılan bağlantısı yok. Bağlantıyı “{tab}” sekmesinden oluşturun; orada bağlantıyı kimlerin açabileceğini, hakları, geçerlilik süresini ve şifreyi de belirleyebilirsiniz.",
  "hint.shareTab": "Paylaş",
  "hint.membersTab": "Kişiler",
  "error.header": "Bağlantı yüklenemedi",
  "error.body":
    "Sunucu yanıt vermedi veya bir hata döndürdü. Bu genellikle kısa süreli bir ağ sorunudur, bu nedenle “Tekrar Dene” bağlantıyı yeniden ister. Sorun devam ederse bağlantıyı “{tab}” sekmesinde de bulabilirsiniz.",
  "modal.retry": "Tekrar Dene",
  "modal.unsupportedRoom":
    "Bu oda türünün oda düzeyinde herkese açık bağlantısı yoktur. Bu bağlantı yalnızca herkese açık odalarda, özel odalarda ve form doldurma alanlarında bulunur.",
  "modal.copy": "Bağlantıyı kopyala",
  "modal.copied": "Bağlantı panoya kopyalandı",
  "modal.copyFailed": "Bağlantı kopyalanamadı",
  "modal.close": "Kapat",
  "link.create": "Bağlantı oluştur",
  "link.createFailed": "Bağlantı oluşturulamadı. Daha sonra tekrar deneyin.",
  "link.anyone": "Bağlantısı olan herkes",
  "link.internal": "Yalnızca çalışma alanı kullanıcıları",
  "link.password": "Şifre korumalı",
  "link.noTimeLimit": "Bu bağlantının zaman sınırı yok",
  "link.validUntil": "Bu bağlantı {date} tarihine kadar geçerlidir",
  "link.expired": "Bağlantının süresi doldu",
  "access.read": "Salt okunur",
  "access.edit": "Düzenleme",
  "access.review": "İnceleme",
  "access.comment": "Yorum",
  "access.fillForms": "Doldurma",
  "access.customFilter": "Özel filtre",
};

export default tr;
