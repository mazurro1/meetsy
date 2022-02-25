import {NextPage} from "next";
import {withSiteProps, withTranslates} from "@hooks";
import type {ISiteProps, ITranslatesProps} from "@hooks";
import {Form, FetchData, PhoneInput} from "@ui";
import type {FormElementsOnSubmit} from "@ui";
import {updateUserProps} from "@/redux/user/actions";
import {useState} from "react";

const UpdateUserPhone: NextPage<ITranslatesProps & ISiteProps> = ({
  texts,
  siteProps,
  dispatch,
}) => {
  const [phoneRegionalCode, setPhoneRegionalCode] = useState<number | null>(
    null
  );

  const handleOnChangePassword = (
    values: FormElementsOnSubmit[],
    isValid: boolean
  ) => {
    if (isValid) {
      const findPhone = values.find(
        (item) => item.placeholder === texts!.phoneNumberInput
      );
      if (!!findPhone && !!phoneRegionalCode) {
        FetchData({
          url: "/api/user/account/phone",
          method: "PATCH",
          dispatch: dispatch,
          language: siteProps?.language,
          data: {
            phone: findPhone.value,
            phoneRegionalCode: phoneRegionalCode,
          },
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
              dispatch!(
                updateUserProps([
                  {
                    folder: "phoneDetails",
                    field: "has",
                    value: true,
                  },
                ])
              );
              dispatch!(
                updateUserProps([
                  {
                    folder: "phoneDetails",
                    field: "number",
                    value: Number(findPhone.value),
                  },
                ])
              );
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
    <Form
      id="update-password-user-social"
      onSubmit={handleOnChangePassword}
      buttonText={texts!.buttonSave}
      buttonColor="GREEN"
      marginBottom={0}
      marginTop={0}
      isFetchToBlock
      iconName="LoginIcon"
      validation={[
        {
          placeholder: texts!.phoneNumberInput,
          isNumber: true,
          minLength: 9,
        },
      ]}
    >
      <div className="mb-50">
        <PhoneInput
          placeholder={texts!.phoneNumberInput}
          handleChangeCountry={handleChangeCountry}
          validText={texts!.min9Letter}
          id="add_phone_account_input"
        />
      </div>
    </Form>
  );
};

export default withTranslates(
  withSiteProps(UpdateUserPhone),
  "UpdateUserPhone"
);
