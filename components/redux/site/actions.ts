import { Dispatch } from "redux";

export const UPDATE_DARK_MODE = "UPDATE_DARK_MODE";
export const UPDATE_BLIND_MODE = "UPDATE_BLIND_MODE";
export const UPDATE_DISABLED_FETCH_ACTIONS = "UPDATE_DISABLED_FETCH_ACTIONS";
export const UPDATE_LANGUAGE_SITE = "UPDATE_LANGUAGE_SITE";
export const REMOVE_ALERT_ITEM = "REMOVE_ALERT_ITEM";
export const ADD_ALERT_ITEM = "ADD_ALERT_ITEM";

export const updateDarkMode =
  (darkMode: boolean) => (dispatch: Dispatch<any>) => {
    return dispatch({ type: UPDATE_DARK_MODE, darkMode });
  };

export const updateBlindMode =
  (blindMode: boolean) => (dispatch: Dispatch<any>) => {
    return dispatch({ type: UPDATE_BLIND_MODE, blindMode });
  };

export const updateDisabledFetchActions =
  (disabled: boolean) => (dispatch: Dispatch<any>) => {
    return dispatch({ type: UPDATE_DISABLED_FETCH_ACTIONS, disabled });
  };

export const updateLanguageSite = () => (dispatch: Dispatch<any>) => {
  return dispatch({ type: UPDATE_LANGUAGE_SITE });
};

export const removeAlertItem = (id: number) => (dispatch: Dispatch<any>) => {
  return dispatch({ type: REMOVE_ALERT_ITEM, id });
};

export const addAlertItem =
  (
    text: string = "",
    color: "PRIMARY" | "SECOND" | "RED" | "GREEN" | "GREY" = "PRIMARY"
  ) =>
  (dispatch: Dispatch<any>) => {
    return dispatch({ type: ADD_ALERT_ITEM, text, color });
  };
