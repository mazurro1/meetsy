export interface AElementProps {
  tag?: 1 | 2 | 3 | 4 | 5;
  marginTop?: number;
  marginBottom?: number;
  color?:
    | "BLACK"
    | "WHITE"
    | "BLACK_ONLY"
    | "WHITE_ONLY"
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

  spanColor?:
    | "BLACK"
    | "WHITE"
    | "BLACK_ONLY"
    | "WHITE_ONLY"
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

  uppercase?: boolean;
  underline?: boolean;
  letterSpacing?: number;
  bold?: boolean;
  spanBold?: boolean;
  fontSize?: "SMALL" | "MEDIUM" | "LARGE";
  target?: "__self" | "__blank";
  path?: string;
}
