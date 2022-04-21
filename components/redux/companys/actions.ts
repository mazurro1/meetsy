import {Dispatch} from "redux";
import {IUpdateCompanyProps} from "./state.model";
import type {CompanyProps} from "@/models/Company/company.model";
import {CompanyWorkerProps} from "@/models/CompanyWorker/companyWorker.model";

export const UPDATE_COMPANYS = "UPDATE_COMPANYS";
export const UPDATE_SELECTED_COMPANYS = "UPDATE_SELECTED_COMPANYS";
export const UPDATE_ALL_COMPANYS_PROPS = "UPDATE_ALL_COMPANYs_PROPS";
export const UPDATE_COMPANY_EDIT = "UPDATE_COMPANY_EDIT";

export const updateCompany =
  (userCompanys: CompanyWorkerProps[]) => (dispatch: Dispatch<any>) => {
    return dispatch({type: UPDATE_COMPANYS, userCompanys});
  };

export const updateSelectedUserCompany =
  (selectedCompany: string | number) => (dispatch: Dispatch<any>) => {
    return dispatch({type: UPDATE_SELECTED_COMPANYS, selectedCompany});
  };

export const updateAllCompanysProps =
  (companyProps: IUpdateCompanyProps[]) => (dispatch: Dispatch<any>) => {
    return dispatch({type: UPDATE_ALL_COMPANYS_PROPS, companyProps});
  };

export const updateEditCompany =
  (companyProps: CompanyProps, companyWorkerProps: CompanyWorkerProps) =>
  (dispatch: Dispatch<any>) => {
    return dispatch({
      type: UPDATE_COMPANY_EDIT,
      companyProps,
      companyWorkerProps,
    });
  };
