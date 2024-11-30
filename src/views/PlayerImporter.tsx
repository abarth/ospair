import { PlayerId } from "../model/objects";
import { FileUploader } from "react-drag-drop-files";
import { parse } from "papaparse";
import { isRegistration } from "../model/objects";
import { playerController } from "../controller/player";
import { PropsWithChildren } from "react";

type PlayerImporterProps = {
  onPlayersImported: (players: PlayerId[]) => void;
};

export default function PlayerImporter(
  props: PropsWithChildren<PlayerImporterProps>,
) {
  const handleChange = (file: File) => {
    parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: function (results, file) {
        const players: PlayerId[] = [];
        for (const entry of results.data) {
          if (!isRegistration(entry)) continue;
          let name = entry["First Name"] + " " + entry["Last Name"];
          players.push(playerController.add(name, entry["Club"]));
        }
        props.onPlayersImported(players);
      },
    });
  };
  const types = ["csv"];
  return (
    <FileUploader
      handleChange={handleChange}
      name="players.csv"
      label="Upload or drop a players.csv file here"
      types={types}
    >
      {props.children}
    </FileUploader>
  );
}
