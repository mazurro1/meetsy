import { Dispatch } from "redux";

export const UPDATE_INDUSTRIES = "UPDATE_INDUSTRIES";
export const UPDATE_SEARCH_COMPANY_NAME = "UPDATE_SEARCH_COMPANY_NAME";
export const UPDATE_CITY = "UPDATE_CITY";
export const UPDATE_SERVICE = "UPDATE_SERVICE";

export const updateIndustries =
  (value: number) => (dispatch: Dispatch<any>) => {
    return dispatch({ type: UPDATE_INDUSTRIES, value });
  };

export const updateSearchCompanyName =
  (value: string) => (dispatch: Dispatch<any>) => {
    return dispatch({ type: UPDATE_SEARCH_COMPANY_NAME, value });
  };

export const updateCity =
  (city: string, district: string) => (dispatch: Dispatch<any>) => {
    return dispatch({ type: UPDATE_CITY, city, district });
  };

export const updateService = (value: string) => (dispatch: Dispatch<any>) => {
  return dispatch({ type: UPDATE_SERVICE, value });
};
