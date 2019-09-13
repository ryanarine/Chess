import React from "react";
import Image from "./Image";
import { useSelector, useDispatch } from "react-redux";
import { highlight, unHighlight, move } from "../actions";
import store from "../store";

function handleClick(tile, piece, dispatch) {
  let turn = store.getState("tiles").tiles.turn;
  if ((turn && piece > 0) || (!turn && piece < 0)) {
    dispatch(highlight(tile, piece));
    return;
  }
  let highlightedTile = store.getState("tiles").tiles.highlightedPieces;
  let selectedTile = store.getState("tiles").tiles.selectedTile;
  if (selectedTile !== -1 && highlightedTile === tile) {
    dispatch(move(tile, piece));
    return;
  }
  dispatch(unHighlight());
}

function Tile(props) {
  const dispatch = useDispatch();
  const name = useSelector(state => state.tiles.board[props.tile]);
  const bg = useSelector(state => state.tiles.tileBg[props.tile]);
  const style = {
    border: "2px solid #666",
    backgroundColor: props.bg,
    backgroundImage: "none",
    height: "80px"
  };

  if (bg === 1) {
    style.backgroundColor = "#90f694";
    style.backgroundImage = "radial-gradient(lime, green)";
  } else if (bg === 2) {
    style.backgroundColor = "#5ba8e6";
    style.backgroundImage = "radial-gradient(blue, darkblue)";
  } else if (bg === 3) {
    style.backgroundColor = "#db1010";
    style.backgroundImage = "radial-gradient(red, darkred)";
  }
  return (
    <div style={style} onClick={() => handleClick(props.tile, name, dispatch)}>
      <Image name={name} />
    </div>
  );
}

export default Tile;
