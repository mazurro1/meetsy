import {NextPage} from "next";
import {withSiteProps, withTranslates} from "@hooks";
import type {ISiteProps, ITranslatesProps} from "@hooks";
import {Form, InputIcon, FetchData, ButtonIcon} from "@ui";
import {addAlertItem} from "@/redux/site/actions";
import type {FormElementsOnSubmit} from "@ui";
import {updateUserProps} from "@/redux/user/actions";

const ConfirmEmailAdressUser: NextPage<ITranslatesProps & ISiteProps> = ({
  texts,
  siteProps,
  dispatch,
}) => {
  const handleOnChangePassword = (
    values: FormElementsOnSubmit[],
    isValid: boolean
  ) => {
    if (isValid) {
      const findCode = values.find(
        (item) => item.placeholder === texts!.inputCodeEmail
      );
      if (!!findCode) {
        if (typeof findCode.value === "string") {
          FetchData({
            url: "/api/user/account/email",
            method: "PATCH",
            dispatch: dispatch,
            language: siteProps?.language,
            data: {
              codeConfirmEmail: findCode.value.toUpperCase(),
            },
            callback: (data) => {
              if (data.success) {
                if (
                  !!data.data.dateSendAgainSMS &&
                  !!data.data.emailConfirmed
                ) {
                  dispatch!(
                    updateUserProps([
                      {
                        folder: "phoneDetails",
                        field: "dateSendAgainSMS",
                        value: new Date(data.data.dateSendAgainSMS),
                      },
                      {
                        folder: "userDetails",
                        field: "emailIsConfirmed",
                        value: data.data.emailConfirmed,
                      },
                    ])
                  );
                }
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

  return (
    <Form
      id="update-password-user-social"
      onSubmit={handleOnChangePassword}
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
      ]}
      extraButtons={
        <>
          <ButtonIcon
            isFetchToBlock
            id="button_send_code_phone_again"
            onClick={handleSendAgainCodeEmail}
            color="RED"
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
        id="code_confirm_email_input"
        iconName="AtSymbolIcon"
      />
    </Form>
  );
};

export default withTranslates(
  withSiteProps(ConfirmEmailAdressUser),
  "ConfirmEmailAdressUser"
);
