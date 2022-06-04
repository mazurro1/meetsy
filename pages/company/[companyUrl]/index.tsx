import {NextPage} from "next";
import {GetServerSideProps} from "next";
import {getSession} from "next-auth/react";
import {FetchData} from "@ui";
import type {CompanyPropsShowName} from "@/models/Company/company.model";
import {CompanyPropsShowNameLive} from "@/models/Company/company.model";
import CompanyDetailsPage from "@/components/PageComponents/CompanyDetailsPage";

interface ShowCompanyProps {
  company: CompanyPropsShowName;
}

const ShowCompany: NextPage<ShowCompanyProps> = ({company = null}) => {
  return <CompanyDetailsPage company={company} />;
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const {params, req} = context;
  const session = await getSession({req: req});
  if (!!!session || !!!params?.companyUrl) {
    return {
      props: {...params},
      redirect: {
        destination: "/",
        permament: false,
      },
    };
  }

  const fetchedCompany = await FetchData({
    url: `${process.env.NEXTAUTH_URL}/api/user/companys`,
    method: "PUT",
    disabledLoader: true,
    ssr: true,
    async: true,
    data: {
      companyUrl: params.companyUrl,
    },
  });
  if (!!fetchedCompany?.success) {
    const resultData = CompanyPropsShowNameLive.nullable().safeParse(
      fetchedCompany?.data?.company
    );
    if (!resultData.success) {
      console.error("Invalid types in: ShowCompany", resultData);
    }
  }
  if (!!!fetchedCompany?.success || !!!fetchedCompany.data.company) {
    return {
      props: {...params},
      redirect: {
        destination: "/",
        permament: false,
      },
    };
  }

  return {
    props: {
      company: fetchedCompany.data.company,
    },
  };
};

export default ShowCompany;
