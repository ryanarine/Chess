import { combineReducers } from "redux";
import clickReducer from "./clickReducer";

const rootReducer = combineReducers({ tiles: clickReducer });

export default rootReducer;
