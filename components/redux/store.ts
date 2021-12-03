import { createStore, combineReducers, applyMiddleware } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import thunkMiddleware from "redux-thunk";
import { reducer as siteReducer } from "./site/reducer";
import { Store } from "redux";
import { createWrapper } from "next-redux-wrapper";

const initStore = (initialState: any) => {
  return createStore(
    combineReducers({
      site: siteReducer,
    }),
    initialState,
    composeWithDevTools(applyMiddleware(thunkMiddleware))
  );
};

export const wrapper = createWrapper<Store>(initStore, { debug: false });
