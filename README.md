## Overview
This application simulates a game of Chess between two players. This application uses the React framework with Redux for state management. I use Redux to ensure that only the affected tiles re-render and not the entire chess board, which is impossible to do in react alone.

### Features
Besides being able to play the game of Chess, this application indicates what actions you can take once you have selected a piece, by highlighting tiles you can interact with. A green highlight indicates what piece you have selected. Any empty tile that piece can go to will be highlighted blue. Any enemy that can be attacked with the piece will have their tile highlighted red. <br>

There are two special highlights since there are two special moves in Chess: En Passant and Castling. <br>

En Passant can only occur immediately after a Pawn has moved two spaces forward from its initial position. If an enemy Pawn could have attacked that Pawn had it moved one space forward instead, then the enemy Pawn may attack it as if that is what happend. An En Passant attack is indicated by a special red highlight. <br>

Castling is a move that can only occur between the King and one of the Rooks, both of which must not have moved from their initial position. If there is only empty space between the King and the Rook, then the King may move two spaces toward the Rook and the Rook will move to the tile behind the King. A Castling move is indicated by a purple highlight.

### The Application
You can play this application [here](https://ryanarine.github.io/Chess/).
