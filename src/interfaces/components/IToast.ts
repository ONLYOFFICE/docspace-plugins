export const enum ToastType {
  success = "success",
  error = "error",
  warning = "warning",
  info = "info",
}

export interface IToast {
  type?: ToastType;
  title?: string;
  withCross?: boolean;
  timeout?: number;
}
