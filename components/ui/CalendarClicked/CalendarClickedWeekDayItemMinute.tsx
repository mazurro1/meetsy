import type { NextPage } from "next";
import { DayCalendarItemMinutes } from "./CalendarClicked.style";
import type {
  SelectedItemProps,
  CalendarClickedWeekDayItemMinuteProps,
} from "./CalendarClicked.model";
import { getDateFromString } from "@functions";

const CalendarClickedWeekDayItemMinute: NextPage<CalendarClickedWeekDayItemMinuteProps> =
  ({
    itemMinute,
    dragActive,
    hour,
    fullDate,
    handleAddItem,
    selectedItems,
    lastElementSelectedItems,
    firstElementSelectedItems,
    heightMinutes,
    colorDrag,
    minDate,
    maxDate,
    colorDisabledMinMaxDate,
    disabledDays,
    constOpeningDays = null,
    openingDays = [],
    colorOpening,
    actualDate,
  }) => {
    const [aHour]: string[] = hour.split(":");

    let validDateMin: Date = new Date();
    const validDateMinToValid: Date | null = getDateFromString(
      fullDate,
      Number(aHour),
      itemMinute.minMinute
    );
    if (validDateMinToValid) {
      validDateMin = validDateMinToValid;
    }

    let validDateMax: Date = new Date();
    const validDateMaxToValid: Date | null = getDateFromString(
      fullDate,
      Number(aHour),
      itemMinute.maxMinute
    );
    if (validDateMaxToValid) {
      validDateMax = validDateMaxToValid;
    }

    const newItem: SelectedItemProps = {
      hour: hour,
      fullDate: fullDate,
      minMinute: itemMinute.minMinute,
      maxMinute: itemMinute.maxMinute,
      validDateMin: validDateMin,
      validDateMax: validDateMax,
    };

    let isDateBetween: boolean = false;
    if (!!firstElementSelectedItems && !!lastElementSelectedItems) {
      if (
        validDateMin >= firstElementSelectedItems.validDateMin &&
        validDateMin <= lastElementSelectedItems.validDateMin
      ) {
        isDateBetween = true;
      }
    }

    const isActive: boolean = selectedItems.some((itemSelected) => {
      return JSON.stringify(itemSelected) === JSON.stringify(newItem);
    });

    let isDisabledOtherMonth: boolean = false;
    let isDisabledDateMin: boolean = false;
    let isDisabledDateMax: boolean = false;
    let isDisabledDateDays: boolean = false;
    if (actualDate) {
      const [_, aMonth, aYear]: string[] = fullDate.split("-");
      const fullDateWithMonthYear = `${aMonth}-${aYear}`;
      const splitActualDate = actualDate.split("-");
      if (splitActualDate.length === 3) {
        const actualDateValid = `${splitActualDate[1]}-${splitActualDate[2]}`;
        if (fullDateWithMonthYear !== actualDateValid) {
          isDisabledOtherMonth = true;
        }
      }
    }
    if (minDate) {
      isDisabledDateMin = minDate > validDateMin;
    }
    if (maxDate) {
      isDisabledDateMax = maxDate <= validDateMin;
    }
    if (disabledDays) {
      for (const itemDisabledDay of disabledDays) {
        if (
          validDateMin >= itemDisabledDay.from &&
          validDateMax <= itemDisabledDay.to
        ) {
          isDisabledDateDays = true;
        }
      }
    }

    let isConstDateOpening: boolean = false;
    let isDateOpening: boolean = false;
    if (!!constOpeningDays) {
      let validconstOpeningDaysFrom: Date | null = null;
      let validconstOpeningDaysTo: Date | null = null;
      if (constOpeningDays.from) {
        const splitConstOpeningDaysFrom: string[] =
          constOpeningDays.from.split(":");
        if (splitConstOpeningDaysFrom.length === 2) {
          const validconstOpeningDaysFromToValid: Date | null =
            getDateFromString(
              fullDate,
              Number(splitConstOpeningDaysFrom[0]),
              Number(splitConstOpeningDaysFrom[1])
            );

          if (!!validconstOpeningDaysFromToValid) {
            validconstOpeningDaysFrom = validconstOpeningDaysFromToValid;
          }
        }
      }

      if (constOpeningDays.to) {
        const splitConstOpeningDaysTo: string[] =
          constOpeningDays.to.split(":");
        if (splitConstOpeningDaysTo.length === 2) {
          const validconstOpeningDaysToToValid: Date | null = getDateFromString(
            fullDate,
            Number(splitConstOpeningDaysTo[0]),
            Number(splitConstOpeningDaysTo[1])
          );

          if (!!validconstOpeningDaysToToValid) {
            validconstOpeningDaysTo = validconstOpeningDaysToToValid;
          }
        }
      }

      if (
        validconstOpeningDaysFrom !== null &&
        validconstOpeningDaysTo !== null
      ) {
        if (
          validDateMin >= validconstOpeningDaysFrom &&
          validDateMax <= validconstOpeningDaysTo
        ) {
          isConstDateOpening = true;
        }
      }
    }
    if (openingDays) {
      for (const itemOpeningDays of openingDays) {
        let validconstOpeningDaysFrom: Date | null = null;
        let validconstOpeningDaysTo: Date | null = null;
        if (itemOpeningDays.from) {
          const splitConstOpeningDaysFrom: string[] =
            itemOpeningDays.from.split(":");
          if (splitConstOpeningDaysFrom.length === 2) {
            const validconstOpeningDaysFromToValid: Date | null =
              getDateFromString(
                fullDate,
                Number(splitConstOpeningDaysFrom[0]),
                Number(splitConstOpeningDaysFrom[1])
              );

            if (!!validconstOpeningDaysFromToValid) {
              validconstOpeningDaysFrom = validconstOpeningDaysFromToValid;
            }
          }
        }

        if (itemOpeningDays.to) {
          const splitConstOpeningDaysTo: string[] =
            itemOpeningDays.to.split(":");
          if (splitConstOpeningDaysTo.length === 2) {
            const validconstOpeningDaysToToValid: Date | null =
              getDateFromString(
                fullDate,
                Number(splitConstOpeningDaysTo[0]),
                Number(splitConstOpeningDaysTo[1])
              );

            if (!!validconstOpeningDaysToToValid) {
              validconstOpeningDaysTo = validconstOpeningDaysToToValid;
            }
          }
        }
        if (
          validconstOpeningDaysFrom !== null &&
          validconstOpeningDaysTo !== null
        ) {
          if (
            validDateMin >= validconstOpeningDaysFrom &&
            validDateMax <= validconstOpeningDaysTo
          ) {
            isDateOpening = true;
          }
        }
      }
    }

    const isDisabledDate: boolean =
      isDisabledDateMax ||
      isDisabledDateMin ||
      isDisabledDateDays ||
      isDisabledOtherMonth;

    const validIsDateOpening: boolean =
      openingDays.length > 0 ? isDateOpening : isConstDateOpening;

    const handleOnMouseEnter = () => {
      if (dragActive && !isActive && !isDisabledDate) {
        if (!!newItem) {
          handleAddItem(newItem);
        }
      }
    };

    const handleOnMouseDown = () => {
      if (!isActive && !isDisabledDate) {
        if (!!newItem) {
          handleAddItem(newItem);
        }
      }
    };

    const handleRightClick = (e: React.MouseEvent<HTMLDivElement>) => {
      e.preventDefault();
    };

    return (
      <DayCalendarItemMinutes
        color={
          (dragActive ? isActive || isDateBetween : false)
            ? colorDrag
            : isDisabledDate
            ? colorDisabledMinMaxDate
            : validIsDateOpening
            ? "transparent"
            : colorOpening
        }
        heightMinutes={heightMinutes}
        onMouseDown={handleOnMouseDown}
        onMouseEnter={handleOnMouseEnter}
        onContextMenu={handleRightClick}
        isDisabledDate={isDisabledDate}
        validIsDateOpening={validIsDateOpening && !isDateBetween}
        dragActive={dragActive}
        opacity={isDisabledDate ? 1 : validIsDateOpening ? 0.8 : 0.75}
      />
    );
  };
export default CalendarClickedWeekDayItemMinute;
