import styled from "styled-components";

export const NavUpStyle = styled.div<{
  navBackgroundColor: string;
}>`
  position: fixed;
  z-index: 100;
  top: 0;
  left: 0;
  right: 0;
  padding: 10px 0;
  height: 70px;
  background-color: ${(props) => props.navBackgroundColor};
`;
