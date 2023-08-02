export interface ILabel {
  text: string;
  isRequired?: boolean;
  error?: boolean;
  isInline?: boolean;
  title?: string;
  truncate?: boolean;
  htmlFor?: string;
  display?: string;
}
