import styled from "styled-components";

export const DivTakeData = styled.button<{
  mouseClick: boolean;
  numberScale: number;
  resetTextEnable: boolean;
  backgroundColor: string;
  greyColor: string;
  greyLightColor: string;
}>`
  position: relative;
  border-radius: 5px;
  color: ${(props) => props.greyColor};
  font-size: 16px;
  user-select: none;
  padding: 10px 0;
  padding-left: 50px;
  padding-right: 10px;
  background-color: ${(props) => props.backgroundColor};
  cursor: pointer;
  margin-top: 10px;
  margin-bottom: 15px;
  margin-right: 0;
  margin-left: 5px;
  min-width: 260px;
  transform: ${(props) =>
    props.mouseClick ? `scale(${props.numberScale})` : "scale(1)"};
  outline: none;
  border: none;
  opacity: 1;
  text-align: left;
  max-width: 100%;
  white-space: nowrap;
  overflow: hidden;
  transition-property: opacity, transform;
  transition-duration: 0.3s;
  transition-timing-function: ease;
  &:hover {
    opacity: 0.9;
  }
`;

export const IconStyle = styled.div<{
  greyColor: string;
}>`
  position: absolute;
  top: 0px;
  bottom: 0;
  left: 5px;
  width: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 25px;
  color: ${(props) => props.greyColor};
`;

export const IconResetDate = styled.div<{
  onClick: any;
  whiteIconReset: string;
  primaryColorDark: string;
  widthButton: number;
}>`
  position: absolute;
  top: 23px;
  right: -30px;
  height: 20px;
  width: 20px;
  color: ${(props) => props.whiteIconReset};
  cursor: pointer;
  transition-property: color;
  transition-duration: 0.3s;
  transition-timing-function: ease;
  &:hover {
    color: ${(props) => props.primaryColorDark};
  }
`;

export const PositionRelative = styled.div`
  position: relative;
  display: inline-block;
  max-width: calc(100% - 50px);
`;
