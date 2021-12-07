export interface PopupProps {
  popupEnable: boolean;
  handleClose: () => void;
  maxWidth?: number;
  noContent?: boolean;
  fullScreen?: boolean;
  title: string;
  effect?: "popup" | "opacity";
  secondColors?: boolean;
  position?: "absolute" | "fixed";
  closeTitle?: boolean;
  backgroundBorderRadius?: boolean;
  smallTitle?: boolean;
  overflowComponent?: boolean;
  maxHeight?: boolean;
  clickedBackgroundToClose?: boolean;
  heightFull?: boolean;
  top?: string;
  bottom?: string;
  lightBackground?: boolean;
  unmountOnExit?: boolean;
  color?: "PRIMARY" | "SECOND" | "RED" | "GREEN" | "GREY";
}
