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
  "contextMenu.label": "Uzyskaj kod QR",
  "infoPanel.tabName": "Kod QR",
  "modal.header": "Kod QR udostępnionego linku",
  "hint.header": "Kod QR otwiera udostępniony link",
  "hint.body":
    "Skieruj aparat telefonu na kod, aby otworzyć ten element. Kto może otworzyć link, prawa dostępu, termin ważności i hasło ustawisz w zakładce „{tab}”.",
  "hint.emptyBody":
    "Ten element nie ma jeszcze udostępnionego linku. Utwórz go w zakładce „{tab}”, gdzie wybierzesz też, kto może go otworzyć, prawa, termin ważności i hasło.",
  "hint.shareTab": "Udostępnij",
  "hint.membersTab": "Kontakty",
  "error.header": "Nie udało się wczytać linku",
  "error.body":
    "Serwer nie odpowiedział lub zwrócił błąd. Zwykle to chwilowy problem z połączeniem, więc „Spróbuj ponownie” jeszcze raz pobierze link. Jeśli błąd się powtarza, link znajdziesz też w zakładce „{tab}”.",
  "modal.retry": "Spróbuj ponownie",
  "modal.unsupportedRoom":
    "Ten typ pokoju nie ma linku publicznego na poziomie pokoju. Mają go tylko pokój publiczny, niestandardowy pokój i obszar wypełniania formularzy.",
  "modal.copy": "Kopiuj link",
  "modal.copied": "Link został skopiowany do schowka",
  "modal.copyFailed": "Nie udało się skopiować linku",
  "modal.close": "Zamknij",
  "link.create": "Utwórz link",
  "link.createFailed": "Nie udało się utworzyć linku. Spróbuj ponownie później.",
  "link.anyone": "Każdy, kto ma link",
  "link.internal": "Tylko użytkownicy przestrzeni roboczej",
  "link.password": "Chroniony hasłem",
  "link.noTimeLimit": "Ten link nie ma limitu czasu",
  "link.validUntil": "Ten link jest ważny do {date}",
  "link.expired": "Link wygasł",
  "access.read": "Tylko do odczytu",
  "access.edit": "Edytowanie",
  "access.review": "Recenzja",
  "access.comment": "Komentarz",
  "access.fillForms": "Wypełnianie",
  "access.customFilter": "Niestandardowy filtr",
};

export default pl;
