import { nanoid } from "nanoid";
import { Player } from "../model/objects";
import { FileUploader } from "react-drag-drop-files";
import { parse } from "papaparse";
import { isRegistration } from "../model/objects";
import { PropsWithChildren } from "react";
import { useAppDispatch } from "../store/hooks";
import { addPlayers } from "../store/player-slice";
import { registerPlayers } from "../store/tournament-slice";
import { useParams } from "react-router";

type PlayerImporterProps = {};

export default function PlayerImporter(
  props: PropsWithChildren<PlayerImporterProps>,
) {
  const { tournamentId } = useParams();
  const dispatch = useAppDispatch();

  const handleChange = (file: File) => {
    parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: function (results, file) {
        const players: Player[] = [];
        for (const entry of results.data) {
          if (!isRegistration(entry)) continue;
          let name = [entry["First Name"], entry["Last Name"]].join(" ");
          players.push({
            id: nanoid(),
            name: name,
            club: entry["Club"],
          });
        }
        dispatch(addPlayers(players));
        dispatch(
          registerPlayers({
            tournamentId: tournamentId!,
            players: players.map((player) => player.id),
          }),
        );
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
