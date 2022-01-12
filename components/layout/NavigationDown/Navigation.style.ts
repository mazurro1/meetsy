import styled from "styled-components";
import { Site } from "@constants";

export const NavigationDownStyle = styled.div<{
  navDownBackgroundColor: string;
  heightMenuIndustries: number;
  visibleMenuIndustries: boolean;
  copyPopupButtonTakeData: boolean;
}>`
  position: relative;
  z-index: ${(props) => (props.copyPopupButtonTakeData ? 80 : 70)};
  margin-top: 70px;
  background-color: ${(props) => props.navDownBackgroundColor};
  padding-top: 20px;
  padding-bottom: 10px;
  height: 139px;
  padding-bottom: ${(props) =>
    props.visibleMenuIndustries
      ? `${props.heightMenuIndustries + 80}px`
      : "10px"};
  overflow: hidden;
  transition-property: padding-bottom;
  transition-timing-function: ease;
  transition-duration: 0.3s;
`;

export const PaddingRight = styled.div<{}>`
  padding-right: 10px;
  padding-bottom: 5px;
`;

export const UnderMenuIndustries = styled.div`
  position: relative;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  flex-wrap: wrap;
  padding: 5px;
  padding-top: 10px;
  padding-bottom: 5px;
  overflow: hidden;
  padding-right: 170px;

  @media all and (max-width: ${Site.mobileSize + "px"}) {
    padding-top: 50px;
    padding-right: 5px;
  }
`;

export const ButtonShowMore = styled.div`
  position: absolute;
  top: 10px;
  right: 5px;

  @media all and (max-width: ${Site.mobileSize + "px"}) {
    position: absolute;
    top: 0;
    right: 5px;
    left: 5px;
    z-index: 10;
  }
`;
