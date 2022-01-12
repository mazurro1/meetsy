import styled from "styled-components";
import { Colors } from "@constants";
import type { ColorsInterface } from "@constants";

export const ButtonStyle = styled.button<{
  fontSize: number;
  uppercase: boolean;
  disabled: boolean;
  mouseClick: boolean;
  sitePropsColors: ColorsInterface;
  color: string;
  type?: any;
  buttonColorHover?: string | null;
  isActive: boolean;
  buttonColorActive: string;
}>`
  border: none;
  outline: none;
  position: relative;
  padding: 4px 10px;
  border-radius: 5px;
  background-color: ${({
    color,
    disabled,
    sitePropsColors,
    isActive,
    buttonColorActive,
  }) =>
    isActive
      ? buttonColorActive
      : disabled
      ? Colors(sitePropsColors).disabled
      : color};
  color: black;
  overflow: hidden;
  color: white;
  font-size: ${(props) => props.fontSize + "px"};
  text-transform: ${(props) => (props.uppercase ? "uppercase" : "")};
  transform: ${(props) => (props.mouseClick ? `scale(0.95)` : "scale(1)")};
  user-select: none;
  min-height: 34px;
  cursor: ${(props) => (props.disabled ? "default" : "pointer")};
  transition-property: background-color, transform;
  transition-duration: 0.2s;
  transition-timing-function: ease-in-out;
  &:hover {
    background-color: ${(props) =>
      props.isActive ? props.buttonColorActive : props.buttonColorHover};
  }
`;

export const TextStyle = styled.div<{
  sitePropsColors: ColorsInterface;
}>`
  position: relative;
  z-index: 10;
  text-align: center;
  color: ${({ sitePropsColors }) => Colors(sitePropsColors).textWhite};
`;
