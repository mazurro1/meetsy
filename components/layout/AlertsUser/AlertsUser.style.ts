import styled from "styled-components";

export const BellUserStyle = styled.button<{
  colorActiveBell: string;
  isOpen: boolean;
}>`
  position: relative;
  background-color: ${(props) =>
    props.isOpen ? props.colorActiveBell : "rgba(0, 0, 0, 0.2)"};
  padding: 4px;
  border-radius: 5px;
  cursor: pointer;
  border: none;
  transition-property: background-color;
  transition-duration: 0.3s;
  transition-timing-function: ease-in-out;
  svg {
    height: 21px;
  }
  p {
    line-height: 0px;
  }
  &:hover {
    svg {
      animation-name: ringing;
      animation-duration: 1s;
      animation-timing-function: inline;
      animation-iteration-count: 1;
    }
  }
`;

export const PositionRelatve = styled.div`
  position: relative;
`;

export const CountAlertsStyle = styled.div<{
  colorCountAlerts: string;
}>`
  position: absolute;
  bottom: 70%;
  left: 80%;
  padding: 10px 5px;
  border-radius: 5px;
  background-color: ${(props) => props.colorCountAlerts};
  user-select: none;
`;
