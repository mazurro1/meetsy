import type { NextPage } from "next";
import {
  ActiveItemStyle,
  ActiveItemDateStyle,
  ActiveItemContent,
  PositionConetntTooltipAndtext,
} from "./CalendarClicked.style";
import type { CalendarClickedWeekDayEventProps } from "./CalendarClicked.model";
import { Colors, ColorsInterface } from "@constants";
import { withSiteProps } from "@hooks";
import type { ISiteProps } from "@hooks";
import { Paragraph } from "@ui";

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
  widthOneEvent,
}) => {
  const minWidthAndHeightEvent: number = 25;
  const rightSpacingEvent: number = 25;
  const widthEvent: number = widthOneEvent - 4 - rightSpacingEvent;
  const sitePropsColors: ColorsInterface = {
    blind: siteProps.blind,
    dark: siteProps.dark,
  };

  let colorBackground: string = "";
  let borderColor: string = "";

  switch (activeEvent.color) {
    case "PRIMARY": {
      colorBackground = Colors(sitePropsColors).primaryColor;
      borderColor = Colors(sitePropsColors).primaryColorDark;
      break;
    }
    case "PRIMARY_DARK": {
      colorBackground = Colors(sitePropsColors).primaryColorDark;
      borderColor = Colors(sitePropsColors).primaryColor;
      break;
    }
    case "SECOND": {
      colorBackground = Colors(sitePropsColors).secondColor;
      borderColor = Colors(sitePropsColors).secondColorDark;
      break;
    }
    case "SECOND_DARK": {
      colorBackground = Colors(sitePropsColors).secondColorDark;
      borderColor = Colors(sitePropsColors).secondColor;
      break;
    }
    case "RED": {
      colorBackground = Colors(sitePropsColors).dangerColor;
      borderColor = Colors(sitePropsColors).dangerColorDark;
      break;
    }
    case "RED_DARK": {
      colorBackground = Colors(sitePropsColors).dangerColorDark;
      borderColor = Colors(sitePropsColors).dangerColor;
      break;
    }
    case "GREEN": {
      colorBackground = Colors(sitePropsColors).successColor;
      borderColor = Colors(sitePropsColors).successColorDark;
      break;
    }
    case "GREEN_DARK": {
      colorBackground = Colors(sitePropsColors).successColorDark;
      borderColor = Colors(sitePropsColors).successColor;
      break;
    }
    case "GREY": {
      colorBackground = Colors(sitePropsColors).greyColor;
      borderColor = Colors(sitePropsColors).greyColorDark;
      break;
    }
    case "GREY_DARK": {
      colorBackground = Colors(sitePropsColors).greyColorDark;
      borderColor = Colors(sitePropsColors).greyColor;
      break;
    }
    case "GREY_LIGHT": {
      colorBackground = Colors(sitePropsColors).greyColorLight;
      borderColor = Colors(sitePropsColors).greyColor;
      break;
    }

    default: {
      colorBackground = Colors(sitePropsColors).primaryColor;
      borderColor = Colors(sitePropsColors).primaryColorDark;
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
      borderColor={borderColor}
      dragActive={dragActive}
      onClick={(e) => handleClickEvent(e, activeEvent.id)}
      allItemsRowLength={countSelectedItemWithId}
      minWidthAndHeightEvent={minWidthAndHeightEvent}
      paddingEvents={paddingEvents}
      selectedItemsLength={selectedItemsLength}
      width={
        countSelectedItemWithId > 1
          ? widthEvent / countSelectedItemWithId + "px"
          : widthEvent + "px"
      }
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
        <ActiveItemDateStyle
          isMultiEvents={widthEvent / countSelectedItemWithId < 85}
        >
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
