import type {ICompanyProps, IUpdateCompanyProps} from "./state.model";
import * as siteActions from "./actions";
import type {CompanyWorkerProps} from "@/models/CompanyWorker/companyWorker.model";

const initialState: ICompanyProps = {
  userCompanys: [],
  selectedUserCompany: null,
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

    case siteActions.UPDATE_SELECTED_COMPANYS: {
      let newSelectedCompany = state.selectedUserCompany;
      if (!!action.selectedCompany) {
        const findCompany = state.userCompanys?.find((item) => {
          if (typeof item.companyId !== "string") {
            return item.companyId?._id === action.selectedCompany;
          } else {
            return false;
          }
        });
        if (!!findCompany) {
          newSelectedCompany = findCompany;
        }
      }
      return {
        ...state,
        selectedUserCompany: newSelectedCompany,
      };
    }

    case siteActions.UPDATE_COMPANY_SELECTED_PROPS: {
      const updatedCompanyProps: any = !!state.selectedUserCompany
        ? {
            ...state.selectedUserCompany,
          }
        : null;
      if (!!updatedCompanyProps) {
        if (typeof updatedCompanyProps.companyId !== "string") {
          if (!!action.companyProps) {
            const valuesToChange: IUpdateCompanyProps[] = action.companyProps;
            valuesToChange.forEach((item) => {
              if (!!item.folder) {
                updatedCompanyProps.companyId[item.folder][item.field] =
                  item.value;
              } else if (!!updatedCompanyProps.companyId[item.field]) {
                updatedCompanyProps.companyId[item.field] = item.value;
              }
            });
          }
        }
      }
      return {
        ...state,
        user: updatedCompanyProps,
      };
    }

    default:
      return state;
  }
};
