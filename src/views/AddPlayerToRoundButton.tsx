import * as React from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
} from "@mui/material";
import { useParams } from "react-router";
import { useAppDispatch } from "../store/hooks";
import { nanoid } from "nanoid";
import { addPlayer } from "../store/player-slice";
import { addPlayerMidTournament } from "../store/tournament-slice";

export default function AddPlayerToRoundButton() {
  const [open, setOpen] = React.useState(false);
  const { tournamentId } = useParams();
  const dispatch = useAppDispatch();

  function handleClose() {
    setOpen(false);
  }

  return (
    <React.Fragment>
      <Button color="inherit" variant="outlined" onClick={() => setOpen(true)}>
        Add Player
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
            const player = {
              id: nanoid(),
              name: formJson.name,
              club: formJson.club || undefined,
            };
            dispatch(addPlayer(player));
            dispatch(
              addPlayerMidTournament({
                tournamentId: tournamentId!,
                player: player.id,
              }),
            );
            handleClose();
          },
        }}
      >
        <DialogTitle>Add Player</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Add a new player to the tournament. They will receive a bye for
            every round played so far.
          </DialogContentText>
          <TextField
            autoFocus
            required
            margin="dense"
            id="name"
            name="name"
            label="Name"
            fullWidth
            variant="standard"
          />
          <TextField
            margin="dense"
            id="club"
            name="club"
            label="Club"
            fullWidth
            variant="standard"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button variant="contained" type="submit">
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
