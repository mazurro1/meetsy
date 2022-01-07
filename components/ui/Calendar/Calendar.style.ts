import styled from "styled-components";

export const CalendarStyle = styled.div`
  width: 350px;
  min-height: 420px;
  background-color: grey;
  border-radius: 5px;
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
}>`
  height: 50px;
  width: 50px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 5px;
  cursor: pointer;
  margin-left: ${(props) => props.indexDay * 50 + "px"};
  background-color: ${(props) =>
    props.isActiveDay ? "red" : "rgba (0, 0, 0, 0)"};
  user-select: none;

  &:hover {
    background-color: ${(props) =>
      props.isActiveDay ? "red" : "rgba(0, 0, 0, 0.1)"};
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
