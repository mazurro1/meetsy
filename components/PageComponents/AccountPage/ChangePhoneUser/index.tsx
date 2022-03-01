import {NextPage} from "next";
import {
  ButtonIcon,
  FetchData,
  Popup,
  Form,
  InputIcon,
  PhoneInput,
  Paragraph,
} from "@ui";
import type {FormElementsOnSubmit} from "@ui";
import {withSiteProps, withTranslates} from "@hooks";
import type {ISiteProps, ITranslatesProps} from "@hooks";
import {useState, useEffect} from "react";
import {updateUserProps} from "@/redux/user/actions";
import {addAlertItem} from "@/redux/site/actions";

interface ChangePhoneUserProps {
  showChangePhoneUser: boolean;
  handleShowChangePhoneUser: () => void;
  handleShowConfirmNewPhoneUser: () => void;
}

const ChangePhoneUser: NextPage<
  ITranslatesProps & ISiteProps & ChangePhoneUserProps
> = ({
  texts,
  dispatch,
  siteProps,
  showChangePhoneUser,
  handleShowChangePhoneUser,
  handleShowConfirmNewPhoneUser,
  user,
}) => {
  const [phoneRegionalCode, setPhoneRegionalCode] = useState<number | null>(
    null
  );
  const [isDisabledSendAgainPhone, setIsDisabledSendAgainPhone] =
    useState<boolean>(true);

  const inputPassword: string = texts!.inputPassword;
  const inputPhone: string = texts!.inputPhone;

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
      const findPassword = values.find(
        (item) => item.placeholder === inputPassword
      );
      const findPhone = values.find((item) => item.placeholder === inputPhone);
      if (!!findPassword && !!findPhone && !!phoneRegionalCode) {
        if (Number(findPhone.value) !== user?.phoneDetails.number) {
          FetchData({
            url: "/api/user/account/phone",
            method: "PUT",
            dispatch: dispatch,
            language: siteProps?.language,
            data: {
              password: findPassword.value,
              newPhone: Number(findPhone.value),
              newRegionalCode: phoneRegionalCode,
            },
            callback: (data) => {
              if (data.success) {
                if (
                  !!data.data.toConfirmNumber &&
                  !!data.data.toConfirmRegionalCode
                ) {
                  dispatch!(
                    updateUserProps([
                      {
                        folder: "phoneDetails",
                        field: "toConfirmNumber",
                        value: data.data.toConfirmNumber,
                      },
                      {
                        folder: "phoneDetails",
                        field: "toConfirmRegionalCode",
                        value: data.data.toConfirmRegionalCode,
                      },
                    ])
                  );
                }
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
                } else {
                  dispatch!(
                    updateUserProps([
                      {
                        folder: "phoneDetails",
                        field: "dateSendAgainSMS",
                        value: new Date(
                          new Date().setHours(new Date().getHours() + 1)
                        ),
                      },
                    ])
                  );
                }
                handleShowChangePhoneUser();
                handleShowConfirmNewPhoneUser();
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
      popupEnable={
        showChangePhoneUser &&
        !!!user?.phoneDetails.toConfirmNumber &&
        !!!user?.phoneDetails.toConfirmRegionalCode
      }
      closeUpEnable={false}
      title={texts!.title}
      maxWidth={600}
      handleClose={handleShowChangePhoneUser}
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
            placeholder: inputPassword,
            isString: true,
            minLength: 6,
          },
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
              onClick={handleShowChangePhoneUser}
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
        <InputIcon
          placeholder={inputPassword}
          validText={texts!.minLetter}
          type="password"
          id="user_passowrd_input"
          iconName="LockClosedIcon"
        />
      </Form>
    </Popup>
  );
};

export default withTranslates(
  withSiteProps(ChangePhoneUser),
  "ChangePhoneUser"
);
