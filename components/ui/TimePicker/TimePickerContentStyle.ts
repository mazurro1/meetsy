import styled from "styled-components";

export const ButtonConfirmDate = styled.div`
  margin-top: 10px;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  flex-wrap: wrap;
`;

export const ButtonCancelStyle = styled.div`
  position: absolute;
  top: -38px;
  left: 0;
`;

export const MarginButtons = styled.div`
  margin: 5px;
`;

export const MaxWidth = styled.div<{
  backgroundPage: string;
  colorLight: string;
  colorText: string;
  colorDark: string;
}>`
  position: relative;

  span {
    color: ${(props) => props.colorText};
  }

  .react-timekeeper {
    width: 100% !important;
    background-color: transparent;
  }

  .react-timekeeper__top-bar {
    background-color: ${(props) => props.backgroundPage};
  }

  .react-timekeeper__clock-wrapper {
    background-color: ${(props) => props.colorLight};
  }

  .react-timekeeper__clock {
    background-color: ${(props) => props.backgroundPage};
    margin: 20px;
  }

  .react-timekeeper__tb-hour {
    color: ${(props) => props.colorText};
    transition-property: color;
    transition-duration: 0.3s;
    transition-timing-function: ease;
  }

  .react-timekeeper__tb-minute {
    color: ${(props) => props.colorText};
    transition-property: color;
    transition-duration: 0.3s;
    transition-timing-function: ease;
  }

  .react-timekeeper__tb-hour--active {
    color: ${(props) => props.colorDark};
  }

  .react-timekeeper__tb-minute--active {
    color: ${(props) => props.colorDark};
  }

  .react-timekeeper__hand-circle-outer {
    fill: ${(props) => props.colorLight};
  }

  .react-timekeeper__clock-hand {
    stroke: ${(props) => props.colorLight};
  }

  .react-timekeeper__hand-circle-center {
    fill: ${(props) => props.colorLight};
  }
`;
