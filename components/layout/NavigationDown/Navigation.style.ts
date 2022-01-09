import styled from "styled-components";

export const NavigationDownStyle = styled.div<{
  navDownBackgroundColor: string;
}>`
  position: relative;
  z-index: 90;
  margin-top: 70px;
  background-color: ${(props) => props.navDownBackgroundColor};
  padding-top: 20px;
  padding-bottom: 10px;
  height: 137px;
  overflow: hidden;
  transition-property: background-color, color, padding, opacity, margin;
  transition-timing-function: ease;
  transition-duration: 0.3s;
`;
