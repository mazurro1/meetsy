import { Dispatch } from "redux";

export const UPDATE_DARK_MODE = "UPDATE_DARK_MODE";
export const UPDATE_BLIND_MODE = "UPDATE_BLIND_MODE";
export const UPDATE_DISABLED_FETCH_ACTIONS = "UPDATE_DISABLED_FETCH_ACTIONS";

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
