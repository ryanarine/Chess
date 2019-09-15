import React from "react";
import "./main.css";
import Board from "./components/Board";
import Header from "./components/Header";
import PromotionForm from "./components/PromotionForm";

function App() {
  return (
    <div id="game-container">
      <Header />
      <PromotionForm />
      <Board />
    </div>
  );
}

export default App;
