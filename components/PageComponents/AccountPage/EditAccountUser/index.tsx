import {NextPage} from "next";
import {ButtonIcon, FetchData, Popup, Form, InputIcon} from "@ui";
import type {FormElementsOnSubmit} from "@ui";
import {withSiteProps, withTranslates} from "@hooks";
import type {ISiteProps, ITranslatesProps} from "@hooks";
import {updateUserProps} from "@/redux/user/actions";
import {addAlertItem} from "@/redux/site/actions";
import {useState, useEffect} from "react";
import {capitalizeFirstLetter} from "@functions";

interface EditAccountUserProps {
  showEditAccountUser: boolean;
  handleShowEditAccountUser: () => void;
}

const EditAccountUser: NextPage<
  ITranslatesProps & ISiteProps & EditAccountUserProps
> = ({
  texts,
  dispatch,
  siteProps,
  showEditAccountUser,
  handleShowEditAccountUser,
  user,
}) => {
  const [valueName, setValueName] = useState<string>("");
  const [valueSurname, setValueSurname] = useState<string>("");

  const inputPassword: string = texts!.inputPassword;
  const inputName: string = texts!.inputName;
  const inputSurname: string = texts!.inputSurname;

  useEffect(() => {
    if (!!user) {
      if (!!user.userDetails.name) {
        setValueName(capitalizeFirstLetter(user.userDetails.name));
      }
      if (!!user.userDetails.surname) {
        setValueSurname(capitalizeFirstLetter(user.userDetails.surname));
      }
    }
  }, [user]);

  const handleOnEditAccount = (
    values: FormElementsOnSubmit[],
    isValid: boolean
  ) => {
    if (isValid) {
      const findPassword = values.find(
        (item) => item.placeholder === inputPassword
      );
      const findName = values.find((item) => item.placeholder === inputName);
      const findSurname = values.find(
        (item) => item.placeholder === inputSurname
      );
      if (
        !!findPassword &&
        !!findName &&
        !!findSurname &&
        !!user?.userDetails.name &&
        !!user?.userDetails.surname
      ) {
        if (
          typeof findName.value === "string" &&
          typeof findSurname.value === "string"
        ) {
          if (
            findName.value.toLowerCase().trim() !==
              user?.userDetails.name.toLowerCase().trim() ||
            findSurname.value.toLowerCase().trim() !==
              user?.userDetails.surname.toLowerCase().trim()
          ) {
            FetchData({
              url: "/api/user/account",
              method: "PATCH",
              dispatch: dispatch,
              language: siteProps?.language,
              data: {
                name: findName.value,
                surname: findSurname.value,
                password: findPassword.value,
              },
              callback: (data) => {
                if (data.success) {
                  if (!!data.data.name && !!data.data.surname) {
                    dispatch!(
                      updateUserProps([
                        {
                          folder: "userDetails",
                          field: "name",
                          value: data.data.name,
                        },
                        {
                          folder: "userDetails",
                          field: "surname",
                          value: data.data.surname,
                        },
                      ])
                    );
                  }
                  handleShowEditAccountUser();
                }
              },
            });
          } else {
            dispatch!(addAlertItem(texts!.dataIsTheSame, "RED"));
          }
        }
      }
    }
  };

  const handleChangeName = (value: string) => {
    setValueName(value);
  };

  const handleChangeSurname = (value: string) => {
    setValueSurname(value);
  };

  return (
    <Popup
      popupEnable={showEditAccountUser}
      closeUpEnable={false}
      title={texts!.title}
      maxWidth={600}
      handleClose={handleShowEditAccountUser}
      id="change_email_user_account_popup"
    >
      <Form
        id="change_email_user_account"
        onSubmit={handleOnEditAccount}
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
          {
            placeholder: inputName,
            isString: true,
            minLength: 3,
          },
          {
            placeholder: inputSurname,
            isString: true,
            minLength: 3,
          },
        ]}
        extraButtons={
          <>
            <ButtonIcon
              id="show_change_email_account_button"
              onClick={handleShowEditAccountUser}
              iconName="ArrowLeftIcon"
            >
              {texts!.cancel}
            </ButtonIcon>
          </>
        }
      >
        <InputIcon
          placeholder={inputName}
          type="text"
          id="user_name_input"
          iconName="UserIcon"
          value={valueName}
          onChange={handleChangeName}
          validText={texts!.validMinLetter}
        />
        <InputIcon
          placeholder={inputSurname}
          type="text"
          id="user_surname_input"
          iconName="UserIcon"
          value={valueSurname}
          onChange={handleChangeSurname}
          validText={texts!.validMinLetter}
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
  withSiteProps(EditAccountUser),
  "EditAccountUser"
);
