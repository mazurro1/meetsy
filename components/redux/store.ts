import {createStore, combineReducers, applyMiddleware} from "redux";
import {composeWithDevTools} from "redux-devtools-extension";
import thunkMiddleware from "redux-thunk";
import {reducer as siteReducer} from "./site/reducer";
import {reducer as searchCompanysReducer} from "./searchCompanys/reducer";
import {reducer as userReducer} from "./user/reducer";
import {reducer as companysReducer} from "./companys/reducer";
import {Store} from "redux";
import {createWrapper} from "next-redux-wrapper";
import type {SearchCompanyProps} from "./searchCompanys/state.model";
import type {ICompanyProps} from "./companys/state.model";
import type {ISiteProps, IUserProps} from "@hooks";

export interface IStoreProps {
  site: ISiteProps;
  searchCompanys: SearchCompanyProps;
  user: IUserProps;
  companys: ICompanyProps;
}

const initStore = (initialState: any) => {
  return createStore(
    combineReducers({
      site: siteReducer,
      searchCompanys: searchCompanysReducer,
      user: userReducer,
      companys: companysReducer,
    }),
    initialState,
    composeWithDevTools(applyMiddleware(thunkMiddleware))
  );
};

export const wrapper = createWrapper<Store>(initStore, {debug: false});
