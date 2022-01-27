import styled from "styled-components";

const SectionStyle = styled.div<{
  id: string;
  marginTop: number;
  marginBottom: number;
  maxWidth: number;
  paddingTop: number;
  paddingBottom: number;
}>`
  max-width: ${(props) => props.maxWidth + "px"};
  margin: 0px auto;
  padding-left: 1%;
  padding-right: 1%;
  margin-top: ${(props) => props.marginTop + "rem"};
  margin-bottom: ${(props) => props.marginBottom + "rem"};
  padding-top: ${(props) => props.paddingTop + "rem"};
  padding-bottom: ${(props) => props.paddingBottom + "rem"};
`;

export { SectionStyle };
