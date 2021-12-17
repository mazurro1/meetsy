import type { NextPage } from "next";
import {
  CalendarClickedStyle,
  DayHourCalendar,
  DayCalendarHour,
  DayCalendarNameCorner,
  ItemDayCalendarItemHour,
} from "./CalendarClicked.style";
import CalendarClickedWeekDay from "./CalendarClickedWeekDay";
import { Colors, ColorsInterface } from "@constants";
import { withSiteProps, withTranslates } from "@hooks";
import type { ISiteProps, ITranslatesProps } from "@hooks";
import type {
  EventsActiveProps,
  ItemMinuteProps,
  CalendarProps,
} from "./CalendarClicked.model";
import { Heading, Popup } from "@ui";
import { useState, useEffect, useRef } from "react";
import CalendarNewEventWithProps from "./CalendarNewEventWithProps";
import CalendarNewEven from "./CalendarNewEven";
import { getAllDaysInWeek } from "@functions";
import { selectWeekDayName, arrayHours } from "./common";

const Calendar: NextPage<ISiteProps & CalendarProps & ITranslatesProps> = ({
  siteProps,
  color = "PRIMARY_DARK",
  minHour = 1,
  maxHour = 23,
  minutesInHour = 5,
  heightMinutes = 5,
  texts,
  events = [],
  minDate,
  maxDate,
  disabledDays = [],
  constOpeningDays,
  openingDays,
  daysToShow = 7,
  actualDate = null,
}) => {
  const [eventsActive, setEventsActive] = useState<EventsActiveProps[]>([]);
  const [addEventDate, setAddEventDate] = useState<string>("");
  const [addEventDateWithProp, setAddEventDateWithProp] =
    useState<EventsActiveProps | null>(null);
  const [clientWidthCalendar, setClientWidthCalendar] = useState<number>(0);
  const calendarClickedStyleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!!calendarClickedStyleRef) {
      if (!!calendarClickedStyleRef.current) {
        setClientWidthCalendar(calendarClickedStyleRef.current.clientWidth);
      }
    }
  }, [calendarClickedStyleRef]);

  useEffect(() => {
    setEventsActive(events);
  }, [events]);

  const sitePropsColors: ColorsInterface = {
    blind: siteProps.blind,
    dark: siteProps.dark,
  };

  const handleAddEvent = (fullDate: string) => {
    setAddEventDate(fullDate);
  };

  const handleclosePopup = () => {
    setAddEventDate("");
    setAddEventDateWithProp(null);
  };

  const handleAddActiveItem = (item: EventsActiveProps) => {
    setAddEventDateWithProp(item);
  };

  const handleAddNewEvent = (item: EventsActiveProps) => {
    setEventsActive((prevState) => {
      const newItem = [...prevState, item];
      return newItem;
    });
    setAddEventDate("");
    setAddEventDateWithProp(null);
  };

  const handleClickEvent = (
    e: React.MouseEvent<HTMLElement>,
    eventId: string
  ) => {
    e.stopPropagation();
    console.log(eventId);
  };

  let actualDateValid = new Date();
  if (!!actualDate) {
    const splitActualDate = actualDate.split("-");
    if (splitActualDate.length === 3) {
      actualDateValid = new Date(
        Number(splitActualDate[2]),
        Number(splitActualDate[1]) - 1,
        Number(splitActualDate[0]),
        0,
        0,
        0,
        0
      );
    }
  }

  const addDaysInWeek: Date[] =
    daysToShow === 7 ? getAllDaysInWeek(actualDateValid) : [actualDateValid];

  let colorBackground: string = "";
  let colorOpening: string = "";
  const colorDrag: string = Colors(sitePropsColors).greyColorLight;
  const borderColor: string = Colors(sitePropsColors).greyColorLight;
  const borderColorLight: string = Colors(sitePropsColors).backgroundColorPage;
  const backgroundCountEvents: string = Colors(sitePropsColors).dangerColor;
  const colorCountEvents: string = Colors(sitePropsColors).textOnlyWhite;
  const colorDisabledMinMaxDate: string = Colors(sitePropsColors).disabled;

  switch (color) {
    case "PRIMARY": {
      colorBackground = Colors(sitePropsColors).primaryColor;
      colorOpening = Colors(sitePropsColors).primaryColorLight;
      break;
    }
    case "PRIMARY_DARK": {
      colorBackground = Colors(sitePropsColors).primaryColorDark;
      colorOpening = Colors(sitePropsColors).primaryColorLight;
      break;
    }
    case "SECOND": {
      colorBackground = Colors(sitePropsColors).secondColor;
      colorOpening = Colors(sitePropsColors).secondColorLight;
      break;
    }
    case "SECOND_DARK": {
      colorBackground = Colors(sitePropsColors).secondColorDark;
      colorOpening = Colors(sitePropsColors).secondColorLight;
      break;
    }
    case "RED": {
      colorBackground = Colors(sitePropsColors).dangerColor;
      colorOpening = Colors(sitePropsColors).dangerColorLight;
      break;
    }
    case "RED_DARK": {
      colorBackground = Colors(sitePropsColors).dangerColorDark;
      colorOpening = Colors(sitePropsColors).dangerColorLight;
      break;
    }
    case "GREEN": {
      colorBackground = Colors(sitePropsColors).successColor;
      colorOpening = Colors(sitePropsColors).successColorLight;
      break;
    }
    case "GREEN_DARK": {
      colorBackground = Colors(sitePropsColors).successColorDark;
      colorOpening = Colors(sitePropsColors).successColorLight;
      break;
    }
    case "GREY": {
      colorBackground = Colors(sitePropsColors).greyColor;
      colorOpening = Colors(sitePropsColors).successColorLight;
      break;
    }
    case "GREY_DARK": {
      colorBackground = Colors(sitePropsColors).greyColorDark;
      colorOpening = Colors(sitePropsColors).successColorLight;
      break;
    }
    case "GREY_LIGHT": {
      colorBackground = Colors(sitePropsColors).greyColorLight;
      colorOpening = Colors(sitePropsColors).successColorLight;
      break;
    }

    default: {
      colorBackground = Colors(sitePropsColors).primaryColor;
      colorOpening = Colors(sitePropsColors).primaryColorLight;
      break;
    }
  }

  const filterAllHours = arrayHours.filter((itemHour) => {
    if (minHour <= itemHour.index && maxHour >= itemHour.index) {
      return true;
    } else {
      return false;
    }
  });

  const heightCountMinutes = 60 / minutesInHour;
  const heightItemNameHour = heightCountMinutes * heightMinutes;

  const mapAllDaysInWeek = addDaysInWeek.map((itemDay, index) => {
    const getNameDayWeek: Date = new Date(itemDay);
    const itemWeekDay: number = getNameDayWeek.getDay();
    const nameWeekDayItem: string = selectWeekDayName(itemWeekDay);

    const itemsOfMinutes: ItemMinuteProps[] = [];
    const countOfMinutes = 60 / minutesInHour;
    for (let i = 0; i <= countOfMinutes - 1; i++) {
      const newItemMinute: ItemMinuteProps = {
        index: i,
        minMinute: i * minutesInHour,
        maxMinute: i * minutesInHour + minutesInHour,
      };
      itemsOfMinutes.push(newItemMinute);
    }

    return (
      <CalendarClickedWeekDay
        key={index}
        date={itemDay}
        name={nameWeekDayItem}
        colorBackground={colorBackground}
        filterAllHours={filterAllHours}
        minutesInHour={minutesInHour}
        heightMinutes={heightMinutes}
        colorDrag={colorDrag}
        borderColor={borderColor}
        borderColorLight={borderColorLight}
        eventsActive={eventsActive}
        indexItemDay={index}
        handleClickEvent={handleClickEvent}
        itemsOfMinutes={itemsOfMinutes}
        handleAddActiveItem={handleAddActiveItem}
        backgroundCountEvents={backgroundCountEvents}
        colorCountEvents={colorCountEvents}
        minHour={minHour}
        handleAddEvent={handleAddEvent}
        minDate={minDate}
        maxDate={maxDate}
        colorDisabledMinMaxDate={colorDisabledMinMaxDate}
        disabledDays={disabledDays}
        constOpeningDays={constOpeningDays}
        openingDays={openingDays}
        colorOpening={colorOpening}
        daysToShow={daysToShow}
        clientWidthCalendar={clientWidthCalendar}
      />
    );
  });

  const mapDayHourCalendar = filterAllHours.map((itemHour) => {
    return (
      <DayHourCalendar key={itemHour.index}>
        <ItemDayCalendarItemHour
          background={colorBackground}
          height={heightItemNameHour}
          borderColorLight={borderColorLight}
        >
          <Heading marginBottom={0} marginTop={0} color="WHITE" tag={4}>
            {itemHour.hour}
          </Heading>
        </ItemDayCalendarItemHour>
      </DayHourCalendar>
    );
  });

  return (
    <CalendarClickedStyle ref={calendarClickedStyleRef}>
      <DayCalendarHour>
        <DayCalendarNameCorner
          background={colorBackground}
          borderColorLight={borderColorLight}
        ></DayCalendarNameCorner>
        {mapDayHourCalendar}
      </DayCalendarHour>
      {mapAllDaysInWeek}
      <Popup
        popupEnable={!!addEventDate}
        handleClose={handleclosePopup}
        title="Dodaj zdarzenie"
        position="absolute"
      >
        <CalendarNewEven
          handleAddNewEvent={handleAddNewEvent}
          addEventDate={addEventDate}
        />
      </Popup>
      <Popup
        popupEnable={!!addEventDateWithProp}
        handleClose={handleclosePopup}
        title="Dodaj zdarzenie z prop"
        position="absolute"
      >
        <CalendarNewEventWithProps
          addEventDateWithProp={addEventDateWithProp}
          handleAddNewEvent={handleAddNewEvent}
        />
      </Popup>
    </CalendarClickedStyle>
  );
};

export default withTranslates(withSiteProps(Calendar), "CalendarClicked");
