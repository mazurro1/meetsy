import styled from "styled-components";

export const CalendarClickedStyle = styled.div`
  display: inline-flex;
  flex-wrap: nowrap;
  justify-content: flex-start;
  align-items: flex-start;
  border-radius: 5px;
  overflow: hidden;
`;

export const DayCalendar = styled.div<{
  weekDayFocused: number | null;
  index: number;
}>`
  position: relative;
  width: calc((1170px / 8) + (50px / 7));
  display: flex;
  flex-wrap: wrap;
  flex-direction: column;
  z-index: ${(props) =>
    props.weekDayFocused === props.index ? props.index * 10 : props.index};
  overflow: ${(props) =>
    props.weekDayFocused === props.index ? "visible" : "hidden"};

  opacity: ${(props) =>
    props.weekDayFocused === null
      ? 1
      : props.weekDayFocused === props.index
      ? 1
      : 0.7};

  transition-property: opacity;
  transition-duration: 0.3s;
  transition-timing-function: ease;
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
  height: 64px;
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
  height: 64px;
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
}>`
  position: absolute;
  z-index: ${(props) => (props.dragActive ? -1 : 1)};
  top: ${(props) => props.top + "px"};
  left: ${(props) => props.left + "px"};
  width: ${(props) => (props.itemsBetweenMote2 ? "20px" : "120px")};
  border-radius: 5px;
  background-color: ${(props) => props.colorBackground};
  min-height: 25px;
  height: ${(props) => props.height + "px"};
  margin-left: ${(props) => props.margin + "px"};
  margin-right: ${(props) => props.margin + "px"};
  border: 1px solid white;
  cursor: pointer;

  animation-name: calendarEventAnimation;
  animation-duration: 0.3s;
  animation-timing-function: ease;
  animation-iteration-count: 1;
`;
