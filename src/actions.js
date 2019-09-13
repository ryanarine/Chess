export function highlight(tile, piece) {
  return { type: "HIGHLIGHT", tile, piece };
}

export function unHighlight() {
  return { type: "UNHIGHLIGHT" };
}

export function move(newTile, piece) {
  return { type: "MOVE", newTile, piece };
}
