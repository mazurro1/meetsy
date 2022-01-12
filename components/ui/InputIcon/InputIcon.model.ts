export interface InputIconProps {
  placeholder: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: "text" | "number" | "password" | "email";
  required?: boolean;
  validText?: string;
  refInput?: React.RefAttributes<HTMLInputElement> | null;
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
}

export interface ValueInputValidProps {
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}
