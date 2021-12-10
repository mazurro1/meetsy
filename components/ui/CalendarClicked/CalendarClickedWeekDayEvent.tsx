import type { NextPage } from "next";
import { ActiveItemStyle } from "./CalendarClicked.style";
import type {
  EventsActiveProps,
  ArrayHoursProps,
} from "./CalendarClicked.model";

interface CalendarClickedWeekDayEventProps {
  activeEvent: EventsActiveProps;
  filterAllHours: ArrayHoursProps[];
  minutesInHour: number;
  heightMinutes: number;
}

const CalendarClickedWeekDayEvent: NextPage<CalendarClickedWeekDayEventProps> =
  ({ activeEvent, filterAllHours, minutesInHour, heightMinutes }) => {
    let elementHourIndex: number = 0;
    const selectHourOfEvent: number = activeEvent.minDate.getHours();
    const selectMinutesOfEvent: number = activeEvent.minDate.getMinutes();
    const validHourEvent: string = `${selectHourOfEvent}:00`;
    filterAllHours.forEach((itemAllHour, indexAllHour) => {
      if (itemAllHour.hour === validHourEvent) {
        elementHourIndex = indexAllHour + 1;
      }
    });

    const timeMinutesSummary: number =
      (activeEvent.maxDate.getTime() - activeEvent.minDate.getTime()) /
      60 /
      1000;
    const heightEvent: number =
      (timeMinutesSummary / minutesInHour) * heightMinutes;
    const heightCountMinutes: number = 60 / minutesInHour;
    const countBorder: number = 2 * elementHourIndex;
    const minusMinutes: number =
      ((60 - selectMinutesOfEvent) / minutesInHour) * heightMinutes;
    const heightItemNameHour: number =
      1 +
      heightCountMinutes * heightMinutes * elementHourIndex +
      countBorder -
      minusMinutes;

    return (
      <ActiveItemStyle
        top={heightItemNameHour}
        itemsBetween={0}
        height={heightEvent}
        margin={4}
      >
        {activeEvent.text}
      </ActiveItemStyle>
    );
  };
export default CalendarClickedWeekDayEvent;
