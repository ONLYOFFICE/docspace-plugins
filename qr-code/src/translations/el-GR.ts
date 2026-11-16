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

const elGR: TStrings = {
  "contextMenu.label": "Εμφάνιση κωδικού QR",
  "infoPanel.tabName": "Κωδικός QR",
  "modal.header": "Κωδικός QR του κοινόχρηστου συνδέσμου",
  "hint.header": "Ο κωδικός QR ανοίγει τον κοινόχρηστο σύνδεσμο",
  "hint.body":
    "Στρέψτε την κάμερα του τηλεφώνου στον κωδικό για να ανοίξετε αυτό το στοιχείο. Στην καρτέλα «{tab}» ορίζετε ποιος μπορεί να ανοίξει τον σύνδεσμο, καθώς και τα δικαιώματα πρόσβασης, τη λήξη και τον κωδικό πρόσβασης.",
  "hint.emptyBody":
    "Αυτό το στοιχείο δεν έχει ακόμη κοινόχρηστο σύνδεσμο. Δημιουργήστε τον στην καρτέλα «{tab}», όπου ορίζετε επίσης ποιος μπορεί να τον ανοίξει, τα δικαιώματα, τη λήξη και τον κωδικό πρόσβασης.",
  "hint.shareTab": "Κοινή χρήση",
  "hint.membersTab": "Επαφές",
  "error.header": "Δεν ήταν δυνατή η φόρτωση του συνδέσμου",
  "error.body":
    "Ο διακομιστής δεν απάντησε ή επέστρεψε σφάλμα. Συνήθως πρόκειται για σύντομο πρόβλημα σύνδεσης, οπότε το «Δοκίμασε ξανά» ζητά τον σύνδεσμο ακόμη μία φορά. Αν το σφάλμα επιμένει, ο σύνδεσμος υπάρχει και στην καρτέλα «{tab}».",
  "modal.retry": "Δοκίμασε ξανά",
  "modal.unsupportedRoom":
    "Αυτός ο τύπος δωματίου δεν έχει δημόσιο σύνδεσμο σε επίπεδο δωματίου. Τέτοιον σύνδεσμο έχουν μόνο τα δημόσια δωμάτια, τα προσαρμοσμένα δωμάτια και οι χώροι συμπλήρωσης φορμών.",
  "modal.copy": "Αντιγραφή συνδέσμου",
  "modal.copied": "Ο σύνδεσμος αντιγράφηκε στο πρόχειρο",
  "modal.copyFailed": "Δεν ήταν δυνατή η αντιγραφή του συνδέσμου",
  "modal.close": "Κλείσιμο",
  "link.create": "Δημιουργία συνδέσμου",
  "link.createFailed": "Δεν ήταν δυνατή η δημιουργία του συνδέσμου. Δοκιμάστε ξανά αργότερα.",
  "link.anyone": "Οποιοσδήποτε με τον σύνδεσμο",
  "link.internal": "Μόνο για χρήστες χώρου εργασίας",
  "link.password": "Με προστασία κωδικού πρόσβασης",
  "link.noTimeLimit": "Αυτός ο σύνδεσμος δεν έχει χρονικό περιορισμό",
  "link.validUntil": "Αυτός ο σύνδεσμος ισχύει έως {date}",
  "link.expired": "Ο σύνδεσμος έχει λήξει",
  "access.read": "Μόνο για ανάγνωση",
  "access.edit": "Επεξεργασία",
  "access.review": "Αξιολόγηση",
  "access.comment": "Σχόλιο",
  "access.fillForms": "Συμπλήρωση",
  "access.customFilter": "Προσαρμοσμένο φίλτρο",
};

export default elGR;
