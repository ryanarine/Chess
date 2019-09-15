import React from "react";
import { useSelector } from "react-redux";

function BlackWins() {
  let BWins = useSelector(state => state.blackWins);
  return <h2 style={{ color: "black" }}>Black Wins: {BWins}</h2>;
}

export default BlackWins;
