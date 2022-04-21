import {NextPage} from "next";
import {
  PageSegment,
  Checkbox,
  Form,
  InputIcon,
  TitlePage,
  PhoneInput,
  LinkEffect,
  DetectChanges,
  FetchData,
} from "@ui";
import type {FormElementsOnSubmit} from "@ui";
import {getSession} from "next-auth/react";
import {GetServerSideProps} from "next";
import {addAlertItem} from "@/redux/site/actions";
import {withSiteProps, withTranslates} from "@hooks";
import type {ISiteProps, ITranslatesProps} from "@hooks";
import {useState, useRef} from "react";
import {
  MaxWidthRegistration,
  StyleCheckRegulations,
} from "@/components/PageComponents/RegistrationPage/registration.style";
import {detectChangesForm} from "@functions";
import {checkUserAccountIsConfirmed} from "@lib";

const Home: NextPage<ISiteProps & ITranslatesProps> = ({
  texts,
  dispatch,
  siteProps,
  router,
}) => {
  const [phoneRegionalCode, setPhoneRegionalCode] = useState<number | null>(
    null
  );
  const [formHasChanges, setFormHasChanges] = useState<boolean>(false);
  const [createdCompanyValid, setCreatedCompanyValid] =
    useState<boolean>(false);
  const refForm = useRef<HTMLFormElement>(null);

  const emailInput: string = texts!.inputEmail;
  const nameCompanyInput: string = texts!.inputNameCompany;
  const checkboxAcceptRegulationInput = texts!.checkboxAcceptRegulation;
  const postalCodeInput = texts!.inputPostalCode;
  const districtInput = texts!.inputDistrict;
  const phoneNumberInput = texts!.inputPhoneNumber;
  const streetInput = texts!.inputStreet;
  const cityInput = texts!.inputCity;
  const nipInput = texts!.inputNip;

  const handleSubmitRegistration = (
    values: FormElementsOnSubmit[],
    isValid: boolean
  ) => {
    if (isValid) {
      const findEmail = values.find((item) => item.placeholder === emailInput);

      const findNameCompany = values.find(
        (item) => item.placeholder === nameCompanyInput
      );

      const findPhone = values.find(
        (item) => item.placeholder === phoneNumberInput
      );

      const findCheckRegulation = values.find(
        (item) => item.placeholder === checkboxAcceptRegulationInput
      );

      const findDistrict = values.find(
        (item) => item.placeholder === districtInput
      );

      const findPostalCode = values.find(
        (item) => item.placeholder === postalCodeInput
      );

      const findStreet = values.find(
        (item) => item.placeholder === streetInput
      );

      const findCity = values.find((item) => item.placeholder === cityInput);

      const findNip = values.find((item) => item.placeholder === nipInput);

      if (
        !!findEmail &&
        !!findPhone &&
        !!findNameCompany &&
        !!phoneRegionalCode &&
        !!findCheckRegulation &&
        !!findDistrict &&
        !!findPostalCode &&
        !!findStreet &&
        !!findCity
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
          typeof validPostalCode === "number" &&
          validStringPostalCode.length === 5
        ) {
          setCreatedCompanyValid(true);
          if (!!findCheckRegulation.value) {
            FetchData({
              url: "/api/companys",
              method: "POST",
              dispatch: dispatch,
              language: siteProps?.language,
              data: {
                email: findEmail.value,
                name: findNameCompany.value,
                nip: !!findNip ? findNip.value : null,
                postalCode: validPostalCode,
                city: findCity.value,
                district: findDistrict.value,
                street: findStreet.value,
                regionalCode: phoneRegionalCode,
                phone: findPhone.value,
              },
              disabledLoader: false,
              callback: (data) => {
                if (data.success) {
                  router?.push(`/account/companys?${data.data.companyId}`);
                }
              },
            });
          } else {
            dispatch!(addAlertItem(texts!.warningAcceptRegulation, "RED"));
          }
        } else {
          dispatch!(addAlertItem(texts!.badPostalCode, "RED"));
        }
      } else {
        dispatch!(addAlertItem(texts!.somethingWentWrong, "RED"));
      }
    }
  };

  const handleChangeCountry = (value: number) => {
    setPhoneRegionalCode(value);
  };

  const handleChangesForm = () => {
    let formHasChanges = false;
    if (!!refForm) {
      if (!!refForm.current) {
        formHasChanges = detectChangesForm(refForm.current?.elements);
      }
    }
    setFormHasChanges(formHasChanges);
  };

  return (
    <DetectChanges activeChanges={formHasChanges && !createdCompanyValid}>
      <PageSegment id="registration_page">
        <TitlePage>{texts!.registrationTitle}</TitlePage>
        <MaxWidthRegistration>
          <Form
            id="form-registration"
            buttonText={texts!.buttonRegistration}
            onSubmit={handleSubmitRegistration}
            onChange={handleChangesForm}
            isFetchToBlock
            iconName="BriefcaseIcon"
            isNewIcon
            marginTop={0}
            refProp={refForm}
            validation={[
              {
                placeholder: emailInput,
                isEmail: true,
              },
              {
                placeholder: nameCompanyInput,
                isString: true,
                minLength: 3,
              },
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
              {
                placeholder: phoneNumberInput,
                isNumber: true,
                minLength: 9,
              },
            ]}
          >
            <InputIcon
              placeholder={emailInput}
              type="email"
              iconName="AtSymbolIcon"
              validText={"Wymagane"}
              id="registration_company_email_input"
              uppercase
            />
            <InputIcon
              placeholder={nameCompanyInput}
              type="text"
              validText={texts!.min3Letter}
              iconName="IdentificationIcon"
              id="registration_company_name_input"
              uppercase
            />
            <InputIcon
              placeholder={nipInput}
              type="number"
              validText={"Opcjonalnie"}
              iconName="LibraryIcon"
              id="registration_company_nip_input"
            />
            <InputIcon
              placeholder={postalCodeInput}
              type="text"
              validText={texts!.min5Letter}
              iconName="MailIcon"
              id="registration_company_postal_code_input"
              uppercase
            />
            <InputIcon
              placeholder={cityInput}
              type="text"
              validText={texts!.min3Letter}
              iconName="HomeIcon"
              id="registration_company_city_input"
              uppercase
            />
            <InputIcon
              placeholder={districtInput}
              type="text"
              validText={texts!.min3Letter}
              iconName="OfficeBuildingIcon"
              id="registration_company_district_input"
              uppercase
            />
            <InputIcon
              placeholder={streetInput}
              type="text"
              validText={texts!.min3Letter}
              iconName="LocationMarkerIcon"
              id="registration_company_street_input"
              uppercase
            />
            <PhoneInput
              placeholder={phoneNumberInput}
              handleChangeCountry={handleChangeCountry}
              validText={texts!.min9Letter}
              id="registration_company_phone_input"
            />
            <StyleCheckRegulations>
              <Checkbox
                id="checkbox_accept_regulation_company"
                color="info"
                placeholder={checkboxAcceptRegulationInput}
              />
              <LinkEffect
                path="/terms-of-service"
                color="PRIMARY_DARK"
                underline
                marginBottom={0}
                marginTop={0}
                inNewWindow
              >
                {texts!.regulations}
              </LinkEffect>
            </StyleCheckRegulations>
          </Form>
        </MaxWidthRegistration>
      </PageSegment>
    </DetectChanges>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession({req: context.req});

  const contentRedirect = {
    props: {},
    redirect: {
      destination: "/",
      permament: false,
    },
  };

  if (!!!session) {
    return contentRedirect;
  }
  if (!!!session.user?.email) {
    return contentRedirect;
  }
  const userIsConfirmed: boolean = await checkUserAccountIsConfirmed({
    userEmail: session.user?.email,
  });

  if (!userIsConfirmed) {
    return contentRedirect;
  }

  return {
    props: {},
  };
};

export default withTranslates(withSiteProps(Home), "CompanyCreatePage");
