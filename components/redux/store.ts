import { createStore, combineReducers, applyMiddleware } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import thunkMiddleware from "redux-thunk";
import { reducer as siteReducer } from "./site/reducer";
import { reducer as searchCompanysReducer } from "./searchCompanys/reducer";
import { Store } from "redux";
import { createWrapper } from "next-redux-wrapper";
import type { SearchCompanyProps } from "./searchCompanys/state.model";
import type { ISiteProps } from "./site/state.model";

export interface IStoreProps {
  site: ISiteProps;
  searchCompanys: SearchCompanyProps;
}

const initStore = (initialState: any) => {
  return createStore(
    combineReducers({
      site: siteReducer,
      searchCompanys: searchCompanysReducer,
    }),
    initialState,
    composeWithDevTools(applyMiddleware(thunkMiddleware))
  );
};

export const wrapper = createWrapper<Store>(initStore, { debug: false });
