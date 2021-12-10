export interface ArrayHoursProps {
  index: number;
  hour: string;
}

export interface SelectedItemProps {
  hour: string;
  fullDate: string;
  minMinute: number;
  maxMinute: number;
  validDateMin: Date;
  validDateMax: Date;
}

export interface EventsActiveProps {
  minDate: Date;
  maxDate: Date;
  id: string;
  tooltip: string;
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
  text: string;
}
