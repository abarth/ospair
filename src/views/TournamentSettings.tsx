import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
  TextField,
} from "@mui/material";
import { MatchFormat, Tournament } from "../model/objects";

export default function TournamentSettings({
  tournament,
  onTournamentUpdated,
}: {
  tournament: Tournament;
  onTournamentUpdated: (tournament: Tournament) => void;
}) {
  function handleMatchFormatChange(event: SelectChangeEvent) {
    onTournamentUpdated({
      ...tournament,
      matchFormat: event.target.value as MatchFormat,
    });
  }
  return (
    <Box component="form" noValidate autoComplete="off">
      <Stack direction="column" spacing={2}>
        <TextField
          id="tournament-name"
          label="Tournament Name"
          variant="outlined"
          fullWidth
          value={tournament.name}
          onChange={(event) =>
            onTournamentUpdated({ ...tournament, name: event.target.value })
          }
        />
        <FormControl fullWidth>
          <InputLabel id="tournament-match-format-label">
            Match Format
          </InputLabel>
          <Select
            labelId="tournament-match-format-label"
            id="tournament-match-format"
            value={tournament.matchFormat}
            label="Match Format"
            onChange={handleMatchFormatChange}
          >
            <MenuItem value={MatchFormat.SinglePlayer}>Single Player</MenuItem>
            <MenuItem value={MatchFormat.TwoHeadedGiant}>
              Two-Headed Giant
            </MenuItem>
          </Select>
        </FormControl>
      </Stack>
    </Box>
  );
}
