import type { NextPage } from "next";
import { Colors, ColorsInterface } from "@constants";
import { withSiteProps } from "@hooks";
import type { ISiteProps } from "@hooks";
import { getDateFromString, getFullDate } from "@functions";
import { useState, useEffect } from "react";
import {
  CalendarStyle,
  CalendarOneDayStyle,
  CalendarAllDaysStyle,
  CenterTitle,
  CalendarNameDayStyle,
} from "./Calendar.style";
import { Paragraph, Heading } from "@ui";

interface CalendarProps {
  color?: "PRIMARY" | "BLACK" | "SECOND" | "RED" | "GREEN" | "GREY";
  actualDate?: string | null;
  handleChangeDay?: (day: string) => void;
}

const daysWeekPl: string[] = ["Pon", "Wt", "Sr", "Czw", "Pt", "Sob", "Nd"];
const daysWeekEn: string[] = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const nameMonthPl: string[] = [
  "Styczeń",
  "Luty",
  "Marzec",
  "Kwiecień",
  "Maj",
  "Czerwiec",
  "Lipiec",
  "Sierpień",
  "Wrzesień",
  "Pażdziernik",
  "Listopad",
  "Grudzień",
];
const nameMonthEn: string[] = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "Novembert",
  "December",
];

const Calendar: NextPage<ISiteProps & CalendarProps> = ({
  siteProps = {
    blind: false,
    dark: false,
    language: "pl",
  },
  color = "BLACK",
  actualDate = null,
  handleChangeDay,
}) => {
  const [actualDateCalendar, setActualDateCalendar] = useState<Date>(
    new Date()
  );
  const [activeDate, setActiveDate] = useState<string | null>(null);

  const sitePropsColors: ColorsInterface = {
    blind: siteProps.blind,
    dark: siteProps.dark,
  };

  useEffect(() => {
    if (!!actualDate) {
      const actualDateToValid: Date | null = getDateFromString(actualDate);
      if (!!actualDateToValid) {
        const actualDateValid: Date = actualDateToValid;
        setActualDateCalendar(actualDateValid);
        setActiveDate(actualDate);
      }
    }
  }, [actualDate]);

  const handleChangeMonth = (value: number) => {
    setActualDateCalendar((prevState) => {
      return new Date(
        prevState.getFullYear(),
        prevState.getMonth() + value,
        prevState.getDate()
      );
    });
  };

  const handleChangeActiveDay = (newDate: string) => {
    if (!!newDate) {
      setActiveDate(newDate);
      if (handleChangeDay) {
        handleChangeDay(newDate);
      }
    }
  };

  let colorText: string = "";

  switch (color) {
    case "PRIMARY": {
      colorText = Colors(sitePropsColors).primaryColor;
      break;
    }
    case "SECOND": {
      colorText = Colors(sitePropsColors).secondColor;
      break;
    }
    case "RED": {
      colorText = Colors(sitePropsColors).dangerColor;
      break;
    }
    case "GREEN": {
      colorText = Colors(sitePropsColors).successColor;
      break;
    }
    case "GREY": {
      colorText = Colors(sitePropsColors).greyColor;
      break;
    }

    default: {
      colorText = Colors(sitePropsColors).textBlack;
      break;
    }
  }

  const selectLastDayInMonth: Date = new Date(
    actualDateCalendar.getFullYear(),
    actualDateCalendar.getMonth() + 1,
    0
  );

  const allDaysInMonth: Date[] = [];

  for (let i = 1; i <= selectLastDayInMonth.getDate(); i++) {
    const newDateToAdd: Date = new Date(
      selectLastDayInMonth.getFullYear(),
      actualDateCalendar.getMonth(),
      i
    );
    allDaysInMonth.push(newDateToAdd);
  }

  const nameDayWeek = siteProps.language === "pl" ? daysWeekPl : daysWeekEn;
  const mapNameDayWeek = nameDayWeek.map((item, index) => {
    return (
      <CalendarNameDayStyle key={index}>
        <Paragraph>{item}</Paragraph>
      </CalendarNameDayStyle>
    );
  });

  const mapAllDaysInMonth = allDaysInMonth.map((item, index) => {
    const dayItem: number = item.getDate();
    let isActiveDay: boolean = false;
    if (!!activeDate) {
      isActiveDay = getFullDate(item) === activeDate;
    }

    const indexDate: number =
      index === 0 ? (item.getDay() === 0 ? 8 - 2 : item.getDay() - 1) : 0;

    return (
      <CalendarOneDayStyle
        key={index}
        indexDay={indexDate}
        isActiveDay={isActiveDay}
        onClick={() => handleChangeActiveDay(getFullDate(item))}
      >
        <Paragraph>{dayItem}</Paragraph>
      </CalendarOneDayStyle>
    );
  });

  const selectLanguageNameMonth =
    siteProps.language === "pl" ? nameMonthPl : nameMonthEn;

  return (
    <>
      <CalendarStyle>
        <CenterTitle>
          <Heading tag={2}>
            {selectLanguageNameMonth[actualDateCalendar.getMonth()]}{" "}
            {actualDateCalendar.getFullYear()}
          </Heading>
        </CenterTitle>
        {/* {`${actualDateCalendar.getFullYear()}-${
          actualDateCalendar.getMonth() + 1
        }-${actualDateCalendar.getDate()}`} */}
        <CalendarAllDaysStyle>{mapNameDayWeek}</CalendarAllDaysStyle>
        <CalendarAllDaysStyle>{mapAllDaysInMonth}</CalendarAllDaysStyle>
      </CalendarStyle>
      <button onClick={() => handleChangeMonth(-1)}>prev</button>
      <button onClick={() => handleChangeMonth(1)}>next</button>
    </>
  );
};

export default withSiteProps(Calendar);
