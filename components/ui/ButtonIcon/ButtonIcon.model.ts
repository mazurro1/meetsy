interface ButtonIconProps {
  fontSize?: "SMALL" | "MEDIUM" | "LARGE";
  uppercase?: boolean;
  onClick: (e: React.MouseEvent<HTMLElement>) => void;
  disabled?: boolean;
  id: string;
  isFetchToBlock?: boolean;
  isActive?: boolean;
  type?: "button" | "submit";
  color?: "PRIMARY" | "SECOND" | "RED" | "GREEN" | "GREY" | "GREY_LIGHT";
  iconPadding?: number;
  minHeight?: number;
  capitalize?: boolean;
  widthFull?: boolean;
}

interface idElementButtonInterface {
  id: string;
}

interface typeElementInterface {
  type: string;
}

export type { ButtonIconProps, idElementButtonInterface, typeElementInterface };
