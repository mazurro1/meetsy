import { ISiteProps } from "./state.model";
import * as siteActions from "./actions";

const initialState: ISiteProps = {
  siteProps: {
    blind: false,
    dark: false,
    language: "pl",
  },
};

export const reducer = (state = initialState, action: any) => {
  switch (action.type) {
    case siteActions.UPDATE_DARK_MODE: {
      const newSiteProps = { ...state.siteProps };
      newSiteProps.dark = action.darkMode;
      return {
        ...state,
        siteProps: newSiteProps,
      };
    }
    default:
      return state;
  }
};
