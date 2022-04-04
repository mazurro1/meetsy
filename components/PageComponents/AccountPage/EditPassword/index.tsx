import {NextPage} from "next";
import {ButtonIcon, FetchData, Popup, Form, InputIcon} from "@ui";
import type {FormElementsOnSubmit} from "@ui";
import {withSiteProps, withTranslates} from "@hooks";
import type {ISiteProps, ITranslatesProps} from "@hooks";
import {addAlertItem} from "@/redux/site/actions";

interface EditPasswordProps {
  showEditPassword: boolean;
  handleShowEditPassword: () => void;
}

const EditPassword: NextPage<
  ITranslatesProps & ISiteProps & EditPasswordProps
> = ({
  texts,
  dispatch,
  siteProps,
  showEditPassword,
  handleShowEditPassword,
}) => {
  const inputPasswordOld: string = texts!.inputPasswordOld;
  const inputPassword: string = texts!.inputPassword;
  const inputPasswordRepeat: string = texts!.inputPasswordRepeat;

  const handleOnChangePassword = (
    values: FormElementsOnSubmit[],
    isValid: boolean
  ) => {
    if (isValid) {
      const findPasswordOld = values.find(
        (item) => item.placeholder === inputPasswordOld
      );
      const findPassword = values.find(
        (item) => item.placeholder === inputPassword
      );
      const findPasswordRepeat = values.find(
        (item) => item.placeholder === inputPasswordRepeat
      );
      if (!!findPasswordOld && !!findPassword && !!findPasswordRepeat) {
        if (findPassword.value === findPasswordRepeat.value) {
          if (findPassword.value !== findPasswordOld.value) {
            FetchData({
              url: "/api/user/account/password",
              method: "PUT",
              dispatch: dispatch,
              language: siteProps?.language,
              data: {
                oldPassword: findPasswordOld.value,
                newPassword: findPassword.value,
              },
              callback: (data) => {
                if (data.success) {
                  handleShowEditPassword();
                }
              },
            });
          } else {
            dispatch!(addAlertItem(texts!.passwordsIncorrectOldNew, "RED"));
          }
        } else {
          dispatch!(addAlertItem(texts!.passwordsIncorrect, "RED"));
        }
      }
    }
  };

  return (
    <Popup
      popupEnable={showEditPassword}
      closeUpEnable={false}
      title={texts!.title}
      maxWidth={600}
      handleClose={handleShowEditPassword}
      id="change_password_user_account_popup"
    >
      <Form
        id="change_password_user_account"
        onSubmit={handleOnChangePassword}
        buttonText={texts!.title}
        buttonColor="GREEN"
        marginBottom={0}
        marginTop={0}
        isFetchToBlock
        iconName="SaveIcon"
        validation={[
          {
            placeholder: inputPasswordOld,
            isString: true,
            minLength: 6,
          },
          {
            placeholder: inputPassword,
            isString: true,
            minLength: 6,
          },
          {
            placeholder: inputPasswordRepeat,
            isString: true,
            minLength: 6,
          },
        ]}
        extraButtons={
          <>
            <ButtonIcon
              id="show_change_password_account_button"
              onClick={handleShowEditPassword}
              iconName="ArrowLeftIcon"
            >
              {texts!.cancel}
            </ButtonIcon>
          </>
        }
      >
        <InputIcon
          placeholder={inputPasswordOld}
          validText={texts!.minLetter}
          type="password"
          id="user_old_passowrd_input"
          iconName="LockClosedIcon"
        />
        <InputIcon
          placeholder={inputPassword}
          validText={texts!.minLetter}
          type="password"
          id="user_passowrd_input"
          iconName="LockClosedIcon"
        />
        <InputIcon
          placeholder={inputPasswordRepeat}
          validText={texts!.minLetter}
          type="password"
          id="user_passowrd_repeat_input"
          iconName="LockClosedIcon"
        />
      </Form>
    </Popup>
  );
};

export default withTranslates(withSiteProps(EditPassword), "EditPassword");
