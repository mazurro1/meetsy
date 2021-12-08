import styled from "styled-components";

export const OneAlert = styled.div<{
  index: number;
  alertHeight: number;
}>`
  position: absolute;
  left: 0;
  right: 0;
  transform: ${(props) => `translateY(${props.alertHeight}px)`};
  transition-property: transform, padding-top;
  transition-duration: 0.3s;
  transition-timing-function: ease;
  padding: 2.5px 5px;
`;
export const ContentAlert = styled.div<{
  color: string;
}>`
  user-select: none;
  position: relative;
  padding: 10px;
  background-color: ${(props) => props.color};
  border-radius: 5px;
  opacity: 0.99;
  color: white;
  padding-right: 50px;
  padding-left: 50px;
  overflow: hidden;
`;

export const IconClose = styled.div`
  position: absolute;
  right: 0px;
  top: 0px;
  width: 40px;
  padding-right: 5px;
  padding-left: 5px;
  padding-top: 8px;
  padding-bottom: 3px;
  color: white;
  cursor: pointer;
  background-color: rgba(0, 0, 0, 0);
  transition-property: background-color;
  transition-duration: 0.3s;
  transition-timing-function: ease;

  &:hover {
    background-color: rgba(0, 0, 0, 0.1);
  }
`;

export const StyleIconInfo = styled.div`
  position: absolute;
  left: 10px;
  top: 7px;
  width: 30px;
  color: white;
  font-size: 1.5rem;
`;
