import React from "react";
import { useSelector } from "react-redux";

export default function Name() {
  const name = useSelector(state => state.name);
  console.log("name");
  return <h1>Name: {name}</h1>;
}
