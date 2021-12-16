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

export interface CountsFilterEvents {
  maxDate: Date;
  minDate: Date;
  itemsId: string[];
}

export interface ItemMinuteProps {
  index: number;
  minMinute: number;
  maxMinute: number;
}

export interface CalendarProps {
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
  minHour: number;
  maxHour: number;
  minutesInHour: 5 | 10 | 15 | 30;
  heightMinutes?: 5 | 10 | 15 | 30;
}
