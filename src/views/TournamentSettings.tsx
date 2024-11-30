import { Box, TextField } from "@mui/material";
import { Tournament } from "../model/objects";

export default function TournamentSettings({
  tournament,
  onTournamentUpdated,
}: {
  tournament: Tournament;
  onTournamentUpdated: (tournament: Tournament) => void;
}) {
  return (
    <Box component="form" noValidate autoComplete="off">
      <TextField
        id="outlined-basic"
        label="Tournament Name"
        variant="outlined"
        fullWidth
        value={tournament.name}
        onChange={(event) =>
          onTournamentUpdated({ ...tournament, name: event.target.value })
        }
      />
    </Box>
  );
}
