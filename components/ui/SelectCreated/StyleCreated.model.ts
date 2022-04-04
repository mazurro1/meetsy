export interface SelectCreatedValuesProps {
  label: string;
  value: number | string;
}

export type ValueSelectCreatedProps =
  | SelectCreatedValuesProps
  | null
  | SelectCreatedValuesProps[];

export interface SelectCreatedProps {
  options: SelectCreatedValuesProps[];
  isMulti?: boolean;
  maxMenuHeight?: number;
  closeMenuOnSelect?: boolean;
  placeholder?: string;
  isClearable?: boolean;
  defaultMenuIsOpen?: boolean;
  isDisabled?: boolean;
  value: any;
  handleChange: (values: ValueSelectCreatedProps) => void;
  width?: number;
  darkSelect?: boolean;
  onlyText?: boolean;
  deleteItem?: boolean;
  deleteLastItem?: boolean;
  textUp?: boolean;
  top?: boolean;
  color?: "PRIMARY" | "SECOND" | "RED" | "GREEN" | "GREY";
}
