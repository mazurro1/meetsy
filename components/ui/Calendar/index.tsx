import type { NextPage } from "next";
import { Colors, ColorsInterface } from "@constants";
import { withSiteProps, withTranslates } from "@hooks";
import type { ISiteProps, ITranslatesProps } from "@hooks";
import { getDateFromString, getFullDate } from "@functions";
import { useState, useEffect } from "react";
import {
  CalendarStyle,
  CalendarOneDayStyle,
  CalendarAllDaysStyle,
  CenterTitle,
  CalendarNameDayStyle,
  PrevMontchStyle,
  NextMontchStyle,
} from "./Calendar.style";
import { Paragraph, Heading, Popup, ButtonIcon } from "@ui";
import type { CalendarProps } from "./Calendar.model";
import { daysWeekEn, daysWeekPl, nameMonthEn, nameMonthPl } from "./common";

const Calendar: NextPage<ISiteProps & CalendarProps & ITranslatesProps> = ({
  siteProps = {
    blind: false,
    dark: false,
    language: "pl",
  },
  color = "PRIMARY",
  actualDate = null,
  handleChangeDay,
  texts,
  minDate,
  maxDate,
  disabledDays,
  id = "",
}) => {
  const [actualDateCalendar, setActualDateCalendar] = useState<Date>(
    new Date()
  );
  const [activeDate, setActiveDate] = useState<string | null>(null);
  const [popupCalendarActive, setPopupCalendarActive] =
    useState<boolean>(false);

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
      setPopupCalendarActive(false);
    }
  };

  const handleChangePopupCalendar = () => {
    setPopupCalendarActive((prevState) => !prevState);
  };

  let colorText: string = "";
  const backgroundPage: string = Colors(sitePropsColors).backgroundColorPage;

  switch (color) {
    case "PRIMARY": {
      colorText = Colors(sitePropsColors).primaryColorDark;
      break;
    }
    case "SECOND": {
      colorText = Colors(sitePropsColors).secondColorDark;
      break;
    }
    case "RED": {
      colorText = Colors(sitePropsColors).dangerColorDark;
      break;
    }
    case "GREEN": {
      colorText = Colors(sitePropsColors).successColorDark;
      break;
    }
    case "GREY": {
      colorText = Colors(sitePropsColors).greyColorDark;
      break;
    }

    default: {
      colorText = Colors(sitePropsColors).primaryColorDark;
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

  const nameDayWeek: string[] =
    siteProps.language === "pl" ? daysWeekPl : daysWeekEn;
  const mapNameDayWeek = nameDayWeek.map((item, index) => {
    return (
      <CalendarNameDayStyle key={index}>
        <Paragraph color="GREY_LIGHT">{item}</Paragraph>
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

    let isLowerThenMinDate: boolean = false;
    let isHeightThenMinDate: boolean = false;
    let isInDisabledDays: boolean = false;

    if (!!minDate) {
      isLowerThenMinDate = item < minDate;
    }
    if (!!maxDate) {
      isHeightThenMinDate = item > maxDate;
    }

    if (!!disabledDays) {
      isInDisabledDays = disabledDays.some((itemDay) => {
        const valid1: boolean = itemDay.from <= item && itemDay.to >= item;
        return valid1;
      });
    }

    const isDisabled: boolean =
      isLowerThenMinDate || isHeightThenMinDate || isInDisabledDays;

    return (
      <CalendarOneDayStyle
        key={index}
        indexDay={indexDate}
        isActiveDay={isActiveDay}
        activeColor={colorText}
        onClick={() => {
          if (!isDisabled) {
            handleChangeActiveDay(getFullDate(item));
          }
        }}
        isDisabled={isDisabled}
      >
        <Paragraph
          color={!isDisabled ? (isActiveDay ? "WHITE" : "BLACK") : "GREY_LIGHT"}
        >
          {dayItem}
        </Paragraph>
      </CalendarOneDayStyle>
    );
  });

  const selectLanguageNameMonth: string[] =
    siteProps.language === "pl" ? nameMonthPl : nameMonthEn;

  return (
    <>
      <Popup
        title="Calendar"
        popupEnable={popupCalendarActive}
        handleClose={handleChangePopupCalendar}
        noContent
        id={id}
      >
        <div>
          <CalendarStyle backgroundPage={backgroundPage}>
            <PrevMontchStyle>
              <ButtonIcon
                id={`${id}_prev_button`}
                onClick={() => handleChangeMonth(-1)}
                iconName="ArrowLeftIcon"
                color={color}
              >
                {texts?.prevMonth}
              </ButtonIcon>
            </PrevMontchStyle>
            <CenterTitle>
              <Heading tag={2} marginTop={0}>
                {selectLanguageNameMonth[actualDateCalendar.getMonth()]}{" "}
                {actualDateCalendar.getFullYear()}
              </Heading>
            </CenterTitle>
            <CalendarAllDaysStyle>{mapNameDayWeek}</CalendarAllDaysStyle>
            <CalendarAllDaysStyle>{mapAllDaysInMonth}</CalendarAllDaysStyle>
          </CalendarStyle>
          <NextMontchStyle>
            <ButtonIcon
              id={`${id}_next_button`}
              onClick={() => handleChangeMonth(1)}
              iconName="ArrowRightIcon"
              color={color}
            >
              {texts?.nextMonth}
            </ButtonIcon>
          </NextMontchStyle>
        </div>
      </Popup>
      <ButtonIcon
        id={`${id}_change_calendar_date_button`}
        onClick={handleChangePopupCalendar}
        iconName="CalendarIcon"
        fontSize="LARGE"
        color={color}
      >
        {activeDate}
      </ButtonIcon>
    </>
  );
};

export default withTranslates(withSiteProps(Calendar), "Calendar");
