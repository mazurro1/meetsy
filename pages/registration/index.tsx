import { NextPage } from "next";
import { PageSegment } from "@ui";
import { signIn, getSession } from "next-auth/react";
import { GetServerSideProps } from "next";
import { addAlertItem } from "@/redux/site/actions";
import { Form, InputIcon, ButtonIcon, TitlePage } from "@ui";
import type { FormElementsOnSubmit } from "@ui";
import styled from "styled-components";
import { withSiteProps, withTranslates } from "@hooks";
import type { ISiteProps, ITranslatesProps } from "@hooks";

const MaxWidthRegistration = styled.div`
  max-width: 600px;
  margin: 0 auto;
`;

const PositionSocialButtons = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: center;
`;

const Home: NextPage<ISiteProps & ITranslatesProps> = ({
  texts,
  dispatch,
  router,
}) => {
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

      if (
        !!findEmail &&
        !!findPassword &&
        !!findRepeatPassword &&
        !!findName &&
        !!findSurname
      ) {
        if (findPassword.value === findRepeatPassword.value) {
          signIn("credentials", {
            redirect: false,
            email: findEmail.value,
            password: findPassword.value,
            name: findName.value,
            surname: findSurname.value,
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
      }
    }
  };

  return (
    <PageSegment id="registration_page">
      <TitlePage>{texts!.registrationTitle}</TitlePage>
      <MaxWidthRegistration>
        <Form
          id="form-registration"
          buttonText={texts!.buttonRegistration}
          onSubmit={handleSubmitRegistration}
          isFetchToBlock
          iconName="UserAddIcon"
          marginTop={0}
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
          ]}
        >
          <InputIcon placeholder={texts!.inputEmail} type="email" />
          <InputIcon
            placeholder={texts!.inputName}
            type="text"
            validText={texts!.min3Letter}
          />
          <InputIcon
            placeholder={texts!.inputSurname}
            type="text"
            validText={texts!.min3Letter}
          />
          <InputIcon
            placeholder={texts!.inputPassword}
            type="password"
            validText={texts!.minLetter}
          />
          <InputIcon
            placeholder={texts!.inputRepeatPassword}
            type="password"
            validText={texts!.minLetter}
          />
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
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession({ req: context.req });
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
