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

export interface DisabledDayProps {
  from: Date;
  to: Date;
}

export interface ConstOpeningDaysProps {
  weekId: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  from: Date;
  to: Date;
}

export interface OpeningDaysProps {
  fullDate: string;
  from: Date;
  to: Date;
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
  events: EventsActiveProps[];
  minDate?: Date;
  maxDate?: Date;
  disabledDays?: DisabledDayProps[];
  constOpeningDays?: ConstOpeningDaysProps[];
  openingDays?: OpeningDaysProps[];
  daysToShow?: 1 | 7;
  actualDate?: string;
}

export interface CalendarClickedWeekDayEventProps {
  activeEvent: EventsActiveProps;
  filterAllHours: ArrayHoursProps[];
  minutesInHour: number;
  heightMinutes: number;
  dragActive: boolean;
  selectItemCountWhenIsItem: CountsFilterEvents | undefined;
  handleClickEvent: (e: React.MouseEvent<HTMLElement>, eventId: string) => void;
  selectedItemsLength: number;
  widthOneEvent: number;
}

export interface CalendarClickedWeekDayItemMinuteProps {
  itemMinute: ItemMinuteProps;
  dragActive: boolean;
  hour: string;
  fullDate: string;
  handleAddItem: (item: SelectedItemProps) => void;
  selectedItems: SelectedItemProps[];
  lastElementSelectedItems: SelectedItemProps | null;
  firstElementSelectedItems: SelectedItemProps | null;
  heightMinutes: number;
  colorDrag: string;
  minDate?: Date;
  maxDate?: Date;
  colorDisabledMinMaxDate: string;
  disabledDays?: DisabledDayProps[];
  constOpeningDays?: ConstOpeningDaysProps | null;
  openingDays?: OpeningDaysProps[];
  colorOpening: string;
}

export interface CalendarClickedWeekDayProps {
  date: Date;
  name: string;
  colorBackground: string;
  filterAllHours: ArrayHoursProps[];
  minutesInHour: number;
  heightMinutes: number;
  handleAddActiveItem: (item: EventsActiveProps) => void;
  colorDrag: string;
  borderColor: string;
  borderColorLight: string;
  eventsActive: EventsActiveProps[];
  indexItemDay: number;
  handleClickEvent: (e: React.MouseEvent<HTMLElement>, eventId: string) => void;
  itemsOfMinutes: ItemMinuteProps[];
  backgroundCountEvents: string;
  colorCountEvents: string;
  minHour: number;
  handleAddEvent: (fullDate: string) => void;
  minDate?: Date;
  maxDate?: Date;
  colorDisabledMinMaxDate: string;
  disabledDays?: DisabledDayProps[];
  constOpeningDays?: ConstOpeningDaysProps[];
  openingDays?: OpeningDaysProps[];
  colorOpening: string;
  daysToShow: 1 | 7;
  clientWidthCalendar: number;
}

export interface CalendarClickedWeekDayItemProps {
  itemHour: ArrayHoursProps;
  dragActive: boolean;
  fullDate: string;
  handleAddItem: (item: SelectedItemProps) => void;
  selectedItems: SelectedItemProps[];
  indexItemHour: number;
  lastElementSelectedItems: SelectedItemProps | null;
  firstElementSelectedItems: SelectedItemProps | null;
  heightMinutes: number;
  colorDrag: string;
  borderColor: string;
  itemsOfMinutes: ItemMinuteProps[];
  minDate?: Date;
  maxDate?: Date;
  colorDisabledMinMaxDate: string;
  disabledDays?: DisabledDayProps[];
  constOpeningDays?: ConstOpeningDaysProps | undefined;
  openingDays?: OpeningDaysProps[];
  colorOpening: string;
}
