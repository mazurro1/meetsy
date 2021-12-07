import React, { useState, useEffect } from "react";
import * as styled from "./InputIcon.style";
import { NextPage } from "next";
import { GenerateIcons, Paragraph, Tooltip } from "@ui";
import { Colors, ColorsInterface } from "@constants";
import { withSiteProps } from "@hooks";
import type { ISiteProps } from "@hooks";
import type { GenerateIconsProps } from "@ui";
import type { InputIconProps } from "./InputIcon.model";

const InputIcon: NextPage<InputIconProps & ISiteProps & GenerateIconsProps> = ({
  placeholder = "",
  iconName = "",
  value = "",
  onChange = () => {},
  type = "text",
  max = "",
  required = false,
  validText = "",
  refInput = null,
  siteProps,
  color = "PRIMARY",
}) => {
  const [inputActive, setInputActive] = useState(false);
  const [clickEye, setClickEye] = useState(false);

  const sitePropsColors: ColorsInterface = {
    blind: siteProps.blind,
    dark: siteProps.dark,
  };

  useEffect(() => {
    setClickEye(false);
  }, []);

  const handleOnFocus = () => {
    setInputActive(true);
  };
  const handleOnBlur = () => {
    setInputActive(false);
  };
  const handleClickEye = () => {
    setClickEye((prevState) => !prevState);
  };

  const randomNumber: number =
    Math.floor(Math.random() * (999999999 - 111111111 + 1)) + 111111111;

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

  return (
    <styled.AllInput>
      <styled.PositionRelative>
        <styled.TextValue
          active={!!value}
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
          value={value}
          placeholder={placeholder + "..."}
          onChange={onChange}
          iconName={!!iconName}
          onFocus={handleOnFocus}
          onBlur={handleOnBlur}
          inputActive={inputActive}
          type={!clickEye ? type : "text"}
          max={max}
          colorActive={colorActive}
          colorNoActive={colorNoActive}
          required={required}
          colorText={colorText}
          validText={!!validText}
          paddingEye={type === "password"}
          ref={refInput}
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
              id={"showPassword" + placeholder}
              text={clickEye ? "Anuluj podgląd hasła" : "Podgląd hasła"}
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

export default withSiteProps(InputIcon);
