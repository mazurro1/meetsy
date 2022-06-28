import styled from "styled-components";

export const ProductStyle = styled.div<{
  productBackground: string;
  productBackgroundHover: string;
  isActiveItem: boolean;
}>`
  padding: 5px 10px;
  background-color: ${(props) =>
    props.isActiveItem
      ? props.productBackgroundHover
      : props.productBackground};
  border-radius: 5px;
  margin: 5px;
  width: 300px;
  min-height: 160px;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  transform: ${(props) => (props.isActiveItem ? "scale(1)" : "scale(0.95)")};
  user-select: none;
  cursor: pointer;
  transition-property: background-color, transform;
  transition-duration: 0.3s;
  transition-timing-function: ease;

  &:hover {
    background-color: ${(props) => props.productBackgroundHover};
  }
`;
