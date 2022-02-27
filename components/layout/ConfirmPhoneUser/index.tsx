import {NextPage} from "next";
import {withSiteProps, withTranslates} from "@hooks";
import type {ISiteProps, ITranslatesProps} from "@hooks";
import {Form, InputIcon, FetchData, ButtonIcon, Paragraph, Tooltip} from "@ui";
import {addAlertItem} from "@/redux/site/actions";
import type {FormElementsOnSubmit} from "@ui";
import {updateUserProps} from "@/redux/user/actions";
import {useEffect, useState} from "react";

const ConfirmPhoneUser: NextPage<ITranslatesProps & ISiteProps> = ({
  texts,
  siteProps,
  dispatch,
  user,
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
                field: "has",
                value: false,
              },
              {
                folder: "phoneDetails",
                field: "number",
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
            {isDisabledSendAgainPhone ? (
              <>
                <Tooltip text={texts!.codeResetOneInHour}>
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
                <Tooltip text={texts!.codeOneInHour}>
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
            ) : (
              <>
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
              </>
            )}
          </>
        }
      >
        <InputIcon
          placeholder={texts!.inputCodePhone}
          validText={texts!.minLetter}
          type="text"
          id="code_confirm_phone_input"
        />
      </Form>
    </div>
  );
};

export default withTranslates(
  withSiteProps(ConfirmPhoneUser),
  "ConfirmPhoneUser"
);
