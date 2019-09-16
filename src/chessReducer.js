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
    promotedTile: -1, // The tile position of the pawn to be promoted if there are any
    // # of wins
    whiteWins: WWins,
    blackWins: BWins,
    passantTile: -1, // The tile position of a pawn that has moved 2 spaces forward in the previous turn
    // These following variables are used to check for castling
    // If the variable is false and the corresponding piece is at its initial position
    // then that piece has not moved at all and is therefore available for castling
    castling: {
      WK: false,
      BK: false,
      LWR: false,
      RWR: false,
      LBR: false,
      RBR: false
    }
  };
}

function chessReducer(state = getInitialState(), action) {
  if (action.type === "UNHIGHLIGHT" || action.type === "MOVE") {
    if (action.type === "MOVE") {
      // Update boolean variables (for castling)
      switch (state.selectedTile) {
        case 0:
          state.castling.LBR = true;
          break;
        case 4:
          state.castling.BK = true;
          break;
        case 7:
          state.castling.RBR = true;
          break;
        case 56:
          state.castling.LWR = true;
          break;
        case 60:
          state.castling.WK = true;
          break;
        case 63:
          state.castling.RWR = true;
          break;
        default:
      }

      // Check if this move was a castling move
      if (
        Math.abs(state.board[state.selectedTile]) === 1 &&
        Math.abs((action.newTile % 8) - (state.selectedTile % 8)) > 1
      ) {
        // Move rook behind king
        if (action.newTile - state.selectedTile > 0) {
          state.board[action.newTile + 1] = 0;
          state.board[action.newTile - 1] = action.newTile > 55 ? 3 : -3;
        } else {
          state.board[action.newTile - 2] = 0;
          state.board[action.newTile + 1] = action.newTile > 55 ? 3 : -3;
        }
      }

      // Check if this move was an En Passant attack
      if (action.newTile === state.passantTile) {
        // White pawn made the attack
        if (state.board[state.selectedTile] === 6) {
          state.board[action.newTile + 8] = 0;
        }
        // Black pawn made the attack
        else if (state.board[state.selectedTile] === -6) {
          state.board[action.newTile - 8] = 0;
        }
        state.passantTile = -1;
      }
      // Check for possibility of an En Passant attack
      else {
        state.passantTile = passantCheck(
          state.selectedTile,
          state.board[state.selectedTile],
          action.newTile
        );
      }
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
    state.highlightedTiles = getPossibleMoves(
      action.tile,
      action.piece,
      state.board,
      state.passantTile,
      state.castling
    );
    state.highlightedTiles.forEach(tile => {
      // determine the highlight color
      if (Math.abs(action.piece) === 6 && tile === state.passantTile) {
        // highlight special color for En Passant Attack
        state.tileBg[tile] = 4;
      } else if (Math.abs(action.piece) === 1 && Math.abs((tile % 8) - (action.tile % 8)) > 1) {
        // highlight special color for Castling Move
        state.tileBg[tile] = 5;
      } else {
        state.tileBg[tile] = getHighlight(state.board[action.tile], state.board[tile]);
      }
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

function getPossibleMoves(tile, piece, board, passantTile, castling) {
  let rows = [];
  let cols = [];
  // Pawn
  switch (Math.abs(piece)) {
    case 6:
      return getPawnMoves(piece, tile, board, passantTile);

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
      let castlingMoves =
        piece === 1
          ? getCastlingMoves(board, tile, castling.WK, castling.LWR, castling.RWR, 1)
          : getCastlingMoves(board, tile, castling.BK, castling.LBR, castling.RBR, -1);
      rows = [-1, -1, 0, 1, 1, 1, 0, -1, -1];
      cols = [0, 1, 1, 1, 0, -1, -1, -1, -1];
      return castlingMoves.concat(circlePath(tile, rows, cols));

    default:
      return [];
  }
}

// Finds the relationship between the two pieces and returns an integer indicating what color should piece2 be highlighted as
// 0 = Ally => No highlight
// 2 = Neutral/Blank tile => Blue highlight
// 3 = Enemy => Red highlight
function getHighlight(piece1, piece2) {
  let parity = piece1 * piece2;
  return parity === 0 ? 2 : parity < 0 ? 3 : 0;
}

// Returns false if moving the tile by the given row and col adjustment will cause the tile to fall off the board
function staysOn(tile, row, col) {
  let newRow = Math.floor(tile / 8) + row;
  let newCol = (tile % 8) + col;
  return newRow >= 0 && newRow < 8 && newCol >= 0 && newCol < 8;
}

// Return the tile position that a pawn would have reached had it moved 1 space forward instead of two
function passantCheck(tile, piece, newTile) {
  if (piece === 6 && newTile === tile - 16) {
    return tile - 8;
  }
  if (piece === -6 && newTile === tile + 16) {
    return tile + 8;
  }
  return -1;
}

function getPawnMoves(piece, tile, board, passantTile) {
  let moves = [];
  let multiplier = piece === -6 ? 1 : -1;
  // First deal with forward movements
  let possibleMoves = [multiplier];
  // If pawn is on second or seventh row add extra move (initial position)
  if ((piece === 6 && Math.floor(tile / 8) === 6) || (piece === -6 && Math.floor(tile / 8) === 1)) {
    possibleMoves.push(2 * multiplier);
  }
  // Push the move if there is an empty tile in front
  for (let i = 0; i < possibleMoves.length; i++) {
    if (
      staysOn(tile, possibleMoves[i], 0) &&
      getHighlight(piece, board[tile + 8 * possibleMoves[i]]) === 2
    ) {
      moves.push(tile + 8 * possibleMoves[i]);
    } else {
      break; // Break early because the Pawn is blocked from moving forward
    }
  }

  // Now deal with diagonal movements
  let diagonalOffsets = [-1, 1];
  diagonalOffsets.forEach(offset => {
    // Push the move if there is an enemy or a En Passant attack can be made
    if (
      staysOn(tile, multiplier, offset) &&
      (passantTile === tile + 8 * multiplier + offset ||
        getHighlight(piece, board[tile + 8 * multiplier + offset]) === 3)
    ) {
      moves.push(tile + 8 * multiplier + offset);
    }
  });
  return moves;
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
      let highlight = getHighlight(piece, board[tile + direction * multiplier]);
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
        let highlight = getHighlight(piece, board[tile + (rows[i] + cols[j]) * multiplier]);
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
// The rows and columns given simulate a circular path going clockwise
function circlePath(tile, rows, cols) {
  let moves = [];
  rows.forEach((row, index) => {
    if (staysOn(tile, row, cols[index])) {
      moves.push(tile + 8 * row + cols[index]);
    }
  });
  return moves;
}

function getCastlingMoves(board, tile, K, LR, RR, multiplier) {
  if (K) {
    return [];
  }
  let moves = [];
  if (
    !LR &&
    isExpected(board, [tile - 4, tile - 3, tile - 2, tile - 1], [3 * multiplier, 0, 0, 0])
  ) {
    moves.push(tile - 2);
  }
  if (!RR && isExpected(board, [tile + 1, tile + 2, tile + 3], [0, 0, 3 * multiplier])) {
    moves.push(tile + 2);
  }
  return moves;
}

// Returns true if the pieces of the given tiles of the given board
// are equal to the expected pieces
function isExpected(board, tiles, expectedPieces) {
  return tiles.reduce(
    (result, tile, index) => result && board[tile] === expectedPieces[index],
    true
  );
}

export default chessReducer;
