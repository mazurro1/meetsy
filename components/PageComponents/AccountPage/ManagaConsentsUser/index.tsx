import {NextPage} from "next";
import {ButtonIcon, FetchData, Popup, Form, InputIcon, Checkbox} from "@ui";
import type {FormElementsOnSubmit} from "@ui";
import {withSiteProps, withTranslates} from "@hooks";
import type {ISiteProps, ITranslatesProps} from "@hooks";
import {updateUserProps} from "@/redux/user/actions";
import {addAlertItem} from "@/redux/site/actions";
import {EnumUserConsents} from "@/models/User/user.model";

interface ManagaConsentsUserProps {
  showManagaConsentsUser: boolean;
  handleShowManagaConsentsUser: () => void;
}

const ManagaConsentsUser: NextPage<
  ITranslatesProps & ISiteProps & ManagaConsentsUserProps
> = ({
  texts,
  dispatch,
  siteProps,
  showManagaConsentsUser,
  handleShowManagaConsentsUser,
  user,
}) => {
  const inputPassword: string = texts!.inputPassword;
  const inputSms: string = texts!.inputSms;
  const inputEmails: string = texts!.inputEmails;
  const inputEmailsMarketing: string = texts!.inputEmailsMarketing;
  const inputSendNotifications: string = texts!.inputSendNotifications;

  const userHasConsentsSmsAllServices = !!user?.consents.some(
    (item) => item === EnumUserConsents.sendSmsAllServices
  );
  const userHasConsentsEmailsAllServices = !!user?.consents.some(
    (item) => item === EnumUserConsents.sendEmailsAllServices
  );
  const userHasConsentsEmailsMarketing = !!user?.consents.some(
    (item) => item === EnumUserConsents.sendEmailsMarketing
  );

  const userHasConsentsSendNotifications = !!user?.consents.some(
    (item) => item === EnumUserConsents.sendNotifications
  );

  const handleOnManagaConsents = (
    values: FormElementsOnSubmit[],
    isValid: boolean
  ) => {
    if (isValid) {
      const findPassword = values.find(
        (item) => item.placeholder === inputPassword
      );
      const findSms = values.find((item) => item.placeholder === inputSms);
      const findEmails = values.find(
        (item) => item.placeholder === inputEmails
      );
      const findEmailsMarketing = values.find(
        (item) => item.placeholder === inputEmailsMarketing
      );
      const findSendNotifications = values.find(
        (item) => item.placeholder === inputSendNotifications
      );
      if (
        !!findPassword &&
        findSms !== undefined &&
        findEmails !== undefined &&
        findEmailsMarketing !== undefined &&
        findSendNotifications !== undefined
      ) {
        if (
          findSms.value !== userHasConsentsSmsAllServices ||
          findEmails.value !== userHasConsentsEmailsAllServices ||
          findEmailsMarketing.value !== userHasConsentsEmailsMarketing ||
          findSendNotifications.value !== userHasConsentsSendNotifications
        ) {
          FetchData({
            url: "/api/user/account",
            method: "PUT",
            dispatch: dispatch,
            language: siteProps?.language,
            data: {
              password: findPassword.value,
              sendSmsAllServices: findSms.value,
              sendEmailsAllServices: findEmails.value,
              sendEmailsMarketing: findEmailsMarketing.value,
              sendNotifications: findSendNotifications.value,
            },
            callback: (data) => {
              if (data.success) {
                if (!!data.data.consents) {
                  dispatch!(
                    updateUserProps([
                      {
                        field: "consents",
                        value: data.data.consents,
                      },
                    ])
                  );
                }
                handleShowManagaConsentsUser();
              }
            },
          });
        } else {
          dispatch!(addAlertItem(texts!.dataIsTheSame, "RED"));
        }
      }
    }
  };

  return (
    <Popup
      popupEnable={showManagaConsentsUser}
      closeUpEnable={false}
      title={texts!.title}
      maxWidth={600}
      handleClose={handleShowManagaConsentsUser}
      id="change_email_user_account_popup"
    >
      <Form
        id="change_email_user_account"
        onSubmit={handleOnManagaConsents}
        buttonText={texts!.save}
        buttonColor="GREEN"
        marginBottom={0}
        marginTop={0}
        isFetchToBlock
        iconName="SaveIcon"
        validation={[
          {
            placeholder: inputPassword,
            isString: true,
            minLength: 6,
          },
        ]}
        extraButtons={
          <>
            <ButtonIcon
              id="show_change_email_account_button"
              onClick={handleShowManagaConsentsUser}
              iconName="ArrowLeftIcon"
            >
              {texts!.cancel}
            </ButtonIcon>
          </>
        }
      >
        <Checkbox
          id="sms_checkbox"
          placeholder={inputSms}
          defaultValue={userHasConsentsSmsAllServices}
          marginTop={0}
        />
        <Checkbox
          id="emails_checkbox"
          placeholder={inputEmails}
          defaultValue={userHasConsentsEmailsAllServices}
        />
        <Checkbox
          id="emails_marketing_checkbox"
          placeholder={inputEmailsMarketing}
          defaultValue={userHasConsentsEmailsMarketing}
        />
        <Checkbox
          id="notifications_checkbox"
          placeholder={inputSendNotifications}
          defaultValue={userHasConsentsSendNotifications}
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
  withSiteProps(ManagaConsentsUser),
  "ManagaConsentsUser"
);
