import {NextPage} from "next";
import {withSiteProps, withTranslates, withCompanysProps} from "@hooks";
import type {ISiteProps, ITranslatesProps, ICompanysProps} from "@hooks";
import {
  Form,
  InputIcon,
  FetchData,
  ButtonIcon,
  Paragraph,
  Tooltip,
  Popup,
} from "@ui";
import {addAlertItem} from "@/redux/site/actions";
import type {FormElementsOnSubmit} from "@ui";
import {updateAllCompanysProps} from "@/redux/companys/actions";

interface ConfirmNewPhoneCompanyProps {
  popupEnable: boolean;
  setActiveNewPhoneNumberCompany: (value: boolean) => void;
  companyId: string;
  handleUpdateCompanyDateAgain: (value: boolean) => void;
  isDisabledSendAgainPhone: boolean;
}

const ConfirmNewPhoneCompany: NextPage<
  ITranslatesProps & ISiteProps & ICompanysProps & ConfirmNewPhoneCompanyProps
> = ({
  texts,
  siteProps,
  dispatch,
  popupEnable,
  setActiveNewPhoneNumberCompany,
  companyId,
  handleUpdateCompanyDateAgain,
  isDisabledSendAgainPhone,
}) => {
  const handleOnChangePhone = (
    values: FormElementsOnSubmit[],
    isValid: boolean
  ) => {
    if (isValid) {
      const findCode = values.find(
        (item) => item.placeholder === texts!.inputCodePhone
      );
      if (!!findCode) {
        if (typeof findCode.value === "string") {
          FetchData({
            url: "/api/companys/edit/phone",
            method: "POST",
            dispatch: dispatch,
            language: siteProps?.language,
            companyId: companyId,
            data: {
              codeConfirmPhone: findCode.value.toUpperCase(),
            },
            callback: (data) => {
              if (data.success) {
                if (
                  !!data?.data?.number &&
                  !!data?.data?.regionalCode &&
                  typeof data?.data?.toConfirmNumber !== "undefined" &&
                  typeof data?.data?.toConfirmRegionalCode !== "undefined"
                )
                  dispatch!(
                    updateAllCompanysProps([
                      {
                        folder: "phoneDetails",
                        field: "number",
                        value: data.data.number,
                        companyId: companyId,
                      },
                      {
                        folder: "phoneDetails",
                        field: "regionalCode",
                        value: data.data.regionalCode,
                        companyId: companyId,
                      },
                      {
                        folder: "phoneDetails",
                        field: "toConfirmNumber",
                        value: data.data.toConfirmNumber,
                        companyId: companyId,
                      },
                      {
                        folder: "phoneDetails",
                        field: "toConfirmRegionalCode",
                        value: data.data.toConfirmRegionalCode,
                        companyId: companyId,
                      },
                    ])
                  );
                handleUpdateCompanyDateAgain(true);
                setActiveNewPhoneNumberCompany(false);
              }
            },
          });
        }
      }
    }
  };

  const handleSendAgainCodePhone = () => {
    FetchData({
      url: "/api/companys/edit/phone",
      method: "GET",
      dispatch: dispatch,
      language: siteProps?.language,
      companyId: companyId,
      callback: (data) => {
        if (data.success) {
          console.log(data);
          if (!!data?.data?.dateSendAgainSMS) {
            dispatch!(
              updateAllCompanysProps([
                {
                  folder: "phoneDetails",
                  field: "dateSendAgainSMS",
                  value: data.data.dateSendAgainSMS,
                  companyId: companyId,
                },
              ])
            );
            handleUpdateCompanyDateAgain(true);
          }
          dispatch!(addAlertItem(texts!.sendedPhone, "GREEN"));
        }
      },
    });
  };

  const handleResetPhoneNumber = () => {
    FetchData({
      url: "/api/companys/edit/phone",
      method: "DELETE",
      dispatch: dispatch,
      language: siteProps?.language,
      companyId: companyId,
      callback: (data) => {
        if (data.success) {
          if (
            typeof data?.data?.toConfirmNumber !== "undefined" &&
            typeof data?.data?.toConfirmRegionalCode !== "undefined"
          ) {
            dispatch!(
              updateAllCompanysProps([
                {
                  folder: "phoneDetails",
                  field: "toConfirmNumber",
                  value: data.data.toConfirmNumber,
                  companyId: companyId,
                },
                {
                  folder: "phoneDetails",
                  field: "toConfirmRegionalCode",
                  value: data.data.toConfirmRegionalCode,
                  companyId: companyId,
                },
              ])
            );
          }
          setActiveNewPhoneNumberCompany(false);
        }
      },
    });
  };

  const handleClose = () => {
    setActiveNewPhoneNumberCompany(false);
  };

  return (
    <Popup
      popupEnable={popupEnable}
      closeUpEnable={false}
      title={texts!.confirmNewPhone}
      maxWidth={800}
      handleClose={handleClose}
      id="confirm_new_phone_company_account_popup"
    >
      <div>
        <Paragraph marginTop={0} bold>
          {texts!.codeOneInHour}
        </Paragraph>
        <Form
          id="confirm-phone-user"
          onSubmit={handleOnChangePhone}
          buttonText={texts!.buttonSave}
          buttonColor="GREEN"
          marginBottom={0}
          marginTop={0}
          isFetchToBlock
          iconName="SaveIcon"
          validation={[
            {
              placeholder: texts!.inputCodePhone,
              isString: true,
              minLength: 6,
            },
          ]}
          extraButtons={
            <>
              <ButtonIcon
                id="button_reset_code_phone"
                onClick={handleResetPhoneNumber}
                color="RED"
                iconName="TrashIcon"
              >
                {texts!.resetPhoneNumber}
              </ButtonIcon>
              <Tooltip
                text={texts!.codeOneInHour}
                enable={isDisabledSendAgainPhone}
              >
                <ButtonIcon
                  isFetchToBlock
                  id="button_send_code_phone"
                  onClick={handleSendAgainCodePhone}
                  color="RED"
                  iconName="RefreshIcon"
                  disabled={isDisabledSendAgainPhone}
                >
                  {texts!.sendCodeAgain}
                </ButtonIcon>
              </Tooltip>
            </>
          }
        >
          <InputIcon
            placeholder={texts!.inputCodePhone}
            validText={texts!.minLetter}
            type="text"
            id="code_confirm_phone_input"
            iconName="PhoneIcon"
            uppercase
          />
        </Form>
      </div>
    </Popup>
  );
};

export default withTranslates(
  withSiteProps(withCompanysProps(ConfirmNewPhoneCompany)),
  "ConfirmNewPhoneCompany"
);
