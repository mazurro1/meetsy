import type {CompanyWorkerProps} from "@/models/CompanyWorker/companyWorker.model";
import type {CompanyProps} from "@/models/Company/company.model";

export interface ICompanyProps {
  userCompanys?: CompanyWorkerProps[];
  selectedUserCompany?: CompanyWorkerProps | null;
  editedCompanyWorker?: null | CompanyWorkerProps;
  editedCompany?: null | CompanyProps;
}

export interface IUpdateCompanyProps {
  folder?: "phoneDetails" | "companyDetails" | "companyContact";
  field: string;
  value: string | null | number | Array<any> | object | boolean;
  companyId: string;
}
