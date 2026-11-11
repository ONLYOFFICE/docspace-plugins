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

import type { CSSProperties, ReactNode } from "react";

import { CloseButton } from "./CloseButton";
import { useChromeless } from "./useChromeless";
import styles from "./viewer.module.css";

const centered: CSSProperties = {
  flex: "1 1 auto",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: 16,
  textAlign: "center",
};

/** A state with no toolbar yet still needs the way out on a phone. */
export function StateMessage({ children }: { children: ReactNode }) {
  const chromeless = useChromeless();
  return (
    <>
      {chromeless && (
        <div className={styles.closeBar}>
          <CloseButton />
        </div>
      )}
      <div style={centered}>{children}</div>
    </>
  );
}
