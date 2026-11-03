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
  "contextMenu.label": "Ottieni codice QR",
  "infoPanel.tabName": "Codice QR",
  "modal.header": "Codice QR del link condiviso",
  "hint.header": "Il codice QR apre il link condiviso",
  "hint.body":
    "Inquadra il codice con la fotocamera del telefono per aprire questo elemento. Chi può aprire il link, i diritti di accesso, la scadenza e la password si impostano nella scheda «{tab}».",
  "hint.emptyBody":
    "Questo elemento non ha ancora un link condiviso. Crealo nella scheda «{tab}», dove puoi anche scegliere chi può aprirlo, i diritti, la scadenza e la password.",
  "hint.shareTab": "Condividi",
  "hint.membersTab": "Contatti",
  "error.header": "Impossibile caricare il link",
  "error.body":
    "Il server non ha risposto o ha restituito un errore. Di solito si tratta di un breve problema di connessione, quindi «Riprova» richiede di nuovo il link. Se l'errore persiste, il link si trova anche nella scheda «{tab}».",
  "modal.retry": "Riprova",
  "modal.unsupportedRoom":
    "Questo tipo di stanza non ha un link pubblico a livello di stanza. Ce l'hanno solo una stanza pubblica, una stanza personalizzata e uno spazio di compilazione moduli.",
  "modal.copy": "Copia il link",
  "modal.copied": "Link copiato negli appunti",
  "modal.copyFailed": "Impossibile copiare il link",
  "modal.close": "Chiudi",
  "link.create": "Crea link",
  "link.createFailed": "Impossibile creare il link. Riprova più tardi.",
  "link.anyone": "Chiunque abbia il link",
  "link.internal": "Solo utenti dello spazio di lavoro",
  "link.password": "Protetto da password",
  "link.noTimeLimit": "Questo link non ha limiti di tempo",
  "link.validUntil": "Questo link è valido fino al {date}",
  "link.expired": "Il link è scaduto",
  "access.read": "In sola lettura",
  "access.edit": "Modifica",
  "access.review": "Revisione",
  "access.comment": "Commento",
  "access.fillForms": "Compilazione",
  "access.customFilter": "Filtro personalizzato",
};

export default it;
