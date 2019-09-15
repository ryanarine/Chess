import React from "react";
import { useDispatch } from "react-redux";
import { reset } from "../actions";
import Title from "./Title";
import WhiteWins from "./WhiteWins";
import BlackWins from "./BlackWins";

function sendReset(dispatch) {
  dispatch(reset());
}

function Header() {
  const dispatch = useDispatch();
  return (
    <div id="header">
      <WhiteWins />
      <Title />
      <BlackWins />
      <button id="reset" onClick={() => sendReset(dispatch)}>
        Reset
      </button>
    </div>
  );
}

export default Header;
