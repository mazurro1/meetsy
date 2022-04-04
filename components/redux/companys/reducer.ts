import type {ICompanyProps, IUpdateCompanyProps} from "./state.model";
import * as siteActions from "./actions";

const initialState: ICompanyProps = {
  userCompanys: [],
};

export const reducer = (state = initialState, action: any) => {
  switch (action.type) {
    case siteActions.UPDATE_COMPANYS: {
      let userCompanysUpdated = [];
      if (!!action.userCompanys) {
        userCompanysUpdated = action.userCompanys;
      }
      return {
        ...state,
        userCompanys: userCompanysUpdated,
      };
    }

    // case siteActions.UPDATE_USER_PROPS: {
    //   const updatedUserProps: any = {...state.user};
    //   if (!!updatedUserProps) {
    //     if (!!action.userProps) {
    //       const valuesToChange: IUpdateCompanyProps[] = action.userProps;
    //       valuesToChange.forEach((item) => {
    //         if (!!item.folder) {
    //           updatedUserProps[item.folder][item.field] = item.value;
    //         } else if (!!updatedUserProps[item.field]) {
    //           updatedUserProps[item.field] = item.value;
    //         }
    //       });
    //     }
    //   }
    //   return {
    //     ...state,
    //     user: updatedUserProps,
    //   };
    // }

    default:
      return state;
  }
};
