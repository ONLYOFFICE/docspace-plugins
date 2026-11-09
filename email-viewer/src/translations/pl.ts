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

const pl: TStrings = {
  "file.typeName": "Wiadomość e-mail",
  "header.from": "Od",
  "header.to": "Do",
  "header.cc": "DW",
  "header.bcc": "UDW",
  "header.date": "Data",
  "subject.empty": "(bez tematu)",
  "body.empty": "Ta wiadomość nie zawiera tekstu.",
  "body.title": "Treść wiadomości",
  "attachments.title": "Załączniki ({count})",
  "attachments.save": "Zapisz w tym folderze",
  "attachments.saveAll": "Zapisz wszystkie",
  "images.blocked": "Obrazy zewnętrzne są zablokowane w celu ochrony Twojej prywatności.",
  "images.load": "Wczytaj obrazy",
  "images.hide": "Ukryj obrazy",
  "toast.saved": "Zapisano {name} w bieżącym folderze",
  "toast.savedAll": "Zapisano załączniki w bieżącym folderze: {count}",
  "toast.saveFailed": "Nie udało się zapisać {name}",
  "toast.saveFailedSome": "Nie udało się zapisać załączników: {failed} z {total}",
  "state.loading": "Wczytywanie wiadomości…",
  "state.empty": "Ten plik jest pusty.",
  "state.loadFailed": "Nie udało się wczytać pliku.",
  "state.parseFailed":
    "Nie udało się odczytać tej wiadomości. Plik może być uszkodzony lub nie jest wiadomością e-mail.",
  "state.noFile": "Nie wybrano pliku.",
};

export default pl;
