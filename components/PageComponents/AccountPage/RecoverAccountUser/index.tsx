import {NextPage} from "next";
import {
  ButtonIcon,
  FetchData,
  Popup,
  Form,
  InputIcon,
  Paragraph,
  PhoneInput,
} from "@ui";
import type {FormElementsOnSubmit} from "@ui";
import {withSiteProps, withTranslates, withUserProps} from "@hooks";
import type {ISiteProps, ITranslatesProps, IWithUserProps} from "@hooks";
import {useState} from "react";

interface RecoverAccountUserProps {
  showRecoverAccountUser: boolean;
  handleShowRecoverAccountUser: () => void;
  handleShowConfirmRecoverAccountUser: () => void;
  handleEmailConfirmRecoverAccountSend: (value: string) => void;
}

const RecoverAccountUser: NextPage<
  ITranslatesProps & ISiteProps & RecoverAccountUserProps & IWithUserProps
> = ({
  texts,
  dispatch,
  siteProps,
  showRecoverAccountUser,
  handleShowRecoverAccountUser,
  handleShowConfirmRecoverAccountUser,
  handleEmailConfirmRecoverAccountSend,
  user,
}) => {
  const [phoneRegionalCode, setPhoneRegionalCode] = useState<number | null>(
    null
  );

  const inputPhone: string = texts!.inputPhone;
  const inputEmail: string = texts!.inputEmail;

  const handleOnRecoverAccount = (
    values: FormElementsOnSubmit[],
    isValid: boolean
  ) => {
    if (isValid) {
      const findPhone = values.find((item) => item.placeholder === inputPhone);
      const findEmail = values.find((item) => item.placeholder === inputEmail);
      if (!!findPhone && !!findEmail && !!phoneRegionalCode) {
        FetchData({
          url: "/api/user/account",
          method: "POST",
          dispatch: dispatch,
          language: siteProps?.language,
          data: {
            phone: Number(findPhone.value),
            regionalCode: phoneRegionalCode,
            email: findEmail.value,
            reciveAccount: true,
          },
          callback: (data) => {
            if (data.success) {
              handleShowRecoverAccountUser();
              handleShowConfirmRecoverAccountUser();
              if (!!data.data.email) {
                handleEmailConfirmRecoverAccountSend(data.data.email);
              }
            }
          },
        });
      }
    }
  };

  const handleChangeCountry = (value: number) => {
    setPhoneRegionalCode(value);
  };

  return (
    <Popup
      popupEnable={showRecoverAccountUser && !!!user}
      closeUpEnable={false}
      title={texts!.title}
      maxWidth={600}
      handleClose={handleShowRecoverAccountUser}
      id="change_email_user_account_popup"
    >
      <Paragraph bold marginTop={0}>
        {texts!.reciveAccountAlert}
      </Paragraph>
      <Form
        id="change_email_user_account"
        onSubmit={handleOnRecoverAccount}
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
            minLength: 9,
          },
          {
            placeholder: inputEmail,
            isEmail: true,
          },
        ]}
        extraButtons={
          <>
            <ButtonIcon
              id="show_change_email_account_button"
              onClick={handleShowRecoverAccountUser}
              iconName="ArrowLeftIcon"
            >
              {texts!.cancel}
            </ButtonIcon>
          </>
        }
      >
        <InputIcon
          placeholder={inputEmail}
          type="text"
          id="user_new_email_input"
          iconName="AtSymbolIcon"
        />
        <div className="mb-20">
          <PhoneInput
            placeholder={inputPhone}
            handleChangeCountry={handleChangeCountry}
            validText={texts!.min9Letter}
            id="phone_account_input"
          />
        </div>
      </Form>
    </Popup>
  );
};

export default withTranslates(
  withSiteProps(withUserProps(RecoverAccountUser)),
  "RecoverAccountUser"
);
