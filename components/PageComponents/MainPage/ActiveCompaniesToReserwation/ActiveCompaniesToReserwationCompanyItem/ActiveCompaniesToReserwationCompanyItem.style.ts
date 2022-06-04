import styled from "styled-components";

export const ItemCompanyStyle = styled.div`
  border-radius: 5px;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  margin-bottom: 20px;
  opacity: 0.95;
  transition-property: opacity;
  transition-duration: 0.3s;
  transition-timing-function: ease;

  &:hover {
    transform: scale(1);
    opacity: 1;
  }
`;

export const CompanyImage = styled.div<{
  colorNoImage: string;
  isMobile: boolean;
}>`
  position: relative;
  z-index: 1;
  width: ${(props) => (props.isMobile ? "100%" : "300px")};
  height: 250px;
  background-color: ${(props) => props.colorNoImage};
  display: flex;
  justify-content: center;
  align-items: center;
  border-top-left-radius: 5px;
  border-bottom-left-radius: 5px;
  box-shadow: 0 0 5px 3px rgba(0, 0, 0, 0.1);
  cursor: pointer;
`;

export const CompanyIconSize = styled.div`
  height: 100px;
  width: 100px;
  opacity: 0.8;
`;

export const CompanyDetails = styled.div<{
  colorItem: string;
  isMobile: boolean;
}>`
  min-height: 250px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;
  width: ${(props) => (props.isMobile ? "100%" : "calc(100% - 300px)")};
  padding: 10px 15px;
  background-color: ${(props) => props.colorItem};
  box-shadow: 0 0 5px 3px rgba(0, 0, 0, 0.1);
`;
