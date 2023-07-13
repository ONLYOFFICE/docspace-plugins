const nameQuestion = {
  name: "plugin-name",
  type: "input",
  message: "Plugin name:",
  validate: function (input) {
    if (/^([A-Za-z\_\-])+$/.test(input)) return true;
    else return "Plugin name may include only letters";
  },
};

const versionQuestion = {
  name: "plugin-version",
  type: "input",
  message: "Plugin version:",
  validate: function (input) {
    if (/[0-9]*\.?[0-9]*/.test(input)) return true;
    else return "Plugin version may include only numbers";
  },
};

const authorQuestion = {
  name: "plugin-author",
  type: "input",
  message: "Plugin author:",
};

const descriptionQuestion = {
  name: "plugin-description",
  type: "input",
  message: "Plugin description:",
};

const licenseQuestion = {
  name: "plugin-license",
  type: "input",
  message: "Plugin license:",
};

const scopes = [
  { name: "API", value: "API" },
  { name: "Settings", value: "Settings" },
  { name: "Context menu", value: "ContextMenu" },
];

const scopesQuestion = {
  name: "plugin-scopes",
  type: "checkbox",
  message: "Select scopes (Press <space> to select, Enter when finished):",
  choices: scopes,
};

const QUESTIONS = [
  nameQuestion,
  versionQuestion,
  authorQuestion,
  descriptionQuestion,
  licenseQuestion,
  scopesQuestion,
];

export default QUESTIONS;
