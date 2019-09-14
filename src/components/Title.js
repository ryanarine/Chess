import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { reset } from "../actions";

const modeMap = ["White's Turn", "Black's Turn", "White Wins!", "Black Wins!"];
const colorMap = ["white", "black"];

function sendReset(dispatch) {
  dispatch(reset());
}

function Title() {
  const dispatch = useDispatch();
  let turn = useSelector(state => state.tiles.turn);
  let gameOver = useSelector(state => state.tiles.gameOver);
  let didWhiteWin = useSelector(state => state.tiles.didWhiteWin);
  let index = turn ? 0 : 1;
  if (gameOver) {
    index = didWhiteWin ? 2 : 3;
  }
  return (
    <div id="header">
      <h1 id="title" style={{ color: colorMap[index % 2] }}>
        {modeMap[index]}
      </h1>
      <button id="reset" onClick={() => sendReset(dispatch)}>
        Reset
      </button>
    </div>
  );
}

export default Title;
