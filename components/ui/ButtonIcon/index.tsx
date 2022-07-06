import React, {useState, useRef, useEffect} from "react";
import * as styled from "./ButtonIcon.style";
import {updateDisabledFetchActions} from "@/redux/site/actions";
import {useSelector} from "react-redux";
import {withSiteProps} from "@hooks";
import type {ISiteProps} from "@hooks";
import type {NextPage} from "next";
import {Colors} from "@constants";
import type {ColorsInterface} from "@constants";
import type {
  ButtonIconProps,
  idElementButtonInterface,
  typeElementInterface,
} from "./ButtonIcon.model";
import type {GenerateIconsProps} from "@ui";
import {GenerateIcons, Loader, ImageNext} from "@ui";
import type {IStoreProps} from "@/redux/store";

const ButtonIcon: NextPage<
  ISiteProps & ButtonIconProps & GenerateIconsProps
> = ({
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
  iconPadding = 2,
  dispatch,
  minHeight = 0,
  capitalize = false,
  fullWidth = false,
  image = "",
  isNewIcon = false,
  loadingToChangeRouteLink = "",
  router,
}) => {
  const [mouseOn, setMouseOn] = useState(false);
  const [mouseClick, setMouseClick] = useState(false);
  const [numberScale, setNumberScale] = useState(1);
  const [loadingImage, setLoadingImage] = useState<boolean>(true);
  const [loaderEnable, setLoaderEnable] = useState<boolean>(false);
  const refButton = useRef<HTMLButtonElement>(null);
  const timerToClearSomewhere = useRef<any>(null);
  const disableFetchActions = useSelector(
    (state: IStoreProps) => state.site.disableFetchActions
  );

  useEffect(() => {
    setLoaderEnable(false);
  }, [router]);

  const handleClick = () => {
    if (!!loadingToChangeRouteLink) {
      if (router?.asPath !== loadingToChangeRouteLink) {
        setLoaderEnable(true);
      }
    }
  };

  useEffect(() => {
    if (!!image) {
      setLoadingImage(true);
    }
  }, [image]);

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
    if (!disabled && !disableFetchActions && !isActive && !!refButton.current) {
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

  const handleOnClick = (e: React.MouseEvent<HTMLElement>) => {
    if (!disabled) {
      if (isFetchToBlock) {
        if (!disableFetchActions) {
          dispatch!(updateDisabledFetchActions(true));
          setMouseOn(false);
          setNumberScale(1);
          setMouseClick(true);
          handleClick();
          onClick(e);
          if (!!loadingToChangeRouteLink) {
            router?.push(loadingToChangeRouteLink);
          }

          setTimeout(() => {
            dispatch!(updateDisabledFetchActions(false));
          }, 2000);
        }
      } else {
        setMouseOn(false);
        setNumberScale(1);
        setMouseClick(true);
        handleClick();
        onClick(e);
        if (!!loadingToChangeRouteLink) {
          router?.push(loadingToChangeRouteLink);
        }
      }
    }
  };

  const handleOnLoadingImage = () => {
    setLoadingImage(false);
  };

  const sitePropsColors: ColorsInterface = {
    blind: siteProps.blind,
    dark: siteProps.dark,
  };

  let colorIcon: string = "";
  let colorButton: string = "";
  const colorNewIcon: string = Colors(sitePropsColors).dangerColor;
  const colorNewIconDisabled: string = Colors(sitePropsColors).greyColorLight;

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
        hasImage={!!image}
      />
      <styled.OnlyIcon
        sitePropsColors={sitePropsColors}
        iconPadding={iconPadding}
        hasImage={!!image}
      >
        {!!image ? (
          <>
            <Loader enable={loadingImage} size={30} />
            <ImageNext
              src={image}
              alt=""
              width={40}
              height={30}
              onLoadingComplete={handleOnLoadingImage}
            />
          </>
        ) : (
          <styled.IconsStyles>
            <GenerateIcons iconName={iconName} outline={false} />
            {!!isNewIcon && (
              <styled.PositionNewIcon
                colorNewIcon={disabled ? colorNewIconDisabled : colorNewIcon}
              >
                <GenerateIcons iconName="PlusIcon" outline={false} />
              </styled.PositionNewIcon>
            )}
          </styled.IconsStyles>
        )}
      </styled.OnlyIcon>
    </>
  );

  const fontSizeCheck: number =
    fontSize === "SMALL" ? 14 : fontSize === "MEDIUM" ? 16 : 18;

  const idElementButton: idElementButtonInterface | {} = !!id
    ? {id: id, "data-test-id": id}
    : {};

  const typeElement: typeElementInterface = {type: type};

  return (
    <>
      <Loader enable={loaderEnable} position="fixed" />
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
        onClick={handleOnClick}
        capitalize={capitalize}
        fullWidth={fullWidth}
        hasImage={!!image}
      >
        {allIcon}
        <styled.TextStyle sitePropsColors={sitePropsColors}>
          {children}
        </styled.TextStyle>
      </styled.ButtonStyle>
    </>
  );
};

export default withSiteProps(ButtonIcon);
