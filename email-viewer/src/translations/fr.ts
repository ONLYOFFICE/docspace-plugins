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

const fr: TStrings = {
  "file.typeName": "Message électronique",
  "header.from": "De",
  "header.to": "À",
  "header.cc": "Cc",
  "header.bcc": "Cci",
  "header.date": "Date",
  "subject.empty": "(sans objet)",
  "body.empty": "Ce message ne contient pas de texte.",
  "body.title": "Corps du message",
  "attachments.title": "Pièces jointes ({count})",
  "attachments.save": "Enregistrer dans ce dossier",
  "attachments.saveAll": "Tout enregistrer",
  "images.blocked": "Les images distantes sont bloquées pour protéger votre vie privée.",
  "images.load": "Charger les images",
  "images.hide": "Masquer les images",
  "toast.saved": "Le fichier {name} a été enregistré dans le dossier actuel",
  "toast.savedAll": "Pièces jointes enregistrées dans le dossier actuel : {count}",
  "toast.saveFailed": "Impossible d'enregistrer {name}",
  "toast.saveFailedSome": "Pièces jointes non enregistrées : {failed} sur {total}",
  "state.loading": "Chargement du message…",
  "state.empty": "Ce fichier est vide.",
  "state.loadFailed": "Impossible de charger le fichier.",
  "state.parseFailed":
    "Impossible de lire ce message. Le fichier est peut-être endommagé ou n'est pas un e-mail.",
  "state.noFile": "Aucun fichier n'est sélectionné.",
};

export default fr;
