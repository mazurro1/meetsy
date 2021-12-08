import styled from "styled-components";

export const ButtonPosition = styled.div`
  text-align: right;
`;

export const FormStyle = styled.form<{
  marginTop: number;
  marginBottom: number;
}>`
  margin-top: ${(props) => props.marginTop + "rem"};
  margin-bottom: ${(props) => props.marginTop + "rem"};
`;
