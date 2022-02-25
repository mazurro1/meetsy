import {NextPage} from "next";
import {withSiteProps, withTranslates} from "@hooks";
import type {ISiteProps, ITranslatesProps} from "@hooks";
import {PageSegment, ButtonIcon, Popup} from "@ui";
import {GetServerSideProps} from "next";
import {getSession} from "next-auth/react";
import {useState, useEffect} from "react";
import ConfirmEmailAdressUser from "@/components/layout/ConfirmEmailAdressUser";
import UpdatePasswordUserFromSocial from "@/components/layout/UpdatePasswordUserFromSocial";
import UpdateUserPhone from "@/components/layout/UpdateUserPhone";
import ConfirmPhoneUser from "@/components/layout/ConfirmPhoneUser";

const Home: NextPage<ISiteProps & ITranslatesProps> = ({user, texts}) => {
  const [showConfirmUserEmail, setShowConfirmUserEmail] =
    useState<boolean>(false);
  const [showUpdateUserPassword, setShowUpdateUserPassword] =
    useState<boolean>(false);
  const [showUpdateUserPhone, setShowUpdateUserPhone] =
    useState<boolean>(false);
  const [showConfirmUserPhone, setShowConfirmUserPhone] =
    useState<boolean>(false);
  const [showUpdateUserPasswordRedux, setShowUpdateUserPasswordRedux] =
    useState<boolean>(false);
  const [showUpdateUserPhoneRedux, setShowUpdateUserPhoneRedux] =
    useState<boolean>(false);
  const [showConfirmUserEmailRedux, setShowConfirmUserEmailRedux] =
    useState<boolean>(false);
  const [showConfirmUserPhoneRedux, setShowConfirmUserPhoneRedux] =
    useState<boolean>(false);

  useEffect(() => {
    if (!!user) {
      setShowConfirmUserEmailRedux(!!!user.userDetails?.emailIsConfirmed);
      setShowUpdateUserPasswordRedux(!!!user.userDetails?.hasPassword);
      setShowUpdateUserPhoneRedux(!!!user.phoneDetails?.has);
      setShowConfirmUserPhoneRedux(!!!user.phoneDetails?.isConfirmed);
    }
  }, [user]);

  const handleConfirmEmail = () => {
    setShowUpdateUserPassword(false);
    setShowUpdateUserPhone(false);
    setShowConfirmUserPhone(false);
    setShowConfirmUserEmail((prevState) => !prevState);
  };

  const handleCloseUpdatePassword = () => {
    setShowConfirmUserEmail(false);
    setShowUpdateUserPhone(false);
    setShowConfirmUserPhone(false);
    setShowUpdateUserPassword((prevState) => !prevState);
  };

  const handleCloseUpdateUserPhone = () => {
    setShowConfirmUserEmail(false);
    setShowUpdateUserPassword(false);
    setShowConfirmUserPhone(false);
    setShowUpdateUserPhone((prevState) => !prevState);
  };

  const handleCloseConfirmUserPhone = () => {
    setShowConfirmUserEmail(false);
    setShowUpdateUserPhone(false);
    setShowUpdateUserPassword(false);
    setShowConfirmUserPhone((prevState) => !prevState);
  };

  const userUpdatePasswordContent = showUpdateUserPasswordRedux && (
    <>
      <ButtonIcon
        onClick={handleCloseUpdatePassword}
        id="update_user_password_button"
        color="RED"
        iconName="LockClosedIcon"
        widthFull
      >
        {texts!.accountPassword}
      </ButtonIcon>
    </>
  );

  const userToConfirmEmailContent = showConfirmUserEmailRedux &&
    !showUpdateUserPasswordRedux && (
      <>
        <ButtonIcon
          onClick={handleConfirmEmail}
          id="confirm_user_account_email_button"
          color="RED"
          iconName="AtSymbolIcon"
          widthFull
        >
          {texts!.confirmEmailAdress}
        </ButtonIcon>
      </>
    );

  const userUpdatePhone = showUpdateUserPhoneRedux &&
    !showConfirmUserEmailRedux &&
    !showUpdateUserPasswordRedux && (
      <>
        <ButtonIcon
          onClick={handleCloseUpdateUserPhone}
          id="verified_user_account_phone_button"
          color="RED"
          iconName="PhoneIcon"
          widthFull
        >
          {texts!.addPhoneNumber}
        </ButtonIcon>
      </>
    );

  const userToConfirmPhone = showConfirmUserPhoneRedux &&
    !showConfirmUserEmailRedux &&
    !showUpdateUserPasswordRedux &&
    !showUpdateUserPhoneRedux && (
      <>
        <ButtonIcon
          onClick={handleCloseConfirmUserPhone}
          id="confirm_user_account_phone_button"
          color="RED"
          iconName="PhoneIcon"
          widthFull
        >
          {texts!.confirmPhoneNumber}
        </ButtonIcon>
      </>
    );

  return (
    <PageSegment id="account_page" maxWidth={400} paddingTop={2}>
      <Popup
        popupEnable={showUpdateUserPassword && showUpdateUserPasswordRedux}
        closeUpEnable={false}
        title={texts!.accountPassword}
        maxWidth={600}
        handleClose={handleCloseUpdatePassword}
        id="update_user_password_popup"
      >
        <UpdatePasswordUserFromSocial />
      </Popup>
      <Popup
        popupEnable={
          showConfirmUserEmail &&
          showConfirmUserEmailRedux &&
          !showUpdateUserPasswordRedux
        }
        closeUpEnable={false}
        title={texts!.confirmEmailAdress}
        maxWidth={600}
        handleClose={handleConfirmEmail}
        id="confirm_user_account_email_popup"
      >
        <ConfirmEmailAdressUser />
      </Popup>
      <Popup
        popupEnable={
          showUpdateUserPhone &&
          showUpdateUserPhoneRedux &&
          !showConfirmUserEmailRedux &&
          !showUpdateUserPasswordRedux
        }
        closeUpEnable={false}
        title={texts!.addPhoneNumber}
        maxWidth={600}
        handleClose={handleCloseUpdateUserPhone}
        id="verified_user_account_phone_popup"
      >
        <UpdateUserPhone />
      </Popup>
      <Popup
        popupEnable={
          showConfirmUserPhone &&
          showConfirmUserPhoneRedux &&
          !showConfirmUserEmailRedux &&
          !showUpdateUserPasswordRedux &&
          !showUpdateUserPhoneRedux
        }
        closeUpEnable={false}
        title={`${texts!.confirmPhoneNumber}: ${user?.phoneDetails?.number}`}
        maxWidth={800}
        handleClose={handleCloseConfirmUserPhone}
        id="confirm_user_account_phone_popup"
      >
        <ConfirmPhoneUser />
      </Popup>
      {userUpdatePasswordContent}
      {userToConfirmEmailContent}
      {userUpdatePhone}
      {userToConfirmPhone}
    </PageSegment>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession({req: context.req});
  if (!session) {
    return {
      props: {},
      redirect: {
        destination: "/",
        permament: false,
      },
    };
  }
  return {
    props: {},
  };
};

export default withTranslates(withSiteProps(Home), "AccountPage");
