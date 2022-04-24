import {NextPage} from "next";
import {withSiteProps, withTranslates, withUserProps} from "@hooks";
import type {ISiteProps, ITranslatesProps, IWithUserProps} from "@hooks";
import {Form, InputIcon, FetchData, ButtonIcon, Popup} from "@ui";
import {addAlertItem} from "@/redux/site/actions";
import type {FormElementsOnSubmit} from "@ui";
import {updateUserProps} from "@/redux/user/actions";
import {signIn, signOut} from "next-auth/react";

interface ConfirmNewEmailUserProps {
  handleShowConfirmNewEmailUser: () => void;
  showConfirmNewEmailUser: boolean;
}

const ConfirmNewEmailUser: NextPage<
  ConfirmNewEmailUserProps & ITranslatesProps & ISiteProps & IWithUserProps
> = ({
  texts,
  siteProps,
  dispatch,
  user,
  handleShowConfirmNewEmailUser,
  showConfirmNewEmailUser,
  session,
  router,
}) => {
  const inputPassword: string = texts!.inputPassword;

  const handleOnNewEmail = (
    values: FormElementsOnSubmit[],
    isValid: boolean
  ) => {
    if (isValid) {
      const findCode = values.find(
        (item) => item.placeholder === texts!.inputCodeEmail
      );
      const findPassword = values.find(
        (item) => item.placeholder === inputPassword
      );
      if (!!findCode && !!findPassword) {
        if (typeof findCode.value === "string") {
          FetchData({
            url: "/api/user/account/email",
            method: "PATCH",
            dispatch: dispatch,
            language: siteProps?.language,
            data: {
              codeConfirmEmail: findCode.value.toUpperCase(),
              password: findPassword.value,
            },
            callback: (data) => {
              if (data.success) {
                dispatch!(
                  updateUserProps([
                    {
                      field: "email",
                      value: data.data.email,
                    },
                    {
                      folder: "userDetails",
                      field: "emailIsConfirmed",
                      value: data.data.emailConfirmed,
                    },
                    {
                      folder: "userDetails",
                      field: "toConfirmEmail",
                      value: null,
                    },
                  ])
                );
                signIn("credentials", {
                  redirect: false,
                  email: data.data.email,
                  password: findPassword.value,
                  type: "login",
                }).then((data) => {
                  const dataToValid: any = data;
                  if (!!dataToValid) {
                    if (!!dataToValid.error) {
                      dispatch!(addAlertItem(texts!.somethingWentWrong, "RED"));
                      if (!!session) {
                        signOut();
                      }
                    } else {
                      router?.replace("/");
                    }
                  }
                });
              }
            },
          });
        }
      }
    }
  };

  const handleSendAgainCodeEmail = () => {
    FetchData({
      url: "/api/user/account/email",
      method: "GET",
      dispatch: dispatch,
      language: siteProps?.language,
      callback: (data) => {
        if (data.success) {
          dispatch!(addAlertItem(texts!.sendedEmail, "GREEN"));
        }
      },
    });
  };

  const handleResetEmail = () => {
    FetchData({
      url: "/api/user/account/email",
      method: "DELETE",
      dispatch: dispatch,
      language: siteProps?.language,
      callback: (data) => {
        if (data.success) {
          dispatch!(
            updateUserProps([
              {
                folder: "userDetails",
                field: "toConfirmEmail",
                value: null,
              },
            ])
          );
        }
      },
    });
  };

  return (
    <Popup
      popupEnable={
        showConfirmNewEmailUser && !!user?.userDetails.toConfirmEmail
      }
      closeUpEnable={false}
      title={`${texts!.title}: ${user?.userDetails.toConfirmEmail}`}
      maxWidth={800}
      handleClose={handleShowConfirmNewEmailUser}
      id="confirm_new_email_user_account_popup"
    >
      <Form
        id="confirm-new-email-user"
        onSubmit={handleOnNewEmail}
        buttonText={texts!.buttonSave}
        buttonColor="GREEN"
        marginBottom={0}
        marginTop={0}
        isFetchToBlock
        iconName="SaveIcon"
        validation={[
          {
            placeholder: texts!.inputCodeEmail,
            isString: true,
            minLength: 6,
          },
          {
            placeholder: inputPassword,
            isString: true,
            minLength: 6,
          },
        ]}
        extraButtons={
          <>
            <ButtonIcon
              isFetchToBlock
              id="button_reset_code_email"
              onClick={handleResetEmail}
              color="RED"
              iconName="TrashIcon"
            >
              {texts!.resetEmail}
            </ButtonIcon>
            <ButtonIcon
              isFetchToBlock
              id="button_send_code_email"
              onClick={handleSendAgainCodeEmail}
              iconName="RefreshIcon"
            >
              {texts!.sendCodeAgain}
            </ButtonIcon>
          </>
        }
      >
        <InputIcon
          placeholder={texts!.inputCodeEmail}
          validText={texts!.minLetter}
          type="email"
          id="code_confirm_new_email_input"
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

export default withTranslates(
  withSiteProps(withUserProps(ConfirmNewEmailUser)),
  "ConfirmNewEmailUser"
);
