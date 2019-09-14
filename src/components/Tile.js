import React from "react";
import Image from "./Image";
import { useSelector, useDispatch } from "react-redux";
import { highlight, unHighlight, move, win, sendPromote } from "../actions";
import store from "../store";

function handleClick(tile, piece, dispatch) {
  let gameOver = store.getState("tiles").tiles.gameOver;
  if (!gameOver) {
    let turn = store.getState("tiles").tiles.turn;
    if ((turn && piece > 0) || (!turn && piece < 0)) {
      dispatch(highlight(tile, piece));
      return;
    }
    let highlightedTiles = store.getState("tiles").tiles.highlightedTiles;
    let selectedTile = store.getState("tiles").tiles.selectedTile;
    // Check if the player selected a piece and the piece can move to the clicked tile
    if (selectedTile !== -1 && highlightedTiles.find(htile => htile === tile) >= 0) {
      // Check if the King died
      dispatch(move(tile, piece));
      if (Math.abs(piece) === 1) {
        piece === 1 ? dispatch(win(false)) : dispatch(win(true));
      }
      // Check if the first or last row was reached to potentially promote a pawn
      else {
        let row = Math.floor(tile / 8);
        if (row === 0 || row === 7) {
          dispatch(sendPromote(tile, row));
        }
      }
      return;
    }
    dispatch(unHighlight());
  }
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
