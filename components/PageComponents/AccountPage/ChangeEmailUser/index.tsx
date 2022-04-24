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
import {updateUserProps} from "@/redux/user/actions";
import {addAlertItem} from "@/redux/site/actions";

interface ChangeEmailUserProps {
  showChangeEmailUser: boolean;
  handleShowChangeEmailUser?: () => void;
  handleShowConfirmNewEmailUser?: () => void;
}

const ChangeEmailUser: NextPage<
  ITranslatesProps & ISiteProps & ChangeEmailUserProps & IWithUserProps
> = ({
  texts,
  dispatch,
  siteProps,
  showChangeEmailUser,
  handleShowChangeEmailUser = () => {},
  handleShowConfirmNewEmailUser = () => {},
  user,
}) => {
  const inputPassword: string = texts!.inputPassword;
  const inputEmail: string = texts!.inputEmail;

  const handleOnChangeEmail = (
    values: FormElementsOnSubmit[],
    isValid: boolean
  ) => {
    if (isValid) {
      const findPassword = values.find(
        (item) => item.placeholder === inputPassword
      );
      const findEmail = values.find((item) => item.placeholder === inputEmail);
      if (!!findPassword && !!findEmail) {
        if (typeof findEmail.value === "string") {
          if (findEmail.value.toLowerCase() !== user?.email.toLowerCase()) {
            FetchData({
              url: "/api/user/account/email",
              method: "PUT",
              dispatch: dispatch,
              language: siteProps?.language,
              data: {
                password: findPassword.value,
                newEmail: findEmail.value,
              },
              callback: (data) => {
                if (data.success) {
                  if (!!data.data.toConfirmEmail) {
                    dispatch!(
                      updateUserProps([
                        {
                          folder: "userDetails",
                          field: "toConfirmEmail",
                          value: data.data.toConfirmEmail,
                        },
                      ])
                    );
                  }
                  handleShowChangeEmailUser();
                  handleShowConfirmNewEmailUser();
                }
              },
            });
          } else {
            dispatch!(addAlertItem(texts!.emailIsTheSame, "RED"));
          }
        }
      }
    }
  };

  return (
    <Popup
      popupEnable={showChangeEmailUser && !!!user?.userDetails.toConfirmEmail}
      closeUpEnable={false}
      title={texts!.title}
      maxWidth={600}
      handleClose={handleShowChangeEmailUser}
      id="change_email_user_account_popup"
    >
      <Form
        id="change_email_user_account"
        onSubmit={handleOnChangeEmail}
        buttonText={texts!.title}
        buttonColor="GREEN"
        marginBottom={0}
        marginTop={0}
        isFetchToBlock
        iconName="SaveIcon"
        validation={[
          {
            placeholder: inputPassword,
            isString: true,
            minLength: 6,
          },
          {
            placeholder: inputEmail,
            isEmail: true,
          },
        ]}
        extraButtons={
          <>
            <ButtonIcon
              id="show_change_email_account_button"
              onClick={handleShowChangeEmailUser}
              iconName="ArrowLeftIcon"
            >
              {texts!.cancel}
            </ButtonIcon>
          </>
        }
      >
        <InputIcon
          placeholder={inputEmail}
          type="email"
          id="user_new_email_input"
          iconName="AtSymbolIcon"
        />
        <InputIcon
          placeholder={inputPassword}
          validText={texts!.minLetter}
          type="password"
          id="user_passowrd_input"
          iconName="LockClosedIcon"
        />
      </Form>
    </Popup>
  );
};

export default withUserProps(
  withTranslates(
    withSiteProps(withCompanysProps(ChangeEmailUser)),
    "ChangeEmailUser"
  )
);
