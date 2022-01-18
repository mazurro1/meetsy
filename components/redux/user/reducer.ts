import { IUserProps } from "./state.model";
import * as siteActions from "./actions";

const initialState: IUserProps = {
  user: null,
};

export const reducer = (state = initialState, action: any) => {
  switch (action.type) {
    case siteActions.UPDATE_USER: {
      return {
        ...state,
        user: action.userProps,
      };
    }

    default:
      return state;
  }
};
