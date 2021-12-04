interface ButtonIconProps {
  fontSize?: "SMALL" | "MEDIUM" | "LARGE";
  uppercase?: boolean;
  onClick: () => void;
  iconName?: string;
  disabled?: boolean;
  id: string;
  isFetchToBlock?: boolean;
  isActive?: boolean;
  isButton?: boolean;
  type?: "button" | "submit";
  color?: "PRIMARY" | "SECOND" | "RED" | "GREEN" | "GREY";
}

interface idElementButtonInterface {
  id: string;
}

interface typeElementInterface {
  type: string;
}

export type { ButtonIconProps, idElementButtonInterface, typeElementInterface };
