import React from "react";
import type { NextPage } from "next";
import { withSiteProps } from "@hooks";
import type { ISiteProps } from "@hooks";
import { Colors } from "@constants";
import { NavigationDownStyle } from "./Navigation.style";
import { PageSegment, Paragraph } from "@ui";

const NavigationDown: NextPage<ISiteProps> = ({ siteProps }) => {
  const navDownBackgroundColor = Colors(siteProps).navDownBackground;
  return (
    <>
      <NavigationDownStyle navDownBackgroundColor={navDownBackgroundColor}>
        <PageSegment id="navigation_down">
          <Paragraph color="WHITE_ONLY" marginBottom={0} marginTop={0}>
            xddddd
          </Paragraph>
        </PageSegment>
      </NavigationDownStyle>
    </>
  );
};

export default withSiteProps(NavigationDown);
