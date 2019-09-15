import React from "react";
import Tile from "./Tile";
import { useSelector } from "react-redux";

function getBg(index) {
  return (Math.floor(index / 8) + (index % 8)) % 2;
}
const backgrounds = ["white", "black"];

function Board() {
  const board = useSelector(state => state.board);
  const tiles = board.map((piece, index) => (
    <Tile key={index} tile={index} bg={backgrounds[getBg(index)]} />
  ));
  return <div id="board">{tiles}</div>;
}

export default Board;
