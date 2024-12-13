import { Player } from "../model/objects";
import { FileUploader } from "react-drag-drop-files";
import { PropsWithChildren } from "react";
import { useAppDispatch } from "../store/hooks";
import { addPlayers } from "../store/player-slice";
import { registerPlayers } from "../store/tournament-slice";
import { useParams } from "react-router";
import { parsePlayersCsv } from "../model/players-csv";

type PlayerImporterProps = {};

export default function PlayerImporter(
  props: PropsWithChildren<PlayerImporterProps>,
) {
  const { tournamentId } = useParams();
  const dispatch = useAppDispatch();

  const handleChange = (file: File) => {
    parsePlayersCsv(file, (players: Player[]) => {
      dispatch(addPlayers(players));
      dispatch(
        registerPlayers({
          tournamentId: tournamentId!,
          players: players.map((player) => player.id),
        }),
      );
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
