// The board is represented as a 64 tile array
// each entry is an integer representing the piece on the tile
// 0 = blank tile 1,2 = King,Queen 3,4,5 = Rook,Bishop,Knight 6 = Pawn
// Negative numbers mean the piece is black
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
  turn: true, // Whose turn is it? true = White false = Black
  tileBg: new Array(64).fill(0), // The background color of each tile
  // The tile holding the piece that the player wants to move
  // The background color of the selected tile must be green
  selectedTile: -1,
  // The tiles that the selected piece can potentially move to
  // The background colors of these tiles must be blue or red
  // or the default color if the piece cannot move there because
  // an ally piece is occupying it
  highlightedTiles: []
};

function clickReducer(state = initialState, action) {
  if (action.type === "UNHIGHLIGHT" || action.type === "MOVE") {
    if (action.type === "MOVE") {
      // Move piece to new tile and clear out old tile
      state.board[action.newTile] = state.board[state.selectedTile];
      state.board[state.selectedTile] = 0;
      state.turn = !state.turn;
    }
    // Unhighlight any highlighted tiles and reset values
    state.tileBg[state.selectedTile] = 0;
    state.highlightedTiles.forEach(tile => (state.tileBg[tile] = 0));
    state.selectedTile = -1;
    state.highlightedTiles = [];
  } else if (action.type === "HIGHLIGHT") {
    if (state.selectedTile !== -1) {
      //Unhighlight previous highlighted tiles
      state.tileBg[state.selectedTile] = 0;
      state.highlightedTiles.forEach(tile => (state.tileBg[tile] = 0));
    }
    // Highlight the selected tile
    state.selectedTile = action.tile;
    state.tileBg[action.tile] = 1;
    // Highlight any tiles that the piece can move to
    state.highlightedTiles = getPossibleMoves(action.tile, action.piece, state.board);
    state.highlightedTiles.forEach(tile => {
      // determine the highlight color
      state.tileBg[tile] = shouldHighlight(state.board[action.tile], state.board[tile]);
    });
  }
  return state;
}

function getPossibleMoves(tile, piece, board) {
  if (Math.abs(piece) === 6) {
    let moves = [];
    let multiplier = piece === -6 ? 1 : -1;
    let highlights = [2, 3, 3];
    let possiblemoves = [tile + 8 * multiplier, tile + 7 * multiplier, tile + 9 * multiplier];
    // If pawn is on second or seventh row add extra move (initial position)
    if (
      (piece === 6 && Math.floor(tile / 8) === 6) ||
      (piece === -6 && Math.floor(tile / 8) === 1)
    ) {
      highlights.push(2);
      possiblemoves.push(tile + 16 * multiplier);
    }
    // Push the move if the highlight color matches the expected highlight
    possiblemoves.forEach((move, index) => {
      if (shouldHighlight(piece, board[move]) === highlights[index]) {
        moves.push(move);
      }
    });
    return moves.filter(move => move >= 0 && move < 64);
  }
  return piece < 0 ? [(tile + 8) % 64] : [(tile + 56) % 64];
}

// Finds the relationship between the two pieces and returns an integer indicating what color should piece2 be highlighted as
// 0 = Ally => No highlight
// 2 = Neutral/Blank tile => Blue highlight
// 3 = Enemy => Red highlight
function shouldHighlight(piece1, piece2) {
  console.log(piece1, piece2);
  let parity = piece1 * piece2;
  return parity === 0 ? 2 : parity < 0 ? 3 : 0;
}

export default clickReducer;
