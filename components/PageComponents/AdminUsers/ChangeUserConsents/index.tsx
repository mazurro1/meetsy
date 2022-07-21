import {NextPage} from "next";
import {
  ButtonIcon,
  FetchData,
  Popup,
  Form,
  InputIcon,
  SelectCreated,
} from "@ui";
import type {FormElementsOnSubmit} from "@ui";
import {
  withSiteProps,
  withTranslates,
  withCompanysProps,
  withUserProps,
} from "@hooks";
import type {ISiteProps, ITranslatesProps, IWithUserProps} from "@hooks";
import type {SelectCreatedValuesProps, ValueSelectCreatedProps} from "@ui";
import {
  EnumUserConsents,
  allNamesOfConsents,
  getEnumUserConsents,
} from "@/models/User/user.model";
import {useEffect, useState} from "react";
import {sortArray} from "@functions";
import {z} from "zod";
import type {UpdateUserProps} from "@/pages/admin/users/index";
import type {UserProps} from "@/models/User/user.model";

interface ChangeUserConsentsProps {
  userData: UserProps;
  handleUpdateUser: (values: UpdateUserProps[]) => void;
}

const ChangeUserConsents: NextPage<
  ITranslatesProps & ISiteProps & ChangeUserConsentsProps & IWithUserProps
> = ({texts, dispatch, siteProps, isMobile, userData, handleUpdateUser}) => {
  const [showChangeUserConsents, setshowChangeUserConsents] =
    useState<boolean>(false);
  const [selectedUserConsents, setselectedUserConsents] = useState<
    SelectCreatedValuesProps[]
  >([]);

  const inputPassword: string = texts!.inputPassword;
  const optionsSelectPermissions: SelectCreatedValuesProps[] = [];

  let language: "pl" | "en" = "pl";
  if (siteProps?.language) {
    language = siteProps?.language;
  }

  allNamesOfConsents.forEach((itemName) => {
    if (!!EnumUserConsents[itemName]) {
      const newItem = {
        label: getEnumUserConsents({
          nameEnum: itemName,
          language: language,
        }),
        value: EnumUserConsents[itemName],
      };

      optionsSelectPermissions.push(newItem);
    }
  });

  useEffect(() => {
    const toUpdateAllEditeduserConsents: SelectCreatedValuesProps[] = [];
    if (!!userData?.consents) {
      sortArray(userData?.consents);
      userData?.consents.forEach((itemPermission) => {
        const findItemPermissionEditedWorker = optionsSelectPermissions.find(
          (item) => {
            return item.value === itemPermission;
          }
        );
        if (!!findItemPermissionEditedWorker) {
          toUpdateAllEditeduserConsents.push(findItemPermissionEditedWorker);
        }
      });
    }
    setselectedUserConsents(toUpdateAllEditeduserConsents);
  }, [userData?.consents]);

  const handleShowChangeUserConsents = () => {
    setshowChangeUserConsents((prevState) => !prevState);
  };

  const handleOnChangeEmail = (
    values: FormElementsOnSubmit[],
    isValid: boolean
  ) => {
    if (isValid) {
      const findPassword = values.find(
        (item) => item.placeholder === inputPassword
      );
      const mapUserConsents = selectedUserConsents.map((item) => item.value);
      if (!!findPassword && !!userData?.email && mapUserConsents) {
        FetchData({
          url: "/api/admin/users/consents",
          method: "PATCH",
          dispatch: dispatch,
          language: siteProps?.language,
          data: {
            adminPassword: findPassword.value,
            editedUserEmail: userData?.email,
            consents: mapUserConsents,
          },
          callback: (data) => {
            if (data.success) {
              const resultData = z
                .number()
                .array()
                .safeParse(data.data.consents);
              if (resultData.success) {
                if (!!resultData.data) {
                  handleUpdateUser([
                    {
                      field: "consents",
                      value: data.data.consents,
                    },
                  ]);
                }
              } else {
                console.error(resultData.error);
              }
              handleShowChangeUserConsents();
            }
          },
        });
      }
    }
  };

  const handleChangeUserConsents = (value: ValueSelectCreatedProps) => {
    const savedValue = value as SelectCreatedValuesProps[];
    setselectedUserConsents(savedValue);
  };

  return (
    <>
      <div className="mt-5">
        <ButtonIcon
          id="button_change_user_consents"
          iconName="ClipboardCheckIcon"
          onClick={handleShowChangeUserConsents}
          fullWidth
          color="PRIMARY"
        >
          {texts?.title}
        </ButtonIcon>
      </div>
      <Popup
        popupEnable={showChangeUserConsents}
        closeUpEnable={false}
        title={texts!.title}
        maxWidth={600}
        handleClose={handleShowChangeUserConsents}
        id="change_user_consents_popup"
      >
        <SelectCreated
          options={optionsSelectPermissions}
          value={selectedUserConsents}
          handleChange={handleChangeUserConsents}
          deleteItem
          deleteLastItem
          isMulti
          closeMenuOnSelect={false}
          placeholder="Uprawnienia"
          maxMenuHeight={150}
          onlyText
        />
        <Form
          id="change_user_consents"
          onSubmit={handleOnChangeEmail}
          buttonText={texts!.button}
          buttonColor="GREEN"
          marginBottom={0}
          marginTop={0}
          isFetchToBlock
          iconName="SaveIcon"
          buttonsFullWidth={isMobile}
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
                id="show_change_user_consents_button"
                onClick={handleShowChangeUserConsents}
                iconName="ArrowLeftIcon"
                fullWidth={isMobile}
              >
                {texts!.cancel}
              </ButtonIcon>
            </>
          }
        >
          <InputIcon
            placeholder={inputPassword}
            validTextGenerate="MIN_6"
            type="password"
            id="admin_passowrd_input"
            iconName="LockClosedIcon"
          />
        </Form>
      </Popup>
    </>
  );
};

export default withUserProps(
  withTranslates(
    withSiteProps(withCompanysProps(ChangeUserConsents)),
    "ChangeUserConsents"
  )
);
