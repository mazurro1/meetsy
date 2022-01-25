import React, { useState, useRef, useEffect } from "react";
import {
  GenerateIcons,
  Tooltip,
  Popup,
  Form,
  InputIcon,
  ButtonIcon,
} from "@ui";
import * as styled from "./ButtonTakeData.style";
import type { NextPage } from "next";
import type { GenerateIconsProps, FormElementsOnSubmit } from "@ui";
import { Colors } from "@constants";
import { withSiteProps, withTranslates } from "@hooks";
import type { ISiteProps, ITranslatesProps } from "@hooks";
import type { ButtonTakeDataProps } from "./ButtonTakeData.model";

const ButtonTakeData: NextPage<
  ButtonTakeDataProps & ISiteProps & GenerateIconsProps & ITranslatesProps
> = ({
  iconName,
  text = "",
  resetTextEnable = false,
  siteProps,
  size,
  handleChangeText,
  placeholder,
  texts,
  handlePopupStatus,
}) => {
  const [mouseClick, setMouseClick] = useState<boolean>(false);
  const [numberScale, setNumberScale] = useState<number>(1);
  const [widthButton, setWidthButton] = useState<number>(0);
  const [popupActive, setPupupActive] = useState<boolean>(false);
  const [activeValue, setActiveValue] = useState<string>(!!text ? text : "");
  const refButton = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!!refButton) {
      if (!!refButton.current) {
        setWidthButton(refButton.current.offsetWidth);
      }
    }
  }, [refButton, text, size?.width]);

  useEffect(() => {
    if (!!handlePopupStatus) {
      handlePopupStatus(popupActive);
    }
  }, [popupActive]);

  const handleOnClick = () => {
    setMouseClick(true);
    setNumberScale(0.95);
    setPupupActive(true);
    setTimeout(() => {
      setMouseClick(false);
      setNumberScale(1);
    }, 500);
  };

  const handleResetText = (e: Event) => {
    e.stopPropagation();
    handleChangeText("");
    setActiveValue("");
  };

  const handleClosePopup = () => {
    setPupupActive(false);
  };

  const handleSubmit = (values: FormElementsOnSubmit[], isValid: boolean) => {
    if (isValid) {
      if (values.length > 0) {
        handleChangeText(values[0].value.toString());
        setActiveValue(values[0].value.toString().trim());
      }
      setPupupActive(false);
    }
  };

  const handleChangeInput = (text: string) => {
    setActiveValue(text);
  };

  const handleResetFormInput = () => {
    setActiveValue("");
    handleChangeText("");
    setPupupActive(false);
  };

  const handleClose = () => {
    setPupupActive(false);
    setActiveValue(text);
  };

  const backgroundColor: string = Colors(siteProps).backgroundColorPage;
  const greyColor: string = Colors(siteProps).greyColor;
  const greyLightColor: string = Colors(siteProps).greyColorLight;
  const primaryColorDark: string = Colors(siteProps).primaryColorDark;
  const whiteIconReset: string = Colors(siteProps).textOnlyWhite;

  return (
    <>
      <styled.PositionRelative>
        <Tooltip text={texts!.searchFavouritePlace}>
          <styled.DivTakeData
            onClick={handleOnClick}
            mouseClick={mouseClick}
            numberScale={numberScale}
            resetTextEnable={resetTextEnable}
            backgroundColor={backgroundColor}
            greyColor={greyColor}
            greyLightColor={greyLightColor}
            ref={refButton}
          >
            <styled.IconStyle greyColor={greyColor}>
              <GenerateIcons iconName={iconName} />
            </styled.IconStyle>
            {!!text ? text : placeholder}
          </styled.DivTakeData>
        </Tooltip>
        {resetTextEnable && (
          <Tooltip text={texts!.reset}>
            <styled.IconResetDate
              onClick={handleResetText}
              whiteIconReset={whiteIconReset}
              primaryColorDark={primaryColorDark}
              widthButton={widthButton}
            >
              <GenerateIcons iconName="XIcon" />
            </styled.IconResetDate>
          </Tooltip>
        )}
      </styled.PositionRelative>
      <Popup
        popupEnable={popupActive}
        handleClose={handleClosePopup}
        title={texts!.searchFavouritePlace}
        maxWidth={600}
        id="take_data_button"
      >
        <Form
          onSubmit={handleSubmit}
          id="form_search_place"
          buttonText={texts!.search}
          iconName="SearchIcon"
          buttonColor="GREEN"
          validation={[
            {
              placeholder: texts!.companyName,
              minLength: 3,
              isString: true,
              maxLength: 40,
            },
          ]}
          marginBottom={0}
          marginTop={0}
          extraButtons={
            <>
              <ButtonIcon
                id="button_reset_input"
                onClick={handleResetFormInput}
                color="RED"
                iconName="RefreshIcon"
              >
                {texts!.reset}
              </ButtonIcon>
              <ButtonIcon
                id="button_cancel_input"
                iconName="XIcon"
                onClick={handleClose}
                color="GREY"
              >
                {texts!.cancel}
              </ButtonIcon>
            </>
          }
        >
          <InputIcon
            placeholder={texts!.companyName}
            value={activeValue}
            onChange={handleChangeInput}
            iconName="SearchIcon"
            color="PRIMARY_DARK"
            colorDefault="GREY_LIGHT"
            validText={texts!.validMinLetter}
            id="company_name_input"
          />
        </Form>
      </Popup>
    </>
  );
};

export default withTranslates(withSiteProps(ButtonTakeData), "ButtonTakeData");
