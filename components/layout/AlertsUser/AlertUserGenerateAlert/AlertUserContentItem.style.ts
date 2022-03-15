import styled from "styled-components";

export const AlertUserStyle = styled.div<{
  backgroundColor: string;
}>`
  position: relative;
  width: 100%;
  padding: 5px 10px;
  padding-bottom: 20px;
  background-color: ${(props) => props.backgroundColor};
  margin: 5px 0px;
  border-radius: 5px;
`;

export const PositionDateAlert = styled.div`
  position: absolute;
  bottom: 0px;
  right: 5px;
`;
