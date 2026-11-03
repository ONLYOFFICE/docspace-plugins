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

const sqAL: TStrings = {
  "contextMenu.label": "Merrni kodin QR",
  "infoPanel.tabName": "Kodi QR",
  "modal.header": "Kodi QR i lidhjes së shpërndarë",
  "hint.header": "Kodi QR hap lidhjen e shpërndarë",
  "hint.body":
    "Drejtojeni kamerën e telefonit te kodi për të hapur këtë element. Në skedën «{tab}» caktoni se kush mund ta hapë lidhjen, si dhe të drejtat e aksesit, skadimin dhe fjalëkalimin.",
  "hint.emptyBody":
    "Ky element nuk ka ende lidhje të shpërndarë. Krijojeni në skedën «{tab}», ku caktoni gjithashtu se kush mund ta hapë, të drejtat, skadimin dhe fjalëkalimin.",
  "hint.shareTab": "Ndani",
  "hint.membersTab": "Kontaktet",
  "error.header": "Lidhja nuk u ngarkua",
  "error.body":
    "Serveri nuk u përgjigj ose ktheu një gabim. Zakonisht bëhet fjalë për një problem të përkohshëm me rrjetin, ndaj «Provo përsëri» e kërkon lidhjen edhe një herë. Nëse gabimi vazhdon, lidhja gjendet edhe në skedën «{tab}».",
  "modal.retry": "Provo përsëri",
  "modal.unsupportedRoom":
    "Ky lloj dhome nuk ka lidhje publike në nivel dhome. Të tillë kanë vetëm dhomat publike, dhomat e personalizuara dhe hapësirat e plotësimit të formularëve.",
  "modal.copy": "Kopjoni lidhjen",
  "modal.copied": "Lidhja u kopjua në kujtesën e fragmenteve",
  "modal.copyFailed": "Lidhja nuk u kopjua",
  "modal.close": "Mbyllni",
  "link.create": "Krijoni lidhje",
  "link.createFailed": "Lidhja nuk u krijua. Provoni sërish më vonë.",
  "link.anyone": "Kushdo që ka linkun",
  "link.internal": "Vetëm përdoruesit e hapësirës së punës",
  "link.password": "E mbrojtur me fjalëkalim",
  "link.noTimeLimit": "Kjo lidhje nuk ka kufizim kohor",
  "link.validUntil": "Kjo lidhje është e vlefshme deri më {date}",
  "link.expired": "Lidhja ka skaduar",
  "access.read": "Vetëm për lexim",
  "access.edit": "Editim",
  "access.review": "Rishikimi",
  "access.comment": "Koment",
  "access.fillForms": "Plotësim",
  "access.customFilter": "Filtri i personalizuar",
};

export default sqAL;
