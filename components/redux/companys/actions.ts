import {Dispatch} from "redux";
import {ICompanyProps, IUpdateCompanyProps} from "./state.model";

export const UPDATE_COMPANYS = "UPDATE_COMPANYS";
export const UPDATE_SELECTED_COMPANYS = "UPDATE_SELECTED_COMPANYS";
export const UPDATE_COMPANY_SELECTED_PROPS = "UPDATE_COMPANY_SELECTED_PROPS";

export const updateCompany =
  (userCompanys: ICompanyProps[]) => (dispatch: Dispatch<any>) => {
    return dispatch({type: UPDATE_COMPANYS, userCompanys});
  };

export const updateSelectedUserCompany =
  (selectedCompany: string | number) => (dispatch: Dispatch<any>) => {
    return dispatch({type: UPDATE_SELECTED_COMPANYS, selectedCompany});
  };

export const updateCompanySelectedProps =
  (companyProps: IUpdateCompanyProps[]) => (dispatch: Dispatch<any>) => {
    return dispatch({type: UPDATE_COMPANY_SELECTED_PROPS, companyProps});
  };
