import styled from "styled-components";
import { Site } from "@constants";

export const WrapSelectedElements = styled.div`
  width: 100%;
  max-height: 100px;
  overflow-x: hidden;
  overflow-y: auto;
  text-align: left;
`;

export const SizeSelect = styled.div<{
  width: number;
  isClearable: boolean;
}>`
  position: relative;
  display: block;
  width: ${(props) =>
    `calc(${props.width}px + ${props.isClearable ? "30px" : "0px"})`};
  padding-right: ${(props) => (props.isClearable ? "30px" : "0px")};
  max-width: 100%;
  button {
    width: 100%;
    font-size: 0;
  }
`;

export const PositionValues = styled.div<{
  borderColor: string;
  height: number;
  isClearable: boolean;
  top: boolean;
}>`
  position: absolute;
  ${(props) =>
    !props.top ? "top: calc(100% + 5px)" : "bottom: calc(100% + 5px)"};
  width: ${(props) => (props.isClearable ? "calc(100% - 30px)" : "100%")};
  z-index: 20;
  border-radius: 5px;
  box-shadow: 0 0 8px 0px rgba(0, 0, 0, 0.4);
  border: 1px solid ${(props) => props.borderColor};
  max-height: ${(props) => props.height + "px"};
  overflow-y: auto;
  overflow-x: hidden;
`;

export const DataItem = styled.div<{
  onClick: any;
  key: number;
  borderColor: string;
  textColor: string;
  backgroundColor: string;
  backgroundColorHover: string;
}>`
  display: block;
  width: 100%;
  padding: 5px 10px;
  border: none;
  text-align: left;
  overflow-wrap: break-word;
  word-break: break-word;
  border-bottom: 1px solid ${(props) => props.borderColor};
  background-color: ${(props) => props.backgroundColor};
  color: ${(props) => props.textColor};
  opacity: 0.98;
  font-size: 0.9rem;
  cursor: pointer;
  transition-property: background-color, color, transform;
  transition-duration: 0.3s;
  transition-timing-function: ease;

  @media all and (max-width: ${Site.mobileSize + "px"}) {
    font-size: 0.8rem;
  }

  span {
    position: relative;
    left: 0;
    transition-property: left;
    transition-duration: 0.3s;
    transition-timing-function: ease;
  }

  &:hover {
    background-color: ${(props) => props.backgroundColorHover};
  }

  &:active {
    span {
      left: -5px;
    }
  }
`;

export const ClearSelect = styled.div`
  position: absolute;
  top: 0px;
  right: 0;
  height: 30px;
  width: 30px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin-left: 5px;
  font-size: 1.4rem;
  cursor: pointer;
  transition-property: transform;
  transition-duration: 0.3s;
  transition-timing-function: ease;

  &:hover {
    transform: scale(1.2);
  }
`;

export const SelectedItemValue = styled.span<{
  backgroundColor: string;
  textColor: string;
  backgroundColorHover: string;
}>`
  display: inline-block;
  font-size: 0.8rem;
  padding: 2px 5px;
  background-color: ${(props) => props.backgroundColor};
  color: ${(props) => props.textColor};
  margin: 1px;
  border-radius: 5px;
  overflow-wrap: break-word;
  word-break: break-word;
  transition-property: background-color;
  transition-duration: 0.3s;
  transition-timing-function: ease;

  &:hover {
    background-color: ${(props) => props.backgroundColorHover};
  }
`;

export const FlexItemSelectedName = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

export const DeleteItemSelected = styled.div<{
  color: string;
}>`
  color: ${(props) => props.color};
  margin-left: 5px;
  height: 15px;
  width: 15px;
`;

export const DefaultPlaceholderStyle = styled.div`
  font-size: 0.9rem;
  padding: 1.5px;

  @media all and (max-width: ${Site.mobileSize + "px"}) {
    font-size: 0.8rem;
  }
`;
