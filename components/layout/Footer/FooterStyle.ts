import styled from "styled-components";

export const WrapperFooter = styled.div<{
  backgroundColor: string;
}>`
  position: sticky;
  top: 0;
  left: 0;
  right: 0;
  background-color: ${(props) => props.backgroundColor};
`;

export const FooterDiv = styled.div<{
  backgroundColor: string;
}>`
  background-color: ${(props) => props.backgroundColor};
  max-width: 900px;
  margin: 0 auto;
  padding-bottom: 30px;
  padding-top: 30px;
`;

export const ReservedRights = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  bottom: 5px;
  text-align: center;
  font-size: 0.9rem;
  user-select: none;
`;

export const LinkRoutes = styled.div<{
  primaryColor: string;
}>`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  flex-wrap: wrap;

  a {
    padding: 10px;
    transition-property: color;
    transition-duration: 0.3s;
    transition-timing-function: ease-in-out;

    &:hover {
      color: ${(props) => props.primaryColor};
    }
  }
`;

export const FacebookIcon = styled.div<{
  primaryColor: string;
}>`
  text-align: center;

  a {
    transition-property: color;
    transition-duration: 0.3s;
    transition-timing-function: ease;
    height: 60px;
    width: 60px;
    svg {
      height: 60px;
      width: 60px;
    }

    &:hover {
      color: ${(props) => props.primaryColor};
    }
  }
`;
