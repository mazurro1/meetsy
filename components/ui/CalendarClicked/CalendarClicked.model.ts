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

export interface ItemActiveProps {
  minDate: Date;
  maxDate: Date;
}
