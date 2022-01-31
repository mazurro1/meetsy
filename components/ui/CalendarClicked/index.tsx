import CalendarClicked from "./CalendarClicked";
import type { NextPage } from "next";
import React from "react";
import { CalendarProps } from "./CalendarClicked.model";
import { useState, useEffect } from "react";
import { getFullDate, getDateFromString } from "@functions";
import { ButtonIcon } from "@ui";
import { ButtonsChangeDate } from "./CalendarClicked.style";
import { withSiteProps, withTranslates } from "@hooks";
import type { ISiteProps, ITranslatesProps } from "@hooks";

interface CalendarClickedChangeDateProps {
  handleChangeMonth: (month: number, year: number) => void;
}

const CalendarClickedChangeDate: NextPage<
  CalendarProps & ITranslatesProps & CalendarClickedChangeDateProps & ISiteProps
> = ({
  color = "PRIMARY_DARK",
  minHour = 0,
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
  handleChangeMonth,
  size,
  id,
}) => {
  const [actualDateCalendar, setActualDateCalendar] = useState<Date>(
    new Date()
  );
  const [validDaysToShow, setValidDaysToShow] = useState<1 | 7>(daysToShow);

  useEffect(() => {
    if (!!size?.width) {
      if (size.width < 900) {
        setValidDaysToShow((prevState) => {
          if (prevState !== 1) {
            return 1;
          }
          return prevState;
        });
      } else {
        setValidDaysToShow((prevState) => {
          if (prevState !== daysToShow) {
            return daysToShow;
          }
          return prevState;
        });
      }
    }
  }, [size, daysToShow]);

  useEffect(() => {
    if (!!actualDate) {
      const actualDateToValid: Date | null = getDateFromString(actualDate);
      if (!!actualDateToValid) {
        const actualDateValid: Date = actualDateToValid;
        handleChangeMonth(
          actualDateValid.getMonth() + 1,
          actualDateValid.getFullYear()
        );
        setActualDateCalendar(actualDateValid);
      }
    }
  }, [actualDate, handleChangeMonth]);

  const handleClickChangeDate = (value: number | null) => {
    setActualDateCalendar((prevDate) => {
      const fullPrevDate: string = getFullDate(prevDate);
      const splitActualDate: string[] = fullPrevDate.split("-");
      if (splitActualDate.length === 3) {
        let actualDateValid: Date = new Date();
        if (value !== null) {
          const beforeAddDaysActualMonth: Date = new Date(
            Number(splitActualDate[2]),
            Number(splitActualDate[1]) - 1,
            Number(splitActualDate[0]),
            10,
            0,
            0,
            0
          );
          const actualDateBeforeAddDays: number =
            beforeAddDaysActualMonth.getDate();

          const lastDayInActualMonth: Date = new Date(
            Number(splitActualDate[2]),
            Number(splitActualDate[1]),
            0,
            10,
            0,
            0,
            0
          );

          const numberOfDayLastDayInActualMonth: number =
            lastDayInActualMonth.getDay();
          const allDaysInActualMonth: number = lastDayInActualMonth.getDate();

          if (value > 0) {
            if (actualDateBeforeAddDays + value <= allDaysInActualMonth) {
              actualDateValid = new Date(
                Number(splitActualDate[2]),
                Number(splitActualDate[1]) - 1,
                Number(splitActualDate[0]) + value,
                10,
                0,
                0,
                0
              );
            } else {
              if (allDaysInActualMonth === actualDateBeforeAddDays) {
                actualDateValid = new Date(
                  Number(splitActualDate[2]),
                  Number(splitActualDate[1]),
                  1,
                  10,
                  0,
                  0,
                  0
                );
              } else {
                if (numberOfDayLastDayInActualMonth !== 1) {
                  actualDateValid = new Date(
                    Number(splitActualDate[2]),
                    Number(splitActualDate[1]),
                    1,
                    10,
                    0,
                    0,
                    0
                  );
                } else {
                  actualDateValid = new Date(
                    Number(splitActualDate[2]),
                    Number(splitActualDate[1]),
                    0,
                    10,
                    0,
                    0,
                    0
                  );
                }
              }
            }
          } else if (value < 0) {
            if (actualDateBeforeAddDays + value > 0) {
              actualDateValid = new Date(
                Number(splitActualDate[2]),
                Number(splitActualDate[1]) - 1,
                Number(splitActualDate[0]) + value,
                10,
                0,
                0,
                0
              );
            } else {
              if (1 === actualDateBeforeAddDays) {
                actualDateValid = new Date(
                  Number(splitActualDate[2]),
                  Number(splitActualDate[1]) - 1,
                  0,
                  10,
                  0,
                  0,
                  0
                );
              } else {
                if (numberOfDayLastDayInActualMonth !== 1) {
                  actualDateValid = new Date(
                    Number(splitActualDate[2]),
                    Number(splitActualDate[1]) - 1,
                    0,
                    10,
                    0,
                    0,
                    0
                  );
                } else {
                  actualDateValid = new Date(
                    Number(splitActualDate[2]),
                    Number(splitActualDate[1]) - 1,
                    1,
                    10,
                    0,
                    0,
                    0
                  );
                }
              }
            }
          }
        }
        if (Number(splitActualDate[1]) - 1 !== actualDateValid.getMonth()) {
          handleChangeMonth(
            actualDateValid.getMonth() + 1,
            actualDateValid.getFullYear()
          );
        }

        return actualDateValid;
      } else {
        return prevDate;
      }
    });
  };

  let colorButtons: "PRIMARY" | "SECOND" | "RED" | "GREEN" | "GREY" = "PRIMARY";

  switch (color) {
    case "PRIMARY": {
      colorButtons = "PRIMARY";
      break;
    }
    case "PRIMARY_DARK": {
      colorButtons = "PRIMARY";
      break;
    }
    case "SECOND": {
      colorButtons = "SECOND";
      break;
    }
    case "SECOND_DARK": {
      colorButtons = "SECOND";
      break;
    }
    case "RED": {
      colorButtons = "RED";
      break;
    }
    case "RED_DARK": {
      colorButtons = "RED";
      break;
    }
    case "GREEN": {
      colorButtons = "GREEN";
      break;
    }
    case "GREEN_DARK": {
      colorButtons = "GREEN";
      break;
    }
    case "GREY": {
      colorButtons = "GREY";
      break;
    }
    case "GREY_DARK": {
      colorButtons = "GREY";
      break;
    }
    case "GREY_LIGHT": {
      colorButtons = "GREY";
      break;
    }

    default: {
      colorButtons = "PRIMARY";
      break;
    }
  }

  const fullDateCalendar: string = getFullDate(actualDateCalendar);
  return (
    <div id={id}>
      <ButtonsChangeDate>
        <ButtonIcon
          id="prev_date"
          iconName="ArrowLeftIcon"
          onClick={() => handleClickChangeDate(-validDaysToShow)}
          color={colorButtons}
          fontSize="LARGE"
        >
          {validDaysToShow === 1 ? texts!.prevDay : texts!.prevWeek}
        </ButtonIcon>
        <ButtonIcon
          id="actual_date"
          iconName="CalendarIcon"
          onClick={() => handleClickChangeDate(null)}
          color={colorButtons}
          fontSize="LARGE"
        >
          {validDaysToShow === 1 ? texts!.actualDay : texts!.actualWeek}
        </ButtonIcon>
        <ButtonIcon
          id="next_date"
          iconName="ArrowRightIcon"
          onClick={() => handleClickChangeDate(validDaysToShow)}
          color={colorButtons}
          fontSize="LARGE"
        >
          {validDaysToShow === 1 ? texts!.nextDay : texts!.nextWeek}
        </ButtonIcon>
      </ButtonsChangeDate>
      <CalendarClicked
        minutesInHour={minutesInHour}
        color={color}
        minHour={minHour}
        maxHour={maxHour}
        heightMinutes={heightMinutes}
        minDate={minDate}
        maxDate={maxDate}
        actualDate={fullDateCalendar}
        daysToShow={validDaysToShow}
        disabledDays={disabledDays}
        constOpeningDays={constOpeningDays}
        openingDays={openingDays}
        events={events}
        id={id}
      />
    </div>
  );
};

export default withTranslates(
  withSiteProps(CalendarClickedChangeDate),
  "CalendarClicked"
);
