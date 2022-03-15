import {Dispatch} from "redux";
import {IUserProps, IUpdateUserProps} from "./state.model";
import type {AlertProps} from "@/models/Alert/alert.model";

export const UPDATE_USER = "UPDATE_USER";
export const UPDATE_USER_ALERTS_COUNT = "UPDATE_USER_ALERTS_COUNT";
export const UPDATE_USER_PROPS = "UPDATE_USER_PROPS";
export const UPDATE_USER_ALERTS = "UPDATE_USER_ALERTS";
export const UPDATE_USER_ALERTS_ACTIVE = "UPDATE_USER_ALERTS_ACTIVE";

export const updateUser =
  (userProps: IUserProps) => (dispatch: Dispatch<any>) => {
    return dispatch({type: UPDATE_USER, userProps});
  };

export const updateUserAlertsCount =
  (userAlertsCount: number) => (dispatch: Dispatch<any>) => {
    return dispatch({type: UPDATE_USER_ALERTS_COUNT, userAlertsCount});
  };

export const updateUserAlertsActive = () => (dispatch: Dispatch<any>) => {
  return dispatch({type: UPDATE_USER_ALERTS_ACTIVE});
};
export const updateUserAlerts =
  (userAlerts: AlertProps[]) => (dispatch: Dispatch<any>) => {
    return dispatch({type: UPDATE_USER_ALERTS, userAlerts});
  };

export const updateUserProps =
  (userProps: IUpdateUserProps[]) => (dispatch: Dispatch<any>) => {
    return dispatch({type: UPDATE_USER_PROPS, userProps});
  };
