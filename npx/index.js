#!/usr/bin/env node

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

import inquirer from "inquirer";
import * as fs from "fs";
import * as path from "path";
import * as cp from "child_process";
import { fileURLToPath } from "url";

import createTemplate from "./createTemplate.js";
import QUESTIONS from "./dialog.js";

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

const CURR_DIR = process.cwd();
const TEMPLATE_PATH = path.join(__dirname, "../template");

inquirer.prompt(QUESTIONS).then((answers) => {
  const name = answers["plugin-name"];
  const version = answers["plugin-version"];
  const author = answers["plugin-author"];
  const logo = answers["plugin-logo"];
  const description = answers["plugin-description"];
  const license = answers["plugin-license"];
  const homepage = answers["plugin-homepage"];
  const scopes = answers["plugin-scopes"];

  const splitName = name.replaceAll("-", "").replaceAll("_", "").split("");

  splitName[0] = splitName[0].toUpperCase();

  const pluginName = splitName.join("");

  fs.mkdirSync(`${CURR_DIR}/${name}`);

  console.log(`Cloning plugin template`);

  createTemplate(
    TEMPLATE_PATH,
    name,
    pluginName,
    version,
    author,
    logo,
    description,
    license,
    homepage,
    scopes
  ).then(() => {
    console.log("Installing dependencies...");
    process.chdir(name);
    cp.exec(`yarn`);
    cp.exec(`yarn format`);
  });
});
