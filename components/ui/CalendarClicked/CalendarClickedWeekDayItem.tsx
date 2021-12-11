import type { NextPage } from "next";
import { DayCalendarItem } from "./CalendarClicked.style";
import type {
  ArrayHoursProps,
  SelectedItemProps,
  ItemMinuteProps,
} from "./CalendarClicked.model";
import CalendarClickedWeekDayItemMinute from "./CalendarClickedWeekDayItemMinute";
import { useEffect, useState } from "react";

const CalendarClickedWeekDayItem: NextPage<{
  itemHour: ArrayHoursProps;
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
  itemsOfMinutes: ItemMinuteProps[];
}> = ({
  itemHour,
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
  itemsOfMinutes,
}) => {
  const mapMinutes = itemsOfMinutes!.map((itemMinute) => {
    return (
      <CalendarClickedWeekDayItemMinute
        key={itemMinute.index}
        itemMinute={itemMinute}
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
