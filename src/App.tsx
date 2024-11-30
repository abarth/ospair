import React, { useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import { PlayerList } from "./Views";
import { FileUploader } from "react-drag-drop-files";
import { parse } from "papaparse";
import { TournamentController } from "./tournamentController";
import { Registration, isRegistration } from "./model";

const tournamentController = new TournamentController();

function App() {
  const handleChange = (file: File) => {
    parse(file, {
      header: true,
      complete: function (results, file) {
        for (const entry of results.data) {
          if (!isRegistration(entry)) continue;
          let name = entry["First Name"] + " " + entry["Last Name"];
          tournamentController.registerPlayer(name, entry["Club"]);
        }
        console.log(tournamentController.players);
      },
    });
  };
  const types = ["csv"];
  return (
    <div>
      <h1>Old School Tournament Runner</h1>
      <FileUploader
        handleChange={handleChange}
        name="players.csv"
        label="Upload or drop a players.csv file here"
        types={types}
      >
        Put the players.csv file here
      </FileUploader>
    </div>
  );
}

export default App;
