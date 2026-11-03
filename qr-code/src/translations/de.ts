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

const de: TStrings = {
  "contextMenu.label": "QR-Code abrufen",
  "infoPanel.tabName": "QR-Code",
  "modal.header": "QR-Code für den freigegebenen Link",
  "hint.header": "Der QR-Code öffnet den freigegebenen Link",
  "hint.body":
    "Richten Sie die Handykamera auf den Code, um dieses Element zu öffnen. Wer den Link öffnen darf sowie Zugriffsrechte, Gültigkeitsdauer und Passwort legen Sie auf der Registerkarte „{tab}“ fest.",
  "hint.emptyBody":
    "Für dieses Element gibt es noch keinen freigegebenen Link. Erstellen Sie ihn auf der Registerkarte „{tab}“. Dort legen Sie auch fest, wer ihn öffnen darf, sowie Rechte, Gültigkeitsdauer und Passwort.",
  "hint.shareTab": "Freigeben",
  "hint.membersTab": "Kontakte",
  "error.header": "Der Link konnte nicht geladen werden",
  "error.body":
    "Der Server hat nicht geantwortet oder einen Fehler zurückgegeben. Meist ist das ein kurzzeitiges Verbindungsproblem, daher fordert „Erneut versuchen“ den Link noch einmal an. Wenn der Fehler bestehen bleibt, finden Sie den Link auch auf der Registerkarte „{tab}“.",
  "modal.retry": "Erneut versuchen",
  "modal.unsupportedRoom":
    "Dieser Raumtyp hat keinen öffentlichen Link auf Raumebene. Einen solchen haben nur ein öffentlicher Raum, ein benutzerdefinierter Raum und ein Space zum Formularausfüllen.",
  "modal.copy": "Link kopieren",
  "modal.copied": "Link in die Zwischenablage kopiert",
  "modal.copyFailed": "Der Link konnte nicht kopiert werden",
  "modal.close": "Schließen",
  "link.create": "Link erstellen",
  "link.createFailed": "Der Link konnte nicht erstellt werden. Versuchen Sie es später erneut.",
  "link.anyone": "Jeder mit dem Link",
  "link.internal": "Nur Arbeitsbereichsbenutzer",
  "link.password": "Passwortgeschützt",
  "link.noTimeLimit": "Dieser Link ist zeitlich unbegrenzt gültig",
  "link.validUntil": "Dieser Link ist gültig bis {date}",
  "link.expired": "Der Link ist abgelaufen",
  "access.read": "Schreibgeschützt",
  "access.edit": "Bearbeitung",
  "access.review": "Überprüfung",
  "access.comment": "Kommentieren",
  "access.fillForms": "Ausfüllen",
  "access.customFilter": "Benutzerdefinierter Filter",
};

export default de;
