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
import {useEffect, useState} from "react";
import {updateCompanySelectedProps} from "@/redux/companys/actions";

interface ConfirmPhoneCompanyProps {
  popupEnable: boolean;
  handleShowConfirmNewPhoneCompany: () => void;
  companyId: string;
}

const ConfirmPhoneCompany: NextPage<
  ITranslatesProps & ISiteProps & ICompanysProps & ConfirmPhoneCompanyProps
> = ({
  texts,
  siteProps,
  dispatch,
  popupEnable,
  handleShowConfirmNewPhoneCompany,
  selectedUserCompany,
  companyId,
}) => {
  const [isDisabledSendAgainPhone, setIsDisabledSendAgainPhone] =
    useState<boolean>(true);
  const [updateCompanyDateAgainSMS, setUpdateCompanyDateAgainSMS] =
    useState<boolean>(true);

  useEffect(() => {
    if (!!selectedUserCompany && !!updateCompanyDateAgainSMS) {
      if (typeof selectedUserCompany.companyId !== "string") {
        if (!!selectedUserCompany.companyId?.phoneDetails.dateSendAgainSMS) {
          const dateCompanySentAgainSMS = new Date(
            selectedUserCompany.companyId?.phoneDetails.dateSendAgainSMS
          );
          setIsDisabledSendAgainPhone(dateCompanySentAgainSMS > new Date());
        }
      }
    }
    setUpdateCompanyDateAgainSMS(false);
  }, [selectedUserCompany, updateCompanyDateAgainSMS]);

  const handleOnChangePassword = (
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
            url: "/api/companys/phone",
            method: "POST",
            dispatch: dispatch,
            language: siteProps?.language,
            companyId: companyId,
            data: {
              codeConfirmPhone: findCode.value.toUpperCase(),
            },
            callback: (data) => {
              if (data.success) {
                dispatch!(
                  updateCompanySelectedProps([
                    {
                      folder: "phoneDetails",
                      field: "isConfirmed",
                      value: data.data.phoneConfirmed,
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

  const handleSendAgainCodePhone = () => {
    FetchData({
      url: "/api/companys/phone",
      method: "GET",
      dispatch: dispatch,
      language: siteProps?.language,
      companyId: companyId,
      callback: (data) => {
        if (data.success) {
          if (!!data.data.dateSendAgainSMS) {
            setUpdateCompanyDateAgainSMS(true);
            dispatch!(
              updateCompanySelectedProps([
                {
                  folder: "phoneDetails",
                  field: "dateSendAgainSMS",
                  value: data.data.dateSendAgainSMS,
                },
              ])
            );
          }
          dispatch!(addAlertItem(texts!.sendedPhone, "GREEN"));
        } else {
          setUpdateCompanyDateAgainSMS(true);
          dispatch!(
            updateCompanySelectedProps([
              {
                folder: "phoneDetails",
                field: "dateSendAgainSMS",
                value: new Date(
                  new Date().setHours(new Date().getHours() + 1)
                ).toString(),
              },
            ])
          );
        }
      },
    });
  };

  // const handleResetPhoneNumber = () => {
  //   FetchData({
  //     url: "/api/companys/phone",
  //     method: "DELETE",
  //     dispatch: dispatch,
  //     language: siteProps?.language,
  //     companyId: companyId,
  //     callback: (data) => {
  //       if (data.success) {
  //         if (!!data.data.dateSendAgainSMS) {
  //           dispatch!(
  //             updateCompanySelectedProps([
  //               {
  //                 folder: "phoneDetails",
  //                 field: "dateSendAgainSMS",
  //                 value: data.data.dateSendAgainSMS,
  //               },
  //             ])
  //           );
  //         }
  //         dispatch!(
  //           updateCompanySelectedProps([
  //             {
  //               folder: "phoneDetails",
  //               field: "has",
  //               value: false,
  //             },
  //             {
  //               folder: "phoneDetails",
  //               field: "number",
  //               value: null,
  //             },
  //           ])
  //         );
  //       } else {
  //         dispatch!(
  //           updateCompanySelectedProps([
  //             {
  //               folder: "phoneDetails",
  //               field: "dateSendAgainSMS",
  //               value: new Date(
  //                 new Date().setHours(new Date().getHours() + 1)
  //               ).toString(),
  //             },
  //           ])
  //         );
  //       }
  //     },
  //   });
  // };

  return (
    <Popup
      popupEnable={popupEnable}
      closeUpEnable={false}
      title={"Potwierdz numer telefonu"}
      maxWidth={800}
      handleClose={handleShowConfirmNewPhoneCompany}
      id="confirm_new_phone_company_account_popup"
    >
      <div>
        <Paragraph marginTop={0} bold>
          {texts!.codeOneInHour}
        </Paragraph>
        <Form
          id="confirm-phone-user"
          onSubmit={handleOnChangePassword}
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
              <Tooltip
                text={texts!.codeResetOneInHour}
                enable={isDisabledSendAgainPhone}
              >
                <ButtonIcon
                  isFetchToBlock
                  id="button_reset_code_phone"
                  // onClick={handleResetPhoneNumber}
                  onClick={() => {}} // zrób resetowanie na zasadzie zastąpienia dotychczasowego numeru telefonu na inny
                  color="RED"
                  iconName="TrashIcon"
                  disabled={isDisabledSendAgainPhone}
                >
                  {texts!.resetPhoneNumber}
                </ButtonIcon>
              </Tooltip>
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
          />
        </Form>
      </div>
    </Popup>
  );
};

export default withTranslates(
  withSiteProps(withCompanysProps(ConfirmPhoneCompany)),
  "ConfirmPhoneUser"
);
