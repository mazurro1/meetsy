import type {IUserProps, IUpdateUserProps} from "./state.model";
import * as siteActions from "./actions";

const initialState: IUserProps = {
  user: null,
};

export const reducer = (state = initialState, action: any) => {
  switch (action.type) {
    case siteActions.UPDATE_USER: {
      if (!!action.userProps) {
        if (!!action.userProps.phoneDetails) {
          if (!!action.userProps.phoneDetails.dateSendAgainSMS) {
            action.userProps.phoneDetails.dateSendAgainSMS = new Date(
              action.userProps.phoneDetails.dateSendAgainSMS
            );
          }
        }
      }
      return {
        ...state,
        user: action.userProps,
      };
    }

    case siteActions.UPDATE_USER_PROPS: {
      const updatedUserProps: any = {...state.user};
      if (!!updatedUserProps) {
        if (!!action.userProps) {
          const valuesToChange: IUpdateUserProps[] = action.userProps;
          valuesToChange.forEach((item) => {
            if (!!item.folder) {
              updatedUserProps[item.folder][item.field] = item.value;
            } else if (!!updatedUserProps[item.field]) {
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
