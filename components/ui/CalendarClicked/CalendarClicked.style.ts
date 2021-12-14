import styled from "styled-components";

export const CalendarClickedStyle = styled.div`
  display: inline-flex;
  flex-wrap: nowrap;
  justify-content: flex-start;
  align-items: flex-start;
  border-radius: 5px;
  overflow: hidden;
`;

export const DayCalendar = styled.div`
  position: relative;
  width: calc((1170px / 8) + (50px / 7));
  display: flex;
  flex-wrap: wrap;
  flex-direction: column;
  z-index: 1;
  overflow: hidden;

  transition-property: opacity;
  transition-duration: 0.3s;
  transition-timing-function: ease;

  &:hover {
    z-index: 10;
    overflow: visible;
  }
`;

export const DayHourCalendar = styled.div`
  display: flex;
  flex-wrap: wrap;
  flex-direction: column;
  text-align: center;
`;

export const DayCalendarHour = styled.div`
  width: calc((1170px / 8) - 50px);
  display: flex;
  flex-wrap: wrap;
  flex-direction: column;
`;

export const DayCalendarName = styled.div<{
  background: string;
  borderColorLight: string;
}>`
  background-color: ${(props) => props.background};
  padding: 5px;
  text-align: center;
  height: 105px;
  border-left: 1px solid ${(props) => props.borderColorLight};
  border-right: 1px solid ${(props) => props.borderColorLight};
`;

export const DayCalendarNameCorner = styled.div<{
  background: string;
  borderColorLight: string;
}>`
  background-color: ${(props) => props.background};
  padding: 5px;
  text-align: center;
  height: 105px;
  border-bottom: 1px solid ${(props) => props.borderColorLight};
  border-left: 1px solid ${(props) => props.borderColorLight};
  border-right: 1px solid ${(props) => props.borderColorLight};
`;

export const ItemDayCalendarItem = styled.div`
  width: 100%;
  padding: 5px;
`;

export const ItemDayCalendarItemHour = styled.div<{
  background: string;
  height: number;
  borderColorLight: string;
}>`
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${(props) => props.background};
  height: ${(props) => props.height + 2 + "px"};
  border-top: 1px solid ${(props) => props.borderColorLight};
  border-bottom: 1px solid ${(props) => props.borderColorLight};
`;

export const DayCalendarItem = styled.div<{
  index: number;
  borderColor: string;
}>`
  border: 1px solid ${(props) => props.borderColor};
  user-select: none;
  background-color: transparent;
`;

export const DayCalendarItemMinutes = styled.div<{
  active: boolean;
  heightMinutes: number;
  colorDrag: string;
  borderColor: string;
  borderColorLight: string;
}>`
  height: ${(props) => props.heightMinutes + "px"};
  background-color: ${(props) =>
    props.active ? props.colorDrag : "transparent"};
  user-select: none;
  /* &:hover {
    background-color: ${(props) => props.colorDrag};
  } */
`;

export const PostionRelative = styled.div<{}>`
  position: relative;
`;

export const AllItemsHours = styled.div`
  user-select: none;
  position: relative;
  z-index: 10;
  background-color: transparent;
`;

export const ActiveItemStyle = styled.div<{
  top: number;
  itemsBetweenMote2: boolean;
  height: number;
  margin: number;
  colorBackground: string;
  dragActive: boolean;
  left: number;
  eventHover: boolean;
  allItemsRowLength: number;
  widthEvent: number;
  minWidthAndHeightEvent: number;
  paddingEvents: string;
  selectedItemsLength: number;
}>`
  position: absolute;
  display: flex;
  justify-content: ${(props) =>
    props.itemsBetweenMote2 ? "center" : "flex-start"};
  align-items: center;
  flex-direction: ${(props) => (props.itemsBetweenMote2 ? "column" : "column")};

  z-index: ${(props) =>
    props.dragActive
      ? props.eventHover
        ? props.selectedItemsLength > 0
          ? -1
          : 10
        : -1
      : props.eventHover
      ? 10
      : 1};
  top: ${(props) => props.top + "px"};
  left: ${(props) => props.left + "px"};
  width: ${(props) =>
    props.itemsBetweenMote2
      ? `calc(${props.widthEvent}px/${props.allItemsRowLength})`
      : props.widthEvent + "px"};
  min-width: ${(props) => props.minWidthAndHeightEvent + "px"};
  border-radius: 5px;
  background-color: ${(props) => props.colorBackground};
  min-height: ${(props) =>
    props.itemsBetweenMote2 ? "80px" : props.minWidthAndHeightEvent + "px"};
  height: ${(props) => props.height + "px"};
  margin-left: ${(props) => props.margin + "px"};
  margin-right: ${(props) => props.margin + "px"};
  border: 1px solid white;
  cursor: pointer;
  padding: ${(props) => props.paddingEvents};
  overflow: hidden;

  opacity: ${(props) =>
    props.dragActive
      ? props.eventHover
        ? props.selectedItemsLength > 0
          ? 0.5
          : 1
        : 0.5
      : props.eventHover
      ? 1
      : 0.9};
  transition-property: opacity;
  transition-duration: 0.3s;
  transition-timing-function: ease;

  animation-name: calendarEventAnimation;
  animation-duration: 0.3s;
  animation-timing-function: ease;
  animation-iteration-count: 1;

  /* &:hover {
    min-height: ${(props) => (props.itemsBetweenMote2 ? "80px" : "100px")};
  } */
`;

export const ActiveItemContent = styled.div`
  position: relative;
`;

export const ActiveItemDateStyle = styled.div<{
  isMultiEvents: boolean;
}>`
  transform: ${(props) =>
    props.isMultiEvents ? "rotate(90deg)" : "rotate(0deg)"};

  p {
    font-size: 0.75rem;
    font-family: "Poppins-Bold", sans-serif;
    white-space: nowrap;
  }
`;

export const EventsCountStyle = styled.div<{
  color: string;
}>`
  position: relative;
  color: ${(props) => props.color};
  margin-top: 0.5rem;
  svg {
    height: 30px;
  }
`;

export const CountStyle = styled.div<{
  background: string;
}>`
  position: absolute;
  top: -5px;
  left: calc(50% + 5px);
  border-radius: 50%;
  background-color: ${(props) => props.background};
  height: 20px;
  width: 20px;
  font-size: 0.9rem;
`;
