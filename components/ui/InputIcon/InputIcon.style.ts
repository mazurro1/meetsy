import styled from "styled-components";

export const InputStyled = styled.input<{
  iconName: boolean;
  paddingEye: boolean;
  validText: boolean;
  inputActive: boolean;
  colorActive: string;
  colorNoActive: string;
  colorText: string;
  ref: any;
}>`
  padding: 15px 15px;
  padding-bottom: 5px;
  padding-top: 20px;
  padding-left: ${(props) => (props.iconName ? "50px" : "10px")};
  padding-right: ${(props) => (props.paddingEye ? "40px" : "15px")};
  margin-top: 5px;
  margin-bottom: ${(props) => (props.validText ? "0px" : "5px")};
  border: none;
  font-size: 16px;
  border-bottom: ${(props) =>
    props.inputActive
      ? `2px solid ${props.colorActive}`
      : `2px solid  ${props.colorNoActive}`};
  width: 100%;
  color: ${(props) => props.colorText};
  background-color: transparent;
  transition-property: border-bottom, color;
  transition-duration: 0.3s;
  transition-timing-function: ease;
  ::placeholder {
    padding-right: 50px;
    padding-left: 5px;
    transition-property: color;
    transition-duration: 0.3s;
    transition-timing-function: ease;
    color: ${(props) => props.colorText};
  }

  &:active,
  &:focus {
    outline: none;
  }

  &:-webkit-autofill,
  &:-webkit-autofill:hover,
  &:-webkit-autofill:focus,
  &:-webkit-autofill:active {
    box-shadow: 0 0 0 30px ${(props) => `${props.colorActive} inset !important`};
    -webkit-text-fill-color: ${(props) => `${props.colorText} !important`};
  }
`;

export const AllInput = styled.div`
  display: inline-block;
  position: relative;
  overflow: hidden;
  border: none;
  border-radius: 5px;
  width: 100%;
  margin: 5px 0;
`;

export const IconInput = styled.div<{
  inputActive: boolean;
  colorActive: string;
  colorNoActive: string;
}>`
  position: absolute;
  top: 14px;
  bottom: 0;
  left: 0;
  width: 26px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: ${(props) =>
    props.inputActive ? props.colorActive : props.colorNoActive};
  transition-property: color;
  transition-duration: 0.3s;
  transition-timing-function: ease;
`;

export const ValidTextInput = styled.div<{
  inputActive: boolean;
  colorActive: string;
  colorNoActive: string;
}>`
  font-size: 0.8rem;
  text-align: right;
  color: ${(props) =>
    props.inputActive ? props.colorActive : props.colorNoActive};
  font-family: "Poppins-Medium", sans-serif;
  transition-property: color;
  transition-duration: 0.3s;
  transition-timing-function: ease;
`;

export const PositionRelative = styled.div`
  position: relative;
`;

export const TextValue = styled.div<{
  active: boolean;
  inputActive: boolean;
  colorActive: string;
  colorNoActive: string;
}>`
  position: absolute;
  left: 0;
  top: 0;
  font-size: 0.8rem;
  opacity: ${(props) => (props.active ? 1 : 0)};
  color: ${(props) =>
    !props.inputActive ? props.colorNoActive : props.colorActive};
  transition-property: color, opacity;
  transition-duration: 0.3s;
  transition-timing-function: ease;
`;

export const ShowPassword = styled.div<{
  active: boolean;
  colorActiveDark: string;
  colorNoActiveNormal: string;
}>`
  position: absolute;
  top: 0;
  bottom: 0;
  right: 0;
  width: 40px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  font-size: 1.3rem;
  color: ${(props) =>
    props.active ? props.colorActiveDark : props.colorNoActiveNormal};
  transition-property: color;
  transition-duration: 0.3s;
  transition-timing-function: ease;
`;

export const IconEyeClick = styled.div`
  cursor: pointer;
  transition-property: transform;
  transition-duration: 0.3s;
  transition-timing-function: ease;
  height: 24px;
  width: 24px;
  &:hover {
    transform: scale(1.2);
  }
`;
