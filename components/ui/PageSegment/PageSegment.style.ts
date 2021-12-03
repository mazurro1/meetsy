import styled from "styled-components";

const SectionStyle = styled.div<{
  id: string;
  marginTop: number;
  marginBottom: number;
}>`
  max-width: 1200px;
  margin: 0px auto;
  padding-left: 1%;
  padding-right: 1%;
  margin-top: ${(props) => props.marginTop + "rem"};
  margin-bottom: ${(props) => props.marginBottom + "rem"};
`;

export { SectionStyle };
