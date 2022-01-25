export interface DisabledDayProps {
  from: Date;
  to: Date;
}

export interface CalendarProps {
  color?: "PRIMARY" | "SECOND" | "RED" | "GREEN" | "GREY";
  actualDate?: string | null;
  handleChangeDay?: (day: string) => void;
  minDate?: Date;
  maxDate?: Date;
  disabledDays?: DisabledDayProps[];
  id: string;
}
