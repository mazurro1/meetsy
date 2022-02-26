import {NextPage} from "next";
import {withSiteProps, withTranslates} from "@hooks";
import type {ISiteProps, ITranslatesProps} from "@hooks";
import {Form, InputIcon, FetchData} from "@ui";
import {addAlertItem} from "@/redux/site/actions";
import type {FormElementsOnSubmit} from "@ui";
import {updateUserProps} from "@/redux/user/actions";

const UpdatePasswordUserFromSocial: NextPage<ITranslatesProps & ISiteProps> = ({
  texts,
  siteProps,
  dispatch,
}) => {
  const handleOnChangePassword = (
    values: FormElementsOnSubmit[],
    isValid: boolean
  ) => {
    if (isValid) {
      const findPassword = values.find(
        (item) => item.placeholder === texts!.inputPassword
      );
      const findAgainPassword = values.find(
        (item) => item.placeholder === texts!.unputAgainPassword
      );
      if (!!findPassword && !!findAgainPassword) {
        if (findPassword.value !== findAgainPassword.value) {
          dispatch!(addAlertItem(texts!.passwordMustBeTheSame, "RED"));
        } else {
          FetchData({
            url: "/api/user/account/password",
            method: "PATCH",
            dispatch: dispatch,
            language: siteProps?.language,
            data: {
              password: findPassword.value,
            },
            callback: (data) => {
              if (data.success) {
                dispatch!(
                  updateUserProps([
                    {
                      folder: "userDetails",
                      field: "hasPassword",
                      value: data.data.hasPassword,
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

  return (
    <Form
      id="update-password-user-social"
      onSubmit={handleOnChangePassword}
      buttonText={texts!.updatePassword}
      buttonColor="GREEN"
      marginBottom={0}
      marginTop={0}
      isFetchToBlock
      iconName="SaveIcon"
      validation={[
        {
          placeholder: texts!.inputPassword,
          isString: true,
          minLength: 6,
        },
        {
          placeholder: texts!.unputAgainPassword,
          isString: true,
          minLength: 6,
        },
      ]}
    >
      <InputIcon
        placeholder={texts!.inputPassword}
        validText={texts!.minLetter}
        type="password"
        id="social_password_input"
      />
      <InputIcon
        placeholder={texts!.unputAgainPassword}
        validText={texts!.minLetter}
        type="password"
        id="social_repeat_password_input"
      />
    </Form>
  );
};

export default withTranslates(
  withSiteProps(UpdatePasswordUserFromSocial),
  "UpdatePasswordUserFromSocial"
);
