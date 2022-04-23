import {NextPage} from "next";
import {ButtonIcon, FetchData, Popup, Form, Tooltip, PhoneInput} from "@ui";
import type {FormElementsOnSubmit} from "@ui";
import {withSiteProps, withTranslates, withCompanysProps} from "@hooks";
import type {ISiteProps, ITranslatesProps} from "@hooks";
import {addAlertItem} from "@/redux/site/actions";
import {useState} from "react";
import {updateAllCompanysProps} from "@/redux/companys/actions";

interface ChangeCompanyPhoneProps {
  companyPhone: number;
  companyRegionalCode: number;
  companyRegionalCodeToConfirm: number;
  companyPhoneToConfirm: number;
  companyId: string;
  dateSendAgainCompanySMS: Date | null;
}

const ChangeCompanyPhone: NextPage<
  ITranslatesProps & ISiteProps & ChangeCompanyPhoneProps
> = ({
  texts,
  dispatch,
  siteProps,
  companyPhone,
  companyPhoneToConfirm,
  companyId,
  router,
  companyRegionalCode,
  companyRegionalCodeToConfirm,
  dateSendAgainCompanySMS,
}) => {
  const [showChangeCompanyPhone, setshowChangeCompanyPhone] =
    useState<boolean>(false);
  const [phoneRegionalCode, setPhoneRegionalCode] = useState<number | null>(
    null
  );

  const inputPhone: string = texts!.inputPhone;

  let isDisabledDateSendAgainCompanySMS = false;
  if (!!dateSendAgainCompanySMS) {
    isDisabledDateSendAgainCompanySMS = dateSendAgainCompanySMS > new Date();
  }

  const handleShowChangeCompanyPhone = () => {
    setshowChangeCompanyPhone((prevState) => !prevState);
  };

  const handleOnChangePhone = (
    values: FormElementsOnSubmit[],
    isValid: boolean
  ) => {
    if (isValid) {
      const findPhone = values.find((item) => item.placeholder === inputPhone);
      if (!!findPhone && !!phoneRegionalCode) {
        if (
          findPhone.value !== companyPhone ||
          phoneRegionalCode !== companyRegionalCode
        ) {
          FetchData({
            url: "/api/companys/edit/phone",
            method: "PATCH",
            dispatch: dispatch,
            language: siteProps?.language,
            companyId: companyId,
            data: {
              newPhone: findPhone.value,
              newRegionalCode: phoneRegionalCode,
            },
            callback: (data) => {
              if (data.success) {
                if (
                  !!data.data.toConfirmNumber &&
                  !!data.data.toConfirmRegionalCode
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
                if (!!data.data.dateSendAgainSMS) {
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
                }

                handleShowChangeCompanyPhone();
                router?.push(`/account/companys?company=${companyId}`);
              }
            },
          });
        } else {
          dispatch!(addAlertItem(texts!.phoneIsTheSame, "RED"));
        }
      }
    }
  };

  const handleChangeCountry = (value: number) => {
    setPhoneRegionalCode(value);
  };

  return (
    <>
      <div className="mt-10">
        {!!companyPhoneToConfirm || !!companyRegionalCodeToConfirm ? (
          <Tooltip
            text={texts!.confirmOrCancelPhone}
            enable={!!companyPhoneToConfirm || !!companyRegionalCodeToConfirm}
            display="inline"
          >
            <ButtonIcon
              id="company_edit_informations"
              onClick={handleShowChangeCompanyPhone}
              iconName="PhoneIcon"
              fullWidth
              disabled={
                !!companyPhoneToConfirm || !!companyRegionalCodeToConfirm
              }
            >
              {texts!.phoneNumber}
            </ButtonIcon>
          </Tooltip>
        ) : (
          <Tooltip
            text={texts!.codeOneInHour}
            enable={isDisabledDateSendAgainCompanySMS}
            display="inline"
          >
            <ButtonIcon
              id="company_edit_informations"
              onClick={handleShowChangeCompanyPhone}
              iconName="PhoneIcon"
              fullWidth
              disabled={isDisabledDateSendAgainCompanySMS}
            >
              {texts!.phoneNumber}
            </ButtonIcon>
          </Tooltip>
        )}
      </div>
      <Popup
        popupEnable={
          showChangeCompanyPhone &&
          (!!!companyPhoneToConfirm || !!!companyRegionalCodeToConfirm)
        }
        closeUpEnable={false}
        title={texts!.phoneNumber}
        maxWidth={600}
        handleClose={handleShowChangeCompanyPhone}
        id="change_phone_company_popup"
      >
        <Form
          id="change_company_user_account"
          onSubmit={handleOnChangePhone}
          buttonText={texts!.title}
          buttonColor="GREEN"
          marginBottom={0}
          marginTop={0}
          isFetchToBlock
          iconName="SaveIcon"
          validation={[
            {
              placeholder: inputPhone,
              isNumber: true,
            },
          ]}
          extraButtons={
            <>
              <ButtonIcon
                id="show_change_phone_account_button"
                onClick={handleShowChangeCompanyPhone}
                iconName="ArrowLeftIcon"
              >
                {texts!.cancel}
              </ButtonIcon>
            </>
          }
        >
          <div className="mb-40">
            <PhoneInput
              placeholder={inputPhone}
              handleChangeCountry={handleChangeCountry}
              validTextGenerate="MIN_9"
              defaultValue={companyPhone}
              defaultValueRegional={companyRegionalCode}
              id="change_phone_company_input"
            />
          </div>
        </Form>
      </Popup>
    </>
  );
};

export default withTranslates(
  withSiteProps(withCompanysProps(ChangeCompanyPhone)),
  "ChangeCompanyPhone"
);
