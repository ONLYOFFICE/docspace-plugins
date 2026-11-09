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

const it: TStrings = {
  "file.typeName": "Messaggio email",
  "header.from": "Da",
  "header.to": "A",
  "header.cc": "Cc",
  "header.bcc": "Ccn",
  "header.date": "Data",
  "subject.empty": "(nessun oggetto)",
  "body.empty": "Questo messaggio non contiene testo.",
  "body.title": "Corpo del messaggio",
  "attachments.title": "Allegati ({count})",
  "attachments.save": "Salva in questa cartella",
  "attachments.saveAll": "Salva tutti",
  "images.blocked": "Le immagini remote sono bloccate per proteggere la tua privacy.",
  "images.load": "Carica immagini",
  "images.hide": "Nascondi immagini",
  "toast.saved": "File {name} salvato nella cartella corrente",
  "toast.savedAll": "Allegati salvati nella cartella corrente: {count}",
  "toast.saveFailed": "Impossibile salvare {name}",
  "toast.saveFailedSome": "Allegati non salvati: {failed} su {total}",
  "state.loading": "Caricamento del messaggio…",
  "state.empty": "Questo file è vuoto.",
  "state.loadFailed": "Impossibile caricare il file.",
  "state.parseFailed":
    "Impossibile leggere questo messaggio. Il file potrebbe essere danneggiato o non essere un'email.",
  "state.noFile": "Nessun file selezionato.",
};

export default it;
