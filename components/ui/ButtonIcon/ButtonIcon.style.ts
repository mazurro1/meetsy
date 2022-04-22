import styled from "styled-components";
import {Colors} from "@constants";
import type {ColorsInterface} from "@constants";

export const ButtonStyle = styled.button<{
  icon: boolean;
  mouseOn: boolean;
  fontSize: number;
  uppercase: boolean;
  disabled: boolean;
  mouseClick: boolean;
  sitePropsColors: ColorsInterface;
  color: string;
  type?: any;
  minHeight: number;
  capitalize: boolean;
  fullWidth: boolean;
  hasImage: boolean;
}>`
  border: none;
  outline: none;
  position: relative;
  padding: 4px 10px;
  padding-left: ${(props) =>
    props.icon ? (props.hasImage ? "50px" : "45px") : "10px"};
  border-radius: 5px;
  background-color: ${({color, mouseOn, icon, disabled, sitePropsColors}) =>
    mouseOn && !icon
      ? color
      : disabled
      ? Colors(sitePropsColors).disabled
      : color};
  color: black;
  overflow: hidden;
  color: white;
  font-size: ${(props) => props.fontSize + "px"};
  text-transform: ${(props) =>
    props.uppercase ? "uppercase" : props.capitalize ? "capitalize" : ""};
  transform: ${(props) => (props.mouseClick ? `scale(0.95)` : "scale(1)")};
  user-select: none;
  min-height: ${(props) => props.minHeight + "px"};
  cursor: ${(props) => (props.disabled ? "default" : "pointer")};
  width: ${(props) => (props.fullWidth ? "100%" : "auto")};
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
  hasImage: boolean;
}>`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  width: ${(props) => (props.hasImage ? "40px" : "35px")};
  background-color: ${({sitePropsColors, mouseClick, disabled, color}) =>
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
  iconPadding: number;
  hasImage: boolean;
}>`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  width: ${(props) => (props.hasImage ? "40px" : "35px")};
  display: flex;
  justify-content: center;
  align-items: center;
  color: ${({sitePropsColors}) => Colors(sitePropsColors).textWhite};
  padding: ${(props) => (props.hasImage ? "0px" : props.iconPadding + "px")};
`;

export const TextStyle = styled.div<{
  sitePropsColors: ColorsInterface;
}>`
  position: relative;
  z-index: 10;
  text-align: center;
  color: ${({sitePropsColors}) => Colors(sitePropsColors).textWhite};
`;

export const PositionNewIcon = styled.div<{
  colorNewIcon: string;
}>`
  position: absolute;
  top: -3px;
  right: -3px;
  bottom: 0;
  height: 18px;
  width: 18px;
  background-color: ${(props) => props.colorNewIcon};
  border-radius: 50%;
  transform: scale(0.8);
`;

export const IconsStyles = styled.div`
  position: relative;
  width: 100%;
  height: 100%;

  svg {
    height: 100%;
    width: 100%;
  }
`;
