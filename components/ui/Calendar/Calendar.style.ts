import styled from "styled-components";

export const CalendarStyle = styled.div<{
  backgroundPage: string;
}>`
  position: relative;
  width: 370px;
  min-height: 420px;
  background-color: ${(props) => props.backgroundPage};
  border-radius: 5px;
  padding: 10px;
  padding-top: 5px;
`;

export const CalendarAllDaysStyle = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: flex-start;
  align-items: flex-start;
`;

export const CenterTitle = styled.div`
  text-align: center;
`;

export const CalendarOneDayStyle = styled.div<{
  indexDay: number;
  isActiveDay?: boolean;
  activeColor: string;
  isDisabled: boolean;
}>`
  height: 50px;
  width: 50px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 5px;
  cursor: ${(props) => (props.isDisabled ? "no-drop" : "pointer")};
  margin-left: ${(props) => props.indexDay * 50 + "px"};
  background-color: ${(props) =>
    props.isActiveDay ? props.activeColor : "rgba (0, 0, 0, 0)"};
  user-select: none;

  &:hover {
    background-color: ${(props) =>
      !props.isDisabled
        ? props.isActiveDay
          ? props.activeColor
          : "rgba(0, 0, 0, 0.1)"
        : props.isActiveDay
        ? props.activeColor
        : "rgba(0, 0, 0, 0)"};
  }
`;

export const CalendarNameDayStyle = styled.div`
  height: 50px;
  width: 50px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

export const PrevMontchStyle = styled.div`
  position: absolute;
  left: 0;
  top: -38px;
`;

export const NextMontchStyle = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: flex-start;
  margin-top: 10px;
`;
