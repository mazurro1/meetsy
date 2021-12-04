export interface ParagraphProps {
  tag?: 1 | 2 | 3 | 4 | 5;
  marginTop?: number;
  marginBottom?: number;
  color?:
    | "BLACK"
    | "WHITE"
    | "BLACK_ONLY"
    | "WHITE_ONLY"
    | "PRIMARY"
    | "SECOND"
    | "RED"
    | "GREEN"
    | "GREY";
  spanColor?:
    | "BLACK"
    | "WHITE"
    | "BLACK_ONLY"
    | "WHITE_ONLY"
    | "PRIMARY"
    | "SECOND"
    | "RED"
    | "GREEN"
    | "GREY";
  uppercase?: boolean;
  underline?: boolean;
  letterSpacing?: number;
  bold?: boolean;
  spanBold?: boolean;
}
