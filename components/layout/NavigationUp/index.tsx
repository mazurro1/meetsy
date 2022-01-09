import React from "react";
import type { NextPage } from "next";
import { withSiteProps } from "@hooks";
import type { ISiteProps } from "@hooks";
import { Colors } from "@constants";
import { NavUpStyle } from "./Navigation.style";
import { PageSegment, Paragraph } from "@ui";

interface NavigationUpProps {
  handleChangeMenu: () => void;
}

const NavigationUp: NextPage<ISiteProps & NavigationUpProps> = ({
  siteProps,
  handleChangeMenu,
}) => {
  const navBackgroundColor = Colors(siteProps).navBackground;
  return (
    <>
      <NavUpStyle navBackgroundColor={navBackgroundColor}>
        <PageSegment id="navigation_up">
          <Paragraph color="WHITE_ONLY" marginBottom={0} marginTop={0}>
            xddddd
          </Paragraph>
          <button onClick={handleChangeMenu}>menu</button>
        </PageSegment>
      </NavUpStyle>
    </>
  );
};

export default withSiteProps(NavigationUp);
