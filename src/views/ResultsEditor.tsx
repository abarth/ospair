import { Typography } from "@mui/material";
import { Tournament } from "../model/objects";

export default function ResultsEditor({
  tournament,
  onTournamentUpdated,
}: {
  tournament: Tournament;
  onTournamentUpdated: (tournament: Tournament) => void;
}) {
  return <Typography>ResultsEditor</Typography>;
}
