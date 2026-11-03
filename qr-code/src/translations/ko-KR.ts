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
  "contextMenu.label": "QR 코드 받기",
  "infoPanel.tabName": "QR 코드",
  "modal.header": "공유 링크의 QR 코드",
  "hint.header": "QR 코드로 공유 링크가 열립니다",
  "hint.body":
    "휴대폰 카메라를 코드에 비추면 이 항목이 열립니다. 링크를 열 수 있는 사용자, 액세스 권한, 만료 기간 및 비밀번호는 “{tab}” 탭에서 설정합니다.",
  "hint.emptyBody":
    "이 항목에는 아직 공유 링크가 없습니다. “{tab}” 탭에서 링크를 만드세요. 링크를 열 수 있는 사용자, 권한, 만료 기간 및 비밀번호도 그곳에서 선택할 수 있습니다.",
  "hint.shareTab": "공유",
  "hint.membersTab": "연락처",
  "error.header": "링크를 불러올 수 없습니다",
  "error.body":
    "서버가 응답하지 않았거나 오류를 반환했습니다. 대개 일시적인 연결 문제이므로 “다시 시도해 보세요”를 누르면 링크를 다시 요청합니다. 문제가 계속되면 “{tab}” 탭에서도 링크를 확인할 수 있습니다.",
  "modal.retry": "다시 시도해 보세요",
  "modal.unsupportedRoom":
    "이 유형의 방에는 방 단위 공개 링크가 없습니다. 공개 링크는 퍼블릭 룸, 사용자 지정 방, 양식 작성 공간에만 있습니다.",
  "modal.copy": "링크 복사",
  "modal.copied": "링크가 클립보드에 복사되었습니다",
  "modal.copyFailed": "링크를 복사할 수 없습니다",
  "modal.close": "닫기",
  "link.create": "링크 생성",
  "link.createFailed": "링크를 생성할 수 없습니다. 나중에 다시 시도하세요.",
  "link.anyone": "링크를 가진 누구나",
  "link.internal": "워크스페이스 사용자만",
  "link.password": "비밀번호로 보호됨",
  "link.noTimeLimit": "이 링크는 시간 제한이 없습니다",
  "link.validUntil": "이 링크는 {date}까지 유효합니다",
  "link.expired": "링크가 만료되었습니다",
  "access.read": "읽기 전용",
  "access.edit": "편집",
  "access.review": "리뷰",
  "access.comment": "코멘트",
  "access.fillForms": "채우기",
  "access.customFilter": "사용자 지정 필터",
};

export default koKR;
