import styled from "styled-components";

export const SelectStyle = styled.select<{
  colorText: string;
  colorSelect: string;
}>`
  background-color: ${(props) => props.colorSelect};
  color: ${(props) => props.colorText};
  border: none;
  outline: none;
  padding: 5px 10px;
  border-radius: 5px;
`;

export const OptionStyle = styled.option`
  background-color: red;
  color: green;
  padding: 10px;
`;
