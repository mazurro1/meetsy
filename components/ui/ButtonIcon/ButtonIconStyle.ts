import styled from "styled-components";
import { Colors } from "@constants";
import type { ColorsInterface } from "@constants";

export const ButtonStyle = styled.button<{
  icon: any;
  mouseOn: boolean;
  fontSize: any;
  uppercase: boolean;
  disabled: boolean;
  mouseClick: boolean;
  sitePropsColors: ColorsInterface;
  color: string;
  id?: any;
  type?: any;
}>`
  border: none;
  outline: none;
  position: relative;
  padding: 4px 10px;
  padding-left: 45px;
  padding-left: ${(props) => (props.icon ? "45px" : "10px")};
  border-radius: 5px;
  background-color: ${({ color, mouseOn, icon, disabled, sitePropsColors }) =>
    mouseOn && !icon
      ? color
      : disabled
      ? Colors(sitePropsColors).disabled
      : Colors(sitePropsColors).primaryColorDark};
  color: black;
  overflow: hidden;
  color: white;
  font-size: ${(props) => props.fontSize + "px"};
  text-transform: ${(props) => (props.uppercase ? "uppercase" : "")};
  transform: ${(props) => (props.mouseClick ? `scale(0.95)` : "scale(1)")};
  user-select: none;
  cursor: ${(props) => (props.disabled ? "default" : "pointer")};
  transition-property: background-color, transform;
  transition-duration: 0.2s;
  transition-timing-function: ease-in-out;
`;

export const IconStyle = styled.div<{
  mouseClick: boolean;
  color: string;
  sitePropsColors: ColorsInterface;
  disabled: boolean;
  mouseOn: boolean;
  numberScale: number;
  id: string;
}>`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  width: 35px;
  background-color: ${({ sitePropsColors, mouseClick, disabled, color }) =>
    mouseClick ? color : disabled ? Colors(sitePropsColors).disabled : color};
  transform: ${(props) =>
    props.mouseOn ? `scale(${props.numberScale})` : "scale(1)"};
  border-top-left-radius: 5px;
  border-bottom-left-radius: 5px;
  transition-property: transform, background-color;
  transition-duration: 0.3s;
  transition-timing-function: ease-in-out;
`;

export const OnlyIcon = styled.div<{
  sitePropsColors: ColorsInterface;
}>`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  width: 35px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: ${({ sitePropsColors }) => Colors(sitePropsColors).textWhite};
  padding: 4px;
`;

export const TextStyle = styled.div<{
  sitePropsColors: ColorsInterface;
}>`
  position: relative;
  z-index: 10;
  text-align: center;
  color: ${({ sitePropsColors }) => Colors(sitePropsColors).textWhite};
`;
