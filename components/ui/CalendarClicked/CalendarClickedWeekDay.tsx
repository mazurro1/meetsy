import type { NextPage } from "next";
import {
  DayCalendar,
  DayCalendarName,
  AllItemsHours,
  ActiveItemStyle,
} from "./CalendarClicked.style";
import { Heading, Paragraph } from "@ui";
import CalendarClickedWeekDayItem from "./CalendarClickedWeekDayItem";
import { getFullDate } from "@functions";
import type {
  ArrayHoursProps,
  SelectedItemProps,
  ItemActiveProps,
} from "./CalendarClicked.model";
import { useState } from "react";

const CalendarClickedWeekDay: NextPage<{
  date: Date;
  name: string;
  colorBackground: string;
  filterAllHours: ArrayHoursProps[];
  minutesInHour: number;
  heightMinutes: number;
  handleAddActiveItem: (item: ItemActiveProps) => void;
  colorDrag: string;
  borderColor: string;
  borderColorLight: string;
  itemsActive: ItemActiveProps[];
}> = ({
  date,
  name,
  colorBackground,
  filterAllHours,
  minutesInHour,
  heightMinutes,
  handleAddActiveItem,
  colorDrag,
  borderColor,
  borderColorLight,
  itemsActive,
}) => {
  const [selectedItems, setSelectedItems] = useState<SelectedItemProps[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const handleOnDrag = () => {
    setDragActive(true);
    if (selectedItems.length > 0) {
      setSelectedItems([]);
    }
  };
  const handleOnDragLeave = () => {
    setDragActive(false);
    setSelectedItems([]);
  };

  const handleAddItem = (item: SelectedItemProps) => {
    setSelectedItems((prevState) => {
      const newValues = [...prevState, item];
      newValues.sort((a, b) => {
        if (a.validDateMin < b.validDateMin) return -1;
        if (a.validDateMin > b.validDateMin) return 1;
        return 0;
      });
      newValues.sort();
      return newValues;
    });
  };

  let firstElementSelectedItems: SelectedItemProps | null = null;
  let lastElementSelectedItems: SelectedItemProps | null = null;

  if (selectedItems.length >= 2) {
    firstElementSelectedItems = selectedItems[0];
    lastElementSelectedItems = selectedItems[selectedItems.length - 1];
  }

  const handleOnDragExit = () => {
    setDragActive(false);
    if (selectedItems.length >= 2) {
      const newItemToAddToActive: ItemActiveProps = {
        minDate: selectedItems[0].validDateMin,
        maxDate: selectedItems[selectedItems.length - 1].validDateMax,
      };
      handleAddActiveItem(newItemToAddToActive);
    } else if (selectedItems.length === 1) {
      const newItemToAddToActive: ItemActiveProps = {
        minDate: selectedItems[0].validDateMin,
        maxDate: selectedItems[0].validDateMax,
      };
      handleAddActiveItem(newItemToAddToActive);
    }
  };

  const fullDate: string = getFullDate(date);

  const mapAllHours = filterAllHours.map((itemHour, indexItemHour) => {
    return (
      <CalendarClickedWeekDayItem
        key={itemHour.index}
        itemHour={itemHour}
        minutesInHour={minutesInHour}
        dragActive={dragActive}
        fullDate={fullDate}
        handleAddItem={handleAddItem}
        selectedItems={selectedItems}
        indexItemHour={indexItemHour}
        firstElementSelectedItems={firstElementSelectedItems}
        lastElementSelectedItems={lastElementSelectedItems}
        heightMinutes={heightMinutes}
        colorDrag={colorDrag}
        borderColor={borderColor}
        borderColorLight={borderColorLight}
      />
    );
  });

  const filterItemsActive: ItemActiveProps[] = itemsActive.filter(
    (oneItemActive) => {
      const splitFullDate = fullDate.split("-");
      if (splitFullDate.length === 3) {
        const dateToCompareMin = new Date(
          Number(splitFullDate[2]),
          Number(splitFullDate[1]) - 1,
          Number(splitFullDate[0]),
          0,
          0,
          0,
          0
        );
        const dateToCompareMax = new Date(
          Number(splitFullDate[2]),
          Number(splitFullDate[1]) - 1,
          Number(splitFullDate[0]),
          23,
          59,
          59,
          59
        );
        if (
          oneItemActive.minDate >= dateToCompareMin &&
          oneItemActive.maxDate <= dateToCompareMax
        ) {
          return true;
        }
      }
      return false;
    }
  );
  filterItemsActive.sort((a, b) => {
    if (a.minDate < b.minDate) return -1;
    if (a.minDate > b.minDate) return 1;
    return 0;
  });

  const mapActiveItems = filterItemsActive.map(
    (activeItem, indexActiveItem) => {
      console.log(activeItem);
      return (
        <ActiveItemStyle
          top={heightMinutes}
          itemsBetween={0}
          key={indexActiveItem}
        >
          xd
        </ActiveItemStyle>
      );
    }
  );
  return (
    <DayCalendar>
      <DayCalendarName
        background={colorBackground}
        borderColorLight={borderColorLight}
      >
        <Heading marginBottom={0} marginTop={0} color="WHITE" tag={4}>
          {name}
        </Heading>
        <Paragraph marginBottom={0} color="WHITE" marginTop={0.2}>
          {fullDate}
        </Paragraph>
      </DayCalendarName>
      <AllItemsHours
        onMouseDown={handleOnDrag}
        onMouseUp={handleOnDragExit}
        onMouseLeave={handleOnDragLeave}
      >
        {mapAllHours}
        {mapActiveItems}
      </AllItemsHours>
    </DayCalendar>
  );
};
export default CalendarClickedWeekDay;
