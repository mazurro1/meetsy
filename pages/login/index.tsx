import {NextPage} from "next";
import {PageSegment} from "@ui";
import {signIn, getSession, signOut} from "next-auth/react";
import {GetServerSideProps} from "next";
import {addAlertItem} from "@/redux/site/actions";
import {Form, InputIcon, ButtonIcon, TitlePage} from "@ui";
import type {FormElementsOnSubmit} from "@ui";
import styled from "styled-components";
import {withSiteProps, withTranslates, withUserProps} from "@hooks";
import type {ISiteProps, ITranslatesProps, IWithUserProps} from "@hooks";
import {useState} from "react";
import RecoverAccountUser from "@/components/PageComponents/AccountPage/RecoverAccountUser";
import ConfirmRecoverAccountUser from "@/components/PageComponents/AccountPage/ConfirmRecoverAccountUser";

const MaxWidthLogin = styled.div`
  max-width: 600px;
  margin: 0 auto;
`;

const PositionSocialButtons = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: center;
`;

const Home: NextPage<ISiteProps & ITranslatesProps & IWithUserProps> = ({
  texts,
  dispatch,
  router,
  session,
}) => {
  const [showRecoverAccountUser, setShowRecoverAccountUser] =
    useState<boolean>(false);
  const [showConfirmRecoverAccountUser, setShowConfirmRecoverAccountUser] =
    useState<boolean>(false);
  const [emailConfirmRecoverAccountSend, setEmailConfirmRecoverAccountSend] =
    useState<string>("");

  const handleSubmitLogin = (
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
      if (!!findEmail && !!findPassword) {
        signIn("credentials", {
          redirect: false,
          email: findEmail.value,
          password: findPassword.value,
          type: "login",
        }).then((data) => {
          console.log("credentials login", data);
          const dataToValid: any = data;
          if (!!dataToValid) {
            if (!!dataToValid.error) {
              dispatch!(addAlertItem(texts!.errorLogin, "RED"));
              if (!!session) {
                signOut();
              }
            } else {
              router?.replace("/");
            }
          }
        });
      }
    }
  };

  const handleShowRecoverAccountUser = () => {
    setShowRecoverAccountUser((prevState) => !prevState);
  };

  const handleShowConfirmRecoverAccountUser = () => {
    setShowConfirmRecoverAccountUser((prevState) => !prevState);
  };

  const handleEmailConfirmRecoverAccountSend = (value: string) => {
    setEmailConfirmRecoverAccountSend(value);
  };

  return (
    <PageSegment id="login_page">
      <TitlePage>{texts!.loginTitle}</TitlePage>
      <MaxWidthLogin>
        <Form
          id="form-login"
          buttonText={texts!.buttonLogin}
          onSubmit={handleSubmitLogin}
          isFetchToBlock
          iconName="UserIcon"
          validation={[
            {
              placeholder: texts!.inputEmail,
              isEmail: true,
            },
            {
              placeholder: texts!.inputPassword,
              isString: true,
              minLength: 6,
            },
          ]}
        >
          <InputIcon
            placeholder={texts!.inputEmail}
            type="email"
            iconName="AtSymbolIcon"
            id="login_email_input"
          />
          <InputIcon
            placeholder={texts!.inputPassword}
            type="password"
            validText={texts!.minLetter}
            iconName="LockClosedIcon"
            id="login_password_input"
          />
        </Form>
      </MaxWidthLogin>
      <PositionSocialButtons>
        <div className="mb-10">
          <ButtonIcon
            id="login-facebook"
            onClick={() => signIn("facebook")}
            iconName="LockOpenIcon"
            color="GREY"
          >
            {texts!.loginFacebook}
          </ButtonIcon>
        </div>
        <div className="mb-10">
          <ButtonIcon
            id="login-google"
            onClick={() => signIn("google")}
            iconName="LockOpenIcon"
            color="GREY"
          >
            {texts!.loginGoogle}
          </ButtonIcon>
        </div>

        {!!emailConfirmRecoverAccountSend ? (
          <div className="mb-10">
            <ButtonIcon
              id="confirm_recover_account_button"
              onClick={handleShowConfirmRecoverAccountUser}
              iconName="LockClosedIcon"
              color="SECOND"
            >
              {texts!.confirmRecoverAccount}
            </ButtonIcon>
          </div>
        ) : (
          <div className="mb-10">
            <ButtonIcon
              id="recover_account_button"
              onClick={handleShowRecoverAccountUser}
              iconName="LockClosedIcon"
              color="RED"
            >
              {texts!.recoverAccount}
            </ButtonIcon>
          </div>
        )}
      </PositionSocialButtons>
      <RecoverAccountUser
        handleShowRecoverAccountUser={handleShowRecoverAccountUser}
        showRecoverAccountUser={showRecoverAccountUser}
        handleShowConfirmRecoverAccountUser={
          handleShowConfirmRecoverAccountUser
        }
        handleEmailConfirmRecoverAccountSend={
          handleEmailConfirmRecoverAccountSend
        }
      />
      <ConfirmRecoverAccountUser
        handleShowConfirmRecoverAccountUser={
          handleShowConfirmRecoverAccountUser
        }
        showConfirmRecoverAccountUser={showConfirmRecoverAccountUser}
        emailConfirmRecoverAccountSend={emailConfirmRecoverAccountSend}
        handleEmailConfirmRecoverAccountSend={
          handleEmailConfirmRecoverAccountSend
        }
      />
    </PageSegment>
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

export default withTranslates(withSiteProps(withUserProps(Home)), "LoginPage");
