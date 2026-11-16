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
  "contextMenu.label": "Obtenir le code QR",
  "infoPanel.tabName": "Code QR",
  "modal.header": "Code QR du lien partagé",
  "hint.header": "Le code QR ouvre le lien partagé",
  "hint.body":
    "Pointez l'appareil photo d'un téléphone vers le code pour ouvrir cet élément. Les personnes autorisées à ouvrir le lien, les droits d'accès, l'expiration et le mot de passe se définissent dans l'onglet « {tab} ».",
  "hint.emptyBody":
    "Cet élément n'a pas encore de lien partagé. Créez-le dans l'onglet « {tab} », où vous choisirez aussi qui peut l'ouvrir, ses droits, son expiration et son mot de passe.",
  "hint.shareTab": "Partager",
  "hint.membersTab": "Contacts",
  "error.header": "Impossible de charger le lien",
  "error.body":
    "Le serveur n'a pas répondu ou a renvoyé une erreur. Il s'agit généralement d'un bref problème de connexion : « Réessayer » demande à nouveau le lien. Si l'erreur persiste, le lien se trouve aussi dans l'onglet « {tab} ».",
  "modal.retry": "Réessayer",
  "modal.unsupportedRoom":
    "Ce type de salle n'a pas de lien public au niveau de la salle. Seuls une salle publique, une salle personnalisée et un espace de remplissage de formulaires en ont un.",
  "modal.copy": "Copier le lien",
  "modal.copied": "Lien copié dans le presse-papiers",
  "modal.copyFailed": "Impossible de copier le lien",
  "modal.close": "Fermer",
  "link.create": "Créer un lien",
  "link.createFailed": "Impossible de créer le lien. Réessayez plus tard.",
  "link.anyone": "Toute personne ayant le lien",
  "link.internal": "Utilisateurs de l'espace de travail uniquement",
  "link.password": "Protégé par mot de passe",
  "link.noTimeLimit": "Ce lien n'a pas de limite de temps",
  "link.validUntil": "Ce lien est valable jusqu'au {date}",
  "link.expired": "Le lien a expiré",
  "access.read": "Lecture seule",
  "access.edit": "Édition",
  "access.review": "Révision",
  "access.comment": "Commentaire",
  "access.fillForms": "Remplissage",
  "access.customFilter": "Filtre personnalisé",
};

export default fr;
