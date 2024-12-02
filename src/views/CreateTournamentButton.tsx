import * as React from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
} from "@mui/material";
import { useAppDispatch } from "../store/hooks";
import { nanoid } from "nanoid";
import { createTournament } from "../store/tournament-slice";
import { useNavigate } from "react-router";
import { routeTo } from "../routes";
import { MatchFormat } from "../model/objects";

export default function CreateTournamentButton() {
  const [open, setOpen] = React.useState(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  function handleOpen() {
    setOpen(true);
  }

  function handleClose() {
    setOpen(false);
  }

  return (
    <React.Fragment>
      <Button variant="outlined" color="inherit" onClick={handleOpen}>
        Create Tournament
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{
          component: "form",
          autoComplete: "off",
          onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            const formData = new FormData(event.currentTarget);
            const formJson = Object.fromEntries((formData as any).entries());
            const tournamentId = nanoid();
            dispatch(
              createTournament({
                tournamentId: tournamentId,
                name: formJson.name,
              }),
            );
            navigate(routeTo({ tournamentId: tournamentId }));
            handleClose();
          },
        }}
      >
        <DialogTitle>Create Tournament</DialogTitle>
        <DialogContent>
          <Stack direction="column" spacing={2} sx={{ pt: 1 }}>
            <TextField
              autoFocus
              required
              variant="outlined"
              id="name"
              name="name"
              label="Name"
              fullWidth
            />
            <FormControl fullWidth>
              <InputLabel id="tournament-match-format-label">
                Match Format
              </InputLabel>
              <Select
                labelId="tournament-match-format-label"
                id="tournament-match-format"
                defaultValue={MatchFormat.SinglePlayer}
                label="Match Format"
              >
                <MenuItem value={MatchFormat.SinglePlayer}>
                  Single Player
                </MenuItem>
                <MenuItem value={MatchFormat.TwoHeadedGiant}>
                  Two-Headed Giant
                </MenuItem>
              </Select>
            </FormControl>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button variant="contained" type="submit">
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
