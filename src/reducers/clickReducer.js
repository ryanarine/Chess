function initialBoard() {
  const row0 = [-3, -4, -5, -2, -1, -5, -4, -3];
  const row1 = new Array(8).fill(-6);
  const row2to5 = new Array(32).fill(0);
  const row6 = new Array(8).fill(6);
  const row7 = [3, 4, 5, 2, 1, 5, 4, 3];
  return row0.concat(row1, row2to5, row6, row7);
}

const initialState = {
  board: initialBoard(),
  turn: true,
  tileBg: new Array(64).fill(0),
  selectedTile: -1,
  hightlightedPieces: -1
};

function clickReducer(state = initialState, action) {
  if (action.type === "UNHIGHLIGHT" || action.type === "MOVE") {
    if (action.type === "MOVE") {
      state.board[action.newTile] = state.board[state.selectedTile];
      state.board[state.selectedTile] = 0;
      state.turn = !state.turn;
    }
    state.tileBg[state.selectedTile] = 0;
    state.tileBg[state.highlightedPieces] = 0;
    state.selectedTile = -1;
    state.highlightedPieces = -1;
  } else if (action.type === "HIGHLIGHT") {
    if (state.selectedTile !== -1) {
      state.tileBg[state.selectedTile] = 0;
      state.tileBg[state.highlightedPieces] = 0;
    }
    state.selectedTile = action.tile;
    state.tileBg[action.tile] = 1;
    let hightlightTile = action.piece < 0 ? (action.tile + 8) % 64 : (action.tile + 56) % 64;
    state.highlightedPieces = hightlightTile;
    if (
      (action.piece > 0 && state.board[hightlightTile] < 0) ||
      (action.piece < 0 && state.board[hightlightTile] > 0)
    ) {
      state.tileBg[hightlightTile] = 3;
    } else {
      state.tileBg[hightlightTile] = 2;
    }
  }
  return state;
}

export default clickReducer;
