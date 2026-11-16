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

import { Loader, LoaderTypes, Text } from "@onlyoffice/apps-ui-kit";

import { ACCENT } from "../ui/tokens";
import styles from "./viewer.module.css";

/** One centred line in place of a message: empty, failed, nothing to show. */
export function StateMessage({ text }: { text: string }) {
  return (
    <div className={styles.centered}>
      <Text fontSize="14px">{text}</Text>
    </div>
  );
}

export function StateLoading({ label }: { label: string }) {
  return (
    <div className={styles.centered}>
      <Loader type={LoaderTypes.oval} size="40px" color={ACCENT} label={label} />
    </div>
  );
}
