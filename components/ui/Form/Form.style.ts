import styled from "styled-components";

export const ButtonPosition = styled.div`
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
  margin-top: 10px;

  button {
    margin: 5px;
  }
`;

export const FormStyle = styled.form<{
  marginTop: number;
  marginBottom: number;
}>`
  margin-top: ${(props) => props.marginTop + "rem"};
  margin-bottom: ${(props) => props.marginBottom + "rem"};
`;
