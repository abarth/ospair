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
import { Tournament } from "../model/objects";
import { registerPlayer } from "../controller/tournament";

export default function RegisterPlayerButton({
  tournament,
  onTournamentUpdated,
}: {
  tournament: Tournament;
  onTournamentUpdated: (tournament: Tournament) => void;
}) {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <React.Fragment>
      <Button variant="outlined" onClick={handleClickOpen}>
        Register Player
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
            onTournamentUpdated(
              registerPlayer(tournament, formJson.name, formJson.club),
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
