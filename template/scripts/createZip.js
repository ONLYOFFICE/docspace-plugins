/*
* (c) Copyright Ascensio System SIA 2023
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

const JSZip = require("jszip");
const fs = require("fs");

const zip = new JSZip();

const jsData = fs.readFileSync(`./dist/plugin.js`, "utf-8");
const jsonData = fs.readFileSync(`package.json`, "utf-8");

const jsonDataObj = JSON.parse(jsonData);

const docspace = {
  name: jsonDataObj.name.toLowerCase(),
  version: jsonDataObj.version || "",
  description: jsonDataObj.description || "",
  license: jsonDataObj.license || "",
  author: jsonDataObj.author || "",
  pluginName: jsonDataObj.pluginName || "",
  homePage: jsonDataObj.homepage || "",
  image: jsonDataObj.logo || "",
  scopes: jsonDataObj.scopes.join(","),
};

zip.file("plugin.js", jsData);
zip.file("config.json", JSON.stringify(docspace, null, 2));

if (fs.existsSync("./assets")) {
  const assetsFiles = fs.readdirSync("./assets");

  assetsFiles.forEach((file) => {
    const data = fs.readFileSync(`./assets/${file}`, "base64");
    zip.file(`assets/${file}`, data, { base64: true });
  });
}

zip.generateAsync({ type: "nodebuffer" }).then(function (content) {
  fs.writeFileSync("./dist/plugin.zip", content);
});
