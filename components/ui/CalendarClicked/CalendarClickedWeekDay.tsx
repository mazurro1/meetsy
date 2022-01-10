import type { NextPage } from "next";
import {
  DayCalendar,
  DayCalendarName,
  AllItemsHours,
  EventsCountStyle,
  PostionRelative,
  CountStyle,
  EventsCountStylePosition,
} from "./CalendarClicked.style";
import { Heading, Paragraph, GenerateIcons, Tooltip } from "@ui";
import CalendarClickedWeekDayItem from "./CalendarClickedWeekDayItem";
import { getFullDate, getDateFromString } from "@functions";
import type {
  SelectedItemProps,
  EventsActiveProps,
  CountsFilterEvents,
  CalendarClickedWeekDayProps,
  DisabledDayProps,
  OpeningDaysProps,
  ConstOpeningDaysProps,
} from "./CalendarClicked.model";
import { useState } from "react";
import shortid from "shortid";
import CalendarClickedWeekDayEvent from "./CalendarClickedWeekDayEvent";
import { withTranslates } from "@hooks";
import type { ITranslatesProps } from "@hooks";

const CalendarClickedWeekDay: NextPage<
  CalendarClickedWeekDayProps & ITranslatesProps
> = ({
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
  handleClickEvent,
  itemsOfMinutes,
  colorCountEvents,
  backgroundCountEvents,
  handleAddEvent,
  minDate,
  maxDate,
  colorDisabledMinMaxDate,
  disabledDays = [],
  constOpeningDays = [],
  openingDays = [],
  colorOpening,
  daysToShow,
  clientWidthCalendar,
  texts,
  actualDate,
}) => {
  const [selectedItems, setSelectedItems] = useState<SelectedItemProps[]>([]);
  const [dragActive, setDragActive] = useState<boolean>(false);

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
      const newValues: SelectedItemProps[] = [...prevState, item];
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
  const filterDisabledDate: DisabledDayProps[] = disabledDays.filter(
    (itemDisabledDay) => {
      const fullDateMin: string = getFullDate(itemDisabledDay.from);
      const fullDateMax: string = getFullDate(itemDisabledDay.to);
      if (fullDateMin === fullDate || fullDateMax === fullDate) {
        return true;
      }
      return false;
    }
  );

  const filterOpeningDays: OpeningDaysProps[] = openingDays.filter(
    (itemOpeningDays) => {
      return itemOpeningDays.fullDate === fullDate;
    }
  );

  const dateWeekId: number = date.getDay();

  const findConstOpeningDay: ConstOpeningDaysProps | undefined =
    constOpeningDays.find((itemOpeningDay) => {
      return itemOpeningDay.weekId === dateWeekId;
    });

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
        minDate={minDate}
        maxDate={maxDate}
        colorDisabledMinMaxDate={colorDisabledMinMaxDate}
        disabledDays={filterDisabledDate}
        constOpeningDays={findConstOpeningDay}
        openingDays={filterOpeningDays}
        colorOpening={colorOpening}
        actualDate={actualDate}
      />
    );
  });

  const filterEventsActive: EventsActiveProps[] = eventsActive.filter(
    (oneEventActive) => {
      const dateToCompareMinToValid = getDateFromString(fullDate, 0, 0, 0, 0);
      const dateToCompareMaxToValid = getDateFromString(
        fullDate,
        23,
        59,
        59,
        59
      );
      if (dateToCompareMinToValid && dateToCompareMaxToValid) {
        if (
          oneEventActive.minDate >= dateToCompareMinToValid &&
          oneEventActive.maxDate <= dateToCompareMaxToValid
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
    const findItemInCountsIndex: number = countsFilterEventsActive.findIndex(
      (itemCount) => {
        const valid1 =
          itemCount.minDate >= itemFiltereventActive.minDate &&
          itemCount.minDate <= itemFiltereventActive.maxDate;
        const valid2 =
          itemCount.maxDate <= itemFiltereventActive.maxDate &&
          itemCount.maxDate > itemFiltereventActive.minDate;
        const valid3 =
          itemCount.minDate <= itemFiltereventActive.minDate &&
          itemCount.maxDate > itemFiltereventActive.minDate;
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
      const updateItem: CountsFilterEvents = {
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
      const newItemCount: CountsFilterEvents = {
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
        const isThisId: boolean = itemCountFilter.itemsId.some(
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
        selectedItemsLength={selectedItems.length}
        widthOneEvent={(clientWidthCalendar - 100) / daysToShow}
      />
    );
  });
  return (
    <DayCalendar
      daysToShow={daysToShow}
      clientWidthCalendar={clientWidthCalendar}
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
        <EventsCountStyle>
          <Tooltip text={texts?.countEvents ? texts?.countEvents : ""}>
            <EventsCountStylePosition color={colorCountEvents}>
              <GenerateIcons iconName="ClipboardListIcon" />
              <CountStyle background={backgroundCountEvents}>
                {filterEventsActive.length}
              </CountStyle>
            </EventsCountStylePosition>
          </Tooltip>
          <Tooltip text={texts?.addEvent ? texts?.addEvent : ""}>
            <EventsCountStylePosition
              onClick={() => handleAddEvent(fullDate)}
              color={colorCountEvents}
            >
              <GenerateIcons iconName="PlusCircleIcon" />
            </EventsCountStylePosition>
          </Tooltip>
        </EventsCountStyle>
      </DayCalendarName>
      <PostionRelative>
        <AllItemsHours
          onMouseDown={handleOnDrag}
          onMouseUp={handleOnDragExit}
          onMouseLeave={handleOnDragLeave}
        >
          {mapAllHours}
          {mapActiveItems}
        </AllItemsHours>
      </PostionRelative>
    </DayCalendar>
  );
};

export default withTranslates(CalendarClickedWeekDay, "CalendarClicked");
