import React, {useState, useRef, useEffect} from "react";
import * as styled from "./Button.style";
import {updateDisabledFetchActions} from "@/redux/site/actions";
import {useSelector} from "react-redux";
import {withSiteProps} from "@hooks";
import type {ISiteProps} from "@hooks";
import type {NextPage} from "next";
import {Colors} from "@constants";
import type {ColorsInterface} from "@constants";
import type {
  ButtonNormalProps,
  idElementButtonInterface,
  typeElementInterface,
} from "./Button.model";
import type {IStoreProps} from "@/redux/store";
import {Tooltip} from "@ui";

const ButtonNormal: NextPage<ISiteProps & ButtonNormalProps> = ({
  siteProps = {
    blind: false,
    dark: false,
    language: "pl",
  },
  fontSize = "MEDIUM",
  uppercase = false,
  onClick = () => {},
  children = "",
  disabled = false,
  id = "",
  isFetchToBlock = false,
  type = "button",
  color = "GREY",
  colorHover = "PRIMARY_DARK",
  colorActive = "PRIMARY",
  isActive = false,
  dispatch,
  tooltip = "",
}) => {
  const [mouseClick, setMouseClick] = useState(false);
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
  }, [mouseClick]);

  const handleOnClick = (e: React.MouseEvent<HTMLElement>) => {
    if (!disabled && !isActive) {
      if (isFetchToBlock) {
        if (!disableFetchActions) {
          dispatch!(updateDisabledFetchActions(true));
          setMouseClick(true);
          onClick(e);

          setTimeout(() => {
            dispatch!(updateDisabledFetchActions(false));
          }, 2000);
        }
      } else {
        setMouseClick(true);
        onClick(e);
      }
    }
  };

  const sitePropsColors: ColorsInterface = {
    blind: siteProps.blind,
    dark: siteProps.dark,
  };

  let colorButton: string = "";

  switch (color) {
    case "PRIMARY": {
      colorButton = Colors(sitePropsColors).primaryColor;
      break;
    }
    case "PRIMARY_DARK": {
      colorButton = Colors(sitePropsColors).primaryColor;
      break;
    }
    case "SECOND": {
      colorButton = Colors(sitePropsColors).secondColor;
      break;
    }
    case "SECOND_DARK": {
      colorButton = Colors(sitePropsColors).secondColor;
      break;
    }
    case "RED": {
      colorButton = Colors(sitePropsColors).dangerColor;
      break;
    }
    case "RED_DARK": {
      colorButton = Colors(sitePropsColors).dangerColor;
      break;
    }
    case "GREEN": {
      colorButton = Colors(sitePropsColors).successColor;
      break;
    }
    case "GREY": {
      colorButton = Colors(sitePropsColors).greyColor;
      break;
    }
    case "GREY_LIGHT": {
      colorButton = Colors(sitePropsColors).greyColorLight;
      break;
    }

    default: {
      colorButton = Colors(sitePropsColors).primaryColor;
      break;
    }
  }

  let buttonColorHover: string = "";
  switch (colorHover) {
    case "PRIMARY": {
      buttonColorHover = Colors(sitePropsColors).primaryColor;
      break;
    }
    case "PRIMARY_DARK": {
      buttonColorHover = Colors(sitePropsColors).primaryColorDark;
      break;
    }
    case "SECOND": {
      buttonColorHover = Colors(sitePropsColors).secondColor;
      break;
    }
    case "SECOND_DARK": {
      buttonColorHover = Colors(sitePropsColors).secondColorDark;
      break;
    }
    case "RED": {
      buttonColorHover = Colors(sitePropsColors).dangerColor;
      break;
    }
    case "RED_DARK": {
      buttonColorHover = Colors(sitePropsColors).dangerColorDark;
      break;
    }
    case "GREEN": {
      buttonColorHover = Colors(sitePropsColors).successColor;
      break;
    }
    case "GREEN_DARK": {
      buttonColorHover = Colors(sitePropsColors).successColorDark;
      break;
    }
    case "GREY": {
      buttonColorHover = Colors(sitePropsColors).greyColor;
      break;
    }
    case "GREY_DARK": {
      buttonColorHover = Colors(sitePropsColors).greyColorDark;
      break;
    }
    case "GREY_LIGHT": {
      buttonColorHover = Colors(sitePropsColors).greyColorLight;
      break;
    }

    default: {
      buttonColorHover = Colors(sitePropsColors).primaryColor;
      break;
    }
  }

  let buttonColorActive: string = "";
  switch (colorActive) {
    case "PRIMARY": {
      buttonColorActive = Colors(sitePropsColors).primaryColor;
      break;
    }
    case "PRIMARY_DARK": {
      buttonColorActive = Colors(sitePropsColors).primaryColorDark;
      break;
    }
    case "SECOND": {
      buttonColorActive = Colors(sitePropsColors).secondColor;
      break;
    }
    case "SECOND_DARK": {
      buttonColorActive = Colors(sitePropsColors).secondColorDark;
      break;
    }
    case "RED": {
      buttonColorActive = Colors(sitePropsColors).dangerColor;
      break;
    }
    case "RED_DARK": {
      buttonColorActive = Colors(sitePropsColors).dangerColorDark;
      break;
    }
    case "GREEN": {
      buttonColorActive = Colors(sitePropsColors).successColor;
      break;
    }
    case "GREEN_DARK": {
      buttonColorActive = Colors(sitePropsColors).successColorDark;
      break;
    }
    case "GREY": {
      buttonColorActive = Colors(sitePropsColors).greyColor;
      break;
    }
    case "GREY_DARK": {
      buttonColorActive = Colors(sitePropsColors).greyColorDark;
      break;
    }
    case "GREY_LIGHT": {
      buttonColorActive = Colors(sitePropsColors).greyColorLight;
      break;
    }

    default: {
      buttonColorActive = Colors(sitePropsColors).primaryColor;
      break;
    }
  }

  const fontSizeCheck: number =
    fontSize === "SMALL" ? 14 : fontSize === "MEDIUM" ? 16 : 18;

  const idElementButton: idElementButtonInterface | {} = !!id
    ? {id: id, "data-test-id": id}
    : {};

  const typeElement: typeElementInterface = {type: type};

  return (
    <Tooltip text={tooltip} place="bottom" enable={!!tooltip}>
      <styled.ButtonStyle
        {...typeElement}
        {...idElementButton}
        fontSize={fontSizeCheck}
        uppercase={uppercase}
        ref={refButton}
        mouseClick={mouseClick}
        disabled={disabled || (!!disableFetchActions && isFetchToBlock)}
        color={colorButton}
        sitePropsColors={sitePropsColors}
        onClick={handleOnClick}
        buttonColorHover={buttonColorHover}
        isActive={isActive}
        buttonColorActive={buttonColorActive}
      >
        <styled.TextStyle sitePropsColors={sitePropsColors}>
          {children}
        </styled.TextStyle>
      </styled.ButtonStyle>
    </Tooltip>
  );
};

export default withSiteProps(ButtonNormal);
