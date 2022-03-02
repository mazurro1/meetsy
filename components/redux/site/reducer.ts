import {ISiteProps} from "./state.model";
import * as siteActions from "./actions";
import shortid from "shortid";
import type {AlertsProps} from "./state.model";

const initialState: ISiteProps = {
  siteProps: {
    blind: false,
    dark: false,
    language: "pl",
  },
  disableFetchActions: false,
  alerts: [],
  loadingVisible: false,
};

export const reducer = (state = initialState, action: any) => {
  switch (action.type) {
    case siteActions.UPDATE_DARK_MODE: {
      const newSiteProps = {...state.siteProps};
      newSiteProps.dark = action.darkMode;
      return {
        ...state,
        siteProps: newSiteProps,
      };
    }
    case siteActions.UPDATE_BLIND_MODE: {
      const newSiteProps = {...state.siteProps};
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
      const newSitePropsNewLanguage = {...state.siteProps};
      newSitePropsNewLanguage.language =
        newSitePropsNewLanguage.language === "pl" ? "en" : "pl";
      return {
        ...state,
        siteProps: newSitePropsNewLanguage,
      };
    }

    case siteActions.REMOVE_ALERT_ITEM: {
      const filterAlerts = state.alerts!.filter(
        (item) => item.id !== action.id
      );
      return {
        ...state,
        alerts: filterAlerts,
      };
    }

    case siteActions.ADD_ALERT_ITEM: {
      const allStateAlerts = !!state.alerts ? state.alerts : [];
      const findInAllerts = allStateAlerts.find(
        (item) => item.text === action.text
      );
      let newAlerts: AlertsProps[] = [];
      if (!!!findInAllerts) {
        const newAlertId = `${shortid.generate()}-${shortid.generate()}`;
        const newAlert: AlertsProps = {
          id: newAlertId,
          text: action.text,
          color: action.color,
          vibrate: false,
        };
        newAlerts = [...allStateAlerts, newAlert];
      } else {
        newAlerts = allStateAlerts.map((item) => {
          if (item.id === findInAllerts.id) {
            item.vibrate = true;
          }
          return item;
        });
      }
      return {
        ...state,
        alerts: newAlerts,
      };
    }

    case siteActions.CHANGE_ALERT_ITEM_VIBRATE: {
      const allStateAlerts = !!state.alerts ? [...state.alerts] : [];
      const findIndexInAllerts = allStateAlerts.findIndex(
        (item) => item.id === action.id
      );
      if (findIndexInAllerts >= 0) {
        allStateAlerts[findIndexInAllerts].vibrate = false;
      }
      return {
        ...state,
        alerts: allStateAlerts,
      };
    }

    case siteActions.CHANGE_LOADING_VISIBLE: {
      return {
        ...state,
        loadingVisible: !!action.value,
      };
    }

    default:
      return state;
  }
};
