import type {IUserProps, IUpdateUserProps} from "./state.model";
import * as siteActions from "./actions";

const initialState: IUserProps = {
  user: null,
  userAlertsCount: 0,
  userAlerts: null,
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

    case siteActions.UPDATE_USER_ALERTS_COUNT: {
      return {
        ...state,
        userAlertsCount: !!action.userAlertsCount ? action.userAlertsCount : 0,
      };
    }

    case siteActions.UPDATE_USER_ALERTS_ACTIVE: {
      let userAllAlerts = state.userAlerts;
      if (!!userAllAlerts) {
        userAllAlerts = userAllAlerts.map((item) => {
          if (!!item) {
            item.active = false;
          }
          return item;
        });
      }
      return {
        ...state,
      };
    }

    case siteActions.UPDATE_USER_ALERTS: {
      let userAllAlerts = state.userAlerts;
      if (!!action.userAlerts) {
        if (!!userAllAlerts) {
          userAllAlerts = [...userAllAlerts, ...action.userAlerts];
        } else {
          userAllAlerts = action.userAlerts;
        }
      }

      return {
        ...state,
        userAlerts: userAllAlerts,
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
