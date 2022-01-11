import React from "react";
import type { NextPage } from "next";
import { withSiteProps } from "@hooks";
import type { ISiteProps } from "@hooks";
import { Colors } from "@constants";
import {
  NavUpStyle,
  PositionElementsNav,
  MenuStyle,
} from "./NavigationUp.style";
import { PageSegment, Paragraph, GenerateIcons } from "@ui";
import type { NavigationUpProps } from "./NavigationUp.model";

const NavigationUp: NextPage<ISiteProps & NavigationUpProps> = ({
  siteProps,
  handleChangeMenu,
}) => {
  const navBackgroundColor = Colors(siteProps).navBackground;
  const primaryColor = Colors(siteProps).primaryColor;
  return (
    <>
      <NavUpStyle navBackgroundColor={navBackgroundColor}>
        <PageSegment id="navigation_up">
          <PositionElementsNav>
            <div>
              <Paragraph
                color="WHITE_ONLY"
                marginBottom={0}
                marginTop={0}
                fontSize="LARGE"
                uppercase
              >
                Meetsy
              </Paragraph>
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
          </PositionElementsNav>
        </PageSegment>
      </NavUpStyle>
    </>
  );
};

export default withSiteProps(NavigationUp);
