import type { NextPage } from "next";
import { ActiveItemStyle } from "./CalendarClicked.style";
import type {
  EventsActiveProps,
  ArrayHoursProps,
  CountsFilterEvents,
} from "./CalendarClicked.model";
import { Colors, ColorsInterface } from "@constants";
import { withSiteProps } from "@hooks";
import type { ISiteProps } from "@hooks";
import { Tooltip } from "@ui";

interface CalendarClickedWeekDayEventProps {
  activeEvent: EventsActiveProps;
  filterAllHours: ArrayHoursProps[];
  minutesInHour: number;
  heightMinutes: number;
  filterEventsActive: EventsActiveProps[];
  dragActive: boolean;
  selectItemCountWhenIsItem: CountsFilterEvents | undefined;
}

const CalendarClickedWeekDayEvent: NextPage<
  CalendarClickedWeekDayEventProps & ISiteProps
> = ({
  activeEvent,
  filterAllHours,
  minutesInHour,
  heightMinutes,
  siteProps,
  // filterEventsActive,
  dragActive,
  selectItemCountWhenIsItem,
}) => {
  const sitePropsColors: ColorsInterface = {
    blind: siteProps.blind,
    dark: siteProps.dark,
  };

  let colorBackground: string = "";

  switch (activeEvent.color) {
    case "PRIMARY": {
      colorBackground = Colors(sitePropsColors).primaryColor;
      break;
    }
    case "PRIMARY_DARK": {
      colorBackground = Colors(sitePropsColors).primaryColorDark;
      break;
    }
    case "SECOND": {
      colorBackground = Colors(sitePropsColors).secondColor;
      break;
    }
    case "SECOND_DARK": {
      colorBackground = Colors(sitePropsColors).secondColorDark;
      break;
    }
    case "RED": {
      colorBackground = Colors(sitePropsColors).dangerColor;
      break;
    }
    case "RED_DARK": {
      colorBackground = Colors(sitePropsColors).dangerColorDark;
      break;
    }
    case "GREEN": {
      colorBackground = Colors(sitePropsColors).successColor;
      break;
    }
    case "GREEN_DARK": {
      colorBackground = Colors(sitePropsColors).successColorDark;
      break;
    }
    case "GREY": {
      colorBackground = Colors(sitePropsColors).greyColor;
      break;
    }
    case "GREY_DARK": {
      colorBackground = Colors(sitePropsColors).greyColorDark;
      break;
    }
    case "GREY_LIGHT": {
      colorBackground = Colors(sitePropsColors).greyColorLight;
      break;
    }

    default: {
      colorBackground = Colors(sitePropsColors).primaryColor;
      break;
    }
  }

  let countSelectedItemWithId = 0;
  let indexSelectedItemId = 0;

  if (!!selectItemCountWhenIsItem) {
    selectItemCountWhenIsItem.itemsId.forEach(
      (itemIdSelected, indexItemIdSelected) => {
        countSelectedItemWithId = countSelectedItemWithId + 1;
        if (itemIdSelected === activeEvent.id) {
          indexSelectedItemId = indexItemIdSelected;
        }
      }
    );
  }

  let elementHourIndex: number = 0;
  const selectHourOfEvent: number = activeEvent.minDate.getHours();
  const selectMinutesOfEvent: number = activeEvent.minDate.getMinutes();
  const validHourEvent: string = `${selectHourOfEvent}:00`;
  filterAllHours.forEach((itemAllHour, indexAllHour) => {
    if (itemAllHour.hour === validHourEvent) {
      elementHourIndex = indexAllHour + 1;
    }
  });
  const corectMinusFromMinutesInHour =
    minutesInHour === 5
      ? -2
      : minutesInHour === 10
      ? -5
      : minutesInHour === 15
      ? -6
      : -6;
  const timeMinutesSummary: number =
    (activeEvent.maxDate.getTime() - activeEvent.minDate.getTime()) / 60 / 1000;
  const heightCountMinutes: number = 60 / minutesInHour;
  const countBorder: number = 2 * elementHourIndex;
  const minusMinutes: number =
    ((60 - selectMinutesOfEvent) / minutesInHour) * heightMinutes;
  const heightItemNameHour: number =
    heightCountMinutes * heightMinutes * elementHourIndex +
    countBorder -
    minusMinutes -
    2;
  // corectMinusFromMinutesInHour;

  console.log(timeMinutesSummary);
  const heightEvent: number =
    (timeMinutesSummary / minutesInHour) * heightMinutes + countBorder;

  return (
    <Tooltip text={activeEvent.tooltip}>
      <ActiveItemStyle
        top={heightItemNameHour}
        itemsBetweenMote2={countSelectedItemWithId > 1}
        left={indexSelectedItemId > 0 ? indexSelectedItemId * (20 + 4) : 0}
        height={heightEvent}
        margin={4}
        colorBackground={colorBackground}
        dragActive={dragActive}
      >
        {activeEvent.text}
      </ActiveItemStyle>
    </Tooltip>
  );
};
export default withSiteProps(CalendarClickedWeekDayEvent);
