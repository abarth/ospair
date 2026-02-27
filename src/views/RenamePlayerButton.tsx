import * as React from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { PlayerId } from "../model/objects";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { renamePlayer, selectPlayer } from "../store/player-slice";

export default function RenamePlayerButton({ player }: { player: PlayerId }) {
  const [open, setOpen] = React.useState(false);
  const playerModel = useAppSelector(selectPlayer(player));
  const dispatch = useAppDispatch();

  function handleClose() {
    setOpen(false);
  }

  return (
    <React.Fragment>
      <IconButton size="small" onClick={() => setOpen(true)}>
        <EditIcon fontSize="small" />
      </IconButton>
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
            dispatch(
              renamePlayer({
                id: player,
                name: formJson.name,
                club: formJson.club || undefined,
              }),
            );
            handleClose();
          },
        }}
      >
        <DialogTitle>Rename Player</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            required
            margin="dense"
            id="name"
            name="name"
            label="Name"
            fullWidth
            variant="standard"
            defaultValue={playerModel.name}
          />
          <TextField
            margin="dense"
            id="club"
            name="club"
            label="Club"
            fullWidth
            variant="standard"
            defaultValue={playerModel.club ?? ""}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button variant="contained" type="submit">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
