interface ButtonIconProps {
  fontSize?: "SMALL" | "MEDIUM" | "LARGE";
  uppercase?: boolean;
  onClick: (e: Event) => void;
  disabled?: boolean;
  id: string;
  isFetchToBlock?: boolean;
  isActive?: boolean;
  type?: "button" | "submit";
  color?: "PRIMARY" | "SECOND" | "RED" | "GREEN" | "GREY";
  iconPadding?: number;
}

interface idElementButtonInterface {
  id: string;
}

interface typeElementInterface {
  type: string;
}

export type { ButtonIconProps, idElementButtonInterface, typeElementInterface };
