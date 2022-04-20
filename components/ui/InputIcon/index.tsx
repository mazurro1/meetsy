import React, {useState, useEffect} from "react";
import * as styled from "./InputIcon.style";
import {NextPage} from "next";
import {GenerateIcons, Paragraph, Tooltip} from "@ui";
import {Colors, ColorsInterface} from "@constants";
import type {GenerateIconsProps} from "@ui";
import type {InputIconProps, ValueInputValidProps} from "./InputIcon.model";
import {withSiteProps, withTranslates} from "@hooks";
import type {ISiteProps, ITranslatesProps} from "@hooks";

const InputIcon: NextPage<
  InputIconProps & ISiteProps & GenerateIconsProps & ITranslatesProps
> = ({
  placeholder = "",
  iconName = "",
  value = null,
  onChange = () => {},
  type = "text",
  required = false,
  validText = "",
  refInput = null,
  siteProps,
  color = "PRIMARY",
  colorDefault = "GREY_LIGHT",
  texts,
  id = "",
  autoComplite = "hidden",
  uppercase = false,
}) => {
  const [inputActive, setInputActive] = useState(false);
  const [clickEye, setClickEye] = useState(false);
  const [inputValue, setInputValue] = useState<string>("");

  const sitePropsColors: ColorsInterface = {
    blind: siteProps!.blind,
    dark: siteProps!.dark,
  };

  useEffect(() => {
    setClickEye(false);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (value !== null) {
      onChange(
        !!value
          ? uppercase
            ? e.target.value.toUpperCase()
            : e.target.value
          : uppercase
          ? e.target.value.trim().toUpperCase()
          : e.target.value.trim()
      );
    }
  };

  const handleOnFocus = () => {
    setInputActive(true);
  };
  const handleOnBlur = () => {
    setInputActive(false);
  };
  const handleClickEye = () => {
    setClickEye((prevState) => !prevState);
  };

  const handleChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!!!inputValue) {
      const valueToSave = uppercase
        ? e.target.value.trim().toUpperCase()
        : e.target.value.trim();
      setInputValue(valueToSave);
    } else {
      const valueToSave = uppercase
        ? e.target.value.toUpperCase()
        : e.target.value;
      setInputValue(valueToSave);
    }
  };

  const handleOnKeyPress = (event: {
    key: string;
    preventDefault: () => void;
  }) => {
    if (type === "number") {
      if (!/[0-9]/.test(event.key)) {
        event.preventDefault();
      }
    }
  };

  const colorNoActiveNormal: string = Colors(sitePropsColors).greyColorDark;
  const colorText: string = Colors(sitePropsColors).textBlack;
  let colorActive: string = "";
  let colorLight: string = "";

  switch (color) {
    case "PRIMARY": {
      colorActive = Colors(sitePropsColors).primaryColor;
      colorLight = Colors(sitePropsColors).primaryColorLight;
      break;
    }
    case "PRIMARY_DARK": {
      colorActive = Colors(sitePropsColors).primaryColorDark;
      colorLight = Colors(sitePropsColors).primaryColorLight;
      break;
    }
    case "SECOND": {
      colorActive = Colors(sitePropsColors).secondColor;
      colorLight = Colors(sitePropsColors).secondColorLight;
      break;
    }
    case "SECOND_DARK": {
      colorActive = Colors(sitePropsColors).secondColorDark;
      colorLight = Colors(sitePropsColors).secondColorLight;
      break;
    }
    case "RED": {
      colorActive = Colors(sitePropsColors).dangerColor;
      colorLight = Colors(sitePropsColors).dangerColorLight;
      break;
    }
    case "RED_DARK": {
      colorActive = Colors(sitePropsColors).dangerColorDark;
      colorLight = Colors(sitePropsColors).dangerColorLight;
      break;
    }
    case "GREEN": {
      colorActive = Colors(sitePropsColors).successColor;
      colorLight = Colors(sitePropsColors).successColorLight;
      break;
    }
    case "GREEN_DARK": {
      colorActive = Colors(sitePropsColors).successColorDark;
      colorLight = Colors(sitePropsColors).successColorLight;
      break;
    }
    case "GREY": {
      colorActive = Colors(sitePropsColors).greyColor;
      colorLight = Colors(sitePropsColors).greyColorLight;
      break;
    }
    case "GREY_DARK": {
      colorActive = Colors(sitePropsColors).greyColorDark;
      colorLight = Colors(sitePropsColors).greyColorLight;
      break;
    }
    case "GREY_LIGHT": {
      colorActive = Colors(sitePropsColors).greyColorLight;
      colorLight = Colors(sitePropsColors).greyColorLight;
      break;
    }

    default: {
      colorActive = Colors(sitePropsColors).primaryColor;
      colorLight = Colors(sitePropsColors).primaryColorLight;
      break;
    }
  }

  let colorNoActive: string = "";

  switch (colorDefault) {
    case "PRIMARY": {
      colorNoActive = Colors(sitePropsColors).primaryColor;
      break;
    }
    case "PRIMARY_DARK": {
      colorNoActive = Colors(sitePropsColors).primaryColorDark;
      break;
    }
    case "SECOND": {
      colorNoActive = Colors(sitePropsColors).secondColor;
      break;
    }
    case "SECOND_DARK": {
      colorNoActive = Colors(sitePropsColors).secondColorDark;
      break;
    }
    case "RED": {
      colorNoActive = Colors(sitePropsColors).dangerColor;
      break;
    }
    case "RED_DARK": {
      colorNoActive = Colors(sitePropsColors).dangerColorDark;
      break;
    }
    case "GREEN": {
      colorNoActive = Colors(sitePropsColors).successColor;
      break;
    }
    case "GREEN_DARK": {
      colorNoActive = Colors(sitePropsColors).successColorDark;
      break;
    }
    case "GREY": {
      colorNoActive = Colors(sitePropsColors).greyColor;
      break;
    }
    case "GREY_DARK": {
      colorNoActive = Colors(sitePropsColors).greyColorDark;
      break;
    }
    case "GREY_LIGHT": {
      colorNoActive = Colors(sitePropsColors).greyColorLight;
      break;
    }

    default: {
      colorNoActive = Colors(sitePropsColors).primaryColor;
      break;
    }
  }

  interface ValueActiveProps {
    active: boolean;
  }

  const textValueActive: ValueActiveProps =
    value !== null ? {active: !!value} : {active: !!inputValue};

  const valueInputValid: ValueInputValidProps | {} =
    value !== null
      ? {value: value, onChange: handleChange}
      : {onChange: handleChangeInput, value: inputValue};

  const selectedIdElement = !!id ? {id: id, "data-test-id": id} : {};

  return (
    <styled.AllInput>
      <styled.PositionRelative>
        <styled.TextValue
          {...textValueActive}
          colorActive={colorActive}
          colorNoActive={colorNoActive}
          inputActive={inputActive}
        >
          <Paragraph
            marginTop={0}
            marginBottom={0}
            color={!inputActive ? "GREY" : color}
            bold
            fontSize="SMALL"
          >
            {placeholder}
          </Paragraph>
        </styled.TextValue>
        <styled.InputStyled
          {...valueInputValid}
          ref={refInput}
          placeholder={placeholder + "..."}
          iconName={!!iconName}
          onFocus={handleOnFocus}
          onBlur={handleOnBlur}
          inputActive={inputActive}
          type={!clickEye ? type : "text"}
          colorActive={colorActive}
          colorNoActive={colorNoActive}
          required={required}
          colorText={colorText}
          validText={!!validText}
          paddingEye={type === "password"}
          colorLight={colorLight}
          {...selectedIdElement}
          autoComplete={autoComplite}
          onKeyPress={handleOnKeyPress}
        />
        {!!iconName && (
          <styled.IconInput
            inputActive={inputActive}
            colorActive={colorActive}
            colorNoActive={colorNoActive}
          >
            <GenerateIcons iconName={iconName} />
          </styled.IconInput>
        )}
      </styled.PositionRelative>
      {!!validText && (
        <styled.ValidTextInput
          inputActive={inputActive}
          colorActive={colorActive}
          colorNoActive={colorNoActive}
        >
          <Paragraph
            marginTop={0.4}
            marginBottom={0}
            color={!inputActive ? "GREY" : color}
            fontSize="SMALL"
          >
            {validText}
          </Paragraph>
        </styled.ValidTextInput>
      )}
      {type === "password" && (
        <>
          <styled.ShowPassword
            active={inputActive}
            colorActiveDark={colorActive}
            colorNoActiveNormal={colorNoActiveNormal}
          >
            <Tooltip
              text={clickEye ? texts!.noShowPassword : texts!.showPassword}
            >
              <styled.IconEyeClick onClick={handleClickEye}>
                {clickEye ? (
                  <GenerateIcons iconName="EyeIcon" />
                ) : (
                  <GenerateIcons iconName="EyeOffIcon" />
                )}
              </styled.IconEyeClick>
            </Tooltip>
          </styled.ShowPassword>
        </>
      )}
    </styled.AllInput>
  );
};

export default withTranslates(withSiteProps(InputIcon), "InputIcon");
