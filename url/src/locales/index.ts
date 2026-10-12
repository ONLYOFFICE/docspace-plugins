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

import { I18n } from "i18n-js";
import { PluginLocale } from "@onlyoffice/docspace-plugin-sdk";
import en from "./en.json";
import arSA from "./ar_SA.json";
import az from "./az.json";
import bg from "./bg.json";
import cs from "./cs.json";
import de from "./de.json";
import elGR from "./el_GR.json";
import enGB from "./en_GB.json";
import es from "./es.json";
import fi from "./fi.json";
import fr from "./fr.json";
import hyAM from "./hy_AM.json";
import it from "./it.json";
import ja from "./ja.json";
import koKR from "./ko_KR.json";
import loLA from "./lo_LA.json";
import lv from "./lv.json";
import nl from "./nl.json";
import pl from "./pl.json";
import pt from "./pt.json";
import ptBR from "./pt_BR.json";
import ro from "./ro.json";
import ru from "./ru.json";
import si from "./si.json";
import sk from "./sk.json";
import sl from "./sl.json";
import sqAL from "./sq_AL.json";
import srCyrlRS from "./sr_Cyrl_RS.json";
import srLatnRS from "./sr_Latn_RS.json";
import tr from "./tr.json";
import ukUA from "./uk_UA.json";
import vi from "./vi.json";
import zhCN from "./zh_CN.json";

export const i18n = new I18n({
  [PluginLocale.EN_US]: en,
  [PluginLocale.AR_SA]: arSA,
  [PluginLocale.AZ]: az,
  [PluginLocale.BG]: bg,
  [PluginLocale.CS]: cs,
  [PluginLocale.DE]: de,
  [PluginLocale.EL_GR]: elGR,
  [PluginLocale.EN_GB]: enGB,
  [PluginLocale.ES]: es,
  [PluginLocale.FI]: fi,
  [PluginLocale.FR]: fr,
  [PluginLocale.HY_AM]: hyAM,
  [PluginLocale.IT]: it,
  [PluginLocale.JA_JP]: ja,
  [PluginLocale.KO_KR]: koKR,
  [PluginLocale.LO_LA]: loLA,
  [PluginLocale.LV]: lv,
  [PluginLocale.NL]: nl,
  [PluginLocale.PL]: pl,
  [PluginLocale.PT]: pt,
  [PluginLocale.PT_BR]: ptBR,
  [PluginLocale.RO]: ro,
  [PluginLocale.RU]: ru,
  [PluginLocale.SI]: si,
  [PluginLocale.SK]: sk,
  [PluginLocale.SL]: sl,
  [PluginLocale.SQ_AL]: sqAL,
  [PluginLocale.SR_CYRL_RS]: srCyrlRS,
  [PluginLocale.SR_LATN_RS]: srLatnRS,
  [PluginLocale.TR]: tr,
  [PluginLocale.UK_UA]: ukUA,
  [PluginLocale.VI]: vi,
  [PluginLocale.ZH_CN]: zhCN,
});

i18n.defaultLocale = PluginLocale.EN_US;
i18n.locale = PluginLocale.EN_US;
i18n.enableFallback = true;

export const setLocale = (locale: PluginLocale): void => {
  const next = i18n.translations[locale] ? locale : i18n.defaultLocale;
  if (i18n.locale === next) return;
  i18n.locale = next;
};
