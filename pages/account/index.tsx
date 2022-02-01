import { NextPage } from "next";
import { withSiteProps, withTranslates } from "@hooks";
import type { ISiteProps, ITranslatesProps } from "@hooks";
import { PageSegment } from "@ui";
import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";

const Home: NextPage<ISiteProps & ITranslatesProps> = ({}) => {
  return (
    <PageSegment id="account_page" maxWidth={400} paddingTop={2}>
      account_page
    </PageSegment>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession({ req: context.req });
  if (!session) {
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

export default withTranslates(withSiteProps(Home), "AccountPage");
