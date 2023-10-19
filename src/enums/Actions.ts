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

export const enum Actions {
  updateProps = "update-props",
  updateContext = "update-context",

  updateStatus = "update-status",

  updateContextMenuItems = "update-context-menu-items",
  updateInfoPanelItems = "update-info-panel-items",
  updateMainButtonItems = "update-main-button-items",
  updateProfileMenuItems = "update-profile-menu-items",
  updateFileItems = "update-file-items",
  updateEventListenerItems = "update-event-listener-items",

  showToast = "show-toast",

  // showSettingsModal = "show-settings-modal",
  // closeSettingsModal = "close-settings-modal",

  showCreateDialogModal = "show-create-dialog-modal",

  showModal = "show-modal",
  closeModal = "close-modal",

  sendPostMessage = "send-post-message",
}
