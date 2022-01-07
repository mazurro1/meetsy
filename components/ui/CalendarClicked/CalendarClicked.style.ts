import styled from "styled-components";

export const CalendarClickedStyle = styled.div`
  position: relative;
  display: inline-flex;
  flex-wrap: nowrap;
  justify-content: flex-start;
  align-items: flex-start;
  border-radius: 5px;
  overflow: hidden;
  width: 100%;
`;

export const DayCalendar = styled.div<{
  daysToShow: number;
  clientWidthCalendar: number;
}>`
  position: relative;
  width: ${(props) =>
    `calc(${props.clientWidthCalendar - 50}px/${props.daysToShow})`};
  display: flex;
  flex-wrap: wrap;
  flex-direction: column;
  z-index: 1;
  opacity: 0.85;
  overflow: hidden;
  transition-property: opacity;
  transition-duration: 0.3s;
  transition-timing-function: ease;

  &:hover {
    z-index: 10;
    opacity: 1;
    overflow: visible;
  }
`;

export const DayHourCalendar = styled.div`
  display: flex;
  flex-wrap: wrap;
  flex-direction: column;
  text-align: center;
  overflow: hidden;
`;

export const DayCalendarHour = styled.div`
  width: 100px;
  display: flex;
  flex-wrap: wrap;
  flex-direction: column;
`;

export const DayCalendarName = styled.div<{
  background: string;
  borderColorLight: string;
}>`
  position: relative;
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

export const DayCalendarItemMinutes = styled.div.attrs(
  ({ color }: { color: string }) => ({
    style: {
      backgroundColor: color,
    },
  })
)<{
  heightMinutes: number;
  isDisabledDate: boolean;
  validIsDateOpening: boolean;
  dragActive: boolean;
  opacity: number;
}>`
  user-select: none;
  cursor: ${(props) => (props.isDisabledDate ? "no-drop" : "default")};
  height: ${(props) => props.heightMinutes + "px"};
  opacity: ${(props) => props.opacity};
  transition-property: ${(props) => (props.dragActive ? "opacity" : "opacity")};
  transition-duration: 0.1s;
  transition-timing-function: ease;
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

export const ActiveItemStyle = styled.div.attrs(
  ({ width, left }: { width: string; left: number }) => ({
    style: {
      width: width,
      left: left + "px",
    },
  })
)<{
  top: number;
  itemsBetweenMote2: boolean;
  height: number;
  margin: number;
  colorBackground: string;
  dragActive: boolean;
  left: number;
  allItemsRowLength: number;
  minWidthAndHeightEvent: number;
  paddingEvents: string;
  selectedItemsLength: number;
  borderColor: string;
  width: string;
}>`
  position: absolute;
  display: flex;
  justify-content: ${(props) =>
    props.itemsBetweenMote2 ? "flex-start" : "flex-start"};
  align-items: center;
  flex-direction: ${(props) => (props.itemsBetweenMote2 ? "column" : "column")};
  z-index: ${(props) => (props.dragActive ? -1 : 1)};
  top: ${(props) => props.top + "px"};
  min-width: ${(props) => props.minWidthAndHeightEvent + "px"};
  border-radius: 5px;
  background-color: ${(props) => props.colorBackground};
  min-height: ${(props) =>
    props.itemsBetweenMote2 ? "90px" : props.minWidthAndHeightEvent + "px"};
  height: ${(props) => props.height + "px"};
  margin-left: ${(props) => props.margin + "px"};
  margin-right: ${(props) => props.margin + "px"};
  border: 1px solid ${(props) => props.borderColor};
  cursor: pointer;
  padding: ${(props) => props.paddingEvents};
  opacity: ${(props) => (props.dragActive ? 0.5 : 0.9)};
  transition-property: opacity;
  transition-duration: 0.3s;
  transition-timing-function: ease;

  animation-name: calendarEventAnimation;
  animation-duration: 0.3s;
  animation-timing-function: ease;
  animation-iteration-count: 1;

  &:hover {
    z-index: ${(props) =>
      props.dragActive ? (props.selectedItemsLength > 0 ? -1 : 10) : 10};
    opacity: ${(props) =>
      props.dragActive ? (props.selectedItemsLength > 0 ? 0.5 : 1) : 1};

    &:hover {
      #eventTooltip {
        opacity: 1;
        visibility: visible;
      }
    }
  }

  #eventTooltip {
    position: absolute;
    bottom: calc(100% + 10px);
    left: 50%;
    transform: translateX(-50%);
    padding: 5px;
    width: 100px;
    background-color: rgba(0, 0, 0, 0.8);
    border-radius: 5px;
    visibility: hidden;
    opacity: 0;
    transition: visibility 0s, opacity 0.5s ease;

    p {
      font-size: 0.9rem;
    }
  }
`;

export const PositionConetntTooltipAndtext = styled.div`
  position: relative;
`;

export const ActiveItemContent = styled.div`
  position: relative;
  overflow: hidden;
`;

export const ActiveItemDateStyle = styled.div<{
  isMultiEvents: boolean;
}>`
  writing-mode: ${(props) =>
    props.isMultiEvents ? "vertical-rl" : "horizontal-tb"};
  text-orientation: mixed;

  p {
    font-size: 0.75rem;
    font-family: "Poppins-Bold", sans-serif;
    white-space: nowrap;
    margin: 0;
    padding-top: ${(props) => (props.isMultiEvents ? "5px" : "0")};
  }
`;

export const EventsCountStyle = styled.div`
  position: relative;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  margin-top: 0.5rem;
  svg {
    height: 30px;
  }
`;

export const EventsCountStylePosition = styled.div<{
  color: string;
}>`
  position: relative;
  cursor: pointer;
  color: ${(props) => props.color};
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
  user-select: none;
`;

export const ButtonsChangeDate = styled.div`
  margin: 10px;
  margin-bottom: 20px;
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: space-around;
  align-items: center;
`;

export const SmallDateStyle = styled.div`
  font-size: 0.75rem;
`;
