import React from "react";
import type { NextPage } from "next";
import { withSiteProps } from "@hooks";
import type { ISiteProps } from "@hooks";
import { Colors } from "@constants";
import {
  NavUpStyle,
  PositionElementsNav,
  MenuStyle,
  PositionRightElements,
  LogoStyle,
} from "./NavigationUp.style";
import { PageSegment, Paragraph, GenerateIcons, ButtonIcon } from "@ui";
import type { NavigationUpProps } from "./NavigationUp.model";

const NavigationUp: NextPage<ISiteProps & NavigationUpProps> = ({
  siteProps,
  handleChangeMenu,
  router,
}) => {
  const handleClickButton = (path: string) => {
    router?.push(path);
  };

  const navBackgroundColor = Colors(siteProps).navBackground;
  const primaryColor = Colors(siteProps).primaryColor;
  return (
    <>
      <NavUpStyle navBackgroundColor={navBackgroundColor}>
        <PageSegment id="navigation_up">
          <PositionElementsNav>
            <LogoStyle onClick={() => handleClickButton("/")}>
              <Paragraph
                color="WHITE_ONLY"
                marginBottom={0}
                marginTop={0}
                fontSize="LARGE"
                uppercase
              >
                Meetsy
              </Paragraph>
            </LogoStyle>
            <PositionRightElements>
              <div className="mr-10">
                <ButtonIcon
                  id="button_login"
                  iconName="UserAddIcon"
                  onClick={() => handleClickButton("/registration")}
                  fontSize="SMALL"
                >
                  REJESTRACJA
                </ButtonIcon>
              </div>
              <div className="mr-50">
                <ButtonIcon
                  id="button_login"
                  iconName="UserIcon"
                  onClick={() => handleClickButton("/login")}
                  fontSize="SMALL"
                >
                  LOGOWANIE
                </ButtonIcon>
              </div>
              <MenuStyle onClick={handleChangeMenu} primaryColor={primaryColor}>
                <Paragraph
                  color="WHITE_ONLY"
                  marginBottom={0}
                  marginTop={0}
                  fontSize="LARGE"
                  uppercase
                >
                  <GenerateIcons iconName="MenuIcon" />
                </Paragraph>
              </MenuStyle>
            </PositionRightElements>
          </PositionElementsNav>
        </PageSegment>
      </NavUpStyle>
    </>
  );
};

export default withSiteProps(NavigationUp);
