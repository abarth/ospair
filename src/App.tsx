import React from "react";
import logo from "./logo.svg";
import "./App.css";
import { tournament } from "./fixture";
import { PlayerList } from "./Views";

function App() {
  return <PlayerList players={tournament.players} />;
}

export default App;
