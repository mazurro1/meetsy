import CalendarClicked from "./CalendarClicked";
import type { NextPage } from "next";
import React from "react";
import { CalendarProps } from "./CalendarClicked.model";
import { withTranslates } from "@hooks";
import type { ITranslatesProps } from "@hooks";
import { useState, useEffect } from "react";
import { getFullDate } from "@functions";
import { ButtonIcon } from "@ui";
import { ButtonsChangeDate } from "./CalendarClicked.style";
import { useWindowSize } from "@hooks";
import type { UseWindowSizeProps } from "@hooks";

interface CalendarClickedChangeDateProps {
  handleChangeMonth: (month: number, year: number) => void;
}

const CalendarClickedChangeDate: NextPage<
  CalendarProps & ITranslatesProps & CalendarClickedChangeDateProps
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
}) => {
  const [actualDateCalendar, setActualDateCalendar] = useState<Date>(
    new Date()
  );
  const [validDaysToShow, setValidDaysToShow] = useState<1 | 7>(daysToShow);
  const size: UseWindowSizeProps = useWindowSize();

  useEffect(() => {
    if (!!size.width) {
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
      const splitActualDate: string[] = actualDate.split("-");
      if (splitActualDate.length === 3) {
        const actualDateValid = new Date(
          Number(splitActualDate[2]),
          Number(splitActualDate[1]) - 1,
          Number(splitActualDate[0]),
          0,
          0,
          0,
          0
        );
        handleChangeMonth(
          actualDateValid.getMonth() + 1,
          actualDateValid.getFullYear()
        );
        setActualDateCalendar(actualDateValid);
      }
    }
  }, [actualDate]);

  const handleClickChangeDate = (value: number | null) => {
    setActualDateCalendar((prevDate) => {
      const fullPrevDate: string = getFullDate(prevDate);
      const splitActualDate: string[] = fullPrevDate.split("-");
      if (splitActualDate.length === 3) {
        let actualDateValid: Date = new Date();
        if (value !== null) {
          actualDateValid = new Date(
            Number(splitActualDate[2]),
            Number(splitActualDate[1]) - 1,
            Number(splitActualDate[0]) + value,
            0,
            0,
            0,
            0
          );
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
    <div>
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
        size={size}
      />
    </div>
  );
};

export default withTranslates(CalendarClickedChangeDate, "Calendar");
