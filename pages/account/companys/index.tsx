import {NextPage} from "next";
import {PageSegment, TitlePage} from "@ui";
import {withSiteProps, withTranslates} from "@hooks";
import type {ISiteProps, ITranslatesProps} from "@hooks";
import {getSession} from "next-auth/react";
import {GetServerSideProps} from "next";

const CompanyPage: NextPage<ISiteProps & ITranslatesProps> = ({
  siteProps,
  texts,
  session,
  dispatch,
  user,
}) => {
  return (
    <PageSegment id="company_page">
      <TitlePage>Firmy</TitlePage>
      asdasd
    </PageSegment>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession({req: context.req});
  if (!!!session) {
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

export default withTranslates(withSiteProps(CompanyPage), "HomePage");
