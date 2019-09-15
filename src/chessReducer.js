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

function getInitialState(WWins = 0, BWins = 0) {
  return {
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
    highlightedTiles: [],
    gameOver: false,
    didWhiteWin: false,
    // The tile position of the pawn to be promoted if there are any
    promotedTile: -1,
    // # of wins
    whiteWins: WWins,
    blackWins: BWins
  };
}

function chessReducer(state = getInitialState(), action) {
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
  } else if (action.type === "WIN") {
    state.gameOver = true;
    state.didWhiteWin = action.didWhiteWin;
    action.didWhiteWin ? state.whiteWins++ : state.blackWins++;
  } else if (action.type === "RESET") {
    state = getInitialState(state.whiteWins, state.blackWins);
  } else if (action.type === "SENDPROMOTE") {
    let piece = state.board[action.tile];
    if ((piece === 6 && action.row === 0) || (piece === -6 && action.row === 7)) {
      state.promotedTile = action.tile;
    }
  } else if (action.type === "PROMOTE") {
    // Check whether the promoted piece should be black or white
    let piece = state.promotedTile < 8 ? action.piece : action.piece * -1;
    state.board[state.promotedTile] = piece;
    state.promotedTile = -1;
  }
  return state;
}

function getPossibleMoves(tile, piece, board) {
  let rows = [];
  let cols = [];
  // Pawn
  switch (Math.abs(piece)) {
    case 6:
      let moves = [];
      let multiplier = piece === -6 ? 1 : -1;
      // First deal with forward movements
      let possibleMoves = [multiplier];
      // If pawn is on second or seventh row add extra move (initial position)
      if (
        (piece === 6 && Math.floor(tile / 8) === 6) ||
        (piece === -6 && Math.floor(tile / 8) === 1)
      ) {
        possibleMoves.push(2 * multiplier);
      }
      // Push the move if there is an empty tile in front
      for (let i = 0; i < possibleMoves.length; i++) {
        if (
          staysOn(tile, possibleMoves[i], 0) &&
          shouldHighlight(piece, board[tile + 8 * possibleMoves[i]]) === 2
        ) {
          moves.push(tile + 8 * possibleMoves[i]);
        } else {
          break; // Break early because the Pawn is blocked from moving forward
        }
      }

      // Now deal with diagonal movements
      let diagonalOffsets = [-1, 1];
      diagonalOffsets.forEach(offset => {
        // Push the move if there is an enemy
        if (
          staysOn(tile, multiplier, offset) &&
          shouldHighlight(piece, board[tile + 8 * multiplier + offset]) === 3
        ) {
          moves.push(tile + 8 * multiplier + offset);
        }
      });
      return moves;

    case 5:
      rows = [-2, -2, -1, 1, 2, 2, 1, -1];
      cols = [-1, 1, 2, 2, 1, -1, -2, -2];
      return circlePath(tile, rows, cols);

    case 4:
      return diagonalPath(tile, piece, board);

    case 3:
      return straightPath(tile, piece, board);

    case 2:
      return straightPath(tile, piece, board).concat(diagonalPath(tile, piece, board));

    case 1:
      rows = [-1, -1, 0, 1, 1, 1, 0, -1, -1];
      cols = [0, 1, 1, 1, 0, -1, -1, -1, -1];
      return circlePath(tile, rows, cols);

    default:
      return [];
  }
}

// Finds the relationship between the two pieces and returns an integer indicating what color should piece2 be highlighted as
// 0 = Ally => No highlight
// 2 = Neutral/Blank tile => Blue highlight
// 3 = Enemy => Red highlight
function shouldHighlight(piece1, piece2) {
  let parity = piece1 * piece2;
  return parity === 0 ? 2 : parity < 0 ? 3 : 0;
}

// Returns true if moving the tile by the given row and col adjustment will not cause the tile to fall off the board
function staysOn(tile, row, col) {
  let newRow = Math.floor(tile / 8) + row;
  let newCol = (tile % 8) + col;
  return newRow >= 0 && newRow < 8 && newCol >= 0 && newCol < 8;
}

// Used for the Rook and Queen
function straightPath(tile, piece, board) {
  let moves = [];
  let multiplier = 1;
  let row = 0;
  let col = 0;
  [8, -8, 1, -1].forEach(direction => {
    multiplier = 1;
    if (Math.abs(direction) === 8) {
      row = direction / 8;
      col = 0;
    } else if (Math.abs(direction) === 1) {
      row = 0;
      col = direction;
    }
    while (staysOn(tile, row * multiplier, col * multiplier)) {
      let highlight = shouldHighlight(piece, board[tile + direction * multiplier]);
      // If ally is blocking path, don't add the move and stop moving in this direction
      if (highlight === 0) {
        break;
      }
      // Add the move and if enemy is blocking path, stop moving in this direction
      moves.push(tile + direction * multiplier);
      if (highlight === 3) {
        break;
      }
      multiplier++;
    }
  });
  return moves;
}

// Used for the Bishop and Queen
function diagonalPath(tile, piece, board) {
  let moves = [];
  let multiplier = 1;
  let rows = [-8, 8];
  let cols = [-1, 1];
  for (let i = 0; i < rows.length; i++) {
    for (let j = 0; j < cols.length; j++) {
      // rows[i] and cols[j] determine direction, multiplier determines how far to move
      multiplier = 1;
      // Advance in direction while we are on the board and nothing is blocking the path
      while (staysOn(tile, (rows[i] / 8) * multiplier, cols[j] * multiplier)) {
        let highlight = shouldHighlight(piece, board[tile + (rows[i] + cols[j]) * multiplier]);
        // If ally is blocking path, don't add the move and stop moving in this direction
        if (highlight === 0) {
          break;
        }
        // Add the move and if enemy is blocking path, stop moving in this direction
        moves.push(tile + (rows[i] + cols[j]) * multiplier);
        if (highlight === 3) {
          break;
        }
        multiplier++;
      }
    }
  }
  return moves;
}

// Used for the Knight and King
// The rows and columns given simulate a circular path going clockwise from a zero degree bearing
function circlePath(tile, rows, cols) {
  let moves = [];
  rows.forEach((row, index) => {
    if (staysOn(tile, row, cols[index])) {
      moves.push(tile + 8 * row + cols[index]);
    }
  });
  return moves;
}

export default chessReducer;
