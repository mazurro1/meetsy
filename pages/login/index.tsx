import { NextPage } from "next";
import { PageSegment } from "@ui";
import { withSiteProps, withTranslates } from "@hooks";
import type { ISiteProps, ITranslatesProps } from "@hooks";
import { signIn, signOut, getSession } from "next-auth/react";
import { GetStaticProps, GetStaticPaths, GetServerSideProps } from "next";

const Home: NextPage<ISiteProps & ITranslatesProps> = ({
  siteProps,
  texts,
}) => {
  const handleLogin = async (
    email: string,
    password: string,
    name: string,
    surname: string
  ) => {
    signIn("credentials", {
      redirect: false, // jeżeli będzie true to podczas nieudanej próby logowania się zostaniemy przekierowani na stronę 404.js
      email: email,
      password: password,
      name: name,
      surname: surname,
    });
  };

  return (
    <PageSegment id="login_page">
      <button onClick={() => signIn("google")}>google sign</button>
      <button onClick={() => signIn("facebook")}>facebook sign</button>
      <button
        onClick={() =>
          handleLogin("mazul961.hm@gmail.com", "12345ad", "Hubert", "Mazur")
        }
      >
        Login
      </button>
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

export default withTranslates(withSiteProps(Home), "LoginPage");
