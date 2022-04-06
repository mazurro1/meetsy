import type {CompanyWorkerProps} from "@/models/CompanyWorker/companyWorker.model";

export interface ICompanyProps {
  userCompanys?: CompanyWorkerProps[];
  selectedUserCompany?: CompanyWorkerProps | null;
}

export interface IUpdateCompanyProps {
  folder?: string;
  field: string;
  value: string | null | number | Array<any> | object | boolean;
}
