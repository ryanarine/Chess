import React from "react";
import { useSelector } from "react-redux";

const modeMap = ["White's Turn", "Black's Turn", "White Wins!", "Black Wins!"];
const colorMap = ["white", "black"];

function Title() {
  let turn = useSelector(state => state.turn);
  let gameOver = useSelector(state => state.gameOver);
  let didWhiteWin = useSelector(state => state.didWhiteWin);
  let index = turn ? 0 : 1;
  if (gameOver) {
    index = didWhiteWin ? 2 : 3;
  }
  return <h2 style={{ color: colorMap[index % 2] }}>{modeMap[index]}</h2>;
}

export default Title;
