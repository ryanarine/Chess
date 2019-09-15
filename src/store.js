import { createStore } from "redux";
import chessReducer from "./chessReducer";

let store = createStore(chessReducer);

export default store;
