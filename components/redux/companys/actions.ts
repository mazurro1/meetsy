import {Dispatch} from "redux";
import {ICompanyProps} from "./state.model";

export const UPDATE_COMPANYS = "UPDATE_COMPANYS";

export const updateCompany =
  (userCompanys: ICompanyProps[]) => (dispatch: Dispatch<any>) => {
    return dispatch({type: UPDATE_COMPANYS, userCompanys});
  };
