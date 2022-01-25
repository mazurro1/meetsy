import React, { useState, useEffect } from "react";
import type { NextPage } from "next";
import {
  LayoutPageColor,
  MinHeightContent,
  LoadingStyle,
} from "./Layout.style";
import Alert from "./Alerts";
import NavigationUp from "./NavigationUp";
import NavigationDown from "./NavigationDown";
import { Colors } from "@constants";
import Menu from "./Menu";
import Footer from "./Footer";
import { updateUser } from "@/redux/user/actions";
import { FetchData, Popup, Paragraph, GenerateIcons } from "@ui";
import { useSession, signOut } from "next-auth/react";
import UpdatePasswordUserFromSocial from "./UpdatePasswordUserFromSocial";
import { withSiteProps, withTranslates } from "@hooks";
import type { ISiteProps, ITranslatesProps } from "@hooks";

const Layout: NextPage<ISiteProps & ITranslatesProps> = ({
  children,
  siteProps,
  router,
  session,
  user,
  dispatch,
  texts,
}) => {
  const [menuEnable, setMenuEnable] = useState<boolean>(false);
  const [validIsNewFromSocial, setValidIsNewFromSocial] =
    useState<boolean>(false);
  const [validEmailToVerified, setValidEmailToVerified] =
    useState<boolean>(false);
  const [validHasPhoneProvidet, setValidHasPhoneProvidet] =
    useState<boolean>(false);
  const [validHasPhoneConfirmed, setValidHasPhoneConfirmed] =
    useState<boolean>(false);
  const { status } = useSession();

  useEffect(() => {
    if (!!session && !!!user) {
      FetchData({
        url: "/api/user/account",
        method: "GET",
        dispatch: dispatch,
        language: siteProps?.language,
        callback: (data) => {
          if (data.success) {
            dispatch!(updateUser(data.data));
          } else {
            signOut();
          }
        },
      });
    }
  }, [session, user]);

  useEffect(() => {
    if (!!user) {
      setValidIsNewFromSocial(!!user.user?.userDetails.isNewFromSocial);
      setValidEmailToVerified(!!user.user?.userDetails.emailIsConfirmed);
      setValidHasPhoneProvidet(!!user.user?.phoneDetails.has);
      setValidHasPhoneConfirmed(!!user.user?.phoneDetails.isConfirmed);
    }
  }, [user]);

  const handleChangeMenu = () => {
    setMenuEnable((prevState) => !prevState);
  };

  const handleCloseUpdatePasswordSocialPopup = () => {
    setValidIsNewFromSocial(false);
  };

  const isMainPage: boolean = router!.pathname === "/";
  const selectColorPage: string = Colors(siteProps).backgroundColorPage;
  const heightElements: number = isMainPage ? 420 : 281;

  console.log("validEmailToVerified", validEmailToVerified);
  console.log("validHasPhoneProvidet", validHasPhoneProvidet);
  console.log("validHasPhoneConfirmed", validHasPhoneConfirmed);
  console.log(user);
  return (
    <LayoutPageColor color={selectColorPage}>
      <Popup
        noContent
        // popupEnable
        popupEnable={status === "loading"}
        closeUpEnable={false}
        effect="opacity"
        id="loading_user_popup"
      >
        <LoadingStyle>
          <Paragraph color="PRIMARY" marginBottom={0} marginTop={0}>
            <GenerateIcons iconName="RefreshIcon" />
          </Paragraph>
        </LoadingStyle>
      </Popup>
      <Popup
        popupEnable={validIsNewFromSocial}
        closeUpEnable={false}
        title={texts!.accountPassword}
        maxWidth={600}
        handleClose={handleCloseUpdatePasswordSocialPopup}
        id="update_user_password_popup"
      >
        <UpdatePasswordUserFromSocial />
      </Popup>
      <NavigationUp handleChangeMenu={handleChangeMenu} />
      <Alert />
      {isMainPage && <NavigationDown />}
      <Menu menuEnable={menuEnable} handleChangeMenu={handleChangeMenu} />
      {isMainPage ? (
        <MinHeightContent heightElements={heightElements}>
          {children}
        </MinHeightContent>
      ) : (
        <MinHeightContent heightElements={heightElements} className="mt-70">
          {children}
        </MinHeightContent>
      )}
      <Footer />
    </LayoutPageColor>
  );
};
export default withTranslates(withSiteProps(Layout), "Layout");
