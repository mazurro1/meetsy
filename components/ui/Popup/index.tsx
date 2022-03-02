import {useRef} from "react";
import {NextPage} from "next";
import {CSSTransition} from "react-transition-group";
import * as styled from "./Popup.style";
import {Heading, GenerateIcons, Paragraph} from "@ui";
import {Colors, ColorsInterface} from "@constants";
import {withSiteProps} from "@hooks";
import type {ISiteProps} from "@hooks";
import type {PopupProps} from "./Popup.model";

const Popup: NextPage<PopupProps & ISiteProps> = ({
  popupEnable = false,
  handleClose = () => {},
  children,
  maxWidth = 900,
  noContent = false,
  fullScreen = false,
  title = "",
  effect = "popup",
  position = "fixed",
  closeTitle = true,
  closeUpEnable = true,
  backgroundBorderRadius = false,
  smallTitle = false,
  overflowComponent = true,
  maxHeight = true,
  clickedBackgroundToClose = false,
  heightFull = false,
  top = "0",
  bottom = "0",
  lightBackground = false,
  unmountOnExit = true,
  color = "PRIMARY",
  siteProps,
  id = "",
  zIndex = 600,
}) => {
  const nodeRef = useRef(null);
  const sitePropsColors: ColorsInterface = {
    blind: siteProps!.blind,
    dark: siteProps!.dark,
  };

  const handleOnClick = () => {
    handleClose();
  };

  const handleOnClickContent = (e: any) => {
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
  };
  const handleClickBackground = (e: any) => {
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
    if (clickedBackgroundToClose) {
      handleOnClick();
    }
  };

  const isTitleOn: boolean = !!title;

  const colorBackground: string = Colors(sitePropsColors).backgroundColorPage;
  const colorTextNav: string = Colors(sitePropsColors).textWhite;
  let colorBackgroundNav: string = "";
  let colorCloseNavHover: string = "";

  switch (color) {
    case "PRIMARY": {
      colorBackgroundNav = Colors(sitePropsColors).primaryColorDark;
      colorCloseNavHover = Colors(sitePropsColors).primaryColor;
      break;
    }
    case "SECOND": {
      colorBackgroundNav = Colors(sitePropsColors).secondColorDark;
      colorCloseNavHover = Colors(sitePropsColors).secondColor;
      break;
    }
    case "RED": {
      colorBackgroundNav = Colors(sitePropsColors).dangerColorDark;
      colorCloseNavHover = Colors(sitePropsColors).dangerColor;
      break;
    }
    case "GREEN": {
      colorBackgroundNav = Colors(sitePropsColors).successColorDark;
      colorCloseNavHover = Colors(sitePropsColors).successColor;
      break;
    }
    case "GREY": {
      colorBackgroundNav = Colors(sitePropsColors).greyColorDark;
      colorCloseNavHover = Colors(sitePropsColors).greyColor;
      break;
    }

    default: {
      colorBackgroundNav = Colors(sitePropsColors).primaryColorDark;
      colorCloseNavHover = Colors(sitePropsColors).primaryColor;
      break;
    }
  }

  const contentComponent = noContent ? (
    <styled.ContentNoBorder
      onClick={handleOnClickContent}
      onKeyDown={() => {}}
      role="button"
      tabIndex={0}
    >
      {closeUpEnable && (
        <styled.PositionCloseNoContent>
          <styled.CloseNoContent onClick={handleClose}>
            <Paragraph color="WHITE_ONLY" marginTop={0} marginBottom={0}>
              <GenerateIcons iconName="XIcon" />
            </Paragraph>
          </styled.CloseNoContent>
        </styled.PositionCloseNoContent>
      )}
      {children}
    </styled.ContentNoBorder>
  ) : (
    <styled.PopupContent
      maxWidth={maxWidth}
      onClick={handleOnClickContent}
      fullScreen={fullScreen}
      overflowComponent={overflowComponent}
      maxHeight={maxHeight}
      heightFull={heightFull}
    >
      {isTitleOn && (
        <styled.TitlePagePopup
          colorTextNav={colorTextNav}
          colorBackgroundNav={colorBackgroundNav}
          smallTitle={smallTitle}
        >
          <Heading
            tag={smallTitle ? 2 : 1}
            color="WHITE"
            marginBottom={0}
            marginTop={0}
          >
            {title}
          </Heading>
          {closeTitle && (
            <styled.ClosePopup
              onClick={handleOnClick}
              isTitleOn={isTitleOn}
              colorTextNav={colorTextNav}
              smallTitle={smallTitle}
              colorCloseNavHover={colorCloseNavHover}
            >
              <GenerateIcons iconName="XIcon" />
            </styled.ClosePopup>
          )}
        </styled.TitlePagePopup>
      )}
      <styled.PaddingContnent
        maxHeight={maxHeight}
        colorBackground={colorBackground}
      >
        {children}
      </styled.PaddingContnent>
      {!isTitleOn && (
        <styled.ClosePopup
          onClick={handleOnClick}
          isTitleOn={isTitleOn}
          smallTitle={smallTitle}
          colorTextNav={colorTextNav}
          colorCloseNavHover={colorCloseNavHover}
        >
          <GenerateIcons iconName="XIcon" />
        </styled.ClosePopup>
      )}
    </styled.PopupContent>
  );

  return (
    <CSSTransition
      in={popupEnable}
      timeout={400}
      classNames={effect}
      unmountOnExit={unmountOnExit}
      nodeRef={nodeRef}
    >
      <styled.PopupWindow
        onClick={handleClickBackground}
        position={position}
        borderRadius={backgroundBorderRadius}
        top={top}
        bottom={bottom}
        lightBackground={lightBackground}
        ref={nodeRef}
        data-test-id={id}
        id={id}
        zIndex={zIndex}
      >
        {contentComponent}
      </styled.PopupWindow>
    </CSSTransition>
  );
};

export default withSiteProps(Popup);
