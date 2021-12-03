import styled from "styled-components";

export const LayoutPageColor = styled.div<{
  color: string;
}>`
  background-color: ${(props) => props.color};
  transition-property: background-color;
  transition-duration: 0.3s;
  transition-timing-function: ease;
`;
