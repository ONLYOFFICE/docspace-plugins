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
  "file.typeName": "Μήνυμα email",
  "header.from": "Από",
  "header.to": "Προς",
  "header.cc": "Κοιν.",
  "header.bcc": "Ιδ. κοιν.",
  "header.date": "Ημερομηνία",
  "subject.empty": "(χωρίς θέμα)",
  "body.empty": "Αυτό το μήνυμα δεν περιέχει κείμενο.",
  "body.title": "Κείμενο μηνύματος",
  "attachments.title": "Συνημμένα ({count})",
  "attachments.save": "Αποθήκευση σε αυτόν τον φάκελο",
  "attachments.saveAll": "Αποθήκευση όλων",
  "images.blocked":
    "Οι απομακρυσμένες εικόνες έχουν αποκλειστεί για την προστασία του απορρήτου σας.",
  "images.load": "Φόρτωση εικόνων",
  "images.hide": "Απόκρυψη εικόνων",
  "toast.saved": "Το {name} αποθηκεύτηκε στον τρέχοντα φάκελο",
  "toast.savedAll": "Συνημμένα που αποθηκεύτηκαν στον τρέχοντα φάκελο: {count}",
  "toast.saveFailed": "Δεν ήταν δυνατή η αποθήκευση του {name}",
  "toast.saveFailedSome": "Συνημμένα που δεν αποθηκεύτηκαν: {failed} από {total}",
  "state.loading": "Φόρτωση μηνύματος…",
  "state.empty": "Αυτό το αρχείο είναι κενό.",
  "state.loadFailed": "Δεν ήταν δυνατή η φόρτωση του αρχείου.",
  "state.parseFailed":
    "Δεν ήταν δυνατή η ανάγνωση αυτού του μηνύματος. Το αρχείο μπορεί να είναι κατεστραμμένο ή να μην είναι email.",
  "state.noFile": "Δεν έχει επιλεγεί αρχείο.",
};

export default elGR;
