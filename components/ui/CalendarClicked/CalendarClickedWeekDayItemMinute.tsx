import type { NextPage } from "next";
import { DayCalendarItemMinutes } from "./CalendarClicked.style";
import type {
  SelectedItemProps,
  ItemMinuteProps,
} from "./CalendarClicked.model";

interface CalendarClickedWeekDayItemMinuteProps {
  itemMinute: ItemMinuteProps;
  dragActive: boolean;
  hour: string;
  fullDate: string;
  handleAddItem: (item: SelectedItemProps) => void;
  selectedItems: SelectedItemProps[];
  lastElementSelectedItems: SelectedItemProps | null;
  firstElementSelectedItems: SelectedItemProps | null;
  heightMinutes: number;
  colorDrag: string;
}

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
  }) => {
    const [aHour] = hour.split(":");
    const [aDay, aMonth, aYear] = fullDate.split("-");
    const validDateMin = new Date(
      Number(aYear),
      Number(aMonth) - 1,
      Number(aDay),
      Number(aHour),
      itemMinute.minMinute
    );

    const validDateMax = new Date(
      Number(aYear),
      Number(aMonth) - 1,
      Number(aDay),
      Number(aHour),
      itemMinute.maxMinute
    );

    const newItem: SelectedItemProps = {
      hour: hour,
      fullDate: fullDate,
      minMinute: itemMinute.minMinute,
      maxMinute: itemMinute.maxMinute,
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
        if (!!newItem) {
          handleAddItem(newItem);
        }
      }
    };

    const handleOnMouseDown = () => {
      if (!isActive) {
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
            : "transparent"
        }
        heightMinutes={heightMinutes}
        onMouseDown={handleOnMouseDown}
        onMouseEnter={handleOnMouseEnter}
        onContextMenu={handleRightClick}
      />
    );
  };
export default CalendarClickedWeekDayItemMinute;
