import React, { useState } from "react";
import "./App.css";
import PlayerList from "./views/PlayerList";
import { FileUploader } from "react-drag-drop-files";
import { parse } from "papaparse";
import { isRegistration, Tournament } from "./model/objects";
import { createTournament, registerPlayer } from "./controller/tournament";

function App() {
  const [tournament, setTournament] = useState<Tournament>(createTournament);
  const handleChange = (file: File) => {
    parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: function (results, file) {
        let updatedTournament = tournament;
        for (const entry of results.data) {
          if (!isRegistration(entry)) continue;
          let name = entry["First Name"] + " " + entry["Last Name"];
          updatedTournament = registerPlayer(
            updatedTournament,
            name,
            entry["Club"],
          );
        }
        setTournament(updatedTournament);
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
      <PlayerList players={tournament.players} />
    </div>
  );
}

export default App;
