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

const vi: TStrings = {
  "file.typeName": "Thư email",
  "header.from": "Từ",
  "header.to": "Đến",
  "header.cc": "Cc",
  "header.bcc": "Bcc",
  "header.date": "Ngày",
  "subject.empty": "(không có chủ đề)",
  "body.empty": "Thư này không có nội dung văn bản.",
  "body.title": "Nội dung thư",
  "attachments.title": "Tệp đính kèm ({count})",
  "attachments.save": "Lưu vào thư mục này",
  "attachments.saveAll": "Lưu tất cả",
  "images.blocked": "Hình ảnh từ xa đã bị chặn để bảo vệ quyền riêng tư của bạn.",
  "images.load": "Tải hình ảnh",
  "images.hide": "Ẩn hình ảnh",
  "toast.saved": "Đã lưu {name} vào thư mục hiện tại",
  "toast.savedAll": "Đã lưu {count} tệp đính kèm vào thư mục hiện tại",
  "toast.saveFailed": "Không thể lưu {name}",
  "toast.saveFailedSome": "Không thể lưu {failed}/{total} tệp đính kèm",
  "state.loading": "Đang tải thư…",
  "state.empty": "Tệp này trống.",
  "state.loadFailed": "Không thể tải tệp.",
  "state.parseFailed": "Không thể đọc thư này. Tệp có thể bị hỏng hoặc không phải là email.",
  "state.noFile": "Chưa chọn tệp nào.",
};

export default vi;
