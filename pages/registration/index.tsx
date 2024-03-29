import {NextPage} from "next";
import {
  PageSegment,
  Checkbox,
  Form,
  InputIcon,
  ButtonIcon,
  TitlePage,
  PhoneInput,
  LinkEffect,
  DetectChanges,
} from "@ui";
import type {FormElementsOnSubmit} from "@ui";
import {signIn, getSession} from "next-auth/react";
import {GetServerSideProps} from "next";
import {addAlertItem} from "@/redux/site/actions";
import {withSiteProps, withTranslates} from "@hooks";
import type {ISiteProps, ITranslatesProps} from "@hooks";
import {useState, useRef, useEffect} from "react";
import {
  MaxWidthRegistration,
  PositionSocialButtons,
  StyleCheckRegulations,
} from "@/components/PageComponents/RegistrationPage/registration.style";
import {detectChangesForm} from "@functions";

const Home: NextPage<ISiteProps & ITranslatesProps> = ({
  texts,
  dispatch,
  router,
}) => {
  const [phoneRegionalCode, setPhoneRegionalCode] = useState<number | null>(
    null
  );
  const [formHasChanges, setFormHasChanges] = useState<boolean>(false);
  const refForm = useRef<HTMLFormElement>(null);

  const handleSubmitRegistration = (
    values: FormElementsOnSubmit[],
    isValid: boolean
  ) => {
    if (isValid) {
      const findEmail = values.find(
        (item) => item.placeholder === texts!.inputEmail
      );
      const findPassword = values.find(
        (item) => item.placeholder === texts!.inputPassword
      );
      const findRepeatPassword = values.find(
        (item) => item.placeholder === texts!.inputRepeatPassword
      );
      const findName = values.find(
        (item) => item.placeholder === texts!.inputName
      );
      const findSurname = values.find(
        (item) => item.placeholder === texts!.inputSurname
      );
      const findPhone = values.find(
        (item) => item.placeholder === texts!.inputPhoneNumber
      );
      const findCheckRegulation = values.find(
        (item) => item.placeholder === texts!.checkboxAcceptRegulation
      );

      if (
        !!findEmail &&
        !!findPassword &&
        !!findRepeatPassword &&
        !!findName &&
        !!findSurname &&
        !!findPhone &&
        !!phoneRegionalCode &&
        !!findCheckRegulation
      ) {
        if (!!findCheckRegulation.value) {
          if (findPassword.value === findRepeatPassword.value) {
            signIn("credentials", {
              redirect: false,
              email: findEmail.value,
              password: findPassword.value,
              name: findName.value,
              surname: findSurname.value,
              phone: findPhone.value,
              phoneRegionalCode: phoneRegionalCode,
              type: "registration",
            }).then((data) => {
              const dataToValid: any = data;
              if (!!dataToValid) {
                if (!!dataToValid.error) {
                  if (dataToValid.error === "Email busy!") {
                    dispatch!(addAlertItem(texts!.emailBussy, "RED"));
                  } else {
                    dispatch!(addAlertItem(texts!.errorRegistration, "RED"));
                  }
                } else {
                  router?.replace("/");
                }
              }
            });
          } else {
            dispatch!(addAlertItem(texts!.passwordMustBeTheSame, "RED"));
          }
        } else {
          dispatch!(addAlertItem(texts!.warningAcceptRegulation, "RED"));
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
    <DetectChanges activeChanges={formHasChanges}>
      <PageSegment id="registration_page">
        <TitlePage>{texts!.registrationTitle}</TitlePage>
        <MaxWidthRegistration>
          <Form
            id="form-registration"
            buttonText={texts!.buttonRegistration}
            onSubmit={handleSubmitRegistration}
            onChange={handleChangesForm}
            isFetchToBlock
            iconName="UserAddIcon"
            marginTop={0}
            refProp={refForm}
            validation={[
              {
                placeholder: texts!.inputEmail,
                isEmail: true,
              },
              {
                placeholder: texts!.inputName,
                isString: true,
                minLength: 3,
              },
              {
                placeholder: texts!.inputSurname,
                isString: true,
                minLength: 3,
              },
              {
                placeholder: texts!.inputRepeatPassword,
                isString: true,
                minLength: 6,
              },
              {
                placeholder: texts!.inputPassword,
                isString: true,
                minLength: 6,
              },
              {
                placeholder: texts!.inputPhoneNumber,
                isNumber: true,
                minLength: 9,
              },
            ]}
          >
            <InputIcon
              placeholder={texts!.inputEmail}
              type="email"
              iconName="AtSymbolIcon"
              id="registration_email_input"
            />
            <InputIcon
              placeholder={texts!.inputName}
              type="text"
              validText={texts!.min3Letter}
              iconName="UserIcon"
              id="registration_name_input"
            />
            <InputIcon
              placeholder={texts!.inputSurname}
              type="text"
              validText={texts!.min3Letter}
              iconName="UserIcon"
              id="registration_surname_input"
            />
            <PhoneInput
              placeholder={texts!.inputPhoneNumber}
              handleChangeCountry={handleChangeCountry}
              validText={texts!.min9Letter}
              id="registration_phone_input"
            />
            <InputIcon
              placeholder={texts!.inputPassword}
              type="password"
              validText={texts!.minLetter}
              iconName="LockClosedIcon"
              id="registration_password_input"
            />
            <InputIcon
              placeholder={texts!.inputRepeatPassword}
              type="password"
              validText={texts!.minLetter}
              iconName="LockClosedIcon"
              id="registration_repeat_password_input"
            />
            <StyleCheckRegulations>
              <Checkbox
                id="checkbox_accept_regulation"
                color="info"
                placeholder={texts!.checkboxAcceptRegulation}
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
        <PositionSocialButtons>
          <div className="mb-10">
            <ButtonIcon
              id="registration-facebook"
              onClick={() => signIn("facebook")}
              iconName="LockOpenIcon"
              color="GREY"
            >
              {texts!.registrationFacebook}
            </ButtonIcon>
          </div>
          <div>
            <ButtonIcon
              id="registration-google"
              onClick={() => signIn("google")}
              iconName="LockOpenIcon"
              color="GREY"
            >
              {texts!.registrationGoogle}
            </ButtonIcon>
          </div>
        </PositionSocialButtons>
      </PageSegment>
    </DetectChanges>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession({req: context.req});
  if (!!session) {
    return {
      props: {},
      redirect: {
        destination: "/",
        permament: false,
      },
    };
  }
  return {
    props: {},
  };
};

export default withTranslates(withSiteProps(Home), "RegistrationPage");
