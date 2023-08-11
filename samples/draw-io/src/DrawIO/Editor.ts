//@ts-nocheck
import {
  Actions,
  IMessage,
  IPostMessage,
} from "@onlyoffice/docspace-plugin-sdk";
import drawIo from "../Drawio";

function DiagramEditor(
  ui: string,
  dark: string,
  off: boolean,
  lib: boolean,
  lang: string,
  url: string,
  showSaveButton: boolean
) {
  this.ui = ui;
  this.dark = dark;
  this.off = off;
  this.lib = lib;
  this.lang = lang;
  this.url = url;
  this.showSaveButton = showSaveButton;
  this.xml = null;

  var self = this;

  this.handleMessageEvent = function (evt) {
    if (evt.origin == url && evt.data.length > 0) {
      try {
        var msg = JSON.parse(evt.data);

        if (msg != null) {
          return self.handleMessage(msg);
        }
      } catch (e) {
        console.error(e);
      }
    }
  };
}

/**
 * Starts the editor for the given data.
 */
DiagramEditor.prototype.startEditing = function (
  data: string,
  format: string,
  title: string,
  frameId: string,
  src: string
) {
  this.format = format;
  this.title = title;
  this.data = data;
  this.frameId = frameId;
  this.src = src;
};

/**
 * Returns the diagram data.
 */
DiagramEditor.prototype.getData = function () {
  return this.data;
};

/**
 * Returns the title for the editor.
 */
DiagramEditor.prototype.getTitle = function () {
  return this.title;
};

/**
 * Returns the format for the editor.
 */
DiagramEditor.prototype.getFormat = function () {
  return this.format;
};

/**
 * Returns the frameId for the editor.
 */
DiagramEditor.prototype.getFrameId = function () {
  return this.frameId;
};

/**
 * Returns the URL for the iframe.
 */
DiagramEditor.prototype.getFrameUrl = function () {
  var url = this.url;

  url += "?proto=json&spin=1&stealth=1&embed=1";

  if (this.ui != null) {
    url += "&ui=" + this.ui;
  }

  if (this.dark != null) {
    url += "&dark=" + this.dark;
  }

  if (this.off != null) {
    url += "&offline=";
    url += this.off ? "1" : "0";
  }

  if (this.lib != null) {
    url += "&libraries=";
    url += this.lib ? "1" : "0";
  }

  if (this.lang != null) {
    url += "&lang=" + this.lang;
  }

  if (!this.showSaveButton) {
    url += "&noSaveBtn=1";
    url += "&saveAndExit=0";
  }

  // if (this.src != null) {
  //   url += "?url=" + this.src;
  // }

  return url;
};

/**
 * Handles the given message.
 */
DiagramEditor.prototype.handleMessage = async function (msg) {
  switch (msg.event) {
    case "init":
      return this.initializeEditor();

    case "save":
      this.xml = msg.xml;

      if (this.format === "xml") {
        await this.save(msg.xml, false);
      } else {
        if (msg.exit) {
          this.closeAfterExport = true;
        }

        const message: IMessage = {
          actions: [Actions.sendPostMessage],
          postMessage: {
            frameId: this.frameId,
            message: {
              action: "export",
              format: this.format,
              xml: msg.xml,
              spinKey: "export",
            },
          },
        };

        return message;
      }

      const message: IMessage = {};

      if (msg.exit) {
        message.actions = [Actions.closeModal];

        drawIo.stopEditDiagram();
      } else {
        message.actions = [Actions.sendPostMessage];
        message.postMessage = {
          frameId: this.frameId,
          message: {
            action: "status",
            messageKey: "allChangesSaved",
            modified: false,
          },
        };
      }

      return message;

    case "autosave":
      this.xml = msg.xml;
      if (this.format === "xml") {
        this.save(msg.xml, true);
      } else {
        const message: IMessage = {
          actions: [Actions.sendPostMessage],
          postMessage: {
            frameId: this.frameId,
            message: {
              action: "export",
              format: this.format,
              xml: msg.xml,
              spinKey: "export",
            },
          },
        };

        return message;
      }

      const message = {};

      message.actions = [Actions.sendPostMessage];
      message.postMessage = {
        frameId: this.frameId,
        message: {
          action: "status",
          messageKey: "allChangesSaved",
          modified: false,
        },
      };

      return message;

    case "export":
      this.xml = null;

      await drawIo.saveDiagram(msg.data, false, true);

      if (this.closeAfterExport) {
        drawIo.stopEditDiagram();

        this.closeAfterExport = null;

        return { actions: [Actions.closeModal] };
      }

      const message = {};

      message.actions = [Actions.sendPostMessage];
      message.postMessage = {
        frameId: this.frameId,
        message: {
          action: "status",
          messageKey: "allChangesSaved",
          modified: false,
        },
      };

      return message;

    case "exit":
      const format = this.getFormat();

      if (format === "xmlpng") {
        const message: IMessage = {
          actions: [Actions.sendPostMessage],
          postMessage: {
            frameId: this.frameId,
            message: {
              action: "export",
              format: format,
              xml: this.xml,
              spinKey: "export",
            },
          },
        };

        this.closeAfterExport = true;

        return message;
      }

      drawIo.stopEditDiagram();
      return { actions: [Actions.closeModal] };
  }
};

/**
 * Posts load message to editor.
 */
DiagramEditor.prototype.initializeEditor = function () {
  const data = this.getData();

  const postMessage: IPostMessage = {
    frameId: this.getFrameId(),
    message: {
      action: "load",
      autosave: this.showSaveButton ? 1 : 0,
      saveAndExit: this.showSaveButton ? "1" : "0",
      modified: "unsavedChanges",
      title: "",
    },
  };

  if (data) {
    postMessage.message.xml = data;
  }

  const message: IMessage = {
    actions: [Actions.sendPostMessage],
    postMessage,
  };

  return message;
};

/**
 * Saves the given data.
 */
DiagramEditor.prototype.save = async function (data, draft) {
  await drawIo.saveDiagram(data, draft);
};

export default DiagramEditor;
