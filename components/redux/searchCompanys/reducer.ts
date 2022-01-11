import { SearchCompanyProps } from "./state.model";
import * as siteActions from "./actions";

const initialState: SearchCompanyProps = {
  selectedIndustries: -1,
  searchCompanyName: "",
};

export const reducer = (state = initialState, action: any) => {
  switch (action.type) {
    case siteActions.UPDATE_INDUSTRIES: {
      return {
        ...state,
        selectedIndustries: action.value,
      };
    }

    case siteActions.UPDATE_SEARCH_COMPANY_NAME: {
      return {
        ...state,
        searchCompanyName: action.value,
      };
    }

    default:
      return state;
  }
};
