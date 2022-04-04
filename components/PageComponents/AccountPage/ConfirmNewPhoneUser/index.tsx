import {NextPage} from "next";
import {withSiteProps, withTranslates, withUserProps} from "@hooks";
import type {ISiteProps, ITranslatesProps, IWithUserProps} from "@hooks";
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
import {updateUserProps} from "@/redux/user/actions";
import {useEffect, useState} from "react";

interface ConfirmNewPhoneUserProps {
  handleShowConfirmNewPhoneUser: () => void;
  showConfirmNewPhoneUser: boolean;
}

const ConfirmNewPhoneUser: NextPage<
  ConfirmNewPhoneUserProps & ITranslatesProps & ISiteProps & IWithUserProps
> = ({
  texts,
  siteProps,
  dispatch,
  user,
  handleShowConfirmNewPhoneUser,
  showConfirmNewPhoneUser,
}) => {
  const [isDisabledSendAgainPhone, setIsDisabledSendAgainPhone] =
    useState<boolean>(true);

  useEffect(() => {
    if (!!user) {
      if (!!user?.phoneDetails) {
        if (!!user?.phoneDetails.dateSendAgainSMS) {
          setIsDisabledSendAgainPhone(
            user?.phoneDetails?.dateSendAgainSMS > new Date()
          );
        }
      }
    }
  }, [user]);

  const handleOnNewPhone = (
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
            url: "/api/user/account/phone",
            method: "POST",
            dispatch: dispatch,
            language: siteProps?.language,
            data: {
              codeConfirmPhone: findCode.value.toUpperCase(),
            },
            callback: (data) => {
              if (data.success) {
                dispatch!(
                  updateUserProps([
                    {
                      folder: "phoneDetails",
                      field: "isConfirmed",
                      value: data.data.phoneConfirmed,
                    },
                    {
                      folder: "phoneDetails",
                      field: "regionalCode",
                      value: data.data.regionalCode,
                    },
                    {
                      folder: "phoneDetails",
                      field: "number",
                      value: data.data.number,
                    },
                    {
                      folder: "phoneDetails",
                      field: "toConfirmNumber",
                      value: null,
                    },
                    {
                      folder: "phoneDetails",
                      field: "toConfirmRegionalCode",
                      value: null,
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
      url: "/api/user/account/phone",
      method: "GET",
      dispatch: dispatch,
      language: siteProps?.language,
      callback: (data) => {
        if (data.success) {
          if (!!data.data.dateSendAgainSMS) {
            dispatch!(
              updateUserProps([
                {
                  folder: "phoneDetails",
                  field: "dateSendAgainSMS",
                  value: new Date(data.data.dateSendAgainSMS),
                },
              ])
            );
          }
          dispatch!(addAlertItem(texts!.sendedPhone, "GREEN"));
        } else {
          dispatch!(
            updateUserProps([
              {
                folder: "phoneDetails",
                field: "dateSendAgainSMS",
                value: new Date(new Date().setHours(new Date().getHours() + 1)),
              },
            ])
          );
        }
      },
    });
  };

  const handleResetPhoneNumber = () => {
    FetchData({
      url: "/api/user/account/phone",
      method: "DELETE",
      dispatch: dispatch,
      language: siteProps?.language,
      callback: (data) => {
        if (data.success) {
          if (!!data.data.dateSendAgainSMS) {
            dispatch!(
              updateUserProps([
                {
                  folder: "phoneDetails",
                  field: "dateSendAgainSMS",
                  value: new Date(data.data.dateSendAgainSMS),
                },
              ])
            );
          }
          dispatch!(
            updateUserProps([
              {
                folder: "phoneDetails",
                field: "toConfirmNumber",
                value: null,
              },
            ])
          );
        } else {
          dispatch!(
            updateUserProps([
              {
                folder: "phoneDetails",
                field: "dateSendAgainSMS",
                value: new Date(new Date().setHours(new Date().getHours() + 1)),
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
        showConfirmNewPhoneUser && !!user?.phoneDetails.toConfirmNumber
      }
      closeUpEnable={false}
      title={`${texts!.title}: ${user?.phoneDetails.toConfirmNumber}`}
      maxWidth={800}
      handleClose={handleShowConfirmNewPhoneUser}
      id="confirm_new_phone_user_account_popup"
    >
      <Paragraph marginTop={0} bold>
        {texts!.codeOneInHour}
      </Paragraph>
      <Form
        id="confirm-new-phone-user"
        onSubmit={handleOnNewPhone}
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
                onClick={handleResetPhoneNumber}
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
          id="code_confirm_new_phone_input"
          iconName="PhoneIcon"
        />
      </Form>
    </Popup>
  );
};

export default withTranslates(
  withSiteProps(withUserProps(ConfirmNewPhoneUser)),
  "ConfirmNewPhoneUser"
);
