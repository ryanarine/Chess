import React from "react";
import { useSelector, useDispatch } from "react-redux";

function Counter() {
  const counter = useSelector(state => state.counter);
  const dispatch = useDispatch();
  console.log("counter");
  return (
    <div>
      <h1>Counter: {counter}</h1>
      <button onClick={() => dispatch({ type: "INCREMENT" })}>+</button>
      <button onClick={() => dispatch({ type: "DECREMENT" })}>Change Name</button>
    </div>
  );
}

export default Counter;
