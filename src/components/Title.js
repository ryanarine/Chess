import React from "react";
import { useSelector } from "react-redux";

const modeMap = ["White's Turn", ["Black's Turn"]];
const colorMap = ["white", "black"];

function Title() {
  let turn = useSelector(state => state.tiles.turn);
  let index = turn ? 0 : 1;
  return (
    <h1 id="title" style={{ color: colorMap[index] }}>
      {modeMap[index]}
    </h1>
  );
}

export default Title;
