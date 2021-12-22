import styled from "styled-components";
import { Colors } from "@constants";

export const ButtonConfirmDate = styled.div<{}>`
  padding: 5px;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  flex-wrap: wrap;
`;

export const MarginButtons = styled.div`
  margin: 5px;
`;

export const MaxWidth = styled.div<{
  // siteProps: SitePropsInterface
  secondColor: boolean;
}>`
  .react-timekeeper {
    width: 100% !important;
  }

  .react-timekeeper__top-bar {
    background-color: red;
  }

  .react-timekeeper__clock-wrapper {
    background-color: green;
  }

  .react-timekeeper__clock {
    background-color: pink;
  }

  .react-timekeeper__tb-hour {
    background-color: purple;
    transition-property: color;
    transition-duration: 0.3s;
    transition-timing-function: ease;
  }

  .react-timekeeper__tb-minute {
    background-color: brown;
    transition-property: color;
    transition-duration: 0.3s;
    transition-timing-function: ease;
  }

  .react-timekeeper__tb-hour--active {
    background-color: grey;
  }

  .react-timekeeper__tb-minute--active {
    background-color: orange;
  }
`;
