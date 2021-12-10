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
} from "./CalendarClicked.model";
import { Heading } from "@ui";
import { useState } from "react";

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

const getAllDaysInMonth = (month: number, year: number) =>
  Array.from(
    { length: new Date(year, month, 0).getDate() - 1 },
    (_, i) => new Date(year, month, i + 1)
  );

const getAllDaysInWeek = (current: Date) => {
  var week = [];
  // Starting Monday not Sunday
  var first = current.getDate() - current.getDay() + 1;
  current.setDate(first);
  for (var i = 0; i < 7; i++) {
    week.push(new Date(+current));
    current.setDate(current.getDate() + 1);
  }
  return week;
};

interface CalendarProps {
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
  minutesInHour: number;
}

const Calendar: NextPage<ISiteProps & CalendarProps> = ({
  siteProps,
  color = "PRIMARY_DARK",
  minHour = 1,
  maxHour = 23,
  minutesInHour = 5 | 10 | 15 | 30,
}) => {
  const [eventsActive, setEventsActive] = useState<EventsActiveProps[]>([]);
  const [weekDayFocused, setWeekDayFocused] = useState<number | null>(null);

  const sitePropsColors: ColorsInterface = {
    blind: siteProps.blind,
    dark: siteProps.dark,
  };
  console.log(eventsActive);
  const handleAddActiveItem = (item: EventsActiveProps) => {
    setEventsActive((prevState) => {
      const newItem = [...prevState, item];
      return newItem;
    });
  };

  const handleChangeWeekDayFocused = (value: number | null) => {
    setWeekDayFocused(value);
  };

  const actualDate: Date = new Date();
  // const actualWeekDay: number = actualDate.getDay();
  // const actualWeekDayName: string = selectWeekDayName(actualWeekDay);
  // const maxDaysAtMonth = actualDate.getDate();
  // console.log(actualWeekDay, actualWeekDayName, maxDaysAtMonth);
  // console.log(getAllDaysInMonth(10, 2021));

  const addDaysInWeek: Date[] = getAllDaysInWeek(actualDate);

  let colorBackground: string = "";
  let colorDrag: string = Colors(sitePropsColors).greyColorLight;
  const borderColor: string = Colors(sitePropsColors).greyColorLight;
  const borderColorLight: string = Colors(sitePropsColors).backgroundColorPage;

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

  const heightMinutes = 5;
  const heightCountMinutes = 60 / minutesInHour;
  const heightItemNameHour = heightCountMinutes * heightMinutes;

  const mapAllDaysInWeek = addDaysInWeek.map((itemDay, index) => {
    const getNameDayWeek: Date = new Date(itemDay);
    const itemWeekDay: number = getNameDayWeek.getDay();
    const nameWeekDayItem: string = selectWeekDayName(itemWeekDay);

    return (
      <CalendarClickedWeekDay
        key={index}
        date={itemDay}
        name={nameWeekDayItem}
        colorBackground={colorBackground}
        filterAllHours={filterAllHours}
        minutesInHour={minutesInHour}
        heightMinutes={heightMinutes}
        handleAddActiveItem={handleAddActiveItem}
        colorDrag={colorDrag}
        borderColor={borderColor}
        borderColorLight={borderColorLight}
        eventsActive={eventsActive}
        indexItemDay={index}
        weekDayFocused={weekDayFocused}
        handleChangeWeekDayFocused={handleChangeWeekDayFocused}
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
    <CalendarClickedStyle onMouseLeave={() => handleChangeWeekDayFocused(null)}>
      <DayCalendarHour>
        <DayCalendarNameCorner
          background={colorBackground}
          borderColorLight={borderColorLight}
        ></DayCalendarNameCorner>
        {mapDayHourCalendar}
      </DayCalendarHour>
      {mapAllDaysInWeek}
    </CalendarClickedStyle>
  );
};

export default withSiteProps(Calendar);
