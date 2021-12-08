import { ISiteProps } from "./state.model";
import * as siteActions from "./actions";
import shortid from "shortid";

const initialState: ISiteProps = {
  siteProps: {
    blind: false,
    dark: false,
    language: "pl",
  },
  disableFetchActions: false,
  alerts: [],
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
    case siteActions.UPDATE_BLIND_MODE: {
      const newSiteProps = { ...state.siteProps };
      newSiteProps.blind = action.blindMode;
      return {
        ...state,
        siteProps: newSiteProps,
      };
    }
    case siteActions.UPDATE_DISABLED_FETCH_ACTIONS: {
      return {
        ...state,
        disableFetchActions: action.disabled,
      };
    }

    case siteActions.UPDATE_LANGUAGE_SITE: {
      const newSitePropsNewLanguage = { ...state.siteProps };
      newSitePropsNewLanguage.language =
        newSitePropsNewLanguage.language === "pl" ? "en" : "pl";
      return {
        ...state,
        siteProps: newSitePropsNewLanguage,
      };
    }

    case siteActions.REMOVE_ALERT_ITEM: {
      const filterAlerts = state.alerts.filter((item) => item.id !== action.id);
      return {
        ...state,
        alerts: filterAlerts,
      };
    }

    case siteActions.ADD_ALERT_ITEM: {
      const newAlertId = `${shortid.generate()}-${shortid.generate()}`;
      const newAlert = {
        id: newAlertId,
        text: action.text,
        color: action.color,
      };
      const newAlerts = [...state.alerts, newAlert];
      return {
        ...state,
        alerts: newAlerts,
      };
    }

    default:
      return state;
  }
};
