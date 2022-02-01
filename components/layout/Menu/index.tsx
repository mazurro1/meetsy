import React from "react";
import type { NextPage } from "next";
import { Popup, ButtonIcon } from "@ui";
import { MenuStyle, ButtonMenuStyle } from "./Menu.style";
import { withSiteProps } from "@hooks";
import type { ISiteProps } from "@hooks";
import { Colors } from "@constants";
import { updateLanguageSite } from "@/redux/site/actions";
import { signOut } from "next-auth/react";

interface MenuProps {
  menuEnable: boolean;
  handleChangeMenu: () => void;
  unsubscribeButtonOnClick: () => void;
}

const Menu: NextPage<MenuProps & ISiteProps> = ({
  siteProps,
  menuEnable,
  handleChangeMenu,
  dispatch,
  unsubscribeButtonOnClick,
  user,
}) => {
  const backgroundColorPage: string = Colors(siteProps).backgroundColorPage;

  const handleUpdateLanguage = () => {
    dispatch!(updateLanguageSite());
  };

  const handleClickSignout = () => {
    signOut();
    unsubscribeButtonOnClick();
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
        <ButtonMenuStyle>
          <ButtonIcon
            onClick={handleUpdateLanguage}
            id="xd"
            color="SECOND"
            iconName="BanIcon"
            widthFull
          >
            Zmień język
          </ButtonIcon>
        </ButtonMenuStyle>

        {!!user && (
          <ButtonMenuStyle>
            <ButtonIcon
              id="button_logout"
              iconName="LogoutIcon"
              onClick={handleClickSignout}
              fontSize="SMALL"
              color="RED"
              isFetchToBlock
              widthFull
            >
              WYLOGUJ
            </ButtonIcon>
          </ButtonMenuStyle>
        )}
      </MenuStyle>
    </>
  );
};

export default withSiteProps(Menu);
