import React, { useRef, useEffect, useState } from "react";
import type { NextPage } from "next";
import { Colors } from "@constants";
import {
  NavigationDownStyle,
  UnderMenuIndustries,
  PaddingRight,
  ButtonShowMore,
} from "./Navigation.style";
import { PageSegment, ButtonTakeData, ButtonIcon, Button } from "@ui";
import { AllIndustries } from "@constants";
import { withSiteProps, withTranslates } from "@hooks";
import type { ISiteProps, ITranslatesProps } from "@hooks";
import {
  updateIndustries,
  updateSearchCompanyName,
} from "@/redux/searchCompanys/actions";
import { useSelector } from "react-redux";
import type { IStoreProps } from "@/redux/store";
import type { NavigationDownProps } from "./NavigationDown.model";

const NavigationDown: NextPage<
  ISiteProps & ITranslatesProps & NavigationDownProps
> = ({ siteProps, isMobile, texts, size, dispatch }) => {
  const [copyPopupButtonTakeData, setCopyPopupButtonTakeData] =
    useState<boolean>(false);
  const [visibleMenuIndustries, setVisibleMenuIndustries] = useState(false);
  const [heightMenuIndustries, setHeightMenuIndustries] = useState(137);
  const refUnderMenuIndustries = useRef<HTMLDivElement>(null);
  const selectedIndustries = useSelector(
    (state: IStoreProps) => state.searchCompanys.selectedIndustries
  );
  const searchCompanyName = useSelector(
    (state: IStoreProps) => state.searchCompanys.searchCompanyName
  );

  useEffect(() => {
    if (!!refUnderMenuIndustries) {
      if (!!refUnderMenuIndustries.current) {
        setHeightMenuIndustries(refUnderMenuIndustries.current.offsetHeight);
      }
    }
  }, [refUnderMenuIndustries, visibleMenuIndustries, size!.width]);

  const handleClickIndustries = (value: number) => {
    dispatch!(updateIndustries(value));
  };

  const handleClickMenuIndustries = () => {
    setVisibleMenuIndustries((prevState) => !prevState);
  };

  const handleChangeText = (text: string) => {
    dispatch!(updateSearchCompanyName(text.trim()));
  };

  const handleChangePopupButtonTakeData = (value: boolean) => {
    setCopyPopupButtonTakeData(value);
  };

  const navDownBackgroundColor: string = Colors(siteProps).navDownBackground;
  const mapedIndustries = AllIndustries[siteProps!.language].map((item) => {
    return (
      <PaddingRight key={`industries_${item.value}`}>
        <Button
          id={`industries_${item.value}`}
          onClick={() => handleClickIndustries(item.value)}
          isActive={item.value === selectedIndustries}
          colorHover="PRIMARY_DARK"
          colorActive="PRIMARY"
          color="GREY"
        >
          {item.label}
        </Button>
      </PaddingRight>
    );
  });

  return (
    <>
      <NavigationDownStyle
        navDownBackgroundColor={navDownBackgroundColor}
        heightMenuIndustries={heightMenuIndustries}
        visibleMenuIndustries={visibleMenuIndustries}
        copyPopupButtonTakeData={copyPopupButtonTakeData}
      >
        <PageSegment id="navigation_down">
          <ButtonTakeData
            handleChangeText={handleChangeText}
            resetTextEnable={!!searchCompanyName}
            iconName="SearchIcon"
            placeholder={texts!.searchFavouritePlace}
            text={searchCompanyName}
            handlePopupStatus={handleChangePopupButtonTakeData}
          />
          <UnderMenuIndustries ref={refUnderMenuIndustries}>
            {mapedIndustries}
            <ButtonShowMore>
              <ButtonIcon
                id="button_show_industries"
                iconName="ChevronDownIcon"
                onClick={handleClickMenuIndustries}
                color="PRIMARY"
              >
                {isMobile
                  ? texts!.selectSpecialization
                  : visibleMenuIndustries
                  ? texts!.showLess
                  : texts!.showMore}
              </ButtonIcon>
            </ButtonShowMore>
          </UnderMenuIndustries>
        </PageSegment>
      </NavigationDownStyle>
    </>
  );
};

export default withTranslates(withSiteProps(NavigationDown), "NavigationDown");
