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

const hyAM: TStrings = {
  "contextMenu.label": "Ստանալ QR կոդը",
  "infoPanel.tabName": "QR կոդ",
  "modal.header": "Ընդհանուր հղման QR կոդը",
  "hint.header": "QR կոդը բացում է ընդհանուր հղումը",
  "hint.body":
    "Ուղղեք հեռախոսի տեսախցիկը կոդին՝ այս տարրը բացելու համար։ Թե ով կարող է բացել հղումը, ինչպես նաև մատչման իրավունքները, ժամկետը և գաղտնաբառը կարգավորվում են «{tab}» ներդիրում։",
  "hint.emptyBody":
    "Այս տարրը դեռ ընդհանուր հղում չունի։ Ստեղծեք այն «{tab}» ներդիրում, որտեղ նաև ընտրում եք, թե ով կարող է այն բացել, ինչպես նաև իրավունքները, ժամկետը և գաղտնաբառը։",
  "hint.shareTab": "Կիսել",
  "hint.membersTab": "Կոնտակտներ",
  "error.header": "Չհաջողվեց բեռնել հղումը",
  "error.body":
    "Սերվերը չպատասխանեց կամ սխալ վերադարձրեց։ Սովորաբար դա կապի կարճատև խափանում է, ուստի «Փորձել կրկին» կոճակը նորից կհարցնի հղումը։ Եթե սխալը շարունակվում է, հղումը հասանելի է նաև «{tab}» ներդիրում։",
  "modal.retry": "Փորձել կրկին",
  "modal.unsupportedRoom":
    "Այս տեսակի սենյակը չունի սենյակի մակարդակի հանրային հղում։ Այն ունեն միայն հասարակական սենյակները, հարմարեցված սենյակները և ձևերի լրացման տարածքները։",
  "modal.copy": "Պատճենել հղումը",
  "modal.copied": "Հղումը պատճենվեց սեղմատախտակին",
  "modal.copyFailed": "Չհաջողվեց պատճենել հղումը",
  "modal.close": "Փակել",
  "link.create": "Ստեղծել հղում",
  "link.createFailed": "Չհաջողվեց ստեղծել հղումը։ Փորձեք ավելի ուշ։",
  "link.anyone": "Ցանկացած ոք, ով ունի հղումը",
  "link.internal": "Միայն աշխատանքային տարածքի օգտվողների համար",
  "link.password": "Պաշտպանված է գաղտնաբառով",
  "link.noTimeLimit": "Այս հղումը ժամանակի սահմանափակում չունի",
  "link.validUntil": "Այս հղումը գործում է մինչև {date}",
  "link.expired": "Հղման ժամկետը սպառվել է",
  "access.read": "Միայն կարդալու համար",
  "access.edit": "Խմբագրում",
  "access.review": "Վերանայում",
  "access.comment": "Մեկնաբանություն",
  "access.fillForms": "Լրացում",
  "access.customFilter": "Հարմարեցրած զտիչ",
};

export default hyAM;
