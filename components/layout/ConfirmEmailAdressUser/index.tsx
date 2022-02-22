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
                dispatch!(
                  updateUserProps([
                    {
                      folder: "userDetails",
                      field: "emailIsConfirmed",
                      value: data.data.emailConfirmed,
                    },
                  ])
                );
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
      iconName="LoginIcon"
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
            id="button_reset_input"
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
        type="text"
        id="code_confirm_email_input"
      />
    </Form>
  );
};

export default withTranslates(
  withSiteProps(ConfirmEmailAdressUser),
  "ConfirmEmailAdressUser"
);
