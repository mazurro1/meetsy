import React, { useState, useEffect, useRef } from "react";
import * as styled from "./InputIcon.style";
import { NextPage } from "next";
import { GenerateIcons, Paragraph, Tooltip } from "@ui";
import { Colors, ColorsInterface } from "@constants";
import type { GenerateIconsProps } from "@ui";
import type { InputIconProps, ValueInputValidProps } from "./InputIcon.model";
import { withSiteProps, withTranslates } from "@hooks";
import type { ISiteProps, ITranslatesProps } from "@hooks";

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
  texts,
}) => {
  const [inputActive, setInputActive] = useState(false);
  const [clickEye, setClickEye] = useState(false);
  const [inputValue, setInputValue] = useState("");

  const sitePropsColors: ColorsInterface = {
    blind: siteProps!.blind,
    dark: siteProps!.dark,
  };

  useEffect(() => {
    setClickEye(false);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (value !== null) {
      onChange(e);
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
    setInputValue(e.target.value);
  };

  const colorNoActive: string = Colors(sitePropsColors).greyColor;
  const colorNoActiveNormal: string = Colors(sitePropsColors).greyColorDark;
  const colorText: string = Colors(sitePropsColors).textBlack;
  let colorActive: string = "";

  switch (color) {
    case "PRIMARY": {
      colorActive = Colors(sitePropsColors).primaryColor;
      break;
    }
    case "PRIMARY_DARK": {
      colorActive = Colors(sitePropsColors).primaryColorDark;
      break;
    }
    case "SECOND": {
      colorActive = Colors(sitePropsColors).secondColor;
      break;
    }
    case "SECOND_DARK": {
      colorActive = Colors(sitePropsColors).secondColorDark;
      break;
    }
    case "RED": {
      colorActive = Colors(sitePropsColors).dangerColor;
      break;
    }
    case "RED_DARK": {
      colorActive = Colors(sitePropsColors).dangerColorDark;
      break;
    }
    case "GREEN": {
      colorActive = Colors(sitePropsColors).successColor;
      break;
    }
    case "GREEN_DARK": {
      colorActive = Colors(sitePropsColors).successColorDark;
      break;
    }
    case "GREY": {
      colorActive = Colors(sitePropsColors).greyColor;
      break;
    }
    case "GREY_DARK": {
      colorActive = Colors(sitePropsColors).greyColorDark;
      break;
    }
    case "GREY_LIGHT": {
      colorActive = Colors(sitePropsColors).greyColorLight;
      break;
    }

    default: {
      colorActive = Colors(sitePropsColors).primaryColor;
      break;
    }
  }

  const textValueActive =
    value !== null ? { active: !!value } : { active: !!inputValue };

  const valueInputValid: ValueInputValidProps | {} =
    value !== null
      ? { value: value, onChange: handleChange }
      : { onChange: handleChangeInput, value: inputValue };

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
