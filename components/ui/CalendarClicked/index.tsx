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
  ArrayHoursProps,
  EventsActiveProps,
  ItemMinuteProps,
  CalendarProps,
} from "./CalendarClicked.model";
import { Heading, Popup } from "@ui";
import { useState } from "react";
import CalendarNewEventWithProps from "./CalendarNewEventWithProps";
import CalendarNewEven from "./CalendarNewEven";
import { getAllDaysInWeek } from "@functions";

const selectWeekDayName = (weekNumber: number): string => {
  let weekName = "";
  switch (weekNumber) {
    case 1: {
      weekName = "Poniedziałek";
      break;
    }
    case 2: {
      weekName = "Wtorek";
      break;
    }
    case 3: {
      weekName = "Środa";
      break;
    }
    case 4: {
      weekName = "Czwartek";
      break;
    }
    case 5: {
      weekName = "Piątek";
      break;
    }
    case 6: {
      weekName = "Sobota";
      break;
    }
    case 0: {
      weekName = "Niedziela";
      break;
    }

    default: {
      weekName = "";
      break;
    }
  }
  return weekName;
};

const arrayHours: ArrayHoursProps[] = [
  {
    index: 0,
    hour: "0:00",
  },
  {
    index: 1,
    hour: "1:00",
  },
  {
    index: 2,
    hour: "2:00",
  },
  {
    index: 3,
    hour: "3:00",
  },
  {
    index: 4,
    hour: "4:00",
  },
  {
    index: 5,
    hour: "5:00",
  },
  {
    index: 6,
    hour: "6:00",
  },
  {
    index: 7,
    hour: "7:00",
  },
  {
    index: 8,
    hour: "8:00",
  },
  {
    index: 9,
    hour: "9:00",
  },
  {
    index: 10,
    hour: "10:00",
  },
  {
    index: 11,
    hour: "11:00",
  },
  {
    index: 12,
    hour: "12:00",
  },
  {
    index: 13,
    hour: "13:00",
  },
  {
    index: 14,
    hour: "14:00",
  },
  {
    index: 15,
    hour: "15:00",
  },
  {
    index: 16,
    hour: "16:00",
  },
  {
    index: 17,
    hour: "17:00",
  },
  {
    index: 18,
    hour: "18:00",
  },
  {
    index: 19,
    hour: "19:00",
  },
  {
    index: 20,
    hour: "20:00",
  },
  {
    index: 21,
    hour: "21:00",
  },
  {
    index: 22,
    hour: "22:00",
  },
  {
    index: 23,
    hour: "23:00",
  },
];

const Calendar: NextPage<ISiteProps & CalendarProps & ITranslatesProps> = ({
  siteProps,
  color = "PRIMARY_DARK",
  minHour = 1,
  maxHour = 23,
  minutesInHour = 5,
  heightMinutes = 5,
  texts,
}) => {
  const [eventsActive, setEventsActive] = useState<EventsActiveProps[]>([]);
  const [addEventDate, setAddEventDate] = useState<string>("");
  const [addEventDateWithProp, setAddEventDateWithProp] =
    useState<EventsActiveProps | null>(null);

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

  const actualDate: Date = new Date();

  const addDaysInWeek: Date[] = getAllDaysInWeek(actualDate);

  let colorBackground: string = "";
  let colorDrag: string = Colors(sitePropsColors).greyColorLight;
  const borderColor: string = Colors(sitePropsColors).greyColorLight;
  const borderColorLight: string = Colors(sitePropsColors).backgroundColorPage;
  const backgroundCountEvents: string = Colors(sitePropsColors).dangerColor;
  const colorCountEvents: string = Colors(sitePropsColors).textOnlyWhite;

  switch (color) {
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
    <CalendarClickedStyle>
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
