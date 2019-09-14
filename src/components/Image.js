import React from "react";
import WPawn from "./images/WPawn.PNG";
import WRook from "./images/WRook.PNG";
import WBishop from "./images/WBishop.PNG";
import WKnight from "./images/WKnight.PNG";
import WKing from "./images/WKing.PNG";
import WQueen from "./images/WQueen.PNG";
import BPawn from "./images/BPawn.PNG";
import BRook from "./images/BRook.PNG";
import BBishop from "./images/BBishop.PNG";
import BKnight from "./images/BKnight.PNG";
import BKing from "./images/BKing.PNG";
import BQueen from "./images/BQueen.PNG";

const imgMap = [
  BPawn,
  BKnight,
  BBishop,
  BRook,
  BQueen,
  BKing,
  "",
  WKing,
  WQueen,
  WRook,
  WBishop,
  WKnight,
  WPawn
];

const stringMap = [
  "Black Pawn",
  "Black Knight",
  "Black Bishop",
  "Black Rook",
  "Black Queen",
  "Black King",
  "Blank",
  "White King",
  "White Queen",
  "White Rook",
  "White Bishop",
  "White Knight",
  "White Pawn"
];

function getImg(piece) {
  return imgMap[piece + 6];
}

function Image(props) {
  const imgStyle = {
    display: "block",
    margin: "auto",
    height: "100%"
  };
  if (props.name === 0) {
    return <React.Fragment></React.Fragment>;
  }
  return <img src={getImg(props.name)} style={imgStyle} alt={stringMap[props.name + 6]} />;
}

export default Image;
