import { SearchCompanyProps } from "./state.model";
import * as siteActions from "./actions";

const initialState: SearchCompanyProps = {
  selectedIndustries: -1,
  searchCompanyName: "",
  selectedCity: "",
  selectedDistrict: "",
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

    case siteActions.UPDATE_CITY: {
      return {
        ...state,
        selectedCity: action.city,
        selectedDistrict: action.district,
      };
    }

    default:
      return state;
  }
};
