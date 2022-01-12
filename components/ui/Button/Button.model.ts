interface ButtonNormalProps {
  fontSize?: "SMALL" | "MEDIUM" | "LARGE";
  uppercase?: boolean;
  onClick: (e: Event) => void;
  disabled?: boolean;
  id: string;
  isFetchToBlock?: boolean;
  isActive?: boolean;
  type?: "button" | "submit";
  color?:
    | "PRIMARY"
    | "PRIMARY_DARK"
    | "SECOND"
    | "SECOND_DARK"
    | "RED"
    | "RED_DARK"
    | "GREEN"
    | "GREEN_DARK"
    | "GREY"
    | "GREY_DARK"
    | "GREY_LIGHT";
  colorHover?:
    | "PRIMARY"
    | "PRIMARY_DARK"
    | "SECOND"
    | "SECOND_DARK"
    | "RED"
    | "RED_DARK"
    | "GREEN"
    | "GREEN_DARK"
    | "GREY"
    | "GREY_DARK"
    | "GREY_LIGHT";
  colorActive?:
    | "PRIMARY"
    | "PRIMARY_DARK"
    | "SECOND"
    | "SECOND_DARK"
    | "RED"
    | "RED_DARK"
    | "GREEN"
    | "GREEN_DARK"
    | "GREY"
    | "GREY_DARK"
    | "GREY_LIGHT";
}

interface idElementButtonInterface {
  id: string;
}

interface typeElementInterface {
  type: string;
}

export type {
  ButtonNormalProps,
  idElementButtonInterface,
  typeElementInterface,
};
