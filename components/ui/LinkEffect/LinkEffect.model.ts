export interface LinkProps {
  path: string;
  bold?: boolean;
  spanBold?: boolean;
  marginTop?: number;
  marginBottom?: number;
  query?: any;
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
  replace?: boolean;
  fontSize?: "SMALL" | "MEDIUM" | "LARGE";
  inNewWindow?: boolean;
  enableLoader?: boolean;
}
