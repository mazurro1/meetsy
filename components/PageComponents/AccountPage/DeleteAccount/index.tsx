import {NextPage} from "next";
import {ButtonIcon, Paragraph, FetchData, Popup, Form, InputIcon} from "@ui";
import type {FormElementsOnSubmit} from "@ui";
import {withSiteProps, withTranslates, withUserProps} from "@hooks";
import type {ISiteProps, ITranslatesProps, IWithUserProps} from "@hooks";
import {signOut} from "next-auth/react";

interface DeleteAccountProps {
  showDeleteAccount: boolean;
  handleShowDeleteAccount: () => void;
}

const DeleteAccount: NextPage<
  ITranslatesProps & ISiteProps & DeleteAccountProps & IWithUserProps
> = ({
  texts,
  dispatch,
  siteProps,
  showDeleteAccount,
  handleShowDeleteAccount,
  user,
}) => {
  const inputPassword: string = texts!.inputPassword;

  const handleOnChangePassword = (
    values: FormElementsOnSubmit[],
    isValid: boolean
  ) => {
    if (isValid) {
      const findPassword = values.find(
        (item) => item.placeholder === inputPassword
      );
      if (!!findPassword) {
        FetchData({
          url: "/api/user/account",
          method: "DELETE",
          dispatch: dispatch,
          language: siteProps?.language,
          data: {
            password: findPassword.value,
          },
          callback: (data) => {
            if (data.success) {
              signOut();
            }
          },
        });
      }
    }
  };

  const handleDeleteAccountWithoutPassword = () => {
    FetchData({
      url: "/api/user/account",
      method: "DELETE",
      dispatch: dispatch,
      language: siteProps?.language,
      data: {
        password: null,
      },
      callback: (data) => {
        if (data.success) {
          signOut();
        }
      },
    });
  };

  const userHasPassword: boolean = !!user?.userDetails.hasPassword;

  return (
    <Popup
      popupEnable={showDeleteAccount}
      closeUpEnable={false}
      title={texts!.title}
      maxWidth={600}
      handleClose={handleShowDeleteAccount}
      id="delete_user_account_popup"
    >
      <Paragraph marginTop={0}>{texts!.paragraph}</Paragraph>
      {userHasPassword ? (
        <Form
          id="delete_user_account"
          onSubmit={handleOnChangePassword}
          buttonText={texts!.title}
          buttonColor="RED"
          marginBottom={0}
          marginTop={0}
          isFetchToBlock
          iconName="TrashIcon"
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
                id="show_delete_account_button"
                onClick={handleShowDeleteAccount}
                iconName="ArrowLeftIcon"
              >
                {texts!.cancel}
              </ButtonIcon>
            </>
          }
        >
          <InputIcon
            placeholder={inputPassword}
            validText={texts!.minLetter}
            type="password"
            id="user_passowrd_input"
            iconName="LockClosedIcon"
          />
        </Form>
      ) : (
        <div className="flex-end-center">
          <ButtonIcon
            id="show_delete_account_button"
            onClick={handleShowDeleteAccount}
            iconName="ArrowLeftIcon"
          >
            {texts!.cancel}
          </ButtonIcon>
          <div className="ml-10">
            <ButtonIcon
              isFetchToBlock
              id="delete_user_account_button"
              onClick={handleDeleteAccountWithoutPassword}
              iconName="TrashIcon"
              color="RED"
            >
              {texts!.title}
            </ButtonIcon>
          </div>
        </div>
      )}
    </Popup>
  );
};

export default withTranslates(
  withSiteProps(withUserProps(DeleteAccount)),
  "DeleteAccount"
);
