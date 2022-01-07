export interface CalendarProps {
  color?: "PRIMARY" | "SECOND" | "RED" | "GREEN" | "GREY";
  actualDate?: string | null;
  handleChangeDay?: (day: string) => void;
}
