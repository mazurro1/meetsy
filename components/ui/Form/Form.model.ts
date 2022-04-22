export interface FormElementsOnSubmit {
  value: string | number | boolean;
  placeholder: string;
}

interface ValidationItemProps {
  placeholder: string;
  minLength?: number;
  maxLength?: number;
  isEmail?: boolean;
  isString?: boolean;
  isNumber?: boolean;
  minNumber?: number;
  maxNumber?: number;
}

export interface FormProps {
  onSubmit: (values: FormElementsOnSubmit[], isValid: boolean) => void;
  onChange?: () => void;
  buttonColor?: "PRIMARY" | "SECOND" | "RED" | "GREEN" | "GREY";
  id: string;
  buttonText: string;
  marginTop?: number;
  marginBottom?: number;
  validation?: ValidationItemProps[];
  extraButtons?: any;
  isFetchToBlock?: boolean;
  disabled?: boolean;
  disabledTooltip?: string;
  refProp?: React.RefObject<HTMLFormElement>;
  isNewIcon?: boolean;
  buttonsInColumn?: boolean;
  buttonsFullWidth?: boolean;
}
