import {NextPage} from "next";
import {withSiteProps, withTranslates} from "@hooks";
import type {ISiteProps, ITranslatesProps} from "@hooks";
import {Form, InputIcon, FetchData, ButtonIcon, Popup} from "@ui";
import {addAlertItem} from "@/redux/site/actions";
import type {FormElementsOnSubmit} from "@ui";
import {updateCompanySelectedProps} from "@/redux/companys/actions";

interface ConfirmEmailAdressCompanyProps {
  handleShowConfirmNewEmailCompany: () => void;
  popupEnable: boolean;
  companyId: string;
  setActivePhoneNumberCompany: (value: boolean) => void;
  handleUpdateCompanyDateAgain: (value: boolean) => void;
}

const ConfirmEmailAdressCompany: NextPage<
  ITranslatesProps & ISiteProps & ConfirmEmailAdressCompanyProps
> = ({
  texts,
  siteProps,
  dispatch,
  handleShowConfirmNewEmailCompany,
  popupEnable,
  companyId,
  setActivePhoneNumberCompany,
  handleUpdateCompanyDateAgain,
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
            url: "/api/companys/email",
            method: "PATCH",
            dispatch: dispatch,
            language: siteProps?.language,
            companyId: companyId,
            data: {
              codeConfirmEmail: findCode.value.toUpperCase(),
            },
            callback: (data) => {
              if (data.success) {
                if (
                  !!data.data.dateSendAgainSMS &&
                  !!data.data.emailIsConfirmed
                ) {
                  dispatch!(
                    updateCompanySelectedProps([
                      {
                        folder: "companyDetails",
                        field: "emailIsConfirmed",
                        value: data.data.emailIsConfirmed,
                      },
                      {
                        folder: "phoneDetails",
                        field: "dateSendAgainSMS",
                        value: data.data.dateSendAgainSMS,
                      },
                    ])
                  );
                  handleUpdateCompanyDateAgain(true);
                }
                handleShowConfirmNewEmailCompany();
                setActivePhoneNumberCompany(true);
              }
            },
          });
        }
      }
    }
  };

  const handleSendAgainCodeEmail = () => {
    FetchData({
      url: "/api/companys/email",
      method: "GET",
      dispatch: dispatch,
      language: siteProps?.language,
      companyId: companyId,
      callback: (data) => {
        if (data.success) {
          dispatch!(addAlertItem(texts!.sendedEmail, "GREEN"));
        }
      },
    });
  };

  return (
    <Popup
      popupEnable={popupEnable}
      closeUpEnable={false}
      title={"Potwierdz adres e-mail"}
      maxWidth={800}
      handleClose={handleShowConfirmNewEmailCompany}
      id="confirm_new_email_company_account_popup"
    >
      <Form
        id="update_password_company"
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
          type="text"
          id="code_confirm_company_email_input"
          iconName="AtSymbolIcon"
          uppercase
        />
      </Form>
    </Popup>
  );
};

export default withTranslates(
  withSiteProps(ConfirmEmailAdressCompany),
  "ConfirmEmailAdressCompany"
);
