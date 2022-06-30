export interface AccordingProps {
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
  title: string;
  marginTop?: number;
  marginBottom?: number;
  handleDelete?: (id: string) => void;
  handleEdit?: (id: string) => void;
  handleAdd?: (id: string) => void;
  id: string;
  defaultIsOpen?: boolean;
  width?: string;
  active?: boolean | null;
  setActive?: (value: boolean) => void;
}
