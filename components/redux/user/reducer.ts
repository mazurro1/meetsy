import type { UserProps, IUpdateUserProps } from "./state.model";
import * as siteActions from "./actions";

const initialState: UserProps = {
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

    case siteActions.UPDATE_USER_PROPS: {
      const updatedUserProps: any = { ...state.user };
      if (!!updatedUserProps) {
        if (!!action.userProps) {
          const valuesToChange: IUpdateUserProps[] = action.userProps;
          valuesToChange.forEach((item) => {
            if (!!updatedUserProps[item.field]) {
              updatedUserProps[item.field] = item.value;
            }
          });
        }
      }

      return {
        ...state,
        user: updatedUserProps,
      };
    }

    default:
      return state;
  }
};
