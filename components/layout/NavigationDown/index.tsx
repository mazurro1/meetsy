import React, { useRef, useEffect, useState } from "react";
import type { NextPage } from "next";
import { Colors } from "@constants";
import {
  NavigationDownStyle,
  UnderMenuIndustries,
  PaddingRight,
  ButtonShowMore,
} from "./Navigation.style";
import { PageSegment, ButtonTakeData, ButtonIcon } from "@ui";
import { AllIndustries } from "@constants";
import { withSiteProps, withTranslates } from "@hooks";
import type { ISiteProps, ITranslatesProps } from "@hooks";

const NavigationDown: NextPage<ISiteProps & ITranslatesProps> = ({
  siteProps,
  isMobile,
  texts,
}) => {
  const [visibleMenuIndustries, setVisibleMenuIndustries] = useState(false);
  const [heightMenuIndustries, setHeightMenuIndustries] = useState(137);
  const [activeIndustries, setActiveIndustries] = useState<number | null>(null);
  const [selectedNameMenu, setSelectedNameMenu] = useState<string>("");
  const refUnderMenuIndustries = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!!refUnderMenuIndustries) {
      if (!!refUnderMenuIndustries.current) {
        setHeightMenuIndustries(refUnderMenuIndustries.current.offsetHeight);
      }
    }
  }, [refUnderMenuIndustries, visibleMenuIndustries]);

  const handleClickIndustries = (value: number | null) => {
    setActiveIndustries(value);
  };

  const handleClickMenuIndustries = () => {
    setVisibleMenuIndustries((prevState) => !prevState);
  };

  const handleChangeText = (text: string) => {
    setSelectedNameMenu(text);
  };

  const buttonColor: string = Colors(siteProps).greyColor;
  const buttonColorHover: string = Colors(siteProps).primaryColorDark;
  const buttonColorActive: string = Colors(siteProps).primaryColor;
  const navDownBackgroundColor: string = Colors(siteProps).navDownBackground;

  const mapedIndustries = AllIndustries[siteProps!.language].map((item) => {
    return (
      <PaddingRight
        key={`industries_${item.value}`}
        buttonColor={buttonColor}
        buttonColorHover={buttonColorHover}
        buttonColorActive={buttonColorActive}
        isActive={item.value === activeIndustries}
      >
        <ButtonIcon
          id={`industries_${item.value}`}
          onClick={() => handleClickIndustries(item.value)}
          color="GREY"
        >
          {item.label}
        </ButtonIcon>
      </PaddingRight>
    );
  });

  return (
    <>
      <NavigationDownStyle
        navDownBackgroundColor={navDownBackgroundColor}
        heightMenuIndustries={heightMenuIndustries}
        visibleMenuIndustries={visibleMenuIndustries}
      >
        <PageSegment id="navigation_down">
          <ButtonTakeData
            handleChangeText={handleChangeText}
            resetTextEnable={!!selectedNameMenu}
            iconName="SearchIcon"
            placeholder={texts!.searchFavouritePlace}
            text={selectedNameMenu}
          />
          <UnderMenuIndustries ref={refUnderMenuIndustries}>
            <PaddingRight
              buttonColor={buttonColor}
              buttonColorHover={buttonColorHover}
              buttonColorActive={buttonColorActive}
              isActive={activeIndustries === null}
            >
              <ButtonIcon
                id="industries_0"
                onClick={() => handleClickIndustries(null)}
              >
                {texts!.searchAll}
              </ButtonIcon>
            </PaddingRight>
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
