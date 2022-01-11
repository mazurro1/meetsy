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
import Footer from "./Footer";

const Layout: NextPage<ISiteProps> = ({ children, siteProps, router }) => {
  const [menuEnable, setMenuEnable] = useState<boolean>(false);
  const selectColorPage: string = Colors(siteProps).backgroundColorPage;

  const handleChangeMenu = () => {
    setMenuEnable((prevState) => !prevState);
  };

  const isMainPage: boolean = router!.pathname === "/";

  return (
    <LayoutPageColor color={selectColorPage}>
      <NavigationUp handleChangeMenu={handleChangeMenu} />
      <Alert />
      {isMainPage && <NavigationDown />}
      <Menu menuEnable={menuEnable} handleChangeMenu={handleChangeMenu} />
      {children}
      <Footer />
    </LayoutPageColor>
  );
};
export default withSiteProps(Layout);
