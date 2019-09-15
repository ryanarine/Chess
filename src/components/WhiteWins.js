import React from "react";
import { useSelector } from "react-redux";

function WhiteWins() {
  let WWins = useSelector(state => state.whiteWins);
  return <h2 style={{ color: "white" }}>White Wins: {WWins}</h2>;
}

export default WhiteWins;
