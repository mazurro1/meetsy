import styled from "styled-components";

export const AccordingStyle = styled.div<{
  marginTop: number;
  marginBottom: number;
}>`
  margin-top: ${(props) => props.marginTop + "rem"};
  margin-bottom: ${(props) => props.marginBottom + "rem"};
`;

export const TitleCategory = styled.div<{
  backgroundColor: string;
  color: string;
}>`
  position: relative;
  cursor: pointer;
  color: ${(props) => props.color};
  background-color: ${(props) => props.backgroundColor};
  padding: 10px;
  border-radius: 5px;
  padding-right: 200px;
  padding-bottom: 10px;
  overflow: hidden;
  user-select: none;
  transition-property: background-color, color;
  transition-duration: 0.5s;
  transition-timing-function: ease;
  min-height: 50px;

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    font-family: "Poppins-Medium", sans-serif;
  }
`;

export const IconArrowPosition = styled.div<{
  collapseActive: boolean;
}>`
  position: absolute;
  right: 0;
  top: 0;
  padding: 7px;
  padding-bottom: 0;
  width: 50px;
  cursor: pointer;
  transition-property: background-color;
  transition-duration: 0.3s;
  transition-timing-function: ease;

  svg {
    transform: ${(props) =>
      props.collapseActive ? "rotate(-180deg)" : "rotate(0deg)"};
    transition-property: transform;
    transition-duration: 0.3s;
    transition-timing-function: ease;
  }

  &:hover {
    background-color: rgba(0, 0, 0, 0.1);
  }
`;

export const IconActionPosition = styled.div<{
  right: number;
}>`
  position: absolute;
  top: 0;
  right: ${(props) => props.right + "px"};
  width: 50px;
  padding: 7px;
  padding-bottom: 0;
  cursor: pointer;
  background-color: rgba(0, 0, 0, 0.1);
  transition-property: background-color;
  transition-duration: 0.3s;
  transition-timing-function: ease;
  &:hover {
    background-color: rgba(0, 0, 0, 0.2);
  }
`;
