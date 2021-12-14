import type { NextPage } from "next";
import {
  DayCalendar,
  DayCalendarName,
  AllItemsHours,
  EventsCountStyle,
  PostionRelative,
  CountStyle,
} from "./CalendarClicked.style";
import { Heading, Paragraph, GenerateIcons, Tooltip } from "@ui";
import CalendarClickedWeekDayItem from "./CalendarClickedWeekDayItem";
import { getFullDate } from "@functions";
import type {
  ArrayHoursProps,
  SelectedItemProps,
  EventsActiveProps,
  CountsFilterEvents,
  ItemMinuteProps,
} from "./CalendarClicked.model";
import { useState } from "react";
import shortid from "shortid";
import CalendarClickedWeekDayEvent from "./CalendarClickedWeekDayEvent";

const CalendarClickedWeekDay: NextPage<{
  date: Date;
  name: string;
  colorBackground: string;
  filterAllHours: ArrayHoursProps[];
  minutesInHour: number;
  heightMinutes: number;
  handleAddActiveItem: (item: EventsActiveProps) => void;
  colorDrag: string;
  borderColor: string;
  borderColorLight: string;
  eventsActive: EventsActiveProps[];
  indexItemDay: number;
  weekDayFocused: number | null;
  handleChangeWeekDayFocused: (value: number) => void;
  handleClickEvent: (e: React.MouseEvent<HTMLElement>, eventId: string) => void;
  handleChangeEventHover: (value: string) => void;
  eventHoverId: string;
  itemsOfMinutes: ItemMinuteProps[];
  backgroundCountEvents: string;
  colorCountEvents: string;
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
  eventsActive,
  indexItemDay,
  weekDayFocused,
  handleChangeWeekDayFocused,
  handleClickEvent,
  handleChangeEventHover,
  eventHoverId,
  itemsOfMinutes,
  colorCountEvents,
  backgroundCountEvents,
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
      const newItemToAddToActive: EventsActiveProps = {
        minDate: selectedItems[0].validDateMin,
        maxDate: selectedItems[selectedItems.length - 1].validDateMax,
        id: `${shortid.generate()}-${shortid.generate()}`,
        tooltip: "tooltip",
        color: "SECOND",
        text: "text",
      };
      handleAddActiveItem(newItemToAddToActive);
    } else if (selectedItems.length === 1) {
      const newItemToAddToActive: EventsActiveProps = {
        minDate: selectedItems[0].validDateMin,
        maxDate: selectedItems[0].validDateMax,
        id: `${shortid.generate()}-${shortid.generate()}`,
        tooltip: "tooltip",
        color: "RED",
        text: "text",
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
        itemsOfMinutes={itemsOfMinutes}
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

  const filterEventsActive: EventsActiveProps[] = eventsActive.filter(
    (oneEventActive) => {
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
          oneEventActive.minDate >= dateToCompareMin &&
          oneEventActive.maxDate <= dateToCompareMax
        ) {
          return true;
        }
      }
      return false;
    }
  );
  filterEventsActive.sort((a, b) => {
    if (a.minDate < b.minDate) return -1;
    if (a.minDate > b.minDate) return 1;
    return 0;
  });

  const countsFilterEventsActive: CountsFilterEvents[] = [];

  filterEventsActive.forEach((itemFiltereventActive) => {
    const findItemInCountsIndex = countsFilterEventsActive.findIndex(
      (itemCount) => {
        const valid1 =
          itemCount.minDate >= itemFiltereventActive.minDate &&
          itemCount.minDate <= itemFiltereventActive.maxDate;
        const valid2 =
          itemCount.maxDate <= itemFiltereventActive.maxDate &&
          itemCount.maxDate >= itemFiltereventActive.minDate;
        const valid3 =
          itemCount.minDate <= itemFiltereventActive.minDate &&
          itemCount.maxDate >= itemFiltereventActive.minDate;
        const valid4 =
          itemCount.minDate >= itemFiltereventActive.minDate &&
          itemCount.maxDate >= itemFiltereventActive.maxDate;

        if (valid1 || valid2 || valid3 || valid4) {
          return true;
        }
        return false;
      }
    );
    if (findItemInCountsIndex >= 0) {
      const updateItem = {
        maxDate:
          countsFilterEventsActive[findItemInCountsIndex].maxDate >
          itemFiltereventActive.maxDate
            ? countsFilterEventsActive[findItemInCountsIndex].maxDate
            : itemFiltereventActive.maxDate,
        minDate:
          countsFilterEventsActive[findItemInCountsIndex].minDate <
          itemFiltereventActive.minDate
            ? countsFilterEventsActive[findItemInCountsIndex].minDate
            : itemFiltereventActive.minDate,
        itemsId: [
          ...countsFilterEventsActive[findItemInCountsIndex].itemsId,
          itemFiltereventActive.id,
        ],
      };
      countsFilterEventsActive[findItemInCountsIndex] = updateItem;
    } else {
      const newItemCount = {
        maxDate: itemFiltereventActive.maxDate,
        minDate: itemFiltereventActive.minDate,
        itemsId: [itemFiltereventActive.id],
      };
      countsFilterEventsActive.push(newItemCount);
    }
  });

  const mapActiveItems = filterEventsActive.map((activeEvent) => {
    const selectItemCountWhenIsItem: CountsFilterEvents | undefined =
      countsFilterEventsActive.find((itemCountFilter) => {
        const isThisId = itemCountFilter.itemsId.some(
          (itemWithId) => itemWithId === activeEvent.id
        );
        return isThisId;
      });

    return (
      <CalendarClickedWeekDayEvent
        activeEvent={activeEvent}
        filterAllHours={filterAllHours}
        minutesInHour={minutesInHour}
        heightMinutes={heightMinutes}
        key={activeEvent.id}
        dragActive={dragActive}
        selectItemCountWhenIsItem={selectItemCountWhenIsItem}
        handleClickEvent={handleClickEvent}
        handleChangeEventHover={handleChangeEventHover}
        eventHoverId={eventHoverId}
        selectedItemsLength={selectedItems.length}
      />
    );
  });
  return (
    <DayCalendar
      onMouseEnter={() => handleChangeWeekDayFocused(indexItemDay)}
      onMouseLeave={() => handleChangeWeekDayFocused(indexItemDay)}
      // onTouchStart={handleOnDrag}
      // onTouchEnd={handleOnDragExit}
    >
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
        <EventsCountStyle color={colorCountEvents}>
          <Tooltip text="Ilość zdarzeń">
            <GenerateIcons iconName="ClipboardListIcon" />
          </Tooltip>
          <CountStyle background={backgroundCountEvents}>
            {filterEventsActive.length}
          </CountStyle>
        </EventsCountStyle>
      </DayCalendarName>
      <PostionRelative>
        <AllItemsHours
          onMouseDown={handleOnDrag}
          onMouseUp={handleOnDragExit}
          onMouseLeave={handleOnDragLeave}
          // onTouchMove={handleOnDrag}
          // onTouchEnd={handleOnDragExit}
        >
          {mapAllHours}
          {mapActiveItems}
        </AllItemsHours>
      </PostionRelative>
    </DayCalendar>
  );
};
export default CalendarClickedWeekDay;
