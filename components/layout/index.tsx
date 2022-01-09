import React from "react";
import type { NextPage } from "next";
import { LayoutPageColor } from "./Layout.style";
import Alert from "./Alerts";
import NavigationUp from "./NavigationUp";
import NavigationDown from "./NavigationDown";
import { withSiteProps } from "@hooks";
import type { ISiteProps } from "@hooks";
import { Colors } from "@constants";
import Menu from "./Menu";
import { useState } from "react";

const Layout: NextPage<ISiteProps> = ({ children, siteProps }) => {
  const [menuEnable, setMenuEnable] = useState(false);
  const selectColorPage: string = Colors(siteProps).backgroundColorPage;

  const handleChangeMenu = () => {
    setMenuEnable((prevState) => !prevState);
  };

  return (
    <LayoutPageColor color={selectColorPage}>
      <NavigationUp handleChangeMenu={handleChangeMenu} />
      <NavigationDown />
      <Menu menuEnable={menuEnable} handleChangeMenu={handleChangeMenu} />
      <Alert />
      {children}
    </LayoutPageColor>
  );
};
export default withSiteProps(Layout);
