import {NextPage} from "next";
import {withSiteProps, withTranslates} from "@hooks";
import type {ISiteProps, ITranslatesProps} from "@hooks";
import {Form, InputIcon, FetchData, ButtonIcon, Popup} from "@ui";
import {addAlertItem} from "@/redux/site/actions";
import type {FormElementsOnSubmit} from "@ui";
import {updateAllCompanysProps} from "@/redux/companys/actions";

interface ConfirmNewEmailAdressCompanyProps {
  handleShowConfirmNewEmailCompany: () => void;
  popupEnable: boolean;
  companyId: string;
}

const ConfirmNewEmailAdressCompany: NextPage<
  ITranslatesProps & ISiteProps & ConfirmNewEmailAdressCompanyProps
> = ({
  texts,
  siteProps,
  dispatch,
  handleShowConfirmNewEmailCompany,
  popupEnable,
  companyId,
}) => {
  const handleOnChangeEmail = (
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
            url: "/api/companys/edit/email",
            method: "POST",
            dispatch: dispatch,
            language: siteProps?.language,
            companyId: companyId,
            data: {
              codeConfirmEmail: findCode.value.toUpperCase(),
            },
            callback: (data) => {
              if (data.success) {
                if (!!data.data.email) {
                  dispatch!(
                    updateAllCompanysProps([
                      {
                        folder: "companyDetails",
                        field: "toConfirmEmail",
                        value: null,
                        companyId: companyId,
                      },
                      {
                        field: "email",
                        value: data.data.email,
                        companyId: companyId,
                      },
                    ])
                  );
                }
                handleShowConfirmNewEmailCompany();
              }
            },
          });
        }
      }
    }
  };

  const handleSendAgainCodeEmail = () => {
    FetchData({
      url: "/api/companys/edit/email",
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

  const handleCancelChangeEmail = () => {
    FetchData({
      url: "/api/companys/edit/email",
      method: "DELETE",
      dispatch: dispatch,
      language: siteProps?.language,
      companyId: companyId,
      callback: (data) => {
        if (data.success) {
          dispatch!(
            updateAllCompanysProps([
              {
                folder: "companyDetails",
                field: "toConfirmEmail",
                value: null,
                companyId: companyId,
              },
            ])
          );
          handleShowConfirmNewEmailCompany();
        }
      },
    });
  };

  return (
    <Popup
      popupEnable={popupEnable}
      closeUpEnable={false}
      title={texts!.confirmAdress}
      maxWidth={600}
      handleClose={handleShowConfirmNewEmailCompany}
      id="confirm_new_email_company_account_popup"
    >
      <Form
        id="update_email_company"
        onSubmit={handleOnChangeEmail}
        buttonText={texts!.confirmAdress}
        buttonColor="GREEN"
        marginBottom={0}
        marginTop={0}
        isFetchToBlock
        iconName="SaveIcon"
        buttonsInColumn
        buttonsFullWidth
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
              onClick={handleCancelChangeEmail}
              color="RED"
              iconName="TrashIcon"
              fullWidth
            >
              {texts!.cancelChangeEmail}
            </ButtonIcon>
            <ButtonIcon
              isFetchToBlock
              id="button_send_code_phone_again"
              onClick={handleSendAgainCodeEmail}
              color="RED"
              iconName="RefreshIcon"
              fullWidth
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
          id="code_confirm_company_email_input"
          iconName="AtSymbolIcon"
          uppercase
        />
      </Form>
    </Popup>
  );
};

export default withTranslates(
  withSiteProps(ConfirmNewEmailAdressCompany),
  "ConfirmNewEmailAdressCompany"
);
