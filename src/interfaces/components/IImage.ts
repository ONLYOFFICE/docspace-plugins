export interface IImage {
  src: string;
  alt: string;
  width?: string;
  height?: string;
  name?: string;
  id?: string;
  style?: { [key: string]: string };
}
