export interface ButtonPopupProps {
  color?: "PRIMARY" | "SECOND" | "RED" | "GREEN" | "GREY";
  uppercase?: boolean;
  fontSize?: "SMALL" | "MEDIUM" | "LARGE";
  disabled?: boolean;
  id: string;
  isFetchToBlock?: boolean;
  iconPadding?: number;
  title: string;
  closeTitle?: boolean;
  smallTitle?: boolean;
  position?: "absolute" | "fixed";
  popupEnable: boolean;
  handleChangePopup: () => void;
  handleClose?: () => void;
  maxWidth?: number;
  titleButton?: string;
}
