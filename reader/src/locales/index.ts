import { I18n } from "i18n-js";
import { PluginLocale } from "@onlyoffice/docspace-plugin-sdk";
import { contextMenuItem } from "../ContextMenu";
import { readerFileItems } from "../File";
import en from "./en.json";
import de from "./de.json";
import es from "./es.json";
import fr from "./fr.json";
import it from "./it.json";
import ja from "./ja.json";
import ptBR from "./pt_BR.json";
import ru from "./ru.json";
import zhCN from "./zh_CN.json";

export const i18n = new I18n({
	[PluginLocale.EN_US]: en,
	[PluginLocale.DE]: de,
	[PluginLocale.ES]: es,
	[PluginLocale.FR]: fr,
	[PluginLocale.IT]: it,
	[PluginLocale.JA_JP]: ja,
	[PluginLocale.PT_BR]: ptBR,
	[PluginLocale.RU]: ru,
	[PluginLocale.ZH_CN]: zhCN
});

i18n.defaultLocale = PluginLocale.EN_US;
i18n.locale = PluginLocale.EN_US;
i18n.enableFallback = true;

export const setLocale = (locale: PluginLocale): void => {
	console.log("SetLocale", locale);
	const next = i18n.translations[locale] ? locale : i18n.defaultLocale;
	if (i18n.locale === next) return;
	i18n.locale = next;

	contextMenuItem.label = i18n.t("context_menu.open_in_reader");

	for (const item of readerFileItems) {
		item.fileTypeName = i18n.t("file_type_name");
	}
};
