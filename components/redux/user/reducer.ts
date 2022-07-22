import type {IUserProps, IUpdateUserProps} from "./state.model";
import * as siteActions from "./actions";
import type {AlertProps} from "@/models/Alert/alert.model";
import type {UserProps} from "@/models/User/user.model";

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
      let userAllActiveAlertsCount: number = !!state.userAlertsCount
        ? state.userAlertsCount
        : 0;
      const newUserAlerts: AlertProps[] = action.userAlerts;

      if (!!action.userAlerts) {
        if (!!userAllAlerts) {
          const alertsToSave: AlertProps[] = [];

          newUserAlerts.forEach((itemAlert) => {
            const isInOldAlerts = userAllAlerts?.some(
              (item) => item?._id === itemAlert?._id
            );
            if (!isInOldAlerts) {
              if (!!newUserAlerts && !!action.addActive) {
                userAllActiveAlertsCount = userAllActiveAlertsCount + 1;
              }
              alertsToSave.push(itemAlert);
            }
          });

          if (!!action.addActive) {
            userAllAlerts = [...alertsToSave, ...userAllAlerts];
          } else {
            userAllAlerts = [...userAllAlerts, ...alertsToSave];
          }
        } else {
          userAllAlerts = action.userAlerts;
          if (!!newUserAlerts && !!action.addActive) {
            userAllActiveAlertsCount =
              userAllActiveAlertsCount + newUserAlerts.length;
          }
        }
      }

      return {
        ...state,
        userAlerts: userAllAlerts,
        userAlertsCount: userAllActiveAlertsCount,
      };
    }

    case siteActions.UPDATE_USER_PROPS: {
      const updatedUserProps: UserProps = !!state.user ? {...state.user} : null;
      if (!!updatedUserProps) {
        if (!!action.userProps) {
          const valuesToChange: IUpdateUserProps[] = action.userProps;
          valuesToChange?.forEach((item) => {
            if (typeof item.value !== "undefined") {
              if (!!item.folder) {
                // @ts-ignore
                if (!!updatedUserProps[item.folder]) {
                  if (
                    // @ts-ignore
                    typeof updatedUserProps[item.folder][item.field] !==
                    "undefined"
                  ) {
                    // @ts-ignore
                    updatedUserProps[item.folder][item.field] = item.value;
                  }
                }
              } else if (!!item.field) {
                // @ts-ignore
                if (typeof updatedUserProps[item.field] !== "undefined") {
                  // @ts-ignore
                  updatedUserProps[item.field] = item.value;
                }
              }
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
