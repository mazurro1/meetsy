import {NextPage} from "next";
import {PageSegment, TitlePage, FetchData} from "@ui";
import {withSiteProps, withTranslates} from "@hooks";
import type {ISiteProps, ITranslatesProps} from "@hooks";
import {getSession} from "next-auth/react";
import {GetServerSideProps} from "next";
import {useEffect} from "react";
import {addAlertItem} from "@/redux/site/actions";

const CompanyPage: NextPage<ISiteProps & ITranslatesProps> = ({
  siteProps,
  texts,
  session,
  dispatch,
  user,
}) => {
  useEffect(() => {
    FetchData({
      url: "/api/companys",
      method: "GET",
      dispatch: dispatch,
      language: siteProps?.language,
      disabledLoader: false,
      callback: (data) => {
        if (data.success) {
          console.log(data.data);
        } else {
          dispatch!(addAlertItem("Błąd podczas pobierania firm", "RED"));
        }
      },
    });
  }, []);

  return (
    <PageSegment id="company_page">
      <TitlePage color="SECOND">Firmy</TitlePage>
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
