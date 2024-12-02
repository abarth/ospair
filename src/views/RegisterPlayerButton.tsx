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
import { registerPlayer } from "../store/tournament-slice";

export default function RegisterPlayerButton({
  disabled,
}: {
  disabled?: boolean;
}) {
  const [open, setOpen] = React.useState(false);
  const { tournamentId } = useParams();
  const dispatch = useAppDispatch();

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <React.Fragment>
      <Button variant="outlined" disabled={disabled} onClick={handleClickOpen}>
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
              club: formJson.club,
            };
            dispatch(addPlayer(player));
            dispatch(
              registerPlayer({
                tournamentId: tournamentId!,
                player: player.id,
              }),
            );
            handleClose();
          },
        }}
      >
        <DialogTitle>Register Player</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Register a player by entering their name and club affiliation.
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
            required
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
            Register
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
