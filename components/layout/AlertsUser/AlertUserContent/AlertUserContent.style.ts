import styled from "styled-components";

export const PositionAllAlerts = styled.div<{
  isMobile: boolean;
}>`
  position: absolute;
  display: flex;
  right: ${(props) => (props.isMobile ? "-25px" : 0)};
  top: calc(100% + 10px);
  width: 300px;
  min-height: 100px;
  max-height: 200px;
  background-color: rgba(0, 0, 0, 0.8);
  border-radius: 5px;
  padding-bottom: 5px;
  padding-top: 5px;
  padding-right: 5px;
`;
