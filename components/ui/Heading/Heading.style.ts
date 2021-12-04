import styled from "styled-components";

const HeadingStyle = styled.div<{
  marginTop?: number;
  marginBottom?: number;
  color: string;
  uppercase: boolean;
  underline: boolean;
  letterSpacing: number;
}>`
  color: ${({ color }) => color};
  margin-top: ${(props) => props.marginTop + "rem"};
  margin-bottom: ${(props) => props.marginBottom + "rem"};
  text-transform: ${(props) => (props.uppercase ? "uppercase" : "none")};
  text-decoration: ${(props) => (props.underline ? "underline" : "none")};
  letter-spacing: ${(props) => props.letterSpacing + "rem"};
`;

export { HeadingStyle };
