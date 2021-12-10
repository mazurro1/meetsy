import type { NextPage } from "next";
import { DayCalendarItem } from "./CalendarClicked.style";
import type {
  ArrayHoursProps,
  SelectedItemProps,
} from "./CalendarClicked.model";
import CalendarClickedWeekDayItemMinute from "./CalendarClickedWeekDayItemMinute";

const CalendarClickedWeekDayItem: NextPage<{
  itemHour: ArrayHoursProps;
  minutesInHour: number;
  dragActive: boolean;
  fullDate: string;
  handleAddItem: (item: SelectedItemProps) => void;
  selectedItems: SelectedItemProps[];
  indexItemHour: number;
  lastElementSelectedItems: SelectedItemProps | null;
  firstElementSelectedItems: SelectedItemProps | null;
  heightMinutes: number;
  colorDrag: string;
  borderColor: string;
  borderColorLight: string;
}> = ({
  itemHour,
  minutesInHour,
  dragActive,
  fullDate,
  handleAddItem,
  selectedItems,
  indexItemHour,
  lastElementSelectedItems,
  firstElementSelectedItems,
  heightMinutes,
  colorDrag,
  borderColor,
  borderColorLight,
}) => {
  const itemsOfMinutes = [];
  const countOfMinutes = 60 / minutesInHour;
  for (let i = 1; i <= countOfMinutes; i++) {
    const newItemMinute = {
      index: i,
      minMinute: i * minutesInHour - 5,
      maxMinute: i * minutesInHour,
    };
    itemsOfMinutes.push(newItemMinute);
  }

  const mapMinutes = itemsOfMinutes.map((itemMinute) => {
    return (
      <CalendarClickedWeekDayItemMinute
        key={itemMinute.index}
        index={itemMinute.index}
        minMinute={itemMinute.minMinute}
        maxMinute={itemMinute.maxMinute}
        dragActive={dragActive}
        hour={itemHour.hour}
        fullDate={fullDate}
        handleAddItem={handleAddItem}
        selectedItems={selectedItems}
        lastElementSelectedItems={lastElementSelectedItems}
        firstElementSelectedItems={firstElementSelectedItems}
        heightMinutes={heightMinutes}
        colorDrag={colorDrag}
        borderColor={borderColor}
        borderColorLight={borderColorLight}
      />
    );
  });
  return (
    <DayCalendarItem index={indexItemHour} borderColor={borderColor}>
      {mapMinutes}
    </DayCalendarItem>
  );
};
export default CalendarClickedWeekDayItem;
