import styled from "styled-components";

export const ParagraphStyle = styled.p<{
  marginTop?: number;
  marginBottom?: number;
  color: string;
  uppercase: boolean;
  underline: boolean;
  letterSpacing: number;
  spanColor: string;
  bold: boolean;
  spanBold: boolean;
}>`
  color: ${({ color }) => color};
  margin-top: ${(props) => props.marginTop + "rem"};
  margin-bottom: ${(props) => props.marginBottom + "rem"};
  text-transform: ${(props) => (props.uppercase ? "uppercase" : "none")};
  text-decoration: ${(props) => (props.underline ? "underline" : "none")};
  letter-spacing: ${(props) => props.letterSpacing + "rem"};
  font-weight: ${(props) => (props.bold ? 700 : 500)};
  transition-property: color;
  transition-duration: 0.3s;
  transition-timing-function: ease;

  span {
    color: ${({ spanColor }) => spanColor};
    font-weight: ${(props) => (props.spanBold ? 700 : 500)};
  }
`;
