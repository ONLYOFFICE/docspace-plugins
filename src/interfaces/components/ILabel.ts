export interface ILabel {
  isRequired?: boolean;
  error?: boolean;
  isInline?: boolean;
  title?: string;
  text: string;
  truncate?: boolean;
  htmlFor?: string;
  display?: string;
}
