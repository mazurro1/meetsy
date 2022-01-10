import styled from "styled-components";

export const NavUpStyle = styled.div<{
  navBackgroundColor: string;
}>`
  position: fixed;
  z-index: 90;
  top: 0;
  left: 0;
  right: 0;
  height: 70px;
  background-color: ${(props) => props.navBackgroundColor};
`;

export const PositionElementsNav = styled.div`
  display: flex;
  flex-wrap: nowrap;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  height: 70px;
  padding-top: 10px;
  padding-bottom: 10px;
`;

export const MenuStyle = styled.div<{
  primaryColor: string;
}>`
  height: 40px;
  width: 40px;
  cursor: pointer;
  P {
    &:hover {
      color: ${(props) => props.primaryColor};
    }
  }
`;
