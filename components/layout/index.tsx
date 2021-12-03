import React from "react";
import type { NextPage } from "next";
import { Colors } from "@constants";
import { ColorsInterface } from "@/components/constants/Colors/Colors.model";
import { LayoutPageColor } from "./Layout.style";

const Layout: NextPage = ({ children }) => {
  const defaultSiteProps: ColorsInterface = {
    blind: false,
    dark: false,
  };
  const selectColorPage: string = Colors(defaultSiteProps).backgroundColorPage;
  return <LayoutPageColor color={selectColorPage}>{children}</LayoutPageColor>;
};
export default Layout;
