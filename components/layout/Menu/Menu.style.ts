import styled from "styled-components";

export const MenuStyle = styled.div<{
  menuEnable: boolean;
  backgroundColorPage: string;
}>`
  position: fixed;
  z-index: 2000;
  top: 0;
  bottom: 0;
  left: 0;
  width: 300px;
  max-width: 100vw;
  background-color: ${(props) => props.backgroundColorPage};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding-left: 10px;
  padding-right: 10px;
  transform: ${(props) =>
    props.menuEnable ? "translateX(0px)" : "translateX(-100%)"};
  transition-property: transform;
  transition-duration: 0.3s;
  transition-timing-function: ease;
`;

export const ButtonMenuStyle = styled.div`
  width: 100%;
  margin-top: 10px;
`;
