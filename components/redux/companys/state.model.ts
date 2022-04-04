import type {CompanyWorkerProps} from "@/models/CompanyWorker/companyWorker.model";

export interface ICompanyProps {
  userCompanys?: CompanyWorkerProps[];
}

export interface IUpdateCompanyProps {
  companyId: string;
  folder?: string;
  field: string;
  value: string | null | number | Array<any> | object | boolean;
}
