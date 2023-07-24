import { IComponent } from "./IComponent";

export interface IBorderProp {
  color: string;
  radius: string;
  style: string;
  width: string;
}

export interface IBox {
  widthProp?: string;
  paddingProp?: string;
  displayProp?: string;
  flexDirection?: string;
  alignItems?: string;
  borderProp?: string | IBorderProp;
  alignContent?: string;
  alignSelf?: string;
  backgroundProp?: string;
  flexBasis?: string;
  flexProp?: string;
  flexWrap?: string;
  gridArea?: string;
  heightProp?: string;
  justifyContent?: string;
  justifyItems?: string;
  justifySelf?: string;
  marginProp?: string;
  overflowProp?: string;
  textAlign?: string;
  children?: IComponent[];
}
