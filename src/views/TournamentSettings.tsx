import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useParams } from "react-router";
import { MatchFormat } from "../model/objects";
import { useAppSelector, useAppDispatch } from "../store/hooks";
import {
  hasStarted,
  selectTournament,
  setMatchFormat,
  setTournamentName,
} from "../store/tournament-slice";

export default function TournamentSettings() {
  const tournament = useAppSelector(selectTournament(useParams()));
  const dispatch = useAppDispatch();

  function handleTournamentNameChange(
    event: React.ChangeEvent<HTMLInputElement>,
  ) {
    dispatch(
      setTournamentName({
        tournamentId: tournament.id,
        name: event.target.value,
      }),
    );
  }

  function handleMatchFormatChange(event: SelectChangeEvent) {
    dispatch(
      setMatchFormat({
        tournamentId: tournament.id,
        matchFormat: event.target.value as MatchFormat,
      }),
    );
  }

  return (
    <Box component="form" noValidate autoComplete="off">
      <Stack direction="column" spacing={2}>
        <Typography variant="h6">Settings</Typography>
        <TextField
          id="tournament-name"
          label="Tournament Name"
          variant="outlined"
          fullWidth
          value={tournament.name}
          onChange={handleTournamentNameChange}
        />
        <FormControl fullWidth>
          <InputLabel id="tournament-match-format-label">
            Match Format
          </InputLabel>
          <Select
            labelId="tournament-match-format-label"
            id="tournament-match-format"
            disabled={hasStarted(tournament)}
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
