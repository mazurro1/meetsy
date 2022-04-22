import {NextPage} from "next";
import {ButtonIcon, FetchData, Popup, Form, InputIcon} from "@ui";
import type {FormElementsOnSubmit} from "@ui";
import {withSiteProps, withTranslates, withCompanysProps} from "@hooks";
import type {ISiteProps, ITranslatesProps} from "@hooks";
import {updateAllCompanysProps} from "@/redux/companys/actions";
import {addAlertItem} from "@/redux/site/actions";
import {useEffect, useState} from "react";
import {CompanyContactProps} from "@/models/Company/company.model";
import {capitalizeFirstLetter} from "@functions";

interface ChangeCompanyContactProps {
  companyId: string;
  companyContact?: CompanyContactProps;
}

const ChangeCompanyContact: NextPage<
  ITranslatesProps & ISiteProps & ChangeCompanyContactProps
> = ({texts, dispatch, siteProps, companyId, companyContact}) => {
  const [showChangeCompanyContact, setshowChangeCompanyContact] =
    useState<boolean>(false);
  const [postalCodeValue, setPostalCodeValue] = useState("");
  const [cityValue, setCityValue] = useState("");
  const [districtValue, setDistrictValue] = useState("");
  const [streetValue, setStreetValue] = useState("");

  useEffect(() => {
    if (!!companyContact) {
      setPostalCodeValue(
        `${companyContact.postalCode
          .toString()
          .slice(0, 2)}-${companyContact.postalCode
          .toString()
          .slice(2, companyContact.postalCode.toString().length)}`
      );
      setCityValue(capitalizeFirstLetter(companyContact.city.placeholder));
      setDistrictValue(
        capitalizeFirstLetter(companyContact.district.placeholder)
      );
      setStreetValue(capitalizeFirstLetter(companyContact.street.placeholder));
    }
  }, [companyContact]);

  const postalCodeInput: string = texts!.postalCodeInput;
  const cityInput: string = texts!.cityInput;
  const districtInput: string = texts!.districtInput;
  const streetInput: string = texts!.streetInput;

  const handleShowChangeCompanyContact = () => {
    setshowChangeCompanyContact((prevState) => !prevState);
  };

  const handleChangeInputs = (
    value: string,
    setChange: (text: string) => void
  ) => {
    setChange(value);
  };

  const handleOnChangeEmail = (
    values: FormElementsOnSubmit[],
    isValid: boolean
  ) => {
    if (isValid) {
      const findPostalCode = values.find(
        (item) => item.placeholder === postalCodeInput
      );
      const findCity = values.find((item) => item.placeholder === cityInput);
      const findDistrictInput = values.find(
        (item) => item.placeholder === districtInput
      );
      const findStreetInput = values.find(
        (item) => item.placeholder === streetInput
      );

      if (
        !!findPostalCode &&
        !!findCity &&
        !!findDistrictInput &&
        !!findStreetInput &&
        !!companyContact
      ) {
        const splitPostalCode = findPostalCode.value.toString().split("");
        let validStringPostalCode: string = "";
        for (const letterPostalCode of splitPostalCode) {
          if (!isNaN(Number(letterPostalCode))) {
            if (typeof Number(letterPostalCode) === "number") {
              validStringPostalCode = `${validStringPostalCode}${letterPostalCode}`;
            }
          }
        }

        const validPostalCode = Number(validStringPostalCode);

        if (
          typeof findCity.value === "string" &&
          typeof findDistrictInput.value === "string" &&
          typeof findStreetInput.value === "string"
        ) {
          if (
            validPostalCode !== companyContact.postalCode ||
            findCity.value !== companyContact.city.placeholder ||
            findDistrictInput.value !== companyContact.district.placeholder ||
            findStreetInput.value !== companyContact.street.placeholder
          ) {
            FetchData({
              url: "/api/companys/edit/contact",
              method: "PATCH",
              dispatch: dispatch,
              language: siteProps?.language,
              companyId: companyId,
              data: {
                postalCode: validPostalCode,
                city: findCity.value,
                district: findDistrictInput.value,
                street: findStreetInput.value,
              },
              callback: (data) => {
                if (data.success) {
                  if (!!data.data.companyContact) {
                    dispatch!(
                      updateAllCompanysProps([
                        {
                          field: "companyContact",
                          value: data.data.companyContact,
                          companyId: companyId,
                        },
                      ])
                    );
                  }
                  handleShowChangeCompanyContact();
                }
              },
            });
          } else {
            dispatch!(addAlertItem(texts!.noNewData, "RED"));
          }
        } else {
          dispatch!(addAlertItem(texts!.somethingWentWrong, "RED"));
        }
      } else {
        dispatch!(addAlertItem(texts!.somethingWentWrong, "RED"));
      }
    }
  };

  return (
    <>
      <div className="mt-10">
        <ButtonIcon
          id="company_edit_informations"
          onClick={handleShowChangeCompanyContact}
          iconName="HomeIcon"
          fullWidth
        >
          {texts!.title}
        </ButtonIcon>
      </div>
      <Popup
        popupEnable={showChangeCompanyContact}
        closeUpEnable={false}
        title={texts!.title}
        maxWidth={600}
        handleClose={handleShowChangeCompanyContact}
        id="change_email_user_account_popup"
      >
        <Form
          id="change_email_user_account"
          onSubmit={handleOnChangeEmail}
          buttonText={texts!.button}
          buttonColor="GREEN"
          marginBottom={0}
          marginTop={0}
          isFetchToBlock
          iconName="SaveIcon"
          validation={[
            {
              placeholder: postalCodeInput,
              isString: true,
              minLength: 5,
              maxLength: 7,
            },
            {
              placeholder: cityInput,
              isString: true,
              minLength: 3,
            },
            {
              placeholder: districtInput,
              isString: true,
              minLength: 3,
            },
            {
              placeholder: streetInput,
              isString: true,
              minLength: 3,
            },
          ]}
          extraButtons={
            <>
              <ButtonIcon
                id="show_change_company_informations_button"
                onClick={handleShowChangeCompanyContact}
                iconName="ArrowLeftIcon"
              >
                {texts!.cancel}
              </ButtonIcon>
            </>
          }
        >
          <InputIcon
            placeholder={postalCodeInput}
            value={postalCodeValue}
            onChange={(value: string) =>
              handleChangeInputs(value, setPostalCodeValue)
            }
            type="text"
            validTextGenerate="MIN_5"
            iconName="MailIcon"
            id="registration_company_postal_code_input"
          />
          <InputIcon
            placeholder={cityInput}
            value={cityValue}
            onChange={(value: string) =>
              handleChangeInputs(value, setCityValue)
            }
            type="text"
            validTextGenerate="MIN_3"
            iconName="HomeIcon"
            id="registration_company_city_input"
            capitalize
          />
          <InputIcon
            placeholder={districtInput}
            value={districtValue}
            onChange={(value: string) =>
              handleChangeInputs(value, setDistrictValue)
            }
            type="text"
            validTextGenerate="MIN_3"
            iconName="OfficeBuildingIcon"
            id="registration_company_district_input"
            capitalize
          />
          <InputIcon
            placeholder={streetInput}
            value={streetValue}
            onChange={(value: string) =>
              handleChangeInputs(value, setStreetValue)
            }
            type="text"
            validTextGenerate="MIN_3"
            iconName="LocationMarkerIcon"
            id="registration_company_street_input"
            capitalize
          />
        </Form>
      </Popup>
    </>
  );
};

export default withTranslates(
  withSiteProps(withCompanysProps(ChangeCompanyContact)),
  "ChangeCompanyContact"
);
