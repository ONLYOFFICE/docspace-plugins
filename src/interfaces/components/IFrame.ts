export interface IFrame {
  src: string;
  width?: string;
  height?: string;
  name?: string;
  sandbox?: string;
  id?: string;
  style?: { [key: string]: string };
}
