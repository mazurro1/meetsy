import styled from "styled-components";

export const LoadingStyle = styled.div<{
  size: number;
}>`
  width: ${(props) => props.size + "px"};
  height: ${(props) => props.size + "px"};
  animation-name: spinner;
  animation-duration: 0.9s;
  animation-timing-function: linear;
  animation-iteration-count: infinite;
`;
