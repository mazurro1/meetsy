import type { NextPage } from "next";
import { DayCalendarItem } from "./CalendarClicked.style";
import type { CalendarClickedWeekDayItemProps } from "./CalendarClicked.model";
import CalendarClickedWeekDayItemMinute from "./CalendarClickedWeekDayItemMinute";

const CalendarClickedWeekDayItem: NextPage<CalendarClickedWeekDayItemProps> = ({
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
  itemsOfMinutes,
  minDate,
  maxDate,
  colorDisabledMinMaxDate,
  disabledDays,
  constOpeningDays = null,
  openingDays = [],
  colorOpening,
  actualDate,
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
        minDate={minDate}
        maxDate={maxDate}
        colorDisabledMinMaxDate={colorDisabledMinMaxDate}
        disabledDays={disabledDays}
        constOpeningDays={constOpeningDays}
        openingDays={openingDays}
        colorOpening={colorOpening}
        actualDate={actualDate}
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
