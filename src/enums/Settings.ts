import { Components } from "./Components";

export const enum SettingsType {
  modal = "modal",
  settingsPage = "settings-page",
  both = "both",
}

export const enum ControlGroupElement {
  input = Components.input,
  checkbox = Components.checkbox,
  toggleButton = Components.toggleButton,
  textArea = Components.textArea,
}
