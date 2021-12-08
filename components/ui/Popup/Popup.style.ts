import styled from "styled-components";

export const TitlePagePopup = styled.div<{
  colorTextNav: string;
  colorBackgroundNav: string;
  smallTitle: boolean;
}>`
  position: relative;
  top: 0;
  left: 0;
  right: 0;
  background-color: ${(props) => props.colorBackgroundNav};
  color: ${(props) => props.colorTextNav};
  padding: 5px 10px;
  padding-right: 35px;
  overflow: hidden;
  box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.2) inset;

  h1 {
    font-size: 1.4rem;
    font-family: "Poppins-Medium", sans-serif;
  }
  h2 {
    font-size: 1.2rem;
    font-family: "Poppins-Medium", sans-serif;
  }
`;

export const PopupWindow = styled.div<{
  position: string;
  borderRadius: boolean;
  top: string;
  bottom: string;
  lightBackground: boolean;
}>`
  position: ${(props) => props.position};
  top: ${(props) => props.top};
  right: 0;
  left: 0;
  bottom: ${(props) => props.bottom};
  background-color: ${(props) =>
    props.lightBackground ? "rgba(0, 0, 0, 0.20)" : "rgba(0, 0, 0, 0.85)"};
  z-index: 600;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: ${(props) => (props.borderRadius ? "5px" : "0px")};
  cursor: default;
`;

export const PopupContent = styled.div<{
  maxWidth: number;
  fullScreen: boolean;
  overflowComponent: boolean;
  maxHeight: boolean;
  heightFull: boolean;
}>`
  position: relative;
  background-color: white;
  max-width: ${(props) => props.maxWidth + "px"};
  width: 90%;
  height: ${(props) =>
    props.fullScreen ? "100vh" : props.heightFull ? "100vh" : "auto"};
  margin: 0 auto;
  border-radius: 5px;
  max-height: ${(props) => (props.maxHeight ? "90vh" : "auto")};
  overflow: ${(props) => (props.overflowComponent ? "hidden" : "auto")};
`;

export const PaddingContnent = styled.div<{
  maxHeight: boolean;
  colorBackground: string;
}>`
  padding: 10px 15px;
  overflow-y: auto;
  overflow-x: hidden;
  min-height: ${(props) => (props.maxHeight ? "calc(100% - 41px)" : "auto")};
  max-height: ${(props) => (props.maxHeight ? "calc(90vh - 41px)" : "auto")};
  background-color: ${(props) => props.colorBackground};
`;

export const ClosePopup = styled.div<{
  isTitleOn: boolean;
  smallTitle: boolean;
  colorTextNav: string;
  colorCloseNavHover: string;
}>`
  position: absolute;
  top: 0px;
  right: 0px;
  width: 44px;
  padding: ${(props) => (props.smallTitle ? "4px" : "7px")};
  cursor: pointer;
  color: ${(props) => props.colorTextNav};
  transition-property: color;
  transition-duration: 0.3s;
  transition-timing-function: ease;
  &:hover {
    color: ${(props) => props.colorCloseNavHover};
  }
`;

export const ContentNoBorder = styled.div`
  border: none;
  outline: none;
  &:active,
  &:focus {
    border: none;
    outline: none;
  }
`;
