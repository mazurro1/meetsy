import type { NextPage } from "next";
import { DayCalendarItemMinutes } from "./CalendarClicked.style";
import type { SelectedItemProps } from "./CalendarClicked.model";

interface CalendarClickedWeekDayItemMinuteProps {
  index: number;
  minMinute: number;
  maxMinute: number;
  dragActive: boolean;
  hour: string;
  fullDate: string;
  handleAddItem: (item: SelectedItemProps) => void;
  selectedItems: SelectedItemProps[];
  lastElementSelectedItems: SelectedItemProps | null;
  firstElementSelectedItems: SelectedItemProps | null;
  heightMinutes: number;
  colorDrag: string;
  borderColor: string;
  borderColorLight: string;
}

const CalendarClickedWeekDayItemMinute: NextPage<CalendarClickedWeekDayItemMinuteProps> =
  ({
    index,
    minMinute,
    maxMinute,
    dragActive,
    hour,
    fullDate,
    handleAddItem,
    selectedItems,
    lastElementSelectedItems,
    firstElementSelectedItems,
    heightMinutes,
    colorDrag,
    borderColor,
    borderColorLight,
  }) => {
    const [aHour] = hour.split(":");
    const [aDay, aMonth, aYear] = fullDate.split("-");
    const validDateMin = new Date(
      Number(aYear),
      Number(aMonth) - 1,
      Number(aDay),
      Number(aHour),
      minMinute
    );

    const validDateMax = new Date(
      Number(aYear),
      Number(aMonth) - 1,
      Number(aDay),
      Number(aHour),
      maxMinute
    );

    const newItem: SelectedItemProps = {
      hour: hour,
      fullDate: fullDate,
      minMinute: minMinute,
      maxMinute: maxMinute,
      validDateMin: validDateMin,
      validDateMax: validDateMax,
    };

    let isDateBetween = false;

    if (!!firstElementSelectedItems && !!lastElementSelectedItems) {
      if (
        validDateMin >= firstElementSelectedItems.validDateMin &&
        validDateMin <= lastElementSelectedItems.validDateMin
      ) {
        isDateBetween = true;
      }
    }

    const isActive = selectedItems.some((itemSelected) => {
      return JSON.stringify(itemSelected) === JSON.stringify(newItem);
    });

    const handleOnMouseEnter = () => {
      if (dragActive && !isActive) {
        handleAddItem(newItem);
      }
    };

    const handleOnMouseDown = () => {
      if (!isActive) {
        handleAddItem(newItem);
      }
    };

    return (
      <DayCalendarItemMinutes
        active={dragActive ? isActive || isDateBetween : false}
        onMouseEnter={handleOnMouseEnter}
        onMouseDown={handleOnMouseDown}
        heightMinutes={heightMinutes}
        colorDrag={colorDrag}
        borderColor={borderColor}
        borderColorLight={borderColorLight}
      />
    );
  };
export default CalendarClickedWeekDayItemMinute;
