import React, { useState, useRef, useEffect } from "react";
import * as styled from "./ButtonIconStyle";
import { updateDisabledFetchActions } from "@/redux/site/actions";
import { useDispatch, useSelector, RootStateOrAny } from "react-redux";
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
import { GenerateIcons } from "@ui";

const ButtonIcon: NextPage<ISiteProps & ButtonIconProps> = ({
  siteProps = {
    blind: false,
    dark: false,
    language: "pl",
  },
  fontSize = "MEDIUM",
  uppercase = false,
  onClick = (e: Event) => {},
  title = "",
  iconName = "",
  disabled = false,
  id = "",
  isFetchToBlock = false,
  isActive = false,
  isButton = false,
  type = "button",
  color = "PRIMARY",
}) => {
  const [mouseOn, setMouseOn] = useState(false);
  const [mouseClick, setMouseClick] = useState(false);
  const [numberScale, setNumberScale] = useState(1);
  const refButton = useRef<any>(null);
  const timerToClearSomewhere: any = useRef(null);
  const disableFetchActions = useSelector(
    (state: RootStateOrAny) => state.site.disableFetchActions
  );

  const dispatch = useDispatch();

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
    if (!disabled && !disableFetchActions && !isActive) {
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
          dispatch(updateDisabledFetchActions(true));
          setMouseOn(false);
          setNumberScale(1);
          setMouseClick(true);
          onClick(e);

          setTimeout(() => {
            dispatch(updateDisabledFetchActions(false));
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
        disabled={disabled || (disableFetchActions && isFetchToBlock)}
        sitePropsColors={sitePropsColors}
        id="IconStyle"
        color={colorIcon}
      />
      <styled.OnlyIcon sitePropsColors={sitePropsColors}>
        {GenerateIcons(iconName)}
      </styled.OnlyIcon>
    </>
  );

  const fontSizeCheck: number =
    fontSize === "SMALL" ? 14 : fontSize === "MEDIUM" ? 16 : 18;

  const idElementButton: idElementButtonInterface | {} = !!id ? { id: id } : {};

  const typeElement: typeElementInterface | {} = isButton ? { type: type } : {};

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
      disabled={disabled || (disableFetchActions && isFetchToBlock)}
      color={colorButton}
      sitePropsColors={sitePropsColors}
      onClick={(e: any) => handleOnClick(e)}
    >
      {allIcon}
      <styled.TextStyle sitePropsColors={sitePropsColors}>
        {title}
      </styled.TextStyle>
    </styled.ButtonStyle>
  );
};

export default withSiteProps(ButtonIcon);
