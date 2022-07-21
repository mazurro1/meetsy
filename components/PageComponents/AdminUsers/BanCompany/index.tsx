import {NextPage} from "next";
import {ButtonIcon, FetchData, Popup, Form, InputIcon} from "@ui";
import type {FormElementsOnSubmit} from "@ui";
import {
  withSiteProps,
  withTranslates,
  withCompanysProps,
  withUserProps,
} from "@hooks";
import type {ISiteProps, ITranslatesProps, IWithUserProps} from "@hooks";
import type {UpdateUserProps} from "@/pages/admin/users/index";
import {useState} from "react";
import type {UserProps} from "@/models/User/user.model";

interface BanUserProps {
  userData: UserProps;
  handleUpdateUser: (values: UpdateUserProps[]) => void;
}

const BanUser: NextPage<
  ITranslatesProps & ISiteProps & BanUserProps & IWithUserProps
> = ({
  texts,
  dispatch,
  siteProps,
  user,
  userData,
  handleUpdateUser,
  isMobile,
}) => {
  const [showBanUser, setShowBanUser] = useState<boolean>(false);
  const inputPassword: string = texts!.inputPassword;

  const handleShowBanUser = () => {
    setShowBanUser((prevState) => !prevState);
  };

  const handleBanAccount = (
    values: FormElementsOnSubmit[],
    isValid: boolean
  ) => {
    if (isValid && typeof userData?.banned === "boolean") {
      const findPassword = values.find(
        (item) => item.placeholder === inputPassword
      );
      if (!!findPassword) {
        FetchData({
          url: "/api/admin/users",
          method: "DELETE",
          dispatch: dispatch,
          language: siteProps?.language,
          data: {
            adminPassword: findPassword.value,
            bannedUserEmail: userData?.email,
          },
          callback: (data) => {
            if (data.success) {
              if (data.data.banned !== "undefined") {
                handleUpdateUser([
                  {
                    field: "banned",
                    value: data.data.banned,
                  },
                ]);
              }
              handleShowBanUser();
            }
          },
        });
      }
    }
  };

  return (
    <>
      <div className="mt-5">
        <ButtonIcon
          id="button_ban_user"
          iconName="BanIcon"
          onClick={handleShowBanUser}
          fullWidth
          color="RED"
        >
          {userData?.banned ? texts?.unbanTitle : texts?.title}
        </ButtonIcon>
      </div>
      <Popup
        popupEnable={showBanUser && !!!user?.userDetails.toConfirmEmail}
        closeUpEnable={false}
        title={userData?.banned ? texts!.unbanTitle : texts!.title}
        maxWidth={600}
        handleClose={handleShowBanUser}
        id="ban_user_admin_popup"
        color="RED"
      >
        <Form
          id="ban_user_admin"
          onSubmit={handleBanAccount}
          buttonText={userData?.banned ? texts!.unbanTitle : texts!.title}
          buttonColor="RED"
          marginBottom={0}
          marginTop={0}
          isFetchToBlock
          iconName="BanIcon"
          buttonsFullWidth={isMobile}
          validation={[
            {
              placeholder: inputPassword,
              isString: true,
              minLength: 6,
            },
          ]}
          extraButtons={
            <>
              <ButtonIcon
                id="show_ban_user_admin_button"
                onClick={handleShowBanUser}
                iconName="ArrowLeftIcon"
                fullWidth={isMobile}
              >
                {texts!.cancel}
              </ButtonIcon>
            </>
          }
        >
          <InputIcon
            placeholder={inputPassword}
            validTextGenerate="MIN_6"
            validText={texts!.minLetter}
            type="password"
            id="admin_passowrd_input"
            iconName="LockClosedIcon"
          />
        </Form>
      </Popup>
    </>
  );
};

export default withUserProps(
  withTranslates(withSiteProps(withCompanysProps(BanUser)), "BanUsers")
);
