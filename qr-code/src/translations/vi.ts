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
  "contextMenu.label": "Lấy mã QR",
  "infoPanel.tabName": "Mã QR",
  "modal.header": "Mã QR của liên kết được chia sẻ",
  "hint.header": "Mã QR mở liên kết được chia sẻ",
  "hint.body":
    "Hướng camera điện thoại vào mã để mở mục này. Bạn có thể thiết lập ai được mở liên kết, quyền truy cập, thời hạn và mật khẩu trong tab “{tab}”.",
  "hint.emptyBody":
    "Mục này chưa có liên kết được chia sẻ. Hãy tạo liên kết trong tab “{tab}”, nơi bạn cũng có thể chọn ai được mở liên kết, quyền, thời hạn và mật khẩu.",
  "hint.shareTab": "Chia sẻ",
  "hint.membersTab": "Liên lạc",
  "error.header": "Không thể tải liên kết",
  "error.body":
    "Máy chủ không phản hồi hoặc trả về lỗi. Đây thường là sự cố kết nối tạm thời, vì vậy “Thử lại” sẽ yêu cầu liên kết thêm một lần nữa. Nếu lỗi vẫn tiếp diễn, bạn cũng có thể tìm liên kết trong tab “{tab}”.",
  "modal.retry": "Thử lại",
  "modal.unsupportedRoom":
    "Loại phòng này không có liên kết công khai cấp phòng. Chỉ phòng công cộng, phòng tùy chỉnh và không gian điền biểu mẫu mới có.",
  "modal.copy": "Sao chép liên kết",
  "modal.copied": "Đã sao chép liên kết vào bộ nhớ tạm",
  "modal.copyFailed": "Không thể sao chép liên kết",
  "modal.close": "Đóng",
  "link.create": "Tạo liên kết",
  "link.createFailed": "Không thể tạo liên kết. Hãy thử lại sau.",
  "link.anyone": "Bất kỳ ai có liên kết",
  "link.internal": "Chỉ người dùng không gian làm việc",
  "link.password": "Được bảo vệ bằng mật khẩu",
  "link.noTimeLimit": "Liên kết này không giới hạn thời gian",
  "link.validUntil": "Liên kết này có hiệu lực đến {date}",
  "link.expired": "Liên kết đã hết hạn",
  "access.read": "Chỉ đọc",
  "access.edit": "Chỉnh sửa",
  "access.review": "Đánh giá",
  "access.comment": "Nhận xét",
  "access.fillForms": "Điền vào",
  "access.customFilter": "Bộ lọc tùy chỉnh",
};

export default vi;
