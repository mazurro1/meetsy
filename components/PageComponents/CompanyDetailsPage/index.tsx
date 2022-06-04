import {NextPage} from "next";
import type {CompanyPropsShowName} from "@/models/Company/company.model";
import {TitlePage} from "@ui";

interface ShowCompanyProps {
  company: CompanyPropsShowName;
}

const CompanyDetailsPage: NextPage<ShowCompanyProps> = ({company = null}) => {
  return (
    <div>
      <TitlePage>{company?.companyDetails.name}</TitlePage>
    </div>
  );
};

export default CompanyDetailsPage;
