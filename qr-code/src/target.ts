/**
 * A context menu click only hands `onItemClick` the clicked entity's id — the
 * modal it opens gets no current file at all (react.md - what useCurrentFile
 * returns where). So the id, and which link endpoint it needs, is captured
 * here right before the modal is requested and read back once inside it.
 */
export type TTargetKind = "file" | "folder";

export type TTarget = {
  id: string | number;
  kind: TTargetKind;
};

let target: TTarget | null = null;

export const setTarget = (next: TTarget): void => {
  target = next;
};

export const getTarget = (): TTarget | null => target;
