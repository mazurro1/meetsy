import React, { useState, useRef, useEffect } from "react";
import * as styled from "./ButtonIcon.style";
import { updateDisabledFetchActions } from "@/redux/site/actions";
import { useDispatch, useSelector } from "react-redux";
import { withSiteProps } from "@hooks";
import type { ISiteProps } from "@hooks";
import type { NextPage } from "next";
import { Colors } from "@constants";
import type { ColorsInterface } from "@constants";
import type {
  ButtonIconProps,
  idElementButtonInterface,
  typeElementInterface,
} from "./ButtonIcon.model";
import type { GenerateIconsProps } from "@ui";
import { GenerateIcons } from "@ui";
import type { IStoreProps } from "@/redux/store";

const ButtonIcon: NextPage<ISiteProps & ButtonIconProps & GenerateIconsProps> =
  ({
    siteProps = {
      blind: false,
      dark: false,
      language: "pl",
    },
    fontSize = "MEDIUM",
    uppercase = false,
    onClick = () => {},
    children = "",
    iconName = "",
    disabled = false,
    id = "",
    isFetchToBlock = false,
    isActive = false,
    type = "button",
    color = "PRIMARY",
    iconPadding = 4,
    dispatch,
    minHeight = 0,
  }) => {
    const [mouseOn, setMouseOn] = useState(false);
    const [mouseClick, setMouseClick] = useState(false);
    const [numberScale, setNumberScale] = useState(1);
    const refButton = useRef<HTMLButtonElement>(null);
    const timerToClearSomewhere = useRef<any>(null);
    const disableFetchActions = useSelector(
      (state: IStoreProps) => state.site.disableFetchActions
    );

    useEffect(() => {
      if (mouseClick) {
        timerToClearSomewhere.current = setTimeout(() => {
          setMouseClick(false);
        }, 500);
      }
      return () => {
        clearInterval(timerToClearSomewhere.current);
      };
    }, [mouseClick, isActive]);

    const handleOnMouseOn = () => {
      if (
        !disabled &&
        !disableFetchActions &&
        !isActive &&
        !!refButton.current
      ) {
        setMouseOn(true);
        const numberScale: number =
          Math.floor(refButton.current.clientWidth / 35) * 2 + 1;
        setNumberScale(numberScale);
      }
    };

    const handleOnMouseLeave = () => {
      if (!disabled && !disableFetchActions && !isActive) {
        setMouseOn(false);
      }
    };

    const handleOnClick = (e: Event) => {
      if (!disabled) {
        if (isFetchToBlock) {
          if (!disableFetchActions) {
            dispatch!(updateDisabledFetchActions(true));
            setMouseOn(false);
            setNumberScale(1);
            setMouseClick(true);
            onClick(e);

            setTimeout(() => {
              dispatch!(updateDisabledFetchActions(false));
            }, 2000);
          }
        } else {
          setMouseOn(false);
          setNumberScale(1);
          setMouseClick(true);
          onClick(e);
        }
      }
    };

    const sitePropsColors: ColorsInterface = {
      blind: siteProps.blind,
      dark: siteProps.dark,
    };

    let colorIcon: string = "";
    let colorButton: string = "";

    switch (color) {
      case "PRIMARY": {
        colorIcon = Colors(sitePropsColors).primaryColor;
        colorButton = Colors(sitePropsColors).primaryColorDark;
        break;
      }
      case "SECOND": {
        colorIcon = Colors(sitePropsColors).secondColor;
        colorButton = Colors(sitePropsColors).secondColorDark;
        break;
      }
      case "RED": {
        colorIcon = Colors(sitePropsColors).dangerColor;
        colorButton = Colors(sitePropsColors).dangerColorDark;
        break;
      }
      case "GREEN": {
        colorIcon = Colors(sitePropsColors).successColor;
        colorButton = Colors(sitePropsColors).successColorDark;
        break;
      }
      case "GREY": {
        colorIcon = Colors(sitePropsColors).greyColor;
        colorButton = Colors(sitePropsColors).greyColorDark;
        break;
      }
      case "GREY_LIGHT": {
        colorIcon = Colors(sitePropsColors).greyColorLight;
        colorButton = Colors(sitePropsColors).greyColor;
        break;
      }

      default: {
        colorIcon = Colors(sitePropsColors).primaryColor;
        colorButton = Colors(sitePropsColors).primaryColorDark;
        break;
      }
    }

    const allIcon = !!iconName && (
      <>
        <styled.IconStyle
          mouseOn={mouseOn || isActive}
          numberScale={numberScale}
          mouseClick={mouseClick}
          disabled={disabled || (!!disableFetchActions && isFetchToBlock)}
          sitePropsColors={sitePropsColors}
          id="IconStyle"
          color={colorIcon}
        />
        <styled.OnlyIcon
          sitePropsColors={sitePropsColors}
          iconPadding={iconPadding}
        >
          <GenerateIcons iconName={iconName} outline={false} />
        </styled.OnlyIcon>
      </>
    );

    const fontSizeCheck: number =
      fontSize === "SMALL" ? 14 : fontSize === "MEDIUM" ? 16 : 18;

    const idElementButton: idElementButtonInterface | {} = !!id
      ? { id: id }
      : {};

    const typeElement: typeElementInterface = { type: type };

    return (
      <styled.ButtonStyle
        {...typeElement}
        {...idElementButton}
        fontSize={fontSizeCheck}
        uppercase={uppercase}
        onMouseEnter={handleOnMouseOn}
        onMouseLeave={handleOnMouseLeave}
        icon={!!iconName}
        ref={refButton}
        mouseClick={mouseClick}
        mouseOn={mouseOn || isActive}
        disabled={disabled || (!!disableFetchActions && isFetchToBlock)}
        color={colorButton}
        sitePropsColors={sitePropsColors}
        minHeight={minHeight}
        onClick={(e: any) => handleOnClick(e)}
      >
        {allIcon}
        <styled.TextStyle sitePropsColors={sitePropsColors}>
          {children}
        </styled.TextStyle>
      </styled.ButtonStyle>
    );
  };

export default withSiteProps(ButtonIcon);
