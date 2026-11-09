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

const koKR: TStrings = {
  "file.typeName": "이메일 메시지",
  "header.from": "보낸 사람",
  "header.to": "받는 사람",
  "header.cc": "참조",
  "header.bcc": "숨은 참조",
  "header.date": "날짜",
  "subject.empty": "(제목 없음)",
  "body.empty": "이 메시지에는 본문이 없습니다.",
  "body.title": "메시지 본문",
  "attachments.title": "첨부 파일 ({count})",
  "attachments.save": "이 폴더에 저장",
  "attachments.saveAll": "모두 저장",
  "images.blocked": "개인 정보 보호를 위해 외부 이미지가 차단되었습니다.",
  "images.load": "이미지 불러오기",
  "images.hide": "이미지 숨기기",
  "toast.saved": "{name} 파일을 현재 폴더에 저장했습니다",
  "toast.savedAll": "첨부 파일 {count}개를 현재 폴더에 저장했습니다",
  "toast.saveFailed": "{name} 파일을 저장하지 못했습니다",
  "toast.saveFailedSome": "첨부 파일 {total}개 중 {failed}개를 저장하지 못했습니다",
  "state.loading": "메시지를 불러오는 중…",
  "state.empty": "이 파일은 비어 있습니다.",
  "state.loadFailed": "파일을 불러오지 못했습니다.",
  "state.parseFailed":
    "이 메시지를 읽을 수 없습니다. 파일이 손상되었거나 이메일이 아닐 수 있습니다.",
  "state.noFile": "선택된 파일이 없습니다.",
};

export default koKR;
