import {NextPage} from "next";
import {withSiteProps, withTranslates, withUserProps} from "@hooks";
import type {ISiteProps, ITranslatesProps, IWithUserProps} from "@hooks";
import {Form, InputIcon, FetchData, ButtonIcon, Popup} from "@ui";
import {addAlertItem} from "@/redux/site/actions";
import type {FormElementsOnSubmit} from "@ui";
import {signIn, signOut} from "next-auth/react";

interface ConfirmRecoverAccountUserProps {
  handleShowConfirmRecoverAccountUser: () => void;
  showConfirmRecoverAccountUser: boolean;
  emailConfirmRecoverAccountSend: string;
  handleEmailConfirmRecoverAccountSend: (value: string) => void;
}

const ConfirmRecoverAccountUser: NextPage<
  ConfirmRecoverAccountUserProps &
    ITranslatesProps &
    ISiteProps &
    IWithUserProps
> = ({
  texts,
  siteProps,
  dispatch,
  handleShowConfirmRecoverAccountUser,
  showConfirmRecoverAccountUser,
  session,
  router,
  emailConfirmRecoverAccountSend,
  user,
  handleEmailConfirmRecoverAccountSend,
}) => {
  const inputCode: string = texts!.inputCodeAccount;
  const inputPassword: string = texts!.inputPassword;
  const inputConfirmPassword: string = texts!.inputRepeatPassword;

  const handleOnNewAccount = (
    values: FormElementsOnSubmit[],
    isValid: boolean
  ) => {
    if (isValid) {
      const findCode = values.find((item) => item.placeholder === inputCode);
      const findPassword = values.find(
        (item) => item.placeholder === inputPassword
      );
      const findConfirmPassword = values.find(
        (item) => item.placeholder === inputConfirmPassword
      );
      if (!!findCode && !!findPassword && !!findConfirmPassword) {
        if (findPassword.value === findConfirmPassword.value) {
          if (typeof findCode.value === "string") {
            FetchData({
              url: "/api/user/account",
              method: "PATCH",
              dispatch: dispatch,
              language: siteProps?.language,
              data: {
                email: emailConfirmRecoverAccountSend,
                codeRecoverAccount: findCode.value.toUpperCase(),
                newPassword: findPassword.value,
              },
              callback: (data) => {
                if (data.success) {
                  handleEmailConfirmRecoverAccountSend("");
                  signIn("credentials", {
                    redirect: false,
                    email: data.data.email,
                    password: findPassword.value,
                    type: "login",
                  }).then((data) => {
                    const dataToValid: any = data;
                    if (!!dataToValid) {
                      if (!!dataToValid.error) {
                        dispatch!(
                          addAlertItem(texts!.somethingWentWrong, "RED")
                        );
                        if (!!session) {
                          signOut();
                        }
                      } else {
                        router?.replace("/");
                      }
                    }
                  });
                  handleShowConfirmRecoverAccountUser();
                }
              },
            });
          }
        } else {
          dispatch!(addAlertItem(texts!.passwordMustBeTheSame, "RED"));
        }
      }
    }
  };

  const handleSendAgainCodeAccount = () => {
    FetchData({
      url: "/api/user/account",
      method: "POST",
      dispatch: dispatch,
      language: siteProps?.language,
      data: {
        email: emailConfirmRecoverAccountSend,
        resendRecoverAccount: true,
      },
      callback: (data) => {
        if (data.success) {
          dispatch!(addAlertItem(texts!.sendedAccount, "GREEN"));
        }
      },
    });
  };

  const handleResetAccount = () => {
    FetchData({
      url: "/api/user/account",
      method: "DELETE",
      dispatch: dispatch,
      language: siteProps?.language,
      data: {
        resetRecoverAccount: true,
        email: emailConfirmRecoverAccountSend,
      },
      callback: (data) => {
        if (data.success) {
          handleEmailConfirmRecoverAccountSend("");
          handleShowConfirmRecoverAccountUser();
        }
      },
    });
  };

  return (
    <Popup
      popupEnable={showConfirmRecoverAccountUser && !!!user}
      closeUpEnable={false}
      title={`${texts!.title}: ${emailConfirmRecoverAccountSend}`}
      maxWidth={800}
      handleClose={handleShowConfirmRecoverAccountUser}
      id="recover_account_user_account_popup"
    >
      <Form
        id="recover_account_user"
        onSubmit={handleOnNewAccount}
        buttonText={texts!.buttonSave}
        buttonColor="GREEN"
        marginBottom={0}
        marginTop={0}
        isFetchToBlock
        iconName="SaveIcon"
        validation={[
          {
            placeholder: inputCode,
            isString: true,
            minLength: 6,
          },
          {
            placeholder: inputPassword,
            isString: true,
            minLength: 6,
          },
          {
            placeholder: inputConfirmPassword,
            isString: true,
            minLength: 6,
          },
        ]}
        extraButtons={
          <>
            <ButtonIcon
              isFetchToBlock
              id="button_reset_code_account"
              onClick={handleResetAccount}
              color="RED"
              iconName="ArrowLeftIcon"
            >
              {texts!.resetAccount}
            </ButtonIcon>
            <ButtonIcon
              isFetchToBlock
              id="button_send_code_account"
              onClick={handleSendAgainCodeAccount}
              iconName="RefreshIcon"
            >
              {texts!.sendCodeAgain}
            </ButtonIcon>
          </>
        }
      >
        <InputIcon
          placeholder={inputCode}
          validText={texts!.minLetter}
          type="text"
          id="code_confirm_recover_account_input"
          iconName="LockClosedIcon"
        />
        <InputIcon
          placeholder={inputPassword}
          validText={texts!.minLetter}
          type="password"
          id="user_passowrd_input"
          iconName="LockClosedIcon"
        />
        <InputIcon
          placeholder={inputConfirmPassword}
          validText={texts!.minLetter}
          type="password"
          id="user_confirm_passowrd_input"
          iconName="LockClosedIcon"
        />
      </Form>
    </Popup>
  );
};

export default withTranslates(
  withSiteProps(withUserProps(ConfirmRecoverAccountUser)),
  "ConfirmRecoverAccountUser"
);
