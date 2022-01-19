import styled from "styled-components";

export const LayoutPageColor = styled.div<{
  color: string;
}>`
  background-color: ${(props) => props.color};
  transition-property: background-color;
  transition-duration: 0.3s;
  transition-timing-function: ease;
`;

export const MinHeightContent = styled.div<{
  heightElements: number;
}>`
  min-height: ${(props) => `calc(100vh - ${props.heightElements}px)`};
  padding-bottom: 20px;
`;

export const LoadingStyle = styled.div`
  width: 50px;
  height: 50px;
  animation-name: spinner;
  animation-duration: 0.9s;
  animation-timing-function: linear;
  animation-iteration-count: infinite;
`;
