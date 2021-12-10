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
  width: calc((1170px / 8) + (50px / 7));
  display: flex;
  flex-wrap: wrap;
  flex-direction: column;
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
    props.active ? props.colorDrag : props.borderColorLight};
  user-select: none;
  &:hover {
    background-color: ${(props) => props.colorDrag};
  }
`;

export const AllItemsHours = styled.div`
  user-select: none;
  position: relative;
`;

export const ActiveItemStyle = styled.div<{
  top: number;
  itemsBetween: number;
}>`
  position: absolute;
  top: ${(props) => props.top + "px"};
  width: ${(props) => `calc(151px / ${props.itemsBetween + 1})`};
  border-radius: 5px;
  background-color: red;
`;
