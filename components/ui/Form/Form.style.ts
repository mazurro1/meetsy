import styled from "styled-components";

export const ButtonPosition = styled.div<{
  buttonsInColumn: boolean;
}>`
  display: flex;
  flex-wrap: wrap;
  flex-direction: ${(props) => (props.buttonsInColumn ? "column" : "row")};
  align-items: ${(props) => (props.buttonsInColumn ? "flex-end" : "center")};
  justify-content: flex-end;
  margin-top: 10px;

  button {
    margin: ${(props) => (props.buttonsInColumn ? "2px 0px" : "2px")};
  }
`;

export const FormStyle = styled.form<{
  marginTop: number;
  marginBottom: number;
}>`
  margin-top: ${(props) => props.marginTop + "rem"};
  margin-bottom: ${(props) => props.marginBottom + "rem"};
`;
