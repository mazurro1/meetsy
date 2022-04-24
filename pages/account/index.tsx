import {NextPage} from "next";
import {withSiteProps, withTranslates, withUserProps} from "@hooks";
import type {ISiteProps, ITranslatesProps, IWithUserProps} from "@hooks";
import {PageSegment, ButtonIcon, Popup, TitlePage} from "@ui";
import {GetServerSideProps} from "next";
import {getSession} from "next-auth/react";
import {useState, useEffect} from "react";
import ConfirmEmailAdressUser from "@/components/PageComponents/AccountPage/ConfirmEmailAdressUser";
import UpdatePasswordUserFromSocial from "@/components/PageComponents/AccountPage/UpdatePasswordUserFromSocial";
import UpdateUserPhone from "@/components/PageComponents/AccountPage/UpdateUserPhone";
import ConfirmPhoneUser from "@/components/PageComponents/AccountPage/ConfirmPhoneUser";
import DeleteAccount from "@/components/PageComponents/AccountPage/DeleteAccount";
import EditPassword from "@/components/PageComponents/AccountPage/EditPassword";
import ChangePhoneUser from "@/components/PageComponents/AccountPage/ChangePhoneUser";
import ConfirmNewPhoneUser from "@/components/PageComponents/AccountPage/ConfirmNewPhoneUser";
import ChangeEmailUser from "@/components/PageComponents/AccountPage/ChangeEmailUser";
import ConfirmNewEmailUser from "@/components/PageComponents/AccountPage/ConfirmNewEmailUser";
import EditAccountUser from "@/components/PageComponents/AccountPage/EditAccountUser";
import ManagaConsentsUser from "@/components/PageComponents/AccountPage/ManagaConsentsUser";
import EditAvatarUser from "@/components/PageComponents/AccountPage/EditAvatarUser";
import InivationsToCompanyUser from "@/components/PageComponents/AccountPage/InivationsToCompanyUser";

const AccountPage: NextPage<ISiteProps & ITranslatesProps & IWithUserProps> = ({
  user,
  texts,
}) => {
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
  const [showDeleteAccount, setShowDeleteAccount] = useState<boolean>(false);
  const [showEditPassword, setShowEditPassword] = useState<boolean>(false);
  const [showChangePhoneUser, setShowChangePhoneUser] =
    useState<boolean>(false);
  const [showConfirmNewPhoneUser, setShowConfirmNewPhoneUser] =
    useState<boolean>(false);
  const [showChangeEmailUser, setShowChangeEmailUser] =
    useState<boolean>(false);
  const [showConfirmNewEmailUser, setShowConfirmNewEmailUser] =
    useState<boolean>(false);
  const [showEditAccountUser, setShowEditAccountUser] =
    useState<boolean>(false);
  const [showManagaConsentsUser, setShowManagaConsentsUser] =
    useState<boolean>(false);
  const [showEditAvatarUser, setShowEditAvatarUser] = useState<boolean>(false);
  const [showInivationsToCompanyUser, setShowInivationsToCompanyUser] =
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

  const handleShowDeleteAccount = () => {
    setShowDeleteAccount((prevState) => !prevState);
  };

  const handleShowEditPassword = () => {
    setShowEditPassword((prevState) => !prevState);
  };

  const handleShowChangePhoneUser = () => {
    setShowChangePhoneUser((prevState) => !prevState);
  };

  const handleShowConfirmNewPhoneUser = () => {
    setShowConfirmNewPhoneUser((prevState) => !prevState);
  };

  const handleShowChangeEmailUser = () => {
    setShowChangeEmailUser((prevState) => !prevState);
  };

  const handleShowConfirmNewEmailUser = () => {
    setShowConfirmNewEmailUser((prevState) => !prevState);
  };

  const handleShowEditAccountUser = () => {
    setShowEditAccountUser((prevState) => !prevState);
  };

  const handleShowEditAvatarUser = () => {
    setShowEditAvatarUser((prevState) => !prevState);
  };

  const handleShowManagaConsentsUser = () => {
    setShowManagaConsentsUser((prevState) => !prevState);
  };

  const handleShowEditInivationsToCompanyUser = () => {
    setShowInivationsToCompanyUser((prevState) => !prevState);
  };

  const userUpdatePasswordContent = showUpdateUserPasswordRedux && (
    <>
      <ButtonIcon
        onClick={handleCloseUpdatePassword}
        id="update_user_password_button"
        color="RED"
        iconName="LockClosedIcon"
        fullWidth
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
          fullWidth
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
          fullWidth
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
          fullWidth
        >
          {texts!.confirmPhoneNumber}
        </ButtonIcon>
      </>
    );

  return (
    <PageSegment id="account_page" maxWidth={450}>
      <TitlePage marginBottom={4}>{texts!.title}</TitlePage>
      {!!user && (
        <>
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
            title={`${texts!.confirmPhoneNumber}: ${
              user?.phoneDetails?.number
            }`}
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
          {!showConfirmUserEmailRedux &&
            !showUpdateUserPasswordRedux &&
            !showUpdateUserPhoneRedux &&
            !showConfirmUserPhoneRedux && (
              <>
                <Popup
                  popupEnable={showInivationsToCompanyUser}
                  closeUpEnable={false}
                  title={"Zaproszenia do firm"}
                  maxWidth={600}
                  handleClose={handleShowEditInivationsToCompanyUser}
                  id="inivations_to_company_popup"
                >
                  <InivationsToCompanyUser />
                </Popup>
                <div className="mt-10">
                  <ButtonIcon
                    onClick={handleShowEditInivationsToCompanyUser}
                    id="inivations_from_company"
                    iconName="MailIcon"
                    fullWidth
                    color="SECOND"
                  >
                    Zaproszenia do firm
                  </ButtonIcon>
                </div>
              </>
            )}
          {!showConfirmUserEmailRedux &&
            !showUpdateUserPasswordRedux &&
            !showUpdateUserPhoneRedux &&
            !showConfirmUserPhoneRedux && (
              <>
                <EditAvatarUser
                  handleShowEditAvatarUser={handleShowEditAvatarUser}
                  showEditAvatarUser={showEditAvatarUser}
                />
                <EditAccountUser
                  handleShowEditAccountUser={handleShowEditAccountUser}
                  showEditAccountUser={showEditAccountUser}
                />
                <ManagaConsentsUser
                  showManagaConsentsUser={showManagaConsentsUser}
                  handleShowManagaConsentsUser={handleShowManagaConsentsUser}
                />
                <div className="mt-10">
                  <ButtonIcon
                    onClick={handleShowEditAvatarUser}
                    id="edit_avatar_button"
                    iconName="PhotographIcon"
                    fullWidth
                  >
                    {texts!.editAvatar}
                  </ButtonIcon>
                </div>
                <div className="mt-10">
                  <ButtonIcon
                    onClick={handleShowEditAccountUser}
                    id="edit_account_button"
                    iconName="IdentificationIcon"
                    fullWidth
                  >
                    {texts!.editAccount}
                  </ButtonIcon>
                </div>
                <div className="mt-10">
                  <ButtonIcon
                    onClick={handleShowManagaConsentsUser}
                    id="manage_consents_button"
                    iconName="ClipboardListIcon"
                    fullWidth
                  >
                    {texts!.manageConsents}
                  </ButtonIcon>
                </div>
              </>
            )}
          {!showConfirmUserEmailRedux && !showUpdateUserPasswordRedux && (
            <>
              <ChangeEmailUser
                handleShowChangeEmailUser={handleShowChangeEmailUser}
                showChangeEmailUser={showChangeEmailUser}
                handleShowConfirmNewEmailUser={handleShowConfirmNewEmailUser}
              />
              <ConfirmNewEmailUser
                showConfirmNewEmailUser={showConfirmNewEmailUser}
                handleShowConfirmNewEmailUser={handleShowConfirmNewEmailUser}
              />
              {!!!user.userDetails.toConfirmEmail ? (
                <div className="mt-10">
                  <ButtonIcon
                    onClick={handleShowChangeEmailUser}
                    id="change_user_email_button"
                    iconName="AtSymbolIcon"
                    fullWidth
                  >
                    {texts!.changeEmail}
                  </ButtonIcon>
                </div>
              ) : (
                <div className="mt-10">
                  <ButtonIcon
                    onClick={handleShowConfirmNewEmailUser}
                    id="confiem_user_new_email_button"
                    iconName="AtSymbolIcon"
                    fullWidth
                    color="SECOND"
                  >
                    {texts!.confirmNewEmail}
                  </ButtonIcon>
                </div>
              )}
            </>
          )}
          {!showConfirmUserEmailRedux &&
            !showUpdateUserPasswordRedux &&
            !showUpdateUserPhoneRedux &&
            !showConfirmUserPhoneRedux && (
              <>
                <ChangePhoneUser
                  handleShowChangePhoneUser={handleShowChangePhoneUser}
                  handleShowConfirmNewPhoneUser={handleShowConfirmNewPhoneUser}
                  showChangePhoneUser={showChangePhoneUser}
                />
                <ConfirmNewPhoneUser
                  handleShowConfirmNewPhoneUser={handleShowConfirmNewPhoneUser}
                  showConfirmNewPhoneUser={showConfirmNewPhoneUser}
                />
                {!!!user?.phoneDetails.toConfirmNumber ? (
                  <div className="mt-10">
                    <ButtonIcon
                      onClick={handleShowChangePhoneUser}
                      id="change_user_phone_button"
                      iconName="PhoneIcon"
                      fullWidth
                    >
                      {texts!.changePhone}
                    </ButtonIcon>
                  </div>
                ) : (
                  <div className="mt-10">
                    <ButtonIcon
                      onClick={handleShowConfirmNewPhoneUser}
                      id="confirm_new_user_phone_button"
                      iconName="PhoneIcon"
                      fullWidth
                      color="SECOND"
                    >
                      {texts!.confirmNewPhone}
                    </ButtonIcon>
                  </div>
                )}
              </>
            )}
          {!showUpdateUserPasswordRedux && (
            <>
              <EditPassword
                handleShowEditPassword={handleShowEditPassword}
                showEditPassword={showEditPassword}
              />
              <div className="mt-10">
                <ButtonIcon
                  onClick={handleShowEditPassword}
                  id="change_account_password_button"
                  iconName="LockClosedIcon"
                  fullWidth
                >
                  {texts!.changePassword}
                </ButtonIcon>
              </div>
            </>
          )}
          <div className="mt-10">
            <ButtonIcon
              onClick={handleShowDeleteAccount}
              id="delete_account_button"
              color="RED"
              iconName="TrashIcon"
              fullWidth
            >
              {texts!.deleteAccount}
            </ButtonIcon>
          </div>
          <DeleteAccount
            showDeleteAccount={showDeleteAccount}
            handleShowDeleteAccount={handleShowDeleteAccount}
          />
        </>
      )}
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

export default withTranslates(
  withSiteProps(withUserProps(AccountPage)),
  "AccountPage"
);
