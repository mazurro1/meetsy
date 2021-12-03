import React from "react";
import type { NextPage } from "next";
import { Colors } from "@constants";
import { LayoutPageColor } from "./Layout.style";
import { useSelector, RootStateOrAny } from "react-redux";

const Layout: NextPage = ({ children }) => {
  const { siteProps } = useSelector((state: RootStateOrAny) => state.site);
  const selectColorPage: string = Colors(siteProps).backgroundColorPage;
  return <LayoutPageColor color={selectColorPage}>{children}</LayoutPageColor>;
};
export default Layout;
