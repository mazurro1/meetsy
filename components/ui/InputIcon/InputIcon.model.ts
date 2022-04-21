export interface InputIconProps {
  id: string;
  placeholder: string;
  value?: string;
  defaultValue?: string;
  onChange?: (text: string) => void;
  type?: "text" | "number" | "password" | "email";
  required?: boolean;
  validText?: string;
  refInput?: React.RefAttributes<HTMLInputElement> | null;
  validTextGenerate?:
    | "MIN_3"
    | "MIN_5"
    | "MIN_9"
    | "MIN_10"
    | "NO_REQUIRED"
    | "OPTIONAL"
    | "";
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
  colorDefault?:
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
  autoComplite?:
    | "hidden"
    | "text"
    | "search"
    | "url"
    | "tel"
    | "email"
    | "date"
    | "month"
    | "week"
    | "time"
    | "number"
    | "password";
  uppercase?: boolean;
  capitalize?: boolean;
}

export interface ValueInputValidProps {
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}
