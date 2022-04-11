import {NextPage} from "next";
import {ButtonIcon, FetchData, Popup, Form, PhoneInput, Paragraph} from "@ui";
import type {FormElementsOnSubmit} from "@ui";
import {withSiteProps, withTranslates, withUserProps} from "@hooks";
import type {ISiteProps, ITranslatesProps, IWithUserProps} from "@hooks";
import {useState, useEffect} from "react";
import {addAlertItem} from "@/redux/site/actions";
import {updateCompanySelectedProps} from "@/redux/companys/actions";

interface ChangePhoneUserProps {
  popupEnable: boolean;
  handleShowResetPhoneNumber: () => void;
  handleShowConfirmNewPhoneCompany: () => void;
  companyPhone: number;
  companyRegionalCode: number;
  companyId: string;
  handleUpdateCompanyDateAgain: (value: boolean) => void;
  isDisabledSendAgainPhone: boolean;
}

const CompanyResetPhoneNumber: NextPage<
  ITranslatesProps & ISiteProps & ChangePhoneUserProps & IWithUserProps
> = ({
  texts,
  dispatch,
  siteProps,
  popupEnable,
  handleShowResetPhoneNumber,
  handleShowConfirmNewPhoneCompany,
  user,
  companyPhone,
  companyRegionalCode,
  companyId,
  handleUpdateCompanyDateAgain,
  isDisabledSendAgainPhone,
}) => {
  const [phoneRegionalCode, setPhoneRegionalCode] = useState<number | null>(
    null
  );

  const inputPhone: string = texts!.inputPhone;

  const handleClosePopup = () => {
    handleShowResetPhoneNumber();
    handleShowConfirmNewPhoneCompany();
  };

  const handleOnChangePassword = (
    values: FormElementsOnSubmit[],
    isValid: boolean
  ) => {
    if (isValid) {
      const findPhone = values.find((item) => item.placeholder === inputPhone);
      if (!!findPhone && !!phoneRegionalCode) {
        if (
          Number(findPhone.value) !== companyPhone ||
          phoneRegionalCode !== companyRegionalCode
        ) {
          FetchData({
            url: "/api/companys/phone",
            method: "PUT",
            dispatch: dispatch,
            language: siteProps?.language,
            companyId: companyId,
            data: {
              newPhone: Number(findPhone.value),
              newRegionalCode: phoneRegionalCode,
            },
            callback: (data) => {
              if (data.success) {
                console.log(data.data);
                if (!!data.data.number && !!data.data.regionalCode) {
                  dispatch!(
                    updateCompanySelectedProps([
                      {
                        folder: "phoneDetails",
                        field: "number",
                        value: data.data.number,
                      },
                      {
                        folder: "phoneDetails",
                        field: "regionalCode",
                        value: data.data.regionalCode,
                      },
                    ])
                  );
                }
                if (!!data.data.dateSendAgainSMS) {
                  dispatch!(
                    updateCompanySelectedProps([
                      {
                        folder: "phoneDetails",
                        field: "dateSendAgainSMS",
                        value: data.data.dateSendAgainSMS,
                      },
                    ])
                  );
                  handleUpdateCompanyDateAgain(true);
                } else {
                  dispatch!(
                    updateCompanySelectedProps([
                      {
                        folder: "phoneDetails",
                        field: "dateSendAgainSMS",
                        value: new Date(
                          new Date()
                            .setHours(new Date().getHours() + 1)
                            .toString()
                        ),
                      },
                    ])
                  );
                  handleUpdateCompanyDateAgain(true);
                }
                handleClosePopup();
              }
            },
          });
        } else {
          dispatch!(addAlertItem(texts!.numbersIsTheSame, "RED"));
        }
      }
    }
  };

  const handleChangeCountry = (value: number) => {
    setPhoneRegionalCode(value);
  };

  return (
    <Popup
      popupEnable={popupEnable}
      closeUpEnable={false}
      title={texts!.title}
      maxWidth={600}
      handleClose={handleClosePopup}
      id="change_phone_user_account_popup"
    >
      <Paragraph bold marginTop={0}>
        {texts!.changePhoneAlert}
      </Paragraph>
      <Form
        id="change_phone_user_account"
        onSubmit={handleOnChangePassword}
        buttonText={texts!.title}
        buttonColor="GREEN"
        marginBottom={0}
        marginTop={0}
        isFetchToBlock
        iconName="SaveIcon"
        disabled={isDisabledSendAgainPhone}
        disabledTooltip={texts!.changePhoneAlert}
        validation={[
          {
            placeholder: inputPhone,
            isNumber: true,
            minLength: 9,
          },
        ]}
        extraButtons={
          <>
            <ButtonIcon
              id="show_change_phone_account_button"
              onClick={handleClosePopup}
              iconName="ArrowLeftIcon"
            >
              {texts!.cancel}
            </ButtonIcon>
          </>
        }
      >
        <PhoneInput
          placeholder={inputPhone}
          handleChangeCountry={handleChangeCountry}
          validText={texts!.min9Letter}
          id="change_phone_account_input"
        />
      </Form>
    </Popup>
  );
};

export default withTranslates(
  withSiteProps(withUserProps(CompanyResetPhoneNumber)),
  "ResetPhoneCompany"
);
