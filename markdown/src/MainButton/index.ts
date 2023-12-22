import { Actions, IMainButtonItem, IMessage } from "@onlyoffice/docspace-plugin-sdk";
import markdownIt from "../Markdownit";

const mainButtonItem: IMainButtonItem = {
    key: "markdown-it-main-button-item",
    label: "Markdown",
    icon: "markdown.svg",
    onClick: (id: number) => {
      markdownIt.setCurrentFolderId(id);
  
      const message: IMessage = {
        actions: [Actions.showCreateDialogModal],
        createDialogProps: {
          title: "Create markdown",
          startValue: "New markdown",
          visible: true,
          isCreateDialog: true,
          extension: ".md",
          onSave: async (e: any, value: string) => {
            await markdownIt.createNewFile(value);
          },
          onCancel: (e: any) => {
            markdownIt.setCurrentFolderId(null);
          },
          onClose: (e: any) => {
            markdownIt.setCurrentFolderId(null);
          },
        },
      };
  
      return message;
    },
  };
  
  export { mainButtonItem };