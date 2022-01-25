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
import CalendarNewEven from "./CalendarNewEven";
import { getAllDaysInWeek, getDateFromString } from "@functions";
import { selectWeekDayName, arrayHours } from "./common";
import CalendarEditEven from "./CalendarEditEven";

const Calendar: NextPage<ISiteProps & CalendarProps & ITranslatesProps> = ({
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
  siteProps,
  size,
  id = "",
}) => {
  const [eventsActive, setEventsActive] = useState<EventsActiveProps[]>([]);
  const [addEventDate, setAddEventDate] = useState<string>("");
  const [addEventDateWithProp, setAddEventDateWithProp] =
    useState<EventsActiveProps | null>(null);
  const [editEventDateWithProp, setEditEventDateWithProp] =
    useState<EventsActiveProps | null>(null);
  const [clientWidthCalendar, setClientWidthCalendar] = useState<number>(0);
  const calendarClickedStyleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setAddEventDate("");
    setAddEventDateWithProp(null);
    setEditEventDateWithProp(null);
  }, [actualDate]);

  useEffect(() => {
    if (!!calendarClickedStyleRef) {
      if (!!calendarClickedStyleRef.current) {
        setClientWidthCalendar(calendarClickedStyleRef.current.clientWidth);
      }
    }
  }, [calendarClickedStyleRef, size]);

  useEffect(() => {
    setEventsActive(events);
  }, [events]);

  const sitePropsColors: ColorsInterface = {
    blind: siteProps?.blind,
    dark: siteProps?.dark,
  };

  const handleAddEvent = (fullDate: string) => {
    setAddEventDate(fullDate);
    if (!!calendarClickedStyleRef) {
      if (!!calendarClickedStyleRef.current) {
        calendarClickedStyleRef.current.scrollIntoView();
      }
    }
  };

  const handleClosePopup = () => {
    setAddEventDate("");
    setAddEventDateWithProp(null);
    setEditEventDateWithProp(null);
  };

  const handleAddActiveItem = (item: EventsActiveProps) => {
    setAddEventDateWithProp(item);
    if (!!calendarClickedStyleRef) {
      if (!!calendarClickedStyleRef.current) {
        calendarClickedStyleRef.current.scrollIntoView();
      }
    }
  };

  const handleSaveEditedEvent = (item: EventsActiveProps) => {
    setEventsActive((prevState) => {
      const mapEventsActive: EventsActiveProps[] = prevState.map(
        (itemActive) => {
          if (itemActive.id === item.id) {
            return item;
          } else {
            return itemActive;
          }
        }
      );

      return mapEventsActive;
    });
    setAddEventDate("");
    setAddEventDateWithProp(null);
    setEditEventDateWithProp(null);
  };

  const handleAddNewEvent = (item: EventsActiveProps) => {
    setEventsActive((prevState) => {
      const newItem = [...prevState, item];
      return newItem;
    });
    setAddEventDate("");
    setAddEventDateWithProp(null);
    setEditEventDateWithProp(null);
  };

  const handleClickEvent = (
    e: React.MouseEvent<HTMLElement>,
    event: EventsActiveProps
  ) => {
    e.stopPropagation();
    setEditEventDateWithProp(event);
    if (!!calendarClickedStyleRef) {
      if (!!calendarClickedStyleRef.current) {
        calendarClickedStyleRef.current.scrollIntoView();
      }
    }
  };

  let actualDateValid: Date = new Date();
  if (!!actualDate) {
    const actualDateToValid = getDateFromString(actualDate);
    if (!!actualDateToValid) {
      actualDateValid = actualDateToValid;
    }
  }

  const addDaysInWeek: Date[] =
    daysToShow === 7
      ? getAllDaysInWeek(!!actualDate ? actualDate : "")
      : [actualDateValid];

  let colorBackground: string = "";
  let colorDrag: string = "";
  const colorOpening: string = Colors(sitePropsColors).disabled;
  const borderColor: string = Colors(sitePropsColors).greyColorLight;
  const borderColorLight: string = Colors(sitePropsColors).backgroundColorPage;
  const backgroundCountEvents: string = Colors(sitePropsColors).dangerColor;
  const colorCountEvents: string = Colors(sitePropsColors).textOnlyWhite;
  const colorDisabledMinMaxDate: string =
    Colors(sitePropsColors).greyColorLight;

  switch (color) {
    case "PRIMARY": {
      colorBackground = Colors(sitePropsColors).primaryColor;
      colorDrag = Colors(sitePropsColors).primaryColor;
      break;
    }
    case "PRIMARY_DARK": {
      colorBackground = Colors(sitePropsColors).primaryColorDark;
      colorDrag = Colors(sitePropsColors).primaryColor;
      break;
    }
    case "SECOND": {
      colorBackground = Colors(sitePropsColors).secondColor;
      colorDrag = Colors(sitePropsColors).secondColor;
      break;
    }
    case "SECOND_DARK": {
      colorBackground = Colors(sitePropsColors).secondColorDark;
      colorDrag = Colors(sitePropsColors).secondColor;
      break;
    }
    case "RED": {
      colorBackground = Colors(sitePropsColors).dangerColor;
      colorDrag = Colors(sitePropsColors).dangerColor;
      break;
    }
    case "RED_DARK": {
      colorBackground = Colors(sitePropsColors).dangerColorDark;
      colorDrag = Colors(sitePropsColors).dangerColor;
      break;
    }
    case "GREEN": {
      colorBackground = Colors(sitePropsColors).successColor;
      colorDrag = Colors(sitePropsColors).successColor;
      break;
    }
    case "GREEN_DARK": {
      colorBackground = Colors(sitePropsColors).successColorDark;
      colorDrag = Colors(sitePropsColors).successColor;
      break;
    }
    case "GREY": {
      colorBackground = Colors(sitePropsColors).greyColor;
      colorDrag = Colors(sitePropsColors).primaryColor;
      break;
    }
    case "GREY_DARK": {
      colorBackground = Colors(sitePropsColors).greyColorDark;
      colorDrag = Colors(sitePropsColors).primaryColor;
      break;
    }
    case "GREY_LIGHT": {
      colorBackground = Colors(sitePropsColors).greyColorLight;
      colorDrag = Colors(sitePropsColors).primaryColor;
      break;
    }

    default: {
      colorBackground = Colors(sitePropsColors).primaryColor;
      colorDrag = Colors(sitePropsColors).primaryColor;
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

  const heightCountMinutes: number = 60 / minutesInHour;
  const heightItemNameHour: number = heightCountMinutes * heightMinutes;

  const mapAllDaysInWeek = addDaysInWeek.map((itemDay, index) => {
    const getNameDayWeek: Date = new Date(itemDay);
    const itemWeekDay: number = getNameDayWeek.getDay();
    const nameWeekDayItem: string = selectWeekDayName(
      itemWeekDay,
      siteProps!.language
    );

    const itemsOfMinutes: ItemMinuteProps[] = [];
    const countOfMinutes: number = 60 / minutesInHour;
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
        actualDate={actualDate}
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
        popupEnable={!!addEventDate || !!addEventDateWithProp}
        handleClose={handleClosePopup}
        title={texts?.addEvent ? texts?.addEvent : ""}
        position="absolute"
        id={`${id}_add_event_button`}
      >
        <CalendarNewEven
          handleAddNewEvent={handleAddNewEvent}
          addEventDate={addEventDate}
          addEventDateWithProp={addEventDateWithProp}
        />
      </Popup>
      <Popup
        popupEnable={!!editEventDateWithProp}
        handleClose={handleClosePopup}
        title={texts?.editEvent ? texts?.editEvent : ""}
        position="absolute"
        id={`${id}_edit_event_button`}
      >
        <CalendarEditEven
          handleSaveEditedEvent={handleSaveEditedEvent}
          editEventDateWithProp={editEventDateWithProp}
        />
      </Popup>
    </CalendarClickedStyle>
  );
};

export default withTranslates(withSiteProps(Calendar), "CalendarClicked");
