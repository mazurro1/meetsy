import styled from "styled-components";

export const AccordingItemStyle = styled.div<{
  backgroundColor: string;
  index: number;
  color: string;
  hasActions: boolean;
  userSelect: boolean;
}>`
  position: relative;
  background-color: ${(props) => props.backgroundColor};

  padding: 10px;
  padding-right: ${(props) => (props.hasActions ? "40px" : "10px")};
  border-radius: 5px;
  border-top-left-radius: ${(props) => (props.index === 0 ? "0px" : "5px")};
  border-top-right-radius: ${(props) => (props.index === 0 ? "0px" : "5px")};
  margin: 5px 5px;
  margin-top: ${(props) => (props.index === 0 ? "0px" : "5px")};
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  flex-wrap: wrap;
  align-items: flex-start;
  user-select: ${(props) => (props.userSelect ? "text" : "none")};
  color: ${(props) => props.color};
  min-height: 80px;
  transition-property: background-color, color;
  transition-duration: 0.3s;
  transition-timing-function: ease;

  @media all and (max-width: 990px) {
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
  }

  #content-tooltip {
    line-height: normal !important;
  }
`;

export const FlexIconPosition = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
`;

export const IconActionPosition = styled.div<{
  right: number;
  color: string;
}>`
  right: ${(props) => props.right + "px"};
  width: 40px;
  padding: 7px;
  padding-bottom: 0;
  cursor: pointer;
  background-color: rgba(0, 0, 0, 0.6);
  color: ${(props) => props.color};
  transition-property: background-color;
  transition-duration: 0.3s;
  transition-timing-function: ease;
  &:hover {
    background-color: rgba(0, 0, 0, 0.8);
  }
`;

export const FullWidth = styled.div`
  width: 100%;
  overflow: hidden;
  overflow-x: auto;
`;
