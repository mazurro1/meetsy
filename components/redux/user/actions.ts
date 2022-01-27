import { Dispatch } from "redux";
import { UserProps, IUpdateUserProps } from "./state.model";

export const UPDATE_USER = "UPDATE_USER";
export const UPDATE_USER_PROPS = "UPDATE_USER_PROPS";

export const updateUser =
  (userProps: UserProps) => (dispatch: Dispatch<any>) => {
    return dispatch({ type: UPDATE_USER, userProps });
  };

export const updateUserProps =
  (userProps: IUpdateUserProps[]) => (dispatch: Dispatch<any>) => {
    return dispatch({ type: UPDATE_USER_PROPS, userProps });
  };
