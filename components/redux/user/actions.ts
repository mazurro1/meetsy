import { Dispatch } from "redux";
import { IUserProps } from "./state.model";

export const UPDATE_USER = "UPDATE_USER";

export const updateUser =
  (userProps: IUserProps) => (dispatch: Dispatch<any>) => {
    return dispatch({ type: UPDATE_USER, userProps });
  };
