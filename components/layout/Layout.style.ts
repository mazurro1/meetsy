import styled from "styled-components";

export const LayoutPageColor = styled.div<{
  color: string;
}>`
  background-color: ${(props) => props.color};
`;
