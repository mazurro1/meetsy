import React from "react";
import type { NextPage } from "next";
import { Popup } from "@ui";
import { MenuStyle } from "./Menu.style";
import { withSiteProps } from "@hooks";
import type { ISiteProps } from "@hooks";
import { Colors } from "@constants";

interface MenuProps {
  menuEnable: boolean;
  handleChangeMenu: () => void;
}

const Menu: NextPage<MenuProps & ISiteProps> = ({
  siteProps,
  menuEnable,
  handleChangeMenu,
}) => {
  const backgroundColorPage = Colors(siteProps).backgroundColorPage;
  return (
    <>
      <Popup
        noContent
        popupEnable={menuEnable}
        effect="opacity"
        closeUpEnable={false}
        handleClose={handleChangeMenu}
        clickedBackgroundToClose
        id="menu_popup"
      />
      <MenuStyle
        menuEnable={menuEnable}
        backgroundColorPage={backgroundColorPage}
      >
        <button onClick={handleChangeMenu}>menu</button>
      </MenuStyle>
    </>
  );
};

export default withSiteProps(Menu);
