export function highlight(tile, piece) {
  return { type: "HIGHLIGHT", tile, piece };
}

export function unHighlight() {
  return { type: "UNHIGHLIGHT" };
}

export function move(newTile, piece) {
  return { type: "MOVE", newTile, piece };
}

export function win(didWhiteWin) {
  return { type: "WIN", didWhiteWin };
}

export function reset() {
  return { type: "RESET" };
}

export function sendPromote(tile, row) {
  return { type: "SENDPROMOTE", tile, row };
}

export function promote(piece) {
  return { type: "PROMOTE", piece };
}
