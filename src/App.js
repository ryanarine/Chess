import React from "react";
import "./main.css";
import Board from "./components/Board";
import Title from "./components/Title";

function App() {
  return (
    <div id="game-container">
      <Title />
      <Board />
    </div>
  );
}

export default App;
