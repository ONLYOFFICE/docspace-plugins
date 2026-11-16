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

/*
 * A `.module.css` import has no types of its own, so `import styles from "./Page.module.css"`
 * fails the type check even though Vite resolves it - and the failure looks like a broken
 * import rather than a missing declaration. Vite's own client types declare this; a plugin
 * does not pull them in, so the declaration lives here.
 *
 * Plain `.css` imports are side-effect only (`import "./plugin.css"`) and need no type.
 */

declare module "*.module.css" {
  const classes: { readonly [key: string]: string };
  export default classes;
}
