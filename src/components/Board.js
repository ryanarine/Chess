import React from "react";
import Tile from "./Tile";
import { useSelector } from "react-redux";

function initialBoard() {
  const row0 = [-3, -4, -5, -2, -1, -5, -4, -3];
  const row1 = new Array(8).fill(-6);
  const row2to5 = new Array(32).fill(0);
  const row6 = new Array(8).fill(6);
  const row7 = [3, 4, 5, 2, 1, 5, 4, 3];
  return row0.concat(row1, row2to5, row6, row7);
}

function getBg(index) {
  return (Math.floor(index / 8) + (index % 8)) % 2;
}
const backgrounds = ["white", "black"];

initialBoard();
function Board() {
  const board = useSelector(state => state.tiles.board);

  const tiles = board.map((piece, index) => (
    <Tile key={index} tile={index} bg={backgrounds[getBg(index)]} />
  ));
  return <div id="board">{tiles}</div>;
}

export default Board;
