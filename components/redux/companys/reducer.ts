import type {ICompanyProps, IUpdateCompanyProps} from "./state.model";
import * as siteActions from "./actions";
import {CompanyWorkerProps} from "@/models/CompanyWorker/companyWorker.model";
import type {CompanyProps} from "@/models/Company/company.model";

const initialState: ICompanyProps = {
  userCompanys: [],
  editedCompany: null,
  editedCompanyWorker: null,
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

    case siteActions.UPDATE_ALL_COMPANYS_PROPS: {
      const updatedCompanyProps: CompanyWorkerProps | null =
        !!state.selectedUserCompany
          ? {
              ...state.selectedUserCompany,
            }
          : null;
      const updatedUserCompanysProps: CompanyWorkerProps[] | null =
        !!state.userCompanys ? [...state.userCompanys] : null;

      const updatedEditedCompanyProps: CompanyProps | null =
        !!state.editedCompany
          ? {
              ...state.editedCompany,
            }
          : null;

      const updatedEditedCompanyWorker: CompanyWorkerProps | null =
        !!state.editedCompanyWorker
          ? {
              ...state.editedCompanyWorker,
            }
          : null;

      if (!!action.companyProps) {
        const valuesToChange: IUpdateCompanyProps[] = action.companyProps;
        valuesToChange.forEach((item) => {
          if (!!item.companyId) {
            if (typeof item.value !== "undefined") {
              if (!!item.folder) {
                //updated updatedCompanyProps
                if (!!updatedCompanyProps) {
                  if (!!updatedCompanyProps.companyId) {
                    if (typeof updatedCompanyProps.companyId !== "string") {
                      if (
                        updatedCompanyProps.companyId._id === item.companyId
                      ) {
                        if (!!updatedCompanyProps.companyId[item.folder]) {
                          if (
                            // @ts-ignore
                            typeof updatedCompanyProps.companyId[item.folder][
                              item.field
                            ] !== "undefined"
                          ) {
                            // @ts-ignore
                            updatedCompanyProps.companyId[item.folder][
                              item.field
                            ] = item.value;
                          }
                        }
                      }
                    }
                  }
                }

                // updated updatedEditedCompanyProps
                if (!!updatedEditedCompanyProps) {
                  if (updatedEditedCompanyProps._id === item.companyId) {
                    // @ts-ignore
                    updatedEditedCompanyProps[item.folder][item.field] =
                      item.value;
                  }
                }

                // updated updatedEditedCompanyWorker
                if (!!updatedEditedCompanyWorker) {
                  if (!!updatedEditedCompanyWorker.companyId) {
                    if (
                      typeof updatedEditedCompanyWorker.companyId !== "string"
                    ) {
                      if (
                        item.companyId ===
                        updatedEditedCompanyWorker.companyId._id
                      ) {
                        if (
                          !!updatedEditedCompanyWorker.companyId[item.folder]
                        ) {
                          if (
                            // @ts-ignore
                            typeof updatedEditedCompanyWorker.companyId[
                              item.folder
                            ][item.field] !== "undefined"
                          ) {
                            // @ts-ignore
                            updatedEditedCompanyWorker.companyId[item.folder][
                              item.field
                            ] = item.value;
                          }
                        }
                      }
                    }
                  }
                }
              } else if (!!item.field) {
                //updated updatedCompanyProps
                if (!!updatedCompanyProps) {
                  if (!!updatedCompanyProps.companyId) {
                    if (typeof updatedCompanyProps.companyId !== "string") {
                      if (
                        updatedCompanyProps.companyId._id === item.companyId
                      ) {
                        if (
                          // @ts-ignore
                          typeof updatedCompanyProps.companyId[item.field] !==
                          "undefined"
                        ) {
                          // @ts-ignore
                          updatedCompanyProps.companyId[item.field] =
                            item.value;
                        }
                      }
                    }
                  }
                }

                // updated updatedEditedCompanyProps
                if (!!updatedEditedCompanyProps) {
                  if (updatedEditedCompanyProps._id === item.companyId) {
                    // @ts-ignore
                    updatedEditedCompanyProps[item.field] = item.value;
                  }
                }

                // updated updatedEditedCompanyWorker
                if (!!updatedEditedCompanyWorker) {
                  if (!!updatedEditedCompanyWorker.companyId) {
                    if (
                      typeof updatedEditedCompanyWorker.companyId !== "string"
                    ) {
                      if (
                        item.companyId ===
                        updatedEditedCompanyWorker.companyId._id
                      ) {
                        if (
                          // @ts-ignore
                          typeof updatedEditedCompanyWorker.companyId[
                            item.field
                          ] !== "undefined"
                        ) {
                          // @ts-ignore
                          updatedEditedCompanyWorker.companyId[item.field] =
                            item.value;
                        }
                      }
                    }
                  }
                }
              }

              if (!!updatedUserCompanysProps) {
                const findIndexCompany = updatedUserCompanysProps.findIndex(
                  (itemCompany: CompanyWorkerProps) => {
                    if (typeof itemCompany.companyId !== "string") {
                      if (itemCompany.companyId?._id === item.companyId) {
                        return true;
                      } else {
                        return false;
                      }
                    } else {
                      return false;
                    }
                  }
                );
                if (findIndexCompany >= 0) {
                  if (!!item.folder) {
                    if (
                      typeof updatedUserCompanysProps[findIndexCompany]
                        .companyId !== "string"
                    ) {
                      if (
                        // @ts-ignore
                        !!updatedUserCompanysProps[findIndexCompany].companyId[
                          item.folder
                        ]
                      ) {
                        if (
                          // @ts-ignore
                          typeof updatedUserCompanysProps[findIndexCompany]
                            .companyId[item.folder][item.field] !== "undefined"
                        ) {
                          // @ts-ignore
                          updatedUserCompanysProps[findIndexCompany].companyId[
                            item.folder
                          ][item.field] = item.value;
                        }
                      }
                    }
                  } else {
                    if (
                      // @ts-ignore
                      typeof updatedUserCompanysProps[findIndexCompany]
                        .companyId[item.field] !== "undefined"
                    ) {
                      // @ts-ignore
                      updatedUserCompanysProps[findIndexCompany].companyId[
                        item.field
                      ] = item.value;
                    }
                  }
                }
              }
            }
          }
        });
      }

      return {
        ...state,
        selectedUserCompany: updatedCompanyProps,
        userCompanys: updatedUserCompanysProps,
        editedCompany: updatedEditedCompanyProps,
        editedCompanyWorker: updatedEditedCompanyWorker,
      };
    }

    case siteActions.UPDATE_COMPANY_EDIT: {
      return {
        ...state,
        editedCompany: !!action.companyProps ? action.companyProps : null,
        editedCompanyWorker: !!action.companyWorkerProps
          ? action.companyWorkerProps
          : null,
      };
    }

    default:
      return state;
  }
};
