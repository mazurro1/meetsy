import type { NextPage } from "next";
import { DayCalendarItemMinutes } from "./CalendarClicked.style";
import type {
  SelectedItemProps,
  CalendarClickedWeekDayItemMinuteProps,
} from "./CalendarClicked.model";

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
  }) => {
    const [aHour]: string[] = hour.split(":");
    const [aDay, aMonth, aYear]: string[] = fullDate.split("-");
    const validDateMin: Date = new Date(
      Number(aYear),
      Number(aMonth) - 1,
      Number(aDay),
      Number(aHour),
      itemMinute.minMinute,
      0,
      0
    );

    const validDateMax: Date = new Date(
      Number(aYear),
      Number(aMonth) - 1,
      Number(aDay),
      Number(aHour),
      itemMinute.maxMinute,
      0,
      0
    );

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

    let isDisabledDateMin: boolean = false;
    let isDisabledDateMax: boolean = false;
    let isDisabledDateDays: boolean = false;
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
          validconstOpeningDaysFrom = new Date(
            Number(aYear),
            Number(aMonth) - 1,
            Number(aDay),
            Number(splitConstOpeningDaysFrom[0]),
            Number(splitConstOpeningDaysFrom[1]),
            0,
            0
          );
        }
      }

      if (constOpeningDays.to) {
        const splitConstOpeningDaysTo: string[] =
          constOpeningDays.to.split(":");
        if (splitConstOpeningDaysTo.length === 2) {
          validconstOpeningDaysTo = new Date(
            Number(aYear),
            Number(aMonth) - 1,
            Number(aDay),
            Number(splitConstOpeningDaysTo[0]),
            Number(splitConstOpeningDaysTo[1]),
            0,
            0
          );
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
            validconstOpeningDaysFrom = new Date(
              Number(aYear),
              Number(aMonth) - 1,
              Number(aDay),
              Number(splitConstOpeningDaysFrom[0]),
              Number(splitConstOpeningDaysFrom[1]),
              0,
              0
            );
          }
        }

        if (itemOpeningDays.to) {
          const splitConstOpeningDaysTo: string[] =
            itemOpeningDays.to.split(":");
          if (splitConstOpeningDaysTo.length === 2) {
            validconstOpeningDaysTo = new Date(
              Number(aYear),
              Number(aMonth) - 1,
              Number(aDay),
              Number(splitConstOpeningDaysTo[0]),
              Number(splitConstOpeningDaysTo[1]),
              0,
              0
            );
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
      isDisabledDateMax || isDisabledDateMin || isDisabledDateDays;

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
            ? colorOpening
            : "transparent"
        }
        heightMinutes={heightMinutes}
        onMouseDown={handleOnMouseDown}
        onMouseEnter={handleOnMouseEnter}
        onContextMenu={handleRightClick}
        isDisabledDate={isDisabledDate}
        validIsDateOpening={validIsDateOpening && !isDateBetween}
      />
    );
  };
export default CalendarClickedWeekDayItemMinute;
