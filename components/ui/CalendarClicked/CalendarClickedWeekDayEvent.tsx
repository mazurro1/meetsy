import type { NextPage } from "next";
import {
  ActiveItemStyle,
  ActiveItemDateStyle,
  ActiveItemContent,
  PositionConetntTooltipAndtext,
} from "./CalendarClicked.style";
import type {
  EventsActiveProps,
  ArrayHoursProps,
  CountsFilterEvents,
} from "./CalendarClicked.model";
import { Colors, ColorsInterface } from "@constants";
import { withSiteProps } from "@hooks";
import type { ISiteProps } from "@hooks";
import { Paragraph } from "@ui";

interface CalendarClickedWeekDayEventProps {
  activeEvent: EventsActiveProps;
  filterAllHours: ArrayHoursProps[];
  minutesInHour: number;
  heightMinutes: number;
  dragActive: boolean;
  selectItemCountWhenIsItem: CountsFilterEvents | undefined;
  handleClickEvent: (e: React.MouseEvent<HTMLElement>, eventId: string) => void;
  selectedItemsLength: number;
}

const CalendarClickedWeekDayEvent: NextPage<
  CalendarClickedWeekDayEventProps & ISiteProps
> = ({
  activeEvent,
  filterAllHours,
  minutesInHour,
  heightMinutes,
  siteProps,
  dragActive,
  selectItemCountWhenIsItem,
  handleClickEvent,
  selectedItemsLength,
}) => {
  const minWidthAndHeightEvent: number = 25;
  const rightSpacingEvent: number = 25;
  const widthEvent: number = 145 - rightSpacingEvent;
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

  const timeMinutesSummary: number =
    (activeEvent.maxDate.getTime() - activeEvent.minDate.getTime()) / 60 / 1000;

  const mathFloorMinutesBorderCount: number = Math.floor(
    timeMinutesSummary / 60
  );

  const heightCountMinutes: number = 60 / minutesInHour;
  const countBorder: number = 2 * elementHourIndex;
  const minusMinutes: number =
    ((60 - selectMinutesOfEvent) / minutesInHour) * heightMinutes;
  const topHeightItemNameHour: number =
    heightCountMinutes * heightMinutes * elementHourIndex +
    countBorder -
    minusMinutes -
    2;

  const heightEvent: number =
    (timeMinutesSummary / minutesInHour) * heightMinutes +
    mathFloorMinutesBorderCount * 2;

  const dateStartEvent = `${activeEvent.minDate.getHours()}:${
    activeEvent.minDate.getMinutes() < 10
      ? `0${activeEvent.minDate.getMinutes()}`
      : activeEvent.minDate.getMinutes()
  }`;
  const dateEndEvent = `${activeEvent.maxDate.getHours()}:${
    activeEvent.maxDate.getMinutes() < 10
      ? `0${activeEvent.maxDate.getMinutes()}`
      : activeEvent.maxDate.getMinutes()
  }`;

  const widthOneEventItem: number = widthEvent / countSelectedItemWithId;

  const leftSpacingEvent: number =
    indexSelectedItemId > 0
      ? widthOneEventItem > minWidthAndHeightEvent
        ? widthOneEventItem * indexSelectedItemId
        : indexSelectedItemId * (20 + 4)
      : 0;

  const paddingEvents: string =
    indexSelectedItemId > 0
      ? widthOneEventItem > minWidthAndHeightEvent
        ? "2px 0"
        : "2px 0"
      : "4px 5px";

  return (
    <ActiveItemStyle
      top={topHeightItemNameHour}
      itemsBetweenMote2={countSelectedItemWithId > 1}
      left={leftSpacingEvent}
      height={heightEvent}
      margin={4}
      colorBackground={colorBackground}
      dragActive={dragActive}
      onClick={(e) => handleClickEvent(e, activeEvent.id)}
      widthEvent={widthEvent}
      allItemsRowLength={countSelectedItemWithId}
      minWidthAndHeightEvent={minWidthAndHeightEvent}
      paddingEvents={paddingEvents}
      selectedItemsLength={selectedItemsLength}
    >
      <PositionConetntTooltipAndtext>
        <div id="eventTooltip">
          <Paragraph color="WHITE" marginTop={0} marginBottom={0}>
            {dateStartEvent} - {dateEndEvent}
          </Paragraph>
          <Paragraph color="WHITE" marginTop={0} marginBottom={0}>
            {activeEvent.tooltip}
          </Paragraph>
        </div>
      </PositionConetntTooltipAndtext>
      <PositionConetntTooltipAndtext>
        <ActiveItemDateStyle isMultiEvents={countSelectedItemWithId > 1}>
          <Paragraph color="WHITE" marginTop={0} marginBottom={0}>
            {dateStartEvent} - {dateEndEvent}
          </Paragraph>
        </ActiveItemDateStyle>
      </PositionConetntTooltipAndtext>
      <ActiveItemContent>
        {countSelectedItemWithId === 1 && (
          <Paragraph color="WHITE" marginTop={0} marginBottom={0}>
            {activeEvent.text}
          </Paragraph>
        )}
      </ActiveItemContent>
    </ActiveItemStyle>
  );
};
export default withSiteProps(CalendarClickedWeekDayEvent);
