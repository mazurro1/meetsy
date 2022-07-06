import React from "react";
import type {NextPage} from "next";
import {Popup, ButtonIcon, Tooltip} from "@ui";
import {MenuStyle, ButtonMenuStyle} from "./Menu.style";
import {withSiteProps, withUserProps, withTranslates} from "@hooks";
import type {ISiteProps, IWithUserProps, ITranslatesProps} from "@hooks";
import {Colors} from "@constants";
import {
  updateLanguageSite,
  updateBlindMode,
  updateDarkMode,
} from "@/redux/site/actions";
import {signOut} from "next-auth/react";
import AlertUser from "../AlertsUser/index";

interface MenuProps {
  menuEnable: boolean;
  handleChangeMenu: () => void;
  unsubscribeButtonOnClick: () => void;
}

const Menu: NextPage<
  MenuProps & ISiteProps & IWithUserProps & ITranslatesProps
> = ({
  siteProps,
  menuEnable,
  handleChangeMenu,
  dispatch,
  unsubscribeButtonOnClick,
  user,
  texts,
  router,
  isMobile,
}) => {
  const backgroundColorPage: string = Colors(siteProps).backgroundColorPage;

  const handleUpdateDarkMode = () => {
    dispatch!(updateDarkMode(!siteProps?.dark));
  };

  const handleUpdateBlindMode = () => {
    dispatch!(updateBlindMode(!siteProps?.blind));
  };

  const handleUpdateLanguage = () => {
    dispatch!(updateLanguageSite());
  };

  const handleClickSignout = () => {
    signOut();
    unsubscribeButtonOnClick();
  };

  let userHasActionToDo: boolean = false;
  let userHasNewPhoneToConfirm: boolean = false;
  let userHasNewEmailToConfirm: boolean = false;
  let userDefaultCompanyId: string = "";

  if (!!user) {
    if (!!user.defaultCompanyId) {
      if (typeof user.defaultCompanyId === "string") {
        userDefaultCompanyId = user.defaultCompanyId;
      } else {
        userDefaultCompanyId = user.defaultCompanyId._id;
      }
    }

    if (!!user.userDetails && !!user.phoneDetails) {
      userHasActionToDo =
        !!!user.userDetails!.hasPassword ||
        !!!user.userDetails!.emailIsConfirmed ||
        !!!user.phoneDetails!.has ||
        !!!user.phoneDetails!.isConfirmed;
    }
    userHasNewPhoneToConfirm = !!user.phoneDetails.toConfirmNumber;
    userHasNewPhoneToConfirm = !!user.userDetails.toConfirmEmail;
  }

  const buttonsNav = !!user ? (
    <>
      <div className="mt-10 width-100">
        <Tooltip
          text={texts!.confirmAccountToCreate}
          enable={userHasActionToDo}
          fullWidth
        >
          <ButtonIcon
            id="create_company_button"
            onClick={() => {}}
            loadingToChangeRouteLink="/account/companys/create"
            iconName="BriefcaseIcon"
            isNewIcon
            disabled={userHasActionToDo}
            fullWidth
          >
            {texts!.createCompany}
          </ButtonIcon>
        </Tooltip>
      </div>
      <div className="mt-10 width-100">
        <Tooltip
          text={texts!.confirmAccountToShow}
          enable={userHasActionToDo}
          fullWidth
        >
          <ButtonIcon
            id="all_user_companys_button"
            onClick={() => {}}
            iconName="BriefcaseIcon"
            color="SECOND"
            disabled={userHasActionToDo}
            fullWidth
            loadingToChangeRouteLink={`/account/companys${
              !!userDefaultCompanyId ? `?company=${userDefaultCompanyId}` : ""
            }`}
          >
            {texts!.userCompanies}
          </ButtonIcon>
        </Tooltip>
      </div>
      <div className="mt-10 width-100">
        <ButtonIcon
          id="button_registration"
          iconName={userHasActionToDo ? "ExclamationIcon" : "UserIcon"}
          onClick={() => {}}
          capitalize
          color={
            userHasActionToDo
              ? "RED"
              : userHasNewPhoneToConfirm || userHasNewEmailToConfirm
              ? "SECOND"
              : "PRIMARY"
          }
          image={!!user.userDetails.avatarUrl ? user.userDetails.avatarUrl : ""}
          fullWidth
          loadingToChangeRouteLink="/account"
        >
          {`${user.userDetails.name} ${user.userDetails.surname}`}
        </ButtonIcon>
      </div>
    </>
  ) : (
    <>
      <div className="mt-10 width-100">
        <ButtonIcon
          id="button_registration"
          iconName="UserAddIcon"
          onClick={() => {}}
          fullWidth
          loadingToChangeRouteLink="/registration"
        >
          {texts!.registration}
        </ButtonIcon>
      </div>
      <div className="mt-10 width-100">
        <ButtonIcon
          id="button_login"
          iconName="UserIcon"
          onClick={() => {}}
          fullWidth
          loadingToChangeRouteLink="/login"
        >
          {texts!.login}
        </ButtonIcon>
      </div>
    </>
  );

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
            id="change_language_button"
            iconName="RefreshIcon"
            fullWidth
          >
            Zmień język
          </ButtonIcon>
        </ButtonMenuStyle>
        <ButtonMenuStyle>
          <ButtonIcon
            onClick={handleUpdateBlindMode}
            id="change_language_button"
            iconName="RefreshIcon"
            fullWidth
          >
            Zmień tryb dla daltonistów
          </ButtonIcon>
        </ButtonMenuStyle>
        <ButtonMenuStyle>
          <ButtonIcon
            onClick={handleUpdateDarkMode}
            id="change_language_button"
            iconName="RefreshIcon"
            fullWidth
          >
            Zmień tryb strony ciemny/jasny
          </ButtonIcon>
        </ButtonMenuStyle>
        {buttonsNav}
        {!!user && (
          <ButtonMenuStyle>
            <ButtonIcon
              id="button_logout"
              iconName="LogoutIcon"
              onClick={handleClickSignout}
              color="RED"
              isFetchToBlock
              fullWidth
            >
              WYLOGUJ
            </ButtonIcon>
          </ButtonMenuStyle>
        )}
      </MenuStyle>
    </>
  );
};

export default withSiteProps(
  withUserProps(withTranslates(Menu, "NavigationUp"))
);
