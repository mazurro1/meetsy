import React, {useState, useEffect, useCallback} from "react";
import type {NextPage} from "next";
import {LayoutPageColor, MinHeightContent, LoadingStyle} from "./Layout.style";
import Alert from "./Alerts";
import NavigationUp from "./NavigationUp";
import NavigationDown from "./NavigationDown";
import {Colors} from "@constants";
import Menu from "./Menu";
import Footer from "./Footer";
import {updateUser} from "@/redux/user/actions";
import {FetchData, Popup, Paragraph, GenerateIcons} from "@ui";
import {useSession} from "next-auth/react";
import UpdatePasswordUserFromSocial from "./UpdatePasswordUserFromSocial";
import {withSiteProps, withTranslates} from "@hooks";
import type {ISiteProps, ITranslatesProps} from "@hooks";
import {addAlertItem} from "@/redux/site/actions";
import io from "socket.io-client";
import {signOut} from "next-auth/react";
import {UserPropsLive} from "@/models/User/user.model";
import ConfirmEmailAdressUser from "./ConfirmEmailAdressUser";
import UpdateUserPhone from "./UpdateUserPhone";
import ConfirmPhoneUser from "./ConfirmPhoneUser";

const base64ToUint8Array = (base64: string) => {
  const padding = "=".repeat((4 - (base64.length % 4)) % 4);
  const b64 = (base64 + padding).replace(/-/g, "+").replace(/_/g, "/");

  const rawData = window.atob(b64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
};

declare global {
  interface Window {
    workbox: any;
  }
}

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
  const [validHasPassword, setValidHasPassword] = useState<boolean>(true);
  const [validEmailToVerified, setValidEmailToVerified] =
    useState<boolean>(false);
  const [validHasPhoneVerified, setValidHasPhoneVerified] =
    useState<boolean>(false);
  const [validHasPhoneConfirmed, setValidHasPhoneConfirmed] =
    useState<boolean>(false);
  const [subscriptionWebPush, setSubscriptionWebPush] =
    useState<PushSubscription | null>(null);
  const [registrationWebPush, setRegistrationWebPush] =
    useState<ServiceWorkerRegistration | null>(null);

  const {status} = useSession();

  useEffect(() => {
    if (!!user) {
      const resultUser = UserPropsLive.safeParse(user); // test user props in runtime
      if (!resultUser.success) {
        console.warn(resultUser.error);
      }
    }
  }, [user]);

  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      "serviceWorker" in navigator &&
      window.workbox !== undefined
    ) {
      navigator.serviceWorker.ready.then((reg) => {
        reg.pushManager.getSubscription().then((sub) => {
          let expirationTime: number = 1;
          if (!!sub) {
            // @ts-ignore
            expirationTime = !!sub.expirationTime ? sub.expirationTime : 1;
          }
          if (
            sub &&
            !(expirationTime && Date.now() > expirationTime - 5 * 60 * 1000)
          ) {
            setSubscriptionWebPush(sub);
          }
        });
        setRegistrationWebPush(reg);
      });
    }
  }, []);

  const subscribeButtonOnClick = useCallback(async () => {
    const sub = await registrationWebPush?.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: base64ToUint8Array(
        !!process.env.NEXT_PUBLIC_WEB_PUSH_PUBLIC_KEY
          ? process.env.NEXT_PUBLIC_WEB_PUSH_PUBLIC_KEY
          : ""
      ),
    });
    if (!!sub) {
      FetchData({
        url: "/api/user/push",
        method: "POST",
        dispatch: dispatch,
        language: siteProps?.language,
        data: sub,
        callback: (data) => {
          if (data.success) {
            setSubscriptionWebPush(!!sub ? sub : null);
          } else {
            dispatch!(
              addAlertItem("Błąd podczas aktualizacji powiadomień", "RED")
            );
          }
        },
      });
    }
  }, [registrationWebPush?.pushManager, dispatch, siteProps?.language]);

  const unsubscribeButtonOnClick = useCallback(async () => {
    await subscriptionWebPush?.unsubscribe();
    if (!!subscriptionWebPush) {
      FetchData({
        url: "/api/user/push",
        method: "DELETE",
        dispatch: dispatch,
        language: siteProps?.language,
        callback: (data) => {
          if (data.success) {
            setSubscriptionWebPush(null);
          } else {
            dispatch!(addAlertItem("Błąd podczas usuwania powiadomień", "RED"));
          }
        },
      });
    }
  }, [dispatch, siteProps?.language, subscriptionWebPush]);

  useEffect(() => {
    if (!!user) {
      console.log(user);
      fetch("/api/socketio").finally(() => {
        const socket = io();
        // socket.on("connect", () => {
        //   console.log("connect");
        // });
        socket.on(`userId?${user._id}`, (data) => {
          console.log("hello", data);
        });
      });
    }
  }, [user]);

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
            subscribeButtonOnClick();
          } else {
            dispatch!(addAlertItem("Błąd podczas logowania", "RED"));
            if (!!session) {
              signOut();
            }
          }
        },
      });
    }
  }, [session, user, dispatch, siteProps?.language, subscribeButtonOnClick]);

  useEffect(() => {
    if (!!user) {
      setValidHasPassword(!!user.userDetails?.hasPassword);
      setValidEmailToVerified(!user.userDetails?.emailIsConfirmed);
      setValidHasPhoneVerified(!user.phoneDetails?.has);
      setValidHasPhoneConfirmed(!user.phoneDetails?.isConfirmed);
    }
  }, [user]);

  const handleTestSocket = () => {
    FetchData({
      url: "/api/user/socket_test",
      method: "GET",
      dispatch: dispatch,
      language: siteProps?.language,
      callback: (data) => {
        if (data.success) {
          console.warn("test socket and webpush");
        } else {
          // dispatch!(addAlertItem("Błąd podczas logowania", "RED"));
        }
      },
    });
  };

  const handleChangeMenu = () => {
    setMenuEnable((prevState) => !prevState);
  };

  const handleCloseUpdatePasswordSocialPopup = () => {
    setValidHasPassword((prevState) => !prevState);
  };

  const handleCloseConfirmUserEmailPopup = () => {
    setValidEmailToVerified((prevState) => !prevState);
  };

  const handleCloseVerifiedUserPhonePopup = () => {
    setValidHasPhoneVerified((prevState) => !prevState);
  };

  const handleCloseConfirmUserPhonePopup = () => {
    setValidHasPhoneConfirmed((prevState) => !prevState);
  };

  const handleUploadImage = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length) {
      const [file] = event.target.files;
      FetchData({
        url: "/api/user/socket_test",
        method: "POST",
        dispatch: dispatch,
        language: siteProps?.language,
        data: {
          type: file.type,
          name: file.name,
        },
        callback: async (data) => {
          if (data.success) {
            if (!!data.data.url) {
              const responseupload = await fetch(data.data.url, {
                method: "PUT",
                body: file,
                headers: {
                  "Content-type": file.type,
                },
              });
              console.log(responseupload.url);
            }
          } else {
            dispatch!(addAlertItem("Błąd podczas uploadu pliku", "RED"));
          }
        },
      });
    }
  };

  const isMainPage: boolean = router!.pathname === "/";
  const selectColorPage: string = Colors(siteProps).backgroundColorPage;
  const heightElements: number = isMainPage ? 420 : 281;
  const allPopupsUser = !!user && (
    <>
      <Popup
        popupEnable={!validHasPassword}
        closeUpEnable={false}
        title={texts!.accountPassword}
        maxWidth={600}
        handleClose={handleCloseUpdatePasswordSocialPopup}
        id="update_user_password_popup"
      >
        <UpdatePasswordUserFromSocial />
      </Popup>
      <Popup
        popupEnable={
          validEmailToVerified &&
          !!validHasPassword &&
          !!user.userDetails?.hasPassword
        }
        closeUpEnable={false}
        title={texts!.confirmAccountEmail}
        maxWidth={600}
        handleClose={handleCloseConfirmUserEmailPopup}
        id="confirm_user_email_popup"
      >
        <ConfirmEmailAdressUser />
      </Popup>
      <Popup
        popupEnable={
          validHasPhoneVerified &&
          !validEmailToVerified &&
          !!validHasPassword &&
          !!user.userDetails?.hasPassword
        }
        closeUpEnable={false}
        title={texts!.addPhoneNumber}
        maxWidth={600}
        handleClose={handleCloseVerifiedUserPhonePopup}
        id="verified_user_phone_popup"
      >
        <UpdateUserPhone />
      </Popup>
      <Popup
        popupEnable={
          validHasPhoneConfirmed &&
          !validHasPhoneVerified &&
          !validEmailToVerified &&
          !!validHasPassword &&
          user.phoneDetails.has &&
          !!user.userDetails?.hasPassword
        }
        closeUpEnable={false}
        title={`${texts!.confirmPhoneNumber}: ${user!.phoneDetails!.number}`}
        maxWidth={800}
        handleClose={handleCloseConfirmUserPhonePopup}
        id="verified_user_phone_popup"
      >
        <ConfirmPhoneUser />
      </Popup>
    </>
  );

  return (
    <LayoutPageColor color={selectColorPage}>
      <Popup
        noContent
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
      {allPopupsUser}
      <NavigationUp handleChangeMenu={handleChangeMenu} />
      <Alert />
      {isMainPage && <NavigationDown />}
      <Menu
        menuEnable={menuEnable}
        handleChangeMenu={handleChangeMenu}
        unsubscribeButtonOnClick={unsubscribeButtonOnClick}
      />
      {isMainPage ? (
        <MinHeightContent heightElements={heightElements}>
          {children}
          <button onClick={handleTestSocket}>socket test</button>
          <input type="file" onChange={handleUploadImage} />
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
