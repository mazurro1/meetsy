export interface optionPInterface {
  label: string;
  value: string;
}

export interface SelectCreatedProps {
  options: optionPInterface[];
  isMulti?: boolean;
  maxMenuHeight?: number;
  closeMenuOnSelect?: boolean;
  placeholder?: string;
  isClearable?: boolean;
  defaultMenuIsOpen?: boolean;
  isDisabled?: boolean;
  value: any;
  handleChange: Function;
  width?: number;
  darkSelect?: boolean;
  onlyText?: boolean;
  deleteItem?: boolean;
  deleteLastItem?: boolean;
  textUp?: boolean;
  top?: boolean;
  color?: "PRIMARY" | "SECOND" | "RED" | "GREEN" | "GREY";
}
