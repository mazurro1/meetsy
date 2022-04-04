export interface AccordingItemProps {
  color?: "DEFAULT" | "PRIMARY" | "SECOND" | "RED" | "GREEN" | "GREY";
  handleDelete?: (id: string) => void;
  handleEdit?: (id: string) => void;
  id: string;
  index: number;
  userSelect?: boolean;
}
