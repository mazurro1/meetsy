import React from "react";
import type { NextPage } from "next";
import { Popup, ButtonIcon } from "@ui";
import { MenuStyle } from "./Menu.style";
import { withSiteProps } from "@hooks";
import type { ISiteProps } from "@hooks";
import { Colors } from "@constants";
import { updateLanguageSite } from "@/redux/site/actions";

interface MenuProps {
  menuEnable: boolean;
  handleChangeMenu: () => void;
}

const Menu: NextPage<MenuProps & ISiteProps> = ({
  siteProps,
  menuEnable,
  handleChangeMenu,
  dispatch,
}) => {
  const backgroundColorPage: string = Colors(siteProps).backgroundColorPage;

  const handleUpdateLanguage = () => {
    dispatch!(updateLanguageSite());
  };

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
        <div>
          <ButtonIcon
            onClick={handleUpdateLanguage}
            id="xd"
            color="SECOND"
            iconName="BanIcon"
          >
            Zmień język
          </ButtonIcon>
        </div>
        <button onClick={handleChangeMenu}>menu</button>
      </MenuStyle>
    </>
  );
};

export default withSiteProps(Menu);
